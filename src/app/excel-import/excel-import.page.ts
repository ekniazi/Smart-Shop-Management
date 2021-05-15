import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

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
    private file: File,
  ) { }

  csvData: any[] = [];
  headerRow: any[] = [];
  
  private loadCSV() {
    this.http
      .get('./assets/file.csv', {
        responseType: 'text'
      })
      .subscribe(
        data => this.extractData(data),
        err => console.log('something went wrong: ', err)
      );
  }
 
  private extractData(res) {
    let csvData = res || '';
 
    this.papa.parse(csvData, {
      complete: parsedData => {
        this.headerRow = parsedData.data.splice(0, 1)[0];
        this.csvData = parsedData.data;
        alert(JSON.stringify(this.csvData));
      }
    });
  }
 
  exportCSV() {
    let csv = this.papa.unparse({
      fields: this.headerRow,
      data: this.csvData
    });
 
    if (this.plt.is('cordova')) {
      this.file.writeFile(this.file.dataDirectory, 'data.csv', csv, {replace: true}).then( res => {

      });
 
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

  ngOnInit() {
    this.loadCSV();
  }


}
