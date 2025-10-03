"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarPedidos = listarPedidos;
exports.salvarPedidos = salvarPedidos;
exports.criarPedido = criarPedido;
exports.calcularTotalPedido = calcularTotalPedido;
exports.atualizarStatusPedido = atualizarStatusPedido;
exports.marcarPedidoComoPago = marcarPedidoComoPago;
exports.buscarPedidosPorCliente = buscarPedidosPorCliente;
// src/services/pedidoService.ts
const path = require("path");
const fileUtils_1 = require("../utils/fileUtils");
const CAMINHO_PEDIDOS = path.join(__dirname, "../../data/pedidos.json");
/**
 * Gera um ID incremental com base nos pedidos existentes
 */
function gerarIdPedido(pedidos) {
    if (pedidos.length === 0)
        return 1;
    return Math.max(...pedidos.map(p => p.id)) + 1;
}
/**
 * Lista todos os pedidos
 */
function listarPedidos() {
    try {
        return (0, fileUtils_1.lerJSON)(CAMINHO_PEDIDOS);
    }
    catch (err) {
        console.error("❌ Erro ao ler pedidos:", err);
        return [];
    }
}
/**
 * Salva todos os pedidos no JSON
 */
function salvarPedidos(pedidos) {
    try {
        (0, fileUtils_1.salvarJSON)(CAMINHO_PEDIDOS, pedidos);
    }
    catch (err) {
        console.error("❌ Erro ao salvar pedidos:", err);
    }
}
/**
 * Cria um novo pedido
 */
function criarPedido(cliente, itens, total, pagamento, endereco, observacao, entregador) {
    const pedidosExistentes = listarPedidos();
    const novoPedido = {
        id: gerarIdPedido(pedidosExistentes),
        clienteId: cliente.id,
        clienteNome: cliente.nome,
        data: new Date().toISOString(),
        itens,
        total,
        pagamento,
        pago: false,
        endereco,
        observacao: observacao ?? "", // garante que seja string
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
function calcularTotalPedido(itens) {
    return itens.reduce((soma, p) => soma + p.item.preco * p.quantidade, 0);
}
/**
 * Atualiza o status de um pedido
 */
function atualizarStatusPedido(id, status) {
    const pedidos = listarPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido)
        return false;
    pedido.status = status;
    salvarPedidos(pedidos);
    return true;
}
/**
 * Marca um pedido como pago
 */
function marcarPedidoComoPago(id) {
    const pedidos = listarPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido)
        return false;
    pedido.pago = true;
    salvarPedidos(pedidos);
    return true;
}
/**
 * Busca pedidos por cliente
 */
function buscarPedidosPorCliente(clienteId) {
    const pedidos = listarPedidos();
    return pedidos.filter(p => p.clienteId === clienteId);
}
//# sourceMappingURL=pedidoService.js.map