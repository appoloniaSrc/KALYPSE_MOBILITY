import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConfigService } from './../../providers/webservice/shared/config.service';
import { WSPantheonService } from './../../providers/webservice/shared/wspantheon.service';
import { AuthenticationWebService } from '../../providers/authentication/authentication.web.service';
import { Utils, toDate } from './../../providers/utils/utils.service';
import { LoggerService } from './../../providers/logger/logger.service';

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
    , private auth: AuthenticationWebService

    , private logger: LoggerService
  ) {

    this.init();

  }

  //=================================
	// METHODS
  //=================================
  
  private async init(){

    // Get Client ID into preferences
    var clientID = ""
    await this.pref.get("CLIENT_ID")
      .then(value => {
        console.log(value);
        clientID = value;
      })
    
    // Get Data Client
    await this.auth.getDataCustomer(clientID, "00154")
      .then(result => {
        this.dataClient.firstName = result.customerArray[0]["a:Firstname"];
        this.dataClient.lastName = result.customerArray[0]["a:NameCustomer"];
        this.dataClient.email = result.customerArray[0]["a:Email"];

        this.dataClient.birthday = result.customerArray[0]["a:Birthday"];
        this.dataClient.birthday = toDate(this.dataClient.birthday.toString());

        let playerCardNumber = result.playerCardArray[0]["a:CardNumber"].toString();
        // this.dataClient.creditCardID = playerCardNumber.replace(playerCardNumber.substr(0,12), "************") + playerCardNumber.substr(13,4);
        this.dataClient.creditCardID = playerCardNumber;
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
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

}
