import { Component, inject, OnInit,PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pago-rechazado.component',
  imports: [],
  templateUrl: './pago-rechazado.component.html',
  styleUrl: './pago-rechazado.component.css',
})
export class PagoRechazadoComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  constructor(private router:Router){}
  ngOnInit(): void {
    if(!isPlatformBrowser(this.platformId))return;
    const orderID = sessionStorage.getItem('paypal_order_id');
    const itemsGuardados = sessionStorage.getItem('paypal_items'); 

    if (!orderID || !itemsGuardados) {//Si el usuario intenta acceder sin haber hecho un pago lo regresamos a la tienda para evitar que permanezca en la pagina
      this.router.navigate(['/tienda']);
      return;
    }
    //Si es que existen, signfica que llegamos aqui pq paypal nos redirecciono, asi que eliminamos todo ya que hubo un error
    sessionStorage.removeItem('paypal_order_id');
    sessionStorage.removeItem('paypal_items');
    sessionStorage.removeItem('paypal_rfc');
    // Espera 5 segundos (5000 milisegundos) antes de ejecutar la redirección
    setTimeout(() => {
      this.router.navigate(['/catalogo']);
    }, 5000);
  }
}
