"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarPedido = criarPedido;
exports.calcularTotalPedido = calcularTotalPedido;
// Criar um novo pedido
function criarPedido(cliente, itens, total, pagamento, endereco, observacao) {
    const pedido = {
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
function calcularTotalPedido(itens) {
    return itens.reduce((soma, p) => soma + p.item.preco * p.quantidade, 0);
}
//# sourceMappingURL=pedidoService.js.map