import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ProductoCarrito } from "../Models/productoCarrito";
import { ResultadoValidacionCarrito } from "../Models/resultadoValidacionCarrito";
@Injectable({
    providedIn:'root'
})
export class ProductoCarritoService{
    private api='http://localhost:3200/api/carrito'
    constructor(private http:HttpClient){}

    // Trae el catálogo con stock disponible, se usa para armar el carrito desde cero,
    // aquí cada producto llega con cantidad en 0 porque esa parte la controla el front
    // conforme el cliente le va dando clic a "Agregar"
    obtenerProductosCarrito():Observable<ProductoCarrito[]>{
        return this.http.get<ProductoCarrito[]>(`${this.api}/productos`)
    }

    // Esto se llama justo antes de mandar al cliente a pagar con PayPal, le mandamos
    // la lista de productos con la cantidad que quiere comprar, y el backend checa que
    // ninguno se pase del stock real que hay en la BD (RQF28), esto evita que alguien
    // compre más de lo que hay aunque haya manipulado el front
    validarCarrito(items: { idProducto: string; cantidad: number }[]):Observable<ResultadoValidacionCarrito>{
        return this.http.post<ResultadoValidacionCarrito>(`${this.api}/validar`, { items })
    }
}