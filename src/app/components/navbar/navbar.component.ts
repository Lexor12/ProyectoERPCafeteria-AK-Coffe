import { Component } from '@angular/core';
import { RouterLink ,RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  rol:string='administrador';
  //rol:string='cliente';
  //rol:string='administrador';
  sesionActiva:boolean=true;
  nombreUsuario='';

  rutasCliente=[
    { label: 'Catálogo', path: '/tienda' },
    { label: 'Carrito', path: '/carrito' },
    { label: 'Pedidos', path: '/pedidos' },
  ]
  rutasAdmin = [
    { label: 'Inventario', path: '/admin/inventario' },
    { label: 'Proveedores', path: '/admin/proveedores' },
    { label: 'Finanzas', path: '/admin/finanzas' },
    { label: 'RH', path: '/admin/rh' },
    { label: 'Pedidos', path: '/admin/pedidos' },
  ];
  cerrarSesion(): void{
    this.sesionActiva=false;
  }
}
