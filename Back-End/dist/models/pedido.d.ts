export interface CardapioItem {
    id: number;
    nome: string;
    preco: number;
    categoria: "pizza" | "bebida" | "sobremesa";
}
export interface PedidoItem {
    item: CardapioItem;
    quantidade: number;
}
export type StatusPedido = "pendente" | "preparo" | "entregue" | "cancelado";
export interface Pedido {
    id: number;
    clienteId: number;
    clienteNome: string;
    data: string;
    itens: PedidoItem[];
    total: number;
    pagamento: "dinheiro" | "cartao" | "pix";
    pago: boolean;
    endereco: string;
    observacao?: string;
    status: StatusPedido;
    entregador?: string;
}
export interface Cliente {
    id: number;
    nome: string;
    cpf: string;
    telefone: string;
    endereco: string;
    historicoPedidos: Pedido[];
}
//# sourceMappingURL=pedido.d.ts.map