// Esta interfaz representa un pedido visto desde el lado del Cliente, por eso trae tantos datos
// fiscales (tienda y cliente), ya que se usa tanto para mostrar el pedido en la lista como para
// generar/mostrar el detalle que sirve de comprobante
import { ProductoDeVenta } from "./productoDeVenta";

export interface PedidoCliente {
    idVenta: string;
    fechaCompra: string;
    totalPagado: number;
    entregado: boolean;
    cancelado: boolean;
    rfcCliente: string;
    nombreCliente: string;
    apellidoCliente: string;
    nombreTienda: string;
    rfcTienda: string;
    telefonoTienda: string;
    domicilioFiscalTienda: string;
    regimenFiscalTienda: string;
    productos: ProductoDeVenta[];
}