import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PedidoAdmin } from "../Models/pedidoAdmin";

@Injectable({
    providedIn:'root'
})
export class PedidoAdminService{
    private api = 'http://localhost:3200/api/pedidos-admin'
    constructor(private http:HttpClient){}

    // Trae todos los pedidos ya agrupados (un pedido = un idVenta con su arreglo de productos),
    // esto se usa en la página de Pedidos de Admin para llenar el signal de pedidos() al inicio,
    // de ahí en adelante el filtrado (entregado/cancelado/nombre) ya lo hace el computed en el front
    obtenerPedidosAdmin():Observable<PedidoAdmin[]>{
        return this.http.get<PedidoAdmin[]>(this.api);
    }

    // Esto se llama cuando el admin da clic en "Marcar como Entregado" en la card de un pedido,
    // le mandamos el nuevo valor de entregado, y ya cuando responda bien actualizamos el signal local
    // con el mismo patrón que ya tenía (pedidos.update) para no tener que recargar todo de nuevo
    marcarEntregado(idVenta: string, entregado: boolean): Observable<any>{
        return this.http.patch(`${this.api}/${idVenta}/entregado`, { entregado });
    }

    // Igual que la de arriba pero para el botón de Cancelar, nada más cambia el campo que se manda
    marcarCancelado(idVenta: string, cancelado: boolean): Observable<any>{
        return this.http.patch(`${this.api}/${idVenta}/cancelado`, { cancelado });
    }

}