// Esta interfaz solo es para la respuesta del registro,
// no representa una entidad de la BD como tal, es más bien "resultado de una acción"
export interface RespuestaRegistro {
    creado: boolean;
    mensaje: string;
}
