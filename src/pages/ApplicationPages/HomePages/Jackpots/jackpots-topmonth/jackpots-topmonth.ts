import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-jackpots-topmonth',
  templateUrl: 'jackpots-topmonth.html',
})
export class JackpotsTopmonthPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "JackpotsTopmonthPage";

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
  }

}
