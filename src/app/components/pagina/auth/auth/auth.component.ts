import { Component } from '@angular/core';
import { LoginComponent } from '../cards/login/login.component';
import { RegisterComponent } from '../cards/register/register.component';


@Component({
  selector: 'app-auth.component',
  imports: [LoginComponent,RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  // Esta propiedad de aqui es muy importante en todo el modulo de auth, cuando queremos mostrar
  // o la card de Login o Register, este valor se encarga de según si es true mostrar login, y si no,
  // muestra registro
  login: boolean = false;
}
