//Este modal permite mandar de regreso del backend al frontend todas las asistencias en un formato estandarizado
export interface Asistencia {
    idAsistencia: string;
    idTrabajador: string;
    fecha: string;
    horaEntrada: string;
    horaSalida: string | null;
}