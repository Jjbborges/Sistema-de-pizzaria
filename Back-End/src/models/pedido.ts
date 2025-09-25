import { Produto } from "./produto";
import { Cliente } from "./cliente";

export interface Pedido {
  endereco: any;
  id: number;
  cliente: Cliente;
  itens: Produto[];
  total: number;
  pagamento: string;
  enderecoEntrega: string;
  observacao?: string;
  data: string; // formato: YYYY-MM-DD
}
