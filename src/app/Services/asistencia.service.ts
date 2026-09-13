import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Asistencia } from "../Models/asistencia";
@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {
    private api = 'http://localhost:3200/api/asistencias'
    constructor(private http: HttpClient) {}

    // Trae el historial de asistencias de un trabajador, se usa al abrir el modal de Asistencias
    obtenerAsistencias(idTrabajador: string): Observable<Asistencia[]> {
        return this.http.get<Asistencia[]>(`${this.api}/${idTrabajador}`)
    }

    // Se llama desde el botón de "Registrar asistencia" del modal
    registrarAsistencia(idTrabajador: string, fecha: string, horaEntrada: string, horaSalida: string): Observable<any> {
        return this.http.post(this.api, { idTrabajador, fecha, horaEntrada, horaSalida })
    }
}