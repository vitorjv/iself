import { DocumentReference } from '@angular/fire/firestore';

export class FireError {
    code: string;
    message: string;
}

export class Restaurante {
    codigo: string;
    nome: string;
}

export class Item {
    descricao: string;
    preco: number;
    quantidade: number;
    restaurante: DocumentReference;
    tipo: string;
    imagem: string;
    info: string;
}

export class Pedido {
    item: Item;
    quantidade: number;
    status: string;
    dataHora: Date;
    conta: DocumentReference;
}

export class Conta {
    restaurante: DocumentReference;
    usuario: string;
    dataAbertura: Date;
    dataEncerramento: Date;
}

export class Pagamento {
    conta: DocumentReference;
    valor: number;
    tipo: string;
    dataHora: Date;
}