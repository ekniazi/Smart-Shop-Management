import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from 'src/app/add-item/add-item.page';
import { AddSupplierPage } from 'src/app/add-supplier/add-supplier.page';
import { SelectSupplierPage } from 'src/app/select-supplier/select-supplier.page';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  constructor(
    public actionSheetController: ActionSheetController,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController,
    public alertController: AlertController,
    private callNumber: CallNumber,
    public modalController: ModalController,
  ) { }

  items: any[];
  toShow: any[];
  lenders: any[];
  sales: any[];
  searchParam: string;
  searchFound: any[] = [];
  msg: string;
  color: string;
  index: number;
  toCollect: number = 0;
  lowStock: number = 0;
  highStock: number = 0;
  stockValue: number = 0;
  salesValue: number = 0;
  ModalPage: any;
  returnDat: any;

  async openModal() {
    const modal = await this.modalController.create({
      component: this.ModalPage,
      cssClass: 'color-modal',
    });

    modal.onDidDismiss()
      .then((event: any) => {
        this.getItems();
        if (event['data']) {
          this.returnDat = event['data'];
        }
      });

    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.msg,
      duration: 800,
      color: this.color,
      position: 'top',
    });
    toast.present();
  }

  addItem() {
    this.ModalPage = AddItemPage;
    this.openModal();
  }

  ngOnInit() {
  }


  async addSupplier(item) {
    const modal = await this.modalController.create({
      component: SelectSupplierPage,
      cssClass: 'color-modal',
    });

    modal.onDidDismiss()
      .then((event: any) => {
        this.getItems();
        if (event['data']) {
          item.supplier = event['data'];
          window.localStorage.setItem('items', JSON.stringify(this.items));
        }
      });

    return await modal.present();
  }

  async editPurchase(item) {
    const alert2 = await this.alertController.create({
      subHeader: "Enter the purchase price",
      header: "This option is to change the pruchase price of the item stored in the app.",
      mode: 'ios',
      inputs: [
        {
          name: 'input',
          type: 'number',
          id: 'name',
          value: name,
          placeholder: "Enter the pruchase price here..",
        },
      ],
      buttons: [{
        text: 'Change',
        handler: data => {
          this.items[this.findItemIndex(item)].pPrice = Number(data.input);
          window.localStorage.setItem('items', JSON.stringify(this.items));
        }
      }, {
        text: 'Cancel',
        role: 'destructive',
        handler: data => {

        }
      }
      ]
    });
    await alert2.present();
  }

  async editRetail(item) {
    const alert2 = await this.alertController.create({
      subHeader: "Enter the retail price",
      header: "This option is to change the retail price of the item stored in the app.",
      mode: 'ios',
      inputs: [
        {
          name: 'input',
          type: 'number',
          id: 'name',
          value: name,
          placeholder: "Enter the retail price here..",
        },
      ],
      buttons: [{
        text: 'Change',
        handler: data => {
          this.items[this.findItemIndex(item)].rPrice = Number(data.input);
          window.localStorage.setItem('items', JSON.stringify(this.items));
        }
      }, {
        text: 'Cancel',
        role: 'destructive',
        handler: data => {

        }
      }
      ]
    });
    await alert2.present();
  }

  async changeStock(item) {
    const alert2 = await this.alertController.create({
      subHeader: "Enter the stock quantity.",
      header: "This option is to change the existig stock value stored in the app.",
      mode: 'ios',
      inputs: [
        {
          name: 'input',
          type: 'number',
          id: 'name',
          value: name,
          placeholder: "Enter the stock quantity here..",
        },
      ],
      buttons: [{
        text: 'Change',
        handler: data => {
          this.items[this.findItemIndex(item)].stock = Number(data.input);
          window.localStorage.setItem('items', JSON.stringify(this.items));
        },
      },
      ]
    });
    await alert2.present();
  }

  async addStock(item) {
    const alert2 = await this.alertController.create({
      subHeader: "Enter the new stock quantity.",
      header: "This option is to add stock to the existing value stored in the app.",
      mode: 'ios',
      inputs: [
        {
          name: 'input',
          type: 'number',
          id: 'name',
          value: name,
          placeholder: "Enter the stock quantity here..",
        },
      ],
      buttons: [{
        text: 'Add to Stock',
        handler: data => {
          this.items[this.findItemIndex(item)].stock = this.items[this.findItemIndex(item)].stock + Number(data.input);
          window.localStorage.setItem('items', JSON.stringify(this.items));
        },
      },
      ]
    });
    await alert2.present();
  }

  findItemIndex(item) {
    for (var k = 0; k < this.items.length; k++) {
      if (item == this.items[k]) {
        return k;
      }
    }
  }

  async showOptions(item) {
    const actionSheet = await this.actionSheetController.create({
      header: item.name,
      mode: 'ios',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Edit purchase price',
        handler: () => {
          this.editPurchase(item);
        }
      }, {
        text: 'Edit retail price',
        handler: () => {
          this.editRetail(item);
        }
      }, {
        text: 'Add Stock',
        handler: () => {
          this.addStock(item);
        }
      }, {
        text: 'Change Stock',
        handler: () => {
          this.changeStock(item);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'destructive',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
    actionSheet.onDidDismiss().then(() => {
      this.getInfo();
    })
  }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      var barcode = barcodeData.text;
      var found = false;
      for (var i = 0; i < this.items.length; i++) {
        if (barcode == this.items[i].barcode) {
          this.searchParam = barcode;
          this.searchItem();
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
    this.toShow = this.searchFound;
  }

  call(boi) {
    this.callNumber.callNumber(boi.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  getInfo() {
    this.toCollect = 0;
    this.lowStock = 0;
    this.highStock = 0;
    this.stockValue = 0;
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].index = i;
      this.stockValue = this.stockValue + (this.items[i].stock * this.items[i].pPrice);
      if (this.items[i].stock < 10) {
        this.lowStock = this.lowStock + 1;
      }
      if (this.items[i].stock > 30) {
        this.highStock = this.highStock + 1;
      }
    }
    this.toShow = this.items;
    for (var i = 0; i < this.lenders.length; i++) {
      if (this.lenders[i].paid) {
        this.toCollect = this.toCollect + (this.lenders[i].total - this.lenders[i].paid);
      } else {
        this.toCollect = this.toCollect + (this.lenders[i].total);
      }
    }

    for (var i = 0; i < this.sales.length; i++) {
      if (this.sales[i].paid) {
        this.salesValue = this.salesValue + Number(this.sales[i].paid);
      }
    }
  }

  sortLowStock() {
    this.toShow.sort((a, b) => (a.stock > b.stock) ? 1 : ((b.stock > a.stock) ? -1 : 0));
  }

  sortAlpha() {
    this.toShow.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  }

  sortPriceDown() {
    this.toShow.sort((a, b) => (a.rPrice > b.rPrice) ? 1 : ((b.rPrice > a.rPrice) ? -1 : 0));
  }

  sortPriceUp() {
    this.toShow.sort((a, b) => (a.rPrice < b.rPrice) ? 1 : ((b.rPrice < a.rPrice) ? -1 : 0));
  }

  storeInfo: any;
  getItems() {
    if (window.localStorage.getItem('items')) {
      this.items = JSON.parse(window.localStorage.getItem('items'));
    } else {
      this.items = [];
    }
    if (window.localStorage.getItem('lenders')) {
      this.lenders = JSON.parse(window.localStorage.getItem('lenders'));
    } else {
      this.lenders = [];
    }
    if (window.localStorage.getItem('sales')) {
      this.sales = JSON.parse(window.localStorage.getItem('sales'));
    } else {
      this.sales = [];
    }
    if (window.localStorage.getItem('storeInfo')) {
      this.storeInfo = JSON.parse(window.localStorage.getItem('storeInfo'));
    } else {
      this.storeInfo = [];
    }
    if (window.localStorage.getItem('sales')) {
      this.sales = JSON.parse(window.localStorage.getItem('sales'));
    } else {
      this.sales = [];
    }
    setTimeout(() => {
      this.getInfo();
    }, 600)
  }

  ionViewWillEnter() {
    this.getItems();
  }

}
