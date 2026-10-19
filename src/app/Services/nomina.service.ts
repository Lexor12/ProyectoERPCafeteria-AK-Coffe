import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Nomina } from "../Models/nomina";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class NominaService {
    private api = 'http://localhost:3200/api/nomina'
    constructor(private http: HttpClient,private authService:AuthService) {}

    // Se llama cuando el admin elige un rango de fechas y quiere ver/descargar la nómina
    calcularNomina(idTrabajador: string, fechaInicio: string, fechaFin: string): Observable<Nomina> {
        return this.http.get<Nomina>(`${this.api}/${idTrabajador}`, {
            headers: {
                Authorization: `Bearer ${this.authService.getToken()}`
            },
            params: { fechaInicio, fechaFin }
        })
    }
}