import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AuthenticationProvider } from '../../providers/authentication/authentication';
 
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

  registerCredentials = { identifiant: '', password: '' };
  inputText: any;

  rememberMe: boolean;

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
    ,private pref: Storage
  ) {

    this.pref.length().then(result => {

      console.log(this.TAG + " ----> constructor : LocalStorage lenght = " + result + ".");

      if(result != 0){
        console.log(this.TAG + " ----> constructor : LocalStorage OK.");

        this.pref.get('identifiant').then((value) => {
          console.log(this.TAG + " ----> constructor : identifiant value = " + value + ".");
          this.registerCredentials.identifiant = value;
        });

      }
      else{
        console.log(this.TAG + " ----> constructor : LocalStorage NO.");
      }
    });

  }

  //=================================
  // METHODS
  //=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
 
  public login() {
    this.showLoading();

    if(this.rememberMe)
    {
      // set a key/value
      this.pref.set('identifiant', this.registerCredentials.identifiant);
    }
      /*}this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        this.nav.setRoot('HomePage');
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
        this.showError(error);
      });*/
    this.nav.setRoot('HomePage');
  }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public goRecoverPassword() {
    this.nav.push('ForgotPasswordPage');
  }
 
  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  private showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
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