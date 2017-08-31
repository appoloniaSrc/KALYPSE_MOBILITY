import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

import { WebServiceConfig  } from '../shared/config.service';
import { LoggerService } from './../../logger/logger.service';
import { Utils } from './../../utils/utils.service';

import { LanguageService } from '../../language/language.service';


//=============================================================================
// SOAPCLIENT Service

@Injectable()
export class SoapClientService {

	//=========================================================================
	// ATTRIBUTES
  	//=========================================================================
  
	TAG = "SoapClientService";

  	//=========================================================================
	// CONSTRUCTOR
	//=========================================================================

	constructor(
		private http: Http

		, public langService: LanguageService
		, private logger: LoggerService
		, private utils: Utils
	) {

	}

	//=========================================================================
	// FUNCTIONS
  	//=========================================================================

	//#############################################################################################################
	// WEB SERVICE OPERATIONS
	//#############################################################################################################

	public async createPostRequest(
        WSservice: WebServiceConfig
        , action: string
        , attributes: string
		, headers: Headers
		, delayTimeOut?: number
    ) {

		if(delayTimeOut == undefined)
			delayTimeOut = 5000;

        var body = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:' + WSservice.label + '="' + WSservice.targetNamespace + '">\n' +
                '\t<soapenv:Header/>\n' +
                '\t<soapenv:Body>\n' +
                    '\t\t<' + WSservice.label + ':' + action + '>\n' +
                        attributes +
                    '\t\t</' + WSservice.label + ':' + action + '>\n' +
                '\t</soapenv:Body>\n' +
			'</soapenv:Envelope>';

		let request = this.http.post(WSservice.UrlService, body, {	headers : headers })
			.timeout(delayTimeOut)
			.toPromise();
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		
		return request;
	}

	public async createGetRequest(
        WSservice: WebServiceConfig
        , action: string
		, headers: Headers
		, delayTimeOut?: number
    ) {

		if(delayTimeOut == undefined)
			delayTimeOut = 10000;

		let request = this.http.get(WSservice.UrlService + '/' + action, {	headers : headers })
			.timeout(5000)
			.toPromise()
			.catch(err => {
				this.logger.error_log(this.TAG, "createGetRequest()", err);
			});
		await this.utils.delay(this.logger.EVENT_WRITE_FILE);
		
		return request;
	}
}

//#############################################################################
// SOAP Client Parameters
//#############################################################################

export class SoapClientParameters {
	protected _pl = new Array();

	add(name: string, value: string): SoapClientParameters {
		this._pl[name] = value;
		return this;
	}

	toString(): string {
		var s = "";
        
		for (var p in this._pl) {
			s += p + ' = ' + this._pl[p];

			if(this._pl[p] != this._pl[this._pl.length-1])
				s += ', ';
        }
        
		return s;
	}

	toXml(webservice: WebServiceConfig): string {
        var xml = "";
        let wsLabel = webservice.label;
        
		for (var p in this._pl) {
			xml += '\t\t\t<' + wsLabel + ':' + p + '>' + this._pl[p] + '</' + wsLabel + ':' + p + '>\n';
        }
        
		return xml;
	}
}