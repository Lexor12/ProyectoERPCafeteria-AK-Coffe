import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-agregar-producto-proveedor',
  imports: [],
  templateUrl: './agregar-producto-proveedor.component.html',
  styleUrl: './agregar-producto-proveedor.component.css',
})
export class AgregarProductoProveedorComponent {
  // Inputs que recibe desde el componente padre, estos almacenan todos los proveedores
  //que actualmente existen que se van a mostrar dentro del selector se seleccionar un proveedor
  proveedores = input<{ idProveedor: string; nombre: string }[]>([]);
  //Aqui mostramos todos los productos existentes, en caso de que el usuario seleccione que el producto que se desea
  //agregar es uno existente
  productosExistentes = input<{ idProducto: string; nombre: string }[]>([]);

  // Estados para controlar el formulario y la vista
  productoExistente = signal<boolean>(false);
  idProveedor = signal<string>('');
  idProductoExistente = signal<string>('');
  nombre = signal<string>('');
  descripcion = signal<string>('');
  precioUnitario = signal<number>(0);

  // Manejo de la vista previa y archivo de imagen
  imagenPreview = signal<string>('images/sin-foto.png');
  archivoImagen = signal<File | null>(null);

  // Eventos de salida hacia el padre
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

  // Actualiza el id del producto existente seleccionado
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
    // Aqui recibe la imagen y la manda o procesa
  }

  // Emite el evento para cerrar el modal
  clickCerrar(): void {
    this.cerrar.emit();
  }

  // Emite el evento para cancelar la accion
  clickCancelar(): void {
    this.cancelar.emit();
  }

  // Envía los datos del formulario al componente padre
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