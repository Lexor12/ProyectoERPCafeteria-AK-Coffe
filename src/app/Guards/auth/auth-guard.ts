import { CanActivateFn } from '@angular/router';

//Importamos lo siguiente:
import { inject,PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

//Como tal, solo deja pasar si hay un token válido y no expirado, si no manda a /auth
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)  //Aqui obtenemos el servicio de autenticacion
  const router = inject(Router)  //Obtenemos el servicio para la navegacion
  const platformId = inject(PLATFORM_ID);

  // SI ESTÁ EN EL SERVIDOR: Dejar pasar para que el cliente decida al recargar (F5)
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // SI ESTÁ EN EL NAVEGADOR: Validar normalmente la sesión
  if(authService.estaAutenticado())return true;//Verificamos si el usuario posee una sesion (Autenticacion)
  return router.createUrlTree(['/auth'])//En caso de que no exista un acceso, lo enviamos a Login
};
