// src/services/pedidoService.ts
import readlineSync = require("readline-sync");
import type { Pedido, PedidoItem, Cliente, CardapioItem } from "../models/pedido";
import { lerCSV, salvarCSV } from "../utils/fileUtils";

const CAMINHO_CSV_PEDIDOS = "csv/pedidos.csv";

export function calcularTotalPedido(itens: PedidoItem[]): number {
  return itens.reduce((sum, pi) => sum + pi.item.preco * pi.quantidade, 0);
}

export function criarPedido(cliente: Cliente, itens: PedidoItem[], _number: number): Pedido {
  const total = calcularTotalPedido(itens);
  const novoPedido: Pedido = {
    id: "PED-" + Date.now(),
    data: new Date(),
    itens,
    total
  };

  cliente.historicoPedidos.push(novoPedido);
  salvarPedidoCSV(cliente, novoPedido);
  console.log(`🎉 Pedido criado! Total: R$ ${total.toFixed(2)}`);
  return novoPedido;
}

function salvarPedidoCSV(cliente: Cliente, pedido: Pedido) {
  const linhasExistentes = lerCSV(CAMINHO_CSV_PEDIDOS);
  const novasLinhas = pedido.itens.map(item => [
    cliente.nome,
    cliente.cpf,
    cliente.telefone,
    cliente.endereco,
    pedido.id,
    pedido.data.toISOString(),
    item.item.nome,
    item.quantidade.toString(),
    item.item.preco.toFixed(2),
    pedido.total.toFixed(2)
  ]);
  salvarCSV(CAMINHO_CSV_PEDIDOS, [...linhasExistentes, ...novasLinhas]);
}
