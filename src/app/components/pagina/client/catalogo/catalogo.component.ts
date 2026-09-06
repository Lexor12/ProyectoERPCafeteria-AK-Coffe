import { Component,signal,computed, inject, PLATFORM_ID } from '@angular/core';
import { ProductoCatalogoComponent } from '../cards/producto-catalogo/producto-catalogo.component';
import { isPlatformBrowser,CommonModule } from '@angular/common';
@Component({
  selector: 'app-catalogo.component',
  imports: [ProductoCatalogoComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent {
  platformId=inject(PLATFORM_ID)
  //Estos idealmente se traen desde la base de datos, pero como aun no tenemos conexion, no quiero cagarla
  productos = signal<{idProducto: string;nombre: string;descripcion: string;precio: number;stockDisponible: number;imagenUrl: string;
  }[]>([
    { 
    idProducto: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789', 
    nombre: 'Café Americano', 
    descripcion: 'Bebida caliente que se prepara combinando un espresso con agua caliente.', 
    precio: 45.00, 
    stockDisponible: 16, 
    imagenUrl: 'images/cafe-americano.png' 
  },
  { 
    idProducto: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210', 
    nombre: 'Capuchino Especial', 
    descripcion: 'Espresso con leche texturizada al vapor y una densa capa de espuma cremosa.', 
    precio: 58.50, 
    stockDisponible: 10, 
    imagenUrl: 'images/cafe-capuccino.png' 
  },
  { 
    idProducto: '12345678-abcd-ef01-2345-6789abcdef01', 
    nombre: 'Latte Vainilla', 
    descripcion: 'Suave mezcla de espresso, leche caliente y un toque de jarabe de vainilla artesanal.', 
    precio: 65.00, 
    stockDisponible: 8, 
    imagenUrl: 'images/cafe-latte.png' 
  },
  ]);

  precioMin=signal<number|null>(null)//por defecto lo dejamos en nulo
  precioMax=signal<number|null>(null)//por defecto lo dejamos en nulo
  buscador=signal<string>('')

  productosFiltrados=computed(()=>{
    return this.productos().filter(p=>
      (this.precioMin() === null || p.precio >= this.precioMin()!) &&
      (this.precioMax() === null || p.precio <= this.precioMax()!) &&
      p.nombre.toLowerCase().includes(this.buscador().toLowerCase())
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

  agregarAlCarrito(evento: { idProducto: string; cantidad: number }): void {
    if(!isPlatformBrowser(this.platformId))return
    const carritoActual = JSON.parse(localStorage.getItem('mi_carrito') || '[]');
    const productoExistente = carritoActual.find((item: any) => item.idProducto === evento.idProducto);
    if (productoExistente) {
      productoExistente.cantidad += evento.cantidad;
    } else {
      carritoActual.push(evento);
    }
    localStorage.setItem('mi_carrito', JSON.stringify(carritoActual));
  }
}
