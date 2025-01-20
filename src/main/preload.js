const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  leerConfiguracion: () => ipcRenderer.invoke('leer-configuracion'),
  guardarConfiguracion: (nuevaConfig) => ipcRenderer.invoke('guardar-configuracion', nuevaConfig),
});