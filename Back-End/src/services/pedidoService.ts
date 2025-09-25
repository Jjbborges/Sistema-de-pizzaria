// src/services/pedidoService.ts
import * as fs from "fs";
import * as path from "path";
import { Cliente, Pedido, PedidoItem } from "../models/pedido";

const caminhoArquivo = path.join(__dirname, "../../csv/pedidos.csv");

// --- Funções de CSV ---
export function salvarPedidos(pedidos: Pedido[]): void {
  const conteudo = pedidos
    .map(p => {
      // Serializa itens como JSON para gravar no CSV
      const itensStr = JSON.stringify(p.itens);
      return `${p.id}|${p.data}|${itensStr}|${p.total}|${p.pagamento}|${p.endereco}|${p.observacao}`;
    })
    .join("\n");

  fs.writeFileSync(caminhoArquivo, conteudo, "utf-8");
}

export function carregarPedidos(): Pedido[] {
  if (!fs.existsSync(caminhoArquivo)) return [];

  const linhas = fs.readFileSync(caminhoArquivo, "utf-8")
    .split("\n")
    .filter(Boolean);

  return linhas.map(linha => {
    const [id, data, itensStr, total, pagamento, endereco, observacao] = linha.split("|");

    const itens: PedidoItem[] = JSON.parse(itensStr || "[]");

    return {
      id: Number(id),
      data: data || "",
      itens,
      total: Number(total),
      pagamento: pagamento || "",
      endereco: endereco || "",
      observacao: observacao || "",
    };
  });
}

// --- Funções principais ---
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
    data: new Date().toISOString(),
    itens,
    total,
    pagamento,
    endereco,
    observacao,
  };

  cliente.historicoPedidos.push(pedido);

  // Salva todos os pedidos existentes + o novo
  const pedidosExistentes = carregarPedidos();
  pedidosExistentes.push(pedido);
  salvarPedidos(pedidosExistentes);

  return pedido;
}

export function calcularTotalPedido(itens: PedidoItem[]): number {
  return itens.reduce((soma, p) => soma + p.item.preco * p.quantidade, 0);
}
