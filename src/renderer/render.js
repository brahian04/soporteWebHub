document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-button');
    const userNameElement = document.getElementById('user-name');
    const userName = localStorage.getItem('userName');

    userNameElement.textContent = userName;
      // Cerrar sesión
    if (logoutLink) {
      logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Cerrando sesión...');
        // Redirigir a la pantalla de inicio de sesión
        window.location.href = 'login.html';
      });
    }
});

// Toggle Dropdown Menu
const userMenuToggle = document.getElementById('userMenuToggle');
const userDropdown = document.getElementById('userDropdown');

userMenuToggle.addEventListener('click', () => {
  const isVisible = userDropdown.style.display === 'block';
  userDropdown.style.display = isVisible ? 'none' : 'block';
});

// Close Dropdown on Outside Click
window.addEventListener('click', (event) => {
  if (!userMenuToggle.contains(event.target) && !userDropdown.contains(event.target)) {
    userDropdown.style.display = 'none';
  }
});

// Open Edit Profile Modal
const editProfileBtn = document.getElementById('editProfileBtn');
const userModal = document.getElementById('userModal');
const closeModalBtn = document.querySelector('.close-btn');

editProfileBtn.addEventListener('click', () => {
  userModal.style.display = 'block';
  userDropdown.style.display = 'none'; // Close dropdown
});

closeModalBtn.addEventListener('click', () => {
  userModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === userModal) {
    userModal.style.display = 'none';
  }
});

// Handle Logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  // alert('Cerrando sesión...');
  // Redirigir al usuario a la pantalla de inicio de sesión
  window.location.href = 'login.html';
});