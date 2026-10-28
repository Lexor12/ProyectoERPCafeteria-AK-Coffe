import { Component, effect, input, output, signal  } from '@angular/core';

@Component({
  selector: 'app-agregar-proveedor',
  imports: [],
  templateUrl: './agregar-proveedor.component.html',
  styleUrl: './agregar-proveedor.component.css',
})

//Este modal  agregar o editar un proveedor, si recibe valores iniciales funciona como edición
export class AgregarProveedorComponent {
  // Valores con los que se rellena el formulario al editar, los cuales al contrario se encuentran vacíos al agregar (ya que es algo nuevo totalmente)
  nombre = signal<string>('');
  telefono = signal<string>('');
  nombreInicial=input<string>('');
  telefonoInicial=input<string>('');

  cerrar = output<void>();
  cancelar = output<void>();
  // Este output manda un objeto con los dos campos juntos, en vez de emitir cada campo por separado,
  // asi el padre recibe todo en un solo evento
  aceptar = output<{ nombre: string; telefono: string }>();

  constructor(){
    effect(()=>{
      this.nombre.set(this.nombreInicial());
      this.telefono.set(this.telefonoInicial());
    })
  }

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
