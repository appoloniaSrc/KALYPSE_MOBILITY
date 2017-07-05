import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';

import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  //=================================
	// ATTRIBUTES
	//=================================



  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private platform: Platform
    ,private nav: NavController
    ,private auth: AuthenticationProvider
    ,private alertCtrl: AlertController
    ,private loadingCtrl: LoadingController
    ,private keyboard: Keyboard
  ) {



  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  public forgotPasswordStep2() {
    this.nav.push('ForgotPassword_2Page');
  }

  private showFooter() {
    var isShowing;

    if(!this.keyboard.isOpen){
      if(this.platform.is('ios') || this.platform.is('android') || this.platform.is('windows')){
        isShowing = false;
      }
      else {
        isShowing = true;
      }
    }
    else
      isShowing = true;

    return isShowing;
  }

}
