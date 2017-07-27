import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Keyboard, Platform } from 'ionic-angular';

import { AuthenticationWebService } from './../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';

/**
 * Generated class for the Register_2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register-2',
  templateUrl: 'register-2.html',
})
export class Register_2Page {

  //=================================
	// ATTRIBUTES
	//=================================

  createSuccess = false;
  birthday: String;
  registerCredentials = { email: '',  confirmEmail: '', password: '', confirmPassword: '' };

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private platform: Platform
    , private nav: NavController
    , private auth: AuthenticationWebService
    , private alertCtrl: AlertController
    , public keyboard: Keyboard

    , private logger: LoggerService
  ) {

    this.birthday = "01/01/1996";

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register_2Page');
  }

  public finishInscription() {
    this.nav.setRoot('LoginPage');
  }
 
  public register() {
    /*this.auth.register(this.registerCredentials).subscribe(success => {
      if (success) {
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
      error => {
        this.showPopup("Error", error);
      });*/
  }

}
