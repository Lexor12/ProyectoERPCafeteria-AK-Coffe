import { Component } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-terminos-y-condiciones.component',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './terminos-y-condiciones.component.html',
  styleUrl: './terminos-y-condiciones.component.css',
})
export class TerminosYCondicionesComponent {}
//Este componente es meramente para lecturas y es "estático" asi que no incluye procesos, pero se usa para mostrar en el HTML lo que es los "Términos y Condiciones", los cuales 
//son accesibles desde el carrito, registro o footer en todo momento