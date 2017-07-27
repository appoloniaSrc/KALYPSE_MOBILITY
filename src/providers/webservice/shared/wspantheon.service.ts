import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import {Md5} from 'ts-md5/dist/md5';
import * as xml2js from 'xml2js'

import 'rxjs/add/operator/toPromise';

import { SoapClientService, SoapClientParameters } from './../Soap/soap-client.service';
import { ConfigService } from './config.service';
import { LoggerService } from './../../logger/logger.service';


@Injectable()
export class WSPantheonService {

	//=========================================================================
	// ATTRIBUTES
	//=========================================================================

    TAG = "WSPantheonService";

    USER_PANTHEON_LOGIN = "PANTHEON_LOYALTY";
    USER_PANTHEON_PASS = "Dlf62s5cgCSiCXfk1fa3EQ1g1jIgQo9N";

	//=========================================================================
	// CONSTRUCTOR
	//=========================================================================

	constructor(
        private pref: Storage
        , private http: Http

        , private soapClient: SoapClientService
        , private config: ConfigService
        , private logger: LoggerService
	) {

    }

    //=========================================================================
	// FUNCTIONS
    //=========================================================================

    //#############################################################################################################
	// WEB SERVICE OPERATIONS
	//#############################################################################################################
    
    public async _getVersion(): Promise<string> {

        var version = "";
        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/GetVersion"');

        let attributes= new SoapClientParameters();

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetVersion", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            this.logger.log_log(this.TAG, "_getVersion()", result.text());

            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "GetVersion")
            version = dataArray.toString();

            isOK = version != "" ? true : false, error = "Response data empty";

        })
        .catch(err => {
            error = err;
        });

        if(isOK) {
            return Promise.resolve(version);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getVersion()", error);
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

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetToken", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            this.logger.log_log(this.TAG, "_getToken()", result.text());

            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "GetToken")
            token = dataArray.toString();
            
            isOK = token != "" ? true : false, error = "Response data empty";

        })
        .catch(err => {
            error = err;
        });

        if(isOK) {
            return Promise.resolve(token);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getToken()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getSite(hashedKey: string, siteID: string): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getSite()", "hashedKey empty");
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

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetSite", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            this.logger.log_log(this.TAG, "_getSite()", result.text());
            
            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "GetSite")
            siteArray = dataArray;

            isOK = siteArray.length != 0 ? true : false, error = "Response data empty";

        })
        .catch(err => {
            error = err;
        });

        if(isOK) {
            return Promise.resolve(siteArray);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getSite()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getCustomer(hashedKey: string, siteID: string, typeID: string, idSearched: string, withPoints: boolean): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getCustomer()", "hashedKey empty");
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

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetCustomer", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            this.logger.log_log(this.TAG, "_getCustomer()", result.text());

            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "GetCustomer")
            customerArray = dataArray;

            isOK = customerArray[0]["a:ClientId"] ? true : false, error = "Response data empty";

        })
        .catch(err => {
            error = err;
        });

        if(isOK) {
            return Promise.resolve(customerArray);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getCustomer()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getCustomerByCredential(hashedKey: string, login: string, hashedPwd: string): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getCustomerByCredential()", "hashedKey empty");
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

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetCustomerByCredential", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            this.logger.log_log(this.TAG, "_getCustomerByCredential()", result.text());

            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "GetCustomerByCredential")
            customerArray = dataArray;

            isOK = customerArray[0]["a:ClientId"] ? true : false, error = "Response data empty";

        })
        .catch(err => {
            error = err;
        });

        if(isOK) {
            return Promise.resolve(customerArray);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getCustomerByCredential()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getClientIDByCardNubmberID(hashedKey: string, cardNumberID: string): Promise<string> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getClientIDByCardNubmberID()", "hashedKey empty");
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

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetClientIDByCardNumberId", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            this.logger.log_log(this.TAG, "_getClientIDByCardNubmberID()", result.text());

            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "GetClientIDByCardNumberId")
            clientID = dataArray.toString();

            isOK = clientID != "" ? true : false, error = "Response data empty";

        })
        .catch(err => {
            error = err;
        });

        if(isOK) {
            return Promise.resolve(clientID);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getClientIDByCardNubmberID()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _getPlayerCardsByClientID(hashedKey: string, clientId: string, cardValid: boolean, cardCashless: boolean): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getPlayerCardsByClientID()", "hashedKey empty");
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

        await this.soapClient.createPostRequest(this.config.PantheonService, "GetPlayerCardsByClientID", attributes.toXml(this.config.PantheonService), headers)
        .then(result => {

            this.logger.log_log(this.TAG, "_getPlayerCardsByClientID()", result.text());

            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "GetPlayerCardsByClientID")
            playerCardArray = dataArray;

            isOK = playerCardArray[0]["a:cPlayerCards"] ? true : false, error = "Response data empty";

        })
        .catch(err => {
            error = err;
        });

        if(isOK) {
            return Promise.resolve(playerCardArray[0]["a:cPlayerCards"]);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getPlayerCardsByClientID()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _updateCustomerPassword(hashedKey: string, clientId: string, hashedPwd: string): Promise<any> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_updateCustomerPassword()", "hashedKey empty");
            // Return Error Message
            return Promise.reject("hashedKey empty");
        }

        var error = "";
        var isOK = false;

        var headers = new Headers();
        headers.append('Content-Type', 'text/xml; charset=utf-8');
        headers.append('SOAPAction', '"' + this.config.PantheonService.targetNamespace + 'IWSPantheon/UpdateCustomerPassword"');

        let attributes = new SoapClientParameters();
        attributes.add("hashedKey", hashedKey);
        attributes.add("clientId", clientId);
        attributes.add("newPasswordCrypted", hashedPwd);


        await this.soapClient.createPostRequest(this.config.PantheonService, "UpdateCustomerPassword", attributes.toXml(this.config.PantheonService), headers).then(result =>{

            this.logger.log_log(this.TAG, "_updateCustomerPassword()", result.text());
            
            var sResultJson = ""
            xml2js.parseString( result.text(), function (err, result) {
                sResultJson = result;
            });

            let dataArray = this._getDataResponse(sResultJson, "UpdateCustomerPassword")
            let passwordChange = dataArray.toString();
            
            isOK = passwordChange != "" ? true : false, error = "Response data empty";

        })
        .catch(err => {
            this.logger.error_log(this.TAG, "_updateCustomerPassword()", err);
        });

        if(isOK) {
            return Promise.resolve();
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_updateCustomerPassword()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    public async _SearchClient(hashedKey: string, name: string, firstname: string, birthday: string, clientID: string, nbCardEncoded: string): Promise<any[]> {

        if(hashedKey == ""){
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_SearchClient()", "hashedKey empty");
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

        await this.soapClient.createPostRequest(this.config.PantheonService, "SearchClient", attributes.toXml(this.config.PantheonService), headers)
            .then(result =>{
                this.logger.log_log(this.TAG, "_SearchClient()", result.text());

                var sResultJson = "";
                xml2js.parseString( result.text(), function (err, result) {
                    sResultJson = result;
                });

                let dataArray = this._getDataResponse(sResultJson, "SearchClient");
                clientArray = dataArray;

                isOK = clientArray[0]["a:cClient"] ? true : false, error = "Response data empty";

            })
            .catch(err => {
                error = err;
            });

        if(isOK) {
            return Promise.resolve(clientArray);
        } else {
            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_SearchClient()", error);
            // Return Error Message
            return Promise.reject(error);
        }

    }

    //#############################################################################################################
	// UTILS OPERATIONS
	//#############################################################################################################

    public _getHashedKey(token: string): Promise<string> {

        try {

            if(token == ""){
                this.logger.error_log(this.TAG, "_getHashedKey()", "token empty");
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

            this.logger.log_log(this.TAG, "_getHashedKey()", "step1 : " + hashedKey);

            // 2 : Hash the result with the MD5 algorithm
            hashedKey = Md5.hashStr(hashedKey).toString();

            this.logger.log_log(this.TAG, "_getHashedKey()", "step2 : " + hashedKey);

            // 3 : Concate the result and the Username with a Pipe separator
            hashedKey = hashedKey + "|" + username;

            this.logger.log_log(this.TAG, "_getHashedKey()", "step3 : " + hashedKey);

            // Return the Hashed Key
            return Promise.resolve(hashedKey);
            
        } catch (err) {

            // Add a new log error message of the exception
            this.logger.error_log(this.TAG, "_getHashedKey()", err);
            // Return Error Message
            return Promise.reject(err);
        }
    }

    private _getDataResponse(jsonData: string, soapAction: string) {

        var jsonString = JSON.stringify(jsonData, null, '\t');
        var json = JSON.parse(jsonString);
        json = json["s:Envelope"]["s:Body"][0][soapAction + "Response"][0][soapAction + "Result"];

        var arrayDataResult = undefined ? [] : Array.isArray(json) ? json : [json]

        this.logger.log_complex_log(this.TAG, "_getDataResponse()", arrayDataResult);

        return arrayDataResult;
    }
}