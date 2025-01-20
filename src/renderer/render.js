document.addEventListener('DOMContentLoaded', () => {
  // Mostrar nombre de usuario desde localStorage
  const userNameElement = document.getElementById('user-name');
  const userName = localStorage.getItem('userName');
  if (userName) userNameElement.textContent = userName;

  // Toggle del menú de usuario
  const userMenuToggle = document.getElementById('userMenuToggle');
  const userDropdown = document.getElementById('userDropdown');

  if (userMenuToggle && !userMenuToggle._isListenerAdded) {
    userMenuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      userDropdown.classList.toggle('visible');  // Usamos clases para manejar visibilidad
      console.log(userDropdown.classList.contains('visible') ? "display es: block" : "display es: none");
    });
    userMenuToggle._isListenerAdded = true;
  }
  // Cerrar el menú desplegable al hacer clic fuera
  window.addEventListener('click', (event) => {
    if (!userMenuToggle.contains(event.target) && !userDropdown.contains(event.target)) {
      userDropdown.classList.remove('visible');
    }
  });

  // Modal para editar perfil
  const editProfileBtn = document.getElementById('editProfileBtn');
  const userModal = document.getElementById('userModal');
  const closeModalBtn = document.querySelector('.close-btn');

  if (editProfileBtn && userModal && closeModalBtn) {
    editProfileBtn.addEventListener('click', () => {
      userModal.style.display = 'block';
      userDropdown.classList.remove('visible'); // Cierra el menú desplegable
    });

    closeModalBtn.addEventListener('click', () => {
      userModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === userModal) {
        userModal.style.display = 'none';
      }
    });
  }

  // Cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      console.log('Cerrando sesión...');
      window.location.href = 'login.html';
    });
  }

  //barra lateral
  const menuIcon = document.getElementById('menu-icon');
  const sidebar = document.getElementById('sidebar');
    // Abrir barra lateral
    menuIcon.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
      if(sidebar.classList.contains('open')){
        sidebar.classList.remove('open');
      }else{
        sidebar.classList.add('open');
      }
    });

    window.addEventListener('click', (event) => {
      if (!sidebar.contains(event.target) && event.target !== menuIcon) {
          sidebar.classList.remove('open');
      }
    });
  /////////////////////////////////////////////////////

  // Cambiar el contenido del área de trabajo
  const toolItems = document.querySelectorAll(".tool-item");
  const toolContent = document.getElementById("tool-content");

  const tools = {
    tool1: { title: "Reexpedir Facturas", content: ` 
      <main class="mainTool1"> 
        <h2 class="main-title">Datos factura</h2>
        <div class="form" id="factura-form"> <input type="number" min="0" id="cdunico" placeholder="cdunico" class="input"> <input type="number" min="1" placeholder="ramo" id="ramo" class="input"> <input type="number" min="1" placeholder="poliza" id="poliza" class="input"> <button id="search-button" class="button search-button" onclick="buscar()">BUSCAR</button> </div>
        <div id="status"></div>
        <div class="table-container" id="table-container">
          <table id="result-table">
            <thead>
              <tr id="table-header"></tr>
            </thead>
            <tbody id="table-body"></tbody>
          </table>
        </div>
        <div class="actions"> <button class="button" id="clear-table" onclick="clearTable()">Limpiar</button> <button class="button cancel-button" id="cancel-policy" onclick="cancelPolicy()">CANCELAR POLIZA</button> <button class="button emit-button" id= "emit-policy" onclick="emitPolicy()">EMITIR POLIZA</button> <button class="button receipt-button" id="emit-receipt" onclick="emitComplement()">EMITIR COMPLEMENTO</button></div> 
      </main> `
    },
    tool2: { title: "Reenvio de Documentos", content: `
      <main class="mainTool2">
        <h2 class="main-title">Cargar Archivo Excel</h2>
        <form id="upload-form" class="upload-form">
          <label for="excel-file" class="file-label">Selecciona un archivo Excel:</label>
          <input type="file" id="excel-file" class="file-input" accept=".xlsx, .xls">
          <button type="button" id="upload-button" class="button upload-button" onclick="handleFileUpload()">Cargar Archivo</button>
        </form>
        <div id="upload-status" class="upload-status"></div>
        <div class="table-container" id="excel-table-container">
          <table id="excel-result-table">
            <thead>
              <tr id="excel-table-header"></tr>
            </thead>
            <tbody id="excel-table-body"></tbody>
          </table>
        </div>
      </main>
    `
    },
    tool3: { title: "Monitor de Sesiones", content: `
      <!-- Botones de acción -->
      <div class="button-container">
        <button id="validate-sessions" onclick="monitor()">Validar Sesiones</button>
      </div>

      <!-- Contenedor de estado -->
      <div id="status"></div>

      <!-- Contenedor de totales -->
      <div id="totals-container">
        <h3 class="hidden">Totales de Sesiones</h3>
        <div id="totals-table"></div>
      </div>

      <!-- Contenedor para las tablas -->
      <div id="results-container">
        <div id="active-results">
          <h3 class="hidden">Sesiones Activas</h3>
          <div id="active-table"></div>
        </div>
        <div id="inactive-results">
          <h3 class="hidden">Sesiones Inactivas</h3>
          <div id="inactive-table"></div>
        </div>
      </div>
      `
    },
    tool4: { title: "Herramienta 4", content: "Contenido inicial para Herramienta 4." },
    tool5: { title: "Herramienta 5", content: "Contenido inicial para Herramienta 5." },
  };

  toolItems.forEach((item) => {
    item.addEventListener("click", () => {
      toolItems.forEach((tool) => tool.classList.remove("active"));
      item.classList.add("active");
      const selectedTool = item.dataset.tool;
      const toolData = tools[selectedTool];
      toolContent.innerHTML = `<h1>${toolData.title}</h1><p>${toolData.content}</p>`;
    });
  });

  // Tools/////////////////

});

function buscar() {
  const cdunico = document.getElementById("cdunico").value; 
  const ramo = document.getElementById("ramo").value; 
  const poliza = document.getElementById("poliza").value; 

  if(cdunico !== "" && ramo !== "" && poliza !== ""){
    document.getElementById('status').innerText = 'Consultando...';
    fetch("http://localhost:3200/buscar", {
    method: "POST", 
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ cdunico, ramo, poliza }), })
    .then(response => response.json())
    .then(data => {
      if (!data || Object.keys(data).length === 0 || (Array.isArray(data) && data.length === 0)) {
        document.getElementById('status').innerText = 'No se encontraron registros, validar si no es una factura excluida.';
        document.getElementById('table-header').innerHTML = '';
        document.getElementById('table-body').innerHTML = '';
        // console.log(data);
      } else {
        populateTable(data);
        document.getElementById('status').innerText = 'Consulta completada';
        // console.log(data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('status').innerText = 'Ocurrió un error al buscar registros';
    });
  }else{
    document.getElementById('status').innerText = 'Favor de completar los datos de factura.';
  }
}

function populateTable(data) {
  const tableHeader = document.getElementById('table-header');
  const tableBody = document.getElementById('table-body');

  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  if (data.length > 0) {
    const headers = [
      'CDMOVTO', 'CDUNIECO', 'CDRAMO', 'NMPOLIZA', 'NMRECIBO',
      'TIPO', 'ESTADO', 'UUID', 'RFC', 'FECHA',
      'FECHA_CANCELACION', 'CDCONSOLIDA',
    ];

    const checkboxHeader = document.createElement('th');
    checkboxHeader.textContent = 'Seleccionar';
    tableHeader.appendChild(checkboxHeader);

    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      tableHeader.appendChild(th);
    });

    data.forEach(row => {
      const tr = document.createElement('tr');

      const checkboxCell = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'row-checkbox';
      checkbox.value = JSON.stringify(row);
      checkboxCell.appendChild(checkbox);
      tr.appendChild(checkboxCell);

      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = row[header] || '';
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  } else {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = 'No hay datos disponibles.';
    td.colSpan = 13;
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }
}

function clearTable() {
  document.getElementById('table-header').innerHTML = '';
  document.getElementById('table-body').innerHTML = '';
  const inputs = document.querySelectorAll('.input');
  inputs.forEach(input => {
    input.value = '';
  })
  // console.log("borrado de tabla");
}

// Cancelar póliza
   async function cancelPolicy(){
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const uuids = Array.from(selectedCheckboxes)
      .map(checkbox => JSON.parse(checkbox.value).UUID)
      .filter(uuid => uuid);

    if (uuids.length === 0) {
      document.getElementById('status').innerText = 'No se seleccionó ninguna fila con UUID.';
      return;
    }

    console.log('UUIDs a cancelar:', uuids);

    // try {
    //   const response = await fetch('http://facturaservices.internal.apps.oly2x0pz.eastus.aroapp.io/FacturaServices/api/factura/comprobante/cancelacion/uuid', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(uuids),
    //   });

    //   const result = await response.json();

    //   if (response.ok) {
    //     document.getElementById('status').innerText = `Cancelación completada: ${JSON.stringify(result)}`;
    //   } else {
    //     document.getElementById('status').innerText = `Error: ${JSON.stringify(result)}`;
    //   }
    // } catch (error) {
    //   document.getElementById('status').innerText = 'Error al cancelar pólizas.';
    //   console.error(error);
    // }
  };

// Emitir póliza
  async function emitPolicy(){
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const policies = Array.from(selectedCheckboxes)
      .map(checkbox => {
        const row = JSON.parse(checkbox.value);
        return {
          cdunieco: row.CDUNIECO,
          cdramo: row.CDRAMO,
          nmpoliza: row.NMPOLIZA,
          nmrecibo: row.NMRECIBO,
        };
      })
      .filter(policy => policy.cdunieco && policy.cdramo && policy.nmpoliza && policy.nmrecibo);

    if (policies.length === 0) {
      document.getElementById('status').innerText = 'No se seleccionó ninguna fila válida para emitir póliza.';
      return;
    }

    for (const policy of policies) {
      const url = `http://facturaservices.internal.apps.oly2x0pz.eastus.aroapp.io/FacturaServices/api/factura/comprobante/ingreso/${policy.cdunieco}/${policy.cdramo}/${policy.nmpoliza}/${policy.nmrecibo}/0`;
      console.log(url);
      try {
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          const result = await response.json();
          console.log(`Póliza emitida para: ${JSON.stringify(policy)}`, result);
          document.getElementById('status').innerText = `Póliza emitida: ${JSON.stringify(policy)}.`;
        } else {
          const errorResult = await response.json();
          console.error(`Error al emitir póliza para: ${JSON.stringify(policy)}`, errorResult);
          document.getElementById('status').innerText = `Error al emitir póliza: ${JSON.stringify(policy)}.`;
        }
      } catch (error) {
        console.error(`Error en la solicitud para: ${JSON.stringify(policy)}`, error);
        document.getElementById('status').innerText = `Error en la solicitud para: ${JSON.stringify(policy)}.`;
      }
    }
  };
  
// Emitir complemento
  async function emitComplement() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const receipts = Array.from(selectedCheckboxes)
      .map(checkbox => {
        const row = JSON.parse(checkbox.value);
        return {
          cdunieco: row.CDUNIECO,
          cdramo: row.CDRAMO,
          nmpoliza: row.NMPOLIZA,
          nmrecibo: row.NMRECIBO,
        };
      })
      .filter(receipt => receipt.cdunieco && receipt.cdramo && receipt.nmpoliza && receipt.nmrecibo);

    if (receipts.length === 0) {
      document.getElementById('status').innerText = 'No se seleccionó ninguna fila válida para emitir recibo.';
      return;
    }

    for (const receipt of receipts) {
      const url = `http://facturaservices.internal.apps.oly2x0pz.eastus.aroapp.io/FacturaServices/api/factura/comprobante/complemento/${receipt.cdunieco}/${receipt.cdramo}/${receipt.nmpoliza}/${receipt.nmrecibo}`;

      try {
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
          const result = await response.json();
          console.log(`Recibo emitido para: ${JSON.stringify(receipt)}`, result);
          document.getElementById('status').innerText = `Recibo emitido: ${JSON.stringify(receipt)}.`;
        } else {
          const errorResult = await response.json();
          console.error(`Error al emitir recibo para: ${JSON.stringify(receipt)}`, errorResult);
          document.getElementById('status').innerText = `Error al emitir recibo: ${JSON.stringify(receipt)}.`;
        }
      } catch (error) {
        console.error(`Error en la solicitud para: ${JSON.stringify(receipt)}`, error);
        document.getElementById('status').innerText = `Error en la solicitud para: ${JSON.stringify(receipt)}.`;
      }
    }
  };

// reenvio de documento
// function displayExcelData(data) {
//   const tableHeader = document.getElementById("excel-table-header");
//   const tableBody = document.getElementById("excel-table-body");

//   // Limpiar tabla
//   tableHeader.innerHTML = "";
//   tableBody.innerHTML = "";

//   if (data.length === 0) {
//     document.getElementById("upload-status").innerText = "El archivo está vacío.";
//     return;
//   }

//   // Crear encabezados
//   const headers = Object.keys(data[0]);
//   headers.forEach((header) => {
//     const th = document.createElement("th");
//     th.textContent = header;
//     tableHeader.appendChild(th);
//   });

//   // Crear filas
//   data.forEach((row) => {
//     const tr = document.createElement("tr");
//     headers.forEach((header) => {
//       const td = document.createElement("td");
//       td.textContent = row[header] || "";
//       tr.appendChild(td);
//     });
//     tableBody.appendChild(tr);
//   });

//   document.getElementById("upload-status").innerText = "Archivo cargado exitosamente.";
// }
  // function handleFileUpload() {
  //   const fileInput = document.getElementById("excel-file");
  //   const file = fileInput.files[0];
  //   if (!file) {
  //     document.getElementById("upload-status").innerText = "Por favor, selecciona un archivo.";
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     const data = new Uint8Array(event.target.result);
  //     const workbook = XLSX.read(data, { type: "array" });

  //     // Leer la primera hoja
  //     const firstSheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[firstSheetName];

  //     // Convertir los datos de la hoja a JSON
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //     // Mostrar los datos en la tabla
  //     displayExcelData(jsonData);
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

// MONITOREO DE SESIONES
  async function monitor() {
    const statusDiv = document.getElementById('status');
    const totalsTableDiv = document.getElementById('totals-table');
    const activeTableDiv = document.getElementById('active-table');
    const inactiveTableDiv = document.getElementById('inactive-table');
    const totalsContainer = document.getElementById('totals-container');
    const activeResultsDiv = document.getElementById('active-results');
    const inactiveResultsDiv = document.getElementById('inactive-results');

    statusDiv.innerText = 'Validando sesiones...';
    totalsTableDiv.innerHTML = '';
    activeTableDiv.innerHTML = '';
    inactiveTableDiv.innerHTML = '';

    // Ocultar encabezados inicialmente
    totalsContainer.querySelector('h3').classList.add('hidden');
    activeResultsDiv.querySelector('h3').classList.add('hidden');
    inactiveResultsDiv.querySelector('h3').classList.add('hidden');

    try {
      // Asegúrate de esperar la respuesta de fetch con await
      const response = await fetch("http://localhost:3200/monitor");
      console.log("Respuesta recibida:", response.status);
      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        statusDiv.innerText = "Error al conectar con el servidor.";
        console.error(`Error: ${response.statusText}`);
        return;
      }
    
      // Parsea la respuesta a JSON
      const result = await response.json();
    
      // console.log(result);
      statusDiv.innerText = "Sesiones validadas correctamente.";
    
      // Crear tabla de totales
      const totalsData = [
        ["Activas", result.active],
        ["Inactivas", result.inactive],
      ];
      const totalsTable = createTable(totalsData, ["Estado", "Total"]);
      totalsTableDiv.appendChild(totalsTable);
      totalsContainer.querySelector("h3").classList.remove("hidden"); // Mostrar encabezado
    
      // Crear tabla para sesiones activas si hay datos
      if (result.activeDetails.length > 0) {
        const activeTable = createTable(result.activeDetails, ["USERNAME", "MACHINE", "STATUS", "TOTAL"]);
        activeTableDiv.appendChild(activeTable);
    
        // Calcular suma de la columna "TOTAL"
        const activeTotalSum = calculateColumnSum(result.activeDetails, 3); // Columna 3 es "TOTAL"
        const activeSumDiv = document.createElement("div");
        activeSumDiv.classList.add("total-sum");
        activeSumDiv.innerText = `Suma Total: ${activeTotalSum}`;
        activeTableDiv.appendChild(activeSumDiv);
    
        activeResultsDiv.querySelector("h3").classList.remove("hidden"); // Mostrar encabezado
      } else {
        activeTableDiv.innerHTML = "<p>No hay detalles para sesiones activas.</p>";
      }
    
      // Crear tabla para sesiones inactivas si hay datos
      if (result.inactiveDetails.length > 0) {
        const inactiveTable = createTable(result.inactiveDetails, ["USERNAME", "MACHINE", "STATUS", "TOTAL"]);
        inactiveTableDiv.appendChild(inactiveTable);
    
        // Calcular suma de la columna "TOTAL"
        const inactiveTotalSum = calculateColumnSum(result.inactiveDetails, 3); // Columna 3 es "TOTAL"
        const inactiveSumDiv = document.createElement("div");
        inactiveSumDiv.classList.add("total-sum");
        inactiveSumDiv.innerText = `Suma Total: ${inactiveTotalSum}`;
        inactiveTableDiv.appendChild(inactiveSumDiv);
    
        inactiveResultsDiv.querySelector("h3").classList.remove("hidden"); // Mostrar encabezado
      } else {
        inactiveTableDiv.innerHTML = "<p>No hay detalles para sesiones inactivas.</p>";
      }
    } catch (error) {
      // Manejo de errores si fetch falla
      statusDiv.innerText = "Error al conectar con el servidor.";
      console.error("Error:", error);
    }    
  };

  // Crear una tabla dinámica
  function createTable(data, headers) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Crear encabezados
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Crear filas
    data.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  // Función para calcular la suma de una columna específica
  function calculateColumnSum(data, columnIndex) {
    return data.reduce((sum, row) => sum + parseInt(row[columnIndex] || 0, 10), 0);
  }