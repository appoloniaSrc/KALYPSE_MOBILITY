import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  }

}
