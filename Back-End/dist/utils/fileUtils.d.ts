/**
 * Lê um arquivo JSON e retorna o conteúdo como objeto/array tipado.
 * Se o arquivo não existir ou estiver vazio/corrompido, retorna [].
 */
export declare function lerJSON<T>(caminho: string): T;
/**
 * Salva dados em um arquivo JSON, formatado com identação.
 */
export declare function salvarJSON<T>(caminho: string, dados: T): void;
export declare function lerCSV(caminho: string): string[][];
export declare function salvarCSV(caminho: string, linhas: string[][]): void;
//# sourceMappingURL=fileUtils.d.ts.map