import * as fs from "fs";
import * as path from "path";
import { Produto } from "../models/produto";

const caminhoArquivo = path.join(__dirname, "../../csv/produtos.csv");

export function carregarProdutos(): Produto[] {
  if (!fs.existsSync(caminhoArquivo)) return [];

  const linhas = fs.readFileSync(caminhoArquivo, "utf-8")
    .split("\n")
    .filter(Boolean);

  return linhas.map((linha: string): Produto => {
    // Forçando que o split sempre retorne string
    const [id, nome, preco, categoria] = linha.split(",") as [string, string, string, string];

    return {
      id: Number(id),
      nome,
      preco: Number(preco),
      categoria: categoria as Produto["categoria"],
    };
  });
}

export function salvarProdutos(produtos: Produto[]): void {
  const conteudo = produtos
    .map(p => `${p.id},${p.nome},${p.preco},${p.categoria}`)
    .join("\n");
  fs.writeFileSync(caminhoArquivo, conteudo, "utf-8");
}

export function cadastrarProduto(produto: Produto): Produto {
  const produtos = carregarProdutos();
  produtos.push(produto);
  salvarProdutos(produtos);
  return produto;
}
