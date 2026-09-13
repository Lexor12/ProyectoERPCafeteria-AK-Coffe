import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Proveedor } from "../Models/proveedor";


@Injectable({
    providedIn: 'root'
})
export class ProveedorService {
    private api = 'http://localhost:3200/api/proveedores'
    constructor(private http: HttpClient) {}

    // Trae los proveedores activos, se usa para el <select> del filtro y para el modal
    // de agregar producto (donde el admin elige a qué proveedor asociarlo)
    obtenerProveedores(): Observable<Proveedor[]> {
        return this.http.get<Proveedor[]>(this.api)
    }

    // Se usa en el modal de "Nuevo proveedor"
    crearProveedor(nombre: string, telefono: string): Observable<any> {
        return this.http.post(this.api, { nombre, telefono })
    }
}