"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAdmins = listarAdmins;
exports.hashSenha = hashSenha;
exports.autenticarAdmin = autenticarAdmin;
exports.cadastrarAdmin = cadastrarAdmin;
// src/services/adminService.ts
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const CAMINHO_ADMINS = path.join(__dirname, "../../data/admins.json");
// Cria o arquivo admins.json se não existir
if (!fs.existsSync(CAMINHO_ADMINS)) {
    fs.writeFileSync(CAMINHO_ADMINS, "[]", "utf-8");
}
function lerJSON(caminho) {
    const conteudo = fs.readFileSync(caminho, "utf-8");
    return JSON.parse(conteudo);
}
function salvarJSON(caminho, dados) {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
}
function listarAdmins() {
    try {
        return lerJSON(CAMINHO_ADMINS);
    }
    catch (err) {
        console.error("Erro ao ler admins:", err);
        return [];
    }
}
function hashSenha(senha) {
    return crypto.createHash("sha256").update(senha).digest("hex");
}
// Se ainda não existir, cria o admin padrão
const adminsExistentes = listarAdmins();
if (!adminsExistentes.find(a => a.usuario === "admin")) {
    adminsExistentes.push({ usuario: "admin", senha: hashSenha("Miojincomqueijo77") });
    salvarJSON(CAMINHO_ADMINS, adminsExistentes);
    console.log("Admin padrão criado: admin / Miojincomqueijo77");
}
function autenticarAdmin(usuario, senha) {
    const admins = listarAdmins();
    const senhaHash = hashSenha(senha);
    return admins.some(a => a.usuario === usuario && a.senha === senhaHash);
}
function cadastrarAdmin(usuario, senha) {
    const admins = listarAdmins();
    if (admins.find(a => a.usuario === usuario))
        return false; // já existe
    admins.push({ usuario, senha: hashSenha(senha) });
    try {
        salvarJSON(CAMINHO_ADMINS, admins);
        return true;
    }
    catch (err) {
        console.error("Erro ao salvar admin:", err);
        return false;
    }
}
//# sourceMappingURL=adminService.js.map