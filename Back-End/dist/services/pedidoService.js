"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salvarPedidos = salvarPedidos;
exports.carregarPedidos = carregarPedidos;
exports.criarPedido = criarPedido;
exports.calcularTotalPedido = calcularTotalPedido;
// src/services/pedidoService.ts
const fs = require("fs");
const path = require("path");
const caminhoArquivo = path.join(__dirname, "../../csv/pedidos.csv");
// --- Funções de CSV ---
function salvarPedidos(pedidos) {
    const conteudo = pedidos
        .map(p => {
        // Serializa itens como JSON para gravar no CSV
        const itensStr = JSON.stringify(p.itens);
        return `${p.id}|${p.data}|${itensStr}|${p.total}|${p.pagamento}|${p.endereco}|${p.observacao}`;
    })
        .join("\n");
    fs.writeFileSync(caminhoArquivo, conteudo, "utf-8");
}
function carregarPedidos() {
    if (!fs.existsSync(caminhoArquivo))
        return [];
    const linhas = fs.readFileSync(caminhoArquivo, "utf-8")
        .split("\n")
        .filter(Boolean);
    return linhas.map(linha => {
        const [id, data, itensStr, total, pagamento, endereco, observacao] = linha.split("|");
        const itens = JSON.parse(itensStr || "[]");
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
function criarPedido(cliente, itens, total, pagamento, endereco, observacao) {
    const pedido = {
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
function calcularTotalPedido(itens) {
    return itens.reduce((soma, p) => soma + p.item.preco * p.quantidade, 0);
}
//# sourceMappingURL=pedidoService.js.map