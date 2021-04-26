import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { POSPageRoutingModule } from './pos-routing.module';

import { POSPage } from './pos.page';
import { SelectItemPage } from '../select-item/select-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    POSPageRoutingModule
  ],
  declarations: [POSPage],
  entryComponents: [SelectItemPage]
})
export class POSPageModule {}
