import { Produto } from "../models/produto";
export declare function cadastrarProduto(produto: Produto): Produto;
export declare function listarProdutos(): Produto[];
export declare function buscarProdutoPorId(id: number): Produto | undefined;
export declare function atualizarProduto(produto: Produto): boolean;
export declare function excluirProdutoPorId(id: number): boolean;
export declare function listarProdutosPorCategoria(categoria: Produto["categoria"]): Produto[];
//# sourceMappingURL=produtoService.d.ts.map