// src/services/cadastroService.ts
import * as path from "path";
import { Cliente } from "../models/pedido"; // você já colocou Cliente dentro de pedido.ts
import { lerJSON, salvarJSON } from "../utils/fileUtils";

const CAMINHO_CLIENTES = path.join(__dirname, "../../data/clientes.json");

/**
 * Gera um ID incremental com base nos clientes existentes
 */
function gerarIdAutomatico(clientes: Cliente[]): number {
  if (clientes.length === 0) return 1;
  return Math.max(...clientes.map(c => c.id)) + 1;
}

/**
 * Lista todos os clientes cadastrados
 */
export function listarTodosClientes(): Cliente[] {
  try {
    return lerJSON<Cliente[]>(CAMINHO_CLIENTES);
  } catch (err) {
    console.error("❌ Erro ao ler clientes:", err);
    return [];
  }
}

/**
 * Cadastra um novo cliente com ID automático
 */
export function cadastrarCliente(cliente: Omit<Cliente, "id" | "historicoPedidos">): Cliente {
  const clientes = listarTodosClientes();

  const novoCliente: Cliente = {
    ...cliente,
    id: gerarIdAutomatico(clientes),
    historicoPedidos: [] // inicia sempre vazio
  };

  clientes.push(novoCliente);

  try {
    salvarJSON<Cliente[]>(CAMINHO_CLIENTES, clientes);
  } catch (err) {
    console.error("❌ Erro ao salvar cliente:", err);
  }

  return novoCliente;
}

/**
 * Busca um cliente pelo CPF
 */
export function buscarClientePorCPF(cpf: string): Cliente | undefined {
  const clientes = listarTodosClientes();
  return clientes.find(c => c.cpf === cpf);
}
