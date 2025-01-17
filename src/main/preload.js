const { contextBridge } = require('electron');
const fs = require('fs');
const XLSX = require('xlsx');

contextBridge.exposeInMainWorld('api', {
    readExcel: (filePath) => {
        try {
            // Leer el archivo como buffer
            const fileBuffer = fs.readFileSync(filePath);

            // Procesar el archivo con XLSX
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

            // Tomar la primera hoja
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convertir la hoja a JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            return jsonData;
        } catch (error) {
            console.error('Error leyendo el archivo Excel:', error);
            throw error;
        }
    },
});
