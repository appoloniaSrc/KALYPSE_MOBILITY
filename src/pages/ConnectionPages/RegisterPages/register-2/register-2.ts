import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Keyboard, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';

import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { Utils } from './../../../../providers/utils/utils.service';
import { EmailValidator, PasswordValidator } from './../../../../providers/utils/validator.service';


@IonicPage()
@Component({
  selector: 'page-register-2',
  templateUrl: 'register-2.html',
})
export class Register_2Page {

  //=================================
	// ATTRIBUTES
  //=================================
  
  TAG = "Register_2Page";

  siteID: string;
  clientID: string;

  authForm: FormGroup;

  errorText = "";

  createSuccess = false;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private platform: Platform
    , private nav: NavController
    , private navParams: NavParams
    , private auth: AuthentificationWebService
    , private formBuilder: FormBuilder
    , private alertCtrl: AlertController
    , public keyboard: Keyboard
    , private pref: Storage

    , private logger: LoggerService
    , private utils: Utils
  ) {

    this.authForm = formBuilder.group({
        'email' : ['', Validators.compose([Validators.pattern(EmailValidator.emailPattern), Validators.required])]
        , 'password' : ['', Validators.compose([Validators.pattern(PasswordValidator.passwordPattern), Validators.required])]
        , 'confirmPassword' : ['', Validators.compose([Validators.pattern(PasswordValidator.passwordPattern), Validators.required])]
    });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    this.clientID = this.navParams.get("clientID");

    this.pref.get("SITE_ID")
      .then(value => {
        this.siteID = value;
      });
  }

  async finishInscription() {
    await this.logger.info_log(this.TAG, "finishInscription()", "Start Method");

    // Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.auth.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

    if(isOK) {
      // Start update email processus

      var isOKChangePass = false;

      await this.auth.changeEmail(hashedKey, this.authForm.controls['email'].value, this.siteID, this.clientID)
        .then(result => {
            isOKChangePass = true;
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "finishInscription()", err);
          this.errorText = err;
        });
      await this.utils.delay(this.logger.EVENT_WRITE_FILE);

      if(isOKChangePass){

        if(this.authForm.controls['password'].value == this.authForm.controls['confirmPassword'].value) {
          var hashedPswd = Md5.hashStr(this.authForm.controls['password'].value).toString();
        } else {
          this.errorText = "Please enter the same password";
          return;
        }

        var isOKActive: boolean;

        await this.auth.changePassword(hashedKey, this.clientID, hashedPswd)
          .then(result => {
            isOKActive = result;
          })
          .catch(err => {
            this.logger.error_log(this.TAG, "finishInscription()", err);
            this.errorText = err;
          });
        await this.utils.delay(this.logger.EVENT_WRITE_FILE);

        if(isOKActive) {
          await this.auth.activeCustomerAccount(hashedKey, this.clientID)
            .then(result => {
              this.logger.info_log(this.TAG, "finishInscription()", "End Method");
              this.nav.setRoot("LoginPage");
            })
            .catch(err => {
              this.logger.error_log(this.TAG, "finishInscription()", err);
              this.errorText = err;
            });
          await this.utils.delay(this.logger.EVENT_WRITE_FILE);
        }
      } 
    } else {
			this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE");
		}

    await this.logger.info_log(this.TAG, "finishInscription()", "End Method");
  }

}
