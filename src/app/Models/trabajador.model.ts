// Representa a un trabajador de RH
// estos almacenan lo datos suficientes para ver los detalles de cada uno y crear nuevos
export interface Trabajador {
    idTrabajador: string;
    nombre: string;
    apellido: string;
    area: string;
    fechaIngreso: string; // formato ISO: yyyy-MM-dd
    salario: number;
    rfc: string; // obligatorio para el trabajador (a diferencia del RFC del cliente que es opcional)
    horaEntrada: string; // formato 24h: HH:mm
    horaSalida: string;  // formato 24h: HH:mm
}