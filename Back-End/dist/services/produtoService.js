"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProdutos = listarProdutos;
exports.cadastrarProduto = cadastrarProduto;
exports.buscarProdutoPorId = buscarProdutoPorId;
exports.buscarProdutoPorNome = buscarProdutoPorNome;
exports.atualizarProduto = atualizarProduto;
exports.excluirProdutoPorId = excluirProdutoPorId;
exports.listarProdutosPorCategoria = listarProdutosPorCategoria;
// src/services/produtoService.ts
const path = require("path");
const fileUtils_1 = require("../utils/fileUtils");
const CAMINHO_PRODUTOS = path.join(__dirname, "../../data/produtos.json");
/**
 * Gera um ID incremental baseado nos produtos existentes
 */
function gerarIdAutomatico(produtos) {
    if (produtos.length === 0)
        return 1;
    return Math.max(...produtos.map(p => p.id)) + 1;
}
/**
 * Lista todos os produtos cadastrados
 */
function listarProdutos() {
    try {
        return (0, fileUtils_1.lerJSON)(CAMINHO_PRODUTOS);
    }
    catch (err) {
        console.error("❌ Erro ao ler produtos:", err);
        return [];
    }
}
/**
 * Cadastra um novo produto com ID automático
 */
function cadastrarProduto(produto) {
    const produtos = listarProdutos();
    const novoProduto = {
        ...produto,
        id: gerarIdAutomatico(produtos),
    };
    produtos.push(novoProduto);
    try {
        (0, fileUtils_1.salvarJSON)(CAMINHO_PRODUTOS, produtos);
    }
    catch (err) {
        console.error("❌ Erro ao salvar produto:", err);
    }
    return novoProduto;
}
/**
 * Busca produto por ID
 */
function buscarProdutoPorId(id) {
    const produtos = listarProdutos();
    return produtos.find(p => p.id === id);
}
/**
 * Busca produto por nome (parcial e case-insensitive)
 */
function buscarProdutoPorNome(nome) {
    const produtos = listarProdutos();
    const termo = nome.toLowerCase();
    return produtos.filter(p => p.nome.toLowerCase().includes(termo));
}
/**
 * Atualiza produto existente
 */
function atualizarProduto(produto) {
    const produtos = listarProdutos();
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index === -1)
        return false;
    produtos[index] = produto;
    try {
        (0, fileUtils_1.salvarJSON)(CAMINHO_PRODUTOS, produtos);
    }
    catch (err) {
        console.error("❌ Erro ao atualizar produto:", err);
        return false;
    }
    return true;
}
/**
 * Exclui produto por ID
 */
function excluirProdutoPorId(id) {
    const produtos = listarProdutos();
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1)
        return false;
    produtos.splice(index, 1);
    try {
        (0, fileUtils_1.salvarJSON)(CAMINHO_PRODUTOS, produtos);
    }
    catch (err) {
        console.error("❌ Erro ao excluir produto:", err);
        return false;
    }
    return true;
}
/**
 * Lista produtos por categoria
 */
function listarProdutosPorCategoria(categoria) {
    const produtos = listarProdutos();
    return produtos.filter(p => p.categoria === categoria);
}
//# sourceMappingURL=produtoService.js.map