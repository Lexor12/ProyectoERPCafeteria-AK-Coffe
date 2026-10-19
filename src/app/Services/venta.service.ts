import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RespuestaVenta } from "../Models/respuestaVenta";
import { AuthService } from "./auth.service";
@Injectable({
    providedIn:'root'
})
export class VentaService{
    private api ='http://localhost:3200/api/ventas'
    constructor(private http:HttpClient,private authService:AuthService){}

    registrarVenta(rfcCliente: string, items: { idProducto: string; cantidad: number }[]): Observable<RespuestaVenta> {
        return this.http.post<RespuestaVenta>(`${this.api}/paypal/crear`, { rfcCliente, items }, {
            headers: {
                Authorization: `Bearer ${this.authService.getToken()}`
            }
        });
    }
    procesarPagoVenta(orderID: string,rfcCliente: string,items: { idProducto: string; cantidad: number }[]):Observable<any>{
        return this.http.post('http://localhost:3200/api/ventas/paypal/capturar',{orderID,rfcCliente,items},{
            headers: {
                Authorization: `Bearer ${this.authService.getToken()}`
            }
        })
    }
}