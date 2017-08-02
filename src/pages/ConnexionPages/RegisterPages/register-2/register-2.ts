import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Keyboard, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationWebService } from './../../../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
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

  authForm: FormGroup;

  createSuccess = false;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private platform: Platform
    , private nav: NavController
    , private auth: AuthenticationWebService
    , private formBuilder: FormBuilder
    , private alertCtrl: AlertController
    , public keyboard: Keyboard

    , private logger: LoggerService
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
    console.log('ionViewDidLoad Register_2Page');
  }

  public finishInscription() {
    this.nav.setRoot('LoginPage');
  }
 
  public register() {
    /*this.auth.register(this.registerCredentials).subscribe(success => {
      if (success) {
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
      error => {
        this.showPopup("Error", error);
      });*/
  }

}
