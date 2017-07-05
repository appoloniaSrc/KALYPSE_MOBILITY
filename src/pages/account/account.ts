import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "AccountPage";

  firstName: any;
  lastName: any;
  email: any;
  birthday: any;
  cashlessAccount: any;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    ,public navParams: NavParams
    ,private auth: AuthenticationProvider
  ) {
    this.firstName = "Example";
    this.lastName = "TEST";
    this.email = this.firstName + "." + this.lastName + "@gmail.com";
    this.birthday = "01 / 01 / 2017";
    this.cashlessAccount = "***************123";
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  // Deconnexion
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage')
    });
  }

}
