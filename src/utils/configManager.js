const fs = require('fs');
const path = require('path');

// Ruta del archivo de configuración
const configPath = path.join(__dirname, 'config.json');

// Verifica si el archivo existe, si no, lo crea con valores predeterminados
if (!fs.existsSync(configPath)) {
    const defaultConfig = {
        usuario: '',
        contraseña: '',
        usuarioBD: '',
        contraseñaBD: ''
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
}

// Función para leer la configuración
function leerConfiguracion() {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo el archivo de configuración:', error);
        return null;
    }
}

// Función para guardar o actualizar la configuración
function guardarConfiguracion(nuevaConfig) {
    try {
        const configActual = leerConfiguracion();
        const configActualizada = { ...configActual, ...nuevaConfig };
        fs.writeFileSync(configPath, JSON.stringify(configActualizada, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error guardando la configuración:', error);
        return false;
    }
}

module.exports = {
    leerConfiguracion,
    guardarConfiguracion
};
