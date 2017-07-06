import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from './../home/home';

import { JackpotsTopdayPage } from './../jackpots-topday/jackpots-topday';
import { JackpotsTopmonthPage } from './../jackpots-topmonth/jackpots-topmonth';
import { JackpotsMachinePage } from './../jackpots-machine/jackpots-machine';

@Component({
  selector: 'page-jackpots-tabs',
  templateUrl: 'jackpots-tabs.html',
})
export class JackpotsTabsPage {

  //=================================
	// ATTRIBUTES
	//=================================

  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = JackpotsTopdayPage;
  tab2Root: any = JackpotsTopmonthPage;
  tab3Root: any = JackpotsMachinePage;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController,
  ) {
    
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad JackpotsTabsPage');
  }

}
