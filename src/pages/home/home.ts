import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, IonicPage, Slides, AlertController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TransfertPage } from './../transfert/transfert';
import { JackpotsTabsPage } from './../jackpots-tabs/jackpots-tabs';
import { BarPage } from './../bar/bar';
import { InformationsPage } from './../informations/informations';

import { AuthenticationWebService } from '../../providers/authentication/authentication.web.service';
import { LoggerService } from './../../providers/logger/logger.service';
 
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "HomePage";

  @ViewChild(Slides) slides: Slides;
  slidesNumber : any;
  slidesInfoTemplate: Array<{
    thumbnailURL: string
    ,titleSlide: string
    ,bodySlide: string 
  }>;

  pagesFunctionsTemplate: Array<{
    slidesFunctions: any
  }>;

  FunctionsTemplate: Array<{
    function: any
    ,icon: string
    ,title: string 
    ,isEmpty: boolean
  }>;

  isScannedEGM : any;
  
  resultsScan : any;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor (
    private platform: Platform
    , private nav: NavController
    , private auth: AuthenticationWebService
    , private barcode: BarcodeScanner
    , private alertCtrl: AlertController

    , private logger: LoggerService
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(this.platform.is('ios') || this.platform.is('android')) {
        this.isScannedEGM = false;

        this.pagesFunctionsTemplate = [
          { slidesFunctions: this.FunctionsTemplate = [
                                    { function: 'scan()', icon: 'fa-qrcode', title: 'Scan QR Code', isEmpty: false }
                                    ,{ function: 'goTransfer()', icon: 'fa-euro', title: 'Transfer', isEmpty: false }
                                    ,{ function: '', icon: 'fa-line-chart', title: 'Jackpots', isEmpty: false }
                                    ,{ function: '', icon: 'fa-bell', title: 'Call MCD', isEmpty: false }
                                  ]}
          ,{ slidesFunctions: this.FunctionsTemplate = [
                                    { function: '', icon: 'fa-cutlery', title: 'Bar', isEmpty: false }
                                    ,{ function: '', icon: 'fa-info-circle', title: 'Info', isEmpty: false }
                                    ,{ function: '', icon: 'fa-cutlery', title: 'point de fidelité', isEmpty: false }
                                    ,{ function: '', icon: '', title: '', isEmpty: true }
                                  ]}
        ];
      } else {
        this.isScannedEGM = true;

        /*this.pagesFunctionsTemplate = [
          { slidesFunctions: this.FunctionsTemplate = [
                                    { function: '', icon: 'fa-line-chart', title: 'Jackpots', isEmpty: false }
                                    ,{ function: '', icon: 'fa-info-circle', title: 'Info', isEmpty: false }
                                    ,{ function: '', icon: '', title: '', isEmpty: true }
                                    ,{ function: '', icon: '', title: '', isEmpty: true }
                                  ]}
        ];*/

        this.pagesFunctionsTemplate = [
          { slidesFunctions: this.FunctionsTemplate = [
                                    { function: 'scan()', icon: 'fa-qrcode', title: 'Scan QR Code', isEmpty: false }
                                    ,{ function: 'goTransfer()', icon: 'fa-euro', title: 'Transfer', isEmpty: false }
                                    ,{ function: '', icon: 'fa-line-chart', title: 'Jackpots', isEmpty: false }
                                    ,{ function: '', icon: 'fa-bell', title: 'Call MCD', isEmpty: false }
                                  ]}
          ,{ slidesFunctions: this.FunctionsTemplate = [
                                    { function: '', icon: 'fa-cutlery', title: 'Bar', isEmpty: false }
                                    ,{ function: '', icon: 'fa-info-circle', title: 'Info', isEmpty: false }
                                    ,{ function: '', icon: '', title: '', isEmpty: true }
                                    ,{ function: '', icon: '', title: '', isEmpty: true }
                                  ]}
        ];
      }
    });

    this.slidesInfoTemplate = [
      { thumbnailURL: './images/casino1.png', titleSlide: 'Casino 1', bodySlide: 'info info info info info info info' }
      ,{ thumbnailURL: './images/casino2.png', titleSlide: 'Casino 2', bodySlide: 'info info info info info info info' }
      ,{ thumbnailURL: './images/casino3.png', titleSlide: 'Casino 3', bodySlide: 'info info info info info info info' }
    ];
  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
 
  // Deconnexion
  public logout() {

    this.logger.warn_log(this.TAG, "logout()", "method start");

    this.auth.logout()
      .then(() => {
        this.nav.setRoot('LoginPage')
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "logout()", err);
      });

      this.logger.warn_log(this.TAG, "logout()", "method start");
  }

  async scan()
  {
    if(this.platform.is('ios') || this.platform.is('android') || this.platform.is('windows')){
      await this.barcode.scan().then((barcodeData) => {
          // Success! Barcode data is here
          this.resultsScan = barcodeData;
          console.log(this.resultsScan);

          if(this.resultsScan.text != "")
            this.showPrompt();

      }, (err) => {
          // An error occurred
          console.error(err);
          this.showAlert("Scan QRCode", 
                  "Error scan : " + err);
      });
    }
    else
      this.showAlert("Error", "Scan not avaible for this platform.");

    //this.nav.push(TransfertPage);
  }

  private showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK'],
      cssClass: 'alertPopup'
    });
    alert.present();
  }

  private showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Transfert',
      subTitle: "Enter your pin code to use your cashless account",
      inputs: [
        {
          name: 'Pin',
          placeholder: 'Enter your pin code',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.isScannedEGM = true;
            this.nav.push(TransfertPage);
          }
        }
      ],
      enableBackdropDismiss: false,
      cssClass: 'alertPrompt'
    });
    prompt.present();
  }

  private goPage(page : any) {
    this.nav.push(page);
  }

  public funcOpen(event, item) {
    switch(item){
      case 'Scan QR Code':
        this.scan();
        break;
      case 'Transfer':
        this.goPage(TransfertPage);
        break;
      case 'Jackpots':
        this.goPage(JackpotsTabsPage);
        break;
      case 'Call MCD':
        alert('Open ' + item);
        break;
      case 'Bar':
        this.goPage(BarPage);
        break;
      case 'Info':
        this.goPage(InformationsPage);
        break;
    }
  }
}