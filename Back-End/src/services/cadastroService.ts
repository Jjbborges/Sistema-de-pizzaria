// src/services/cadastroService.ts
import { salvarCSV, carregarCSV } from "../utils/fileUtils";
import { Cliente } from "../models/cliente";

const caminhoArquivo = "src/csv/cadastro.csv";

// --- Cadastrar um cliente ---
export function cadastrarCliente(cliente: Cliente): Cliente {
  const clientes = carregarClientes();
  clientes.push(cliente);
  salvarClientes(clientes);
  return cliente;
}

// --- Carregar todos os clientes ---
export function carregarClientes(): Cliente[] {
  const linhas = carregarCSV(caminhoArquivo);

  return linhas.map((linha: { split: (arg0: string) => [any, any, any, any, any]; }) => {
    const [idStr, nome, cpf, telefone, endereco] = linha.split(",");

    return {
      id: Number(idStr),
      nome: nome || "",
      cpf: cpf || "",
      telefone: telefone || "",
      endereco: endereco || "",
      historicoPedidos: []
    };
  });
}

// --- Salvar todos os clientes ---
export function salvarClientes(clientes: Cliente[]): void {
  const conteudo = clientes.map(c =>
    `${c.id},${c.nome},${c.cpf},${c.telefone},${c.endereco}`
  );
  salvarCSV(caminhoArquivo, conteudo);
}

// --- Buscar cliente pelo CPF ---
export function buscarClientePorCPF(cpf: string): Cliente | undefined {
  return carregarClientes().find(c => c.cpf === cpf);
}

// --- Listar todos os clientes ---
export function listarClientes(): Cliente[] {
  return carregarClientes();
}
