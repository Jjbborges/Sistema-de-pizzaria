// src/models/pedido.ts

export type CardapioItem = {
  id: number;
  nome: string;
  preco: number;
};

export type PedidoItem = {
  item: CardapioItem;
  quantidade: number;
};

export type Pedido = {
  id: string;
  data: Date;
  itens: PedidoItem[];
  total: number;
};

export type Cliente = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  historicoPedidos: Pedido[];
};
