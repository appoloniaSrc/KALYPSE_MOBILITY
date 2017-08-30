import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';

import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { LanguageService } from './../../../../providers/language/language.service';
import { PasswordValidator } from './../../../../providers/utils/validator.service';
import { Utils } from './../../../../providers/utils/utils.service';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "ChangePasswordPage";

  authForm: FormGroup;
  clientID: string;
  clientEmail: string;

  errorText = "";

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    , public navParams: NavParams
    , private formBuilder: FormBuilder
    , private pref: Storage

    , private auth: AuthentificationWebService
    , private logger: LoggerService
    , private langService: LanguageService
    , private utils: Utils
  ) {

    this.authForm = formBuilder.group({
        'oldPassword' : ['', Validators.compose([Validators.pattern(PasswordValidator.passwordPattern), Validators.required])]
        , 'password' : ['', Validators.compose([Validators.pattern(PasswordValidator.passwordPattern), Validators.required])]
        , 'confirmPassword' : ['', Validators.compose([Validators.pattern(PasswordValidator.passwordPattern), Validators.required])]
    });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {

    setTimeout(
      this.pref.get('IDENTIFIANT')
        .then((value) => {
          this.clientEmail = value;
        }).catch(err => {
          this.logger.error_log(this.TAG, "ionViewDidLoad()", "Get Email error = " + err);
        })
    , this.logger.EVENT_WRITE_FILE);

    setTimeout(
      this.pref.get("CLIENT_ID")
        .then(value => {
          this.clientID = value;
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "ionViewDidLoad()", "Get Client ID error = " +err);
        })
    , this.logger.EVENT_WRITE_FILE);
    
  }

  async resetPassword() {
    await this.logger.info_log(this.TAG, "resetPassword()", "Start Method");

    if(this.authForm.controls['password'].value == this.authForm.controls['confirmPassword'].value) {
      if(this.authForm.controls['password'].value != this.authForm.controls['oldPassword'].value) {
        var hashedPswd = Md5.hashStr(this.authForm.controls['password'].value).toString();
      } else {
        this.errorText = "Enter a password other than the old password";
        return;
      }
      
    } else {
      this.errorText = "Please enter the same password at confirmation";
      return;
    }

    // Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.auth.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

    if(isOK) {

      var isCustomerFind = false;

      // Start Check customer processus for check old password
      let hashedOldPswd = Md5.hashStr(this.authForm.controls['oldPassword'].value).toString();

      await this.auth.checkCustomerWithCredentials(hashedKey, this.clientEmail, hashedOldPswd)
        .then(() => {
          this.logger.log_log(this.TAG, "resetPassword()", "Customer Find");
          isCustomerFind = true;
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "resetPassword()", err);
          this.errorText = "Customer not found. Please check your wifi connection or restart app.";
        });
        await this.utils.delay(this.logger.EVENT_WRITE_FILE);

      // Start Change password processus

      if(isCustomerFind) {

        await this.auth.changePassword(hashedKey, this.clientID, hashedPswd)
          .then(() => {
            this.nav.remove(this.nav.getActive().index);
          })
          .catch(err => {
            this.logger.error_log(this.TAG, "resetPassword()", err);
            this.errorText = err;
          });
          await this.utils.delay(this.logger.EVENT_WRITE_FILE);
      }
    } else {
			this.errorText = this.langService.get("ACCESS_WEBSERVICE_ERROR_MESSAGE");
		}

    await this.logger.info_log(this.TAG, "resetPassword()", "End Method");
  }

}
