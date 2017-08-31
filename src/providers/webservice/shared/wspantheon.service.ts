import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import {Md5} from 'ts-md5/dist/md5';
import * as xml2js from 'xml2js'

import 'rxjs/add/operator/toPromise';

import { SoapClientService, SoapClientParameters } from './../Soap/soap-client.service';
import { ConfigService } from './config.service';
import { LoggerService } from './../../logger/logger.service';
import { Utils, transfer_types_list } from './../../utils/utils.service';


@Injectable()
export class WSPantheonService {

	//=========================================================================
	// ATTRIBUTES
	//=========================================================================

    TAG = "WSPantheonService";

    USER_PANTHEON_LOGIN = "MOBILITY";
    USER_PANTHEON_PASS = "VnnijWE1nE5YoI4dzOEiNZQsaOHkcCc9";

    private delayRequestBurn = 40000;

	//=========================================================================
	// CONSTRUCTOR
	//=========================================================================

	constructor(
        private pref: Storage
        , private http: Http

        , private soapClient: SoapClientService
        , private config: ConfigService
        , private logger: LoggerService
        , private utils: Utils
	) {

    }

    //=========================================================================
	// METHODS
    //=========================================================================

    //#############################################################################################################
	// WEB SERVICE OPERATIONS
    //#############################################################################################################
    
    public async  _activeCustomerWebAccount(hashedKey: string, clientId: string): Promise<boolean> {

        var isActive = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/ActiveCustomerWebAccount"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("clientId", clientId);

        await this.logger.log_log(this.TAG, "_activeCustomerWebAccount()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "ActiveCustomerWebAccount", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            let dataResponse = this._getDataResponse(result.text(), "ActiveCustomerWebAccount");

            isActive = dataResponse[0] == "true" ? true : false;

        })
        .catch(err => {
            let error = this._catchError(err);

            this.logger.error_log(this.TAG, "_activeCustomerWebAccount()", error);
            return Promise.reject(error);
        });
        await await this.utils.delay(this.logger.EVENT_WRITE_FILE);

        return Promise.resolve(isActive);
    }
    
    public async  _loginIsExisting(hashedKey: string, login: string): Promise<boolean> {

        var isExisting = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/LoginIsExisting"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("login", login);

        await this.logger.log_log(this.TAG, "_loginIsExisting()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "LoginIsExisting", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            let dataResponse = this._getDataResponse(result.text(), "LoginIsExisting");
            
            isExisting = dataResponse[0] == "true" ? true : false;

        })
        .catch(err => {
            let error = this._catchError(err);

            this.logger.error_log(this.TAG, "_loginIsExisting()", error);
            return Promise.reject(error);
        });
        await this.utils.delay(this.logger.EVENT_WRITE_FILE);

        return Promise.resolve(isExisting);
    }

    public async _getVersion(): Promise<string> {

        var version = "";
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetVersion"');

        let attributes= new SoapClientParameters();

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetVersion", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            let dataResponse = this._getDataResponse(result.text(), "GetVersion");
            version = dataResponse.toString();

            isOK = version != undefined ? true : false, error = "Response data undefined";

        })
        .catch(err => {
            error = this._catchError(err);
        });

        if(isOK) {
            return Promise.resolve(version);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getVersion()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }
    
    public async  _getToken(): Promise<string> {

        var token = "";
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetToken"');

        let attributes = new SoapClientParameters();
        attributes.add("UserName", this.USER_PANTHEON_LOGIN);

        await this.logger.log_log(this.TAG, "_getToken()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetToken", attributes.toXml(this.config.PantheonService), headers)
            .then(result => {

                let dataArray = this._getDataResponse(result.text(), "GetToken")
                token = dataArray.toString();
    
                isOK = token != undefined ? true : false, error = "Response data undefined";

            })
            .catch(err => {
                error = this._catchError(err);
            });

        if(isOK) {
            return Promise.resolve(token);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getToken()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getSite(hashedKey: string, siteID: string): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getSite()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var siteArray = new Array();
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetSite"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("siteId", siteID);

        await this.logger.log_log(this.TAG, "_getSite()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetSite", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            let dataResponse = this._getDataResponse(result.text(), "GetSite");
            siteArray = dataResponse;

            isOK = siteArray != undefined ? true : false, error = "Response data undefined";

        })
        .catch(err => {
            error = this._catchError(err);
        });

        if(isOK) {
            return Promise.resolve(siteArray);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getSite()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }
 
    public async _getCustomer(hashedKey: string, siteID: string, typeID: string, idSearched: string, withPoints: boolean): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getCustomer()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var customerArray = new Array();
        var error = "";
        var isOK = true;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetCustomer"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("siteID", siteID);
        attributes.add("typeID", typeID);
        attributes.add("idSearched", idSearched);
        attributes.add("withPoints", withPoints.toString());

        await this.logger.log_log(this.TAG, "_getCustomer()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetCustomer", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            let dataResponse = this._getDataResponse(result.text(), "GetCustomer");
            customerArray = dataResponse;

            isOK = customerArray != undefined ? true : false, error = "Response data undefined";

        })
        .catch(err => {
            error = this._catchError(err);
        });

        if(isOK) {
            return Promise.resolve(customerArray);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getCustomer()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getCustomerByCredential(hashedKey: string, login: string, hashedPwd: string): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getCustomerByCredential()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var customerArray = new Array();
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetCustomerByCredential"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("login", login);
        attributes.add("passwordCrypted", hashedPwd);

        await this.logger.log_log(this.TAG, "_getCustomerByCredential()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetCustomerByCredential", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            let dataArray = this._getDataResponse(result.text(), "GetCustomerByCredential")
            customerArray = dataArray;

            isOK = customerArray[0]["a:ClientId"] != undefined ? true : false, error = "Response data undefined";

        })
        .catch(err => {
            error = this._catchError(err);
        });

        if(isOK) {
            return Promise.resolve(customerArray);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getCustomerByCredential()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getClientIDByCardNubmberID(hashedKey: string, cardNumberID: string): Promise<string> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getClientIDByCardNubmberID()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var clientID = "";
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetClientIDByCardNumberId"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("cardNumberId", cardNumberID);

        await this.logger.log_log(this.TAG, "_getClientIDByCardNubmberID()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetClientIDByCardNumberId", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            let dataResponse = this._getDataResponse(result.text(), "GetClientIDByCardNumberId");
            clientID = dataResponse.toString();

            isOK = clientID != undefined ? true : false, error = "Response data undefined";

        })
        .catch(err => {
            error = this._catchError(err);
        });

        if(isOK) {
            return Promise.resolve(clientID);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getClientIDByCardNubmberID()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getPlayerCardsByClientID(hashedKey: string, clientId: string, cardValid: boolean, cardCashless: boolean): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getPlayerCardsByClientID()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var playerCardArray = new Array();
        var error = "";
        var isOK = true;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetPlayerCardsByClientID"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("clientId", clientId);
        attributes.add("cardValid", cardValid.toString());
        attributes.add("cardCashless", cardCashless.toString());

        await this.logger.log_log(this.TAG, "_getPlayerCardsByClientID()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetPlayerCardsByClientID", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            let dataArray = this._getDataResponse(result.text(), "GetPlayerCardsByClientID")
            playerCardArray = dataArray;

            isOK = playerCardArray != undefined ? true : false, error = "Response data undefined";

        })
        .catch(err => {
            error = this._catchError(err);
        });

        if(isOK) {
            return Promise.resolve(playerCardArray[0]["a:cPlayerCards"]);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getPlayerCardsByClientID()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _SearchClient(hashedKey: string, name: string, firstname: string, birthday: string, clientID: string, nbCardEncoded: string): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_SearchClient()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var clientArray = new Array();
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/SearchClient"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("name", name);
        attributes.add("firstname", firstname);
        attributes.add("birthday", birthday);
        attributes.add("clientID", clientID);
        attributes.add("nbCardEncoded", nbCardEncoded);

        await this.logger.log_log(this.TAG, "_SearchClient()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "SearchClient", attributes.toXml(this.config.PantheonService), headers)
            .then(result =>{

                let dataArray = this._getDataResponse(result.text(), "SearchClient")
                clientArray = dataArray;
    
                isOK = clientArray != undefined ? true : false, error = "Response data undefined";

            })
            .catch(err => {
                error = this._catchError(err);
            });

        if(isOK) {
            return Promise.resolve(clientArray);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_SearchClient()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _updateCustomerPassword(hashedKey: string, clientId: string, hashedPwd: string): Promise<boolean> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_updateCustomerPassword()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var isUpdate = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/UpdateCustomerPassword"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("clientId", clientId);
        attributes.add("newPasswordCrypted", hashedPwd);

        await this.logger.log_log(this.TAG, "_updateCustomerPassword()", "Request Parameters : " + attributes.toString());


        await this.soapClient.createPostRequest(this.config.PantheonService, "UpdateCustomerPassword", attributes.toXml(this.config.PantheonService), headers)
            .then(result =>{

                let dataArray = this._getDataResponse(result.text(), "UpdateCustomerPassword")

                isUpdate = dataArray[0] != undefined ? true : false;

            })
            .catch(err => {
                let error = this._catchError(err);

                this.logger.error_log(this.TAG, "_updateCustomerPassword()", error);
                return Promise.reject(error);
            });
        await this.utils.delay(this.logger.EVENT_WRITE_FILE);

        return Promise.resolve(isUpdate);

    }

    public async _updateCustomer(hashedKey: string, siteId: string, clientId: string, civility: string, name: string
                , firstname: string, birthday: string, adress1: string, adress2: string, postcode: string
                , town: string, country: string, telephone: string, mobile: string, email: string
                , birthtown: string, birthcountry: string, job: string, language: string, currency: string
                , pseudo: string, isShownInternet: string, birthDpt: string, familySit: string, nationality: string): Promise<boolean> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_updateCustomer()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var isUpdate = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/UpdateCustomer"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("siteId", siteId);
        attributes.add("clientId", clientId);
        attributes.add("civility", civility);
        attributes.add("name", name);
        attributes.add("firstname", firstname);
        attributes.add("birthday", birthday);
        attributes.add("adress1", adress1);
        attributes.add("adress2", adress2);
        attributes.add("postcode", postcode);
        attributes.add("town", town);
        attributes.add("country", country);
        attributes.add("telephone", telephone);
        attributes.add("mobile", mobile);
        attributes.add("email", email);
        attributes.add("birthtown", birthtown);
        attributes.add("birthcountry", birthcountry);
        attributes.add("job", job);
        attributes.add("language", language);
        attributes.add("currency", currency);
        attributes.add("pseudo", pseudo);
        attributes.add("isShownInternet", isShownInternet);
        attributes.add("birthDpt", birthDpt);
        attributes.add("familySit", familySit);
        attributes.add("nationality", nationality);

        await this.logger.log_log(this.TAG, "_updateCustomer()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "UpdateCustomer", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            let dataResponse = this._getDataResponse(result.text(), "UpdateCustomer");

            isUpdate = dataResponse[0] != undefined ? true : false;

        })
        .catch(err => {
            console.error(err);
            let error = this._catchError(err);

            this.logger.error_log(this.TAG, "_updateCustomer()", error);
            return Promise.reject(error);
        });
        await this.utils.delay(this.logger.EVENT_WRITE_FILE);

        return Promise.resolve(isUpdate);
    }

    // DFT
    //-------------------------------------------------------------------------------------------------------------

    public async _getCashlessTransfertDFT(hashedKey: string, siteID: string, siteSlot: string,
        clientID: string, currentCreditsOnSlot: string, pinCode: string): Promise<any[]> {
       
       if(hashedKey == ""){
           // Add a new log error message of the exception
           await this.logger.error_log(this.TAG, "_getCashlessTransfertDFT()", "hashedKey empty");
           // Return Error Message
           return Promise.reject("hashedKey empty");
       }

       var cDFTTransfert = new Array();
       var error = "";
       var isOK = false;

       var headers = new Headers();
       headers.append('Content-Type', 'text/xml; charset=utf-8');
       headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetCashlessTransfertDFT"');

       let attributes = new SoapClientParameters();
       attributes.add("hashedKey", hashedKey);
       attributes.add("siteID", siteID);
       attributes.add("siteSlot", siteSlot);
       attributes.add("clientID", clientID);
       attributes.add("currentCreditsOnSlot", currentCreditsOnSlot);
       attributes.add("pinCode", pinCode);

       await this.logger.log_log(this.TAG, "_getCashlessTransfertDFT()", "Request Parameters : " + attributes.toString());

       await this.soapClient.createPostRequest(this.config.PantheonService, "GetCashlessTransfertDFT", attributes.toXml(this.config.PantheonService), headers)
       .then(result => {

        let dataResponse = this._getDataResponse(result.text(), "GetCashlessTransfertDFT");
        
        cDFTTransfert = dataResponse;
        isOK = cDFTTransfert != undefined ? true : false, error = "Response data undefined";

       })
       .catch(err => {
        error = this._catchError(err, transfer_types_list.get("cashless"));
       });

       if(isOK) {
           return Promise.resolve(cDFTTransfert);
       } else {
           // Add a new log error message of the exception
           await this.logger.error_log(this.TAG, "_getCashlessTransfertDFT()", error);
           // Return Error Message
           return Promise.reject(error);
       }

    }

    public async _canBurnCashlessByDFT(hashedKey: string, siteId: string, clientId: string, amountOfCashless: string,
        cardNumber: string, siteSlot: string, currentCreditsOnSlot: string, pinCode: string): Promise<any[]> {
       
       if(hashedKey == ""){
           // Add a new log error message of the exception
           await this.logger.error_log(this.TAG, "_getCashlessTransfertDFT()", "hashedKey empty");
           // Return Error Message
           return Promise.reject("hashedKey empty");
       }

       var isCanBurnCashless = new Array();
       var error = "";
       var isOK = false;

       var headers = new Headers();
       headers.append('Content-Type', 'text/xml; charset=utf-8');
       headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/CanBurnCashlessByDFT"');

       let attributes = new SoapClientParameters();
       attributes.add("hashedKey", hashedKey);
       attributes.add("siteId", siteId);
       attributes.add("clientId", clientId);
       attributes.add("amountOfCashless", amountOfCashless);
       attributes.add("cardNumber", cardNumber);
       attributes.add("siteSlot", siteSlot);
       attributes.add("currentCreditsOnSlot", currentCreditsOnSlot);
       attributes.add("pinCode", pinCode);

       await this.logger.log_log(this.TAG, "_getCashlessTransfertDFT()", "Request Parameters : " + attributes.toString());

       await this.soapClient.createPostRequest(this.config.PantheonService, "CanBurnCashlessByDFT", attributes.toXml(this.config.PantheonService), headers)
       .then(result => {

        let dataResponse = this._getDataResponse(result.text(), "CanBurnCashlessByDFT");
        
        isCanBurnCashless = dataResponse;
        isOK = isCanBurnCashless != undefined ? true : false, error = "Response data undefined";

       })
       .catch(err => {
        error = this._catchError(err, transfer_types_list.get("cashless"));
       });

       if(isOK) {
           return Promise.resolve(isCanBurnCashless);
       } else {
           // Add a new log error message of the exception
           await this.logger.error_log(this.TAG, "_getCashlessTransfertDFT()", error);
           // Return Error Message
           return Promise.reject(error);
       }

    }

    public async _burnCashlessByDFT(hashedKey: string, siteId: string, clientId: string, siteSlot: string, slotNumber: string,
        amountOfCashless: string, cardNumber: string, pinCode: string): Promise<any[]> {
   
       if(hashedKey == ""){
           // Add a new log error message of the exception
           await this.logger.error_log(this.TAG, "_burnCashlessByDFT()", "hashedKey empty");
           // Return Error Message
           return Promise.reject("hashedKey empty");
       }

       var cDFTTransaction = new Array();
       var error = "";
       var isOK = false;

       var headers = new Headers();
       headers.append('Content-Type', 'text/xml; charset=utf-8');
       headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/BurnCashlessByDFT"');

       let attributes = new SoapClientParameters();
       attributes.add("hashedKey", hashedKey);
       attributes.add("siteId", siteId);
       attributes.add("clientId", clientId);
       attributes.add("siteSlot", siteSlot);
       attributes.add("slotNumber", slotNumber);
       attributes.add("amountOfCashless", amountOfCashless);
       attributes.add("cardNumber", cardNumber);
       attributes.add("pinCode", pinCode);

       await this.logger.log_log(this.TAG, "_burnCashlessByDFT()", "Request Parameters : " + attributes.toString());

       await this.soapClient.createPostRequest(this.config.PantheonService, "BurnCashlessByDFT", attributes.toXml(this.config.PantheonService), headers, this.delayRequestBurn)
       .then(result => {

           let dataArray = this._getDataResponse(result.text(), "BurnCashlessByDFT")
           cDFTTransaction = dataArray;

           isOK = cDFTTransaction != undefined ? true : false, error = "Response data undefined";
       })
       .catch(err => {
           error = this._catchError(err, transfer_types_list.get("cashless"));
       });

       if(isOK) {
           return Promise.resolve(cDFTTransaction);
       } else {
           // Add a new log error message of the exception
           await this.logger.error_log(this.TAG, "_burnCashlessByDFT()", error);
           // Return Error Message
           return Promise.reject(error);
       }

   }

    public async _getLoyaltyPointsTransfertDFT(hashedKey: string, siteID: string, siteSlot: string,
        clientID: string, currentCreditsOnSlot: string): Promise<any[]> {
    
        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getLoyaltyPointsTransfertDFT()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var cLoyalyPointsTransfertDFTResponse = new Array();
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetLoyaltyPointsTransfertDFT"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("siteID", siteID);
        attributes.add("siteSlot", siteSlot);
        attributes.add("clientID", clientID);
        attributes.add("currentCreditsOnSlot", currentCreditsOnSlot);
        

        await this.logger.log_log(this.TAG, "_getLoyaltyPointsTransfertDFT()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetLoyaltyPointsTransfertDFT", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            let dataResponse = this._getDataResponse(result.text(), "GetLoyaltyPointsTransfertDFT");
            
            cLoyalyPointsTransfertDFTResponse = dataResponse;
            isOK = cLoyalyPointsTransfertDFTResponse != undefined ? true : false, error = "Response data undefined";

        })
        .catch(err => {
            error = this._catchError(err, transfer_types_list.get("loyaltyPoints"));
        });

        if(isOK) {
            return Promise.resolve(cLoyalyPointsTransfertDFTResponse);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getLoyaltyPointsTransfertDFT()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _canBurnLoyaltyPointsByDFT(hashedKey: string, siteId: string, clientId: string,  
         amountOfEurosLoyaltyPoints: string, cardNumber: string, siteSlot: string, currentCreditsOnSlot: string): Promise<any[]> {
    
        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_canBurnLoyaltyPointsByDFT()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var cPointsClient = new Array();
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/CanBurnLoyaltyPointsByDFT"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("siteId", siteId);
        attributes.add("clientId", clientId);
        attributes.add("amountOfEurosLoyaltyPoints", amountOfEurosLoyaltyPoints);
        attributes.add("cardNumber", cardNumber);
        attributes.add("siteSlot", siteSlot);
        attributes.add("currentCreditsOnSlot", currentCreditsOnSlot);

        await this.logger.log_log(this.TAG, "_canBurnLoyaltyPointsByDFT()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "CanBurnLoyaltyPointsByDFT", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            let dataResponse = this._getDataResponse(result.text(), "CanBurnLoyaltyPointsByDFT");

            cPointsClient = dataResponse;
            isOK = cPointsClient != undefined ? true : false, error = "Response data undefined";
        })
        .catch(err => {
            error = this._catchError(err, transfer_types_list.get("loyaltyPoints"));
        });

        if(isOK) {
            return Promise.resolve(cPointsClient);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_canBurnLoyaltyPointsByDFT()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _burnLoyaltyPointsByDFT(hashedKey: string, siteId: string, clientId: string, siteSlot: string, slotNumber: string,
         amountOfEurosLoyaltyPoints: string, cardNumber: string): Promise<any[]> {
    
        if(hashedKey == ""){
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_burnLoyaltyPointsByDFT()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var cDFTTransaction = new Array();
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/BurnLoyaltyPointsByDFT"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("siteId", siteId);
        attributes.add("clientId", clientId);
        attributes.add("siteSlot", siteSlot);
        attributes.add("slotNumber", slotNumber);
        attributes.add("amountOfEurosLoyaltyPoints", amountOfEurosLoyaltyPoints);
        attributes.add("cardNumber", cardNumber);

        await this.logger.log_log(this.TAG, "_burnLoyaltyPointsByDFT()", "Request Parameters : " + attributes.toString());

        await this.soapClient.createPostRequest(this.config.PantheonService, "BurnLoyaltyPointsByDFT", attributes.toXml(this.config.PantheonService), headers, this.delayRequestBurn)
        .then(result => {

            let dataArray = this._getDataResponse(result.text(), "BurnLoyaltyPointsByDFT")
            cDFTTransaction = dataArray;

            isOK = cDFTTransaction!= undefined ? true : false, error = "Response data undefined";
        })
        .catch(err => {
            error = this._catchError(err, transfer_types_list.get("loyaltyPoints"));
        });

        if(isOK) {
            return Promise.resolve(cDFTTransaction);
        } else {
            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_burnLoyaltyPointsByDFT()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    //#############################################################################################################
	// UTILS OPERATIONS
	//#############################################################################################################

    public async _getHashedKey(token: string): Promise<string> {

        try {

            if(token == ""){
                await this.logger.error_log(this.TAG, "_getHashedKey()", "token empty");
                return;
            }
                
            // Defined the value of the Hashed Key
            var hashedKey = "";

            // Username need to converted in Capital Letters
            var username = this.USER_PANTHEON_LOGIN.toUpperCase();

            // Generation of a Hasked Key need to be done in three steps
            // 1 : Concate the variables together (Username, Password and Token) with a Pipe separator
            // 2 : Hash the result with the MD5 algorithm
            // 3 : Concate the result and the Username with a Pipe separator

            // 1 : Concate the variables together (Username, Password and Token) with a Pipe separator
            hashedKey = username + "|" + this.USER_PANTHEON_PASS + "|" + token;

            // 2 : Hash the result with the MD5 algorithm
            hashedKey = Md5.hashStr(hashedKey).toString();

            // 3 : Concate the result and the Username with a Pipe separator
            hashedKey = hashedKey + "|" + username;

            // Return the Hashed Key
            return Promise.resolve(hashedKey);
            
        } catch (err) {

            // Add a new log error message of the exception
            await this.logger.error_log(this.TAG, "_getHashedKey()", err);
            // Return Error Message
            return Promise.reject(err);
        }
    }

    private _getDataResponse(jsonResponse: string, soapAction: string) {

        var jsonData = ""
        xml2js.parseString( jsonResponse, function (err, result) {
            jsonData = result;
        });

        var jsonString = JSON.stringify(jsonData, null, '\t');
        var json = JSON.parse(jsonString);
        json = json["s:Envelope"]["s:Body"][0][soapAction + "Response"][0][soapAction + "Result"];

        var arrayDataResult = undefined ? [] : Array.isArray(json) ? json : [json]

        //this.logger.log_complex_log(this.TAG, "_getDataResponse()", arrayDataResult);

        return arrayDataResult;
    }

    private _getErrorDataResponse(jsonResponse: string): {faultcode: string, faultstring: string} {

        var jsonData = ""
        xml2js.parseString( jsonResponse, function (err, result) {
            jsonData = result;
        });
        
        var jsonString = JSON.stringify(jsonData, null, '\t');
        var json = JSON.parse(jsonString);
        json = json["s:Envelope"]["s:Body"][0]["s:Fault"];

        console.log(json);

        var faultcode: string =  json[0]["faultcode"].toString();
        faultcode = faultcode.substr(2);
        var faultstring: string = json[0]["faultstring"][0]["_"];

        //this.logger.log_complex_log(this.TAG, "_getErrorDataResponse()", arrayDataResult);

        return {faultcode, faultstring};
    }

    private _catchError(resultError: any, typeTransfer?: number): string {

        var error: string;

        try {
            let dataResponse = this._getErrorDataResponse(resultError.text());
            error = "Fault Code : " + dataResponse.faultcode + " -----> " + "Fault Message : " + dataResponse.faultstring;
            if(typeTransfer != undefined)
                this.utils.alert_error(dataResponse.faultcode, dataResponse.faultstring, typeTransfer);
            else
                this.utils.alert_error_simple(dataResponse.faultstring);
        }
        catch(e) {
            error = resultError.toString();
            this.utils.alert_error_simple(error);
        }

        return error;
    }
}