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
  login:boolean=false;
}
