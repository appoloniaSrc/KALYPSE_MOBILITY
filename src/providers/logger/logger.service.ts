import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { File, DirectoryEntry } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';


@Injectable()
export class LoggerService {

  //=========================================================================
	// ATTRIBUTES
  //=========================================================================
  
  TAG = "LoggerService";

  // Definded the time to wait for write into log file
  EVENT_WRITE_FILE = 500;

  // Definded the numbr of log files to use
	sPatternLogFileName  = "log";
  // Definded the numbr of log files to use
	iNbLogFiles = 5;
	// Defined the maximum size (octets) of each log files
  iSizeLogFile = 100000;

  // Definded the path of the external directory of the application
  dirPath: string;

  //=========================================================================
	// CONSTRUCTOR
	//=========================================================================

  constructor(
    private platform: Platform
    , private file: File
    , private emailComposer: EmailComposer
  ) {
    platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.dirPath = this.file.externalDataDirectory;
      }else if(this.platform.is('ios') || this.platform.is('windows')) {
        this.dirPath = this.file.syncedDataDirectory;
      }
    });
  }

  //=========================================================================
	// METHODS
  //=========================================================================

  //#########################################################################
  // METHODS LOG EMAIL
  //#########################################################################

  public async sendLogFiles() {

    let loggerObject = this;
    var attachmentFiles: string[];
    // var isOKtoSend = false;

    // this.emailComposer.isAvailable().then((available: boolean) =>{
    //   if(available) {
    //     console.log("ok for send !!!");
    //     isOKtoSend = true;
    //   } else {
    //     console.error("Send don't work");
    //   }
    // })
    // .catch(err => console.error(err));

    // if(isOKtoSend) {

      for(var i = 1; i <= this.iNbLogFiles - 1; i++){
        (function(){    // create a closure (new scope)
          var _i = i;   // make a local copy of `i` from the outer scope

          loggerObject.file.checkFile(loggerObject.dirPath, loggerObject.sPatternLogFileName + _i + ".log")
            .then(() => {
              attachmentFiles[_i] = loggerObject.dirPath + "/" + loggerObject.sPatternLogFileName + _i + ".log";
            });
        })();
      }

      await setTimeout(function() {}, 15000);
      console.log(attachmentFiles);

      let email = {
        to: 'lucasabadie.pro@gmail.com',
        attachments: attachmentFiles,
        subject: 'Files Logs',
        body: 'Voici les fichiers de logs de KTM !',
        isHtml: false
      };
      
      console.log(email);

      // Send a text message using default options
      this.emailComposer.open(email)
        .then(result => console.log(result))
        .catch(err => console.log(err));
    // }
  }

  //#########################################################################
  // METHODS LOG
  //#########################################################################

  // SIMPLE
  //-------------------------------------------------------------------------

  public log_log(classTAG: string, methodName: string, message: string) {
    let textLog = new Date().toISOString() + '\t|\t' + 'DEBUG' + '\t|\t' + 'Method : ' + classTAG + '.' + methodName + '\t|\t' + 'Message : "' + message + '".';
    console.log(textLog);

    this.file.resolveDirectoryUrl(this.dirPath)
      .then(dirEntry => {
        this.checkFileSize(dirEntry,this.sPatternLogFileName);
        this.writeFile(dirEntry, this.sPatternLogFileName, textLog, true);
      });
    
    return new Promise(resolve => setTimeout(resolve , this.EVENT_WRITE_FILE));
  }
  
  public info_log(classTAG: string, methodName: string, message: string) {
    let textLog = new Date().toISOString() + '\t|\t' + 'INFO' + '\t|\t' + 'Method : ' + classTAG + '.' + methodName + '\t|\t' + 'Message : "' + message + '".';
    console.info(textLog);

    this.file.resolveDirectoryUrl(this.dirPath)
      .then(dirEntry => {
        this.checkFileSize(dirEntry,this.sPatternLogFileName);
        this.writeFile(dirEntry, this.sPatternLogFileName, textLog, true);
      });
    
    return new Promise(resolve => setTimeout(resolve , this.EVENT_WRITE_FILE));
  }

  public warn_log(classTAG: string, methodName: string, message: string) {
    let textLog = new Date().toISOString() + '\t|\t' + 'WARN' + '\t|\t' + 'Method : ' + classTAG + '.' + methodName + '\t|\t' + 'Message : "' + message + '".';
    console.warn(textLog);
    
    this.file.resolveDirectoryUrl(this.dirPath)
      .then(dirEntry => {
        this.checkFileSize(dirEntry,this.sPatternLogFileName);
        this.writeFile(dirEntry, this.sPatternLogFileName, textLog, true);
      });
    
    return new Promise(resolve => setTimeout(resolve , this.EVENT_WRITE_FILE));
  }

  public error_log(classTAG: string, methodName: string, message: string) {
    let textLog = new Date().toISOString() + '\t|\t' + 'ERROR' + '\t|\t' + 'Method : ' + classTAG + '.' + methodName + '\t|\t' + 'Message : "' + message + '".';
    console.error(textLog);
    
    this.file.resolveDirectoryUrl(this.dirPath)
      .then(dirEntry => {
        this.checkFileSize(dirEntry,this.sPatternLogFileName);
        this.writeFile(dirEntry, this.sPatternLogFileName, textLog, true);
      });
    
    return new Promise(resolve => setTimeout(resolve , this.EVENT_WRITE_FILE));
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

  //#########################################################################
  // METHODS FILE
  //#########################################################################

  // Write into the Log File
  private writeFile(dirEntry: DirectoryEntry, fileName: string, dataString: string, isAppend: boolean) {
    // Creates a new file or returns the file if it already exists.
    this.file.getFile(dirEntry, fileName + "1.log", {create: true, exclusive: false})
      .then(fileEntry => {
        this.file.writeFile(dirEntry.nativeURL, fileName + "1.log", dataString + "\n", {append: isAppend, replace: false});
      })
      .catch(err => {
        console.log("Check File Error : " + err);
      });
  }

  private async checkFileSize(dirEntry: DirectoryEntry, fileName: string){

    let loggerObject = this;

    // Creates a new file or returns the file if it already exists.
    await this.file.getFile(dirEntry, fileName + "1.log", {create: false, exclusive: false})
      .then(fileEntry => {
        fileEntry.file(
          function success(fileLOG) {
            console.log("File size: " + fileLOG.size);

            // Allows to Increment the Log Files
            if(fileLOG.size > loggerObject.iSizeLogFile) {
              
              // Delete the Last Log File
              let removeLastFile = loggerObject.file.checkFile(loggerObject.dirPath, fileName + loggerObject.iNbLogFiles + ".log")
              .then(() => {
                loggerObject.file.removeFile(loggerObject.dirPath, fileName + loggerObject.iNbLogFiles + ".log");
              });

              setTimeout(removeLastFile, loggerObject.EVENT_WRITE_FILE);
              
              // Allows to Cross all Log Files in order to Increment them
              for(var i = loggerObject.iNbLogFiles - 1; i >= 1; i--){
                (function(){    // create a closure (new scope)
                  var _i = i;   // make a local copy of `i` from the outer scope

                  loggerObject.file.checkFile(loggerObject.dirPath, fileName + _i + ".log")
                    .then(() => {
                      loggerObject.file.copyFile(loggerObject.dirPath, fileName + _i + ".log", loggerObject.dirPath, fileName + (_i + 1) + ".log")
                        .then(() => {
                          loggerObject.file.removeFile(loggerObject.dirPath, fileName + _i + ".log");
                        });
                    });
                })();
              }
            }
          }
        , function fail(err) { console.log("Check Size Error : " + err); });
      });    
  }
}
