// Aqui guardo lo mínimo que necesito saber del usuario que inició sesión,
// esto luego se reemplaza por el sistema de JWT, esto puede ser que solo guarda el token y rol, no los demás datos
export interface UsuarioSesion {
    idUsuario: string;
    nombre: string;
    apellido: string;
    rol: string; // 'administrador' o 'cliente'
}