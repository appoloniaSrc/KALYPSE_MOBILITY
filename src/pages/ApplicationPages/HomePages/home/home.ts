import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, IonicPage, Slides, AlertController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';
import { SoapTools } from './../../../../providers/webservice/Soap/soap-tools';


import { TransfertPage } from './../../transfert/transfert';
import { JackpotsTabsPage } from './../Jackpots/jackpots-tabs/jackpots-tabs';
import { BarPage } from './../bar/bar';
import { InformationsPage } from './../informations/informations';

import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { DftService } from './../../../../providers/dft/dft.service';
import { LoggerService } from './../../../../providers/logger/logger.service';
import { LanguageService } from './../../../../providers/language/language.service';
import { Utils, transfer_types_list, getValueFromString } from './../../../../providers/utils/utils.service';
 
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

  siteID: string;
  clientID: string;
  cardNumber: string;

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
    , icon: string
    , title: string 
    , isEmpty: boolean
  }>;

  isScannedSlot : boolean;
  slotNumber: string;
  
  resultsScan = {
    siteId: ""
    , slotNumber: ""
  }

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor (
    private platform: Platform
    , private nav: NavController
    , private barcode: BarcodeScanner
    , private alertCtrl: AlertController
    , private pref: Storage

    , private logger: LoggerService
    , private langService: LanguageService
    , private utils: Utils
    , private auth: AuthentificationWebService
    , private dft: DftService
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(this.platform.is('ios') || this.platform.is('android')) {
        this.isScannedSlot = false;

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
    this.init();
  }

  private async init() {
    
    await this.logger.info_log(this.TAG, "init()", "End Method");

    await setTimeout(
      this.pref.get("SLOT_NUMBER")
        .then(value => {
          this.slotNumber = value;
          if(this.slotNumber != null)
            this.isScannedSlot = true;
        })
        .catch(err => {
          this.isScannedSlot = false;
          this.logger.error_log(this.TAG, "init()", "Get Slot number error = " +err);
        })
    , this.logger.EVENT_WRITE_FILE);

    await setTimeout(
      this.pref.get("SITE_ID")
        .then(value => {
          this.siteID = value;
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "init()", "Get site ID error = " +err);
        })
    , this.logger.EVENT_WRITE_FILE);

    await setTimeout(
      this.pref.get("CLIENT_ID")
        .then(value => {
          this.clientID = value;
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "init()", "Get client ID error = " +err);
        })
    , this.logger.EVENT_WRITE_FILE);

    await setTimeout(
      this.pref.get("CARD_NUMBER")
        .then(value => {
          this.cardNumber = value;
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "init()", "Get card Number error = " +err);
        })
    , this.logger.EVENT_WRITE_FILE);

    await this.logger.info_log(this.TAG, "init()", "End Method");
  }
 
  // Deconnexion
  public async logout() {

    await this.logger.info_log(this.TAG, "logout()", "Start Method");

    this.auth.logout()
      .then(() => {
        this.nav.setRoot('LoginPage');
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "logout()", err);
      });
    await this.utils.delay(this.logger.EVENT_WRITE_FILE);

    await this.logger.info_log(this.TAG, "logout()", "End Method");
  }

  // Send Log files
  public async sendLogFiles() {
    
    await this.logger.info_log(this.TAG, "sendLogFiles()", "Start Method");

    await this.logger.sendLogFiles()
      .then(result => {
        console.log("send okok")
        console.log(result);
      })
      .catch(err => {
        console.error("Send failed");
        console.error(err);
      });

    await this.logger.info_log(this.TAG, "sendLogFiles()", "End Method");
  }

  async scan()
  {
    if(this.platform.is('ios') || this.platform.is('android') || this.platform.is('windows')){
      await this.barcode.scan().then((barcodeData) => {
          // Success! Barcode data is here

          if(barcodeData.text != ""){

            this.resultsScan.siteId = getValueFromString(barcodeData.text, "SITE_ID")
            console.log(this.resultsScan.siteId);

            this.resultsScan.slotNumber = getValueFromString(barcodeData.text, "SLOT_NUMBER")
            console.log(this.resultsScan.slotNumber);

            if(this.siteID == this.resultsScan.siteId){
              this.pref.set("SLOT_NUMBER", this.resultsScan.slotNumber);
              this.isScannedSlot = true;
              this.alert_choice_transfer();
            }
            else
              this.utils.alert_error_simple("DIFFERENT_SITE_ID");
          }

      }, (err) => {
          // An error occurred
          console.error(err);
          this.utils.alert_simple("Erreur Scan QRCode", "Error scan : " + err);
      });
    }
    else
      //this.utils.alert_error_simple("Error", "Scan not avaible for this platform.");
      // TODO
      console.log("Scan not avaible for this platform.");
  }

  private alert_choice_transfer() {
 
    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: this.langService.get("CHOICE_TRANSFER_TYPE"),
        message: this.langService.get("SLOT_NUMBER_MESSAGE") + this.resultsScan.slotNumber + ".\n" + this.langService.get("CHOICE_TRANSFER_TYPE_MESSAGE"),
        buttons: [
          {
            text: this.langService.get('CANCEL'),
            handler: () => resolve(false)
          },
          {
            text:  this.langService.get("LOYALTY_POINTS"),
            handler: () => this.choice_loyaltyPoints()
          },
          {
            text:  this.langService.get("CASHLESS"),
            handler: () => this.choice_cashless()
          }
        ],
        enableBackdropDismiss: false,
        cssClass: 'alert-popup'
      });
      alert.present();
    })
  };

  private async choice_loyaltyPoints(): Promise<any> {

    await this.logger.info_log(this.TAG, "choice_loyaltyPoints()", "Start Method");

    var isOK: boolean;
    var hashedKey = "";
    await this.auth.authWebService_Token_Hashedkey()
      .then(result => {
        isOK = result.isOK;
        hashedKey = result.hashedKey;
      });

    if(isOK) {

      await this.dft.CanBurnLoyaltyPoints(hashedKey, this.clientID, this.siteID, this.resultsScan.slotNumber, "1", this.cardNumber, "0")
        .then(result => {
          if(result){
            this.nav.push(TransfertPage, {TRANSFER_TYPE: transfer_types_list.get("loyaltyPoints"), SITE_ID: this.siteID, SLOT_NUMBER: this.resultsScan.slotNumber, CLIENT_ID: this.clientID,
              CARD_NUMBER: this.cardNumber, PIN_CODE: ""});
          }
          else {
            this.utils.alert_warning_simple("CREDITS_ACCOUNT_0");
          }
        });

      await this.utils.delay(this.logger.EVENT_WRITE_FILE);
    } else {
      this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE");
    }

    await this.logger.info_log(this.TAG, "choice_loyaltyPoints()", "End Method");

  }

  private choice_cashless(): Promise<any> {
    return new Promise((resolve, reject) => {
      let prompt = this.alertCtrl.create({
        title: this.langService.get("TRANSFER"),
        subTitle: this.langService.get("TRANSFER_MESSAGE_PIN"),
        inputs: [
          {
            name: 'pinCode',
            placeholder: this.langService.get("PIN_CODE"),
            type: 'password',
            id: 'pinCodeInput'
          }
        ],
        buttons: [
          {
            text: this.langService.get("CANCEL"),
            handler: data => {
            }
          },
          {
            text: 'OK',
            handler: data => {
              if(data.pinCode != ""){
                let pinCode_hashed = SoapTools.sha1(data.pinCode);
                this.choice_Cashless_verification_pin(pinCode_hashed);
              }
            }
          }
        ],
        enableBackdropDismiss: false,
        cssClass: 'alert-prompt'
      });

      prompt.present();
    });
  }

  private async choice_Cashless_verification_pin(pinCode: string): Promise<any> {
    
    await this.logger.info_log(this.TAG, "choice_loyaltyPoints()", "Start Method");

    var isOK: boolean;
    var hashedKey = "";
    await this.auth.authWebService_Token_Hashedkey()
      .then(result => {
        isOK = result.isOK;
        hashedKey = result.hashedKey;
      });

    if(isOK) {

      await this.dft.canBurnCashlessDFT(hashedKey, this.clientID, this.siteID, this.resultsScan.slotNumber, "1", this.cardNumber, "0", pinCode)
        .then(result => {
          if(result){
            this.nav.push(TransfertPage, {TRANSFER_TYPE: transfer_types_list.get("cashless"), SITE_ID: this.siteID, SLOT_NUMBER: this.resultsScan.slotNumber, CLIENT_ID: this.clientID,
              CARD_NUMBER: this.cardNumber, PIN_CODE: pinCode});
          }
          else {
            this.utils.alert_warning_simple("CREDITS_ACCOUNT_0");
          }
        });

      await this.utils.delay(this.logger.EVENT_WRITE_FILE);
    } else {
      this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE");
    }

    await this.logger.info_log(this.TAG, "choice_loyaltyPoints()", "End Method");

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
        this.alert_choice_transfer();
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