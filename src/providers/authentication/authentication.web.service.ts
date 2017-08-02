import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConfigService } from '../webservice/shared/config.service';
import { WSPantheonService } from '../webservice/shared/wspantheon.service';
import { LoggerService } from './../logger/logger.service';


@Injectable()
export class AuthenticationWebService {

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
	) {

	}

	//=================================
	// METHODS
	//=================================


	//#############################################################################################################
	// WEB SERVICE OPERATIONS
	//#############################################################################################################

	private async authWebService_Token_Hashedkey() {

		this.logger.warn_log(this.TAG, "authWebService_Token_Hashedkey()", "method start");

		let loading = this.loadingCtrl.create({
			content: 'Authorization ...',
			dismissOnPageChange: true
		});
		loading.present();

		// Get Authorization with "token" and "hashed key" to access Webservice

		var token = "";
		var hashedKey = "";

		var isOK = true;

		await this.webservice._getToken()
			.then(result => {
				token = result.toString();
			})
			.catch(err => {
				this.logger.error_log(this.TAG, "checkUserCardNumIDAndBirth()", err);
				loading.dismiss();

				isOK = false;
			});
		
		this.logger.log_log(this.TAG, "authWebService_Token_Hashedkey()", "token = " + token);

		if(isOK)
		{
			await this.webservice._getHashedKey(token)
					.then(result => {
						loading.dismiss();
						hashedKey = result.toString();
					})
					.catch(err => {
						this.logger.error_log(this.TAG, "checkUserCardNumIDAndBirth()", err);
						loading.dismiss();
						isOK = false;
					});

			this.logger.log_log(this.TAG, "authWebService_Token_Hashedkey()", "hashedKey = " + hashedKey);
		}

		this.logger.warn_log(this.TAG, "authWebService_Token_Hashedkey()", "method end");
		return {isOK, hashedKey};
	}

	//=========================================================================
	// AUTHENTICATION
	//=========================================================================

	//TODO: login: asser login/pwd is const  / languageCode : set to '' OR use the config language code (eng,fra) ?
	async checkCustomerWithCredentials(userLogin: string, userPassword: string): Promise<any[]> {

		this.logger.warn_log(this.TAG, "checkCustomerWithCredentials()", "method start");

		// Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

		if(isOK)
		{
			// Get Customer with his credentials

			let loading = this.loadingCtrl.create({
				content: 'Check Customer ...',
				dismissOnPageChange: true
			});
			loading.present();

			var customerArray = new Array();

			await this.webservice._getCustomerByCredential(hashedKey, userLogin, userPassword)
				.then(result => {
					customerArray = result;
					loading.dismiss();
				})
				.catch(err => {
						this.logger.error_log(this.TAG, "checkCustomerWithCredentials()", err);
						loading.dismiss();
						return Promise.reject("Credentials False");
					});

			this.logger.warn_log(this.TAG, "checkCustomerWithCredentials()", "method end");
			return Promise.resolve(customerArray);
		} else {
			this.logger.warn_log(this.TAG, "checkCustomerWithCredentials()", "method end");
			return Promise.reject("Error at the authorization to access Webservice");
		}
	}

	async checkUserCardNumIDAndBirth(userCardNumID: string, userBirthhday: string): Promise<{clientID: string;}> {

		this.logger.warn_log(this.TAG, "checkUserCardNumIDAndBirth()", "method start");

		// Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";

		await this.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

		if(isOK)
		{
			// Check User Card Numero ID And Birthday
		
			let loading = this.loadingCtrl.create({
				content: 'Analyze of your data ...',
				dismissOnPageChange: true
			});
			loading.present();

			var clientID = "";
			var clientArray = new Array();

			await this.webservice._getClientIDByCardNubmberID(hashedKey, userCardNumID)
				.then(result => {
					clientID = result.toString();
				})
			.catch(err => {
					this.logger.error_log(this.TAG, "checkUserCardNumIDAndBirth()", err);
					loading.dismiss();
					return Promise.reject("Data False");
				});
			
			await this.webservice._SearchClient(hashedKey, "", "", userBirthhday, clientID, "")
				.then(result => {
					clientArray = result;
					loading.dismiss();
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "checkUserCardNumIDAndBirth()", err);
					loading.dismiss();
					return Promise.reject("Data False");
				});

			this.logger.warn_log(this.TAG, "checkUserCardNumIDAndBirth()", "method end");
			return Promise.resolve({clientID});
		} else {
			this.logger.warn_log(this.TAG, "checkUserCardNumIDAndBirth()", "method end");
			return Promise.reject("Error at the authorization to access Webservice");
		}
	}

	async changePassword(clientID: string, userPassword: string): Promise<any> {

		this.logger.warn_log(this.TAG, "changePassword()", "method start");

		// Get Authorization to access Webservice
		//------------------------------------------------

		var isOK: boolean;
		var hashedKey = "";
		await this.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

		if(isOK)
		{
			// Change Password
			//------------------------------------------------

			let loading = this.loadingCtrl.create({
				content: 'Change Password ...',
				dismissOnPageChange: true
			});
			loading.present();

			await this.webservice._updateCustomerPassword(hashedKey, clientID, userPassword)
				.then(() => {
					loading.dismiss();
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "changePassword()", err);
					loading.dismiss();
					return Promise.reject(err);	
				});

			this.logger.warn_log(this.TAG, "changePassword()", "method end");

			return Promise.resolve("Password change");
		} else {
			this.logger.warn_log(this.TAG, "changePassword()", "method end");
			return Promise.reject("Error at the authorization to access Webservice");
		}
	}

	async getDataCustomer(clientID: string, siteID: string): Promise<{customerArray: any[]; playerCardArray: any[];}> {

		this.logger.warn_log(this.TAG, "getDataCustomer()", "method start");

		// Get Authorization to access Webservice

		var isOK: boolean;
		var hashedKey = "";
		await this.authWebService_Token_Hashedkey()
			.then(result => {
				isOK = result.isOK;
				hashedKey = result.hashedKey;
			});

		if(isOK)
		{
			// Get Customer with his credentials

			let loading = this.loadingCtrl.create({
				content: 'Get Customer ...',
				dismissOnPageChange: true
			});
			loading.present();

			var customerArray = new Array();
			var playerCardArray = new Array();

			await this.webservice._getCustomer(hashedKey, siteID, "customer", clientID, true)
				.then(result => {
					customerArray = result;
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "getDataCustomer()", err);
					loading.dismiss();
					return Promise.reject(err);
				});

			await this.webservice._getPlayerCardsByClientID(hashedKey, clientID, true, true)
				.then(result => {
					playerCardArray = result;
					loading.dismiss();
				})
				.catch(err => {
					this.logger.error_log(this.TAG, "getDataCustomer()", err);
					loading.dismiss();
					return Promise.reject(err);
				});

			this.logger.warn_log(this.TAG, "getDataCustomer()", "method end");
			return Promise.resolve({customerArray, playerCardArray});
		} else {
			this.logger.warn_log(this.TAG, "getDataCustomer()", "method end");
			return Promise.reject("Error at the authorization to access Webservice");
		}
	}

	async logout(): Promise<any> {
		this.logger.warn_log(this.TAG, "logout()", "method start");

		var isOK = false;

		await this.pref.forEach((value, key, index) => {

			console.log(key);

			if(key != "IDENTIFIANT")
				this.pref.remove(key);

		}).then(() => { isOK = true });

		if(isOK) {
			this.logger.warn_log(this.TAG, "logout()", "method end");
			return Promise.resolve();
		} else {
			this.logger.warn_log(this.TAG, "logout()", "method end");
			return Promise.reject("Logout don't be execute");
		}
	}

	// checkSessionToken(token: string): Promise<any> {
	// 	this.logger.log("checkSessionToken()");

	// 	var params = new SoapClientParameters();
	// 	params.add("token", token).add("tokenToCheck", token).add("askInfoSession", true);

	// 	return this.soapClient.call_start(this.config.AuthService, "checkSessionToken", params);
	// }

}