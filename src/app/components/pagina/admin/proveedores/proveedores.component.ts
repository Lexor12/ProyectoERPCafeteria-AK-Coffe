import { Component, signal, computed, OnInit } from '@angular/core';
import { ProductoProveedorComponent } from '../cards/producto-proveedor/producto-proveedor.component';
import { SurtirProductoProveedorComponent } from '../modals/surtir-producto-proveedor/surtir-producto-proveedor.component';
import { AgregarProveedorComponent } from '../modals/agregar-proveedor/agregar-proveedor.component';
import { AgregarProductoProveedorComponent } from '../modals/agregar-producto-proveedor/agregar-producto-proveedor.component';
import { ProductoProveedor } from '../../../../Models/productoProveedor';
import { ProductoProveedorService } from '../../../../Services/productoProveedor.service';
import { ProveedorService } from '../../../../Services/proveedor.service';
import { CompraService } from '../../../../Services/compra.service';
import { ProductoService } from '../../../../Services/producto.service';

@Component({
  selector: 'app-proveedores.component',
  imports: [ProductoProveedorComponent,SurtirProductoProveedorComponent,AgregarProveedorComponent,AgregarProductoProveedorComponent ],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css',
})
export class ProveedoresComponent implements OnInit{
  constructor(
    private productoProveedorService: ProductoProveedorService,
    private proveedorService: ProveedorService,
    private compraService:CompraService,
    private productoService:ProductoService
  ) {}
  // Ya no relleno esto a mano, se llena con la lista real de proveedores del backend
  proveedores = signal<{ idProveedor: string; nombre: string }[]>([]);

  // Igual, arranca vacío hasta que se elija un proveedor y se pidan sus productos
  productos = signal<ProductoProveedor[]>([]);

  // Vacío significa "Todos" en el filtro (ver el <option value=""> del select en el HTML)
  proveedorSeleccionado = signal<string>('');
  buscador = signal<string>('');

  // Guarda el producto sobre el que se dio clic en "Surtir", el HTML revisa esta señal
  // con un @if para saber si abrir el modal de surtido o no
  productoASurtir = signal<ProductoProveedor | null>(null);
  mostrarModalAgregarProveedor = signal<boolean>(false);
  mostrarModalAgregarProducto = signal<boolean>(false);

  // Filtra por proveedor seleccionado (si está vacío no filtra nada) y por nombre del buscador,
  // se recalcula solo cuando cambia alguna de las tres señales que usa adentro
  productosFiltrados = computed(() => {
    return this.productos().filter(p =>
      (this.proveedorSeleccionado() === '' || p.idProveedor === this.proveedorSeleccionado()) &&
      p.nombre.toLowerCase().includes(this.buscador().toLowerCase())
    );
  });

  //A CONTINUACIÓN USAREMOS NgOnInit para que cuando cargue el componente todos los provedores y productos carguen al mismo tiempo
  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductosProovedores();
  }

  cargarProveedores(): void {
    this.proveedorService.obtenerProveedores().subscribe({
      next: (proveedoresRecibidos) => {
        this.proveedores.set(proveedoresRecibidos);
      },
      error: (error) => {
        alert('No se pudieron cargar los proveedores');
      }
    });
  }
  cargarProductosProovedores():void{
    this.productoProveedorService.obtenerProductosProveedor().subscribe({
      next: (productos)=>{
        this.productos.set(productos)
      },
      error: (error)=>{
        alert('Error al cargar los producots de los proveedores')
      }
    })
  }

  actualizarProveedor(evento: Event): void {
    this.proveedorSeleccionado.set((evento.target as HTMLSelectElement).value);
  }

  actualizarBuscador(evento: Event): void {
    this.buscador.set((evento.target as HTMLInputElement).value);
  }

  // Busca el producto por id (el que manda la card) y lo guarda, esto hace que el @if
  // del HTML detecte el cambio y abra el modal de surtido con los datos de ese producto
  surtirProducto(datos: { idProducto: string; idProveedor: string }): void {
    const producto = this.productos().find(p => 
      p.idProducto === datos.idProducto && p.idProveedor === datos.idProveedor
    );
    this.productoASurtir.set(producto ?? null);
  }

  // Esta sí llama al backend real: borra la asociación producto-proveedor (Catalogo_Proveedor),
  // el producto en sí sigue existiendo
  eliminarProductoProveedor(datos: { idProducto: string; idProveedor: string }): void {
    this.productoProveedorService.eliminarProductoProveedor(datos.idProveedor, datos.idProducto).subscribe({
      next: () => {
        this.productos.update(lista => 
          lista.filter(p => !(p.idProducto === datos.idProducto && p.idProveedor === datos.idProveedor))
        );
      },
      error: (error) => {
        alert('No se pudo eliminar el producto del proveedor');
      }
    });
  }

  cerrarModalSurtir(): void {
    this.productoASurtir.set(null);
  }

  // Ya no lee this.proveedorSeleccionado(), el idProveedor viene directo del modal,
  // que a su vez lo heredó de la card sobre la que se dio clic en "Surtir"
  confirmarSurtido(datos: { idProducto: string; idProveedor: string; cantidad: number; costoUnitario: number }): void {
      this.compraService.registrarCompraProductoExistente(datos.idProveedor, datos.idProducto, datos.cantidad, datos.costoUnitario).subscribe({
        next: (respuesta) => {
          if (respuesta.registrada) {
            // Recargamos toda la lista de productos-proveedor, ya que ahora no dependemos
            // de un filtro específico seleccionado (podríamos estar en "Todos")
            this.cargarProductosProovedores();
          } else {
            alert('No se pudo registrar la compra');
          }
          this.productoASurtir.set(null);
        },
        error: (error) => {
          alert('Error al registrar la compra');
          this.productoASurtir.set(null);
        }
      });
  }

  clickAgregarProducto(): void {
    this.mostrarModalAgregarProducto.set(true);
  }

  cerrarModalProducto(): void {
    this.mostrarModalAgregarProducto.set(false);
  }

  // Reemplaza guardarProducto por esta:
  guardarProducto(datos: {
    productoExistente: boolean; idProveedor: string; idProductoExistente: string;
    nombre: string; descripcion: string; imagenBase64: string | null ;
    costoUnitario: number;
  }): void {
    if (datos.productoExistente) {
      // Producto que ya existe: solo lo asociamos al catálogo del proveedor
      this.productoProveedorService.asociarProductoProveedor(datos.idProveedor, datos.idProductoExistente, datos.costoUnitario).subscribe({
        next: () => {
          this.mostrarModalAgregarProducto.set(false);
          this.cargarProveedores();
          this.cargarProductosProovedores();
          this.actualizarProveedor({ target: { value: datos.idProveedor } } as any);
        },
        error: (error) => {
          alert('No se pudo asociar el producto al proveedor');
        }
      });
    } else {
      // Producto nuevo: se crea desde cero + se asocia + se registra la compra, todo junto
      const productoNuevo = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      };

      this.compraService.registrarCompraProductoNuevo(datos.idProveedor, productoNuevo, datos.costoUnitario).subscribe({
        next: (respuesta) => {
          if (respuesta.registrada) {
            // Si el usuario sí seleccionó una imagen, la subimos usando el idProducto
            // que acaba de regresar el backend al crear el producto
            if (datos.imagenBase64 && respuesta.idProducto) {
              this.productoService.subirImagenProducto(respuesta.idProducto, datos.imagenBase64).subscribe({
                error: (error) => alert('No se pudo subir la imagen del producto nuevo')
              });
            }
            this.mostrarModalAgregarProducto.set(false);
            this.cargarProveedores();
            this.cargarProductosProovedores();
            this.actualizarProveedor({ target: { value: datos.idProveedor } } as any);
          } else {
            alert('No se pudo registrar el producto nuevo');
          }
        },
        error: (error) => {
          alert('Error al registrar el producto nuevo');
        }
      });
    }
  }
  clickAgregarProveedor(): void {
    this.mostrarModalAgregarProveedor.set(true);
  }

  cerrarModalProveedor(): void {
    this.mostrarModalAgregarProveedor.set(false);
  }

  guardarProveedor(datos: { nombre: string; telefono: string }): void {
    this.proveedorService.crearProveedor(datos.nombre, datos.telefono).subscribe({
      next: () => {
        this.mostrarModalAgregarProveedor.set(false);
        this.cargarProveedores(); // recargamos para que aparezca en el <select>
      },
      error: (error) => {
        alert('No se pudo registrar el proveedor');
      }
    });
  }
}