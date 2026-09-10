import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-landing.component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  // Idealmente esta propiedad se calcularia con la hora del dispositivo del usuario. No la
  // guardamos en la base de datos porque seria complejidad de mas solo para saber si esta abierto o no;
  // deberia resolverse en el constructor o en un metodo que compare la hora actual contra el horario
  // definido, basicamente una serie de condicionales (if)
  abierto: boolean = true;
}