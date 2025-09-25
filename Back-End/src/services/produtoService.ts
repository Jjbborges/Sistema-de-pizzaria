import * as fs from "fs";
import * as path from "path";
import { Produto } from "../models/produto";
import { salvarCSV, carregarCSV } from "..utils/fileUtils.ts";

const caminhoArquivo = "src/csv/produtos.csv";

export function carregarProdutos(): Produto[] {
  const linhas = carregarCSV(caminhoArquivo);
  return linhas.map((linha: { split: (arg0: string) => [any, any, any, any]; }) => {
    const [id, nome, preco, categoria] = linha.split(",");
    return {
      id: Number(id),
      nome: nome || "",
      preco: Number(preco),
      categoria: categoria as Produto["categoria"]
    };
  });
}

export function salvarProdutos(produtos: Produto[]): void {
  const conteudo = produtos.map(p =>
    `${p.id},${p.nome},${p.preco},${p.categoria}`
  );
  salvarCSV(caminhoArquivo, conteudo);
}

export function cadastrarProduto(produto: Produto): Produto {
  const produtos = carregarProdutos();
  produtos.push(produto);
  salvarProdutos(produtos);
  return produto;
}
