import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RespuestaLogin } from "../Models/respuestaLogin";
import { RespuestaRegistro } from "../Models/respuestaRegistro";

import { isPlatformBrowser } from '@angular/common';
import { Inject,PLATFORM_ID } from '@angular/core';
import { solicitudRegistro } from "../Models/solicitudRegistro";
import { solicitudLogin } from "../Models/solicitudLogin";

@Injectable({//Este service maneja la comunicación con el backend y la sesión guardada en el navegador
    providedIn:'root'// una sola instancia para toda la app, creada la primera vez que se inyecta
})
export class AuthService{
    private api='http://localhost:3200/api/auth'
    constructor(private http:HttpClient, @Inject(PLATFORM_ID) private platformId: Object){
        // Recuperar la sesión al iniciar la aplicación
        if (isPlatformBrowser(this.platformId)) {
            this.sesionActiva.set(!!localStorage.getItem('token'));
            this.rolActual.set(localStorage.getItem('rol'));
        }
    }
    // Estado reactivo compartido por toda la aplicación
    sesionActiva = signal(false);
    rolActual = signal<string | null>(null);

    // Esto se llama desde el formulario de Login, mandamos correo y contraseña y nos retorna un objeto RespuestaLogin que contiene el token de acceso y datos del usuario
    login(solicitud:solicitudLogin):Observable<RespuestaLogin>{
        return this.http.post<RespuestaLogin>(`${this.api}/login`, solicitud)
    }

    // Esto es del formulario de Registro, siempre crea usuarios con rol cliente,
    // si el correo ya existe el backend regresa creado:false con un mensaje específico
    // que el componente puede mostrar directo sin tener que armar el texto manualmente
    registro(datos: solicitudRegistro):Observable<RespuestaRegistro>{
        return this.http.post<RespuestaRegistro>(`${this.api}/registro`, datos)
    }
    //Guarda la sesión en localStorage (solo en el navegador, en el servidor localStorage no existe)
    guardarSesion(respuestaLogin: RespuestaLogin): void {
        if (!isPlatformBrowser(this.platformId)) return;

        localStorage.setItem('token', respuestaLogin.token);
        localStorage.setItem('nombre', respuestaLogin.nombre);
        localStorage.setItem('apellido', respuestaLogin.apellido);
        localStorage.setItem('correo', respuestaLogin.correo);
        localStorage.setItem('rol', respuestaLogin.rol);

        // Actualizamos las señales para que toda la aplicación reaccione
        this.sesionActiva.set(true);
        this.rolActual.set(respuestaLogin.rol);
    }
    //Los siguientes tres leen lo guardado; devuelven null si no hay nada o si corre en el servidor
    getToken(){
        if(!isPlatformBrowser(this.platformId))return null;
        return localStorage.getItem('token')
    }
    getNombre(){
        if(!isPlatformBrowser(this.platformId))return null;
        return localStorage.getItem('nombre')
    }
    getApellido(){
        if(!isPlatformBrowser(this.platformId))return null;
        return localStorage.getItem('apellido')
    }
    getCorreo(){
        if(!isPlatformBrowser(this.platformId))return null;
        return localStorage.getItem('correo')
    }
    getRol(){
        if(!isPlatformBrowser(this.platformId))return null;
        return localStorage.getItem('rol')
    }
    //Revisa si el rol del usuario está dentro de los roles permitidos de la ruta
    tieneRolPermitido(roles:string[]):boolean{
        if (!this.estaAutenticado()) return false;
        const rol = this.rolActual();
        return rol !== null && roles.includes(rol);
        /*if(!isPlatformBrowser(this.platformId))return false;
        const rol=  this.getRol()
        return rol!==null && roles.includes(rol)*/
    }
    //Hay sesión si existe un token guardado (no revisa si ya expiró)
    estaAutenticado():boolean{
        /*if(!isPlatformBrowser(this.platformId))return false;
        return this.getRol()!==null*/
        if (!isPlatformBrowser(this.platformId)) return false;
            const token = this.getToken();
            if (!token) return false;
            try {
                const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));
                if (payload.exp * 1000 < Date.now()) {
                    this.cerrarSesion(); // Expiró: borramos todo para evitar inconsistencias
                    return false;
                }
                return true;
            } catch {
                this.cerrarSesion(); // Token mal formado
                return false;
            }
    }
    //Cierra sesión borrando todo lo guardado
    cerrarSesion(){
        if(!isPlatformBrowser(this.platformId))return;
        localStorage.removeItem('token')
        localStorage.removeItem('nombre')
        localStorage.removeItem('apellido')
        localStorage.removeItem('correo')
        localStorage.removeItem('rol')

        this.sesionActiva.set(false);
        this.rolActual.set(null);
    }
}
/*
ANTES DE DECLARAR AQUI HTTP CLIENTE, debemos 
declarar en app.config.ts
import { provideHttpClient } from '@angular/common/http';

para poder hacer consultas externas
*/