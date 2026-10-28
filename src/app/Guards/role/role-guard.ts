import { CanActivateFn } from '@angular/router';

//Importamos lo siguiente:
import { inject,PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

//Este se encarga después de autenticar, y revisa que el ro1l del usuario esté en los roles permitidos de la ruta (data.roles) definidos en el app.routes.ts
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router=inject(Router)
  const platformId = inject(PLATFORM_ID);

  // SI ESTÁ EN EL SERVIDOR: Dejar pasar para que el cliente decida al recargar (F5)
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  //Obtener los roles permitidos en la ruta
  const allowedRoles:string[]= route.data['roles']??[]

  //Verificar que exista una sesion
  if(!authService.estaAutenticado()){
    return router.createUrlTree(['/auth'])
  }
  //Verificar si el usuario tiene permisos
  if(authService.tieneRolPermitido(allowedRoles)){
    return true
  }
  return router.createUrlTree(['/auth']);
};
