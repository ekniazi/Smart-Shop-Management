import { TranslateConfigService } from './../../translate-config.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from 'src/app/add-item/add-item.page';
import { AddSupplierPage } from 'src/app/add-supplier/add-supplier.page';
import { ExcelImportPage } from 'src/app/excel-import/excel-import.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  providers: [DatePipe]
})
export class DashboardPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private router: Router,
    public firestore: AngularFirestore,
    private datePipe: DatePipe,
    private translateConfigService: TranslateConfigService,
  ) { }

  ModalPage: any;
  returnDat: any;
  user: any;
  statSales: any;
  revenue: number = 0;
  profit: number = 0;
  items: any;
  lenders: any;
  suppliers: any;
  params: any;



  async openModal() {
    const modal = await this.modalController.create({
      component: this.ModalPage,
      cssClass: 'color-modal',
    });

    modal.onDidDismiss()
      .then((event: any) => {
        if (event['data']) {
          this.returnDat = event['data'];
        }
      });

    return await modal.present();
  }

  gotTotPage(path: string) {
    this.router.navigate([path]);
  }

  openPOS() {
    this.router.navigate(['pos']);
  }

  addItem() {
    this.ModalPage = AddItemPage;
    this.openModal();
  }

  addSupplier() {
    this.ModalPage = AddSupplierPage;
    this.openModal();
  }

  excelImport() {
    this.ModalPage = ExcelImportPage;
    this.openModal();
  }

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
    if (window.localStorage.getItem('suppliers')) {
      this.suppliers = JSON.parse(window.localStorage.getItem('suppliers'));
    } else {
      this.suppliers = [];
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
  }

  ngOnInit() {
    this.getItems();
    const date = new Date();
    const pathDate = this.datePipe.transform(date, 'ddMMyyyy');
    this.user = JSON.parse(window.localStorage.getItem('user'));
    console.log(this.user.language);
  
    this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).valueChanges().subscribe(data => {
      this.statSales = data;
      this.revenue = 0;
      this.profit = 0;
      if (this.statSales.sales) {
        for (var i = 0; i < this.statSales.sales.length; i++) {
          this.statSales.sales[i] = JSON.parse(this.statSales.sales[i]);
          this.revenue = this.revenue + this.statSales.sales[i].total;
          if (this.statSales.sales[i].recipt.length > 0) {
            for (var k = 0; k < this.statSales.sales[i].recipt.length; k++) {
              this.profit = (this.statSales.sales[i].recipt[k].rPrice * this.statSales.sales[i].recipt[k].quantity) - (this.statSales.sales[i].recipt[k].pPrice * this.statSales.sales[i].recipt[k].quantity);
            }
          }
        }
      }
    })
  }

}
