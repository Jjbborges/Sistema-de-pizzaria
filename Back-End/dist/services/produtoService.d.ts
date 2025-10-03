import { Produto } from "../models/produto";
/**
 * Lista todos os produtos cadastrados
 */
export declare function listarProdutos(): Produto[];
/**
 * Cadastra um novo produto com ID automático
 */
export declare function cadastrarProduto(produto: Omit<Produto, "id">): Produto;
/**
 * Busca produto por ID
 */
export declare function buscarProdutoPorId(id: number): Produto | undefined;
/**
 * Busca produto por nome (parcial e case-insensitive)
 */
export declare function buscarProdutoPorNome(nome: string): Produto[];
/**
 * Atualiza produto existente
 */
export declare function atualizarProduto(produto: Produto): boolean;
/**
 * Exclui produto por ID
 */
export declare function excluirProdutoPorId(id: number): boolean;
/**
 * Lista produtos por categoria
 */
export declare function listarProdutosPorCategoria(categoria: Produto["categoria"]): Produto[];
//# sourceMappingURL=produtoService.d.ts.map