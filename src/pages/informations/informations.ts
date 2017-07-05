import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InformationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-informations',
  templateUrl: 'informations.html',
})
export class InformationsPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "InformationsPage";

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
    console.log('ionViewDidLoad InformationsPage');
  }

}
