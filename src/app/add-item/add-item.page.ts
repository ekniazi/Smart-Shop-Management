import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SelectSupplierPage } from '../select-supplier/select-supplier.page';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  constructor(
    private barcodeScanner: BarcodeScanner,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  ModalPage: any;
  items: any[];
  name: string;
  rPrice: number;
  pPrice: number;
  stock: number;
  supplier: any;

  async openModal() {
    const modal = await this.modalController.create({
      component: this.ModalPage,
      cssClass: 'color-modal',
    });

    modal.onDidDismiss()
      .then((event: any) => {
        if (event['data']) {
          this.supplier = event['data'];
        }
      });

    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Item Added!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  getItems() {
    if (window.localStorage.getItem('items')) {
      this.items = JSON.parse(window.localStorage.getItem('items'));
    } else {
      this.items = [];
    }
  }

  barcode: string;

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.barcode = barcodeData.text;
    }).catch(err => {
      alert(err);
    });
  }

  openSuppliers() {
    this.ModalPage = SelectSupplierPage;
    this.openModal();
  }

  ionViewWillEnter() {
    this.scanBarcode();
  }
  close() {
    this.modalController.dismiss()
  }

  addItem() {
    let data = {
      name: this.name,
      rPrice: this.rPrice,
      pPrice: this.pPrice,
      stock: this.stock,
      supplier: this.supplier,
      barcode: this.barcode,
    }
    this.items.push(data);
    window.localStorage.setItem('items', JSON.stringify(this.items));
    this.presentToast();
    this.modalController.dismiss(data);
  }

  ngOnInit() {
    this.getItems();
  }

}
