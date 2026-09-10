import { Component,signal,computed, inject, PLATFORM_ID } from '@angular/core';
import { ProductoCatalogoComponent } from '../cards/producto-catalogo/producto-catalogo.component';
import { isPlatformBrowser,CommonModule } from '@angular/common';
import { Producto } from '../../../../Models/producto.model';

@Component({
  selector: 'app-catalogo.component',
  imports: [ProductoCatalogoComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent {
  platformId=inject(PLATFORM_ID)
  //Estos idealmente se traen desde la base de datos, pero como aun no tenemos conexion, no quiero cagarla
  productos = signal<Producto[]>([
    { 
    idProducto: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789', 
    nombre: 'Café Americano', 
    descripcion: 'Bebida caliente que se prepara combinando un espresso con agua caliente.', 
    precio: 45.00, 
    stock: 16, 
    imagenUrl: 'images/cafe-americano.png' 
  },
  { 
    idProducto: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210', 
    nombre: 'Capuchino Especial', 
    descripcion: 'Espresso con leche texturizada al vapor y una densa capa de espuma cremosa.', 
    precio: 58.50, 
    stock: 10, 
    imagenUrl: 'images/cafe-capuccino.png' 
  },
  { 
    idProducto: '12345678-abcd-ef01-2345-6789abcdef01', 
    nombre: 'Latte Vainilla', 
    descripcion: 'Suave mezcla de espresso, leche caliente y un toque de jarabe de vainilla artesanal.', 
    precio: 65.00, 
    stock: 8, 
    imagenUrl: 'images/cafe-latte.png' 
  },
  ]);

  precioMin=signal<number|null>(null)//por defecto lo dejamos en nulo
  precioMax=signal<number|null>(null)//por defecto lo dejamos en nulo
  buscador=signal<string>('')

  productosFiltrados=computed(()=>{//Esta es la lista que filtra según los filtros (vaya la redundancia) al conjunto de productos del sistema
    return this.productos().filter(p=>//mediante AND (&&) anidamos los diferentes filtros para que se devuelva una lista final que aplique todos
      (this.precioMin() === null || p.precio >= this.precioMin()!) &&//obviamente si se ingresa un valor nulo, o sea de que no se aplicó filtro, automáticamente se considera el elemento en dicho filtro
      (this.precioMax() === null || p.precio <= this.precioMax()!) &&
      p.nombre.toLowerCase().includes(this.buscador().toLowerCase())//Hacemos lowercase para evitar problemas de que el usuario ingresa mayúscula o minúscula
    )
  })

  actualizarPrecioMin(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.precioMin.set(valor ? Number(valor) : null);
  }

  actualizarPrecioMax(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.precioMax.set(valor ? Number(valor) : null);
  }

  actualizarBuscador(evento: Event): void {
    this.buscador.set((evento.target as HTMLInputElement).value);
  }

  agregarAlCarrito(evento: { idProducto: string; cantidad: number }): void {//Este método se encarga de agregar al carrito los productos que fueron seleccionados desde los hijos
    if(!isPlatformBrowser(this.platformId))return//Esto ya lo expliqué en la sección de carrito, pero pues es porque Angular no sabe si se ejecuta en el navegador o en el servidor de Angular 
    const carritoActual = JSON.parse(localStorage.getItem('mi_carrito') || '[]');//Obtenemos el carrito actual, si no existe se crea un arreglo vacío
    const productoExistente = carritoActual.find((item: any) => item.idProducto === evento.idProducto);//Si el producto existe, se aumenta la cantidad
    if (productoExistente) {
      productoExistente.cantidad += evento.cantidad;
    } else {//Si no, se agrega, obviamente parece raro esto porque si yo en mi carrito tengo 20 productos de algo, y luego se agotan pues no se actualiza, pero
      //en la sección de hacer una compra en todo momento se valida que la cantidad a comprar si esté disponible, en caso de que no, pues el backend dispara un error
      carritoActual.push(evento);
    }
    localStorage.setItem('mi_carrito', JSON.stringify(carritoActual));
  }
}