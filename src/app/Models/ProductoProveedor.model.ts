// Representa un producto ya asociado a un proveedor específico, por eso trae idProveedor,
// esto es distinto del Producto de Inventario porque aquí el precio es de compra, no de venta
export interface ProductoProveedor {
    idProducto: string;
    nombre: string;
    descripcion: string;
    precio: number;
    idProveedor: string;
    imagenUrl: string;
}