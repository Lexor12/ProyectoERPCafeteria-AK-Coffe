import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Proveedor } from "../Models/proveedor";
import { AuthService } from "./auth.service";


@Injectable({
    providedIn: 'root'
})
export class ProveedorService {
    private api = 'http://localhost:3200/api/proveedores'
    constructor(private http: HttpClient,private authService:AuthService) {}

    // Trae los proveedores activos, se usa para el <select> del filtro y para el modal
    // de agregar producto (donde el admin elige a qué proveedor asociarlo)
    obtenerProveedores(): Observable<Proveedor[]> {
        return this.http.get<Proveedor[]>(this.api,{headers:{
                Authorization: `Bearer ${this.authService.getToken()}`
            }})
    }

    //Se usa en el modal de "Nuevo proveedor"
    crearProveedor(nombre: string, telefono: string): Observable<any> {
        return this.http.post(this.api, { nombre, telefono },
            {
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            })
    }
    //Se usa en el modal de edición, con el proveedor seleccionado en el filtro
    editarProveedor(idProveedor:string,nombre: string, telefono: string): Observable<any> {
        return this.http.put(`${this.api}/${idProveedor}`, { nombre, telefono },
            {
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            })
    }
    //Botón "Desactivar proveedor": no se borra, el backend lo marca inactivo y elimina sus asociaciones con productos
    desactivarProveedor(idProveedor:string): Observable<any> {
        return this.http.delete(`${this.api}/${idProveedor}`,{headers:{
                Authorization: `Bearer ${this.authService.getToken()}`
        }})
    }
}