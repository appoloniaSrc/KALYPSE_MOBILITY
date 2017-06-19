import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { MyApp } from './app.component';

import { HomePageModule } from '../pages/home/home.module';
import { AccountPageModule } from '../pages/account/account.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TransfertPageModule } from '../pages/transfert/transfert.module';

import { AuthenticationProvider } from '../providers/authentication/authentication';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule
    ,HttpModule
    ,IonicModule.forRoot(MyApp)

    ,HomePageModule
    ,AccountPageModule
    ,SettingsPageModule
    ,TransfertPageModule
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
    AuthenticationProvider
  ]
})
export class AppModule {}
