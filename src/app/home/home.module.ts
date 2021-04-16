import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AddItemPage } from '../add-item/add-item.page';
import { SharedModule } from '../shared/shared.module';
import { AddSupplierPage } from '../add-supplier/add-supplier.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [HomePage],
  entryComponents: [AddItemPage,AddSupplierPage],
})
export class HomePageModule {}
