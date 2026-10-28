import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Trabajador } from "../Models/trabajador";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class TrabajadorService{
    private api='http://localhost:3200/api/trabajadores'
    constructor(private http:HttpClient,private authService:AuthService){}

    // Trae los trabajadores activos para RH, el filtro por área y por nombre se hace en el componente
    obtenerTrabajadores():Observable<Trabajador[]>{
        return this.http.get<Trabajador[]>(this.api,{headers:{
                Authorization: `Bearer ${this.authService.getToken()}`
            }})
    }

    // Esto es del formulario de "Registrar Trabajador", se manda todo menos el idTrabajador porque ese lo genera el backend 
    crearTrabajador(datos: Omit<Trabajador, 'idTrabajador'>):Observable<any>{
        return this.http.post(this.api, datos,
            {
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            })
    }

    // Se usa cuando el admin edita los datos de un trabajador ya existente desde su ficha
    editarTrabajador(idTrabajador: string, datos: Omit<Trabajador, 'idTrabajador'>):Observable<any>{
        return this.http.put(`${this.api}/${idTrabajador}`,datos,
            {
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            })
    }

    // Este es el botón de Desactivar/Reactivar en la ficha del trabajador, no borra nada,
    // solo cambia el booleano de activo para que se deje de mostrar (o vuelva a mostrarse)
    // en el listado principal, sin perder su historial de asistenciaS
    cambiarActivoTrabajador(idTrabajador: string, activo: boolean):Observable<any>{
        return this.http.patch(`${this.api}/${idTrabajador}/activo`, { activo },
            {
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            })
    }
}