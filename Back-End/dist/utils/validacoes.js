"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterNome = obterNome;
exports.obterCPF = obterCPF;
exports.obterTelefone = obterTelefone;
exports.obterEndereco = obterEndereco;
// src/utils/validacoes.ts
const readlineSync = require("readline-sync");
// Nome não pode ter números
function obterNome(prompt) {
    let nome;
    do {
        nome = readlineSync.question(`${prompt}: `).trim();
        if (!nome || /\d/.test(nome)) {
            console.log("❌ Nome inválido. Não use números e não deixe vazio.");
            nome = "";
        }
    } while (!nome);
    return nome;
}
// CPF: apenas números e 11 dígitos
function obterCPF(prompt) {
    let cpf;
    do {
        cpf = readlineSync.question(`${prompt}: `).replace(/\D/g, "");
        if (cpf.length !== 11) {
            console.log("❌ CPF inválido. Deve ter 11 números.");
            cpf = "";
        }
    } while (!cpf);
    return cpf;
}
// Telefone: no mínimo 10 números
function obterTelefone(prompt) {
    let tel;
    do {
        tel = readlineSync.question(`${prompt}: `).replace(/\D/g, "");
        if (tel.length < 10) {
            console.log("❌ Telefone inválido. Digite pelo menos 10 números.");
            tel = "";
        }
    } while (!tel);
    return tel;
}
// Endereço: não pode estar vazio
function obterEndereco(prompt) {
    let endereco;
    do {
        endereco = readlineSync.question(`${prompt}: `).trim();
        if (!endereco)
            console.log("❌ Endereço não pode estar vazio.");
    } while (!endereco);
    return endereco;
}
//# sourceMappingURL=validacoes.js.map