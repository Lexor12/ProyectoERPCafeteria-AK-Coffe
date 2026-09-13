//Esta es importante para devolver los datos para crear o devolver una "nomina"
export interface Nomina {
    nombre: string;
    apellido: string;
    area: string;
    rfc: string;
    fechaInicio: string;
    fechaFin: string;
    diasTrabajados: number;
    salarioDiario: number;
    totalAPagar: number;
}