import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { AddItemPageModule } from '../add-item/add-item.module';
import { AddSupplierPage } from '../add-supplier/add-supplier.page';

@NgModule({
  declarations: [AddItemPage,AddSupplierPage],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
  ],
  exports: [AddItemPage,AddSupplierPage]
})
export class SharedModule { }
