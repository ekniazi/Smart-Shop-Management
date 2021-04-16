import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  constructor(
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
  }

  barcode:string;

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.barcode = barcodeData.text;
    }).catch(err => {
      alert(err);
    });
  }

  ionViewWillEnter() {
  }

}
