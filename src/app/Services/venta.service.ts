import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { RespuestaVenta } from "../Models/respuestaVenta";
import { AuthService } from "./auth.service";
import { RespuestaPago } from "../Models/respuestaPago";
@Injectable({
    providedIn:'root'
})
export class VentaService{
    private api ='http://localhost:3200/api/ventas'
    constructor(private http:HttpClient,private authService:AuthService){}
    //Esta función se encarga de registrar las ventas para un cliente, esta manda al endpoint los datos y devuelve una dirección de paypal para hacer el pago
    //Si da error se procesa el error al suscribirse
    registrarVenta(rfcCliente: string,confirmacionTerminosYCondiciones:boolean, items: { idProducto: string; cantidad: number }[]): Observable<RespuestaPago> {
        return this.http.post<RespuestaPago>(`${this.api}/paypal/crear`, { rfcCliente,confirmacionTerminosYCondiciones, items }, {
            headers: {
                Authorization: `Bearer ${this.authService.getToken()}`
            }
        });
    }
    //Se llama cuando el cliente regresa de PayPal con el pago aprobado, el backend captura el pago, valida el monto y registra la venta.
    procesarPagoVenta(orderID: string,rfcCliente: string,items: { idProducto: string; cantidad: number }[]):Observable<RespuestaVenta>{
        return this.http.post<RespuestaVenta>(`${this.api}/paypal/capturar`,{orderID,rfcCliente,items},{
            headers: {
                Authorization: `Bearer ${this.authService.getToken()}`
            }
        })
    }
}