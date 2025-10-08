"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarTodosClientes = listarTodosClientes;
exports.cadastrarCliente = cadastrarCliente;
exports.buscarClientePorCPF = buscarClientePorCPF;
// src/services/cadastroService.ts
const path = require("path");
const fileUtils_1 = require("../utils/fileUtils");
const CAMINHO_CLIENTES = path.join(__dirname, "../../data/clientes.json");
/**
 * Gera um ID incremental com base nos clientes existentes
 */
function gerarIdAutomatico(clientes) {
    if (clientes.length === 0)
        return 1;
    return Math.max(...clientes.map(c => c.id)) + 1;
}
/**
 * Lista todos os clientes cadastrados
 */
function listarTodosClientes() {
    try {
        return (0, fileUtils_1.lerJSON)(CAMINHO_CLIENTES);
    }
    catch (err) {
        console.error("❌ Erro ao ler clientes:", err);
        return [];
    }
}
/**
 * Cadastra um novo cliente com ID automático
 */
function cadastrarCliente(cliente) {
    const clientes = listarTodosClientes();
    const novoCliente = {
        ...cliente,
        id: gerarIdAutomatico(clientes),
        historicoPedidos: [] // inicia sempre vazio
    };
    clientes.push(novoCliente);
    try {
        (0, fileUtils_1.salvarJSON)(CAMINHO_CLIENTES, clientes);
    }
    catch (err) {
        console.error("❌ Erro ao salvar cliente:", err);
    }
    return novoCliente;
}
/**
 * Busca um cliente pelo CPF
 */
function buscarClientePorCPF(cpf) {
    const clientes = listarTodosClientes();
    return clientes.find(c => c.cpf === cpf);
}
//# sourceMappingURL=cadastroService.js.map