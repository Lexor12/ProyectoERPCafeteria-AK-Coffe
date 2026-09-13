import { Component,computed,OnInit,signal } from '@angular/core';
import { ProductoInventarioComponent } from '../cards/producto-inventario/producto-inventario.component';
import { EditarProductoInventarioComponent } from '../modals/editar-producto-inventario/editar-producto-inventario.component';
import { Producto } from '../../../../Models/producto.model';
import { ProductoService } from '../../../../Services/producto.service';

@Component({
  selector: 'app-inventario.component',
  imports: [ProductoInventarioComponent,EditarProductoInventarioComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit{
  constructor(private productoService:ProductoService){}

  productos = signal<Producto[]>([]);

  precioMin = signal<number | null>(null); // Al principio es null, ya que por defecto no existe un valor en el cuadro de texto
  precioMax = signal<number | null>(null); // Así que ponemos null para identificar cuando no ha utilizado este filtro
  // Esta almacenará los valores de la busqueda, y se actualizará constantemente
  buscador = signal<string>('');

  // Cuando un usuario da clic sobre un producto, aquí se guarda para mostrarlo
  // este objeto se analiza en el HTML, en caso de que exista un Producto asociado, se abrirá el modal
  productoSeleccionado = signal<Producto | null>(null);
    productosFiltrados = computed(() => {
    return this.productos().filter(p =>
      (this.precioMin() === null || p.precio >= this.precioMin()!) &&
      (this.precioMax() === null || p.precio <= this.precioMax()!) &&
      p.nombre.toLowerCase().includes(this.buscador().toLowerCase())
    );
  });


  ngOnInit(): void {//Cargamos todos los productos del inventario cuando se crea o muestra el componente
    this.cargarProductos()
  }

  cargarProductos():void{//Esta función hace uso del ProductoService para obtener todos los productos
    this.productoService.obtenerProductos().subscribe({
      next: (productos)=>{
        this.productos.set(productos)
      },
      error: (error)=>{
        alert('No se pudo cargar el inventario');
      }
    })
  }
  //De aqui
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
  // Hasta aca, son puras funciones de los signals, nada que modificar en Frontend en base al Backend

  desactivarProducto(idProducto: string): void { // Aqui no se debe eliminar el producto de plano, solo se marca activo en false,
    // pq el RQNF15 dice que un producto con ventas/compras asociadas no debe borrarse fisicamente
    this.productoService.desactivarProducto(idProducto).subscribe({
      next: ()=>{
        this.productos.update(lista =>//En caso de que la BD se haya actualizado, no vale la pena hacer 2 consultas, mejor editamos en local
          lista.filter(p => p.idProducto !== idProducto)
        );
      },
      error: (error)=>{
        alert('No se pudo desactivar el producto');
      }
    }) 
  }

  //ESTAS 2 FUNCIONES SON SOLO PARA GESTIONAR EL MODAL
  editarProducto(idProducto: string): void {//Esta función solo abre el modal, no edita el producto como tal
    const producto = this.productos().find(p => p.idProducto === idProducto);
    this.productoSeleccionado.set(producto ?? null);
  }
  cerrarModal(): void {
    this.productoSeleccionado.set(null);
  }

  // Esta función recibe lo que el modal manda, y realiza la actualización del producto, en este caso,
  // no se utiliza la variable de arriba ya que la tarjeta directamente manda el id del producto,
  // entonces se vuelve a filtrar, eso se hace en parte por seguridad
  guardarEdicion(datos: { idProducto: string; nombre: string; descripcion: string; precioUnitario: number; imagenBase64: string | null }): void {
    this.productoService.editarProducto(datos.idProducto, { nombre: datos.nombre, descripcion: datos.descripcion, precio: datos.precioUnitario }).subscribe({
      next: () => {
        this.productos.update(lista =>
          lista.map(p => p.idProducto === datos.idProducto
            ? { ...p, nombre: datos.nombre, descripcion: datos.descripcion, precio: datos.precioUnitario }
            : p
          )
        );
        // Si el usuario sí seleccionó una imagen nueva, la mandamos aparte,
        // porque es un endpoint distinto al de editar los datos básicos
        if (datos.imagenBase64) {
          this.productoService.subirImagenProducto(datos.idProducto, datos.imagenBase64).subscribe({
            next: () => {
              this.cargarProductos()
            },
            error: (error) => {
              alert('No se pudo subir la imagen');
            }
          });
        }
        this.productoSeleccionado.set(null);
      },
      error: (error) => {
        alert('No se pudo guardar la edición');
      }
    });
  }
}
