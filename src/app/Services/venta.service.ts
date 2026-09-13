import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RespuestaVenta } from "../Models/respuestaVenta";
@Injectable({
    providedIn:'root'
})
export class VentaService{
    private api ='http://localhost:3200/api/ventas'
    constructor(private http:HttpClient){}

    registrarVenta(idUsuario: string, rfcCliente: string, items: { idProducto: string; cantidad: number }[]): Observable<RespuestaVenta> {
        return this.http.post<RespuestaVenta>(`${this.api}`, { idUsuario, rfcCliente, items });
    }
}