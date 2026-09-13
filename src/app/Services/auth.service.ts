import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RespuestaLogin } from "../Models/respuestaLogin";
import { RespuestaRegistro } from "../Models/respuestaRegistro";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    private api='http://localhost:3200/api/auth'
    constructor(private http:HttpClient){}

    // Esto se llama desde el formulario de Login, mandamos correo y contraseña tal cual
    // (todavía sin hash ni token, eso lo dejamos pendiente para después), y el componente
    // revisa el campo "autenticado" de la respuesta: si es true lee "rol" para saber si
    // redirige a /admin o a /cliente, si es false muestra el mensaje de credenciales inválidas
    login(correo: string, password: string):Observable<RespuestaLogin>{
        return this.http.post<RespuestaLogin>(`${this.api}/login`, { correo, password })
    }

    // Esto es del formulario de Registro, siempre crea usuarios con rol cliente,
    // si el correo ya existe el backend regresa creado:false con un mensaje específico
    // que el componente puede mostrar directo sin tener que armar el texto manualmente
    registro(datos: { nombre: string; apellido: string; correo: string; password: string; telefono: string }):Observable<RespuestaRegistro>{
        return this.http.post<RespuestaRegistro>(`${this.api}/registro`, datos)
    }
}