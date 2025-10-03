import { Pedido, PedidoItem, Cliente } from "../models/pedido";
/**
 * Lista todos os pedidos
 */
export declare function listarPedidos(): Pedido[];
/**
 * Salva todos os pedidos no JSON
 */
export declare function salvarPedidos(pedidos: Pedido[]): void;
/**
 * Cria um novo pedido
 */
export declare function criarPedido(cliente: Cliente, itens: PedidoItem[], total: number, pagamento: "dinheiro" | "cartao" | "pix", endereco: string, observacao?: string, entregador?: string): Pedido;
/**
 * Calcula o total de um pedido
 */
export declare function calcularTotalPedido(itens: PedidoItem[]): number;
/**
 * Atualiza o status de um pedido
 */
export declare function atualizarStatusPedido(id: number, status: "pendente" | "preparo" | "entregue" | "cancelado"): boolean;
/**
 * Marca um pedido como pago
 */
export declare function marcarPedidoComoPago(id: number): boolean;
/**
 * Busca pedidos por cliente
 */
export declare function buscarPedidosPorCliente(clienteId: number): Pedido[];
//# sourceMappingURL=pedidoService.d.ts.map