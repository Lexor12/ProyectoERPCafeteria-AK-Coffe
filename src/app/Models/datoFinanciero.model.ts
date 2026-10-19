// Representa un solo punto de dato para la gráfica (por ejemplo, un día o un mes con su monto)
export interface DatoFinanciero {
    fecha: string; // yyyy-MM-dd, o el label que corresponda según el periodo (día/mes/año)
    monto: number;
}