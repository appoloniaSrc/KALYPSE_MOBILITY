import { Injectable } from '@angular/core';

/*
  Generated class for the LoggerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoggerService {

  //=========================================================================
	// ATTRIBUTES
  //=========================================================================
  


  //=========================================================================
	// CONSTRUCTOR
	//=========================================================================

  constructor(

  ) {
    
  }

  //=========================================================================
	// FUNCTIONS
  //=========================================================================

  // SIMPLE
  //-------------------------------------------------------------------------

  public log_log(classTAG: string, methodName: string, message: string) {
    console.log(new Date().toISOString() + ' | ' + 'LOG' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : "' + message + '".');
  }
  
  public info_log(classTAG: string, methodName: string, message: string) {
    console.info(new Date().toISOString() + ' | ' + 'INFO' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : "' + message + '".');
  }

  public warn_log(classTAG: string, methodName: string, message: string) {
    console.warn(new Date().toISOString() + ' | ' + 'WARN' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : "' + message + '".');
  }

  public error_log(classTAG: string, methodName: string, message: string) {
    console.error(new Date().toISOString() + ' | ' + 'ERROR' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : ' + message + '.');
  }

  // COMPLEX
  //-------------------------------------------------------------------------

  public log_complex_log(classTAG: string, methodName: string, message: any) {
    console.log(new Date().toISOString() + ' | ' + 'LOG' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : ');
    console.log(message);
  }
  
  public info_complex_log(classTAG: string, methodName: string, message: any) {
    console.info(new Date().toISOString() + ' | ' + 'INFO' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : ');
    console.log(message);
  }

  public warn_complex_log(classTAG: string, methodName: string, message: any) {
    console.warn(new Date().toISOString() + ' | ' + 'WARN' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : ');
    console.log(message);
  }

  public error_complex_log(classTAG: string, methodName: string, message: any) {
    console.error(new Date().toISOString() + ' | ' + 'ERROR' + ' | ' + 'Method : ' + classTAG + '.' + methodName + ' | ' + 'Message : ');
    console.log(message);
  }
}
