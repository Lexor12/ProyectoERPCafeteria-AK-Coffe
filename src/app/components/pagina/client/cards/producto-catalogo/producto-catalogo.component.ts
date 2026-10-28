import { Component ,input,output,signal} from '@angular/core';


@Component({
  selector: 'app-producto-catalogo',
  imports: [],
  templateUrl: './producto-catalogo.component.html',
  styleUrl: './producto-catalogo.component.css',
})
export class ProductoCatalogoComponent {
  idProducto=input.required<string>();//Como almacena UUID, no hay mejor forma que usando string
  nombre=input.required<string>();
  descripcion=input.required<string>();
  precio=input.required<number>();
  stockDisponible=input.required<number>();
  imagenUrl=input<string>('');//En caso de que la imagen no llegue, no detiene todo
  cantidad=signal<number>(1);//Por defecto es 1
  agregar=output<{idProducto:string,cantidad:number}>();

  actualizarCantidadSeleccionada(evento:Event):void{
    const input = evento.target as HTMLInputElement
    const valorIngresado = Number(input.value)
    if(Number.isInteger(valorIngresado) && valorIngresado>=1 && valorIngresado<=this.stockDisponible()){
      this.cantidad.set(valorIngresado)
    } else {
      input.value = String(this.cantidad())
    }
  }
  clickAgregar():void{
    if (this.stockDisponible() < 1) {
      alert('No hay stock suficiente de este producto')
      return;
    }
    this.agregar.emit({idProducto:this.idProducto(),cantidad:this.cantidad()})
  }
}