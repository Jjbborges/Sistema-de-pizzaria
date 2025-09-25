import { Cliente } from "../models/pedido";
import { lerCSV, salvarCSV } from "../utils/fileUtils";

const CAMINHO_CLIENTES = "./csv/cadastro.csv";

export function cadastrarCliente(cliente: Cliente): Cliente {
  const clientes = listarClientes();
  clientes.push(cliente);
  salvarCSV(CAMINHO_CLIENTES, clientes.map(c => [
    c.id.toString(),
    c.nome,
    c.cpf,
    c.telefone,
    c.endereco,
    JSON.stringify(c.historicoPedidos)
  ]));
  return cliente;
}

export function listarClientes(): Cliente[] {
  const linhas = lerCSV(CAMINHO_CLIENTES);
  return linhas.map(linha => ({
    id: Number(linha[0]),
    nome: linha[1] || "",
    cpf: linha[2] || "",
    telefone: linha[3] || "",
    endereco: linha[4] || "",
    historicoPedidos: linha[5] ? JSON.parse(linha[5]) : []
  }));
}

export function buscarClientePorCPF(cpf: string): Cliente | undefined {
  const clientes = listarClientes();
  return clientes.find(c => c.cpf === cpf);
}

export function atualizarCliente(cliente: Cliente) {
  const clientes = listarClientes();
  const index = clientes.findIndex(c => c.cpf === cliente.cpf);
  if (index !== -1) {
    clientes[index] = cliente;
    salvarCSV(CAMINHO_CLIENTES, clientes.map(c => [
      c.id.toString(),
      c.nome,
      c.cpf,
      c.telefone,
      c.endereco,
      JSON.stringify(c.historicoPedidos)
    ]));
  }
}
