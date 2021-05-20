import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddItemPage } from 'src/app/add-item/add-item.page';
import { AddSupplierPage } from 'src/app/add-supplier/add-supplier.page';
import { ExcelImportPage } from 'src/app/excel-import/excel-import.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DashboardPageRoutingModule,
    TranslateModule,
  ],
  declarations: [DashboardPage],
  entryComponents:[AddItemPage,AddSupplierPage,ExcelImportPage],
})
export class DashboardPageModule {}
