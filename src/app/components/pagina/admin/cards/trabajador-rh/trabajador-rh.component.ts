import { Component,input,output } from '@angular/core';

@Component({
  selector: 'app-trabajador-rh',
  imports: [],
  templateUrl: './trabajador-rh.component.html',
  styleUrl: './trabajador-rh.component.css',
})
export class TrabajadorRhComponent {
  idTrabajador = input.required<string>();
  nombre = input.required<string>();
  apellido = input.required<string>();
  area = input.required<string>();
  fechaIngreso = input.required<string>();
  salario = input.required<number>();
  horaEntrada = input<string>('');
  horaSalida = input<string>('');

  desactivar = output<string>();
  editar = output<string>();
  asistencias = output<string>();

  clickDesactivar(): void {
    this.desactivar.emit(this.idTrabajador());
  }

  clickEditar(): void {
    this.editar.emit(this.idTrabajador());
  }

  clickAsistencias(): void {
    this.asistencias.emit(this.idTrabajador());
  }
}
