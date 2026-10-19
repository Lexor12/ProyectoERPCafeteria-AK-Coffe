import { Component,inject,Inject, OnInit, signal } from '@angular/core';
import { RouterLink ,RouterLinkActive} from '@angular/router';

import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  
  constructor(private router:Router){}
  
  //Este recibe la instancia singletone del sistema para identificar si hay un usuario logueado en el sistema
  authService=inject(AuthService)
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
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}
