const { app, BrowserWindow } = require('electron');
const path = require('path');
const server = require('../server/server');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
    },
  });

  // Mostrar primero la pantalla de login
  mainWindow.loadFile(path.join(__dirname, '../renderer/login.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

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