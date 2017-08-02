import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';

import { AuthenticationWebService } from './../../../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { PasswordValidator } from './../../../../providers/utils/validator.service';

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

    , private auth: AuthenticationWebService
    , private logger: LoggerService
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

    this.pref.get('CLIENT_EMAIL')
      .then((value) => {
        this.clientEmail = value;
      }).catch(err => {
        this.logger.error_log(this.TAG, "ionViewDidLoad()", "Get Email error = " + err);
      });

    this.pref.get("CLIENT_ID")
      .then(value => {
         this.clientID = value;
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "ionViewDidLoad()", "Get Client ID error = " +err);
      });
    
  }

  async resetPassword() {
    this.logger.warn_log(this.TAG, "resetPassword()", "method start");

    var isCustomerFind = false;

    // Start Check customer processus for check old password
    let hashedOldPswd = Md5.hashStr(this.authForm.controls['oldPassword'].value).toString();

    await this.auth.checkCustomerWithCredentials(this.clientEmail, hashedOldPswd)
      .then(() => {
         this.logger.log_log(this.TAG, "resetPassword()", "Customer Find");
         isCustomerFind = true;
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "resetPassword()", err);
        this.errorText = err;
      });

    // Start Change password processus

    if(isCustomerFind) {
      if(this.authForm.controls['password'].value == this.authForm.controls['confirmPassword'].value) {
        if(this.authForm.controls['password'].value != this.authForm.controls['oldPassword'].value) {
          var hashedPswd = Md5.hashStr(this.authForm.controls['password'].value).toString();
        } else {
          this.errorText = "Enter a password other than the old password";
          return;
        }
        
      } else {
        this.errorText = "Please enter the same password";
        return;
      }

      await this.auth.changePassword(this.clientID, hashedPswd)
        .then(() => {
          this.nav.remove(this.nav.getActive().index);
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "resetPassword()", err);

          this.errorText = err;
        });
    }

    this.logger.warn_log(this.TAG, "resetPassword()", "method end");
    return;
  }

}
