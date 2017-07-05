import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bar',
  templateUrl: 'bar.html',
})
export class BarPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "BarPage";

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
    console.log('ionViewDidLoad BarPage');
  }

}
