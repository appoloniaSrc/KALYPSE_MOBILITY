import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Keyboard, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationWebService } from './../../../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { NumberValidator } from './../../../../providers/utils/validator.service';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  //=================================
	// ATTRIBUTES
  //=================================
  
  TAG = "RegisterPage";

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
        'clientCard' : ['', Validators.compose([NumberValidator.isValid, Validators.required])]
        , 'birthday' : ['', Validators.compose([Validators.required])]
    });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register_Page');
  }


  public createAccountStep2() {
    this.nav.push('Register_2Page');
  }

}
