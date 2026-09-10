// Esta interfaz representa un pedido visto desde el lado del Cliente, por eso trae tantos datos
// fiscales (tienda y cliente), ya que se usa tanto para mostrar el pedido en la lista como para
// generar/mostrar el detalle que sirve de comprobante
export interface PedidoCliente {
    idVenta: string;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    fechaCompra: string;
    entregado: boolean;
    cancelado: boolean;
    imagenUrl: string;
    rfcCliente: string; // opcional, no toda persona quiere factura
    nombreCliente: string;
    apellidoCliente: string;
    nombreTienda: string;
    rfcTienda: string;
    telefonoTienda: string;
    domicilioFiscalTienda: string;
    regimenFiscalTienda: string;
}