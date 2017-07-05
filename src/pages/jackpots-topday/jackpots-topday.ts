import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from './../home/home';

@IonicPage()
@Component({
  selector: 'page-jackpots-topday',
  templateUrl: 'jackpots-topday.html',
})
export class JackpotsTopdayPage {

  constructor(public nav: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JackpotsTopdayPage');
  }

  private backHome(){
    this.nav.setRoot(HomePage);
  }

}
