import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-helperpage',
  templateUrl: './helperpage.page.html',
  styleUrls: ['./helperpage.page.scss'],
})
export class HelperpagePage implements OnInit {

  constructor() { }

  requested: boolean = false;

  toggle() {
    this.requested = !this.requested;
  }

  ngOnInit() {
  }

}
