import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, Slides } from 'ionic-angular';
//import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
 
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  TAG = "HomePage";

  @ViewChild(Slides) slides: Slides;
  slidesNumber : any;

  //options : BarcodeScannerOptions;
  results: {};
  
  username = '';
  email = '';
  constructor(private nav: NavController, private auth: AuthenticationProvider /*, private barcode: BarcodeScanner*/) {
    /*let info = this.auth.getUserInfo();
    this.username = info['name'];
    this.email = info['email'];*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    //document.getElementById("test").focus();
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage')
    });
  }

  /*async scan()
  {
     await this.barcode.scan().then((barcodeData) => {
        // Success! Barcode data is here
        this.results = barcodeData;
        console.log(this.results);
    }, (err) => {
        // An error occurred
        console.log(err);
    });
  }

  async encodeData()
  {
    const results = await this.barcode.encode(this.barcode.Encode.TEXT_TYPE, "https://lucasabadie.fr/");
  }*/

  public fullscreen() {
    if (!document.fullscreenElement &&    // alternative standard method
          !document.webkitFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }

      console.log("fullscreenEnabled = " + document.fullscreenEnabled);
      console.log("fullscreenElement = " + document.fullscreenElement);
      console.log("webkitFullscreenEnabled = " + document.webkitFullscreenEnabled);
      console.log("webkitIsFullScreen = " + document.webkitIsFullScreen);
      console.log("webkitFullscreenElement = " + document.webkitFullscreenElement);
  }
}