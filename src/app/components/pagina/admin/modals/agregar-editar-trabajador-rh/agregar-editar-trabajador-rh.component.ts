import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-agregar-editar-trabajador-rh',
  imports: [],
  templateUrl: './agregar-editar-trabajador-rh.component.html',
  styleUrl: './agregar-editar-trabajador-rh.component.css',
})
export class AgregarEditarTrabajadorRhComponent {
  // Inputs que recibe desde el componente padre
  idTrabajador = input<string>('');
  nombreInicial = input<string>('');
  apellidoInicial = input<string>('');
  areaInicial = input<string>('');
  fechaIngresoInicial = input<string>('');
  salarioInicial = input<number>(0);
  rfcInicial = input<string>('');
  horaEntradaInicial = input<string>('');
  horaSalidaInicial = input<string>('');

  // Signals para manejar los datos del formulario localmente
  nombre = signal<string>('');
  apellido = signal<string>('');
  area = signal<string>('');
  fechaIngreso = signal<string>('');
  salario = signal<number>(0);
  rfc = signal<string>('');
  horaEntrada = signal<string>('');
  horaSalida = signal<string>('');

  constructor() {
    // Sincroniza los valores iniciales de los inputs cuando cambian, o sea cuando editamos
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

  // Eventos de salida hacia el componente padre
  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{//Aqui enviamos todos los datos del modal
    idTrabajador: string; nombre: string; apellido: string; area: string; fechaIngreso: string;
    salario: number; rfc: string; horaEntrada: string; horaSalida: string;
  }>();

  // Funciones para actualizar los signals cuando el usuario escribe en los inputs
  actualizarNombre(evento: Event): void { this.nombre.set((evento.target as HTMLInputElement).value); }
  actualizarApellido(evento: Event): void { this.apellido.set((evento.target as HTMLInputElement).value); }
  actualizarArea(evento: Event): void { this.area.set((evento.target as HTMLInputElement).value); }
  actualizarFechaIngreso(evento: Event): void { this.fechaIngreso.set((evento.target as HTMLInputElement).value); }
  actualizarSalario(evento: Event): void { this.salario.set(Number((evento.target as HTMLInputElement).value)); }
  actualizarRfc(evento: Event): void { this.rfc.set((evento.target as HTMLInputElement).value); }
  actualizarHoraEntrada(evento: Event): void { this.horaEntrada.set((evento.target as HTMLInputElement).value); }
  actualizarHoraSalida(evento: Event): void { this.horaSalida.set((evento.target as HTMLInputElement).value); }

  // Emite el evento para cerrar el modal
  clickCerrar(): void { this.cerrar.emit(); }

  // Emite el evento para cancelar
  clickCancelar(): void { this.cancelar.emit(); }

  // Envia toda la información del trabajador al componente padre
  clickAceptar(): void {
    this.aceptar.emit({
      idTrabajador: this.idTrabajador(),
      nombre: this.nombre(), apellido: this.apellido(), area: this.area(),
      fechaIngreso: this.fechaIngreso(), salario: this.salario(), rfc: this.rfc(),
      horaEntrada: this.horaEntrada(), horaSalida: this.horaSalida(),
    });
  }
}