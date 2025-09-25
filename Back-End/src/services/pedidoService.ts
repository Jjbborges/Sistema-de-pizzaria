import { salvarCSV, carregarCSV } from "./fileUtils";
import { Pedido, Cliente, PedidoItem } from "../models/pedido";

const caminhoArquivo = "src/csv/pedidos.csv";

export function criarPedido(
  cliente: Cliente,
  itens: PedidoItem[],
  total: number,
  pagamento: string,
  endereco: string,
  observacao: string
): Pedido {
  const pedido: Pedido = {
    id: Date.now(),
    data: new Date().toLocaleString(),
    itens,
    total,
    pagamento,
    endereco,
    observacao,
    cliente: undefined,
    enderecoEntrega: ""
  };

  const pedidos = carregarPedidos();
  pedidos.push(pedido);
  salvarPedidos(pedidos);

  cliente.historicoPedidos.push(pedido);
  return pedido;
}

export function carregarPedidos(): Pedido[] {
  const linhas = carregarCSV(caminhoArquivo);
  return linhas.map((linha: { split: (arg0: string) => [any, any, any, any, any, any]; }) => {
    const [id, data, total, pagamento, endereco, observacao] = linha.split(",");
    return {
      id: Number(id),
      data,
      itens: [],
      total: Number(total),
      pagamento,
      endereco,
      observacao
    };
  });
}

export function salvarPedidos(pedidos: Pedido[]): void {
  const conteudo = pedidos.map(p =>
    `${p.id},${p.data},${p.total},${p.pagamento},${p.endereco},${p.observacao}`
  );
  salvarCSV(caminhoArquivo, conteudo);
}

export function calcularTotalPedido(itens: PedidoItem[]): number {
  return itens.reduce((soma, p) => soma + p.item.preco * p.quantidade, 0);
}
