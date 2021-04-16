import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from 'src/app/add-item/add-item.page';
import { AddSupplierPage } from 'src/app/add-supplier/add-supplier.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    public modalController: ModalController,
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

  addItem(){
    this.ModalPage = AddItemPage;
    this.openModal();
  }

  addSupplier(){
    this.ModalPage = AddSupplierPage;
    this.openModal();
  }

  ngOnInit() {
  }

}
