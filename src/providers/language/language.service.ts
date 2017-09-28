import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { lang_dictionary_list, lang_list, LanguageCode, LangConfig } from './language.data';
import { LoggerService } from './../logger/logger.service';

@Injectable()
export class LanguageService {

	private TAG = "LanguageService";

	private language_code_curr: string;

	//TODO: get it in conf ++ use local storage
	private language_code_preferred: LanguageCode = 'ENG';

	private dictionary_curr: Map<string, string>;

	constructor(
		public storage: Storage

		, private logger: LoggerService
	) {

	}

	ionViewDidLoad() {
		this.init();
	}

	private async init() {
		
		await this.logger.info_log(this.TAG, "init()", "Start Method");
	
		await setTimeout(
			this.storage.get('LANGUAGE')
				.then(val => { 
					if (val == null) 
						this.set_language(this.language_code_preferred);
					else
						this.set_language(val);
				})
		, this.logger.EVENT_WRITE_FILE);

		await this.logger.info_log(this.TAG, "init()", "End Method");
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

	get_language_code_preferred(): string {
		return this.language_code_preferred;
	}

	get_languages(): any[] {
		return lang_list;
	}

	async set_language(lang: LanguageCode) {

		this.language_code_curr = lang;
		this.dictionary_curr = lang_dictionary_list.get(lang);
		await this.storage.set('LANGUAGE', lang);

		await this.logger.info_log(this.TAG, "set_language()", "Set language : " + this.language_code_curr);
	}
}