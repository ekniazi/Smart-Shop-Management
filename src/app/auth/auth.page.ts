import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app'
import { WindowserviceService } from '../windowservice.service';
import { LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  //component to access DOM/child
  @ViewChild('passcode1') passcode1;
  @ViewChild('passcode2') passcode2;
  @ViewChild('passcode3') passcode3;
  @ViewChild('passcode4') passcode4;
  @ViewChild('passcode5') passcode5;
  @ViewChild('passcode6') passcode6;

  constructor(
    private router: Router,
    private firebaseauth: AngularFireAuth,
    private win: WindowserviceService,
    private createtoast: ToastController,
    public firestore: AngularFirestore,
    public loadingController: LoadingController,
    private platform: Platform,
    private translateConfigService: TranslateConfigService,

  ) {
    this.selectedLanguage = 'hindi'
    this.languageChanged(this.selectedLanguage)
    this.currentDiv = 'one'
  }
  selectedLanguage: string;
  currentDiv: string;
  languages: string[] = ["english", "TAMIL", "hindi"]
  msg: string;
  duration: number;
  color: string;
  loadermsg: string;
  loaderID: string;
  windowRef: any;
  params: string;


  languageChanged(lang: string) {

    this.selectedLanguage = lang
    console.log('language=>', this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  uppercase(text: string) {
    text.toLocaleUpperCase()
    return text;
  }

  //toasts
  async toastCreater() {
    const toast = await this.createtoast.create({
      color: this.color,
      duration: this.duration,
      message: this.msg,
      animated: true,
      mode: 'ios',
    });
    await toast.present();
  }

  //loading
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.loadermsg,
      spinner: 'dots',
      id: this.loaderID,
      mode: 'ios',
    });
    await loading.present();
  }

  changeView(id: string) {


    this.currentDiv = id;
  }


  check() {
    alert('Burron is cliced')
  }

  values: any = [];
  //when button is pressed
  onKeyUp(event, index) {
    if (event.target.value.length != 1) {
      this.setFocus(index - 2);
    } else {
      this.values.push(event.target.value);
      this.setFocus(index);
    }

    event.stopPropagation();
  }
  code: string;

  //otp submission
  submit(e: Event) {
    this.loaderID = 'verifyOtp'
    this.loadermsg = 'Veifying OTP'
    this.presentLoading();
    this.code = this.passcode1.value + this.passcode2.value + this.passcode3.value + this.passcode4.value + this.passcode5.value + this.passcode6.value;
    e.stopPropagation();
    this.changeView('four')
    this.verifyLoginCode(this.code)
  }

  //going to next input fielf automatically
  setFocus(index) {

    switch (index) {
      case 0:
        this.passcode1.setFocus();
        break;
      case 1:
        this.passcode2.setFocus();
        break;
      case 2:
        this.passcode3.setFocus();
        break;
      case 3:
        this.passcode4.setFocus();
        break;
      case 4:
        this.passcode5.setFocus();
        break;
      case 5:
        this.passcode6.setFocus();
        break;
    }
  }

  gotoHome() {
    this.router.navigate(['home'])
  }

  phone: any;
  c_code: number = 92;
  num: number;

  merge() {

    this.phone = this.c_code + this.num;
    this.sendLoginCode()
  }

  //sending OTP
  sendLoginCode() {

    this.loaderID = 'sendOtp'
    this.loadermsg = "sending..."
    this.presentLoading()
    const appVerifier = this.windowRef.recaptchaVerifier;

    firebase.auth().signInWithPhoneNumber('+' + this.phone, appVerifier)
      .then(result => {
        this.currentDiv = "three";
        this.changeView('three')
        this.windowRef.confirmationResult = result;
        this.currentDiv = "three";
        this.changeView('three')
        alert(result.verificationId)

        setTimeout(() => {
          this.msg = "OTP Sent to your phone number"
          this.duration = 2000;
          this.color = "dark";
          this.toastCreater();
          this.loadingController.dismiss('sendOtp')

        }, 3000);



      }).then(() => {
        this.changeView('three')
      }).catch((e) => {
        console.log("error", e);
        this.msg = "Unable to send verification message Try again later"
        this.duration = 2000;
        this.color = "dark";
        this.toastCreater();

        this.loadingController.dismiss('sendOtp')
      })
  }

  //verifying OTP
  verifyLoginCode(code: any) {

    this.windowRef.confirmationResult
      .confirm(code)
      .then(result => {
        console.log("code-->", code);

        this.loadingController.dismiss('verifyOtp')
        this.msg = "OTP Verified Successfully"
        this.duration = 2000;
        this.color = "dark";
        this.toastCreater();
        this.currentDiv = 'four'
      })
      .catch(error => {
        this.loadingController.dismiss('verifyOtp')
        this.msg = "INVALID OTP!!"
        this.duration = 2000;
        this.color = "dark";
        this.toastCreater();
      });
  }

  name: string;
  adress: string;
  referal: string
  abc: boolean = false;


  saveData() {

    if (!this.name || !this.adress || !this.referal) {
      this.msg = "Fill out All fields";
      this.toastCreater()

    }
    else {
      const authsub = this.firebaseauth.authState.subscribe(user => {
        if (user && user.uid) {
          const userID = user.uid;
          const timeJoined = new Date();
          const phone = this.phone;
          const name = this.name;
          const language = this.selectedLanguage;
          const adress = this.adress;
          const referal = this.referal;
          this.firestore.collection('users').doc(user.uid).set({
            name, adress, language,
            phone, userID, timeJoined,
            referals: firebase.firestore.FieldValue.arrayUnion({
              referal
            })
          }).then(() => {
            this.gotoHome();

          }).catch(e => {
            this.msg = JSON.stringify(e.message)
            this.toastCreater()
          })
        }
      })
    }

  }

  checkAuth(uid: string) {
    this.firestore.collection('users').doc(uid).valueChanges().subscribe((res: any) => {
      if (res == undefined) {

      }
      else {
        this.gotoHome()
      }
    })
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    this.windowRef.recaptchaVerifier.render()

    const authSub = this.firebaseauth.authState.subscribe(user => {
      if (user) {
        if (user.uid) {
          this.checkAuth(user.uid)
        }
        else {

        }
      }
    })
  }

}
