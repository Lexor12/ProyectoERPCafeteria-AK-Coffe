// Representa un solo punto de dato para la gráfica (por ejemplo, un día o un mes con su monto)
export interface DatoFinanciero {
    fecha: string; // yyyy-MM-dd, o el label que corresponda según el periodo (día/mes/año)
    monto: number;
}

// Representa el reporte financiero completo que arma el backend según el rango de fechas,
// esto NO es un pedido ni una compra individual, es el resultado ya calculado/agrupado
// (el backend es quien suma todas las ventas y compras del rango, aquí solo llega el resultado)
export interface ReporteFinanza {
    fechaInicio: string;
    fechaFin: string;
    ingresos: number; // suma total de ventas en el rango
    egresos: number;  // suma total de compras en el rango
    balance: number;  // ingresos - egresos (aunque esto también se podría calcular en el front con computed)
    detalleVentas: DatoFinanciero[];  // para la gráfica de ventas
    detalleCompras: DatoFinanciero[]; // para la gráfica de compras
}
/*
RAZÓN DE ESTO:

Bueno, la sección de finanzas solo hace 4 cosas:
* Mostrar el total ganado
* Mostrar el total gastado
* Mostrar el balance (relación entre ganado y gastado)
* Grafica con respecto al tiempo, en cuanto a ganado y gastado

! TODO ESTO EN BASE A UN RANGO DE FECHAS

Así que tenemos 2 opciones: 
1. Solicitar en un objeto que haga referencia a cada venta y otro a cada compra y manualmente aqui hacer los calculos
2. Solicitar 1 solo objeto procesado por el backend que devuelva exactamente en un periodo de fecha de inicio y fin los datos anteriores, digamos
total de ingresos y egresesos, y los valores de todas las ventas de cierto rango de dias (usados para graficas, no importa tanto quien fue o quien no fue)
*/