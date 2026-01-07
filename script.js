/**
 * INICIO DEL JUEGO DE AVENTURAS CON MERCADO Y BATALLAS
 * @author Alejandro Rey Tostado
 */
document.addEventListener('DOMContentLoaded', () => {
  cargarMercado();
  cargarEnemigos();
});

/**
 * ESTADO INICIAL DEL JUGADOR
 */
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

/**
 * ESTADO DE LOS PRODUCTOS
 */
const listaProductos = [
  { nombre: "Hacha Basica", rareza: "Comun", tipo: "arma", ataque: 10, precio: 500, imagen: "img/axe.png" },
  { nombre: "Armadura Ligera", rareza: "Rara", tipo: "armadura", defensa: 10, precio: 750, imagen: "img/armor.png" },
  { nombre: "Pocion de vida", rareza: "Comun", tipo: "consumible", curacion: 10, precio: 200, imagen: "img/hp.png" },
  { nombre: "Arco largo", rareza: "Epico", tipo: "arma", ataque: 25, precio: 1200, imagen: "img/bow.png" },
  { nombre: "Pocion de Mana", rareza: "Comun", tipo: "consumible", curacion: 40, precio: 300, imagen: "img/hp.png" },
  { nombre: "Martillo de Guerra", rareza: "Rara", tipo: "arma", ataque: 18, precio: 1300, imagen: "img/hammer.png" },
  { nombre: "Cota de Malla", rareza: "Epico", tipo: "armadura", defensa: 25, precio: 1400, imagen: "img/armor.png" },
  { nombre: "Elixir Supremo", rareza: "Legendario", tipo: "consumible", curacion: 80, precio: 1800, imagen: "img/hp.png" }
];

/**
 * ESTADO DE LOS ENEMIGOS
 */
const listaEnemigos = [
  { nombre: "Goblin", ataque: 15, vida: 60, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Orco", ataque: 25, vida: 90, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Troll", ataque: 35, vida: 120, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Esqueleto Guerrero", ataque: 20, vida: 70, tipo: "normal", imagen: "img/esqueleto.png" },
  { nombre: "Dragón", ataque: 40, vida: 180, tipo: "jefe", imagen: "img/dragon.png" },
  { nombre: "Señor de la Sombra", ataque: 45, vida: 150, tipo: "jefe", imagen: "img/sombra.png" }
];

/**
 * Funcion para mostrar una escena y ocultar las demas
 * @param idEscena ID de la escena a mostrar
 */
function mostrarEscena(idEscena) {
  document.querySelectorAll('.scene').forEach(elemento => elemento.classList.remove('active'));
  document.getElementById(idEscena).classList.add('active');
}

/**
 * Funcion para formatear una cantidad en centimos a moneda EUR
 * @param cantidadCentimos Cantidad en centimos
 * @returns Cadena formateada en EUR
 */
function formatearMoneda(cantidadCentimos) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
    .format(cantidadCentimos / 100);
}

/**
 * Funcion para alternar la seleccion de un producto en el carrito
 * @param producto Producto a seleccionar/deseleccionar
 * @param elemento Elemento HTML del producto
 */
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

/**
 * Funcion para cargar el mercado con productos y aplicar descuentos aleatorios
 */
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
      <div class="producto-cover">
        <div class="producto-contenido">
          <div class="producto-imagen">
            <img src="${producto.imagen}" alt="${producto.nombre}">
          </div>
          <strong>${producto.nombre}</strong>
          <div class="rareza">${producto.rareza}</div>
          <div class="textoBonus">${textoBonus}</div>
          <div>Precio: ${formatearMoneda(precioFinal)}</div>
        </div>
      </div>`;

    tarjeta.onclick = () => alternarSeleccion(producto, tarjeta);
    contenedor.appendChild(tarjeta);
  });

  productosSeleccionados = [];
}

/**
 * Funcion para actualizar la lista del carrito
 */
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

/**
 * Funcion para confirmar la compra y actualizar el inventario del jugador
 */
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

/**
 * Funcion para actualizar la informacion del jugador
 */
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

/**
 * Funcion para cargar los enemigos
 */
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

/**
 * Funcion para iniciar las batallas
 */
function iniciarBatallas() {
  listaBatallas = [];
  indiceBatallaActual = 0;

  while (listaBatallas.length < 3) {
    const indice = Math.floor(Math.random() * listaEnemigos.length);
    const enemigo = listaEnemigos[indice];

    if (!listaBatallas.includes(enemigo)) {
      listaBatallas.push(enemigo);
    }
  }

  document.getElementById('registro-batallas').innerHTML = '';
  document.getElementById('siguiente-batalla').style.display = 'inline-block';
  document.getElementById('finalizar').style.display = 'none';

  mostrarEscena('batallas');
  mostrarBatallaActual();
}

/**
 * Funcion para calcular los stats de ataque y defensa del jugador
 * @returns Objeto con stats de ataque y defensa del jugador
 */
function statsJugador() {
  let ataque = 0;
  let defensa = 0;
  for (const item of jugador.inventario) {
    if (item.ataque) ataque += item.ataque;
    if (item.defensa) defensa += item.defensa;
  }
  return { ataque, defensa };
}

/**
 * Funcion para mostrar la batalla actual
 */
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

  const imgJ = document.getElementById('imagen-jugador-combate');
  const imgE = document.getElementById('imagen-enemigo-combate');

  imgJ.classList.add('imagen-jugador-anim');
  imgE.classList.add('imagen-enemigo-anim');

  imgJ.innerHTML = `<img src="${jugador.imagen}" alt="${jugador.nombre}">`;
  imgE.innerHTML = `<img src="${enemigo.imagen}" alt="${enemigo.nombre}">`;

  document.getElementById('info-jugador-combate').innerHTML =
    `🧝‍♂️ ${jugador.nombre}<br>Vida: ${jugador.vida}/${jugador.vidaMaxima} | Ataque: ${ataque} | Defensa: ${defensa}`;

  document.getElementById('info-enemigo-combate').innerHTML =
    `👹 ${enemigo.nombre}<br>Vida: ${enemigo.vida} | Ataque: ${enemigo.ataque}`;

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
  resultadoEl.style.marginTop = "8px";

  registro.appendChild(contenedor);
}

/**
 * Funcion para avanzar a la siguiente batalla
 */
function siguienteBatalla() {
  indiceBatallaActual++;

  if (indiceBatallaActual >= listaBatallas.length) {
    document.getElementById('siguiente-batalla').style.display = 'none';
    document.getElementById('finalizar').style.display = 'inline-block';
    return;
  }

  mostrarBatallaActual();
}

/**
 * Funcion para finalizar el juego y mostrar resultados
 */
function finalizarJuego() {
  document.getElementById('nombre-final').textContent = jugador.nombre;
  document.getElementById('puntos-final').textContent = jugador.puntos;
  document.getElementById('categoria-final').textContent =
    jugador.puntos >= 100 ? "pro" : "rookie";

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  mostrarEscena('resultado');
}

/**
 * Funcion para reiniciar el juego y empezar de 0
 */
function reiniciarJuego() {
  jugador.puntos = 0;
  jugador.vida = jugador.vidaMaxima;
  jugador.inventario = [];

  productosSeleccionados = [];
  listaBatallas = [];
  indiceBatallaActual = 0;

  document.getElementById('registro-batallas').innerHTML = '';
  document.getElementById('siguiente-batalla').style.display = 'inline-block';
  document.getElementById('finalizar').style.display = 'none';

  document.getElementById('puntos-jugador').textContent = jugador.puntos;
  document.getElementById('vida-jugador').textContent = jugador.vida;
  document.getElementById('ataque-jugador').textContent = 0;
  document.getElementById('defensa-jugador').textContent = 0;

  cargarMercado();
  mostrarEscena('inicio');
}
