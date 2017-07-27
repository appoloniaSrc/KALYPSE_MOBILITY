import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';

import { AuthenticationWebService } from './../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Keyboard]
})
export class LoginPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "LoginPage";

  loading: Loading;

  registerCredentials = { identifiant: '', password: '' };
  inputText: any;
  errorText = "";

  rememberMe: boolean;

  //=================================
	// CONSTRUCTOR
	//=================================
 
  constructor(
    private platform: Platform
    , private nav: NavController
    , private alertCtrl: AlertController
    , private loadingCtrl: LoadingController
    , private keyboard: Keyboard
    , private pref: Storage

    , private auth: AuthenticationWebService
    , private logger: LoggerService
  ) {

    this.pref.get('IDENTIFIANT')
      .then((value) => {
        this.registerCredentials.identifiant = value;
        this.rememberMe = true;
      });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
 
  public login() {

    this.logger.warn_log(this.TAG, "login()", "method start");

    // Save the identifiant if the user checked the checkbox

    if(this.rememberMe)
    {
      this.pref.set('IDENTIFIANT', this.registerCredentials.identifiant);
    } else {
      this.pref.remove('IDENTIFIANT');
    }

    // Start Login processus

    let hashedPswd = Md5.hashStr(this.registerCredentials.password).toString();

    this.auth.login(this.registerCredentials.identifiant.toLowerCase(), hashedPswd)
      .then(() => {
        this.nav.setRoot('HomePage');
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "login()", err);

        this.errorText = err;
        if(!this.rememberMe)
          this.registerCredentials.identifiant = "";
        this.registerCredentials.password = "";
      });

    this.logger.warn_log(this.TAG, "login()", "method end");
  }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public goRecoverPassword() {
    this.nav.push('ForgotPasswordPage');
  }
  
}