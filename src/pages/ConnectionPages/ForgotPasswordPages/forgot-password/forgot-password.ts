import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { Utils } from './../../../../providers/utils/utils.service';
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

    , private auth: AuthentificationWebService
    , private logger: LoggerService
    ,private utils: Utils
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

  async forgotPasswordStep2() {

    await this.logger.info_log(this.TAG, "forgotPasswordStep2()", "Start Method");

    // Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.auth.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

    if(isOK) {
      await this.auth.checkUserCardNumIDAndBirth(hashedKey, this.authForm.controls['clientCard'].value, this.authForm.controls['birthday'].value)
        .then(result => {
          this.nav.push('ForgotPassword_2Page', {"clientID" : result.clientID});
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "forgotPasswordStep2()", err);
          this.errorText = err;
        });
      await this.utils.delay(this.logger.EVENT_WRITE_FILE);
    } else {
			this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE");
		}

    await this.logger.info_log(this.TAG, "forgotPasswordStep2()", "End Method");
  }

}
