// src/utils/fileUtils.ts
import * as fs from "fs";

export function lerCSV(caminho: string): string[][] {
  if (!fs.existsSync(caminho)) return [];
  const dados = fs.readFileSync(caminho, "utf-8");
  return dados
    .split("\n")
    .filter(linha => linha.trim() !== "")
    .map(linha => linha.split(","));
}

export function salvarCSV(caminho: string, linhas: string[][]) {
  const csv = linhas.map(linha => linha.join(",")).join("\n");
  fs.writeFileSync(caminho, csv, "utf-8");
}
