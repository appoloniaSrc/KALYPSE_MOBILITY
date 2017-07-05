import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HelpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
    ,public navParams: NavParams
  ) {

  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

}
