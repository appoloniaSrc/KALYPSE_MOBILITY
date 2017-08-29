import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelpPage } from './../help/help';
import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { Utils } from './../../../../providers/utils/utils.service';


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
    , private auth: AuthentificationWebService
    , public navParams: NavParams

    , private logger: LoggerService
    , private utils: Utils
  ) {
    
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  // Deconnexion
  public async logout() {

    await this.logger.info_log(this.TAG, "logout()", "Start Method");

    this.auth.logout()
      .then(() => {
        this.nav.setRoot('LoginPage')
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "logout()", err);
      });
    await this.utils.delay(this.logger.EVENT_WRITE_FILE);

    await this.logger.info_log(this.TAG, "logout()", "End Method");
  }

  goHelpPage(){
    this.nav.push(HelpPage);
  }

}