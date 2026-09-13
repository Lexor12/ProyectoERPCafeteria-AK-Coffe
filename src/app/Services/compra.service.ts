import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RespuestaCompra } from "../Models/respuestaCompra";

@Injectable({
    providedIn: 'root'
})
export class CompraService {
    private api = 'http://localhost:3200/api/compras'
    constructor(private http: HttpClient) {}

    // Esto se llama desde el modal de "Surtir", cuando el producto ya existe
    // y ya está asociado al proveedor, solo aumentamos su stock
    registrarCompraProductoExistente(idProveedor: string, idProducto: string, cantidad: number, costoUnitario: number): Observable<RespuestaCompra> {
        return this.http.post<RespuestaCompra>(`${this.api}/existente`, { idProveedor, idProducto, cantidad, costoUnitario })
    }

    // Esto se llama desde el modal de "Agregar Producto" cuando se elige crear uno nuevo
    // desde cero, en vez de asociar uno que ya existía
    registrarCompraProductoNuevo(
        idProveedor: string,
        producto: { nombre: string; descripcion: string;},
        costoUnitario: number
    ): Observable<RespuestaCompra> {
        return this.http.post<RespuestaCompra>(`${this.api}/nuevo`, { idProveedor, producto, costoUnitario })
    }
}