import { Component, input, output, signal, computed  } from '@angular/core';

@Component({
  selector: 'app-surtir-producto-proveedor',
  imports: [],
  templateUrl: './surtir-producto-proveedor.component.html',
  styleUrl: './surtir-producto-proveedor.component.css',
})
export class SurtirProductoProveedorComponent {
  idProducto = input.required<string>();
  nombre = input.required<string>();
  descripcion = input.required<string>();
  precioUnitario = input.required<number>();
  imagenUrl = input<string>('');

  cantidad = signal<number>(1);
  precioTotal = computed(() => this.cantidad() * this.precioUnitario());

  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{ idProducto: string; cantidad: number }>();

  actualizarCantidad(evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);
    this.cantidad.set(valor > 0 ? valor : 1);
  }

  clickCerrar(): void {
    this.cerrar.emit();
  }

  clickCancelar(): void {
    this.cancelar.emit();
  }

  clickAceptar(): void {
    this.aceptar.emit({ idProducto: this.idProducto(), cantidad: this.cantidad() });
  }
}
