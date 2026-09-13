// Representa un producto ya agregado al carrito del cliente, es básicamente un Producto
// pero con la cantidad que el cliente eligió comprar
export interface ProductoCarrito {
    idProducto: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stockDisponible: number;
    imagenUrl: string;
    cantidad: number;
}