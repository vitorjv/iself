import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Component } from '@angular/core';
import { AlertController, NavController, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  telaAtiva = 'cardapio';
  private scanSub: any;
  ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];

  constructor(private qrScanner: QRScanner,
    private alertController: AlertController,
    private authService: AuthService,
    public toastCtrl: ToastController,
    private route: Router,
    private menu: MenuController,
    private navController: NavController,
    public afAuth: AngularFireAuth) { }

  ionViewWillEnter() {
    this.redirecionarUsuarioNaoLogado();
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async redirecionarUsuarioNaoLogado() {
    const user = await this.isLoggedIn();
    if (!user) {
        this.logout();
    }
  }

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

  logout() {
    this.authService.logout()
      .then(resp => this.navController.navigateRoot('login'))
      .catch(error => console.log(error));
  }

  segmentChanged(event) {
    this.telaAtiva = event;
  }

  get nomeApp() {
    return 'iSelf';
  }

  lerQrCode() {
    this.route.navigateByUrl('qr-scanner');
  }

}
