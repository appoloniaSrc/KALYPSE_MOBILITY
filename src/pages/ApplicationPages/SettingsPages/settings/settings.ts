import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { HelpPage } from './../help/help';
import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { LanguageService } from './../../../../providers/language/language.service';
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

  selectLanguageValue: any;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    , public navParams: NavParams
    , public pref: Storage

    , private logger: LoggerService
    , private auth: AuthentificationWebService
    , private languageService: LanguageService
    , private utils: Utils
  ) {
    
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    setTimeout(
      this.pref.get("LANGUAGE")
        .then(value => { 
          if(value != null)
            this.selectLanguageValue = value
          else
            this.selectLanguageValue = this.languageService.get_language_code_preferred();          
        })
    , this.logger.EVENT_WRITE_FILE);
  }

  public onSelectLanguageChanged(){
    this.languageService.set_language(this.selectLanguageValue);
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