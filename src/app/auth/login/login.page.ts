import { Component, OnInit } from '@angular/core';
import { faCoffee, faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = faUserCircle;
  back = faArrowLeft;
  errorMessage: string;
  emailNaoVerificado = false;
  carregando = false;

  constructor(private authService: AuthService,
              private navController: NavController,
              public toastController: ToastController,
              public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  login(form) {
    this.carregando = true;
    this.authService.signInWithEmail(form)
      .then(resp => this.onSucesso(resp))
      .catch(error => this.handleErro(error));
  }

  enviarEmailRecuperacao() {
    this.authService.sendVerificationMail()
    .then(() => {
      this.toastEmailVerificacao();
    })
    .catch(error => {
      this.handleErro(error);
    })
    .finally(() => {
      this.emailNaoVerificado = false;
      this.errorMessage = null;
    });
  }

  onSucesso(resp) {
    this.carregando = false;
    if (!resp.user.emailVerified) {
      this.errorMessage = 'Você deve verificar seu e-mail antes de entrar.';
      this.emailNaoVerificado = true;
      return;
    }
    if (resp.operationType === 'signIn') {
      this.navController.navigateRoot('home');
    }
  }

  handleErro(erro: FireError) {
    this.carregando = false;
    if (erro.code.includes('invalid-email')) {
      this.errorMessage = erro.message;
    }
    if (erro.code.includes('user-not-found')) {
      this.errorMessage = erro.message;
    }
    if (erro.code.includes('wrong-password')) {
      this.errorMessage = erro.message;
    }
  }

  async toastEmailVerificacao() {
    const toast = await this.toastController.create({
      message: 'Verifique seu endereço de e-mail para ativar o cadastro.',
      duration: 3000
    });
    toast.present();
  }

}
