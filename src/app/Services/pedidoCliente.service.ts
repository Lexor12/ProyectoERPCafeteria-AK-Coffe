import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PedidoCliente } from "../Models/pedidoCliente";

@Injectable({
    providedIn:'root'
})
export class PedidoClienteService{
    private api='http://localhost:3200/api/pedidos-cliente'

    constructor(private http:HttpClient){}


    // Trae únicamente los pedidos del cliente que tiene la sesión iniciada, por eso pedimos
    // el idUsuario como parámetro (después esto debería sacarse solo del token, pero mientras
    // no tengamos JWT armado se lo pasamos manual desde el componente que sepa quién es el usuario)
    // Esto llena el signal de pedidos() en la página de Pedidos del lado Cliente
    obtenerPedidosCliente(idUsuario: string):Observable<PedidoCliente[]>{
        return this.http.get<PedidoCliente[]>(`${this.api}/${idUsuario}`)
    }
}