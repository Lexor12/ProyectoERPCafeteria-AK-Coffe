import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PedidoCliente } from "../Models/pedidoCliente";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class PedidoClienteService{
    private api='http://localhost:3200/api/pedidos-cliente'

    constructor(private http:HttpClient,private authService:AuthService){}


    // Trae únicamente los pedidos del cliente que tiene la sesión iniciada usando el token que actualmente esta guardado y validado
    //tenemos que mandar el token mediante el header como bearer token
    obtenerPedidosCliente():Observable<PedidoCliente[]>{
        return this.http.get<PedidoCliente[]>(`${this.api}`,{
            headers:{
                Authorization: `Bearer ${this.authService.getToken()}`
            }
        })
    }
}