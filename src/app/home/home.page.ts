import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Component } from '@angular/core';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  telaAtiva = 'cardapio';

  constructor(private qrScanner: QRScanner,
    private alertController: AlertController,
    private authService: AuthService,
    private menu: MenuController,
    private navController: NavController) { }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  async solicitarAutorizacao() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'Você precisa autorizar o leitor de QR Code do seu celular',
      buttons: ['Cancelar', 'OK']
    });

    await alert.present();
  }

  leitorQrCode() {

    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });
        } else if (status.denied) {

          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  logout() {
    this.authService.logout()
      .then(resp => this.navController.navigateRoot('login'))
      .catch(error => console.log(error));
  }

  segmentChanged(event) {
    this.telaAtiva = event;
  }
}
