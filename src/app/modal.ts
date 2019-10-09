class FireError {
    code: string;
    message: string;
}

class Restaurante {
    codigo: string;
    nome: string;
}

class Item {
    descricao: string;
    preco: number;
    quantidade: number;
    restaurante: Restaurante;
    tipo: string;
}
