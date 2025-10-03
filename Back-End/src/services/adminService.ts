import * as path from "path";
import { lerJSON, salvarJSON } from "../utils/fileUtils";
import * as crypto from "crypto";

const CAMINHO_ADMINS = path.join(__dirname, "../../data/admins.json");

export interface Admin {
  usuario: string;
  senha: string; // SHA256
}

// Função para gerar hash da senha
export function hashSenha(senha: string): string {
  return crypto.createHash("sha256").update(senha).digest("hex");
}

// Lista todos os admins, cria o padrão se não existir
export function listarAdmins(): Admin[] {
  try {
    let admins: Admin[] = lerJSON<Admin[]>(CAMINHO_ADMINS) || [];

    if (admins.length === 0) {
      const defaultAdmin: Admin = {
        usuario: "admin",
        senha: hashSenha("Miojincomqueijo77"),
      };
      salvarJSON(CAMINHO_ADMINS, [defaultAdmin]);
      admins = [defaultAdmin];
      console.log("Admin padrão criado: usuário='admin', senha='Miojincomqueijo77'");
    }

    return admins;
  } catch (err) {
    console.error("Erro ao ler admins, criando admin padrão...", err);
    const defaultAdmin: Admin = {
      usuario: "admin",
      senha: hashSenha("Miojincomqueijo77"),
    };
    salvarJSON(CAMINHO_ADMINS, [defaultAdmin]);
    return [defaultAdmin];
  }
}

// Autenticação do admin
export function autenticarAdmin(usuario: string, senha: string): boolean {
  const admins = listarAdmins();
  const senhaHash = hashSenha(senha);
  return admins.some(a => a.usuario === usuario && a.senha === senhaHash);
}

// Cadastrar novo admin
export function cadastrarAdmin(usuario: string, senha: string): boolean {
  const admins = listarAdmins();
  if (admins.find(a => a.usuario === usuario)) return false;

  admins.push({ usuario, senha: hashSenha(senha) });
  try {
    salvarJSON(CAMINHO_ADMINS, admins);
    return true;
  } catch (err) {
    console.error("Erro ao salvar admin:", err);
    return false;
  }
}
