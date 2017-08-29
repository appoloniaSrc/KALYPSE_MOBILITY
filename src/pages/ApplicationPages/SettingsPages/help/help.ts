import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "HelpPage";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
  ) {

  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
  }

}
