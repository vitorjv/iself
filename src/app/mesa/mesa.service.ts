import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pedido, Conta, Restaurante } from '../model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private contaRef: DocumentReference;
  private restauranteRef: DocumentReference;
  public conta: DocumentData;
  public restaurante: DocumentData;

  constructor(private db: AngularFirestore) {
  }

  criarConta(idRestaurante: string) {
    this.restauranteRef = this.db.collection('restaurantes').doc(idRestaurante).ref;
    this.restauranteRef.get().then(
      resp => this.restaurante = resp.data()
    )
    const novaConta = {
      restaurante: this.restauranteRef,
      usuario: null,
      dataAbertura: new Date()
    }

    return this.db.collection('contas').add(novaConta);
  }

  acessarConta(idConta: string) {
    this.contaRef = this.db.collection('contas').doc(idConta).ref;
    return this.contaRef.get().then(resp => {
      this.conta = resp.data();
      this.restauranteRef = this.conta.restaurante;
      this.restauranteRef.get().then(resp => {
        this.restaurante = resp.data();
        return true;
      });
    }).catch(() => false);
  }

  listarItens(tipo: string = null): Observable<any> {
    if (!this.restauranteRef) {
      this.contaRef.get().then(resp => {
        this.conta = resp.data();
        this.restauranteRef = this.conta.restaurante;
      });
    }
    if (!tipo)
      return this.db.collection('itens', ref => ref.where('restaurante', '==', this.restauranteRef)).valueChanges();

    return this.db.collection('itens', ref => ref.where('tipo', '==', tipo).where('restaurante', '==', this.restauranteRef)).valueChanges();
  }

  fazerPedido(pedido: Pedido): Promise<any> {
    pedido.conta = this.contaRef;

    return this.db.collection('pedidos').add(Object.assign({}, pedido));
  }

  getQuantidadeItensConta() {
    return 0;
    // this.db.collection('pedidos', ref => ref.where('conta', '==', this.contaRef)).get().subscribe(
    //   resp => {
    //     return resp.size + 1;
    //   }
    // );
  }

  listarConta(): Observable<any> {
    return this.db.collection('pedidos', ref => ref.where('conta', '==', this.contaRef)).valueChanges();
  }

  pagarConta() {
    return this.db.collection('pedidos', ref => ref.where('conta', '==', this.contaRef)).get().subscribe(
      resp => {
        resp.forEach(doc => {
          doc.ref.delete();
        });
      }
    );
  }

}
