const express = require("express");
const bodyParser = require("body-parser");
const oracledb = require("oracledb");
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '../utils/config.json');

// Verificar si el archivo existe
if (!fs.existsSync(configPath)) {
    // Crear el archivo con valores predeterminados si no existe
    const defaultConfig = {
      usuario: '',
      contraseña: '',
      usuarioBD: '',
      contraseñaBD: ''
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    console.log('Archivo config.json creado con valores predeterminados.');
}

const config = require(path.join(__dirname, '../utils/config.json'));

const app = express();
const port = 3200;

oracledb.initOracleClient({libDir: "C:/oracle/instantclient_23_6"});

app.use(bodyParser.json());

// Configuración de la base de datos
const dbConfig = {
  user: config.usuarioBD,
  password: config.contraseñaBD,
  connectString: "10.142.64.101:1526/ALEAP11G"
};

app.post("/buscar", async (req, res) => {
  const { cdunico, ramo, poliza } = req.body;
  const connection = await oracledb.getConnection(dbConfig);
  try {
    if(connection){
      console.log('conexion iniciada');
    }
    const result = await connection.execute(
        `SELECT A.CDMOVTO, A.CDUNIECO, A.CDRAMO, A.NMPOLIZA, A.NMRECIBO,
        A.TIPO, B.ID_COMPROBANTE, C.ESTADO, C.UUID, D.RFC, C.CFDI, C.FECHA,
        C.FECHA_CANCELACION, B.CDCONSOLIDA
        FROM CFDI_BIT_POLIZA A, OPERACION B, CFDI_COMPROBANTE C, CFDI_RECEPTOR D
        WHERE 1 = 1
        AND A.CDUNIECO = :cdunico
        AND A.CDRAMO = :ramo
        AND A.NMPOLIZA = :poliza
        AND B.CDMOVTO = A.CDMOVTO
        AND C.ID_COMPROBANTE = B.ID_COMPROBANTE
        AND D.ID_COMPROBANTE = C.ID_COMPROBANTE
        ORDER BY A.CDMOVTO DESC`,
      { cdunico, ramo, poliza }
    );
    // const result = await connection.execute(
    //     `SELECT * FROM TUSUARIO WHERE CDUSUARI = 'MXJRUEDACA'`
    // );
    const formattedRows = result.rows.map(row =>
      result.metaData.reduce((acc, meta, index) => {
        acc[meta.name] = row[index];
        return acc;
      }, {})
    );
    res.json(formattedRows);
    // res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al realizar la consulta");
  }finally{
    await connection.close();
    console.log('conexion terminada');
  }
});

app.get("/monitor", async (req, res) =>{
  const connection = await oracledb.getConnection(dbConfig);
  const activeSessionsQuery = `
    SELECT count(*) as total
    FROM v$session
    WHERE username IS NOT NULL AND status = 'ACTIVE'
  `;
  const inactiveSessionsQuery = `
    SELECT count(*) as total
    FROM v$session
    WHERE username IS NOT NULL AND status = 'INACTIVE'
  `;
  const activeDetailsQuery = `
    SELECT * FROM (
      SELECT username, machine, status, count(*) as total
      FROM v$session
      WHERE username IS NOT NULL AND status = 'ACTIVE'
      GROUP BY username, machine, status
      ORDER BY total DESC
    ) WHERE ROWNUM <= 10
  `;
  const inactiveDetailsQuery = `
    SELECT * FROM (
      SELECT username, machine, status, count(*) as total
      FROM v$session
      WHERE username IS NOT NULL AND status = 'INACTIVE'
      GROUP BY username, machine, status
      ORDER BY total DESC
    ) WHERE ROWNUM <= 10
  `;
  try {
    if(connection){
      console.log('conexion iniciada');
    }

    const activeSessions = await connection.execute(activeSessionsQuery);
    const activeCount = activeSessions.rows.length > 0 ? activeSessions.rows[0][0] : 0;
    const inactiveSessions = await connection.execute(inactiveSessionsQuery);
    const inactiveCount = inactiveSessions.rows.length > 0 ? inactiveSessions.rows[0][0] : 0;
    const activeDetails = await connection.execute(activeDetailsQuery);
    const inactiveDetails = await connection.execute(inactiveDetailsQuery);

    // console.log("activeSessions: ", activeCount);
    // console.log("inactiveSessions: ", inactiveCount);
    // console.log("activeDetails: ", activeDetails);
    // console.log("inactiveDetails: ", inactiveDetails);

    res.json({
      active: activeCount,
      inactive: inactiveCount,
      activeDetails: activeDetails.rows,
      inactiveDetails: inactiveDetails.rows,
    });
  }catch (error) {
    console.error('Error validando sesiones:', error);
    res.status(500).send('Error validando sesiones:', error);
  }finally{
    await connection.close();
    console.log('conexion terminada');
  }
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
