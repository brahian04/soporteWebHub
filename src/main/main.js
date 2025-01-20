const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const server = require('../server/server');
const { leerConfiguracion, guardarConfiguracion } = require('../utils/configManager');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Mostrar primero la pantalla de login
  mainWindow.loadFile(path.join(__dirname, '../renderer/login.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Eventos IPC para manejar configuración
ipcMain.handle('leer-configuracion', async () => {
  try {
    return leerConfiguracion();
  } catch (error) {
    console.error('Error al leer la configuración:', error);
    return null;
  }
});

ipcMain.handle('guardar-configuracion', async (event, nuevaConfig) => {
  try {
    return guardarConfiguracion(nuevaConfig);
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    return false;
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});