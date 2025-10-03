// src/services/produtoService.ts
import * as path from "path";
import { Produto } from "../models/produto";
import { lerJSON, salvarJSON } from "../utils/fileUtils";

const CAMINHO_PRODUTOS = path.join(__dirname, "../../data/produtos.json");

/**
 * Gera um ID incremental baseado nos produtos existentes
 */
function gerarIdAutomatico(produtos: Produto[]): number {
  if (produtos.length === 0) return 1;
  return Math.max(...produtos.map(p => p.id)) + 1;
}

/**
 * Lista todos os produtos cadastrados
 */
export function listarProdutos(): Produto[] {
  try {
    return lerJSON<Produto[]>(CAMINHO_PRODUTOS);
  } catch (err) {
    console.error("❌ Erro ao ler produtos:", err);
    return [];
  }
}

/**
 * Cadastra um novo produto com ID automático
 */
export function cadastrarProduto(produto: Omit<Produto, "id">): Produto {
  const produtos = listarProdutos();
  const novoProduto: Produto = {
    ...produto,
    id: gerarIdAutomatico(produtos),
  };
  produtos.push(novoProduto);

  try {
    salvarJSON<Produto[]>(CAMINHO_PRODUTOS, produtos);
  } catch (err) {
    console.error("❌ Erro ao salvar produto:", err);
  }

  return novoProduto;
}

/**
 * Busca produto por ID
 */
export function buscarProdutoPorId(id: number): Produto | undefined {
  const produtos = listarProdutos();
  return produtos.find(p => p.id === id);
}

/**
 * Busca produto por nome (parcial e case-insensitive)
 */
export function buscarProdutoPorNome(nome: string): Produto[] {
  const produtos = listarProdutos();
  const termo = nome.toLowerCase();
  return produtos.filter(p => p.nome.toLowerCase().includes(termo));
}

/**
 * Atualiza produto existente
 */
export function atualizarProduto(produto: Produto): boolean {
  const produtos = listarProdutos();
  const index = produtos.findIndex(p => p.id === produto.id);
  if (index === -1) return false;

  produtos[index] = produto;

  try {
    salvarJSON<Produto[]>(CAMINHO_PRODUTOS, produtos);
  } catch (err) {
    console.error("❌ Erro ao atualizar produto:", err);
    return false;
  }

  return true;
}

/**
 * Exclui produto por ID
 */
export function excluirProdutoPorId(id: number): boolean {
  const produtos = listarProdutos();
  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) return false;

  produtos.splice(index, 1);

  try {
    salvarJSON<Produto[]>(CAMINHO_PRODUTOS, produtos);
  } catch (err) {
    console.error("❌ Erro ao excluir produto:", err);
    return false;
  }

  return true;
}

/**
 * Lista produtos por categoria
 */
export function listarProdutosPorCategoria(categoria: Produto["categoria"]): Produto[] {
  const produtos = listarProdutos();
  return produtos.filter(p => p.categoria === categoria);
}
