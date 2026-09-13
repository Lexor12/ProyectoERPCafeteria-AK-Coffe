import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Trabajador } from "../Models/trabajador";

@Injectable({
    providedIn:'root'
})
export class TrabajadorService{
    private api='http://localhost:3200/api/trabajadores'
    constructor(private http:HttpClient){}

    // Trae la lista de trabajadores activos, se usa en la página principal de RH,
    // el parámetro de nombre es opcional, si no se manda regresa todos, si se manda
    // el backend ya filtra por ese nombre (RQF50), así no hace falta filtrar en el front
    obtenerTrabajadores():Observable<Trabajador[]>{
        return this.http.get<Trabajador[]>(this.api)
    }

    // Esto es del formulario de "Registrar Trabajador", se manda todo menos el idTrabajador
    // porque ese lo genera la BD solo con el UUID por default
    crearTrabajador(datos: Omit<Trabajador, 'idTrabajador'>):Observable<any>{
        return this.http.post(this.api, datos)
    }

    // Se usa cuando el admin edita los datos de un trabajador ya existente desde su ficha
    editarTrabajador(idTrabajador: string, datos: Omit<Trabajador, 'idTrabajador'>):Observable<any>{
        return this.http.put(`${this.api}/${idTrabajador}`, datos)
    }

    // Este es el botón de Desactivar/Reactivar en la ficha del trabajador, no borra nada,
    // solo cambia el booleano de activo para que se deje de mostrar (o vuelva a mostrarse)
    // en el listado principal, sin perder su historial de asistencias (RQF61)
    cambiarActivoTrabajador(idTrabajador: string, activo: boolean):Observable<any>{
        return this.http.patch(`${this.api}/${idTrabajador}/activo`, { activo })
    }
}