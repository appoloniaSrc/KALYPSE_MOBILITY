import { TransfertPage } from './../pages/transfert/transfert';
import { Component, ViewChild } from '@angular/core';

import { Platform, Nav, AlertController, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { SettingsPage } from '../pages/settings/settings';
 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  TAG = "MyApp";
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'LoginPage';

  pages: Array<{title: string, component: any}>;

  solde = "120.00"
  resultsScan : any;
 
  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private barcode: BarcodeScanner, private alertCtrl: AlertController) {

    let self = this;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
      window.addEventListener("orientationchange", function(){
        console.log("MyApp ---> constructor (window event listener orientationchange) : orientation = '" + window.orientation + "'.");
      });

      platform.registerBackButtonAction(function(event) {
        let nav = self.nav;
        if(nav.getActive().component.name == "HomePage" || nav.getActive().component.name == "LoginPage"){
          let alert = self.alertCtrl.create({
            title: 'Quit',
            message: 'Do you want to quit this application?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'OK',
                handler: () => {
                  console.log('OK clicked');
                  self.platform.exitApp();
                }
              }
            ]
          });
          alert.present();
        }
        else {
          nav.setRoot(HomePage);
        }
      })
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
      ,{ title: 'Account', component: AccountPage }
      ,{ title: 'Settings', component: SettingsPage }
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
  }

  async scan()
  {
    if(this.platform.is('ios') || this.platform.is('android') || this.platform.is('windows')){
      await this.barcode.scan().then((barcodeData) => {
          // Success! Barcode data is here
          this.resultsScan = barcodeData;
          console.log(this.resultsScan);

          if(this.resultsScan.text != "")
            this.showPrompt();

      }, (err) => {
          // An error occurred
          console.log(err);
          this.showAlert("Scan QRCode", 
                  "Error scan : " + err);
      });
    }
    else
      this.showAlert("Error", "Scan not avaible for this platform.");

    //this.nav.push(TransfertPage);
  }

  private showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK'],
      cssClass: 'alertPopup'
    });
    alert.present();
  }

  public showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Transfert',
      subTitle: "Enter your pin code to use your cashless account",
      inputs: [
        {
          name: 'Pin',
          placeholder: 'Enter your pin code',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.nav.push(TransfertPage);
          }
        }
      ],
      enableBackdropDismiss: false,
      cssClass: 'alertPrompt'
    });
    prompt.present();
  }

}