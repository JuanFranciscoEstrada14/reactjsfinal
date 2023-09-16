async function cargarBotinesDesdeJSON() {
  try {
    const response = await fetch('botines.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
    return [];
  }
}

const marcasMenu = document.getElementById('marcas-menu');
const inicioBtn = document.getElementById('inicio-btn');
const botinesContainer = document.getElementById('botines-container');
const carritoLista = document.getElementById('carrito-lista');
const carritoTotal = document.getElementById('carrito-total');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

let carrito = [];

if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  actualizarCarrito();
}

async function mostrarBotinesDisponibles(botines = null) {
  const botinesMostrar = botines ? botines : await cargarBotinesDesdeJSON();
  botinesContainer.innerHTML = '';
  botinesMostrar.forEach(botin => {
    const botinElement = document.createElement('div');
    botinElement.className = 'botin-image';
    botinElement.innerHTML = `
      <img src="img/${botin.imagen}" alt="${botin.nombre}">
      <h3>${botin.nombre}</h3>
      <p>Marca: ${botin.marca}</p>
      <p>Precio: $${botin.precio}</p>
      <button onclick="agregarAlCarrito(${botin.id})">Agregar al Carrito</button>
    `;
    botinesContainer.appendChild(botinElement);
  });
  actualizarCarrito();
}

async function agregarAlCarrito(botinId) {
  const botines = await cargarBotinesDesdeJSON();
  const botinSeleccionado = botines.find(botin => botin.id === botinId);
  carrito.push(botinSeleccionado);
  actualizarCarrito();
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarrito() {
  carritoLista.innerHTML = '';
  let total = 0;
  carrito.forEach(botin => {
    const carritoItem = document.createElement('li');
    carritoItem.innerHTML = `
      <img src="img/${botin.imagen}" alt="${botin.nombre}" class="carrito-item-image">
      <span class="carrito-item-nombre">${botin.nombre}</span>
      <span class="carrito-item-precio">$${botin.precio}</span>
      <button onclick="eliminarDelCarrito(${botin.id})">Eliminar</button>
    `;
    carritoLista.appendChild(carritoItem);
    total += botin.precio;
  });
  carritoTotal.innerText = total;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function eliminarDelCarrito(botinId) {
  carrito = carrito.filter(botin => botin.id !== botinId);
  actualizarCarrito();
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
  localStorage.removeItem('carrito');
}

const comprarBtn = document.getElementById('comprar-btn');
comprarBtn.addEventListener('click', comprar);

function volverAlInicio() {
  marcasMenu.querySelectorAll('li').forEach(item => item.classList.remove('active'));
  botinesContainer.innerHTML = '';
  mostrarBotinesDisponibles();
}

inicioBtn.addEventListener('click', volverAlInicio);

marcasMenu.querySelectorAll('li').forEach(item => {
  item.addEventListener('click', () => {
    const marcaSeleccionada = item.dataset.marca;
    filtrarPorMarca(marcaSeleccionada);
    marcasMenu.querySelectorAll('li').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

async function filtrarPorMarca(marca) {
  const botines = await cargarBotinesDesdeJSON();
  const botinesFiltrados = botines.filter(botin => botin.marca === marca);
  mostrarBotinesDisponibles(botinesFiltrados);
}

mostrarBotinesDisponibles();
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
