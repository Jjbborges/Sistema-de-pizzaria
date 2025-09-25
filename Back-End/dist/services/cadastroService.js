"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerClientes = lerClientes;
exports.salvarClientes = salvarClientes;
exports.buscarClientePorCPF = buscarClientePorCPF;
exports.cadastrarCliente = cadastrarCliente;
const fileUtils_1 = require("../utils/fileUtils");
const CAMINHO_CLIENTES = "./csv/cadastro.csv";
// Lê todos os clientes do CSV
function lerClientes() {
    const dados = (0, fileUtils_1.lerCSV)(CAMINHO_CLIENTES);
    return dados.map((linha) => ({
        id: Number(linha[0]),
        nome: linha[1] || "",
        cpf: linha[2] || "",
        telefone: linha[3] || "",
        endereco: linha[4] || "",
        historicoPedidos: linha[5] ? JSON.parse(linha[5]) : []
    }));
}
// Salva todos os clientes no CSV
function salvarClientes(clientes) {
    const linhas = clientes.map((c) => [
        c.id.toString(),
        c.nome,
        c.cpf,
        c.telefone,
        c.endereco,
        JSON.stringify(c.historicoPedidos)
    ]);
    (0, fileUtils_1.salvarCSV)(CAMINHO_CLIENTES, linhas);
}
// Busca cliente por CPF
function buscarClientePorCPF(cpf) {
    const clientes = lerClientes();
    return clientes.find((c) => c.cpf === cpf);
}
// Cadastra ou atualiza um cliente
function cadastrarCliente(novoCliente) {
    const clientes = lerClientes();
    // Verifica se cliente já existe
    const existente = clientes.find((c) => c.cpf === novoCliente.cpf);
    if (existente) {
        console.log(`👋 Bem-vindo de volta, ${existente.nome}!`);
        return existente;
    }
    // Adiciona novo cliente
    clientes.push(novoCliente);
    salvarClientes(clientes);
    console.log(`✅ Cliente ${novoCliente.nome} cadastrado com sucesso!`);
    return novoCliente;
}
//# sourceMappingURL=cadastroService.js.map