import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [

  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/dashboard/dashboard.module').then(m => m.DashboardPageModule)
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/settings/settings.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: 'inventory',
        children: [
          {
            path: '',
            loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryPageModule)
          }
        ]
      },

      {
        path: 'borrowers',
        children: [
          {
            path: '',
            loadChildren: () => import('./borrowers/borrowers.module').then(m => m.BorrowersPageModule)
          }
        ]
      },
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersPageModule)
          }
        ]
      },

    ]
  },
  {
    path: '',
    redirectTo: 'home/inventory',
    pathMatch: 'full'
  },
 


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
