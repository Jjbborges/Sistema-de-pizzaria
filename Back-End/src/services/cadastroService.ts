// src/services/cadastroService.ts
import { Cliente } from "../models/pedido";
import { lerCSV, salvarCSV } from "../utils/fileUtils";

const CAMINHO_CLIENTES = "./csv/cadastro.csv";

// Lê todos os clientes do CSV
export function lerClientes(): Cliente[] {
  const dados = lerCSV(CAMINHO_CLIENTES);
  return dados.map((linha) => ({
    id: Number(linha[0]),
    nome: linha[1] || "",
    cpf: linha[2] || "",
    telefone: linha[3] || "",
    endereco: linha[4] || "",
    historicoPedidos: linha[5] ? JSON.parse(linha[5]) : []
  }));
}

// Salva todos os clientes no CSV
export function salvarClientes(clientes: Cliente[]): void {
  const linhas = clientes.map((c) => [
    c.id.toString(),
    c.nome,
    c.cpf,
    c.telefone,
    c.endereco,
    JSON.stringify(c.historicoPedidos)
  ]);
  salvarCSV(CAMINHO_CLIENTES, linhas);
}

// Busca cliente por CPF
export function buscarClientePorCPF(cpf: string): Cliente | undefined {
  const clientes = lerClientes();
  return clientes.find((c) => c.cpf === cpf);
}

// Cadastra ou atualiza um cliente
export function cadastrarCliente(novoCliente: Cliente): Cliente {
  const clientes = lerClientes();

  // Verifica se cliente já existe
  const existente = clientes.find((c) => c.cpf === novoCliente.cpf);
  if (existente) {
    console.log(`👋 Bem-vindo de volta, ${existente.nome}!`);
    return existente;
  }

  // Adiciona novo cliente
  clientes.push(novoCliente);
  salvarClientes(clientes);
  console.log(`✅ Cliente ${novoCliente.nome} cadastrado com sucesso!`);
  return novoCliente;
}
