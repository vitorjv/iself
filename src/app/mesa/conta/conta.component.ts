import { Component, OnInit } from '@angular/core';
import { MesaService } from '../mesa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss'],
})
export class ContaComponent implements OnInit {

  itensPedidos = [];
  taxaDeServico = false;

  constructor(private service: MesaService,
    private router: Router) { }

  ngOnInit() {
    this.getPedidosRealizados();
  }

  getPedidosRealizados() {
    this.service.listarConta().subscribe(
      resp => {
        const pedidosAgrupados = this.groupBy(resp.map(
          function (pedido) {
            return {
              quantidade: pedido.quantidade,
              item: {
                descricao: pedido.item.descricao,
                preco: pedido.item.preco
              }
            }
          }
        ));
        const itensPedidos = [];
        for (var prop in pedidosAgrupados) {
          if (Object.prototype.hasOwnProperty.call(pedidosAgrupados, prop)) {
            itensPedidos.push(pedidosAgrupados[prop]);
          }
        }
        this.itensPedidos = itensPedidos.map(
          function (vetor) {
            return {
              item: vetor[0]['item'],
              quantidade: vetor.reduce((a, b) => a + (b.quantidade || 0), 0)
            };
          }
        );
      });
  }

  groupBy(vetor) {
    return vetor.reduce(function (rv, x) {
      (rv[x["item"]["descricao"]] = rv[x["item"]["descricao"]] || []).push(x);
      return rv;
    }, {});
  };

  pagarConta() {
    this.service.pagarConta();
    this.router.navigateByUrl('/home');
  }

  get restaurante() {
    if (this.service && this.service.restaurante)
      return this.service.restaurante;

    return 'Carregando ...'
  }

  get totalConta() {
    return (this.itensPedidos.reduce((a, b) => a + (b.quantidade * b.item.preco || 0), 0) * (this.taxaDeServico ? 1.1 : 1)).toFixed(2);
  }

}
