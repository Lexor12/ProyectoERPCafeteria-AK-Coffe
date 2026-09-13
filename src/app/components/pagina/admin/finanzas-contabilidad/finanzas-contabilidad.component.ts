import { Component, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { ReporteFinanzaService } from '../../../../Services/reporteFinanzas.service';

@Component({
  selector: 'app-finanzas-contabilidad.component',
  imports: [CommonModule],
  templateUrl: './finanzas-contabilidad.component.html',
  styleUrl: './finanzas-contabilidad.component.css',
})
export class FinanzasContabilidadComponent implements AfterViewInit {
  // Referencia al canvas del HTML, para poder dibujar la grafica ahi
  @ViewChild('graficaCanvas') graficaCanvas!: ElementRef<HTMLCanvasElement>;

  // Esta variable no es signal porque no se muestra directo en el HTML, solo la usamos
  // para poder destruir la grafica anterior antes de dibujar una nueva
  grafica: Chart | null = null;

  constructor(private reporteFinanzaService: ReporteFinanzaService) {}

  ingresos = signal<number>(0);
  egresos = signal<number>(0);
  balance = computed(() => this.ingresos() - this.egresos());

  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  periodo = signal<string>('dia');

  ngAfterViewInit(): void {
    // Cuando el componente ya esta listo (y el canvas ya existe en el HTML),
    // cargamos el reporte del periodo por defecto, que es "dia"
    this.seleccionarPeriodoDia();
  }

  actualizarFechaInicio(evento: Event): void {
    this.fechaInicio.set((evento.target as HTMLInputElement).value);
  }

  actualizarFechaFin(evento: Event): void {
    this.fechaFin.set((evento.target as HTMLInputElement).value);
  }

  // Convierte una fecha a texto yyyy-MM-dd, que es el formato que espera el backend
  formatoFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  seleccionarPeriodoDia(): void {
    this.periodo.set('dia');
    const hoy = new Date();
    const fechaHoy = this.formatoFecha(hoy);
    this.cargarReporte(fechaHoy, fechaHoy);
  }

  seleccionarPeriodoMes(): void {
    this.periodo.set('mes');
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.cargarReporte(this.formatoFecha(primerDiaMes), this.formatoFecha(hoy));
  }

  seleccionarPeriodoAnio(): void {
    this.periodo.set('anio');
    const hoy = new Date();
    const primerDiaAnio = new Date(hoy.getFullYear(), 0, 1);
    this.cargarReporte(this.formatoFecha(primerDiaAnio), this.formatoFecha(hoy));
  }

  clickAplicar(): void {
    if (!this.fechaInicio() || !this.fechaFin()) {
      alert('Falta la fecha de inicio o la fecha de fin');
      return;
    }
    if (new Date(this.fechaInicio()) > new Date(this.fechaFin())) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }
    // Aqui ya no forzamos ningun periodo, el admin definio su propio rango a mano
    this.periodo.set('');
    this.cargarReporte(this.fechaInicio(), this.fechaFin());
  }

  clickBorrar(): void {
    this.fechaInicio.set('');
    this.fechaFin.set('');
    // Al borrar el filtro personalizado, regresamos al periodo por defecto
    this.seleccionarPeriodoDia();
  }

  cargarReporte(fechaInicio: string, fechaFin: string): void {
    this.reporteFinanzaService.obtenerReporteFinanza(fechaInicio, fechaFin).subscribe({
      next: (reporte) => {
        this.ingresos.set(reporte.ingresos);
        this.egresos.set(reporte.egresos);
        this.dibujarGrafica(reporte);
      },
      error: (error) => {
        alert('No se pudo generar el reporte');
      }
    });
  }

  dibujarGrafica(reporte: { detalleVentas: { fecha: string; monto: number }[]; detalleCompras: { fecha: string; monto: number }[] }): void {
    // Juntamos todas las fechas que aparecen en ventas y en compras, sin repetir,
    // y las ordenamos, para que las dos lineas de la grafica usen el mismo eje X
    const fechasVentas = reporte.detalleVentas.map(v => v.fecha);
    const fechasCompras = reporte.detalleCompras.map(c => c.fecha);
    const todasLasFechas = [...new Set([...fechasVentas, ...fechasCompras])].sort();

    // Por cada fecha del eje X, buscamos si hay un monto para ese dia, si no hay ponemos 0
    const datosIngresos = todasLasFechas.map(fecha => {
      const venta = reporte.detalleVentas.find(v => v.fecha === fecha);
      return venta ? venta.monto : 0;
    });

    const datosEgresos = todasLasFechas.map(fecha => {
      const compra = reporte.detalleCompras.find(c => c.fecha === fecha);
      return compra ? compra.monto : 0;
    });

    // Si ya habia una grafica dibujada antes, la destruimos, si no Chart.js las va apilando
    if (this.grafica) {
      this.grafica.destroy();
    }

    this.grafica = new Chart(this.graficaCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: todasLasFechas,
        datasets: [
          {
            label: 'Ingresos',
            data: datosIngresos,
            borderColor: '#2e7d32',
            backgroundColor: '#2e7d32',
          },
          {
            label: 'Egresos',
            data: datosEgresos,
            borderColor: '#c62828',
            backgroundColor: '#c62828',
          }
        ]
      }
    });
  }

  clickExportarPDF(): void {
    window.print();
  }
}