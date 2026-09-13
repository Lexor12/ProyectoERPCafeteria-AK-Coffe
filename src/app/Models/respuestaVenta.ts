// Esta interfaz es para la respuesta de registrar una venta,
// no representa una entidad de la BD, es "resultado de una acción"
export interface RespuestaVenta {
    registrada: boolean;
    idVenta?: string;
    mensaje?: string;
}