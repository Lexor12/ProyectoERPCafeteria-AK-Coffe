import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';


//GENERAL
import { LandingComponent } from './components/pagina/landing/landing.component';
import { AuthComponent } from './components/pagina/auth/auth/auth.component';
//CLIENTE
import { CatalogoComponent } from './components/pagina/client/catalogo/catalogo.component';
import { CarritoComponent } from './components/pagina/client/carrito/carrito.component';
import { PedidosComponent } from './components/pagina/client/pedidos/pedidos.component';
//ADMIN
import { FinanzasContabilidadComponent } from './components/pagina/admin/finanzas-contabilidad/finanzas-contabilidad.component';
import { InventarioComponent } from './components/pagina/admin/inventario/inventario.component';
import { PedidosAdminComponent } from './components/pagina/admin/pedidos-admin/pedidos-admin.component';
import { ProveedoresComponent } from './components/pagina/admin/proveedores/proveedores.component';
import { RhComponent } from './components/pagina/admin/rh/rh.component';
import { authGuard } from './Guards/auth/auth-guard';
import { roleGuard } from './Guards/role/role-guard';
import { PagoExitosoComponent } from './components/pagina/client/pago-exitoso/pago-exitoso.component';
import { PagoRechazadoComponent } from './components/pagina/client/pago-rechazado/pago-rechazado.component';
import { TerminosYCondicionesComponent } from './components/pagina/client/terminos-y-condiciones/terminos-y-condiciones.component';
import { AvisoDePrivacidadComponent } from './components/pagina/client/aviso-de-privacidad/aviso-de-privacidad.component';

export const routes: Routes = [
    //Ruta Pública: si entran a la raíz, van directo al landing page
    {
        path:'',component:LandingComponent
    },
    {
        path:'auth',component:AuthComponent
    },
    {
        path:'terminos-y-condiciones',component:TerminosYCondicionesComponent,
        //canActivate:[authGuard,roleGuard],
        //data:{roles:['cliente']}
    },
    {
        path:'aviso-de-privacidad',component:AvisoDePrivacidadComponent,
        //canActivate:[authGuard,roleGuard],
        //data:{roles:['cliente']}
    },
    //Ruta Protegida tipo Cliente: pasa primero authGuard y luego roleGuard
    {
        path:'tienda',component:CatalogoComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['cliente']}
    },
    {
        path:'carrito',component:CarritoComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['cliente']}
    },
    {
        path:'tienda/pago-exitoso',component:PagoExitosoComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['cliente']}
    },
    {
        path:'tienda/pago-rechazado',component:PagoRechazadoComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['cliente']}
    },
    {
        path:'pedidos',component:PedidosComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['cliente']}
    },
    //Ruta Protegida tipo Admin: pasa primero authGuard y luego roleGuard
    {
        path:'admin/pedidos',component:PedidosAdminComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['administrador']}
    },
    {
        path:'admin/inventario',component:InventarioComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['administrador']}
    },
    {
        path:'admin/proveedores',component:ProveedoresComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['administrador']}
    },
    {
        path:'admin/finanzas',component:FinanzasContabilidadComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['administrador']}
    },
    {
        path:'admin/rh',component:RhComponent,
        canActivate:[authGuard,roleGuard],
        data:{roles:['administrador']}
    },
];
