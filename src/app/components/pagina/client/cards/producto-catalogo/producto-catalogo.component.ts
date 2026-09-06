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
    const valorIngresado = Number((evento.target as HTMLInputElement).value)
    if(valorIngresado>=1 && valorIngresado<=this.stockDisponible()){
      this.cantidad.set(valorIngresado)//Como al usar input.required lo que tenemos es un objeto tipo signal, no un valor, debemos acceder como
      //si fuera un objeto, mediante metodos, Getters and Setters, aqui usamos set para definir el valor
      //Peroo, en el HTML, usamos () para tipo get
    }
  }
  clickAgregar():void{
    this.agregar.emit({idProducto:this.idProducto(),cantidad:this.cantidad()})
  }
}