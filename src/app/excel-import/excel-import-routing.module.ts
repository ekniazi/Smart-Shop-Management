import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExcelImportPage } from './excel-import.page';

const routes: Routes = [
  {
    path: '',
    component: ExcelImportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExcelImportPageRoutingModule {}
