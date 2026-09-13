// Esta interfaz representa un pedido visto desde el lado del Administrador, es más simple que
// PedidoCliente porque el admin no necesita ver los datos fiscales completos, solo lo esencial
// para poder marcar entregado/cancelado y buscar por nombre de cliente
import { ProductoDeVenta } from "./productoDeVenta";
export interface PedidoAdmin {
    idVenta: string;
    fechaCompra: string;
    totalPagado: number;
    entregado: boolean;
    cancelado: boolean;
    nombreCliente: string;
    apellidoCliente: string;
    productos: ProductoDeVenta[];
}
