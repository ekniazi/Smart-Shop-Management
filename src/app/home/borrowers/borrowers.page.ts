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
  ) { }

  lenders: any[];

  getBorrowers() {
    if (window.localStorage.getItem('lenders')) {
      this.lenders = JSON.parse(window.localStorage.getItem('lenders'));
    } else {
    }
  }

  whatsappMsg(lender) {

    if (lender.cNum[0] == '0') {
      lender.cNum = "92" + lender.cNum;
    }
    this.socialSharing.shareViaWhatsAppToPhone(lender.cNum, "You have a pending payment of " + (lender.total - lender.paid).toString(), "")
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBorrowers();
  }

}
