// Resultado de validar el carrito contra el stock real antes de pagar,
// no es una entidad de la BD, es "resultado de una acción"
export interface ResultadoValidacionCarrito {
    valido: boolean;
    excedidos?: any[];
}