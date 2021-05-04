import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BorrowersPageRoutingModule } from './borrowers-routing.module';

import { BorrowersPage } from './borrowers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BorrowersPageRoutingModule
  ],
  declarations: [BorrowersPage]
})
export class BorrowersPageModule {}
