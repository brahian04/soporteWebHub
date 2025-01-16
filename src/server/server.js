const express = require("express");
const bodyParser = require("body-parser");
const oracledb = require("oracledb");

const app = express();
const port = 3200;

oracledb.initOracleClient({libDir: "C:/oracle/instantclient_23_6"});

app.use(bodyParser.json());

// Configuración de la base de datos
const dbConfig = {
  user: "OPS$BDIAZLLA",
  password: "Fv7apSz%YWQV",
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

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
