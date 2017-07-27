import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelpPage } from './../help/help';
import { AuthenticationWebService } from '../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';

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
    , private auth: AuthenticationWebService
    , public navParams: NavParams

    , private logger: LoggerService
  ) {
    
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  // Deconnexion
  public logout() {

    this.logger.warn_log(this.TAG, "logout()", "method start");

    this.auth.logout()
      .then(() => {
        this.nav.setRoot('LoginPage')
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "logout()", err);
      });

      this.logger.warn_log(this.TAG, "logout()", "method start");
  }

  goHelpPage(){
    this.nav.push(HelpPage);
  }

}