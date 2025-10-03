"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerJSON = lerJSON;
exports.salvarJSON = salvarJSON;
// src/utils/fileUtils.ts
const fs = require("fs");
/**
 * Lê um arquivo JSON e retorna o conteúdo como objeto/array tipado.
 * Se o arquivo não existir ou estiver vazio/corrompido, retorna [].
 */
function lerJSON(caminho) {
    try {
        if (!fs.existsSync(caminho)) {
            return []; // garante array vazio por padrão
        }
        const conteudo = fs.readFileSync(caminho, "utf-8");
        if (!conteudo.trim()) {
            return [];
        }
        return JSON.parse(conteudo);
    }
    catch (erro) {
        console.error(`❌ Erro ao ler JSON em ${caminho}:`, erro);
        return [];
    }
}
/**
 * Salva dados em um arquivo JSON, formatado com identação.
 */
function salvarJSON(caminho, dados) {
    try {
        fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
    }
    catch (erro) {
        console.error(`❌ Erro ao salvar JSON em ${caminho}:`, erro);
    }
}
//# sourceMappingURL=fileUtils.js.map