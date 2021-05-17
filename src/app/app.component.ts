import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AngularFireAuth,
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    public firestore: AngularFirestore,
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
              this.router.navigate(['pos'])
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

  checkUpload() {
    if (window.localStorage.getItem('itemsToBeUploaded')) {
      this.itemsToBeUploaded = JSON.parse(window.localStorage.getItem('itemsToBeUploaded'));
      this.user = JSON.parse(window.localStorage.getItem('user'));
      for (var i = 0; i < this.itemsToBeUploaded.length; i++) {
        this.firestore.collection('stores').doc(this.user.docID).update({
          items: firebase.firestore.FieldValue.arrayUnion(this.itemsToBeUploaded[i])
        }).then(()=>{
          this.itemsToBeUploaded = this.itemsToBeUploaded.splice(i,1);
        })
      }
    } else {
      this.itemsToBeUploaded = [];
    }
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
    });
  }


}
