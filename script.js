// INICIO
document.addEventListener('DOMContentLoaded', () => {
  cargarMercado();
  cargarEnemigos();
});

// DATOS DEL JUEGO
let jugador = {
  nombre: "Alejandro",
  puntos: 0,
  vida: 100,
  vidaMaxima: 100,
  inventario: [],
  imagen: "img/Jugador.svg"
};

let productosSeleccionados = [];
let listaBatallas = [];
let indiceBatallaActual = 0;

// PRODUCTOS (5 originales + 3 nuevos)
const listaProductos = [
  { nombre: "Espada Basica", rareza: "Comun", tipo: "arma", ataque: 10, precio: 500, imagen: "axe.png" },
  { nombre: "Armadura Ligera", rareza: "Rara", tipo: "armadura", defensa: 10, precio: 750, imagen: "armor.png" },
  { nombre: "Pocion de vida", rareza: "Comun", tipo: "consumible", curacion: 10, precio: 200, imagen: "hp.png" },
  { nombre: "Arco largo", rareza: "Epico", tipo: "arma", ataque: 25, precio: 1200, imagen: "bow.png" },
  { nombre: "Pocion de Mana", rareza: "Comun", tipo: "consumible", curacion: 40, precio: 300, imagen: "hp.png" },
  { nombre: "Martillo de Guerra", rareza: "Rara", tipo: "arma", ataque: 18, precio: 1300 },
  { nombre: "Cota de Malla", rareza: "Epico", tipo: "armadura", defensa: 25, precio: 1400, imagen: "armor.png" },
  { nombre: "Elixir Supremo", rareza: "Legendario", tipo: "consumible", curacion: 80, precio: 1800, imagen: "hp.png" }
];

// ENEMIGOS (con imagen para UI)
const listaEnemigos = [
  { nombre: "Goblin", ataque: 15, vida: 60, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Orco", ataque: 25, vida: 90, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Troll", ataque: 35, vida: 120, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Esqueleto Guerrero", ataque: 20, vida: 70, tipo: "normal", imagen: "img/esqueleto.png" },
  { nombre: "Dragón", ataque: 40, vida: 180, tipo: "jefe", imagen: "img/dragon.png" },
  { nombre: "Señor de la Sombra", ataque: 45, vida: 150, tipo: "jefe", imagen: "img/sombra.png" }
];

// ===== ESCENAS =====
function mostrarEscena(idEscena) {
  document.querySelectorAll('.scene').forEach(elemento => elemento.classList.remove('active'));
  document.getElementById(idEscena).classList.add('active');
}

// ===== MONEDA =====
function formatearMoneda(cantidadCentimos) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
    .format(cantidadCentimos / 100);
}

// ===== MERCADO =====
function alternarSeleccion(producto, elemento) {
  const yaSeleccionado = productosSeleccionados.some(p => p.nombre === producto.nombre);

  if (yaSeleccionado) {
    productosSeleccionados = productosSeleccionados.filter(p => p.nombre !== producto.nombre);
    elemento.classList.remove('seleccionado');
  } else {
    productosSeleccionados.push(producto);
    elemento.classList.add('seleccionado');
  }

  actualizarCarrito();
}

function cargarMercado() {
  const rarezasDescuento = ["Comun", "Rara", "Epico", "Legendario"];
  const rarezaElegida = rarezasDescuento[Math.floor(Math.random() * rarezasDescuento.length)];
  const porcentajeDescuento = Math.floor(Math.random() * 31) + 10; // 10–40%

  document.getElementById('mensaje-descuento').textContent =
    `🤑 ¡${porcentajeDescuento}% de descuento en items ${rarezaElegida}`;

  const contenedor = document.getElementById('contenedor-productos');
  contenedor.innerHTML = '';

  listaProductos.forEach(producto => {
    let precioFinal = producto.precio;
    if (producto.rareza === rarezaElegida) {
      precioFinal = Math.round(precioFinal * (1 - porcentajeDescuento / 100));
    }

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';

    let textoBonus = "";
    if (producto.ataque !== undefined) textoBonus = `Ataque: +${producto.ataque}`;
    else if (producto.defensa !== undefined) textoBonus = `Defensa: +${producto.defensa}`;
    else if (producto.curacion !== undefined) textoBonus = `Curacion: +${producto.curacion}`;

    tarjeta.innerHTML = `
      <div class="producto-imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <strong>${producto.nombre}</strong>
      <div class="rareza">${producto.rareza}</div>
      <div class="textoBonus">${textoBonus}</div>
      <div>Precio: ${formatearMoneda(precioFinal)}</div>`;


    tarjeta.onclick = () => alternarSeleccion(producto, tarjeta);
    contenedor.appendChild(tarjeta);
  });

  productosSeleccionados = [];
}

function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  if (!lista) return;
  lista.innerHTML = '';
  productosSeleccionados.forEach(producto => {
    const item = document.createElement('li');
    item.textContent = producto.nombre;
    lista.appendChild(item);
  });
}

function confirmarCompra() {
  jugador.inventario = productosSeleccionados.map(p => ({
    nombre: p.nombre,
    tipo: p.tipo,
    ataque: p.ataque,
    defensa: p.defensa,
    curacion: p.curacion
  }));

  actualizarJugador();
  mostrarEscena('jugador');
}

// ===== ESTADO JUGADOR =====
function actualizarJugador() {
  let ataqueTotal = 0;
  let defensaTotal = 0;

  for (const item of jugador.inventario) {
    if (item.ataque) ataqueTotal += item.ataque;
    if (item.defensa) defensaTotal += item.defensa;
  }

  document.getElementById('nombre-actualizado').textContent = jugador.nombre;
  document.getElementById('vida-actualizada').textContent = jugador.vida;
  document.getElementById('puntos-actualizado').textContent = jugador.puntos;
  document.getElementById('ataque-actualizado').textContent = ataqueTotal;
  document.getElementById('defensa-actualizada').textContent = defensaTotal;
}

// ===== ENEMIGOS (escena 4) =====
function cargarEnemigos() {
  const contenedorEnemigo = document.getElementById('contenedor-enemigos');
  contenedorEnemigo.innerHTML = '';

  listaEnemigos.forEach(enemigo => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-enemigo';

    tarjeta.innerHTML = `
      <div class="enemigo-imagen">
        <img src="${enemigo.imagen}" alt="${enemigo.nombre}">
      </div>
      <div class="enemigo-datos">
        <strong>${enemigo.nombre}</strong>
        <div>Tipo: ${enemigo.tipo === 'jefe' ? 'Jefe' : 'Enemigo'}</div>
        <div>Ataque: ${enemigo.ataque}</div>
        <div>Vida: ${enemigo.vida}</div>
      </div>
    `;

    contenedorEnemigo.appendChild(tarjeta);
  });
}

// ===== BATALLAS: 3 aleatorias, una por pantalla =====
function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function iniciarBatallas() {
  listaBatallas = mezclar(listaEnemigos).slice(0, 3);
  indiceBatallaActual = 0;

  document.getElementById('registro-batallas').innerHTML = '';
  document.getElementById('siguiente-batalla').style.display = 'inline-block';
  document.getElementById('finalizar').style.display = 'none';

  mostrarEscena('batallas');
  mostrarBatallaActual();
}

// calcula stats del jugador
function statsJugador() {
  let ataque = 0;
  let defensa = 0;
  for (const item of jugador.inventario) {
    if (item.ataque) ataque += item.ataque;
    if (item.defensa) defensa += item.defensa;
  }
  return { ataque, defensa };
}

// muestra SOLO la batalla actual
function mostrarBatallaActual() {
  const enemigo = listaBatallas[indiceBatallaActual];
  const { ataque, defensa } = statsJugador();

  const danoJugador = Math.max(0, ataque);
  const danoEnemigo = Math.max(0, enemigo.ataque - defensa);

  let resultado, puntos = 0, color;
  if (danoJugador > danoEnemigo) {
    resultado = "¡Has ganado!";
    puntos = 100;
    jugador.puntos += puntos;
    color = "#e8f5e8";
  } else {
    resultado = "Has perdido...";
    color = "#ffebee";
  }

  // Imagen del jugador y del enemigo en la zona de combate
  const imgJ = document.getElementById('imagen-jugador-combate');
  const imgE = document.getElementById('imagen-enemigo-combate');

  imgJ.innerHTML = `<img src="${jugador.imagen}" alt="${jugador.nombre}">`;
  imgE.innerHTML = `<img src="${enemigo.imagen}" alt="${enemigo.nombre}">`;

  // info bajo las imágenes
  document.getElementById('info-jugador-combate').innerHTML =
    `🧝‍♂️ ${jugador.nombre}<br>Vida: ${jugador.vida}/${jugador.vidaMaxima} | Ataque: ${ataque} | Defensa: ${defensa}`;

  document.getElementById('info-enemigo-combate').innerHTML =
    `👹 ${enemigo.nombre}<br>Vida: ${enemigo.vida} | Ataque: ${enemigo.ataque}`;

  // reiniciar animaciones
  imgJ.classList.remove('anim-start');
  imgE.classList.remove('anim-start');
  void imgJ.offsetWidth;
  void imgE.offsetWidth;
  imgJ.classList.add('anim-start');
  imgE.classList.add('anim-start');

  const registro = document.getElementById('registro-batallas');
  registro.innerHTML = '';

  const contenedor = document.createElement('div');
  contenedor.innerHTML = `
    <h3>⚔️ Batalla ${indiceBatallaActual + 1}</h3>
    <p><strong>Resultado:</strong> ${resultado} ${puntos ? `(+${puntos} puntos)` : ''}</p>
  `;
  const resultadoEl = contenedor.querySelector('p:last-child');
  resultadoEl.style.padding = "10px";
  resultadoEl.style.borderRadius = "6px";
  resultadoEl.style.backgroundColor = color;
  resultadoEl.style.fontWeight = "bold";
  resultadoEl.style.MarginTop = "8px";

  registro.appendChild(contenedor);
}

function siguienteBatalla() {
  indiceBatallaActual++;

  if (indiceBatallaActual >= listaBatallas.length) {
    document.getElementById('siguiente-batalla').style.display = 'none';
    document.getElementById('finalizar').style.display = 'inline-block';
    return;
  }

  mostrarBatallaActual();
}

// ===== RESULTADO FINAL =====
function finalizarJuego() {
  document.getElementById('nombre-final').textContent = jugador.nombre;
  document.getElementById('puntos-final').textContent = jugador.puntos;
  document.getElementById('categoria-final').textContent =
    jugador.puntos >= 100 ? "pro" : "rookie";

  mostrarEscena('resultado');
}
