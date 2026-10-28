import { Component, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { ReporteFinanzaService } from '../../../../Services/reporteFinanzas.service';
import { ReporteFinanza } from '../../../../Models/reporteFinanza';
import { DatoFinanciero } from '../../../../Models/datoFinanciero.model';

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
        alert(error.error?.mensaje ?? 'No se pudo generar el reporte')
      }
    });
  }

  dibujarGrafica(reporte: ReporteFinanza): void {
    // Cada registro llega con fecha y hora ('yyyy-MM-dd HH:mm:ss').
    // Si el reporte es de un solo día, la etiqueta del eje X es la hora ('08:00');
    // si es de varios días, es el día ('2026-09-13')
    const esUnSoloDia = reporte.fechaInicio === reporte.fechaFin;

    const etiquetaDe = (fecha: string): string => {
      return esUnSoloDia ? fecha.substring(11, 13) + ':00' : fecha.substring(0, 10);
    };

    // Junta los registros que caen en la misma hora (o día), sumando sus montos
    const sumarPorEtiqueta = (lista: DatoFinanciero[]): Map<string, number> => {
      const montos = new Map<string, number>();
      for (const dato of lista) {
        const etiqueta = etiquetaDe(dato.fecha);
        montos.set(etiqueta, (montos.get(etiqueta) ?? 0) + dato.monto);
      }
      return montos;
    };

    const ventas = sumarPorEtiqueta(reporte.detalleVentas);
    const compras = sumarPorEtiqueta(reporte.detalleCompras);
    const nomina = sumarPorEtiqueta(reporte.detalleNomina);

    // Un solo día: eje X con las 24 horas. Varios días: las fechas que aparecen, sin repetir y ordenadas
    const todasLasFechas = esUnSoloDia
      ? Array.from({ length: 24 }, (_, hora) => `${String(hora).padStart(2, '0')}:00`)
      : [...new Set([...ventas.keys(), ...compras.keys(), ...nomina.keys()])].sort();

    // Monto de cada etiqueta (0 si no hubo movimiento), redondeado a 2 decimales
    const montoDe = (montos: Map<string, number>, etiqueta: string): number => {
      return Math.round((montos.get(etiqueta) ?? 0) * 100) / 100;
    };

    // Si ya había una gráfica dibujada antes, la destruimos, si no Chart.js las va apilando
    if (this.grafica) {
      this.grafica.destroy();
    }

    this.grafica = new Chart(this.graficaCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: todasLasFechas,
        datasets: [
          {
            label: 'Ingresos (ventas)',
            data: todasLasFechas.map(etiqueta => montoDe(ventas, etiqueta)),
            borderColor: '#2e7d32',
            backgroundColor: '#2e7d32',
          },
          {
            label: 'Egresos (compras)',
            data: todasLasFechas.map(etiqueta => montoDe(compras, etiqueta)),
            borderColor: '#c62828',
            backgroundColor: '#c62828',
          },
          {
            label: 'Egresos (nómina)',
            data: todasLasFechas.map(etiqueta => montoDe(nomina, etiqueta)),
            borderColor: '#ef6c00',
            backgroundColor: '#ef6c00',
          }
        ]
      }
    });
  }
  clickExportarPDF(): void {
    window.print();
  }
}