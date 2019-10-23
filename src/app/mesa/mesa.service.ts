import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(private db: AngularFirestore) {
  }

  listar(tipo: string) {
    return this.db.collection('itens', ref => ref.where('tipo', '==', tipo)).valueChanges();
  }
  

}
