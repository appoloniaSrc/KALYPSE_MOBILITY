import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Md5} from 'ts-md5/dist/md5';

import { AuthenticationWebService } from './../../../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { PasswordValidator } from './../../../../providers/utils/validator.service';

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

  authForm: FormGroup;
  clientID: string;

  errorText = "";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private nav: NavController
    , private navParams: NavParams
    , private formBuilder: FormBuilder
    , private alertCtrl: AlertController
    , private loadingCtrl: LoadingController

    , private auth: AuthenticationWebService
    , private logger: LoggerService
  ) {

    this.authForm = formBuilder.group({
        'password' : ['', Validators.compose([Validators.pattern(PasswordValidator.passwordPattern), Validators.required])]
        , 'confirmPassword' : ['', Validators.compose([Validators.pattern(PasswordValidator.passwordPattern), Validators.required])]
    });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
   this.clientID = this.navParams.get("clientID");
  }

  public forgotPasswordFinished() {

    this.logger.warn_log(this.TAG, "forgotPasswordFinished()", "method start");

    // Start Change Password processus

    if(this.authForm.controls['password'].value == this.authForm.controls['confirmPassword'].value) {
      var hashedPswd = Md5.hashStr(this.authForm.controls['password'].value).toString();
    } else {
      this.errorText = "Please enter the same password";

      return;
    }

    this.auth.changePassword(this.clientID, hashedPswd)
      .then(() => {
        this.nav.setRoot("LoginPage");
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "forgotPasswordFinished()", err);

        this.errorText = err;
      });

    this.logger.warn_log(this.TAG, "forgotPasswordFinished()", "method end");
  }

}
