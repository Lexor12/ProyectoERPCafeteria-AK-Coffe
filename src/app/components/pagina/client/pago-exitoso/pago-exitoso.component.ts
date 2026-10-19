import { Component, inject, OnInit ,PLATFORM_ID, signal} from '@angular/core';
import { VentaService } from '../../../../Services/venta.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pago-exitoso.component',
  imports: [],
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css',
})
export class PagoExitosoComponent implements OnInit{
  titulo=signal<string>('La compra se ha registrado correctamente!')
  texto=signal<string>('Tu compra fue procesada por el sistema, ahora te estamos redirigiendo a tus pedidos')
  private platformId = inject(PLATFORM_ID);
  constructor(private ventaService:VentaService,private router:Router){}
  ngOnInit(): void{
    if(!isPlatformBrowser(this.platformId))return;
    const orderID = sessionStorage.getItem('paypal_order_id');
    const itemsGuardados = sessionStorage.getItem('paypal_items');
    const rfcGuardado = sessionStorage.getItem('paypal_rfc');

    if (!orderID || !itemsGuardados) {
      this.titulo.set("Error al procesar el pago!")
      this.texto.set('No se encontró información de la orden de pago.')
      setTimeout(() => this.router.navigate(['/tienda']), 3000);
      return;
    }
    const items=JSON.parse(itemsGuardados)
    const rfcCliente = rfcGuardado ?? '';
    this.ventaService.procesarPagoVenta(orderID,rfcCliente,items).subscribe({
      next:(res)=>{
        if (res.registrada) {
          // Limpiamos el sessionStorage temporal de PayPal
          sessionStorage.removeItem('paypal_order_id');
          sessionStorage.removeItem('paypal_items');
          sessionStorage.removeItem('paypal_rfc');
          // El carrito se vacía hasta aquí, cuando el pago ya fue confirmado
          localStorage.setItem('mi_carrito', JSON.stringify([]));
          this.titulo.set('La compra se ha registrado correctamente!')
          this.texto.set('Tu compra fue procesada por el sistema, ahora te estamos redirigiendo a tus pedidos')
          setTimeout(() => this.router.navigate(['/pedidos']), 3000);// Mandamos al usuario a su historial de pedidos
      }else {
        this.titulo.set('Error al procesar el pago!')
        this.texto.set(res.mensaje ?? 'No se pudo registrar la compra.')
        setTimeout(() => this.router.navigate(['/carrito']), 3000);
      }
    },
    error:(error)=>{
        if (error.registrada) {
            // Limpiamos el sessionStorage temporal de PayPal
            sessionStorage.removeItem('paypal_order_id');
            sessionStorage.removeItem('paypal_items');
            sessionStorage.removeItem('paypal_rfc');
            setTimeout(() => this.router.navigate(['/pedidos']), 3000);
        }else {
          setTimeout(() => this.router.navigate(['/tienda']), 3000);
        }
      }
    }
    )
  }
}
