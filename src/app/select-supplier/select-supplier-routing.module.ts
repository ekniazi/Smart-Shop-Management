import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSupplierPage } from './select-supplier.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSupplierPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSupplierPageRoutingModule {}
