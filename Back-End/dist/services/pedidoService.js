"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularTotalPedido = calcularTotalPedido;
exports.criarPedido = criarPedido;
const fileUtils_1 = require("../utils/fileUtils");
const CAMINHO_CSV_PEDIDOS = "csv/pedidos.csv";
function calcularTotalPedido(itens) {
    return itens.reduce((sum, pi) => sum + pi.item.preco * pi.quantidade, 0);
}
function criarPedido(cliente, itens, _number) {
    const total = calcularTotalPedido(itens);
    const novoPedido = {
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
function salvarPedidoCSV(cliente, pedido) {
    const linhasExistentes = (0, fileUtils_1.lerCSV)(CAMINHO_CSV_PEDIDOS);
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
    (0, fileUtils_1.salvarCSV)(CAMINHO_CSV_PEDIDOS, [...linhasExistentes, ...novasLinhas]);
}
//# sourceMappingURL=pedidoService.js.map