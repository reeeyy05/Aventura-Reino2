import { Enemigos } from "./Enemigos.js";

/**
 * Clase heredera de los Enemigos para los Jefes
 * @extends Enemigos
 * @author Alejandro Rey Tostado
 */
export class Jefe extends Enemigos {
    habilidadEspecial;
    multiplicarDanio;

    /**
     * Constructor del Jefe
     * @param nombre Nombre del Jefe
     * @param nivelataque Ataque del Jefe
     * @param {*} puntosvida Vida del Jefe
     * @param {*} habilidadespecial Habilidad del Jefe
     */
    constructor(nombre, nivelataque, puntosvida, habilidadespecial) {
        super('jefe', nombre, nivelataque, puntosvida);
        this.tipo = 'Jefe'
        this.habilidadEspecial = habilidadespecial;
        this.multiplicarDanio = 2.0;
    }

    /**
     * Método para presentar el jefe final
     * @returns {string} Descripción especial del jefe
     * Ejemplo: "Soy Dragón, el jefe final. Mi habilidad especial es: Llamarada"
     */
    presentarse() {
        return `Soy ${this.nombre}, el jefe final. Mi habilidad especial es: ${this.habilidadEspecial}`;
    }
}