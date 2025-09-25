import * as fs from "fs";

export function lerCSV(caminho: string): string[][] {
  if (!fs.existsSync(caminho)) return [];
  const dados = fs.readFileSync(caminho, "utf-8");
  return dados.split("\n").filter(Boolean).map(linha => linha.split(","));
}

export function salvarCSV(caminho: string, linhas: string[][]): void {
  const csv = linhas.map(linha => linha.join(",")).join("\n");
  fs.writeFileSync(caminho, csv, "utf-8");
}
