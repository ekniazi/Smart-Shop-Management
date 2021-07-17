import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-ownerpage',
  templateUrl: './ownerpage.page.html',
  styleUrls: ['./ownerpage.page.scss'],
})
export class OwnerpagePage implements OnInit {

  constructor(
    private iap: InAppPurchase,
    public firestore: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth,
    private platform: Platform,
    private createtoast: ToastController,
  ) { }

  userTyp: string[] = ["Trial", "Paid"]
  newShop: boolean = true;
  selectedPlan: string = "Trial";
  name: string;
  address: string;
  referal: string = "";
  user: any;
  msg: string;
  //toasts
  async toastCreater() {
    const toast = await this.createtoast.create({
      color: 'dark',
      duration: 2000,
      message: this.msg,
      animated: true,
      mode: 'ios',
    });
    await toast.present();
  }

  backDisbale = this.platform.backButton.subscribeWithPriority(999, () => {

    this.msg = 'press again to exit app'
    this.toastCreater()

    this.platform.backButton.subscribeWithPriority(999, () => {
      navigator['app'].exitApp();
    })

  });

  ngOnInit() {
    this.user = JSON.parse(window.localStorage.getItem('user'));
    const num = '+' + this.user.phone;
    const sub = this.firestore
      .collection("stores", (q) => q.where("owner", "==", num))
      .valueChanges()
      .subscribe((r: any) => {
        console.log(r);
        if (r.length >= 1) {
          window.localStorage.setItem('storeInfo', JSON.stringify(r[0]));
          this.user.docID = r[0].docID;
          window.localStorage.setItem('user', JSON.stringify(this.user));
          this.router.navigate(['home/dashboard']);
          sub.unsubscribe();
        }
      })
  }
  docID: string;

  startTrial() {

    if (!this.name) {
      this.msg = 'Name cannot be empty'
      this.toastCreater()
    }
    else if (!this.address) {
      this.msg = 'adress cannot be empty'
      this.toastCreater()
    }

    else if (!this.selectedPlan) {
      this.msg = 'selected plan cannot be empty'
      this.toastCreater()
    }

    else {
      var myCurrentDate = new Date();
      var expiry = new Date(myCurrentDate);
      expiry.setDate(expiry.getDate() + 15);
      var owner = this.auth.auth.currentUser.phoneNumber;
      if (this.name.length > 2 && this.selectedPlan.length > 1) {
        const data = {
          name: this.name,
          address: this.address,
          referal: this.referal,
          selectedPlan: this.selectedPlan,
          expiry: expiry,
          creationTime: new Date(),
          owner,
        }
        this.firestore.collection('stores').add(data).then((data2) => {
          window.localStorage.setItem('storeInfo', JSON.stringify(data));
          this.user.docID = data2.id;
          const docID = data2.id;
          this.docID = docID;
          this.firestore.collection('stores').doc(data2.id).update({ docID });
          window.localStorage.setItem('user', JSON.stringify(this.user));
          this.router.navigate(['home/dashboard']);
        }).catch(err => alert(err.message))

        const auth = this.auth.authState.subscribe(user => {
          var myCurrentDate = new Date();
          var expiry = new Date(myCurrentDate);
          const docID = this.docID
          const selectedPlan = this.selectedPlan
          const referal = this.referal
          var owner = this.auth.auth.currentUser.phoneNumber;
          this.firestore.collection('Owner').doc(user.uid).update({
            docID,
            expiry,
            selectedPlan,
            referal,
            owner,
          }).then(() => {
            this.msg = 'shop created successfully on 15 days trial'
            this.toastCreater()
          }).catch((er) => {
            this.msg = JSON.stringify(er.message)
            this.toastCreater()
          })
        })

      } else {
        this.msg = 'Name must minimum have 4 letters--Please choose only one plan'
        this.toastCreater()
      }
    }

  }

  paymentProceed() {
    this.iap
      .getProducts(['prod1', 'prod2'])
      .then((products) => {
        console.log(products);
        //  [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
      })
      .catch((err) => {
        alert(err.message);
      });


    this.iap
      .buy('prod1')
      .then((data) => {
        console.log(data);
        // {
        //   transactionId: ...
        //   receipt: ...
        //   signature: ...
        // }
      })
      .catch((err) => {
        alert(err.message);
      });
  }

}
