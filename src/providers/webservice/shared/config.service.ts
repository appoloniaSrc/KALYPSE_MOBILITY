import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { LoggerService } from './../../logger/logger.service';
import { Utils } from './../../utils/utils.service';


export class WebServiceConfig {
	WSDLUrl: string = "";
	UrlService: string = "";
	label: string = "";
	targetNamespace: string = "";
	timeout_delay: number = 5000;
}

@Injectable()
export class ConfigService {

	//=========================================================================
	// ATTRIBUTES
	//=========================================================================

	TAG = "ConfigService";

	ApplicationCode = 'APPKTM';
	PantheonService: WebServiceConfig = null;

	siteId: string = "";
	ws_timeout: number = 5000;

	private _config_load_promise: Promise<any>;

	//=========================================================================
	// CONSTRUCTOR
	//=========================================================================

	constructor(
		public storage: Storage

		, private logger: LoggerService
		, private utils: Utils
	) {
		this.init_config();
		this.load_config();
	}

	//=========================================================================
	// FUNCTIONS
	//=========================================================================

	private init_config() {

		this.PantheonService = new WebServiceConfig();
		this.PantheonService.targetNamespace = "http://tempuri.org/";
		this.PantheonService.label = "panth";
		this.PantheonService.WSDLUrl = "http://192.168.140.3:8083/WSPantheon/WSPantheon.svc?wsdl";
		this.PantheonService.UrlService = "http://192.168.140.3:8083/WSPantheon/WSPantheon.svc";

	}

	load_config(): Promise<any> {

		if (this._config_load_promise) {
			// config already loaded or is loading
			return this._config_load_promise;
		}

		this._config_load_promise = Promise.resolve(null)
			// Site
			.then(() => this.storage.get('siteId'))
			.then(ret => {
				if (ret) {
					this.logger.log_log(this.TAG, "load_config()", "using siteId = " + ret);
					this.siteId = ret;
				}
			})
			// Web Services
			.then(() => this.storage.get('ws_pantheon_endpoint'))
			.then(ret => {
				if (ret) {
					this.logger.log_log(this.TAG, "load_config()", "using ws_pantheon_endpoint = " + ret);
					this.PantheonService.UrlService = ret;
				}
			})
			.then(() => this.storage.get('ws_timeout'))
			.then(ret => {
				if (ret) {
					this.logger.log_log(this.TAG, "load_config()", "using ws_timeout = " + ret);
					this.set_ws_timeout(parseInt(ret));
				}
			});

		setTimeout(function(){},this.logger.EVENT_WRITE_FILE);
		return this._config_load_promise;
	}

	set_ws_timeout(ws_timeout: number) {
		this.ws_timeout = ws_timeout;
		this.PantheonService.timeout_delay = this.ws_timeout;
	}

}