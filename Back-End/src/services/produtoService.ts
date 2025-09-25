// src/services/produtoService.ts
import { Produto } from "../models/produto";
import { lerCSV, salvarCSV } from "../utils/fileUtils";

const CAMINHO_PRODUTOS = "csv/produtos.csv";

// --- Cadastrar um novo produto ---
export function cadastrarProduto(produto: Produto): Produto {
  const produtos = listarProdutos();
  produtos.push(produto);
  salvarCSV(
    CAMINHO_PRODUTOS,
    produtos.map(p => [
      p.id.toString(),
      p.nome,
      p.preco.toString(),
      p.categoria
    ])
  );
  return produto;
}

// --- Listar todos os produtos ---
export function listarProdutos(): Produto[] {
  const linhas = lerCSV(CAMINHO_PRODUTOS);
  return linhas.map(linha => ({
    id: Number(linha[0]),
    nome: linha[1] || "",
    preco: Number(linha[2] || 0),
    categoria: linha[3] as Produto["categoria"]
  }));
}

// --- Buscar produto por ID ---
export function buscarProdutoPorId(id: number): Produto | undefined {
  const produtos = listarProdutos();
  return produtos.find(p => p.id === id);
}

// --- Atualizar produto existente ---
export function atualizarProduto(produto: Produto): boolean {
  const produtos = listarProdutos();
  const index = produtos.findIndex(p => p.id === produto.id);
  if (index === -1) return false;

  produtos[index] = produto;
  salvarCSV(
    CAMINHO_PRODUTOS,
    produtos.map(p => [
      p.id.toString(),
      p.nome,
      p.preco.toString(),
      p.categoria
    ])
  );
  return true;
}

// --- Excluir produto por ID ---
export function excluirProdutoPorId(id: number): boolean {
  const produtos = listarProdutos();
  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) return false;

  produtos.splice(index, 1);
  salvarCSV(
    CAMINHO_PRODUTOS,
    produtos.map(p => [
      p.id.toString(),
      p.nome,
      p.preco.toString(),
      p.categoria
    ])
  );
  return true;
}

// --- Consultar produtos por categoria ---
export function listarProdutosPorCategoria(categoria: Produto["categoria"]): Produto[] {
  const produtos = listarProdutos();
  return produtos.filter(p => p.categoria === categoria);
}
