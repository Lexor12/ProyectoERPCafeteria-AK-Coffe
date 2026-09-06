import { Component, output, signal  } from '@angular/core';

@Component({
  selector: 'app-agregar-proveedor',
  imports: [],
  templateUrl: './agregar-proveedor.component.html',
  styleUrl: './agregar-proveedor.component.css',
})
export class AgregarProveedorComponent {
  nombre = signal<string>('');
  telefono = signal<string>('');

  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{ nombre: string; telefono: string }>();

  actualizarNombre(evento: Event): void {
    this.nombre.set((evento.target as HTMLInputElement).value);
  }

  actualizarTelefono(evento: Event): void {
    this.telefono.set((evento.target as HTMLInputElement).value);
  }

  clickCerrar(): void {
    this.cerrar.emit();
  }

  clickCancelar(): void {
    this.cancelar.emit();
  }

  clickAceptar(): void {
    this.aceptar.emit({ nombre: this.nombre(), telefono: this.telefono() });
  }
}
