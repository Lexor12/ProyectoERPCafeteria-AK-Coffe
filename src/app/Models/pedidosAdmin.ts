// Esta interfaz representa un pedido visto desde el lado del Administrador, es más simple que
// PedidoCliente porque el admin no necesita ver los datos fiscales completos, solo lo esencial
// para poder marcar entregado/cancelado y buscar por nombre de cliente
export interface PedidoAdmin {
    idVenta: string;
    nombre: string;
    precio: number;
    cantidad: number;
    fechaCompra: string;
    entregado: boolean;
    cancelado: boolean;
    imagenUrl: string;
    nombreCliente: string;
}