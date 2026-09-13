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
  //El imagen Preview permite mostrar o la imagen que justamente acaba de ingresar o la imagen default que posee el producto, en caso de que no exista una, se muestra la por defecto
  //que es una imagen que refiere a un "no imagen", esta raro pero en visual se ve mejor
  imagenPreview = signal<string>('images/sin-foto.png');
  //Aqui se almacena la imagen pero en base 64
  imagenBase64 = signal<string | null>(null);

  constructor() {
    effect(() => {// Sincroniza los valores iniciales de los inputs cuando cambian, o sea cuando editamos
      this.nombre.set(this.nombreInicial());
      this.descripcion.set(this.descripcionInicial());
      this.precioUnitario.set(this.precioInicial());
      this.imagenPreview.set(this.imagenUrlInicial());
    });
  }

  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{ idProducto: string; nombre: string; descripcion: string; precioUnitario: number; imagenBase64: string | null  }>();

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
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    // FileReader lee el contenido del archivo, aquí lo pedimos como "data URL"
    // que es justo el formato base64 con el encabezado "data:image/png;base64,..." que recibe el backend que acabo de configurar
    //
    const lector = new FileReader();
    lector.onload = () => {
        const base64 = lector.result as string;
        this.imagenPreview.set(base64); // Esto actualiza la vista previa al instante
        this.imagenBase64.set(base64);  // Esto es lo que se manda al backend después
    };
    lector.readAsDataURL(archivo);
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
      imagenBase64: this.imagenBase64(),
    });
  }
}