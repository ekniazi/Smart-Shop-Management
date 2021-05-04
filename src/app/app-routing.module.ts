import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home/inventory',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'add-item',
    loadChildren: () => import('./add-item/add-item.module').then( m => m.AddItemPageModule)
  },
  {
    path: 'add-supplier',
    loadChildren: () => import('./add-supplier/add-supplier.module').then( m => m.AddSupplierPageModule)
  },
  {
    path: 'select-supplier',
    loadChildren: () => import('./select-supplier/select-supplier.module').then( m => m.SelectSupplierPageModule)
  },
  {
    path: 'pos',
    loadChildren: () => import('./pos/pos.module').then( m => m.POSPageModule)
  },
  {
    path: 'select-item',
    loadChildren: () => import('./select-item/select-item.module').then( m => m.SelectItemPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
