import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelperpagePage } from './helperpage.page';

const routes: Routes = [
  {
    path: '',
    component: HelperpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelperpagePageRoutingModule {}
