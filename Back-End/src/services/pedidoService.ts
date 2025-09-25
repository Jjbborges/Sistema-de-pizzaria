import { Cliente, Pedido, PedidoItem } from "../models/pedido";

// Criar um novo pedido
export function criarPedido(
  cliente: Cliente,
  itens: PedidoItem[],
  total: number,
  pagamento: string,
  endereco: string,
  observacao: string
): Pedido {
  const pedido: Pedido = {
    id: Date.now(), // gera um id único automático
    data: new Date().toISOString(),
    itens,
    total,
    pagamento,
    endereco,
    observacao,
  };

  cliente.historicoPedidos.push(pedido);
  return pedido;
}

// Calcular o total de um pedido
export function calcularTotalPedido(itens: PedidoItem[]): number {
  return itens.reduce((soma, p) => soma + p.item.preco * p.quantidade, 0);
}
