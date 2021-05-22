import { TranslateConfigService } from './translate-config.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent {
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    public firestore: AngularFirestore,
    private datePipe: DatePipe,
    private translateConfigService: TranslateConfigService,
  ) {
    this.initializeApp();
  }

  user: any;

  checkLogin() {
    this.auth.authState.subscribe(user => {
      if (user && user.uid) {
        if (window.localStorage.getItem('user')) {

          this.user = JSON.parse(window.localStorage.getItem('user'));
          if (this.user.uType == 'Owner') {

            if (this.user.docID) {
              this.router.navigate(['home/dashboard'])
            }
            else {
              this.router.navigate(['ownerpage'])
            }
          }
          else if (this.user.uType == 'Helper') {
            if (this.user.docID) {
              this.checkRequestsSent(user.uid)
            }
            else {
              this.router.navigate(['helperpage'])
            }
          }

        }
      } else {
        this.router.navigate(['auth'])
      }
    })
  }

  checkRequestsSent(userID: string) {
    this.firestore.collection('helpers').doc(userID).valueChanges().subscribe((data: any) => {
      console.log('just to chekc', data);

      if (data == undefined) {
        console.log('no user found on firebase');

      }
      else if (data.requestStatus) {
        if (data.requestStatus == 'pending') {

          this.router.navigate(['helperpage'])

        }
        else if (data.requestStatus == 'recieved') {
          this.router.navigate(['helperpage'])

        }
        else if (data.requestStatus == 'approved') {
          this.router.navigate(['pos'])
        }
      }
      else {
        this.router.navigate(['helperpage'])
        console.log('na request sent na recienved');

      }
    })
  }

  setupPush() {

    this.oneSignal.startInit('6d7af57e-6cca-497a-8434-fad4034ee6fb', '184492540467');

    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;

    });

    this.oneSignal.endInit();
  }

  itemsToBeUploaded: any[];
  salesToBeUpload: any[];

  checkUpload() {
    if (window.localStorage.getItem('itemsToBeUploaded')) {
      this.itemsToBeUploaded = JSON.parse(window.localStorage.getItem('itemsToBeUploaded'));
      this.user = JSON.parse(window.localStorage.getItem('user'));
      for (var i = 0; i < this.itemsToBeUploaded.length; i++) {
        this.firestore.collection('stores').doc(this.user.docID).update({
          items: firebase.firestore.FieldValue.arrayUnion(this.itemsToBeUploaded[i])
        }).then(() => {
          this.itemsToBeUploaded.splice(i, 1);
        })
      }
    } else {
      this.itemsToBeUploaded = [];
    }
    if (window.localStorage.getItem('salesToBeUpload')) {
      this.salesToBeUpload = JSON.parse(window.localStorage.getItem('salesToBeUpload'));
      this.user = JSON.parse(window.localStorage.getItem('user'));
      for (var i = 0; i < this.salesToBeUpload.length; i++) {
        const sale = JSON.stringify(this.salesToBeUpload[i]);
        const pathDate = this.datePipe.transform(this.salesToBeUpload[i].date, 'ddMMyyyy');
        const sub = this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).get().subscribe(data2 => {
          if (data2.exists) {
            this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).update({
              sales: firebase.firestore.FieldValue.arrayUnion(sale)
            }).then(data2 => this.salesToBeUpload.splice(i, 1))
            sub.unsubscribe();
          } else {
            this.firestore.collection('stores').doc(this.user.docID).collection('sales').doc(pathDate).set({
              sales: firebase.firestore.FieldValue.arrayUnion(sale)
            }).then(data2 => this.salesToBeUpload.splice(i, 1))
            sub.unsubscribe();
          }
        })
      }
    } else {
      this.salesToBeUpload = [];
    }
  }

  selectedLanguage: string;

  languageChanged(lang: string) {

    this.selectedLanguage = lang
    console.log('language=>', this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }


  initializeApp() {
    this.platform.ready().then(() => {
      console.log('platform ready');
      this.statusBar.show();
      this.statusBar.backgroundColorByHexString("ffffff");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkLogin();
      this.checkUpload()
      this.setupPush()
      this.selectedLanguage = 'english'
      this.languageChanged(this.selectedLanguage)
    });
  }


}
