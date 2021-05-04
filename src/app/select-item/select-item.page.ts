import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { AddSupplierPage } from '../add-supplier/add-supplier.page';

@Component({
  selector: 'app-select-item',
  templateUrl: './select-item.page.html',
  styleUrls: ['./select-item.page.scss'],
})
export class SelectItemPage implements OnInit {

  constructor(
    public modalController: ModalController,
  ) { }

  suppliers: any[];
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
          setTimeout(()=>{
            this.selectSupplier(this.returnDat);
          },600)
        }
      });

    return await modal.present();
  }

  getSuppliers() {
    if (window.localStorage.getItem('suppliers')) {
      this.suppliers = JSON.parse(window.localStorage.getItem('suppliers'));
    } else {
      this.suppliers = [];
    }
  }

  addSupplier(){
    this.ModalPage = AddItemPage;
    this.openModal();
  }

  selectSupplier(boi){
    this.modalController.dismiss(boi);
  }

  ngOnInit() {
    this.getSuppliers();
  }

}
