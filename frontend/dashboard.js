// 1. Verificación inmediata de seguridad
const token = localStorage.getItem('token');
let editandoID = null; 

if (!token) {
    window.location.href = 'index.html';
}

// 2. Función para cargar los movimientos desde la API
async function cargarMovimientos() {
    try {
        const res = await fetch('/api/movimientos', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 401 || res.status === 403) {
            cerrarSesion();
            return;
        }

        const result = await res.json();
        const movimientos = result.data || result;
        const tbody = document.querySelector('#tablaMovimientos tbody');
        
        if (!tbody) return; 

        tbody.innerHTML = ''; 
        
        movimientos.forEach(mov => {
            const fila = document.createElement('tr');
            // MEJORA VISUAL: Se usa un contenedor div para que los iconos no se amontonen
            fila.innerHTML = `
                <td>${mov.unidad_tracto || 'N/A'}</td>
                <td>${mov.chofer_nombre || 'N/A'}</td>
                <td><strong>${mov.ubicacion_actual || 'N/A'}</strong></td>
                <td>${mov.fecha_registro ? new Date(mov.fecha_registro).toLocaleString() : '---'}</td>
                <td>
                    <div style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                        <button type="button" onclick="prepararEdicion(${mov.id}, '${mov.unidad_tracto}', '${mov.placa_plana}', '${mov.chofer_nombre}', '${mov.ubicacion_actual}', '${mov.observaciones}')" style="cursor:pointer; background:none; border:none; font-size:1.2rem;" title="Editar">✏️</button>
                        
                        <button type="button" onclick="borrarRegistro(${mov.id})" style="cursor:pointer; background:none; border:none; font-size:1.2rem;" title="Eliminar">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// --- FUNCIÓN: Borrar registro (CORREGIDA) ---
async function borrarRegistro(id) {
    if (!id) {
        alert("Error: El registro no tiene un ID válido.");
        return;
    }

    if (confirm("¿Estás segura de eliminar este registro de la logística de Tamsa?")) {
        try {
            // Se asegura que la URL sea absoluta desde la raíz
            const res = await fetch(`/api/movimientos/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            if (res.ok && data.exito) {
                cargarMovimientos(); 
            } else {
                alert("Error del servidor: " + (data.mensaje || "No se pudo eliminar"));
            }
        } catch (error) {
            console.error("Error detallado:", error);
            alert("Error de conexión: Asegúrate de que el servidor Node.js esté corriendo.");
        }
    }
}

// --- FUNCIÓN: Preparar edición ---
function prepararEdicion(id, unidad, plana, chofer, ubicacion, obs) {
    editandoID = id; 
    document.getElementById('unidad').value = unidad;
    document.getElementById('plana').value = plana;
    document.getElementById('chofer').value = chofer;
    document.getElementById('ubicacion').value = ubicacion;
    document.getElementById('observaciones').value = obs;
    
    const btnGuardar = document.querySelector('#movimientoForm button[type="submit"]');
    btnGuardar.textContent = "Actualizar Movimiento";
    btnGuardar.style.backgroundColor = "#ffc107"; 
}

// 3. Manejo del Formulario
document.getElementById('movimientoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        unidad_tracto: document.getElementById('unidad').value,
        placa_plana: document.getElementById('plana').value,
        chofer_nombre: document.getElementById('chofer').value,
        ubicacion_actual: document.getElementById('ubicacion').value,
        observaciones: document.getElementById('observaciones').value
    };

    const metodo = editandoID ? 'PUT' : 'POST';
    const url = editandoID ? `/api/movimientos/${editandoID}` : '/api/movimientos';

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(datos)
        });

        if (res.ok) {
            alert(editandoID ? "Registro actualizado" : "Registro guardado");
            editandoID = null;
            const btnGuardar = document.querySelector('#movimientoForm button[type="submit"]');
            btnGuardar.textContent = "Guardar Registro";
            btnGuardar.style.backgroundColor = ""; 
            e.target.reset(); 
            cargarMovimientos(); 
        }
    } catch (error) {
        alert("Error al procesar el formulario.");
    }
});

function cerrarSesion() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

document.getElementById('btnCerrarSesion').onclick = (e) => {
    e.preventDefault();
    cerrarSesion();
};

document.addEventListener('DOMContentLoaded', () => {
    cargarMovimientos();
});