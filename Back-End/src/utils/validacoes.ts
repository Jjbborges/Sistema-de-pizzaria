// src/utils/validacoes.ts
import readlineSync = require("readline-sync");

// Nome não pode ter números
export function obterNome(prompt: string): string {
  let nome: string;
  do {
    nome = readlineSync.question(`${prompt}: `).trim();
    if (!nome || /\d/.test(nome)) {
      console.log("Nome inválido. Não use números e não deixe vazio.");
      nome = "";
    }
  } while (!nome);
  return nome;
}

// CPF: apenas números e 11 dígitos
export function obterCPF(prompt: string): string {
  let cpf: string;
  do {
    cpf = readlineSync.question(`${prompt}: `).replace(/\D/g, "");
    if (cpf.length !== 11) {
      console.log("CPF inválido. Deve ter 11 números.");
      cpf = "";
    }
  } while (!cpf);
  return cpf;
}

// Telefone: no mínimo 10 números
export function obterTelefone(prompt: string): string {
  let tel: string;
  do {
    tel = readlineSync.question(`${prompt}: `).replace(/\D/g, "");
    if (tel.length < 10) {
      console.log("Telefone inválido. Digite pelo menos 10 números.");
      tel = "";
    }
  } while (!tel);
  return tel;
}

// Endereço: não pode estar vazio
export function obterEndereco(prompt: string): string {
  let endereco: string;
  do {
    endereco = readlineSync.question(`${prompt}: `).trim();
    if (!endereco) console.log("Endereço não pode estar vazio.");
  } while (!endereco);
  return endereco;
}
