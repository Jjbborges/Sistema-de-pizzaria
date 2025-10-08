import { Produto } from "./produto";
import { Cliente } from "./cliente";
export type StatusPedido = "pendente" | "preparo" | "entregue" | "cancelado";
export interface PedidoItem {
    item: Produto;
    quantidade: number;
}
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
    data: string;
    status: StatusPedido;
}
export interface CardapioItem extends Produto {
}
export type { Cliente };
//# sourceMappingURL=pedido.d.ts.map