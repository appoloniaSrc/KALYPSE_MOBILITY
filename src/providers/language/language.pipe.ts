import { Pipe, PipeTransform } from '@angular/core';

import { LanguageCode } from './language.data';
import { LanguageService } from './language.service';

/*
 * Prints the text according the current or the specified language.
  * Usage:
 *   value | lang[:language]
 * Example:
 *   {{ 'WELCOME' | lang }} -> 'Welcome'
 *   {{ 'WELCOME' | lang:fr }} -> 'Bienvenue'
 */
@Pipe({
	name: 'lang',
	pure: false /* as the language may be changed by the user, we need to detect changes within the LanguageService */
})
export class LanguagePipe implements PipeTransform {

	constructor(
		private langService: LanguageService
	) {
	}

	transform(key: string, language?: LanguageCode) {

		return this.langService.get(key, language);
	}
}