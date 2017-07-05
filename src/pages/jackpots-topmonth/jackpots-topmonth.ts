import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from './../home/home';

@IonicPage()
@Component({
  selector: 'page-jackpots-topmonth',
  templateUrl: 'jackpots-topmonth.html',
})
export class JackpotsTopmonthPage {

  constructor(public nav: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JackpotsTopmonthPage');
  }

  private backHome(){
    this.nav.setRoot(HomePage);
  }


}
