// src/services/adminService.ts
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";

export interface Admin {
  usuario: string;
  senha: string; // SHA256
}

const CAMINHO_ADMINS = path.join(__dirname, "../../data/admins.json");

// Cria o arquivo admins.json se não existir
if (!fs.existsSync(CAMINHO_ADMINS)) {
    fs.writeFileSync(CAMINHO_ADMINS, "[]", "utf-8");
}

function lerJSON<T>(caminho: string): T {
    const conteudo = fs.readFileSync(caminho, "utf-8");
    return JSON.parse(conteudo) as T;
}

function salvarJSON<T>(caminho: string, dados: T): void {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
}

export function listarAdmins(): Admin[] {
    try {
        return lerJSON<Admin[]>(CAMINHO_ADMINS);
    } catch (err) {
        console.error("Erro ao ler admins:", err);
        return [];
    }
}

export function hashSenha(senha: string): string {
    return crypto.createHash("sha256").update(senha).digest("hex");
}

// Se ainda não existir, cria o admin padrão
const adminsExistentes = listarAdmins();
if (!adminsExistentes.find(a => a.usuario === "admin")) {
    adminsExistentes.push({ usuario: "admin", senha: hashSenha("Miojincomqueijo77") });
    salvarJSON<Admin[]>(CAMINHO_ADMINS, adminsExistentes);
    console.log("Admin padrão criado: admin / Miojincomqueijo77");
}

export function autenticarAdmin(usuario: string, senha: string): boolean {
    const admins = listarAdmins();
    const senhaHash = hashSenha(senha);
    return admins.some(a => a.usuario === usuario && a.senha === senhaHash);
}

export function cadastrarAdmin(usuario: string, senha: string): boolean {
    const admins = listarAdmins();
    if (admins.find(a => a.usuario === usuario)) return false; // já existe

    admins.push({ usuario, senha: hashSenha(senha) });

    try {
        salvarJSON<Admin[]>(CAMINHO_ADMINS, admins);
        return true;
    } catch (err) {
        console.error("Erro ao salvar admin:", err);
        return false;
    }
}
