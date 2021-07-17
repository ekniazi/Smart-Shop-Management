import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app'
import { WindowserviceService } from '../windowservice.service';
import { LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateConfigService } from '../translate-config.service';
import { AlertController } from '@ionic/angular';
declare var SMSReceive: any;

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
    private translateConfigService: TranslateConfigService,
    private platform: Platform,
    public alertController: AlertController,
    private onesignal: OneSignal,

  ) {
    this.selectedLanguage = 'hindi'
    this.languageChanged(this.selectedLanguage)
    this.currentDiv = 'one'
  }
  selectedLanguage: string;
  currentDiv: string;
  languages: string[] = ['English', 'Gujrati', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Malayalam', 'Telugu', 'Kannada']
  msg: string;
  duration: number;
  color: string;
  loadermsg: string;
  loaderID: string;
  windowRef: any;
  params: string;
  userTyp: string[] = ["Owner", "Helper"]
  selectedUser: string;

  async presentAlertConfirm(err: string) {
    const alert = await this.alertController.create({
      header: 'Something went wrong!!',
      message: JSON.stringify(err),
      mode: 'ios',
      buttons: [
        {
          text: 'Retry',
          handler: (blah) => {
            this.sendLoginCode()
          }
        }, {
          text: 'Edit',
          handler: () => {
            this.currentDiv = 'two';
          }
        }
      ]
    });

    await alert.present();
  }

  languageChanged(lang: string) {

    this.selectedLanguage = lang
    console.log('language=>', this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  userselect(param: string) {
    this.selectedUser = param
    window.localStorage.setItem('usertype', this.selectedUser);
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
  code: any;

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

  gotoPage() {
    if (this.selectedUser == 'Owner') {

      this.router.navigate(['ownerpage'])
    }
    else if (this.selectedUser == 'Helper') {
      this.router.navigate(['helperpage'])
    }
  }

  phone: any;
  c_code: number = 91;
  num: number;

  merge() {

    this.phone = this.c_code + this.num;
    this.sendLoginCode()
  }

  //sending OTP
  sendLoginCode() {

    if (!this.phone) {
      this.msg = 'Field cannot be left blank'
      this.toastCreater()

    }
    else {
      this.loaderID = 'sendOtp'
      this.loadermsg = "sending and fetching otp..."
      this.presentLoading()
      const appVerifier = this.windowRef.recaptchaVerifier;
      this.currentDiv = "three";
      this.changeView('three')
      firebase.auth().signInWithPhoneNumber('+' + this.phone, appVerifier)
        .then(result => {

          this.windowRef.confirmationResult = result;
          this.start()


          setTimeout(() => {
            this.msg = "OTP Sent to your phone number"
            this.duration = 2000;
            this.color = "dark";
            this.toastCreater();
            this.loadingController.dismiss('sendOtp')

          }, 2000);



        }).then(() => {
          this.changeView('three')

        }).catch((e) => {
          console.log("error", e);

          this.msg = JSON.stringify(e)
          this.duration = 2000;
          this.color = "dark";
          this.toastCreater();
          this.loadingController.dismiss('sendOtp').then(() => {
            this.presentAlertConfirm(e)
          })


        })
    }
  }

  done: boolean = false;

  //verifying OTP
  verifyLoginCode(code: any) {

    this.windowRef.confirmationResult
      .confirm(code)
      .then(result => {

        this.done = true;
        this.stop();
        this.loadingController.dismiss('getotp')
        this.loadingController.dismiss('verifyOtp')
        this.msg = "OTP Verified Successfully"
        this.duration = 2000;
        this.color = "dark";
        this.toastCreater();
      })
      .catch(error => {
        this.loadingController.dismiss('verifyOtp')
        this.msg = "INVALID OTP!!"
        this.duration = 2000;
        this.color = "dark";
        this.toastCreater();
        this.presentAlertConfirm(JSON.stringify(error))
      });
  }

  name: string;
  adress: string = "";
  referal: string = ""
  abc: boolean = false;


  saveData() {
    if (this.phone.length < 10) {
      this.msg = 'invalid number'
      this.toastCreater()
    }

    else if (!this.selectedUser) {
      this.msg = 'User Type cannot be left blank'
      this.toastCreater()
    }
    else if (!this.adress) {
      this.msg = 'Adress cannot be left blank'
      this.toastCreater()
    }
    else if (!this.name) {
      this.msg = 'name cannot be left blank'
      this.toastCreater()
    }
    else {
      let userData = {
        name: this.name,
        timeJoined: new Date(),
        phone: this.phone,
        language: this.selectedLanguage,
        adress: this.adress,
        uType: this.selectedUser,
        referal: this.referal,
        playerId: this.playerID
      }

      window.localStorage.setItem('user', JSON.stringify(userData))

      const authsub = this.firebaseauth.authState.subscribe(user => {
        if (user && user.uid) {
          const userID = user.uid;
          const timeJoined = new Date();
          const phone = '+' + this.phone;
          const name = this.name;
          const userType = this.selectedUser
          const language = this.selectedLanguage;
          const adress = this.adress;
          const referal = this.referal;
          const playerId = this.playerID
          this.firestore.collection(this.selectedUser).doc(user.uid).set({
            name, adress, language,
            phone, userID, timeJoined, userType,
            referal, playerId
          }).then(() => {
            this.msg = 'Welcome to SMARTSHOP Management'
            this.toastCreater()
            this.gotoPage();
          }).catch(e => {
            this.msg = JSON.stringify(e.message)
            this.toastCreater()
          })
        }
      })
    }

  }
  playerID: string;

  getOnesignalKey() {


    this.onesignal.getIds().then(user => {
      this.playerID = user.userId
      console.log('device id=>', this.playerID);
    }).catch((err => {
      this.msg = JSON.stringify(err.message)
      this.toastCreater()
    }))
  }
//lidh

  checkAuth(uid: string) {
    this.firestore.collection('shopowners').doc(uid).valueChanges().subscribe((res: any) => {
      if (res == undefined) {

      }
      else {

      }
    })
  }


  start() {

    if (SMSReceive) {
      SMSReceive.startWatch(
        () => {

          this.loaderID = 'getotp'
          this.loadermsg = 'Fetching OTP'
          this.presentLoading()
          setTimeout(() => {
            this.loadingController.dismiss('getotp')
            if (!this.code) {
              this.msg = 'Auto fetch failed add manualy'
              this.toastCreater()
            }
          }, 10000);
          document.addEventListener('onSMSArrive', (e: any) => {

            var IncomingSMS = e.data;

            this.processSMS(IncomingSMS);
          });
        },
        (e) => {
          console.log('watch start failed', e)
          this.loadingController.dismiss('getotp')
        }
      )
    }

  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;

  processSMS(data) {
    const message = data.body;
    if (message) {
      this.code = data.body.slice(0, 6);

      this.a = this.code.slice(0, 1)
      this.b = this.code.slice(1, 2)
      this.c = this.code.slice(2, 3)
      this.d = this.code.slice(3, 4)
      this.e = this.code.slice(4, 5)
      this.f = this.code.slice(5, 6)

      this.verifyLoginCode(this.code)
    }
    else {
      alert('data was empty')
    }
  }


  ngOnInit() {

    this.platform.ready().then(() => {
      this.getOnesignalKey()
    })

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
