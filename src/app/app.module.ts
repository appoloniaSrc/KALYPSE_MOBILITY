import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { HomePageModule } from '../pages/home/home.module';
import { AccountPageModule } from '../pages/account/account.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TransfertPageModule } from '../pages/transfert/transfert.module';
import { JackpotsTabsPageModule } from './../pages/jackpots-tabs/jackpots-tabs.module';
import { JackpotsTopdayPageModule } from './../pages/jackpots-topday/jackpots-topday.module';
import { JackpotsTopmonthPageModule } from './../pages/jackpots-topmonth/jackpots-topmonth.module';
import { JackpotsMachinePageModule } from './../pages/jackpots-machine/jackpots-machine.module';
import { BarPageModule } from '../pages/bar/bar.module';
import { InformationsPageModule } from '../pages/informations/informations.module';
import { HelpPageModule } from './../pages/help/help.module';

import { WebserviceModule } from './../providers/webservice/webservice.module';
import { Utils } from './../providers/utils/utils.service';
import { LoggerService } from '../providers/logger/logger.service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule
    ,HttpModule
    ,IonicModule.forRoot(MyApp)
    ,IonicStorageModule.forRoot()

    ,WebserviceModule

    ,HomePageModule
    ,AccountPageModule
    ,SettingsPageModule
    ,TransfertPageModule
    ,JackpotsTabsPageModule
    ,JackpotsTopdayPageModule
    ,JackpotsTopmonthPageModule
    ,JackpotsMachinePageModule
    ,BarPageModule
    ,InformationsPageModule
    ,HelpPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Utils,
    LoggerService
  ]
})
export class AppModule {}
