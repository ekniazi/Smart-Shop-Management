import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from 'src/app/add-item/add-item.page';
import { AddSupplierPage } from 'src/app/add-supplier/add-supplier.page';
import { ExcelImportPage } from 'src/app/excel-import/excel-import.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private router: Router,
  ) { }

  ModalPage: any;
  returnDat:any;

  async openModal() {
    const modal = await this.modalController.create({
      component: this.ModalPage,
      cssClass: 'color-modal',
    });

    modal.onDidDismiss()
      .then((event: any) => {
        if (event['data']) {
          this.returnDat = event['data'];
        }
      });

    return await modal.present();
  }
  
  openPOS(){
    this.router.navigate(['pos']);
  }

  addItem(){
    this.ModalPage = AddItemPage;
    this.openModal();
  }

  addSupplier(){
    this.ModalPage = AddSupplierPage;
    this.openModal();
  }

  excelImport(){
    this.ModalPage = ExcelImportPage;
    this.openModal();
  }

  ngOnInit() {
  }

}
