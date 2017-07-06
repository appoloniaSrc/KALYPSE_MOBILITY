import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-jackpots-machine',
  templateUrl: 'jackpots-machine.html',
})
export class JackpotsMachinePage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "JackpotsMachinePage";

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
    console.log('ionViewDidLoad JackpotsMachinePage');
  }

}
