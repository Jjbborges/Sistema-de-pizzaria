export interface CardapioItem {
  id: number;
  nome: string;
  preco: number;
  categoria: "pizza" | "bebida" | "sobremesa"; // obrigatório
}

export interface PedidoItem {
  item: CardapioItem;
  quantidade: number;
}

export type StatusPedido = "pendente" | "preparo" | "entregue" | "cancelado";

export interface Pedido {
  id: number;
  clienteId: number;       // id do cliente
  clienteNome: string;     
  data: string;            // data em string legível
  itens: PedidoItem[];
  total: number;
  pagamento: "dinheiro" | "cartao" | "pix"; 
  pago: boolean;           // status do pagamento
  endereco: string;
  observacao?: string;
  status: StatusPedido;    
  entregador?: string;     // opcional, para médio porte
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  historicoPedidos: Pedido[];
}
