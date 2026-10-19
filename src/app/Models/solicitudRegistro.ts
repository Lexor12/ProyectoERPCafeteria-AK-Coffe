//Este modelo refiere a la solicitud de solicitudRegistro, la cual se envia al Backend para registrar un nuevo usuario
export interface solicitudRegistro{
    nombre:string,
    apellido: string,
    correo: string,
    telefono: string,
    password: string,
    confirmacionTerminosYCondiciones:boolean
}