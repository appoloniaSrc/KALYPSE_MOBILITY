import { Injectable } from '@angular/core';
import { LoggerService } from './../logger/logger.service';

export const error_dictionary_list = new Map<string, string>([
  [ "102", "TRANSFER_LIMIT_EXCEEDED" ],
  [ "1000", "NOT_AUTHORIZED" ],
  [ "4002", "DFT_TRANSFER_FAILED" ],
  [ "4018", "INVALID_REQUEST_IDENTIFIER" ],
  [ "5000", "LAST_LOYALTY_POINTS_BURN_FAILED" ],
  [ "5001", "AMOUNT_REQUESTED_NOT_AVAILABLE" ],
  [ "5002", "SLOT_MACHINE_DFT_NOT_PROMO" ],
  [ "5003", "CASH_DESK_NOT_DEFINED_FOR_DFT" ],
  [ "5004", "NO_CASHLESS_ACCOUNT_SITE_VALID" ],
  [ "5005", "SLOT_MACHINE_NOT_PROMO" ],
  [ "5006", "SLOT_MACHINE_NOT_CASHLESS" ]
]);

@Injectable()
export class ErrorCaseService {

  //=========================================================================
	// ATTRIBUTES
  //=========================================================================
  
  TAG = "ErrorCaseService";

  //=========================================================================
	// CONSTRUCTOR
	//=========================================================================

  constructor(
    private logger: LoggerService
  ) {

  }

  //=========================================================================
	// METHODS
  //=========================================================================

  get(key: string): string {
    
    let value = error_dictionary_list.get(key);
    if (value == undefined) {
      this.logger.error_log(this.TAG, "get()" ,"entry not found in error dictionary: '" + key + "'.");
      value = key;
    }
    return value;
  }

}
