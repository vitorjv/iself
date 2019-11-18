import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController, NavController } from '@ionic/angular';
import { MesaService } from '../mesa/mesa.service';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {

  scanSubscription;
  ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];

  constructor(
    private qrScanner: QRScanner,
    public toastCtrl: ToastController,
    private mesaService: MesaService,
    private navController: NavController) { }

  ngOnInit() {
  }

  scan() {
    this.ionApp.style.display = 'none';
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          this.scanSubscription = this.qrScanner.scan().subscribe((text: string) => {
            this.mesaService.criarConta(text).then(
              resp => this.navController.navigateRoot(`mesa/${resp.id}`)
            );
          });
        } else {
          console.error('Permission Denied', status);
        }
      })
      .catch((e: any) => {
        console.error('Error', e);
      });
  }

  stopScanning() {
    (this.scanSubscription) ? this.scanSubscription.unsubscribe() : null;
    this.scanSubscription=null;
    this.ionApp.style.display = 'block';
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }

  async toast(text) {
    let toast = await this.toastCtrl.create({
      message: `${text}`,
      position: 'top',
      duration: 3000,
      closeButtonText: 'OK'
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.scan();
  }
  ionViewWillLeave() {
    this.stopScanning();
  }

}
