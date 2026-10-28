import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Asistencia } from "../Models/asistencia";
import { AuthService } from "./auth.service";
@Injectable({
    providedIn: 'root'// una sola instancia para toda la app, creada la primera vez que se inyecta
})
export class AsistenciaService {
    private api = 'http://localhost:3200/api/asistencias'
    constructor(private http: HttpClient,private authService:AuthService) {}

    // Trae el historial de asistencias de un trabajador, se usa al abrir el modal de Asistencias
    obtenerAsistencias(idTrabajador: string): Observable<Asistencia[]> {
        return this.http.get<Asistencia[]>(`${this.api}/${idTrabajador}`,{
            headers:{
                Authorization: `Bearer ${this.authService.getToken()}`
            }
        })
    }

    // Se llama desde el botón de "Registrar asistencia" del modal
    registrarAsistencia(idTrabajador: string, fecha: string, horaEntrada: string, horaSalida: string): Observable<boolean> {
        return this.http.post<boolean>(this.api, 
            {
                idTrabajador,
                fecha,
                horaEntrada,
                horaSalida
            },
            {
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            }
        )
    }
}