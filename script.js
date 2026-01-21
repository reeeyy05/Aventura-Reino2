/**
 * Inicializa el mercado y los enemigos
 * Limita los puntos extras
 * @author Alejandro Rey Tostado
 */
document.addEventListener('DOMContentLoaded', () => {
  cargarMercado();
  cargarEnemigos();

  const ataqueInput = document.getElementById('ataque-input');
  const defensaInput = document.getElementById('defensa-input');
  const vidaInput = document.getElementById('vida-input');

  const limitarPuntos = () => {
    const ataque = parseInt(ataqueInput.value || '0', 10);
    const defensa = parseInt(defensaInput.value || '0', 10);
    const vida = parseInt(vidaInput.value || '100', 10);

    const puntosExtra = ataque + defensa + (vida - 100);
    if (puntosExtra > 10) {
      const exceso = puntosExtra - 10;
      if (document.activeElement === ataqueInput) {
        ataqueInput.value = Math.max(0, ataque - exceso);
      } else if (document.activeElement === defensaInput) {
        defensaInput.value = Math.max(0, defensa - exceso);
      } else if (document.activeElement === vidaInput) {
        vidaInput.value = Math.max(0, vida - exceso);
      }
    }
  };

  ataqueInput.addEventListener('input', limitarPuntos);
  defensaInput.addEventListener('input', limitarPuntos);
  vidaInput.addEventListener('input', limitarPuntos);
});


/**
 * Estado del Jugador
 */
let jugador = {
  nombre: '',
  puntos: 0,
  vida: 100,
  vidaMaxima: 100,
  inventario: [],
  imagen: "img/Jugador.svg",
  ataqueBase: 0,
  defensaBase: 0,
  dinero: 500
};

/**
 * Lista de productos seleccionados
 */
let productosSeleccionados = [];

/**
 * Lista de enemigos elegido para las batallas
 */
let listaBatallas = [];

/**
 * Indice de la batalla
 */
let indiceBatallaActual = 0;

/**
 * Listado de todos los productos
 */
const listaProductos = [
  { nombre: "Hacha Basica", rareza: "Comun", tipo: "arma", ataque: 10, precio: 200, imagen: "img/axe.png" },
  { nombre: "Armadura Ligera", rareza: "Rara", tipo: "armadura", defensa: 10, precio: 300, imagen: "img/armor.png" },
  { nombre: "Pocion de vida", rareza: "Comun", tipo: "consumible", curacion: 10, precio: 200, imagen: "img/hp.png" },
  { nombre: "Arco largo", rareza: "Epico", tipo: "arma", ataque: 25, precio: 200, imagen: "img/bow.png" },
  { nombre: "Pocion de Mana", rareza: "Comun", tipo: "consumible", curacion: 40, precio: 300, imagen: "img/hp.png" },
  { nombre: "Martillo de Guerra", rareza: "Rara", tipo: "arma", ataque: 18, precio: 300, imagen: "img/hammer.png" },
  { nombre: "Cota de Malla", rareza: "Epico", tipo: "armadura", defensa: 25, precio: 300, imagen: "img/armor.png" },
  { nombre: "Elixir Supremo", rareza: "Legendario", tipo: "consumible", curacion: 80, precio: 200, imagen: "img/hp.png" }
];


/**
 * Listade de todos los enemigos
 */
const listaEnemigos = [
  { nombre: "Goblin", ataque: 15, vida: 60, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Orco", ataque: 25, vida: 90, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Troll", ataque: 35, vida: 120, tipo: "normal", imagen: "img/enemigo.png" },
  { nombre: "Esqueleto Guerrero", ataque: 20, vida: 70, tipo: "normal", imagen: "img/esqueleto.png" },
  { nombre: "Dragón", ataque: 40, vida: 180, tipo: "jefe", imagen: "img/dragon.png" },
  { nombre: "Señor de la Sombra", ataque: 45, vida: 150, tipo: "jefe", imagen: "img/sombra.jpg" }
];

/**
 * Muestra una escena de la interfaz
 * @param {*} idEscena - ID de la escena que se quiere mostrar
 */
function mostrarEscena(idEscena) {
  document.querySelectorAll('.scene').forEach(elemento => elemento.classList.remove('active'));
  document.getElementById(idEscena).classList.add('active');
}

/**
 * Crea el jugador a partir del formulario
 *
 * @param {*} evento - Evento del envio del formulario
 */
function crearJugador(evento) {
  evento.preventDefault();

  const campoNombre = document.getElementById("nombre");
  const campoAtaque = document.getElementById("ataque-input");
  const campoDefensa = document.getElementById("defensa-input");
  const campoVida = document.getElementById("vida-input");
  const zonaErrores = document.getElementById("errores-formulario");

  const nombre = campoNombre.value.trim();
  const ataque = parseInt(campoAtaque.value, 10);
  const defensa = parseInt(campoDefensa.value, 10);
  const vida = parseInt(campoVida.value, 10);

  const expresionNombre = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$/;

  if (!nombre || nombre.length > 20 || !expresionNombre.test(nombre)) {
    zonaErrores.textContent =
      'Nombre inválido: empieza en mayúscula, solo letras y espacios, máximo 20 caracteres y no puede ser solo espacios.';
    return;
  }

  if (isNaN(ataque) || isNaN(defensa) || isNaN(vida)) {
    zonaErrores.textContent = 'Ataque, defensa y vida deben ser números enteros.';
    return;
  }

  if (ataque < 0 || defensa < 0 || vida < 100) {
    zonaErrores.textContent =
      'Ataque y defensa no pueden ser negativos y la vida mínima es 100.';
    return;
  }

  zonaErrores.textContent = '';

  jugador.nombre = nombre;
  jugador.vida = vida;
  jugador.vidaMaxima = vida;
  jugador.puntos = 0;
  jugador.inventario = [];
  jugador.ataqueBase = ataque;
  jugador.defensaBase = defensa;

  document.getElementById('nombre-jugador').textContent = jugador.nombre;
  document.getElementById('vida-jugador').textContent = jugador.vida;
  document.getElementById('puntos-jugador').textContent = jugador.puntos;
  document.getElementById('ataque-jugador').textContent = jugador.ataqueBase;
  document.getElementById('defensa-jugador').textContent = jugador.defensaBase;
  document.getElementById('dinero-jugador').textContent = jugador.dinero;

  mostrarEscena('inicio');
}

/**
 * Actualiza el dinero que tiene el jugador
 */
function actualizarDinero() {
  const spanMonedero = document.getElementById('dinero');
  if (spanMonedero) {
    spanMonedero.textContent = jugador.dinero;
  }
}

/**
 * Alterna la seleccion del producto en el mercado
 *
 * @param {*} producto - Producto a seleccionar o seleccionado
 * @param {*} elemento - Elemento de la tarjeta HTML asociada al producto
 */
function alternarSeleccion(producto, elemento) {
  const yaSeleccionado = productosSeleccionados.some(p => p.nombre === producto.nombre);

  if (yaSeleccionado) {
    productosSeleccionados = productosSeleccionados.filter(p => p.nombre !== producto.nombre);
    jugador.dinero += producto.precio;
    elemento.classList.remove('seleccionado');
  } else {
    if (jugador.dinero < producto.precio) {
      alert('No tienes suficiente dinero para comprar este objeto.');
      return;
    }
    productosSeleccionados.push(producto);
    jugador.dinero -= producto.precio;
    elemento.classList.add('seleccionado');
  }

  actualizarCarrito();
  actualizarDinero();
}

/**
 * Carga el mercado con todos los productos disponibles y asignando un descuento a un tipo de producto aleatorio
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
          <div>Precio: ${precioFinal}</div>
        </div>
      </div>`;

    tarjeta.onclick = () => alternarSeleccion(producto, tarjeta);
    contenedor.appendChild(tarjeta);
  });

  productosSeleccionados = [];
  actualizarDinero();
}

/**
 * Actualiza la lista de los productos seleccionados
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
 * Calcula todas las estadisticas del jugador y las muestra
 */
function actualizarJugador() {
  let ataque = 0;
  let defensa = 0;
  let vida = 0;

  for (const item of jugador.inventario) {
    if (item.ataque) ataque += item.ataque;
    if (item.defensa) defensa += item.defensa;
    if (item.curacion) vida += item.curacion;
  }

  const ataqueTotal = jugador.ataqueBase + ataque;
  const defensaTotal = jugador.defensaBase + defensa;
  const vidaTotal = jugador.vidaMaxima + vida;

  document.getElementById('nombre-actualizado').textContent = jugador.nombre;
  document.getElementById('vida-actualizada').textContent = vidaTotal;
  document.getElementById('puntos-actualizado').textContent = jugador.puntos;
  document.getElementById('ataque-actualizado').textContent = ataqueTotal;
  document.getElementById('defensa-actualizada').textContent = defensaTotal;
  document.getElementById('dinero-actualizado').textContent = jugador.dinero;
}

/**
 * Calcula las estadísticas totales del jugador
 */
function statsJugador() {
  let ataque = jugador.ataqueBase;
  let defensa = jugador.defensaBase;

  for (const item of jugador.inventario) {
    if (item.ataque) ataque += item.ataque;
    if (item.defensa) defensa += item.defensa;
  }

  return { ataque, defensa };
}

/**
 * Confirma la compra en el mercado y construye el inventario del jugador a partir de los productos seleccionados
 */
function confirmarCompra() {
  jugador.inventario = productosSeleccionados.map(p => ({
    nombre: p.nombre,
    tipo: p.tipo,
    ataque: p.ataque,
    defensa: p.defensa,
    curacion: p.curacion,
    imagen: p.imagen
  }));

  actualizarJugador();
  actualizarInventario();
  mostrarEscena('jugador');
}

/**
 * Pinta en las casillas del inventario las imagenes de los productos comprados
 */
function actualizarInventario() {
  const casilla = document.querySelectorAll('#contenedor-inventario .item');

  casilla.forEach((casilla, indice) => {
    casilla.innerHTML = '';
    const item = jugador.inventario[indice];
    if (item && item.imagen) {
      const img = document.createElement('img');
      img.src = item.imagen;
      img.alt = item.nombre;
      casilla.appendChild(img);
    }
  });
}

/**
 * Carga la lista de los enemigos con sus atributos
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
 * Inicia una nueva ronda de las batallas seleccionando 3 enemigos distintos
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
 * Muestra en pantalla la batalla actual, calcula el resultado y actualiza el registro de batallas y los puntos del jugador
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

  const contenedorMonedas = document.getElementById('monedas');
  if (contenedorMonedas) {
    contenedorMonedas.classList.remove('animar-monedas');
    void contenedorMonedas.offsetWidth;
    contenedorMonedas.classList.add('animar-monedas');
  }

  const imgJ = document.getElementById('imagen-jugador-combate');
  const imgE = document.getElementById('imagen-enemigo-combate');

  imgJ.innerHTML = `<img src="${jugador.imagen}" alt="${jugador.nombre}">`;
  imgE.innerHTML = `<img src="${enemigo.imagen}" alt="${enemigo.nombre}">`;

  document.getElementById('info-jugador-combate').innerHTML =
    `🧝‍♂️ ${jugador.nombre}<br>Vida: ${jugador.vida}/${jugador.vidaMaxima} | Ataque: ${ataque} | Defensa: ${defensa}`;

  document.getElementById('info-enemigo-combate').innerHTML =
    `👹 ${enemigo.nombre}<br>Vida: ${enemigo.vida} | Ataque: ${enemigo.ataque}`;

  imgJ.classList.add('imagen-jugador-anim');
  imgE.classList.add('imagen-enemigo-anim');

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
 * Avanza a la siguiente batalla de la lista o el muestra el boton de finalizar
 */
function siguienteBatalla() {
  indiceBatallaActual++;

  if (indiceBatallaActual >= listaBatallas.length) {
    document.getElementById('siguiente-batalla').style.display = 'none';
    document.getElementById('finalizar').style.display = 'inline-block';
    return;
  }

  const contenedorMonedas = document.getElementById('monedas');
  if (contenedorMonedas) {
    contenedorMonedas.classList.remove('animar-monedas');
    void contenedorMonedas.offsetWidth;
    contenedorMonedas.classList.add('animar-monedas');
  }

  mostrarBatallaActual();
}

/**
 * Finaliza la ronda de las batallas, muestra la escena de los resultados y guarda el resultado en la LocalStorage
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

  const entrada = {
    nombre: jugador.nombre,
    puntos: jugador.puntos,
    dinero: jugador.dinero
  };

  const ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
  ranking.push(entrada);
  localStorage.setItem('ranking', JSON.stringify(ranking));

  mostrarEscena('resultado');
}

/**
 * Muestra la tabla del ranking ordenada por puntos de mayor a menor con la informacion recogida en la LocalStorage
 */
function mostrarTabla() {
  const ranking = JSON.parse(localStorage.getItem('ranking') || '[]');

  const tabla = document.querySelector('#informacion-tabla table');
  if (!tabla) return;

  while (tabla.rows.length > 1) {
    tabla.deleteRow(1);
  }

  const ordenado = [...ranking].sort((a, b) => b.puntos - a.puntos);

  ordenado.forEach(jugadorRank => {
    const fila = tabla.insertRow(-1);
    const celdaNombre = fila.insertCell(0);
    const celdaPuntos = fila.insertCell(1);
    const celdaDinero = fila.insertCell(2);

    celdaNombre.textContent = jugadorRank.nombre;
    celdaPuntos.textContent = jugadorRank.puntos;
    celdaDinero.textContent = jugadorRank.dinero;
  });

  mostrarEscena('informacion-tabla');
}

/**
 * Reinicia el juego devolviendo al jugador a su estado inicial
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

  actualizarInventario();
  cargarMercado();
  mostrarEscena('formulario-jugador');
}