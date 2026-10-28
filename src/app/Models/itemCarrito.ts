// Un elemento que el front manda al validar o pagar un producto como tal del carrito ya para proceso de pasarela
export interface ItemCarrito {
    idProducto: string;
    cantidad: number;
}