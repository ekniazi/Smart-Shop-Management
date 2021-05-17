import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


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
  ) { }

  userTyp: string[] = ["Trial", "Paid"]
  newShop: boolean = true;
  selectedPlan: string = "Trial";
  name: string;
  address: string;
  referal: string = "";
  user: any;

  ngOnInit() {
    this.user = JSON.parse(window.localStorage.getItem('user'));
    const sub = this.firestore
      .collection("stores", (q) => q.where("owner", "==", this.user.phone))
      .valueChanges()
      .subscribe((r: any) => {
        alert(JSON.stringify(r));
        alert(this.user.phone);
        if (r.length >= 1) {
          window.localStorage.setItem('storeInfo', JSON.stringify(r[0]));
          this.user.docID = r[0].docID;
          window.localStorage.setItem('user', JSON.stringify(this.user));
          this.router.navigate(['home/dashboard']);
          sub.unsubscribe();
        }
      })
  }

  startTrial() {
    var myCurrentDate = new Date();
    var expiry = new Date(myCurrentDate);
    expiry.setDate(expiry.getDate() + 15);
    var owner = this.auth.auth.currentUser.phoneNumber;
    if (this.name.length > 2 && this.address.length > 7 && this.selectedPlan.length > 1) {
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
        this.firestore.collection('stores').doc(data2.id).update({ docID });
        window.localStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigate(['home/dashboard']);
      }).catch(err => alert(err.message))
    } else {
      alert("Please fill in the fields correctly!");
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
