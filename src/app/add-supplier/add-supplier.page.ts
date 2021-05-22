import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.page.html',
  styleUrls: ['./add-supplier.page.scss'],
})
export class AddSupplierPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    public toastController: ToastController
  ) {
  }

  name: string;
  phone: string;
  address: string;
  suppliers: any[];
  params: any;

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Supplier Added!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  getSuppliers() {
    if (window.localStorage.getItem('suppliers')) {
      this.suppliers = JSON.parse(window.localStorage.getItem('suppliers'));
    } else {
      this.suppliers = [];
    }
  }

  addSupplier() {
    let data = {
      name: this.name,
      phone: this.phone,
      address: this.address,
    }
    this.suppliers.push(data);
    window.localStorage.setItem('suppliers', JSON.stringify(this.suppliers));
    this.presentToast();
    this.modalCtrl.dismiss(data);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.getSuppliers();
  }

}
