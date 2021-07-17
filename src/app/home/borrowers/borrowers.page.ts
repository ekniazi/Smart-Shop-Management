import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-borrowers',
  templateUrl: './borrowers.page.html',
  styleUrls: ['./borrowers.page.scss'],
})
export class BorrowersPage implements OnInit {

  constructor(
    private socialSharing: SocialSharing,
    private firebaseauth: AngularFireAuth
  ) { }

  lenders: any[];

  getBorrowers() {
    if (window.localStorage.getItem('lenders')) {
      this.lenders = JSON.parse(window.localStorage.getItem('lenders'));
    } else {
    }
  }

  whatsappMsg(lender) {
    const auth = this.firebaseauth.auth.currentUser.phoneNumber
    if (lender.cNum[0] == '0') {
      lender.cNum = "91" + lender.cNum;
    }
    this.socialSharing.shareViaWhatsAppToPhone(lender.cNum, "You have a pending payment of you can pay this amount through google pay on this number" + auth + (lender.total - lender.paid).toString(), "")
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBorrowers();
  }

}
