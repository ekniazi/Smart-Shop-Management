import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSupplierPageRoutingModule } from './select-supplier-routing.module';

import { SelectSupplierPage } from './select-supplier.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSupplierPageRoutingModule
  ],
  declarations: []
})
export class SelectSupplierPageModule {}
