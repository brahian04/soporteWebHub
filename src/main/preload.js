const { contextBridge } = require('electron');
const XLSX = require('xlsx');

// Exponer XLSX al proceso Renderer
contextBridge.exposeInMainWorld('api', {
    readExcel: (fileBuffer) => {
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      return XLSX.utils.sheet_to_json(worksheet);
    },
  });