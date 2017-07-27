import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Keyboard, Platform } from 'ionic-angular';

import { AuthenticationWebService } from './../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  //=================================
	// ATTRIBUTES
	//=================================

  createSuccess = false;
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



  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register_Page');
  }


  public createAccountStep2() {
    this.nav.push('Register_2Page');
  }

}
