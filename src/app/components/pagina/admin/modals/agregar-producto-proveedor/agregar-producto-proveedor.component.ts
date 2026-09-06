import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-agregar-producto-proveedor',
  imports: [],
  templateUrl: './agregar-producto-proveedor.component.html',
  styleUrl: './agregar-producto-proveedor.component.css',
})
export class AgregarProductoProveedorComponent {
  proveedores = input<{ idProveedor: string; nombre: string }[]>([]);
  productosExistentes = input<{ idProducto: string; nombre: string }[]>([]);

  productoExistente = signal<boolean>(false);
  idProveedor = signal<string>('');
  idProductoExistente = signal<string>('');
  nombre = signal<string>('');
  descripcion = signal<string>('');
  precioUnitario = signal<number>(0);

  imagenPreview = signal<string>('images/sin-foto.png');
  archivoImagen = signal<File | null>(null);

  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{
    productoExistente: boolean;
    idProveedor: string;
    idProductoExistente: string;
    nombre: string;
    descripcion: string;
    precioUnitario: number;
    imagen: File | null;
  }>();

  cambiarProductoExistente(valor: boolean): void {
    this.productoExistente.set(valor);
  }

  actualizarProveedor(evento: Event): void {
    this.idProveedor.set((evento.target as HTMLSelectElement).value);
  }

  actualizarProductoSeleccionado(evento: Event): void {
    this.idProductoExistente.set((evento.target as HTMLSelectElement).value);
  }

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
    //Aqui recibe la imagen y la manda o procesa
  }

  clickCerrar(): void {
    this.cerrar.emit();
  }

  clickCancelar(): void {
    this.cancelar.emit();
  }

  clickAceptar(): void {
    this.aceptar.emit({
      productoExistente: this.productoExistente(),
      idProveedor: this.idProveedor(),
      idProductoExistente: this.idProductoExistente(),
      nombre: this.nombre(),
      descripcion: this.descripcion(),
      precioUnitario: this.precioUnitario(),
      imagen: this.archivoImagen(),
    });
  }
}
