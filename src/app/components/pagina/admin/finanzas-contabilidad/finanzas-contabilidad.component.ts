import { Component, signal, computed  } from '@angular/core';
import { CommonModule } from '@angular/common';

type Periodo = 'dia' | 'mes' | 'anio';

@Component({
  selector: 'app-finanzas-contabilidad.component',
  imports: [CommonModule],
  templateUrl: './finanzas-contabilidad.component.html',
  styleUrl: './finanzas-contabilidad.component.css',
})
export class FinanzasContabilidadComponent {
  ingresos = signal<number>(23100);
  egresos = signal<number>(3100);
  balance = computed(() => this.ingresos() - this.egresos());

  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');
  periodo = signal<Periodo>('dia');

  actualizarFechaInicio(evento: Event): void {
    this.fechaInicio.set((evento.target as HTMLInputElement).value);
  }

  actualizarFechaFin(evento: Event): void {
    this.fechaFin.set((evento.target as HTMLInputElement).value);
  }

  cambiarPeriodo(periodo: Periodo): void {
    this.periodo.set(periodo);
  }

  clickAplicar(): void {
    //Aquí eventualmente se recalcularían ingresos/egresos/balance según el rango de fechas y el periodo
    console.log('Aplicar filtro', this.fechaInicio(), this.fechaFin(), this.periodo());
  }

  clickBorrar(): void {
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.periodo.set('dia');
  }

  clickExportarPDF(): void {
    //Aquí eventualmente se generaría el PDF con los datos actuales
    console.log('Exportar PDF');
  }
}
