export interface CardapioItem {
  id: number;
  nome: string;
  preco: number;
}

export interface PedidoItem {
  item: CardapioItem;
  quantidade: number;
}

export interface Pedido {
  id: number; // obrigatório
  data: string;
  itens: PedidoItem[];
  total: number;
  pagamento: string;
  endereco: string;
  observacao: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  historicoPedidos: Pedido[];
}
