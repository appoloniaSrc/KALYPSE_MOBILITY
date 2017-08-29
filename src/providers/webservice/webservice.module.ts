import { NgModule } from '@angular/core';

// Ionic providers

// App providers
import { AuthentificationWebService } from './../authentification/authentification.web.service';
import { DftService } from './../dft/dft.service';

import { ConfigService } from './shared/config.service';
import { WSPantheonService } from './shared/wspantheon.service';
import { SoapClientService } from './Soap/soap-client.service';

@NgModule({
	imports: [

	],
	providers: [
		ConfigService
		, AuthentificationWebService
		, DftService
		, WSPantheonService
		, SoapClientService
	]
})
export class WebserviceModule {}
