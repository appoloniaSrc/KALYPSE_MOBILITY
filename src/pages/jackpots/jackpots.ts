import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the JackpotsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-jackpots',
  templateUrl: 'jackpots.html',
})
export class JackpotsPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "JackpotsPage";

  tabs: Array<{title: string, icon: any}>;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public navCtrl: NavController
    ,public navParams: NavParams
  ) {

    // Array of pages
    this.tabs = [
      { title: 'Top 10 of the day', icon: "home" }
      ,{ title: 'Top 10 of the month', icon: "home" }
      ,{ title: 'Of the machine', icon: "home" }
    ];

  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad JackpotsPage');
  }

}
