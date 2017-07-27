import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Loading } from 'ionic-angular';

import { AuthenticationWebService } from './../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';

/**
 * Generated class for the TransfertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-transfert',
  templateUrl: 'transfert.html',
})
export class TransfertPage {
  
  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "BarPage";

  loading : Loading;

  masNumber:any;
  amountEuros:any;
  amountCredits:any;
  amountDefault:any;
  amountMax:any;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    , private auth: AuthenticationWebService
    , public navParams: NavParams
    , private loadingCtrl: LoadingController
    , private toastCtrl: ToastController

    , private logger: LoggerService
  ) {
    this.masNumber = "123";
    this.amountEuros = "500.00";
    this.amountCredits = "500.00";
    this.amountDefault = "50.00";
    this.amountMax = "1 500";
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransfertPage');
  }

  private startTransfer(){
    this.showLoading();

    let toast = this.toastCtrl.create({
      message: 'Success transfer',
      duration: 3000
    });
    toast.present();

    toast.onDidDismiss(() => {
      this.loading.dismiss();
    });
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
