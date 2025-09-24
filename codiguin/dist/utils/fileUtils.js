"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerCSV = lerCSV;
exports.salvarCSV = salvarCSV;
// src/utils/fileUtils.ts
const fs = require("fs");
function lerCSV(caminho) {
    if (!fs.existsSync(caminho))
        return [];
    const dados = fs.readFileSync(caminho, "utf-8");
    return dados
        .split("\n")
        .filter(linha => linha.trim() !== "")
        .map(linha => linha.split(","));
}
function salvarCSV(caminho, linhas) {
    const csv = linhas.map(linha => linha.join(",")).join("\n");
    fs.writeFileSync(caminho, csv, "utf-8");
}
//# sourceMappingURL=fileUtils.js.map