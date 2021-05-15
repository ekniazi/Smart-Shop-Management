import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwnerpagePageRoutingModule } from './ownerpage-routing.module';

import { OwnerpagePage } from './ownerpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwnerpagePageRoutingModule
  ],
  declarations: [OwnerpagePage]
})
export class OwnerpagePageModule {}
