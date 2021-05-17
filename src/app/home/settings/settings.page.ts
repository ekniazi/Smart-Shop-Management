import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private firebaseauth: AngularFireAuth,
    ) { }

    logout(){
      this.firebaseauth.auth.signOut();
    }
  ngOnInit() {

  }

}
