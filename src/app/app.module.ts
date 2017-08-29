//======================================================================
// Angular providers
//======================================================================

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { File } from '@ionic-native/file';

//======================================================================
// Ionic providers
//======================================================================

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

//======================================================================
// App providers
//======================================================================

//**********************************************************************
// Pages Modules
//**********************************************************************

//Home pages modules
import { HomePageModule } from '../pages/ApplicationPages/HomePages/home/home.module';
import { JackpotsTabsPageModule } from './../pages/ApplicationPages/HomePages/Jackpots/jackpots-tabs/jackpots-tabs.module';
import { JackpotsTopdayPageModule } from './../pages/ApplicationPages/HomePages/Jackpots/jackpots-topday/jackpots-topday.module';
import { JackpotsTopmonthPageModule } from './../pages/ApplicationPages/HomePages/Jackpots/jackpots-topmonth/jackpots-topmonth.module';
import { JackpotsMachinePageModule } from './../pages/ApplicationPages/HomePages/Jackpots/jackpots-machine/jackpots-machine.module';
import { BarPageModule } from '../pages/ApplicationPages/HomePages/bar/bar.module';
import { InformationsPageModule } from '../pages/ApplicationPages/HomePages/informations/informations.module';

//Account pages modules
import { AccountPageModule } from '../pages/ApplicationPages/AccountPages/account/account.module';

//Settings pages modules
import { SettingsPageModule } from '../pages/ApplicationPages/SettingsPages/settings/settings.module';
import { HelpPageModule } from './../pages/ApplicationPages/SettingsPages/help/help.module';

//Transfert pages modules
import { TransfertPageModule } from '../pages/ApplicationPages/transfert/transfert.module';

//**********************************************************************
// Providers Modules
//**********************************************************************

import { CoreModule } from './../providers/core.module';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule
    , HttpModule
    , IonicModule.forRoot(MyApp)
    , IonicStorageModule.forRoot()

    , CoreModule

    , HomePageModule
    , AccountPageModule
    , SettingsPageModule
    , TransfertPageModule
    , JackpotsTabsPageModule
    , JackpotsTopdayPageModule
    , JackpotsTopmonthPageModule
    , JackpotsMachinePageModule
    , BarPageModule
    , InformationsPageModule
    , HelpPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar
    , SplashScreen
    , BarcodeScanner
    , EmailComposer
    , File
    , {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
