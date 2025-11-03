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
    inventario: []
}

let productosSeleccionados = [];
let listaBatallas = [];
let indiceBatallaActual = 0;

const listaProductos = [
    { nombre: "Espada Basica", rareza: "Comun", tipo: "arma", ataque: 10, precio: 500 },
    { nombre: "Armadura Ligera", rareza: "Rara", tipo: "armadura", defensa: 10, precio: 750 },
    { nombre: "Pocion de vida", rareza: "Comun", tipo: "consumible", curacion: 10, precio: 200 },
    { nombre: "Arco largo", rareza: "Epico", tipo: "arma", ataque: 25, precio: 1200 },
    { nombre: "Pocion de Mana", rareza: "Comun", tipo: "consumible", curacion: 40, precio: 300 }
];

const listaEnemigos = [
    { nombre: "Goblin", ataque: 15 },
    { nombre: "Orco", ataque: 25 },
    { nombre: "Troll", ataque: 35 }
];

// Funcion para mostrar las escenas
function mostrarEscena(idEscena) {
    document.querySelectorAll('.scene').forEach(elemento => elemento.classList.remove('active'));
    document.getElementById(idEscena).classList.add('active');
}

// Formateo de moneda
function formatearMoneda(cantidadCentimos) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cantidadCentimos / 100);
}

// Funcion para cuando seleccionemos en el mercado el producto que queremos comprar
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
    const rarezasDescuento = ["Comun", "Rara"];
    const rarezaElegida = rarezasDescuento[Math.floor(Math.random() * rarezasDescuento.length)];
    const porcentejeDescuento = 20;

    document.getElementById('mensaje-descuento').textContent = `🤑 ¡${porcentejeDescuento}% de descuento en items ${rarezaElegida}`;

    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    listaProductos.forEach(producto => {
        let precioFinal = producto.precio;
        if (producto.rareza === rarezaElegida) {
            precioFinal = Math.round(precioFinal * (1 - porcentejeDescuento / 100));
        }

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';

        let textoBonus = "";
        if (producto.ataque !== undefined) textoBonus = `Ataque: +${producto.ataque}`;
        else if (producto.defensa !== undefined) textoBonus = `Defensa: +${producto.defensa}`;
        else if (producto.curacion !== undefined) textoBonus = `Curacion: +${producto.curacion}`;

        tarjeta.innerHTML = `
        <strong>${producto.nombre}</strong>
        <div class="rareza">${producto.rareza}</div>
        <div class="textoBonus">${textoBonus}</div>
        <div>Precio: ${formatearMoneda(precioFinal)}</div>`;

        tarjeta.onclick = () => alternarSeleccion(producto, tarjeta);
        contenedor.appendChild(tarjeta);
    });

    document.getElementById('lista-carrito').innerHTML = '';
    productosSeleccionados = [];
}

function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
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
    }))

    actualizarJugador();
    mostrarEscena('jugador');
}

/**
 * Actualizaremos el jugador despues de las compras realizadas
 * Diremos el ataque y defensa total que tiene con las compras realizadas
 */
function actualizarJugador() {
    let ataqueTotal = 0;
    for (const item of jugador.inventario) {
        if (item.ataque) {
            ataqueTotal += item.ataque;
        }
    }

    let defensaTotal = 0;
    for (const item of jugador.inventario) {
        if (item.defensa) {
            defensaTotal += item.defensa;
        }
    }

    document.getElementById('nombre-actualizado').textContent = jugador.nombre;
    document.getElementById('vida-actualizada').textContent = jugador.vida;
    document.getElementById('puntos-actualizado').textContent = jugador.puntos;
    document.getElementById('ataque-actualizado').textContent = ataqueTotal;
    document.getElementById('defensa-actualizada').textContent = defensaTotal;
}

function cargarEnemigos() {
    const contenedorEnemigo = document.getElementById('contenedor-enemigos');
    contenedorEnemigo.innerHTML = '';
    listaEnemigos.forEach(enemigo => {
        const p = document.createElement('p');
        p.textContent = `${enemigo.nombre} - Ataque: ${enemigo.ataque}`;
        contenedorEnemigo.appendChild(p);
    });
}

function iniciarBatallas() {
    // Copia del array
    listaBatallas = [];
    for (let i = 0; i < listaEnemigos.length; i++) {
        listaBatallas.push(listaEnemigos[i]);
    }

    indiceBatallaActual = 0;
    document.getElementById('registro-batallas').innerHTML = '';
    document.getElementById('siguiente-batalla').style.display = 'inline-block';
    document.getElementById('finalizar').style.display = 'none';
    siguienteBatalla();
    mostrarEscena('batallas');
}

function siguienteBatalla() {
    if (indiceBatallaActual >= listaBatallas.length) {
        document.getElementById('siguiente-batalla').style.display = 'none';
        document.getElementById('finalizar').style.display = 'inline-block';
        return;
    }

    const enemigo = listaBatallas[indiceBatallaActual];

    let ataqueJugador = 0;
    let defensaJugador = 0;
    for (let i = 0; i < jugador.inventario.length; i++) {
        const item = jugador.inventario[i];
        if (item.ataque) ataqueJugador += item.ataque;
        if (item.defensa) defensaJugador += item.defensa;
    }

    const contenedor = document.createElement('div');
    contenedor.innerHTML = `
    <h3>⚔️ Batalla ${indiceBatallaActual + 1}</h3>
    <p><strong>🧝‍♂️ Jugador: </strong>${jugador.nombre} | Vida: ${jugador.vida}/${jugador.vidaMaxima} | Ataque: ${ataqueJugador} | Defensa: ${defensaJugador}</p>
    <p><strong>👹 Enemigo: </strong>${enemigo.nombre} | Ataque: ${enemigo.ataque}</p>
    `;
    const danoJugador = Math.max(0, ataqueJugador);
    const danoEnemigo = Math.max(0, enemigo.ataque - defensaJugador);

    let resultado, puntos = 0, color;
    if (danoJugador > danoEnemigo) {
        resultado = "¡Has ganado!";
        puntos = 100;
        jugador.puntos += puntos;
        color = "#e8f5e8";
    } else {
        resultado = "Has perdido..."
        color = "#ffebee";
    }

    const resultadoEl = document.createElement('p');
    resultadoEl.innerHTML = `<strong>Resultado:</strong> ${resultado} ${puntos ? `(+${puntos} puntos)` : ''}`;
    resultadoEl.style.padding = "10px";
    resultadoEl.style.borderRadius = "6px";
    resultadoEl.style.backgroundColor = color;
    resultadoEl.style.fontWeight = "bold";
    resultadoEl.style.marginTop = "8px";
    contenedor.appendChild(resultadoEl);
    
    document.getElementById('registro-batallas').appendChild(contenedor);
    indiceBatallaActual++;
}

function finalizarJuego() {
    document.getElementById('nombre-final').textContent = jugador.nombre;
    document.getElementById('puntos-final').textContent = jugador.puntos;
    document.getElementById('categoria-final').textContent = jugador.puntos >= 100 ? "pro" : "rookie";

    mostrarEscena('resultado');
}