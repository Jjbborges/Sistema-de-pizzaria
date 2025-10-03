// src/utils/fileUtils.ts
import * as fs from "fs";

/**
 * Lê um arquivo JSON e retorna o conteúdo como objeto/array tipado.
 * Se o arquivo não existir ou estiver vazio/corrompido, retorna [].
 */
export function lerJSON<T>(caminho: string): T {
  try {
    if (!fs.existsSync(caminho)) {
      return [] as unknown as T; // garante array vazio por padrão
    }

    const conteudo = fs.readFileSync(caminho, "utf-8");
    if (!conteudo.trim()) {
      return [] as unknown as T;
    }

    return JSON.parse(conteudo) as T;
  } catch (erro) {
    console.error(`❌ Erro ao ler JSON em ${caminho}:`, erro);
    return [] as unknown as T;
  }
}

/**
 * Salva dados em um arquivo JSON, formatado com identação.
 */
export function salvarJSON<T>(caminho: string, dados: T): void {
  try {
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
  } catch (erro) {
    console.error(`❌ Erro ao salvar JSON em ${caminho}:`, erro);
  }
}
