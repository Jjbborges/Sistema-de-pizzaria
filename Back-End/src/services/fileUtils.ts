import * as fs from "fs";

export function lerArquivo(caminho: string): string[] {
  if (!fs.existsSync(caminho)) return [];
  return fs.readFileSync(caminho, "utf-8").split("\n").filter(Boolean);
}

export function escreverArquivo(caminho: string, linhas: string[]): void {
  fs.writeFileSync(caminho, linhas.join("\n"), "utf-8");
}
