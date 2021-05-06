import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

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
  ) { }

  items: any[];
  searchParam: string;
  searchFound: any[] = [];
  msg: string;
  color: string;
  index: number;

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.msg,
      duration: 800,
      color: this.color,
      position: 'top',
    });
    toast.present();
  }

  ngOnInit() {
    this.getItems();
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
      if (item.barcode == this.items[k].barcode) {
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
        text: 'Edit item',
        handler: () => {
          console.log('Share clicked');
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
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
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
  }

  call(boi) {
    this.callNumber.callNumber(boi.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  getItems() {
    if (window.localStorage.getItem('items')) {
      this.items = JSON.parse(window.localStorage.getItem('items'));
    } else {
      this.items = [];
    }
  }

  ionViewWillEnter() {
    this.getItems();
  }

}
