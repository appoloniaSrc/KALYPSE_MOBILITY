import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';

import {Md5} from 'ts-md5/dist/md5';

import { AuthenticationWebService } from './../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';

@IonicPage()
@Component({
  selector: 'page-forgot-password-2',
  templateUrl: 'forgot-password-2.html',
})
export class ForgotPassword_2Page {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "ForgotPassword_2Page";

  dataCredentials = { pswd: '', 	pswdConfirm: '' };
  errorText = "";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private platform: Platform
    ,private nav: NavController
    ,private navParams: NavParams
    ,private alertCtrl: AlertController
    ,private loadingCtrl: LoadingController
    ,private keyboard: Keyboard

    , private auth: AuthenticationWebService
    , private logger: LoggerService
  ) {

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
  }

  public forgotPasswordFinished() {

    this.logger.warn_log(this.TAG, "forgotPasswordFinished()", "method start");

    // Start Change Password processus

    if(this.dataCredentials.pswd == this.dataCredentials.pswdConfirm) {
      var hashedPswd = Md5.hashStr(this.dataCredentials.pswd).toString();
    } else {
      this.errorText = "Please enter the same password";
      this.dataCredentials.pswd = "";
      this.dataCredentials.pswdConfirm = "";

      return;
    }

    this.auth.changePassword(hashedPswd)
      .then(() => {
        this.nav.setRoot("LoginPage");
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "forgotPasswordFinished()", err);

        this.errorText = err;
        this.dataCredentials.pswd = "";
        this.dataCredentials.pswdConfirm = "";
      });

    this.logger.warn_log(this.TAG, "forgotPasswordFinished()", "method end");
  }

}
