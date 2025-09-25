/**
 * Consulta o histórico de pedidos por CPF.
 * @param cpf CPF do cliente.
 * @returns Array de strings com os pedidos encontrados.
 */
export declare function consultarPorCPF(cpf: string): string[];
/**
 * Retorna a pizza mais pedida em uma data específica.
 * @param data String no formato DD/MM/AAAA
 * @returns Nome da pizza mais pedida
 */
export declare function pizzaMaisPedida(data: string): string;
/**
 * Consulta por placa de veículo.
 * Primeiro busca em ativos.csv; se não encontrar, retorna última saída de saidas.csv
 * @param placa Placa do veículo
 * @returns String com resultado
 */
export declare function consultarPorPlaca(placa: string): string;
/**
 * Lista todos os veículos atualmente ativos (no pátio).
 */
export declare function listarAtivos(): void;
//# sourceMappingURL=consultaService.d.ts.map