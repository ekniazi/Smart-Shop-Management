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
  choice: string = "";
  msg: string;
  color: string;
  SGST:number;
  IGST:number;
  CGST:number;
  HSN:string = "";

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
      message: this.msg,
      duration: 2000,
      color: this.color,
    });
    toast.present();
  }

  setChoice(choice: string) {
    this.choice = choice;
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
      this.choice = 'barcode';
    }).catch(err => {
      alert(err);
    });
  }

  openSuppliers() {
    this.ModalPage = SelectSupplierPage;
    this.openModal();
  }

  ionViewWillEnter() {
  }

  close() {
    this.modalController.dismiss()
  }

  addItem() {
    if (!this.name || this.name.length == 0) {
      this.msg = "Invalid name!";
      this.color = "warning"
      this.presentToast();
    } else if (!this.rPrice) {
      this.msg = "Invalid purchase price!";
      this.color = "warning"
      this.presentToast();

    } else if (!this.pPrice) {
      this.msg = "Invalid retail price!";
      this.color = "warning"
      this.presentToast();

    } else if (!this.stock) {
      this.msg = "Invalid stock value!";
      this.color = "warning"
      this.presentToast();

    } else if (!this.supplier) {
      this.msg = "Please select supplier!";
      this.color = "warning"
      this.presentToast();

    } else if (!this.barcode || this.barcode.length == 0) {
      this.msg = "Invalid barcode!";
      this.color = "warning"
      this.presentToast();
    } else {
      if (!this.SGST){
        this.SGST = 0
      }
      if (!this.IGST){
        this.IGST = 0
      }
      if (!this.CGST){
        this.CGST = 0
      }
      let data = {
        name: this.name,
        rPrice: this.rPrice,
        pPrice: this.pPrice,
        stock: this.stock,
        supplier: this.supplier,
        barcode: this.barcode,
        SGST:this.SGST,
        IGST:this.IGST,
        CGST:this.CGST,
        HSN:this.HSN,
      }
      this.items.push(data);`
      window.localStorage.setItem('items', JSON.stringify(this.items));`
      this.msg = "Item added!";
      this.color = "success"
      this.presentToast();
      this.modalController.dismiss(data);
    }
  }

  ngOnInit() {
    this.getItems();
  }

}
