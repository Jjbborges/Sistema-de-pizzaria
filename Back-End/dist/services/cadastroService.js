"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrarCliente = cadastrarCliente;
exports.buscarClientePorCPF = buscarClientePorCPF;
const fileUtils_1 = require("../utils/fileUtils");
const caminhoCadastro = "./csv/cadastro.csv";
// Função para cadastrar ou buscar cliente
function cadastrarCliente(cliente) {
    const linhas = (0, fileUtils_1.lerCSV)(caminhoCadastro);
    // Verifica se já existe cliente com o mesmo CPF
    const linhaExistente = linhas.find(l => l[2] === cliente.cpf);
    if (linhaExistente) {
        // Cliente já existe, retorna os dados existentes
        console.log(`👋 Bem-vindo de volta, ${linhaExistente[1]}!`);
        return {
            id: Number(linhaExistente[0]),
            nome: linhaExistente[1] || "",
            cpf: linhaExistente[2] || "",
            telefone: linhaExistente[3] || "",
            endereco: linhaExistente[4] || "",
            historicoPedidos: [] // histórico pode ser carregado depois
        };
    }
    // Se não existir, cria um novo cliente
    const clienteId = Date.now(); // Gera ID único
    const novoCliente = {
        ...cliente,
        id: clienteId,
        historicoPedidos: []
    };
    // Adiciona ao CSV
    linhas.push([novoCliente.id.toString(), novoCliente.nome, novoCliente.cpf, novoCliente.telefone, novoCliente.endereco]);
    (0, fileUtils_1.salvarCSV)(caminhoCadastro, linhas);
    console.log(`✅ Cliente ${novoCliente.nome} cadastrado com sucesso!`);
    return novoCliente;
}
// Opcional: função para buscar cliente pelo CPF
function buscarClientePorCPF(cpf) {
    const linhas = (0, fileUtils_1.lerCSV)(caminhoCadastro);
    const linha = linhas.find(l => l[2] === cpf);
    if (!linha)
        return undefined;
    return {
        id: Number(linha[0]),
        nome: linha[1] || "",
        cpf: linha[2] || "",
        telefone: linha[3] || "",
        endereco: linha[4] || "",
        historicoPedidos: []
    };
}
//# sourceMappingURL=cadastroService.js.map