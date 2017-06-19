import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Keyboard, IonicPage, Platform } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Keyboard]
})
export class LoginPage {
  TAG = "LoginPage";

  loading: Loading;
  registerCredentials = { email: '', password: '' };
  inputText: any;
  displayFooter: boolean = true;
  rememberMe: boolean;
 
  constructor(private platform: Platform, private nav: NavController, private auth: AuthenticationProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private keyboard: Keyboard) {
  /*this.pref.length().then((length) => {

    console.log(this.TAG + " ----> constructor : LocalStorage lenght = " + length + ".");

    if(length != 0){
      console.log(this.TAG + " ----> constructor : LocalStorage OK.");

      this.pref.get('email').then((value) => {
        console.log(this.TAG + " ----> constructor : email value = " + value + ".");
        this.registerCredentials.email = value;
      });
      this.pref.get('password').then((value) => {
        console.log(this.TAG + " ----> constructor : password value = " + value + ".");
        this.registerCredentials.password = value;
      });

      this.login();
    }
    else{
      console.log(this.TAG + " ----> constructor : LocalStorage NO.");
    }
  });*/

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
 
  public login() {
    this.showLoading()
    /*this.auth.login(this.registerCredentials).subscribe(allowed => {
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
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  updateRemember() {
    console.log("Cucumbers new state:" + this.rememberMe);
  }

  showFooter() {
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