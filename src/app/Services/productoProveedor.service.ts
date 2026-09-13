import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ProductoProveedor } from "../Models/productoProveedor";

@Injectable({
    providedIn:'root'
})
export class ProductoProveedorService{
    private api='http://localhost:3200/api/proveedores'
    constructor(private http:HttpClient){}
    
    // Trae los productos que ya están asociados a un proveedor específico, esto es lo
    // que se ve en la página de detalle de un proveedor (RQF24), por eso pedimos idProveedor
    obtenerProductosProveedor():Observable<ProductoProveedor[]>{
        return this.http.get<ProductoProveedor[]>(`${this.api}/productos`)
    }

    // Se usa cuando el admin asocia un producto ya existente a un proveedor, capturando
    // el precio de compra de ese proveedor en particular (cada proveedor puede vender
    // el mismo producto a distinto precio, por eso el precio vive aquí y no en Producto)
    asociarProductoProveedor(idProveedor: string, idProducto: string, precioCompra: number):Observable<any>{
        return this.http.post(`${this.api}/${idProveedor}/productos`, { idProducto, precioCompra })
    }

    // Este es el botón de "Quitar" en la lista de productos de un proveedor, borra nada más
    // la relación (la fila de Catalogo_Proveedor), el producto en sí sigue existiendo
    // porque puede seguir vendiéndose en la tienda o estar asociado a otros proveedores
    eliminarProductoProveedor(idProveedor: string, idProducto: string):Observable<any>{
        return this.http.delete(`${this.api}/${idProveedor}/productos/${idProducto}`)
    }
}