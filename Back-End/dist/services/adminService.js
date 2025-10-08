"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashSenha = hashSenha;
exports.listarAdmins = listarAdmins;
exports.autenticarAdmin = autenticarAdmin;
exports.cadastrarAdmin = cadastrarAdmin;
const path = require("path");
const fileUtils_1 = require("../utils/fileUtils");
const crypto = require("crypto");
const CAMINHO_ADMINS = path.join(__dirname, "../../data/admins.json");
// Função para gerar hash da senha
function hashSenha(senha) {
    return crypto.createHash("sha256").update(senha).digest("hex");
}
// Lista todos os admins, cria o padrão se não existir
function listarAdmins() {
    try {
        let admins = (0, fileUtils_1.lerJSON)(CAMINHO_ADMINS) || [];
        if (admins.length === 0) {
            const defaultAdmin = {
                usuario: "admin",
                senha: hashSenha("Miojincomqueijo77"),
            };
            (0, fileUtils_1.salvarJSON)(CAMINHO_ADMINS, [defaultAdmin]);
            admins = [defaultAdmin];
            console.log("Admin padrão criado: usuário='admin', senha='Miojincomqueijo77'");
        }
        return admins;
    }
    catch (err) {
        console.error("Erro ao ler admins, criando admin padrão...", err);
        const defaultAdmin = {
            usuario: "admin",
            senha: hashSenha("Miojincomqueijo77"),
        };
        (0, fileUtils_1.salvarJSON)(CAMINHO_ADMINS, [defaultAdmin]);
        return [defaultAdmin];
    }
}
// Autenticação do admin
function autenticarAdmin(usuario, senha) {
    const admins = listarAdmins();
    const senhaHash = hashSenha(senha);
    return admins.some(a => a.usuario === usuario && a.senha === senhaHash);
}
// Cadastrar novo admin
function cadastrarAdmin(usuario, senha) {
    const admins = listarAdmins();
    if (admins.find(a => a.usuario === usuario))
        return false;
    admins.push({ usuario, senha: hashSenha(senha) });
    try {
        (0, fileUtils_1.salvarJSON)(CAMINHO_ADMINS, admins);
        return true;
    }
    catch (err) {
        console.error("Erro ao salvar admin:", err);
        return false;
    }
}
//# sourceMappingURL=adminService.js.map