const loginForm = document.getElementById('loginForm');
const mensajeError = document.getElementById('mensajeError');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // CAMBIO: Usamos ruta relativa /api/auth/login
        const respuesta = await fetch('https://avance-proyecto-tam.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();

       if (datos.exito) {
           localStorage.setItem('token', datos.token);
           alert(datos.mensaje);
            // CAMBIO: Aseguramos la ruta al dashboard
           window.location.href = 'dashboard.html'; 
        } else {
            mensajeError.textContent = datos.mensaje;
        }
    } catch (error) {
        mensajeError.textContent = "Error al conectar con el servidor.";
    }
});