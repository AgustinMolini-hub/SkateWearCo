let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let cliente = localStorage.getItem("cliente") || "";

carrito.forEach(item => {
  if (!item.cantidad) item.cantidad = 1;
});

// Cargar productos desde JSON
fetch("js/productos.json")
  .then(res => res.json())
  .then(data => renderProductos(data));

function renderProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");
  if (!contenedor) return;

  productos.forEach(producto => {
    const div = document.createElement("div");
    div.className = "producto text-center";
    div.innerHTML = `
      <img src="../${producto.imagen}" alt="${producto.nombre}" />
      <p>$${producto.precio.toLocaleString("es-AR")}</p>
      <button class="btn btn-dark mt-1" onclick="agregarAlCarritoDesdeColeccion('${producto.nombre}', ${producto.precio})">
        Agregar al carrito
      </button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarritoDesdeColeccion(nombre, precio) {
  const productoExistente = carrito.find(item => item.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

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

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  mostrarMensaje(`Gracias ${cliente || "cliente"} por tu compra de $${total.toLocaleString("es-AR")}`);
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
      ${item.nombre} x${item.cantidad} unidades - $${(item.precio * item.cantidad).toLocaleString("es-AR")}
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

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  resumen.innerHTML = `
    <div class="alert alert-info mt-3">
      <h5>Resumen de compra</h5>
      <p>Cliente: <strong>${cliente || "Sin nombre"}</strong></p>
      <p>Total acumulado: <strong>$${total.toLocaleString("es-AR")}</strong></p>
      <div class="d-flex justify-content-center gap-2 mt-3">
        <button class="btn btn-success" onclick="finalizarCompra()">Finalizar compra</button>
        <button class="btn btn-secondary" onclick="vaciarCarrito()">Vaciar carrito</button>
      </div>
    </div>
  `;
}

function mostrarMensaje(texto) {
  Swal.fire({
    text: texto,
    icon: "success",
    timer: 2000,
    showConfirmButton: false
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("nombre-cliente");
  if (input && cliente) input.value = cliente;
});

renderCarrito();
renderResumen();