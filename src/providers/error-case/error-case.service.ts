import { Injectable } from '@angular/core';
import { LoggerService } from './../logger/logger.service';

export const error_dictionary_list = new Map<string, string>([
  
]);

export const error_loyaltypoints_dictionary_list = new Map<string, string>([
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

export const error_cashless_dictionary_list = new Map<string, string>([
  [ "1000", "BAD_PARAMETERS" ],
  [ "1001", "SITE_NOT_CASHLESS" ],
  [ "1002", "ASSET_NOT_AUTHORIZED" ],
  [ "1003", "UNKNOWN_REASON" ],
  [ "1004", "DATABASE_ERROR" ],
  [ "1005", "NETWORK_ERROR" ],
  [ "1006", "OPERATION_NOT_AUTHORIZED" ],
  [ "1007", "CHALLENGE_FAILED" ],
  [ "1008", "SITE_NOT_CONFIGURED" ],
  [ "2002", "ACCOUNT_SUSPENDED" ],
  [ "3000", "CODE_PIN_FAILED" ],
  [ "3001", "UNKNOWN_SESSION" ],
  [ "3002", "SESSION_NOT_ANTHORIZED" ],
  [ "3003", "AMOUNT_REQUESTED_IS_NOT_AVAILABLE" ],
  [ "3004", "UNKNOWN_TRANSACTION" ],
  [ "3005", "SESSION_EXPIRED" ],
  [ "3006", "TRANSACTION_NOT_AUTHORIZED" ],
  [ "3007", "TRANSACTION_EXPIRED" ],
  [ "3008", "CARD_NOT_AUTHORIZED" ],
  [ "3009", "UNKNOWN_CARD" ],
  [ "3010", "DUPLICATE_CARD" ],
  [ "4000", "DUPLICATE_ACCOUNT" ],
  [ "4001", "ACCOUNT_WITHOUT_CUSTOMER" ],
  [ "5001", "TRANSACTION_ALREADY_COMMITTED_OR_CANCELED" ],
  [ "5002", "AUTO_CREDIT_FAILED" ],
  [ "5003", "CLIENT_ANPR_PROCESSUS_CANCELED" ],
  [ "5004", "CLIENT_BARRED_PROCESSUS_CANCELED" ],
  [ "5005", "NO_CARD_VALID" ]
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

  getErrorTransfer(key: string, typeTransfer: number): string {
    
    let value: string;

    if(typeTransfer == 0)
      value = error_loyaltypoints_dictionary_list.get(key);
    if(typeTransfer == 1)
      value = error_cashless_dictionary_list.get(key);

    if (value == undefined) {
      this.logger.error_log(this.TAG, "get()" ,"entry not found in error dictionary: '" + key + "'.");
      value = key;
    }
    return value;
  }

  getError(key: string): string {
    
    let value: string;

    value = error_dictionary_list.get(key);
    
    if (value == undefined) {
      this.logger.error_log(this.TAG, "get()" ,"entry not found in error dictionary: '" + key + "'.");
      value = key;
    }
    return value;
  }

}
