import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

import { HelpPage } from './../help/help';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "SettingsPage";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    ,private auth: AuthenticationProvider
    ,public navParams: NavParams
  ) {
    
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage')
    });
  }

  goHelpPage(){
    this.nav.push(HelpPage);
  }

}