import { NgModule } from '@angular/core';

// Ionic providers

// App providers
import { Utils } from './utils/utils.service';
import { LoggerService } from './logger/logger.service';

import { LanguagePipe } from './language/language.pipe';
import { LanguageService } from './language/language.service';
import { ErrorCaseService } from './error-case/error-case.service';


// App modules
import { WebserviceModule } from './webservice/webservice.module';

@NgModule({
    declarations: [
        LanguagePipe
    ],
    exports: [
        LanguagePipe
    ],
	imports: [
        WebserviceModule
	],
	providers: [
		LanguageService
        , Utils
        , LoggerService
        , ErrorCaseService
	]
})
export class CoreModule {}
