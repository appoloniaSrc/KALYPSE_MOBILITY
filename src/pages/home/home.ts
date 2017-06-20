import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, Slides } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
 
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //=================================
	// ATTRIBUTES
	//=================================

  TAG = "HomePage";

  @ViewChild(Slides) slides: Slides;
  slidesNumber : any;

  isScannedEGM : any;
  
  results: {};
  
  username = '';
  email = '';

  //=================================
	// CONSTRUCTOR
	//=================================

  constructor (
    private nav: NavController
    ,private auth: AuthenticationProvider
    ,private barcode: BarcodeScanner
  ) {

    this.isScannedEGM = false;

  }

  //=================================
	// METHODS
	//=================================

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage')
    });
  }

  async scan()
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
}