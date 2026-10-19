import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';

export interface ProductoCarrito{//Representa un producto de un carrito
    id:number
    cantidad:number
}
export interface OrdenPayPal{
    id:string
    total:string
}
export interface ResultadoPago{//Representa la confirmacion del backend
    mensaje:string
    ordenId:string
    captureId:string
    estado:string
}

@Injectable({
    providedIn: 'root',
})
export class PaypalService {
    private http = inject(HttpClient)
    private api = 'https://localhost:3000/api/paypal';

    crearOrden(productos:ProductoCarrito[]){
        return this.http.post<OrdenPayPal>(`${this.api}/orden`,{productos});
    }

    capturarOrden(ordenId:string){//Aqui capturamos el id de la orden 
        return  this.http.post<ResultadoPago>(`${this.api}/capturar/${ordenId}`,{})
    }
}
