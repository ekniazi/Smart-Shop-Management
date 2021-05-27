import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Platform } from "@ionic/angular";
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
  providers: [DatePipe]
})
export class POSPage implements OnInit {

  constructor(
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController,
    public alertController: AlertController,
    private datePipe: DatePipe,
    public firestore: AngularFirestore,
    private platform: Platform,
    private auth: AngularFireAuth,
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
  note: string = "";
  discount: number = 0;
  revenue: number = 0;
  profit: number = 0;
  params: any;
  currentPage: string = 'dashboard'

  backDisbale = this.platform.backButton.subscribeWithPriority(999, () => {

    if (this.user.uType == 'Helper') {
      navigator['app'].exitApp();
    }
    else if (this.user.uType == 'Owner') {
      this.router.navigate(['home/dashboard'])
    }
  });

  changePage(c_page: string) {
    this.currentPage = c_page
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

  user: any;
  salesToBeUpload: any;

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
    if (window.localStorage.getItem('user')) {
      this.user = JSON.parse(window.localStorage.getItem('user'));
    } else {
      this.user = [];
    }
    if (window.localStorage.getItem('salesToBeUpload')) {
      this.salesToBeUpload = JSON.parse(window.localStorage.getItem('salesToBeUpload'));
    } else {
      this.salesToBeUpload = [];
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

  calculateTotal() {
    this.total = 0;
    for (var i = 0; i < this.recipt.length; i++) {
      this.total = this.total + (this.recipt[i].rPrice * this.recipt[i].quantity);
    }
    this.total = this.total - this.discount;
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
    this.calculateTotal();
  }

  deleteItem(i) {
    this.recipt.splice(i, 1);
  }

  clearRecipt() {
    this.recipt = [];
  }

  searchItem() {

    if (this.searchParam) {

      this.changePage('search')
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

    else {
      this.changePage('dashboard')
    }
  }

  async addNote() {
    const alert2 = await this.alertController.create({
      subHeader: "Would you like to add additional notes for this sale?",
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'input',
          id: 'name',
          value: name,
          placeholder: "Enter the note here..",
        },
      ],
      buttons: [{
        text: 'Next',
        handler: data => {
          this.note = data.input;
        },
      },
      ]
    });
    await alert2.present();
  }


  async addDiscount() {
    const alert2 = await this.alertController.create({
      subHeader: "How much should be the discount?",
      mode: 'ios',
      backdropDismiss: true,
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
          this.discount = Number(data.input);
        },
      },
      {
        text: 'Cancel',
        role: 'destructive'

      }

      ]
    });
    await alert2.present();
  }

  async getAmount() {
    const alert2 = await this.alertController.create({
      subHeader: "How much is the customer paying?",
      header: "TOTAL: " + this.total.toString(),
      message: "Kindly provide exact figures to calculate the arrear money or update the borrowing table. If the customer is paying nothing enter 0.",
      mode: 'ios',
      backdropDismiss: true,
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
          if (!this.paid) {
            this.msg = 'Cannot be blank'
            this.presentToast()
            this.getAmount()
          }
          else {
            if (this.paid > this.total) {
              this.toReturn = this.paid - this.total;
            }
            this.cName();
          }
        },
      },
      ]
    });
    await alert2.present();
  }

  toReturn: number = 0;
  async cName() {
    const alert2 = await this.alertController.create({
      header: "Customer's name?",
      subHeader: "To Return: " + this.toReturn,
      message: "Please add customer Name",
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
        text: 'Next',
        handler: data => {
          this.cName2 = data.input;
          if (!this.cName2) {
            this.msg = 'Add customer Name'
            this.presentToast()
            this.cName()
          }
          else {
            this.cNumber();
          }
        },
      },
      ]
    });
    await alert2.present();

  }

  async cNumber() {
    const alert2 = await this.alertController.create({
      header: "Please Add Customer's Number",
      subHeader: "Customer's number is must for future tracking",
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
        text: 'FINISH SALE',
        handler: data => {
          this.cNum = data.input;

          if (!this.cNum) {
            this.cNumber()
            this.msg = 'Add Customer Number'
            this.presentToast()
          }
          else {
            var str = this.cNum
            var res = str.substring(0, 2)
            if (res != '91') {

              this.cNum = '+91' + this.cNum
              this.endSale2()
            }
            else {
              this.endSale2();
            }
          }

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
    this.total = this.total - this.discount;
    this.getAmount();
  }

  endSale2() {
    window.localStorage.setItem('items', JSON.stringify(this.items));
    this.firestore.collection('stores').doc(this.user.docID).update({
      items: this.items,
    }).then(data2 => console.log('data2'))
    const date = new Date();
    const pathDate = this.datePipe.transform(date, 'ddMMyyyy');
    let data = {
      recipt: this.recipt,
      total: this.total,
      paid: this.paid,
      cNum: this.cNum,
      cName: this.cName2,
      date: date,
      discount: this.discount,
      note: this.note,
      soldBy: this.user.name,
    }
    const sale = JSON.stringify(data);
    if (this.paid < this.total) {
      this.lenders.push(data);
      window.localStorage.setItem('lenders', JSON.stringify(this.lenders));
    }
    this.sales.push(data);
    this.monthlyStuff(this.sales)
    window.localStorage.setItem('sales', JSON.stringify(this.sales));
    this.msg = "Sale completed!";
    this.color = "success";
    this.presentToast();

    const sub = this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).get().subscribe(data2 => {
      if (data2.exists) {
        this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).update({
          sales: firebase.firestore.FieldValue.arrayUnion(sale)
        }).then(data2 => console.log('data2')).catch((err) => {
          console.log(err);
          this.salesToBeUpload.push(data);
          window.localStorage.setItem('salesToBeUpload', JSON.stringify(this.salesToBeUpload));
          sub.unsubscribe();
        }
        )
      } else {
        this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).set({
          sales: firebase.firestore.FieldValue.arrayUnion(sale)
        }).then(data2 => console.log('data2')).catch((err) => {
          console.log(err);
          this.salesToBeUpload.push(data);
          window.localStorage.setItem('salesToBeUpload', JSON.stringify(this.salesToBeUpload));
          sub.unsubscribe();
        }
        )
      }
    })
    this.msg = 'Sale Completed'
    this.presentToast()

  }

  back() {
    this.router.navigate(['home/dashboard']);
  }

  statSales: any;
  temparray: any[] = [];

  getSales() {
    const date = new Date();
    const pathDate = this.datePipe.transform(date, 'ddMMyyyy');
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).valueChanges().subscribe((data: any) => {
      this.statSales = data;
      this.revenue = 0;
      this.profit = 0;
      if (this.statSales.sales) {
        for (var i = 0; i < this.statSales.sales.length; i++) {
          this.statSales.sales[i] = JSON.parse(this.statSales.sales[i]);
          this.revenue = this.revenue + this.statSales.sales[i].total;
          if (this.statSales.sales[i].recipt.length > 0) {
            for (var k = 0; k < this.statSales.sales[i].recipt.length; k++) {
              this.profit =
                (this.statSales.sales[i].recipt[k].rPrice * this.statSales.sales[i].recipt[k].quantity)
                - (this.statSales.sales[i].recipt[k].pPrice * this.statSales.sales[i].recipt[k].quantity);

              this.temparray.push(this.profit)


            }

          }
        }


        this.calculateProfit(this.temparray);

      }
    })

  }
  a: number = 0;
  sub: number = 0;

  calculateProfit(array) {

    for (var i = 0; i < array.length; i++) {


      this.sub = array[i] + this.a;
      this.a = this.sub


    }

  }
  sal: number;
  chk: number;
  discounts: number[] = [];
  reven: number[] = [];
  lett: number = 0;
  lets: number = 0;
  discountsthismonth: number;
  revenuethismonth: number;


  monthlyStuff(sale) {
    console.log('sale', sale);
    for (var i = 0; i < sale.length; i++) {
      this.sal = sale.length;
      if (sale[i].discount) {

        this.discounts.push(sale[i].discount)
      }

      if (sale[i].total) {

        this.reven.push(sale[i].total)
      }

    }

    console.log('discounts', this.discounts);
    console.log('total', this.reven);
    console.log('total sales', this.sal);

    for (var i = 0; i < this.discounts.length; i++) {
      this.lett = this.discounts[i] + this.lett
      this.discountsthismonth = this.lett
    }

    for (var i = 0; i < this.reven.length; i++) {

      this.lets = this.reven[i] + this.lets
      this.revenuethismonth = this.lets

    }

    alert('Discounts this month is' + this.discountsthismonth + "- okey now lets check revenue " + this.revenuethismonth + "-sales check " + this.sal)
    this.uploadToFirestore()


  }



  uploadToFirestore() {
    let currentDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    console.log('today is=>', monthNames[currentDate.getMonth()]);
    const discounts = this.discountsthismonth;
    const sales = this.sal;
    const revenue = this.revenuethismonth
    this.firestore.collection('stores').doc(this.user.docID).collection('monthly').doc(monthNames[currentDate.getMonth()]).valueChanges().subscribe((res: any) => {

      if (res == undefined) {
        this.firestore.collection('stores').doc(this.user.docID).collection('monthly').doc(monthNames[currentDate.getMonth()]).set({
          discounts,
          sales,
          revenue,
        }).then(() => {
          this.msg = 'Monthly stats updated'
          this.presentToast()
        }).catch(err => {

          this.msg = JSON.stringify(err.message)
          this.presentToast()

        })
      }
      else {
        this.firestore.collection('stores').doc(this.user.docID).collection('monthly').doc(monthNames[currentDate.getMonth()]).update({
          discounts,
          sales,
          revenue,
        }).then(() => {

          this.msg = 'Monthly stats updated'
          this.presentToast()
        }).catch(err => {

          this.msg = JSON.stringify(err.message)
          this.presentToast()

        })
      }

    })
  }

  ngOnInit() {
    this.getSales();
    this.getcurentUsershop()
  }

  ionViewWillEnter() {
    this.getItems();
  }

  ionViewWillLeave() {
    this.recipt = [];
  }

  getcurentUsershop() {

    this.firestore.collection('stores').doc(this.user.docID).valueChanges().subscribe((res: any) => {


      if (res.items) {

        if (res.items.length < 1) {


        }
        else {


          this.items = JSON.parse(window.localStorage.getItem('items'));
          console.log(this.items, 'item');
          this.items = res.items
          window.localStorage.setItem('items', JSON.stringify(this.items));
          this.items = JSON.parse(window.localStorage.getItem('items'));


        }
      }

    })
  }

}
