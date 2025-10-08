"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerArquivo = lerArquivo;
exports.escreverArquivo = escreverArquivo;
const fs = require("fs");
function lerArquivo(caminho) {
    if (!fs.existsSync(caminho))
        return [];
    return fs.readFileSync(caminho, "utf-8").split("\n").filter(Boolean);
}
function escreverArquivo(caminho, linhas) {
    fs.writeFileSync(caminho, linhas.join("\n"), "utf-8");
}
//# sourceMappingURL=fileUtils.js.map