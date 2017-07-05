import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Keyboard, Platform } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  //=================================
	// ATTRIBUTES
	//=================================

  createSuccess = false;
  registerCredentials = { email: '',  confirmEmail: '', password: '', confirmPassword: '' };

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    private platform: Platform
    ,private nav: NavController
    ,private auth: AuthenticationProvider
    ,private alertCtrl: AlertController
    ,public keyboard: Keyboard
  ) {



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
