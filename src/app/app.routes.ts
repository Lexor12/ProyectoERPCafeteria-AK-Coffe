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

export const routes: Routes = [
    {
        path:'',component:LandingComponent
    },
    {
        path:'auth',component:AuthComponent
    },
    {
        path:'tienda',component:CatalogoComponent
    },
    {
        path:'carrito',component:CarritoComponent
    },
    {
        path:'pedidos',component:PedidosComponent
    },
    {
        path:'admin/pedidos',component:PedidosAdminComponent
    },
    {
        path:'admin/inventario',component:InventarioComponent
    },
    {
        path:'admin/proveedores',component:ProveedoresComponent
    },
    {
        path:'admin/finanzas',component:FinanzasContabilidadComponent
    },
    {
        path:'admin/rh',component:RhComponent
    },
];
