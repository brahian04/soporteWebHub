document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerModal = document.getElementById("registerModal");
    const openRegisterModal = document.getElementById("openRegisterModal");
    const closeBtn = registerModal.querySelector(".close-btn");
    const errorDiv = document.getElementById('error-message');
  
    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        // Simulación de validación
        if (username === 'admin' && password === '1234') {
          console.log('Inicio de sesión exitoso');
          localStorage.setItem('userName', username);
          // Cambiar a la ventana principal
          window.location.href = 'index.html';
        } else {
          errorDiv.textContent = 'Credenciales inválidas';
          errorDiv.style.display = 'block';
        }
      });
    }

    openRegisterModal.addEventListener("click", (e) => {
      e.preventDefault();
      registerModal.style.display = "flex";
    });
  
    closeBtn.addEventListener("click", () => {
      registerModal.style.display = "none";
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === registerModal) {
        registerModal.style.display = "none";
      }
    });
});  