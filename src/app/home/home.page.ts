import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    private platform: Platform,
  ) { }

  backDisbale = this.platform.backButton.subscribeWithPriority(999, () => {


    navigator['app'].exitApp();

  });

  gotoPage(pagename: string) {
    this.router.navigate([pagename])
  }
}
