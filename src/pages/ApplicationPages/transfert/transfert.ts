import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AuthentificationWebService } from './../../../providers/authentification/authentification.web.service';
import { LoggerService } from './../../../providers/logger/logger.service';
import { Utils } from './../../../providers/utils/utils.service';
import { DftService } from './../../../providers/dft/dft.service';

@IonicPage()
@Component({
  selector: 'page-transfert',
  templateUrl: 'transfert.html'
})
export class TransfertPage {
  
  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "TransfertPage";

  transferType: number;

  siteID: string;
  clientID: string;
  cardNumber: string;
  pinCode: string;

  slotNumber:string;
  amountEuros:string;
  amountCredits:string;
  amountDefault:string;
  amountMax:string;
  otherAmount:string;

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    , public navParams: NavParams
    , private loadingCtrl: LoadingController
    , private toastCtrl: ToastController
    , private pref: Storage

    , private logger: LoggerService
    , private utils: Utils
    , private auth: AuthentificationWebService
    , private dft: DftService
  ) {

  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    this.init();
  }

  private async init() {

    await this.logger.info_log(this.TAG, "init()", "End Method");

    this.transferType = this.navParams.get("TRANSFER_TYPE");

    this.siteID = this.navParams.get("SITE_ID");
    this.clientID = this.navParams.get("CLIENT_ID");
    this.cardNumber = this.navParams.get("CARD_NUMBER");
    this.slotNumber = this.navParams.get("SLOT_NUMBER");
    this.pinCode = this.navParams.get("PIN_CODE");

    if(this.transferType != null && this.siteID != null && this.clientID != null && this.cardNumber != null && this.slotNumber != null && this.pinCode != null){
      // Get Authorization to access Webservice

      var isOK: boolean;
      var hashedKey = "";
      await this.auth.authWebService_Token_Hashedkey()
        .then(result => {
          isOK = result.isOK;
          hashedKey = result.hashedKey;
        });

      if(isOK) {

        if(this.transferType == 0){
          await this.dft.getLoyaltyPoints(hashedKey, this.clientID, this.siteID, this.siteID + this.slotNumber, "0")
            .then(result => {
              this.amountEuros = result[0]["a:Balance"];
              this.amountCredits = result[0]["a:Credits"];
              this.amountDefault = result[0]["a:DefaultAmount"];
              this.amountMax = result[0]["a:MaxAmount"];
            })
            .catch(err => {
              this.logger.error_log(this.TAG, "init()", err);
            })
        } else if(this.transferType == 1) {
          await this.dft.getCashlessData(hashedKey, this.clientID, this.siteID, this.siteID + this.slotNumber, "0", this.pinCode)
            .then(result => {
              this.amountEuros = result[0]["a:Balance"];
              this.amountCredits = result[0]["a:Credits"];
              this.amountDefault = result[0]["a:DefaultAmount"];
              this.amountMax = result[0]["a:MaxAmount"];
            })
            .catch(err => {
              this.logger.error_log(this.TAG, "init()", err);
            })
        }

        await this.utils.delay(this.logger.EVENT_WRITE_FILE);
      } else {
        this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE")
      }
    }

    await this.logger.info_log(this.TAG, "init()", "End Method");
  }

  async startTransfer(ammountSelect: string){
    // Get Authorization to access Webservice

    console.warn(ammountSelect);

    if(ammountSelect == "" || ammountSelect == undefined){
      this.utils.alert_warning_simple("BAD_SELECTED_CREDITS");
      return;
    }

    if(parseFloat(ammountSelect) > parseFloat(this.amountMax)){
      this.utils.alert_warning_simple("MAX_BET_EXCEEDED_MESSAGE");
      return;
    }

		var isOK: boolean;
    var hashedKey = "";
    await this.auth.authWebService_Token_Hashedkey()
      .then(result => {
        isOK = result.isOK;
        hashedKey = result.hashedKey;
      });

    if(isOK) {
      if(this.transferType == 0){
        await this.dft.burnLoyaltyPoints(hashedKey, this.clientID, this.siteID, this.slotNumber, ammountSelect, this.cardNumber, "0")
          .then(result => {
            this.utils.alert_success_simple("SUCCESS_TRANSFER_MESSAGE");
          })
      } else if(this.transferType == 1) {
        await this.dft.burnCashlessDFT(hashedKey, this.siteID, this.clientID, this.slotNumber, ammountSelect, this.cardNumber, "0", this.pinCode)
          .then(result => {
            this.utils.alert_success_simple("SUCCESS_TRANSFER_MESSAGE");
          })
      }

      await this.utils.delay(this.logger.EVENT_WRITE_FILE);
    } else {
			this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE")
		}

    await this.logger.info_log(this.TAG, "startTransfer()", "End Method");

  }

}
