import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConfigService } from './../../../../providers/webservice/shared/config.service';
import { WSPantheonService } from './../../../../providers/webservice/shared/wspantheon.service';
import { AuthentificationWebService } from './../../../../providers/authentification/authentification.web.service';
import { toDate, Utils } from './../../../../providers/utils/utils.service';
import { LoggerService } from './../../../../providers/logger/logger.service';

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

  dataClient = {
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    creditCardID: "",
  }

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor(
    public nav: NavController
    , public navParams: NavParams
    , private pref: Storage

    , private config: ConfigService
    , private webservice: WSPantheonService
    , private auth: AuthentificationWebService

    , private logger: LoggerService
    , private utils:Utils
  ) {

    this.init();

  }

  //=================================
	// METHODS
  //=================================

  ionViewDidLoad() {

  }
  
  private async init(){

    // Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.auth.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

    if(isOK) {
      // Get Client ID into preferences
      var clientID = "";
      await this.pref.get("CLIENT_ID")
        .then(value => {
          clientID = value;
        });

      var siteID = "";
      await this.pref.get("SITE_ID")
        .then(value => {
          siteID = value;
        });
      
      // Get Data Client
      await this.auth.getDataCustomer(hashedKey, clientID, siteID)
        .then(result => {
          this.dataClient.firstName = result.customerArray[0]["a:Firstname"];
          this.dataClient.lastName = result.customerArray[0]["a:NameCustomer"];
          this.dataClient.email = result.customerArray[0]["a:Email"];

          this.dataClient.birthday = result.customerArray[0]["a:Birthday"];
          this.dataClient.birthday = toDate(this.dataClient.birthday.toString());

          let playerCardNumber = result.playerCardArray[0]["a:CardNumber"].toString();
          this.dataClient.creditCardID = playerCardNumber;
        });
    } else {
      this.utils.alert_error_simple("ACCESS_WEBSERVICE_ERROR_MESSAGE");
		}
  }

  // Deconnexion
  private async logout() {

    await this.logger.info_log(this.TAG, "logout()", "Start Method");

    this.auth.logout()
      .then(() => {
        this.nav.setRoot('LoginPage')
      })
      .catch(err => {
        this.logger.error_log(this.TAG, "logout()", err);
      });
    await this.utils.delay(this.logger.EVENT_WRITE_FILE);

    await this.logger.info_log(this.TAG, "logout()", "End Method");
  }

  changePassword(){
    this.nav.push("ChangePasswordPage");
  }

}
