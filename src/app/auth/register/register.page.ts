import { Component, OnInit } from '@angular/core';
import { faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  carregando = false;
  user = faUserCircle;
  back = faArrowLeft;
  erros = {
    nome: null, cpf: null, email: null, password: null
  };
  constructor(private authService: AuthService,
              public navController: NavController) { }

  ngOnInit() {
  }

  registrar(form) {
    this.carregando = true;
    this.erros = {
      nome: null, cpf: null, email: null, password: null
    };
    if (this.validNome(form.value.nome) && this.validCpf(form.value.cpf)) {
      this.authService.register(form)
        .then(resp => this.onSucesso(resp))
        .catch(error => this.handleErro(error));
    } else {
      this.carregando = false;
    }
  }

  validNome(nome: string) {
    return true;
  }

  validCpf(cpf: number) {
    return true;
  }

  onSucesso(resp) {
    this.carregando = false;
    this.authService.sendVerificationMail()
      .then(() => this.navController.navigateRoot('registered'))
      .catch(error => this.handleErro(error));
  }

  handleErro(erro: FireError) {
    this.carregando = false;
    if (erro.code.includes('email')) {
      this.erros.email = erro.message;
    }
    if (erro.code.includes('password')) {
      this.erros.password = erro.message;
    }
  }

}
