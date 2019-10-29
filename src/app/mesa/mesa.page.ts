import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MesaService } from './mesa.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  constructor(public route: ActivatedRoute, private loadingController: LoadingController, private router: Router, private service: MesaService) { }

  ngOnInit() {
    const contaId = this.route.snapshot.params['conta'];
    this.criarRestaurante(contaId);
  }

  async criarRestaurante(contaId: string) {
    const loading = await this.loadingController.create({
    });
    await loading.present();
    this.service.acessarConta(contaId).then(
      resp => {
        loading.dismiss();
        this.router.navigateByUrl(`mesa/${contaId}/cardapio`);
      }
    );
  }

  get qtdItensConta() {
    return this.service.getQuantidadeItensConta();
  }

}
 