import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelperpagePageRoutingModule } from './helperpage-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { HelperpagePage } from './helperpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelperpagePageRoutingModule,
    TranslateModule,
  ],
  declarations: [HelperpagePage]
})
export class HelperpagePageModule { }
