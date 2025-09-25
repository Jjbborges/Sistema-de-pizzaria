"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrarCliente = cadastrarCliente;
exports.listarClientes = listarClientes;
exports.buscarClientePorCPF = buscarClientePorCPF;
exports.atualizarCliente = atualizarCliente;
const fileUtils_1 = require("../utils/fileUtils");
const CAMINHO_CLIENTES = "./csv/cadastro.csv";
function cadastrarCliente(cliente) {
    const clientes = listarClientes();
    clientes.push(cliente);
    (0, fileUtils_1.salvarCSV)(CAMINHO_CLIENTES, clientes.map(c => [
        c.id.toString(),
        c.nome,
        c.cpf,
        c.telefone,
        c.endereco,
        JSON.stringify(c.historicoPedidos)
    ]));
    return cliente;
}
function listarClientes() {
    const linhas = (0, fileUtils_1.lerCSV)(CAMINHO_CLIENTES);
    return linhas.map(linha => ({
        id: Number(linha[0]),
        nome: linha[1] || "",
        cpf: linha[2] || "",
        telefone: linha[3] || "",
        endereco: linha[4] || "",
        historicoPedidos: linha[5] ? JSON.parse(linha[5]) : []
    }));
}
function buscarClientePorCPF(cpf) {
    const clientes = listarClientes();
    return clientes.find(c => c.cpf === cpf);
}
function atualizarCliente(cliente) {
    const clientes = listarClientes();
    const index = clientes.findIndex(c => c.cpf === cliente.cpf);
    if (index !== -1) {
        clientes[index] = cliente;
        (0, fileUtils_1.salvarCSV)(CAMINHO_CLIENTES, clientes.map(c => [
            c.id.toString(),
            c.nome,
            c.cpf,
            c.telefone,
            c.endereco,
            JSON.stringify(c.historicoPedidos)
        ]));
    }
}
//# sourceMappingURL=cadastroService.js.map