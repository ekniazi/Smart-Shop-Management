import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExcelImportPageRoutingModule } from './excel-import-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { ExcelImportPage } from './excel-import.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExcelImportPageRoutingModule,
    TranslateModule,
  ],
  declarations: []
})
export class ExcelImportPageModule {}
