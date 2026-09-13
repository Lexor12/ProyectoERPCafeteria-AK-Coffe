import { Component,inject,Inject } from '@angular/core';
import { RouterLink ,RouterLinkActive} from '@angular/router';
import { SesionService } from '../../Services/sesion.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router:Router){}
  //Este recibe la instancia singletone del sistema para identificar si hay un usuario logueado en el sistema
  sesionService=inject(SesionService)
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
    this.sesionService.cerrarSesion()//Llamamos el metodo de cerrar sesión, nadamás
    this.router.navigate(['/'])
  }
}
