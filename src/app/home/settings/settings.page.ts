import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

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
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(

    public actionSheetController: ActionSheetController,
    private firebaseauth: AngularFireAuth,
    public toastController: ToastController,
    public alertController: AlertController,
    private callNumber: CallNumber,
    public modalController: ModalController,
    private router: Router,
    private firestore: AngularFirestore,
  ) {
    this.currentDiv = 'one'
  }

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
  currentDiv: string;
  helpers: any;

  currentPage(name) {
    this.currentDiv = name
    this.checkRequests()
  }
  phone: number;

  async addNote() {
    const alert2 = await this.alertController.create({
      subHeader: "please add a phone number with 913568878952 format",
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'input',
          id: 'name',
          value: name,
          placeholder: "Enter the number here..",
        },
      ],
      buttons: [{
        text: 'Next',
        handler: data => {
          this.phone = data.input;
          alert(this.phone)
        },
      },
      ]
    });
    await alert2.present();
  }


  checkRequests() {
    console.log('check', this.storeInfo);
    this.firestore.collection('helpers', q => q.where('ownerPhone', '==', this.storeInfo.owner).where('requestStatus', '==', 'pending')).valueChanges().subscribe((data: any) => {
      console.log(data);
      this.helpers = data


    })

  }


  accept(id: string) {
    const requestStatus = 'approved'
    const docID = this.storeInfo.docID
    this.firestore.collection('helpers').doc(id).update({
      docID,
      requestStatus,
    }).then(() => {
      alert('PERMITED')
      this.currentDiv = 'one'
    })

  }

  logout() {
    this.firebaseauth.auth.signOut();
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

  gotoPage(pageName: string) {
    this.router.navigate([pageName])
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getItems();
  }

}
