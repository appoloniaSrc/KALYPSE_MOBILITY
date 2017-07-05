import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from './../home/home';

@IonicPage()
@Component({
  selector: 'page-jackpots-machine',
  templateUrl: 'jackpots-machine.html',
})
export class JackpotsMachinePage {

  constructor(public nav: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JackpotsMachinePage');
  }

  private backHome(){
    this.nav.setRoot(HomePage);
  }


}
