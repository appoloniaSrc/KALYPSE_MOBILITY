import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

import { WebServiceConfig  } from '../shared/config.service';
import { LoggerService } from './../../logger/logger.service';


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
	) {



	}

	//=========================================================================
	// FUNCTIONS
  	//=========================================================================

	//#############################################################################################################
	// WEB SERVICE OPERATIONS
	//#############################################################################################################

	public createPostRequest(
        WSservice: WebServiceConfig
        , action: string
        , attributes: string
        , headers: Headers
    ): Promise<any> {

        var body = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:' + WSservice.label + '="' + WSservice.targetNamespace + '">\n' +
                '\t<soapenv:Header/>\n' +
                '\t<soapenv:Body>\n' +
                    '\t\t<' + WSservice.label + ':' + action + '>\n' +
                        attributes +
                    '\t\t</' + WSservice.label + ':' + action + '>\n' +
                '\t</soapenv:Body>\n' +
			'</soapenv:Envelope>';

		return this.http.post(WSservice.UrlService, body, {	headers : headers })
			.timeout(5000)
			.toPromise()
			.catch(err => {
				this.logger.error_log(this.TAG, "createPostRequest()", err);
			});
        
	}

	public createGetRequest(
        WSservice: WebServiceConfig
        , action: string
        , headers: Headers
    ): Promise<any> {

		return this.http.get(WSservice.UrlService + '/' + action, {	headers : headers })
			.timeout(5000)
			.toPromise()
			.catch(err => {
				this.logger.error_log(this.TAG, "createGetRequest()", err);
			});
        
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

	toXml(webservice: WebServiceConfig): string {
        var xml = "";
        let wsLabel = webservice.label;
        
		for (var p in this._pl) {
			xml += '\t\t\t<' + wsLabel + ':' + p + '>' + this._pl[p] + '</' + wsLabel + ':' + p + '>\n';
        }
        
		return xml;
	}
}