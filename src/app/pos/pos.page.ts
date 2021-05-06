import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
})
export class POSPage implements OnInit {

  constructor(
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController,
    public alertController: AlertController,
  ) { }

  items: any[];
  sales: any[];
  lenders: any[];
  recipt: any[] = [];
  msg: string;
  color: string;
  total: number;
  searchParam: string;
  searchFound: any[] = [];
  paid: number = 0;
  cNum: string = "";
  cName2: string = "";

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
    } else {
      this.items = [];
    }

    if (window.localStorage.getItem('sales')) {
      this.sales = JSON.parse(window.localStorage.getItem('sales'));
    } else {
      this.sales = [];
    }

    if (window.localStorage.getItem('lenders')) {
      this.lenders = JSON.parse(window.localStorage.getItem('lenders'));
    } else {
      this.lenders = [];
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

  addSearchItem(item) {
    let data = item;
    data.quantity = 1;
    this.recipt.push(data);
    this.msg = "Item added!"
    this.color = "success";
    this.presentToast();
    this.searchParam = "";
    this.searchFound = [];
  }

  searchItem() {
    this.searchFound = [];
    var found = 0;
    if (this.searchParam != "") {
      for (var k = 0; k < this.items.length; k++) {
        if (this.items[k].name.toLowerCase().includes(this.searchParam.toLowerCase())) {
          found = found + 1;
          if (found < 8) {
            this.searchFound.push(this.items[k]);
            this.searchFound[this.searchFound.length - 1].index = k;
          } else break
        } else if (this.items[k].barcode.toLowerCase().includes(this.searchParam.toLowerCase())) {
          found = found + 1;
          if (found < 8) {
            this.searchFound.push(this.items[k]);
            this.searchFound[this.searchFound.length - 1].index = k;
          } else break
        }
      }
    }
  }

  async getAmount() {
    const alert2 = await this.alertController.create({
      subHeader: "How much is the customer paying?",
      header: "TOTAL: " + this.total.toString(),
      message: "Kindly provide exact figures to calculate the arrear money or update the borrowing table. If the customer is paying nothing enter 0.",
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'input',
          type: 'number',
          id: 'name',
          value: name,
          placeholder: "Enter the amount here..",
        },
      ],
      buttons: [{
        text: 'Next',
        handler: data => {
          this.paid = data.input;
          this.cName();
        },
      },
      ]
    });
    await alert2.present();
  }

  async cName() {
    const alert2 = await this.alertController.create({
      header: "Customer's name?",
      subHeader: "You can leave it blank if the customer doesn't want to share name.",
       mode: 'ios',
       backdropDismiss: false,
      inputs: [
        {
          name: 'input',
          type: 'text',
          id: 'name',
          value: name,
          placeholder: "Enter the name here..",
        },
      ],
      buttons: [{
        text: 'Done',
        handler: data => {
          this.cName2 = data.input;
          this.cNumber();
        },
      },
      ]
    });
    await alert2.present();

  }

  async cNumber() {
    const alert2 = await this.alertController.create({
      subHeader: "Would you wish to enter the customer's number?",
      header: "RETURN: "+ (this.paid-this.total),
      message: "If the customer is not paying full it is mandatory to enter the customer's number for future tracking of borrowed money.",
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'input',
          type: 'number',
          id: 'name',
          value: name,
          placeholder: "Enter the number here..",
        },
      ],
      buttons: [{
        text: 'Done',
        handler: data => {
          this.cNum = data.input;
          this.endSale2();
        },
      },
      ]
    });
    await alert2.present();

  }

  endSale() {
    this.total = 0;
    for (var i = 0; i < this.recipt.length; i++) {
      this.items[this.recipt[i].index].stock = this.items[this.recipt[i].index].stock - this.recipt[i].quantity;
      this.total = this.total + (this.recipt[i].rPrice * this.recipt[i].quantity);
    }
    window.localStorage.setItem('items', JSON.stringify(this.items));
    this.getAmount();
  }

  endSale2() {
    let data = {
      recipt: this.recipt,
      total: this.total,
      paid: this.paid,
      cNum: this.cNum,
      cName: this.cName2,
    }
    if (this.paid < this.total) {
      this.lenders.push(data);
      window.localStorage.setItem('lenders', JSON.stringify(this.lenders));
    }
    this.sales.push(data);
    window.localStorage.setItem('sales', JSON.stringify(this.sales));
    this.msg = "Sale completed!";
    this.color = "success";
    this.presentToast();
    this.back();
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
