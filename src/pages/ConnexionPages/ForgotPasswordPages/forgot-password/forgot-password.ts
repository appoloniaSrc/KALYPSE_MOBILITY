import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationWebService } from './../../../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { NumberValidator } from './../../../../providers/utils/validator.service';

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

  authForm: FormGroup;

  errorText = "";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private nav: NavController
    , private alertCtrl: AlertController
    , private loadingCtrl: LoadingController
    , private formBuilder: FormBuilder

    , private auth: AuthenticationWebService
    , private logger: LoggerService
  ) {

    this.authForm = formBuilder.group({
        'clientCard' : ['', Validators.compose([NumberValidator.isValid, Validators.required])]
        , 'birthday' : ['', Validators.compose([Validators.required])]
    });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
  }

  public forgotPasswordStep2() {

    this.logger.warn_log(this.TAG, "forgotPasswordStep2()", "method start");

    // Start Login processus

    this.auth.checkUserCardNumIDAndBirth(this.authForm.controls['clientCard'].value, this.authForm.controls['birthday'].value)
      .then(result => {
        this.nav.push('ForgotPassword_2Page', {"clientID" : result.clientID});
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "forgotPasswordStep2()", err);

        this.errorText = err;
      });

    this.logger.warn_log(this.TAG, "forgotPasswordStep2()", "method end");
  }

}
