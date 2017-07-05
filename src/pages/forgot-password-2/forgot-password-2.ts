import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';

import { AuthenticationProvider } from '../../providers/authentication/authentication';

/**
 * Generated class for the ForgotPassword_2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-forgot-password-2',
  templateUrl: 'forgot-password-2.html',
})
export class ForgotPassword_2Page {

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
    console.log('ionViewDidLoad ForgotPassword_2Page');
  }

  public forgotPasswordFinished() {
    this.nav.setRoot('LoginPage');
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
