import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-helperpage',
  templateUrl: './helperpage.page.html',
  styleUrls: ['./helperpage.page.scss'],
})
export class HelperpagePage implements OnInit {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController,
    private http: HttpClient,
  ) {
    this.currentDiv = 'one'
  }
  loadermsg: string;
  loaderID: string;
  userID: string;
  user: any;
  msg: string;
  color: string;
  currentDiv: string;
  params: any;

  async presentToast() {
    const toast = await this.toast.create({
      message: this.msg,
      duration: 800,
      mode: 'ios',
      color: this.color,
      position: 'top',
    });
    toast.present();
  }


  //loading
  async presentLoading() {
    const loading = await this.loading.create({
      message: this.loadermsg,
      spinner: 'dots',
      id: this.loaderID,
      mode: 'ios',
    });
    await loading.present();
  }

  changeDiv(name: string) {
    this.currentDiv = name;
  }

  checkRequestsSent(userID: string) {
    this.firestore.collection('Helper').doc(userID).valueChanges().subscribe((data: any) => {
      console.log('just to chekc', data);

      if (data == undefined) {
        console.log('no user found on firebase');
        this.loading.getTop().then(v => {
          if (v != null) {
            this.loading.dismiss('load')
          }
        })
      }
      else if (data.requestStatus) {
        if (data.requestStatus == 'pending') {

          this.currentDiv = 'two'
          console.log('request sent and is pending');
          this.loading.getTop().then(v => {
            if (v != null) {
              this.loading.dismiss('load')
            }
          })

        }
        else if (data.requestStatus == 'recieved') {
          this.currentDiv = 'three'
          this.loading.getTop().then(v => {
            if (v != null) {
              this.loading.dismiss('load')
            }
          })

        }
        else if (data.requestStatus == 'approved') {
          this.loading.getTop().then(v => {
            if (v != null) {
              this.loading.dismiss('load')
            }
          })
          this.router.navigate(['pos'])
        }
      }
      else {

        console.log('na request sent na recienved');
        this.currentDiv = 'one'
        this.loading.getTop().then(v => {
          if (v != null) {
            this.loading.dismiss('load')
          }
        })
      }
    })
  }
  code: number;


  withdrawRequest() {
    const requestStatus = ''
    this.firestore.collection('Helper').doc(this.userID).update({
      requestStatus,
    }).then(() => {
      this.msg = 'request removed'
      this.presentToast()
    })
  }

  acceptReq() {
    console.log(this.user);
    const uid = this.auth.auth.currentUser.uid
    this.firestore.collection('Helper').doc(uid).get().subscribe((u: any) => {
      console.log(u);
      if (u.exists) {
        this.user = JSON.parse(window.localStorage.getItem('user'));
        this.user.docID = u.Df.sn.proto.mapValue.fields.docID.stringValue

        window.localStorage.setItem('user', JSON.stringify(this.user));
        this.user = JSON.parse(window.localStorage.getItem('user'));
        console.log(this.user);

        // 
      }
    })
    // const requestStatus = 'approved'
    // this.firestore.collection('helpers').doc(this.userID).update({
    //   requestStatus,
    // }).then(() => {

    //   this.msg = 'request accepted'
    //   this.presentToast()
    //   this.router.navigate(['pos'])
    // })
  }

  phone: number;

  sendRequest() {

    if (!this.phone || !this.code) {

      this.msg = 'Phone number is blank'
      this.presentToast()
    }
    else {
      const ownerPhone = '+' + this.code + this.phone;
      const requestStatus = 'pending'
      this.firestore.collection('Helper').doc(this.userID).update({
        ownerPhone,
        requestStatus,
      }).then(() => {

        this.msg = 'requesting owner.'
        this.presentToast()
        this.getOwnerPlayerID()
      }).catch(err => {

        this.msg = JSON.stringify(err.message)
        this.presentToast()
      })

    }
  }

  ownerPlayerID: string;


  getOwnerPlayerID() {
    const ownerPhone = '+' + this.code + this.phone;
    console.log(ownerPhone);

    this.firestore.collection('Owner', q => q.where('phone', '==', ownerPhone)).valueChanges().subscribe((Res: any) => {
      if (Res.length < 1) {

        this.msg = 'No owner of shop found on this number'
        this.presentToast()
      }
      else {
        console.log('Owner details', Res[0].playerId);
        this.ownerPlayerID = Res[0].playerId
        const message = this.user.name + " has requested to join you as a helper"
        this.sendNotification(message, this.ownerPlayerID)
      }
    })
  }

  sendNotification(content, playerID) {

    var header = new HttpHeaders();
    header.append("Content-Type", "application/json");


    return this.http
      .post(
        "https://exportportal.site/ssmpushes.php",
        {
          message: content,
          playerID: playerID,
        },
        { headers: header, responseType: "text" }
      )
      .subscribe(
        (resp) => {
          console.log(resp);
          this.checkRequestsSent(this.userID)
        },
        (error) => { }
      );

  }


  getuserdata(uid) {

  
    this.firestore.collection('Helper').doc(uid).valueChanges().subscribe((res: any) => {
   

      if (res == undefined) {
        alert('null')
      }
      else if (res.docID) {
        this.user.docID = res.docID
        window.localStorage.setItem('user', JSON.stringify(this.user));
        alert('user' + this.user);

      }
    })
  }



  ngOnInit() {

    this.loaderID = 'load'
    this.loadermsg = 'HOLD ON A MOMENT..'
    this.presentLoading()

    this.user = JSON.parse(window.localStorage.getItem('user'));
    console.log(this.user);


    const sb = this.auth.authState.subscribe(u => {
      this.userID = u.uid
      console.log(this.userID);
      this.getuserdata(u.uid)
      this.firestore.collection('Helper').doc(this.userID).valueChanges().subscribe((res: any) => {


        if (res == undefined) {

          const userID = this.userID
          const timestamp = new Date()
          const userDetails = this.user
          const name = this.user.name
          const phone = this.user.phone
          this.firestore.collection('Helper').doc(this.userID).set({
            timestamp,
            userID,
            userDetails,
            name, phone,
          }).then(() => {

            this.loading.dismiss('load')

          })

        }
        else {

          if (!res.userDetails) {
            const userDetails = this.user
            this.firestore.collection('Helper').doc(this.userID).update({
              userDetails,

            })

          }
          this.checkRequestsSent(this.userID)

        }
      })

    })
  }

}
