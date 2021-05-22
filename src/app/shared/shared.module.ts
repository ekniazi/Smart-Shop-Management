import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { AddItemPageModule } from '../add-item/add-item.module';
import { AddSupplierPage } from '../add-supplier/add-supplier.page';
import { SelectSupplierPage } from '../select-supplier/select-supplier.page';
import { SelectItemPage } from '../select-item/select-item.page';
import { ExcelImportPage } from '../excel-import/excel-import.page';

import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [AddItemPage, AddSupplierPage, SelectSupplierPage, SelectItemPage, ExcelImportPage],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    TranslateModule,
  ],
  exports: [AddItemPage, AddSupplierPage, SelectSupplierPage, SelectItemPage, ExcelImportPage]
})
export class SharedModule { }
