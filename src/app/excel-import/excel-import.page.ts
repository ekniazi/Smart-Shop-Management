import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpRequest, HttpEvent, HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.page.html',
  styleUrls: ['./excel-import.page.scss'],
})
export class ExcelImportPage implements OnInit {

  constructor(
    private http: HttpClient,
    private papa: Papa,
    private plt: Platform,
    private router: Router,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private loadingController: LoadingController,
    public toastController: ToastController,
    public modalController: ModalController,
    public firestore: AngularFirestore,
  ) { }

  csvData: any[] = [];
  headerRow: any[] = [];
  fileURL: string;
  fileTo: File;
  tempItems: any[] = [];
  items: any;
  user:any;
  itemsToBeUploaded: any;

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.tempItems.length + ' items have been added to your inventory',
      duration: 4000,
      color: 'success',
    });
    toast.present();
  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 6000,

    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  selectedFiles: FileList;
  currentFile: File;
  uploadFile(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', 'https://www.exportportal.site/uploadimage.php', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  imageURL: string;
  selectFile(event) {
    this.presentLoading();
    this.selectedFiles = event.target.files;
    this.imageURL = 'https://www.exportportal.site/vendors/' + this.selectedFiles[0].name
    this.upload()
  }

  upload() {
    this.currentFile = this.selectedFiles.item(0);
    this.uploadFile(this.currentFile,).subscribe(response => {
      if (response instanceof HttpResponse) {
        this.loadCSV(this.imageURL);
      }
    });
    return;
  }

  private loadCSV(fileURL: string) {
    this.http
      .get(fileURL, {
        responseType: 'text'
      })
      .subscribe(
        data => this.extractData(data),
        err => alert('something went wrong: ' + JSON.stringify(err))
      );
  }

  private extractData(res) {
    let csvData = res || '';

    this.papa.parse(csvData, {
      complete: parsedData => {
        this.headerRow = parsedData.data.splice(0, 1)[0];
        this.csvData = parsedData.data;
        this.processData();
      }
    });
  }

  processData() {
    for (var i = 1; i < this.csvData.length; i++) {
      let data = {
        name: this.csvData[i][0],
        rPrice: this.csvData[i][1],
        pPrice: this.csvData[i][2],
        stock: this.csvData[i][3],
        barcode: this.csvData[i][4],
        SGST: this.csvData[i][5],
        IGST: this.csvData[i][6],
        CGST: this.csvData[i][7],
        HSN: this.csvData[i][8],
      }
      if (data.name && data.rPrice && data.pPrice && data.stock && data.barcode) {
        this.tempItems.push(data);
      }
    }
    this.loadingController.dismiss();
  }

  exportCSV() {
    let csv = this.papa.unparse({
      fields: this.headerRow,
      data: this.csvData
    });
    if (this.plt.is('cordova')) {
      //this.file.writeFile(this.file.dataDirectory, 'data.csv', csv, { replace: true }).then(res => {

      //});

    } else {
      // Dummy implementation for Desktop download purpose
      var blob = new Blob([csv]);
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'newdata.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  addItems() {
    for (var i = 0; i < this.tempItems.length; i++) {
      this.items.push(this.tempItems[i])
      let data = this.tempItems[i];
      this.firestore.collection('stores').doc(this.user.docID).update({
        items: firebase.firestore.FieldValue.arrayUnion(data)
      }).then(data => console.log(data)).catch((err) => {
        console.log(err);
        this.itemsToBeUploaded.push(data);
        window.localStorage.setItem('itemsToBeUploaded', JSON.stringify(this.itemsToBeUploaded));
      })
    }
    this.items = (window.localStorage.setItem('items', JSON.stringify(this.items)));
    this.presentToast();
    this.close();
  }

  close() {
    this.modalController.dismiss();
  }

  getItems() {
    if (window.localStorage.getItem('items')) {
      this.items = JSON.parse(window.localStorage.getItem('items'));
    } else {
      this.items = [];
    }
    if (window.localStorage.getItem('user')) {
      this.user = JSON.parse(window.localStorage.getItem('user'));
    } else {
      this.user = [];
    }
  }

  ionViewWillEnter(){
    this.getItems();
    this.tempItems = [];
  }

  ngOnInit() {
    this.getItems();
  }

}
