// Respuesta de iniciar el pago con PayPal (resultado de una acción)
export interface RespuestaPago {
    iniciado: boolean;
    enlacePago: string;
    orderID: string;
}