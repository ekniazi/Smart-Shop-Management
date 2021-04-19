import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
})
export class POSPage implements OnInit {

  constructor(
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController
  ) { }

  items: any[];
  sales: any[];
  recipt: any[] = [];
  msg: string;
  color: string;
  total: number;

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.msg,
      duration: 800,
      color: this.color,
      position: 'top',
    });
    toast.present();
  }

  getItems() {
    if (window.localStorage.getItem('items')) {
      this.items = JSON.parse(window.localStorage.getItem('items'));
      alert(JSON.stringify(this.items));
    } else {
      this.items = [];
    }

    if (window.localStorage.getItem('sales')) {
      this.sales = JSON.parse(window.localStorage.getItem('sales'));
    } else {
      this.sales = [];
    }
  }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      var barcode = barcodeData.text;
      var found = false;
      for (var i = 0; i < this.items.length; i++) {
        if (barcode == this.items[i].barcode) {
          let data = this.items[i];
          data.quantity = 1;
          data.index = i;
          this.recipt.push(data);
          this.msg = "Item added!"
          this.color = "success";
          this.presentToast();
          found = true;
          break;
        }
      }
      if (found == false) {
        this.msg = "Item not found!"
        this.color = "danger";
        this.presentToast();
      }
    }).catch(err => {
      alert(err);
    });
  }

  endSale() {
    this.total = 0;
    for (var i = 0; i < this.recipt.length; i++) {
      this.items[this.recipt[i].index].stock = this.items[this.recipt[i].index].stock - this.recipt[i].quantity;
      window.localStorage.setItem('items',JSON.stringify(this.items));
      this.total = this.total + this.recipt[i].rPrice;
      let data = {
        recipt: this.recipt,
        total: this.total,
      }
      this.sales.push(data);
      window.localStorage.setItem('sales',JSON.stringify(this.sales));
      this.msg = "Sale completed!";
      this.color = "success";
      alert("The total is: " + this.total);
      this.presentToast();
      this.back();
    }
  }

  back() {
    this.router.navigate(['home/dashboard']);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getItems();
  }

  ionViewWillLeave() {
    this.recipt = [];
  }

}
