import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-jackpots-topday',
  templateUrl: 'jackpots-topday.html',
})
export class JackpotsTopdayPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "JackpotsTopdayPage";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    ,public navParams: NavParams
  ) {

    

  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad JackpotsTopdayPage');
  }

}
