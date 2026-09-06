import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-editar-producto-inventario',
  imports: [],
  templateUrl: './editar-producto-inventario.component.html',
  styleUrl: './editar-producto-inventario.component.css',
})
export class EditarProductoInventarioComponent {
  idProducto = input.required<string>();
  nombreInicial = input<string>('');
  descripcionInicial = input<string>('');
  precioInicial = input<number>(0);
  imagenUrlInicial = input<string>('images/sin-foto.png');

  nombre = signal<string>('');
  descripcion = signal<string>('');
  precioUnitario = signal<number>(0);

  imagenPreview = signal<string>('images/sin-foto.png');
  archivoImagen = signal<File | null>(null);

  constructor() {
    effect(() => {
      this.nombre.set(this.nombreInicial());
      this.descripcion.set(this.descripcionInicial());
      this.precioUnitario.set(this.precioInicial());
      this.imagenPreview.set(this.imagenUrlInicial());
    });
  }

  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{ idProducto: string; nombre: string; descripcion: string; precioUnitario: number; imagen: File | null }>();

  actualizarNombre(evento: Event): void {
    this.nombre.set((evento.target as HTMLInputElement).value);
  }

  actualizarDescripcion(evento: Event): void {
    this.descripcion.set((evento.target as HTMLInputElement).value);
  }

  actualizarPrecioUnitario(evento: Event): void {
    this.precioUnitario.set(Number((evento.target as HTMLInputElement).value));
  }

  actualizarImagen(evento: Event): void {
    //
  }

  clickCerrar(): void {
    this.cerrar.emit();
  }

  clickCancelar(): void {
    this.cancelar.emit();
  }

  clickAceptar(): void {
    this.aceptar.emit({
      idProducto: this.idProducto(),
      nombre: this.nombre(),
      descripcion: this.descripcion(),
      precioUnitario: this.precioUnitario(),
      imagen: this.archivoImagen(),
    });
  }
}