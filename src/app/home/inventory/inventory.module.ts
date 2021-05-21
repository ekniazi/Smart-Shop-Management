import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryPageRoutingModule } from './inventory-routing.module';

import { InventoryPage } from './inventory.page';
import { AddItemPage } from 'src/app/add-item/add-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryPageRoutingModule,
    TranslateModule,
  ],
  declarations: [InventoryPage],
  entryComponents: [AddItemPage],
})
export class InventoryPageModule {}
