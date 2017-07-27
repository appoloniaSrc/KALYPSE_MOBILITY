import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';

import { AuthenticationWebService } from './../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "ForgotPasswordPage";

  dataCredentials = { userCardNumID: '', 	userBirthhday: '' };
  errorText = "";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private platform: Platform
    ,private nav: NavController
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

  public forgotPasswordStep2() {

    this.logger.warn_log(this.TAG, "forgotPasswordStep2()", "method start");

    // Start Login processus

    this.auth.checkUserCardNumIDAndBirth(this.dataCredentials.userCardNumID, this.dataCredentials.userBirthhday)
      .then(() => {
        this.nav.push('ForgotPassword_2Page');
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "forgotPasswordStep2()", err);

        this.errorText = err;
        this.dataCredentials.userCardNumID = "";
        this.dataCredentials.userBirthhday = "";
      });

    this.logger.warn_log(this.TAG, "forgotPasswordStep2()", "method end");
  }

}
