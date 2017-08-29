import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Md5} from 'ts-md5/dist/md5';

import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { Utils } from './../../../../providers/utils/utils.service';
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

    , private auth: AuthentificationWebService
    , private logger: LoggerService
    , private utils: Utils
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

  async forgotPasswordFinished() {

    await this.logger.info_log(this.TAG, "forgotPasswordFinished()", "Start Method");

    // Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.auth.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

    if(isOK) {
      // Start Change Password processus

      if(this.authForm.controls['password'].value == this.authForm.controls['confirmPassword'].value) {
        var hashedPswd = Md5.hashStr(this.authForm.controls['password'].value).toString();
      } else {
        this.errorText = "Please enter the same password";
        return;
      }

      await this.auth.changePassword(hashedKey, this.clientID, hashedPswd)
        .then(() => {
          this.nav.setRoot("LoginPage");
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "forgotPasswordFinished()", err);
          this.errorText = err;
        });
      await this.utils.delay(this.logger.EVENT_WRITE_FILE);
    } else {
			this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE");
		}

    await this.logger.info_log(this.TAG, "forgotPasswordFinished()", "End Method");
  }

}
