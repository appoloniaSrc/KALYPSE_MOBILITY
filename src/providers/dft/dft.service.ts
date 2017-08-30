import { Injectable } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConfigService } from '../webservice/shared/config.service';
import { WSPantheonService } from '../webservice/shared/wspantheon.service';
import { LoggerService } from './../logger/logger.service';
import { Utils } from './../utils/utils.service';

@Injectable()
export class DftService {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "DftService";

  //=========================================================================
  // CONSTRUCTOR
  //=========================================================================

  constructor(
    private platform: Platform
    , private config: ConfigService
    , private webservice: WSPantheonService
    , private loadingCtrl: LoadingController
    , private pref: Storage

    , private logger: LoggerService
    , private utils: Utils
  ) {

  }

  //=================================
  // METHODS
  //=================================

  //#############################################################################################################
  // WEB SERVICE OPERATIONS
  //#############################################################################################################

  //*************************************************************************
  // DFT CASHLESS
  //*************************************************************************

  async getCashlessData(hashedKey: string, clientId: string, siteID: string, siteSlot: string,
    currentCreditSlot: string, pinCode: string): Promise<any []> {

  await this.logger.info_log(this.TAG, "getCashlessData()", "Start Method");

  let loading = this.loadingCtrl.create({
    content: 'Get Cashless data ...',
    dismissOnPageChange: true
  });
  loading.present();

  var isOKtoContinue = false;
  var reponse: any [];
  var responseError = ""

  await this.webservice._getCashlessTransfertDFT(hashedKey, siteID, siteSlot, clientId, currentCreditSlot, pinCode)
    .then(result => {
      reponse = result;
      isOKtoContinue = true;
    })
    .catch(err => {
      this.logger.error_log(this.TAG, "getCashlessData()", err);		
      responseError = err;			
    });
  await this.utils.delay(this.logger.EVENT_WRITE_FILE);

  loading.dismiss();
  await this.logger.info_log(this.TAG, "getCashlessData()", "End Method");
  if(isOKtoContinue)
    return Promise.resolve(reponse);
  else
    return Promise.reject(responseError);
}

async canBurnCashlessDFT(hashedKey: string, clientId: string, siteID: string, slotNumber: string,
    amountCashless: string, cardNumber: string, currentCreditSlot: string, pinCode): Promise<boolean> {

  await this.logger.info_log(this.TAG, "canBurnCashlessDFT()", "Start Method");

  let loading = this.loadingCtrl.create({
    content: 'Verification ...',
    dismissOnPageChange: true
  });
  loading.present();

  var isOK = false
  var canCashless = false;;

  await this.webservice._canBurnCashlessByDFT(hashedKey, siteID, clientId, amountCashless,
      cardNumber, siteID + slotNumber, currentCreditSlot, pinCode)
    .then(result => {

      isOK = (result[0] == "true") && (result[0] != undefined) ? true: false;

      if(isOK)
        canCashless = result[0] == "true" ? true: false;
    })
    .catch(err => {
      this.logger.error_log(this.TAG, "canBurnCashlessDFT()", err);			
    });

  loading.dismiss();
  await this.utils.delay(this.logger.EVENT_WRITE_FILE);

  if(isOK)
    return Promise.resolve(canCashless);
  else
    return Promise.reject(null);
}

async burnCashlessDFT(hashedKey: string, siteID: string, clientId: string, slotNumber: string,
   amountCashless: string, cardNumber: string, currentCreditSlot: string, pinCode: string): Promise<any []> {
  
  let isOKtoContinue = false;
  var reponse: any [];
  var reponseError = ""

  await this.canBurnCashlessDFT(hashedKey, clientId, siteID, slotNumber, amountCashless, cardNumber, currentCreditSlot, pinCode)
    .then(result => isOKtoContinue = result);

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });

  if(isOKtoContinue) {

    
    loading.setContent('Transfert ...');
    loading.present();

    await this.webservice._burnCashlessByDFT(hashedKey, siteID, clientId, siteID + slotNumber, slotNumber, amountCashless, cardNumber, pinCode)
      .then(result => {
        isOKtoContinue = true;
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "burnCashlessDFT()", err);		
        isOKtoContinue = false;
        reponseError = err;			
      });
      
    loading.dismiss();
    await this.utils.delay(this.logger.EVENT_WRITE_FILE);
  }

  await this.logger.info_log(this.TAG, "burnCashlessDFT()", "End Method");
  if(isOKtoContinue)
    return Promise.resolve(reponse);
  else
    return Promise.reject(reponseError);
}

  //*************************************************************************
  // DFT LOYALTY POINTS
  //*************************************************************************

  async getLoyaltyPoints(hashedKey: string, clientId: string, siteID: string, siteSlot: string,
      currentCreditSlot: string): Promise<any []> {

    await this.logger.info_log(this.TAG, "getLoyaltyPoints()", "Start Method");

    // Get Loyalty Points
    //------------------------------------------------

    let loading = this.loadingCtrl.create({
      content: 'Get Loyalty Points ...',
      dismissOnPageChange: true
    });
    loading.present();

    var isOKtoContinue = false;
    var reponse: any [];
    var responseError = ""

    await this.webservice._getLoyaltyPointsTransfertDFT(hashedKey, siteID, siteSlot, clientId, currentCreditSlot)
      .then(result => {
        reponse = result;
        isOKtoContinue = true;
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "getLoyaltyPoints()", err);		
        responseError = err;			
      });
    await this.utils.delay(this.logger.EVENT_WRITE_FILE);

    loading.dismiss();
    await this.logger.info_log(this.TAG, "getLoyaltyPoints()", "End Method");
    if(isOKtoContinue)
      return Promise.resolve(reponse);
    else
      return Promise.reject(responseError);
  }

  async CanBurnLoyaltyPoints(hashedKey: string, clientId: string, siteID: string, slotNumber: string,
      amountEuros: string, cardNumber: string, currentCreditSlot: string): Promise<boolean> {

    await this.logger.info_log(this.TAG, "burnLoyaltyPoints()", "Start Method");
    
    // Get Loyalty Points
    //------------------------------------------------

    let loading = this.loadingCtrl.create({
      content: 'Verification ...',
      dismissOnPageChange: true
    });
    loading.present();

    var isOK = false;
    var canTakePresent = false;;

    await this.webservice._canBurnLoyaltyPointsByDFT(hashedKey, siteID, clientId, amountEuros,
        cardNumber, siteID + slotNumber, currentCreditSlot)
      .then(result => {

        isOK = result[0]["a:CanTakePresent"] != undefined ? true: false;

        if(isOK)
          canTakePresent = result[0]["a:CanTakePresent"] == "true" ? true: false;
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "burnLoyaltyPoints()", err);			
      });

    loading.dismiss();
    await this.utils.delay(this.logger.EVENT_WRITE_FILE);

    if(isOK)
      return Promise.resolve(canTakePresent);
    else
      return Promise.reject(null);
  }

  async burnLoyaltyPoints(hashedKey: string, clientId: string, siteID: string, slotNumber: string,
      amountEuros: string, cardNumber: string, currentCreditSlot: string): Promise<any []> {
    
    let isOKtoContinue = false;
    var reponse: any [];
    var reponseError = ""

    await this.CanBurnLoyaltyPoints(hashedKey, clientId, siteID, slotNumber, amountEuros, cardNumber, currentCreditSlot)
      .then(result => isOKtoContinue = result);

      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      });

    if(isOKtoContinue) {

      
      loading.setContent('Transfert ...');
      loading.present();

      await this.webservice._burnLoyaltyPointsByDFT(hashedKey, siteID, clientId, siteID + slotNumber, slotNumber, amountEuros, cardNumber)
        .then(result => {
          this.logger.warn_complex_log(this.TAG, "burnLoyaltyPoints()", reponse);
          isOKtoContinue = true;
        })
        .catch(err => {
          this.logger.error_log(this.TAG, "burnLoyaltyPoints()", err);		
          isOKtoContinue = false;
          reponseError = err;			
        });
        
      loading.dismiss();
      await this.utils.delay(this.logger.EVENT_WRITE_FILE);
    }

    await this.logger.info_log(this.TAG, "burnLoyaltyPoints()", "End Method");
    if(isOKtoContinue)
      return Promise.resolve(reponse);
    else
      return Promise.reject(reponseError);
  }
}
