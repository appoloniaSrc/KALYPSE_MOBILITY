import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';

import { AuthenticationWebService } from './../../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../../providers/logger/logger.service';
import { EmailValidator } from './../../../providers/utils/validator.service';
 
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

  authForm: FormGroup;

  errorText = "";

  //=================================
	// CONSTRUCTOR
	//=================================
 
  constructor(
    private platform: Platform
    , private nav: NavController
    , private alertCtrl: AlertController
    , private loadingCtrl: LoadingController
    , private formBuilder: FormBuilder
    , private keyboard: Keyboard
    , private pref: Storage

    , private auth: AuthenticationWebService
    , private logger: LoggerService
  ) {

    this.authForm = formBuilder.group({
        'email' : ['', Validators.compose([Validators.pattern(EmailValidator.emailPattern), Validators.required])]
        , 'password' : ['', Validators.compose([Validators.minLength(4),Validators.maxLength(8), Validators.required])]
        , 'rememberMe' : [false]
    });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    this.pref.get('IDENTIFIANT')
      .then((value) => {
        this.authForm.controls['email'].setValue(value);
        if(value != null)
          this.authForm.controls['rememberMe'].setValue(true);
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "ionViewDidLoad()", '"IDENTIFIANT" value in pref =' + err);
      });
  }
 
  login() {

    this.logger.warn_log(this.TAG, "login()", "method start");

    // Test if credential is valid

    // Save the identifiant if the user checked the checkbox

    if(this.authForm.controls['rememberMe'].value)
    {
      this.pref.set('IDENTIFIANT', this.authForm.controls['email'].value);
    } else {
      this.pref.remove('IDENTIFIANT');
    }

    // Start Login processus

    let hashedPswd = Md5.hashStr(this.authForm.controls['password'].value).toString();

    this.auth.checkCustomerWithCredentials(this.authForm.controls['email'].value.toLowerCase(), hashedPswd)
      .then(result => {

        // Save informations client into preferences
        this.pref.set("CLIENT_ID",    result[0]["a:ClientId"]);
        this.pref.set("CLIENT_EMAIL", result[0]["a:Email"]);
        this.pref.set("LANGUAGE",     result[0]["a:Language"]);
        this.pref.set("CURRENCY",     result[0]["a:Currency"]);

        this.nav.setRoot('HomePage');
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "login()", err);

        this.errorText = err;
      });

    this.logger.warn_log(this.TAG, "login()", "method end");
    return;
  }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public goRecoverPassword() {
    this.nav.push('ForgotPasswordPage');
  }
  
}