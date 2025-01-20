document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('loginForm');
  const registerModal = document.getElementById('registerModal');
  const openRegisterModal = document.getElementById('openRegisterModal');
  const closeBtn = registerModal.querySelector('.close-btn');
  const errorDiv = document.getElementById('error-message');
  const errorDiv2 = document.getElementById('error-message2');
  const registerForm = document.getElementById('registerForm');

  // Leer credenciales guardadas al cargar la página
  let config = await window.api.leerConfiguracion();
  if (config) {
      document.getElementById('username').value = config.usuario || '';
      // console.log("usuario: ", config.usuario);
      // console.log("contraseña: ", config.contraseña);
  }

  // Manejo del formulario de inicio de sesión
  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          config = await window.api.leerConfiguracion();
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          // Validación de credenciales
          if (config && username === config.usuario && password === config.contraseña) {
              console.log('Inicio de sesión exitoso');
              localStorage.setItem('userName', username);

              // Redirigir a la ventana principal
              window.location.href = 'index.html';
          } else {
              errorDiv.textContent = 'Credenciales inválidas';
              errorDiv.style.display = 'block';
          }
      });
  }

  // Mostrar el modal de registro
  openRegisterModal.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.style.display = 'flex';
  });

  // Cerrar el modal de registro
  closeBtn.addEventListener('click', () => {
      registerModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
      if (e.target === registerModal) {
          registerModal.style.display = 'none';
      }
  });

  // Manejo del formulario de registro
  registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const regUsername = document.getElementById('regUsername').value;
      const regPassword = document.getElementById('regPassword').value;
      const usernameBdProd = document.getElementById('usernameBdProd').value;
      const passBdProd = document.getElementById('passBdProd').value;

      if(config.usuario === regUsername){
        errorDiv2.textContent = 'Usuario ya registrado';
        errorDiv2.style.display = 'block';
      }else{
              // Guardar nuevas credenciales
        const resultado = await window.api.guardarConfiguracion({
          usuario: regUsername,
          contraseña: regPassword,
          usuarioBD: usernameBdProd,
          contraseñaBD: passBdProd,
        });

        if (resultado) {
            // alert('Usuario registrado correctamente.');
            console.log("Usuario registrado correctamente.");
            registerModal.style.display = 'none';

            // Actualizar los campos del formulario de login con las nuevas credenciales
            document.getElementById('username').value = regUsername;
            // document.getElementById('password').value = regPassword;
        } else {
            // alert('Error al registrar usuario.');
            console.log("Error al registrar usuario.");
        }
      }
  });
});