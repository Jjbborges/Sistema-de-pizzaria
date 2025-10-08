import { Produto } from "./produto";
import { Cliente } from "./cliente";

// Status do pedido
export type StatusPedido = "pendente" | "preparo" | "entregue" | "cancelado";

// Item do pedido com quantidade
export interface PedidoItem {
  item: Produto;
  quantidade: number;
}

// Pedido completo
export interface Pedido {
  pago: boolean;
  clienteId: number;
  id: number;
  cliente: Cliente;
  itens: PedidoItem[];
  total: number;
  pagamento: "dinheiro" | "cartao" | "pix";
  enderecoEntrega: string;
  observacao?: string;
  data: string; // YYYY-MM-DD
  status: StatusPedido;
}

// Caso queira um tipo para cardápio (opcional)
export interface CardapioItem extends Produto {}
export type {
  // Status do pedido
  Cliente
};

