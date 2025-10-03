// src/services/pedidoService.ts
import * as path from "path";
import { Pedido, PedidoItem, Cliente } from "../models/pedido";
import { lerJSON, salvarJSON } from "../utils/fileUtils";

const CAMINHO_PEDIDOS = path.join(__dirname, "../../data/pedidos.json");

/**
 * Gera um ID incremental com base nos pedidos existentes
 */
function gerarIdPedido(pedidos: Pedido[]): number {
  if (pedidos.length === 0) return 1;
  return Math.max(...pedidos.map(p => p.id)) + 1;
}

/**
 * Lista todos os pedidos
 */
export function listarPedidos(): Pedido[] {
  try {
    return lerJSON<Pedido[]>(CAMINHO_PEDIDOS);
  } catch (err) {
    console.error("❌ Erro ao ler pedidos:", err);
    return [];
  }
}

/**
 * Salva todos os pedidos no JSON
 */
export function salvarPedidos(pedidos: Pedido[]): void {
  try {
    salvarJSON<Pedido[]>(CAMINHO_PEDIDOS, pedidos);
  } catch (err) {
    console.error("❌ Erro ao salvar pedidos:", err);
  }
}

/**
 * Cria um novo pedido
 */
export function criarPedido(
  cliente: Cliente,
  itens: PedidoItem[],
  total: number,
  pagamento: "dinheiro" | "cartao" | "pix",
  endereco: string,
  observacao?: string,
  entregador?: string
): Pedido {
  const pedidosExistentes = listarPedidos();

  const novoPedido: Pedido = {
    id: gerarIdPedido(pedidosExistentes),
    clienteId: cliente.id,
    clienteNome: cliente.nome,
    data: new Date().toISOString(),
    itens,
    total,
    pagamento,
    pago: false,
    endereco,
    observacao: observacao ?? "",       // garante que seja string
    status: "pendente",
    ...(entregador !== undefined ? { entregador } : {}),
  };

  // Adiciona o pedido ao histórico do cliente
  cliente.historicoPedidos.push(novoPedido);

  // Salva no arquivo
  pedidosExistentes.push(novoPedido);
  salvarPedidos(pedidosExistentes);

  return novoPedido;
}

/**
 * Calcula o total de um pedido
 */
export function calcularTotalPedido(itens: PedidoItem[]): number {
  return itens.reduce((soma, p) => soma + p.item.preco * p.quantidade, 0);
}

/**
 * Atualiza o status de um pedido
 */
export function atualizarStatusPedido(id: number, status: "pendente" | "preparo" | "entregue" | "cancelado"): boolean {
  const pedidos = listarPedidos();
  const pedido = pedidos.find(p => p.id === id);
  if (!pedido) return false;

  pedido.status = status;
  salvarPedidos(pedidos);
  return true;
}

/**
 * Marca um pedido como pago
 */
export function marcarPedidoComoPago(id: number): boolean {
  const pedidos = listarPedidos();
  const pedido = pedidos.find(p => p.id === id);
  if (!pedido) return false;

  pedido.pago = true;
  salvarPedidos(pedidos);
  return true;
}

/**
 * Busca pedidos por cliente
 */
export function buscarPedidosPorCliente(clienteId: number): Pedido[] {
  const pedidos = listarPedidos();
  return pedidos.filter(p => p.clienteId === clienteId);
}
