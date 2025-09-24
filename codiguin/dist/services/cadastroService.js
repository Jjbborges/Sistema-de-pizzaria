"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrarCliente = cadastrarCliente;
const inputUtils_1 = require("../utils/inputUtils");
let proximoId = 1; // contador global de clientes
function cadastrarCliente(clienteAtual) {
    const nome = (0, inputUtils_1.obterString)("Digite seu nome completo");
    const cpf = (0, inputUtils_1.obterString)("Digite seu CPF");
    const telefone = (0, inputUtils_1.obterString)("Digite seu telefone");
    const endereco = (0, inputUtils_1.obterString)("Digite seu endereço");
    const novoCliente = {
        id: proximoId++,
        nome,
        cpf,
        telefone,
        endereco,
        historicoPedidos: [],
    };
    // Aqui você pode adicionar código para gravar no cadastro.csv
    console.log(`✅ Cliente ${novoCliente.nome} cadastrado com sucesso!`);
    return novoCliente;
}
//# sourceMappingURL=cadastroService.js.map