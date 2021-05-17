import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.page.html',
  styleUrls: ['./suppliers.page.scss'],
})
export class SuppliersPage implements OnInit {

  constructor(
    private callNumber: CallNumber,
    private router: Router,
  ) { }

  suppliers: any[];

  getSuppliers() {
    if (window.localStorage.getItem('suppliers')) {
      this.suppliers = JSON.parse(window.localStorage.getItem('suppliers'));
    } else {

    }
  }

  addsupplier() {
    this.router.navigate(['select-supplier'])
  }

  call(boi) {
    this.callNumber.callNumber(boi.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getSuppliers();
  }

}
