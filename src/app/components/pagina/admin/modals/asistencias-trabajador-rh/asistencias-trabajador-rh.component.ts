import { Component, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'app-asistencias-trabajador-rh',
  imports: [],
  templateUrl: './asistencias-trabajador-rh.component.html',
  styleUrl: './asistencias-trabajador-rh.component.css',
})
export class AsistenciasTrabajadorRhComponent {
  idTrabajador = input.required<string>();
  nombre = input.required<string>();
  apellido = input.required<string>();
  horaEntrada = input.required<string>();
  horaSalida = input.required<string>();

  // Mostramos esto de ejemplo para cualquier trabajador, pero en un futuro lo ideal es tener un
  // Model y que este arreglo use ese Model, y que los datos se obtengan de la BD
  asistencias = signal<{ dia: string; horaEntrada: string; horaSalida: string }[]>([
    { dia: '5/09/2026', horaEntrada: '8:05 a.m', horaSalida: '5:09 p.m' },
    { dia: '6/09/2026', horaEntrada: '8:05 a.m', horaSalida: '5:09 p.m' },
    { dia: '7/09/2026', horaEntrada: '8:05 a.m', horaSalida: '5:09 p.m' },
    { dia: '8/09/2026', horaEntrada: '8:05 a.m', horaSalida: '5:09 p.m' },
    { dia: '9/09/2026', horaEntrada: '8:05 a.m', horaSalida: '5:09 p.m' },
    { dia: '10/09/2026', horaEntrada: '8:05 a.m', horaSalida: '5:09 p.m' },
  ]);

  nuevaHoraEntrada = signal<string>('');
  nuevaHoraSalida = signal<string>('');
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');
  fechaAsistencia = signal<string>('');

  // Por ahora este valor esta fijo, pero a futuro debe calcularse dividiendo el salario mensual
  // del trabajador entre 30 (segun lo que dice RQF57), no quedarse como numero fijo
  salarioDiario = signal<number>(240);

  // Usamos computed para que automáticamente se actualice el valor en la interfaz
  diasTrabajados = computed(() => this.asistencias().length);
  totalAPagar = computed(() => this.diasTrabajados() * this.salarioDiario());

  cerrar = output<void>();
  registrarAsistencia = output<{ idTrabajador: string; horaEntrada: string; horaSalida: string }>();
  descargarNomina = output<{ idTrabajador: string; fechaInicio: string; fechaFin: string }>();

  actualizarFechaInicio(evento: Event): void {
    this.fechaInicio.set((evento.target as HTMLInputElement).value);
  }

  actualizarFechaFin(evento: Event): void {
    this.fechaFin.set((evento.target as HTMLInputElement).value);
  }

  actualizarAsistencia(evento: Event): void {
    this.fechaAsistencia.set((evento.target as HTMLInputElement).value);
  }

  clickAceptarAsistencia(): void {
    // Ojo, nuevaHoraEntrada y nuevaHoraSalida en el HTML estan en readonly y nunca se les hace
    // .set(), entonces ahorita esto siempre manda las horas vacias, falta conectar eso
    this.registrarAsistencia.emit({
      idTrabajador: this.idTrabajador(),
      horaEntrada: this.nuevaHoraEntrada(),
      horaSalida: this.nuevaHoraSalida(),
    });
  }

  clickCancelarAsistencia(): void {
    this.nuevaHoraEntrada.set('');
    this.nuevaHoraSalida.set('');
  }

  clickDescargarNomina(): void {
    this.descargarNomina.emit({
      idTrabajador: this.idTrabajador(),
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
    });
  }

  clickCerrar(): void {
    this.cerrar.emit();
  }
}