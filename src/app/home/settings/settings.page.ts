import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController } from '@ionic/angular';


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
    this.currentDiv = 'languages'
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
  params: any;
  languagesAvailable: string[] = ['English', 'Gujrati', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Malayalam', 'Telugu', 'Kannada']
  currentPage(name) {
    this.currentDiv = name

  }

  //toasts
  async toastCreater() {
    const toast = await this.toastController.create({
      color: this.color,
      duration: 2000,
      message: this.msg,
      animated: true,
      mode: 'ios',
    });
    await toast.present();
  }


  phone: number;
  name: string;
  async addNote() {
    const alert2 = await this.alertController.create({
      subHeader: "please add a phone number with 913568878952 format",
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          id: 'name',
          placeholder: "Enter the name here..",
        },
        {
          name: 'phone',
          id: 'phone',
          type: 'number',
          placeholder: "Enter the number here..",
        },
      ],
      buttons: [{
        text: 'Next',
        handler: data => {

          this.phone = data.phone;
          this.name = data.name;

          if (!this.name || !this.phone) {
            this.msg = 'Fields cannot be left blank'
            this.toastCreater()
            this.addNote()
          }
          else {
            alert('all okey')
            const docID = this.storeInfo.docID
            const phone = '+' + this.phone
            const name = this.name
            const timestamp = new Date()
            this.firestore.collection('helpers', q => q.where('phone', '==', phone)).valueChanges().subscribe((res: any) => {
              console.log('lkaho', res[0].userID + 'phone' + phone);

              if (res.length < 1) {

                this.msg = 'cannot send invitation user donnot exist!!'
                this.toastCreater()
              }
              else {
                const requestStatus = 'recieved'
                this.firestore.collection('helpers').doc(res[0].userID).update({
                  docID,
                  name,
                  phone,
                  timestamp,
                  requestStatus
                }).then(() => {

                  this.msg = 'helper invitation sent successfully'
                  this.toastCreater()
                }).catch(err => {

                  this.msg = JSON.stringify(err.message)
                  this.toastCreater()
                })

              }
            })

          }
        },
      },
      ]
    });
    await alert2.present();
  }


  checkRequests() {
    this.currentPage('two')
    console.log('check req', this.storeInfo);
    this.firestore.collection('helpers', q => q.where('ownerPhone', '==', this.storeInfo.owner).where('requestStatus', '==', 'pending')).valueChanges().subscribe((data: any) => {
      console.log(data);
      if (data == undefined) {
        this.msg = 'NO new requests at the moment'
        this.toastCreater()
        this.helpers = undefined
      }
      else {
        this.helpers = data

      }

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

  checkboxClick(e, value) {
    console.log(value);

    var statement = true;
    if (statement) {
      e.checked = true;
    }
    this.msg = 'Language Changed!!'
    this.toastCreater()
    this.currentDiv = 'one'

  }


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getItems();
  }

}
