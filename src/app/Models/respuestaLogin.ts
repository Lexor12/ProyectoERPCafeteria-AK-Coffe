// Esta interfaz solo es para la respuesta del login,
// no representa una entidad de la BD como tal, es más bien "resultado de una acción"
export interface RespuestaLogin {
    autenticado: boolean;
    idUsuario?: string;
    nombre?: string;
    apellido?: string;
    correo?: string;
    rol?: string; // 'administrador' o 'cliente', esto es lo que usa el componente para decidir a dónde redirigir
}