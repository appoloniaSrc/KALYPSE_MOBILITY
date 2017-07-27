import { NgModule, Optional, SkipSelf } from '@angular/core';
import { IonicModule } from 'ionic-angular';

// Ionic providers
import { IonicStorageModule } from '@ionic/storage';

// App providers
import { AuthenticationWebService } from './../authentication/authentication.web.service';

import { ConfigService } from './shared/config.service';
import { WSPantheonService } from './shared/wspantheon.service';
import { SoapClientService } from './Soap/soap-client.service';
import { LanguagePipe } from '../language/language.pipe';
import { LanguageService } from '../language/language.service';

@NgModule({
	imports: [
		IonicModule,
		 IonicStorageModule.forRoot()
	],
	exports: [
		LanguagePipe
	],
	declarations: [
		LanguagePipe
	],
	providers: [
		ConfigService,
		AuthenticationWebService,
		LanguageService,
		WSPantheonService,
		SoapClientService
	]
})
export class WebserviceModule {

	constructor( @Optional() @SkipSelf() parentModule: WebserviceModule) {
		if (parentModule) {
			throw new Error(
				'CoreModule is already loaded. Import it in the AppModule only');
		}
	}
}
