/**
 * Clase para los enemigos
 * @author Alejandro Rey Tostado
 */
export class Enemigos {
    tipo;
    nombre;
    ataque;
    vida;

    /**
     * Constructor de enemigos
     * @param nombre Nombre del personaje
     * @param nivelataque  Ataque del personaje
     * @param puntosvida Vida del personaje
     */
    constructor(nombre, nivelataque, puntosvida) {
        this.tipo = 'Enemigo';
        this.nombre = nombre;
        this.ataque = nivelataque;
        this.vida = puntosvida;
    }

    /**
     * Metodo para la presentacion del Enemigo
     * @returns Devuelve la descripcion del Enemigo con todos sus datos
     */
    presentarse() {
        return `Soy ${this.nombre}, el enemigo tengo ${this.ataque} de ataque y ${this.vida} de vida `;
    }
}