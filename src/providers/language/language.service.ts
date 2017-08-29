import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { lang_dictionary_list, lang_list, LanguageCode, LangConfig } from './language.data';

@Injectable()
export class LanguageService {


	private language_code_curr: LanguageCode;

	//TODO: get it in conf ++ use local storage
	private language_code_preferred: LanguageCode = 'ENG';

	private dictionary_curr: Map<string, string>;

	constructor(
		public storage: Storage
	) {
		this.storage.get('LANGUAGE')
			.then(val => { if (!val) throw new Error(); this.set_language(val) })
			.catch(() => this.set_language(this.language_code_preferred));
	}

	get(key: string, language?: LanguageCode): string {

		let dict = language ? lang_dictionary_list.get(language) : this.dictionary_curr;
		let value = dict.get(key);
		if (value == undefined) {
			console.error("entry not found in '" + dict + "' dictionary: '" + key + "'");
			value = key;
		}
		return value;
	}

	get_language_codes(): Array<string> {

		return Array.from(lang_dictionary_list.keys());
	}

	get_current_language(): LangConfig {
		return lang_list.find(l => l.code == this.language_code_curr);
	}

	get_languages(): any[] {
		return lang_list;
	}

	set_language(lang: LanguageCode): void {

		this.language_code_curr = lang;
		this.dictionary_curr = lang_dictionary_list.get(lang);
		console.log('set_language ' + this.language_code_curr);
		console.log(this.dictionary_curr);
	}
}