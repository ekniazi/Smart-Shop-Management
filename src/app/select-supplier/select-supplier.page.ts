import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddSupplierPage } from '../add-supplier/add-supplier.page';

@Component({
  selector: 'app-select-supplier',
  templateUrl: './select-supplier.page.html',
  styleUrls: ['./select-supplier.page.scss'],
})
export class SelectSupplierPage implements OnInit {

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
    this.ModalPage = AddSupplierPage;
    this.openModal();
  }

  selectSupplier(boi){
    this.modalController.dismiss(boi);
  }

  ngOnInit() {
    this.getSuppliers();
  }

}
