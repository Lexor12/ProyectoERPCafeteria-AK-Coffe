import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ReporteFinanza } from "../Models/reporteFinanza";

@Injectable({
    providedIn:'root'
})

export class ReporteFinanzaService{
    private api='http://localhost:3200/api/finanzas'
    constructor(private http:HttpClient){}
    
    // A diferencia de los demás GET, este SÍ necesita mandar parámetros porque el reporte
    // depende completamente del rango de fechas que el admin eligió con los botones de
    // Día/Mes/Año o con el rango personalizado (RQF47), por eso van como query params
    // en vez de ir en la URL directo, así queda más claro que son filtros, no un id
    obtenerReporteFinanza(fechaInicio: string, fechaFin: string):Observable<ReporteFinanza>{
        return this.http.get<ReporteFinanza>(`${this.api}/reporte`, {
            params: { fechaInicio, fechaFin }
        })
    }
}