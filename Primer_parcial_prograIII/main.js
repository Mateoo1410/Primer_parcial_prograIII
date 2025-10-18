let personas = [];
let personaEditando = null;
let modoActual = ""; // "Alta", "Modificación", "Eliminación"

// Al cargar
document.addEventListener("DOMContentLoaded", () => {
  inicializar();
});

function inicializar() {
  document.getElementById("btnAgregar").addEventListener("click", mostrarFormularioAlta);
  document.getElementById("btnAceptar").addEventListener("click", aceptarFormulario);
  document.getElementById("btnCancelar").addEventListener("click", cancelarFormulario);
  cargarPersonas();
  actualizarTabla();
}

// Carga inicial simulada
function cargarPersonas() {
  personas = [
    new Ciudadano(1, "Juan", "Pérez", "1990-05-10", 12345678),
    new Extranjero(2, "Marie", "Dubois", "1985-08-22", "Francia")
  ];
}

// Renderiza tabla
function actualizarTabla() {
  const tbody = document.getElementById("tbodyPersonas");
  tbody.innerHTML = "";

  personas.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.apellido}</td>
      <td>${p.fechaNacimiento}</td>
      <td>${p instanceof Ciudadano ? p.dni : "N/A"}</td>
      <td>${p instanceof Extranjero ? p.paisOrigen : "N/A"}</td>
      <td>
        <button onclick="modificarPersona(${p.id})">Modificar</button>
        <button onclick="eliminarPersona(${p.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// === FORMULARIO ABM ===
function mostrarFormularioAlta() {
  limpiarFormulario();
  document.querySelectorAll("#formAbm input").forEach(i => i.disabled = false);
  document.getElementById("txtId").value = generarId();
  document.getElementById("txtId").disabled = true;
  document.getElementById("tituloAbm").textContent = "Alta de Persona";
  document.getElementById("formLista").style.display = "none";
  document.getElementById("formAbm").style.display = "block";
  modoActual = "Alta";
}

function mostrarFormularioModificar(p) {
  limpiarFormulario();
  document.querySelectorAll("#formAbm input").forEach(i => i.disabled = false);
  document.getElementById("txtId").value = p.id;
  document.getElementById("txtNombre").value = p.nombre;
  document.getElementById("txtApellido").value = p.apellido;
  document.getElementById("txtFechaNacimiento").value = p.fechaNacimiento;

  if (p instanceof Ciudadano) {
    document.getElementById("selTipo").value = "ciudadano";
    document.getElementById("txtDni").value = p.dni;
    document.getElementById("txtPaisOrigen").value = "";
  } else {
    document.getElementById("selTipo").value = "extranjero";
    document.getElementById("txtDni").value = "";
    document.getElementById("txtPaisOrigen").value = p.paisOrigen;
  }

  document.getElementById("txtId").disabled = true;
  document.getElementById("tituloAbm").textContent = "Modificación de Persona";
  document.getElementById("formLista").style.display = "none";
  document.getElementById("formAbm").style.display = "block";
  modoActual = "Modificación";
  personaEditando = p;
}

function aceptarFormulario() {
  const id = parseInt(document.getElementById("txtId").value);
  const nombre = document.getElementById("txtNombre").value.trim();
  const apellido = document.getElementById("txtApellido").value.trim();
  const fecha = document.getElementById("txtFechaNacimiento").value;
  const tipo = document.getElementById("selTipo").value;
  const dni = parseInt(document.getElementById("txtDni").value);
  const pais = document.getElementById("txtPaisOrigen").value.trim();

  if (!nombre || !apellido || !fecha) {
    alert("Debe completar todos los campos obligatorios.");
    return;
  }

  if (modoActual === "Alta") {
    let nueva;
    if (tipo === "ciudadano") {
      nueva = new Ciudadano(id, nombre, apellido, fecha, dni);
    } else {
      nueva = new Extranjero(id, nombre, apellido, fecha, pais);
    }
    personas.push(nueva);
  } else if (modoActual === "Modificación") {
    personaEditando.nombre = nombre;
    personaEditando.apellido = apellido;
    personaEditando.fechaNacimiento = fecha;
    if (personaEditando instanceof Ciudadano) {
      personaEditando.dni = dni;
    } else {
      personaEditando.paisOrigen = pais;
    }
  }

  actualizarTabla();
  mostrarFormularioLista();
}

function cancelarFormulario() {
  mostrarFormularioLista();
}

function mostrarFormularioLista() {
  document.getElementById("formAbm").style.display = "none";
  document.getElementById("formLista").style.display = "block";
  document.getElementById("txtId").disabled = false;
  personaEditando = null;
  modoActual = "";
}

function limpiarFormulario() {
  document.getElementById("formulario").reset();
}

function modificarPersona(id) {
  const p = personas.find(per => per.id === id);
  mostrarFormularioModificar(p);
}

function eliminarPersona(id) {
  if (confirm("¿Desea eliminar esta persona?")) {
    personas = personas.filter(p => p.id !== id);
    actualizarTabla();
  }
}

function generarId() {
  // Genera ID incremental simple
  return personas.length ? Math.max(...personas.map(p => p.id)) + 1 : 1;
}
