let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let cliente = localStorage.getItem("cliente") || "";

function agregarAlCarritoDesdeColeccion(nombre, precio) {
  const producto = { nombre, precio };
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  renderResumen();
  mostrarMensaje(`${nombre} agregado al carrito`);
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  renderResumen();
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
  renderResumen();
  mostrarMensaje("Carrito vaciado");
}

function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío");
    return;
  }
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);
  mostrarMensaje(`Gracias ${cliente || "cliente"} por tu compra de $${total}`);
  vaciarCarrito();
}

function guardarCliente() {
  const input = document.getElementById("nombre-cliente");
  cliente = input.value.trim();
  localStorage.setItem("cliente", cliente);
  renderResumen();
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  if (!lista) return;

  lista.innerHTML = "";
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${item.nombre} - $${item.precio}
      <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

function renderResumen() {
  const resumen = document.getElementById("resumen-compra");
  if (!resumen) return;

  if (carrito.length === 0) {
    resumen.innerHTML = "<p class='text-muted'>El carrito está vacío.</p>";
    return;
  }

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);
  resumen.innerHTML = `
    <div class="alert alert-info mt-3">
      <h5>Resumen de compra</h5>
      <p>Cliente: <strong>${cliente || "Sin nombre"}</strong></p>
      <p>Total acumulado: <strong>$${total}</strong></p>
      <div class="d-flex justify-content-center gap-2 mt-3">
        <button class="btn btn-success" onclick="finalizarCompra()">Finalizar compra</button>
        <button class="btn btn-secondary" onclick="vaciarCarrito()">Vaciar carrito</button>
      </div>
    </div>
  `;
}

function mostrarMensaje(texto) {
  const mensaje = document.createElement("div");
  mensaje.className = "alert alert-success text-center mt-3";
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("nombre-cliente");
  if (input && cliente) input.value = cliente;
});

renderCarrito();
renderResumen();