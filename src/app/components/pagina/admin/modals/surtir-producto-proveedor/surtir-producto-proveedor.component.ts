import { Component, input, output, signal, computed  } from '@angular/core';

@Component({
  selector: 'app-surtir-producto-proveedor',
  imports: [],
  templateUrl: './surtir-producto-proveedor.component.html',
  styleUrl: './surtir-producto-proveedor.component.css',
})
//Este modal se encarga de que el admin elija cuántas unidades compra de un producto ya asociado al proveedor
export class SurtirProductoProveedorComponent {
  //Datos que son mandados por el componente proveedor, que muestran los datos más escenciales para surtir a un producto (precio y nombre + descripción) además de la imagen
  idProducto = input.required<string>();
  idProveedor = input.required<string>();
  nombre = input.required<string>();
  descripcion = input.required<string>();
  precioUnitario = input.required<number>();
  imagenUrl = input<string>('');

  cantidad = signal<number>(1);//Esta puede estar cambiando, ya que el admin puede agregar varias
  precioTotal = computed(() => this.cantidad() * this.precioUnitario());//Calculamos constantemente el precio total si la cantidad cambia

  //Estos son los eventos o salidas que le mandamos al padre para que procese algo o ejecute algo
  cerrar = output<void>();
  cancelar = output<void>();
  aceptar = output<{ idProducto: string; idProveedor: string; cantidad: number; }>();//Mandamos estos datos, para que el componente padre haga la solicitud al service 

  actualizarCantidad(evento: Event): void {//Como usamos un signal para cantidad, debemos de actualizarlo constantemente para cambiar su valoe
    const valor = Number((evento.target as HTMLInputElement).value);
    this.cantidad.set(valor > 0 ? valor : 1);
  }
  //Aquí estan nos emits que hace el sistema al componente padre para que cierre el modal 
  clickCerrar(): void {
    this.cerrar.emit();
  }

  clickCancelar(): void {
    this.cancelar.emit();
  }
  //Le mandamos al padre los datos ya completos tras una aceptación del Admin
  clickAceptar(): void {
    this.aceptar.emit({ 
      idProducto: this.idProducto(), 
      idProveedor: this.idProveedor(),
      cantidad: this.cantidad(), 
    });
  }
}
