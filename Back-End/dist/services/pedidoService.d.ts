import { Cliente, Pedido, PedidoItem } from "../models/pedido";
export declare function salvarPedidos(pedidos: Pedido[]): void;
export declare function carregarPedidos(): Pedido[];
export declare function criarPedido(cliente: Cliente, itens: PedidoItem[], total: number, pagamento: string, endereco: string, observacao: string): Pedido;
export declare function calcularTotalPedido(itens: PedidoItem[]): number;
//# sourceMappingURL=pedidoService.d.ts.map