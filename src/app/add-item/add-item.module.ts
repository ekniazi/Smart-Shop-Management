import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddItemPageRoutingModule } from './add-item-routing.module';

import { AddItemPage } from './add-item.page';
import { SelectSupplierPage } from '../select-supplier/select-supplier.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddItemPageRoutingModule,

  ],
  declarations: [],
  entryComponents: [SelectSupplierPage],
})
export class AddItemPageModule {}
