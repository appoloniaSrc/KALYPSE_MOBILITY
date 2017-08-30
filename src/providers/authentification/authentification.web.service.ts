import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConfigService } from '../webservice/shared/config.service';
import { WSPantheonService } from '../webservice/shared/wspantheon.service';
import { LoggerService } from './../logger/logger.service';
import { Utils } from './../utils/utils.service';


@Injectable()
export class AuthentificationWebService {

	//=================================
	// ATTRIBUTES
	//=================================

	TAG = "AuthenticationWebService";

	//=========================================================================
	// CONSTRUCTOR
	//=========================================================================

	constructor(
		private config: ConfigService
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

	async authWebService_Token_Hashedkey() {

		await this.logger.info_log(this.TAG, "authWebService_Token_Hashedkey()", "Start Method");

		let loading = this.loadingCtrl.create({
			content: 'Authorization ...',
			dismissOnPageChange: true
		});
		loading.present();

		// Get Authorization with "token" and "hashed key" to access Webservice
		//------------------------------------------------

		var token = "";
		var hashedKey = "";

		var isOK = true;

		await this.webservice._getToken()
			.then(result => {
				token = result.toString();
				this.logger.log_log(this.TAG, "authWebService_Token_Hashedkey()", "token = " + token);
			})
			.catch(err => {
				this.logger.error_log(this.TAG, "authWebService_Token_Hashedkey()", err);
				isOK = false;
			});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);

		if(isOK)
		{
			await this.webservice._getHashedKey(token)
					.then(result => {
						hashedKey = result.toString();
						this.logger.log_log(this.TAG, "authWebService_Token_Hashedkey()", "hashedKey = " + hashedKey);
					})
					.catch(err => {
						this.logger.error_log(this.TAG, "authWebService_Token_Hashedkey()", err);
						isOK = false;
					});
			await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		}

		loading.dismiss();
		await this.logger.info_log(this.TAG, "authWebService_Token_Hashedkey()", "End Method");
		return {isOK, hashedKey};
	}

	//*************************************************************************
	// AUTHENTICATION
	//*************************************************************************

	async activeCustomerAccount(hashedKey: string, clientId: string): Promise<boolean> {

		await this.logger.info_log(this.TAG, "activeCustomerAccount()", "Start Method");

		// Get Customer with his credentials
		//------------------------------------------------

		let loading = this.loadingCtrl.create({
			content: 'Active Account ...',
			dismissOnPageChange: true
		});
		loading.present();

		var isActivated: boolean;
		var isFailed = false;

		await this.webservice._activeCustomerWebAccount(hashedKey, clientId)
			.then(result => {
				isActivated = result;
			})
			.catch(err => {
					this.logger.error_log(this.TAG, "activeCustomerAccount()", err);					
					isFailed = true;
				});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);

		loading.dismiss();
		await this.logger.info_log(this.TAG, "activeCustomerAccount()", "End Method");
		if(!isFailed)
			return Promise.resolve(isActivated);
		else
			return Promise.reject("Error account don't actived.");
	}

	async checkCustomerWithCredentials(hashedKey: string, userLogin: string, userPassword: string): Promise<{customerArray: any[]; playerCardArray: any[];}> {

		await this.logger.info_log(this.TAG, "checkCustomerWithCredentials()", "Start Method");

		// Get Customer with his credentials
		//------------------------------------------------

		let loading = this.loadingCtrl.create({
			content: 'Check Customer ...',
			dismissOnPageChange: true
		});
		loading.present();

		var customerArray = new Array();
		var isFailed = false;

		await this.webservice._getCustomerByCredential(hashedKey, userLogin, userPassword)
			.then(result => {
				customerArray = result;
			})
			.catch(err => {
				this.logger.error_log(this.TAG, "checkCustomerWithCredentials()", err);
				isFailed = true;
			});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);

		if(!isFailed) {
			var playerCardArray = new Array();

			await this.webservice._getPlayerCardsByClientID(hashedKey, customerArray[0]["a:ClientId"], true, true)
				.then(result => {
					playerCardArray = result;
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "checkCustomerWithCredentials()", err);
					isFailed = true;
				});
			await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		}

		loading.dismiss();
		await this.logger.info_log(this.TAG, "checkCustomerWithCredentials()", "End Method");
		if(!isFailed)
			return Promise.resolve({customerArray, playerCardArray});
		else
			return Promise.reject("Invalid username or password, please check this.");
	}

	async checkUserCardNumIDAndBirth(hashedKey: string, userCardNumID: string, userBirthday: string): Promise<{clientID: string;}> {

		await this.logger.info_log(this.TAG, "checkUserCardNumIDAndBirth()", "Start Method");

		// Check User Card Numero ID And Birthday
		//------------------------------------------------
	
		let loading = this.loadingCtrl.create({
			content: 'Analyze of your data ...',
			dismissOnPageChange: true
		});
		loading.present();

		var clientID = "";
		var clientArray = new Array();
		var isFailed = false;

		await this.webservice._getClientIDByCardNubmberID(hashedKey, userCardNumID)
			.then(result => {
				clientID = result.toString();
			})
		.catch(err => {
				this.logger.error_log(this.TAG, "checkUserCardNumIDAndBirth()", err);
				isFailed = true;
			});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		
		if(!isFailed) {
			await this.webservice._SearchClient(hashedKey, "", "", userBirthday, clientID, "")
				.then(result => {
					clientArray = result;
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "checkUserCardNumIDAndBirth()", err);
					isFailed = true;
				});
			await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		}

		loading.dismiss();
		await this.logger.info_log(this.TAG, "checkUserCardNumIDAndBirth()", "End Method");
		if(!isFailed)
			return Promise.resolve({clientID});
		else
			return Promise.reject("Invalid card number or birthday, please check this.");
	}

	async changePassword(hashedKey: string, clientID: string, userPassword: string): Promise<boolean> {

		await this.logger.info_log(this.TAG, "changePassword()", "Start Method");

		// Change Password
		//------------------------------------------------

		let loading = this.loadingCtrl.create({
			content: 'Change Password ...',
			dismissOnPageChange: true
		});
		loading.present();

		var isFailed = false;
		var isUpdatePass: boolean;

		await this.webservice._updateCustomerPassword(hashedKey, clientID, userPassword)
			.then(result => {
				isUpdatePass = result;
			})
			.catch(err => {
				this.logger.error_log(this.TAG, "changePassword()", err);
				isFailed = true;
			});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);

		loading.dismiss();
		await this.logger.info_log(this.TAG, "changePassword()", "End Method");
		if(!isFailed)
			return Promise.resolve(isUpdatePass);
		else
			return Promise.reject("Changing the Password Failed");
	}

	async changeEmail(hashedKey: string, loginEmail: string, siteID: string, clientID: string): Promise<any> {

		await this.logger.info_log(this.TAG, "changeEmail()", "Start Method");

		// Change Email
		//------------------------------------------------

		var isOKChange = false;

		let loading = this.loadingCtrl.create({
			content: 'Change Email ...',
			dismissOnPageChange: true
		});
		loading.present();

		var isFailed = false;
		var errorText = "";

		await this.webservice._loginIsExisting(hashedKey, loginEmail)
			.then(result => {
				isOKChange = !result;

				if(result) {
					this.logger.log_log(this.TAG, "changeEmail()", 'The email "' + loginEmail + '" already exists');
					errorText = "The email already exists, please enter another one.";
					isFailed = true;
				}
			})
			.catch(err => {
				this.logger.error_log(this.TAG, "changeEmail()", err);
				isFailed = true;
			});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);

		if(isOKChange && !isFailed) {	
			await this.webservice._updateCustomer(hashedKey, siteID, clientID, '', '', '', '', '', '', '', '', '', '', ''
								, loginEmail, '', '', '', '', '', '', '', '', '', '')
				.then(result => {
					if(!result) {
						this.logger.log_log(this.TAG, "changeEmail()", "The modification of data has failed");
						errorText = "The modification of your data has failed, please try again.";
						isFailed = true;
					}
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "changeEmail()", err);
					isFailed = true;
				});
			await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		}

		loading.dismiss();
		await this.logger.info_log(this.TAG, "changeEmail()", "End Method");
		if(!isFailed)
			return Promise.resolve();
		else
			return Promise.reject(errorText);
	}

	async getDataCustomer(hashedKey: string, clientID: string, siteID: string): Promise<{customerArray: any[]; playerCardArray: any[];}> {

		await this.logger.info_log(this.TAG, "getDataCustomer()", "Start Method");

		// Get Customer with his credentials
		//------------------------------------------------

		let loading = this.loadingCtrl.create({
			content: 'Get Customer ...',
			dismissOnPageChange: true
		});
		loading.present();

		var customerArray = new Array();
		var playerCardArray = new Array();
		var isFailed = false;

		await this.webservice._getCustomer(hashedKey, siteID, "customer", clientID, true)
			.then(result => {
				customerArray = result;
			})
			.catch(err => {
				this.logger.error_log(this.TAG, "getDataCustomer()", err);
				isFailed = true;
			});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);

		if(!isFailed) {
			await this.webservice._getPlayerCardsByClientID(hashedKey, clientID, true, true)
				.then(result => {
					playerCardArray = result;
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "getDataCustomer()", err);
					isFailed = true;
				});
			await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		}

		loading.dismiss();
		await this.logger.info_log(this.TAG, "getDataCustomer()", "End Method");
		if(!isFailed)
			return Promise.resolve({customerArray, playerCardArray});
		else
			return Promise.reject("Data Recovery Failed");
	}

	async logout(): Promise<any> {
		await this.logger.info_log(this.TAG, "logout()", "Start Method")

		var isOK = false;
		var error: string;

		await this.utils.alert_confirm({title: "Logout your account", message: "Do you want logout your account ?"})
			.then(result => {isOK = result; console.warn(result);} )
			.catch(err => error = err);

		if(isOK) {
			await this.deletePref();

			await this.logger.info_log(this.TAG, "logout()", "End Method");
			return Promise.resolve();
		} else {
			await this.logger.info_log(this.TAG, "logout()", "End Method");
			return Promise.reject("Logout failed or canceled");
		}
	}

	public async deletePref() {

		let keysArray: string[];
		await this.pref.keys()
			.then(resultArray => keysArray = resultArray);

		for(let key of keysArray) {
			if( ! (key == "IDENTIFIANT" || key == "SITE_ID" || key == "LANGUAGE")) {
				this.pref.remove(key);
				this.logger.log_log(this.TAG, "logout()", "Preference delete = " + key);
			}
		}
	}

}