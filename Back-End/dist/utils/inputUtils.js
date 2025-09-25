"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterString = obterString;
exports.obterNumero = obterNumero;
const readlineSync = require("readline-sync");
// Garante que sempre retorna uma string não vazia
function obterString(prompt) {
    let resposta = "";
    do {
        resposta = readlineSync.question(`${prompt}: `).trim();
        if (!resposta) {
            console.log("Entrada invalida. Por favor, preencha o campo.");
        }
    } while (!resposta);
    return resposta;
}
// Para números
function obterNumero(prompt) {
    let numero;
    do {
        numero = readlineSync.questionInt(`${prompt}: `);
        if (numero < 0) {
            console.log("Por favor, insira um número valido.");
        }
    } while (numero < 0);
    return numero;
}
//# sourceMappingURL=inputUtils.js.map