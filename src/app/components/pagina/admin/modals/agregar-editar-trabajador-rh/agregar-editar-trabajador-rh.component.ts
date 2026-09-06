import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-agregar-editar-trabajador-rh',
  imports: [],
  templateUrl: './agregar-editar-trabajador-rh.component.html',
  styleUrl: './agregar-editar-trabajador-rh.component.css',
})
export class AgregarEditarTrabajadorRhComponent {
  idTrabajador = input<string>(''); // vacío = modo "agregar", con valor = modo "editar"
  nombreInicial = input<string>('');
  apellidoInicial = input<string>('');
  areaInicial = input<string>('');
  fechaIngresoInicial = input<string>('');
  salarioInicial = input<number>(0);
  rfcInicial = input<string>('');
  horaEntradaInicial = input<string>('');
  horaSalidaInicial = input<string>('');

  nombre = signal<string>('');
  apellido = signal<string>('');
  area = signal<string>('');
  fechaIngreso = signal<string>('');
  salario = signal<number>(0);
  rfc = signal<string>('');
  horaEntrada = signal<string>('');
  horaSalida = signal<string>('');

  constructor() {
    effect(() => {
      this.nombre.set(this.nombreInicial());
      this.apellido.set(this.apellidoInicial());
      this.area.set(this.areaInicial());
      this.fechaIngreso.set(this.fechaIngresoInicial());
      this.salario.set(this.salarioInicial());
      this.rfc.set(this.rfcInicial());
      this.horaEntrada.set(this.horaEntradaInicial());
      this.horaSalida.set(this.horaSalidaInicial());
    });
  }

  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{
    idTrabajador: string; nombre: string; apellido: string; area: string; fechaIngreso: string;
    salario: number; rfc: string; horaEntrada: string; horaSalida: string;
  }>();

  actualizarNombre(evento: Event): void { this.nombre.set((evento.target as HTMLInputElement).value); }
  actualizarApellido(evento: Event): void { this.apellido.set((evento.target as HTMLInputElement).value); }
  actualizarArea(evento: Event): void { this.area.set((evento.target as HTMLInputElement).value); }
  actualizarFechaIngreso(evento: Event): void { this.fechaIngreso.set((evento.target as HTMLInputElement).value); }
  actualizarSalario(evento: Event): void { this.salario.set(Number((evento.target as HTMLInputElement).value)); }
  actualizarRfc(evento: Event): void { this.rfc.set((evento.target as HTMLInputElement).value); }
  actualizarHoraEntrada(evento: Event): void { this.horaEntrada.set((evento.target as HTMLInputElement).value); }
  actualizarHoraSalida(evento: Event): void { this.horaSalida.set((evento.target as HTMLInputElement).value); }

  clickCerrar(): void { this.cerrar.emit(); }
  clickCancelar(): void { this.cancelar.emit(); }

  clickAceptar(): void {
    this.aceptar.emit({
      idTrabajador: this.idTrabajador(),
      nombre: this.nombre(), apellido: this.apellido(), area: this.area(),
      fechaIngreso: this.fechaIngreso(), salario: this.salario(), rfc: this.rfc(),
      horaEntrada: this.horaEntrada(), horaSalida: this.horaSalida(),
    });
  }
}