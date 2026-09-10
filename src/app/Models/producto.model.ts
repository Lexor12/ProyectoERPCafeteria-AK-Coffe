// Representa un producto tal como se maneja en Inventario/Catálogo, con stock disponible
// y precio de venta (a diferencia de ProductoProveedor que maneja precio de compra)
export interface Producto {
    idProducto: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagenUrl: string;
}