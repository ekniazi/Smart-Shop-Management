import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BorrowersPage } from './borrowers.page';

const routes: Routes = [
  {
    path: '',
    component: BorrowersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowersPageRoutingModule {}
