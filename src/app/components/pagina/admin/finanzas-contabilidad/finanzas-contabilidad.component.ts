import { Component, signal, computed  } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  // Guarda cuál botón de periodo está seleccionado actualmente (dia/mes/anio),
  // el HTML lo usa para marcar visualmente el botón activo con la clase --activo
  periodo = signal<string>('dia'); // "dia" por defecto, cuadra con el botón que se ve resaltado al abrir

  actualizarFechaInicio(evento: Event): void {
    this.fechaInicio.set((evento.target as HTMLInputElement).value);
  }

  actualizarFechaFin(evento: Event): void {
    this.fechaFin.set((evento.target as HTMLInputElement).value);
  }

  seleccionarPeriodoDia(): void {
    this.periodo.set('dia');
    //Aqui se recalcularía segun los datos que correspondan al día de hoy
  }
  seleccionarPeriodoMes(): void {
    this.periodo.set('mes');
    //Aqui se recalcularía segun los datos que correspondan al Mes
  }
  seleccionarPeriodoAnio(): void {
    this.periodo.set('anio');
    //Aqui se recalcularía segun los datos que correspondan al Año
  }

  clickAplicar(): void {
    //Aquí eventualmente se recalcularían ingresos/egresos/balance según el rango de fechas y el periodo
  }

  clickBorrar(): void {
    this.fechaInicio.set('');
    this.fechaFin.set('');
  }

  clickExportarPDF(): void {
    //Aquí eventualmente se generaría el PDF con los datos actuales
    console.log('Exportar PDF');
  }
}
