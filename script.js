// DATOS DEL JUEGO
let jugador = {
    nombre: "Alejandro",
    puntos: 0,
    vida: 100,
    inventario: {}
}

let productosSeleccionados = [];
let listaBatallas = [];
let indiceBatallaActual = 0;

const listaProductos = [
    { nombre: "Espada Basica", rareza: "Comun", tipo: "arma", ataque: 5, precio: 500 },
    { nombre: "Armadura Ligera", rareza: "Rara", tipo: "armadura", defensa: 10, precio: 750 },
    { nombre: "Pocion de vida", rareza: "Comun", tipo: "consumible", curacion: 10, precio: 200 },
    { nombre: "Arco largo", rareza: "Epico", tipo: "arma", ataque: 15, precio: 1200 },
    { nombre: "Pocion de Mana", rareza: "Comun", tipo: "consumible", curacion: 40, precio: 300 }
];

const listaEnemigos = [
    { nombre: "Goblin", ataque: 15 },
    { nombre: "Orco", ataque: 25 },
    { nombre: "Troll", ataque: 35 }
];

// Funcion para mostrar las escenas
function showScene(idEscena) {
    document.querySelectorAll('.scene').forEach(elemento => elemento.classList.remove('active'));
    document.getElementById(idEscena).classList.add('active');
}

// Formateo de moneda
function formatearMoneda(cantidadCentimos) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cantidadCentimos / 100);
}