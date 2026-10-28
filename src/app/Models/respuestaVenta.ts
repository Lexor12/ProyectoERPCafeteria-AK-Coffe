// Esta interfaz es para la respuesta de registrar una venta, guarda la respuesta de capturar el pago y registrar la venta
export interface RespuestaVenta {
    registrada: boolean;
    idVenta?: string;
    mensaje?: string;
}