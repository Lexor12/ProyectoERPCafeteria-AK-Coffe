//Como su nombre lo dice, esta simplemente recibe los valores devueltos de una compra a un proveedor
export interface RespuestaCompra {
    registrada: boolean;
    idProducto?: string;
    idCompra?: string;
    total?: number;
    mensaje?: string;
}