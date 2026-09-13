//Esta interfaz nos permite almacenar a todos los productos que se reservarón en un pedido
export interface ProductoDeVenta {
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}