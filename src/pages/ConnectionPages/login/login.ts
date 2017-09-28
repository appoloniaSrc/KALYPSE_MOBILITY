import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';

import { AuthentificationWebService } from './../../../providers/authentification/authentification.web.service';
import { LoggerService } from './../../../providers/logger/logger.service';
import { LanguageService } from './../../../providers/language/language.service';
import { Utils } from './../../../providers/utils/utils.service';
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

    , private auth: AuthentificationWebService
    , private logger: LoggerService
    , private languageService: LanguageService
    , private utils: Utils
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
    this.init();
  }

  private async init() {
    
    await this.logger.info_log(this.TAG, "init()", "Start Method");

    await setTimeout(
      this.pref.get('IDENTIFIANT')
        .then((value) => {
          this.authForm.controls['email'].setValue(value);
          if(value != null)
            this.authForm.controls['rememberMe'].setValue(true);
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "ionViewDidLoad()", '"IDENTIFIANT" value in pref =' + err);
        })
    , this.logger.EVENT_WRITE_FILE);

    await setTimeout(
      this.pref.get("LANGUAGE").then(value => {
        if(value != null)
          this.languageService.set_language(value);
      })
    , this.logger.EVENT_WRITE_FILE);  

    await this.logger.info_log(this.TAG, "logout()", "End Method");
  }
 
  async login() {

    await this.logger.info_log(this.TAG, "login()", "Start Method");

    // Save the identifiant if the user checked the checkbox

    if(this.authForm.controls['rememberMe'].value)
    {
      this.pref.set('IDENTIFIANT', this.authForm.controls['email'].value);
    } else {
      this.pref.remove('IDENTIFIANT');
    }

    //********************************
    // Start Login processus
    //********************************

    // Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.auth.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

    if(isOK) {

      let hashedPswd = Md5.hashStr(this.authForm.controls['password'].value).toString();

      await this.auth.checkCustomerWithCredentials(hashedKey, this.authForm.controls['email'].value.toLowerCase(), hashedPswd)
        .then(result => {

          // Save informations client into preferences
          this.pref.set("CLIENT_ID",    result.customerArray[0]["a:ClientId"]);

          this.pref.get("LANGUAGE").then(value => {
            if(value == null)
              this.languageService.set_language(result.customerArray[0]["a:Language"].toString());
          });

          this.pref.set("CURRENCY",     result.customerArray[0]["a:Currency"]);

          this.pref.set("CARD_NUMBER",  result.playerCardArray[0]["a:CardNumber"]);

          this.nav.setRoot('HomePage');
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "login()", err);

          this.errorText = err;
        });
      await this.utils.delay(this.logger.EVENT_WRITE_FILE);
    } else {
			this.errorText = "Error at the authorization to access Webservice";
		}

    await this.logger.info_log(this.TAG, "login()", "End Method");
  }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public goRecoverPassword() {
    this.nav.push('ForgotPasswordPage');
  }
  
}