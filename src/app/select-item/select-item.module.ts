import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectItemPageRoutingModule } from './select-item-routing.module';

import { SelectItemPage } from './select-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectItemPageRoutingModule
  ],
  declarations: []
})
export class SelectItemPageModule {}
