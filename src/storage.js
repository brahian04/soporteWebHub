const Store = require('electron-store');

// Configuración del almacenamiento
const store = new Store();

// Funciones para interactuar con el almacenamiento
const saveUserData = (key, value) => {
    store.set(key, value); // Guarda un dato
};

const getUserData = (key) => {
    return store.get(key); // Recupera un dato
};

const deleteUserData = (key) => {
    store.delete(key); // Elimina un dato
};

module.exports = { saveUserData, getUserData, deleteUserData };
