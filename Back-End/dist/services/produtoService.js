"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastrarProduto = cadastrarProduto;
exports.listarProdutos = listarProdutos;
exports.buscarProdutoPorId = buscarProdutoPorId;
exports.atualizarProduto = atualizarProduto;
exports.excluirProdutoPorId = excluirProdutoPorId;
exports.listarProdutosPorCategoria = listarProdutosPorCategoria;
const fileUtils_1 = require("../utils/fileUtils");
const CAMINHO_PRODUTOS = "csv/produtos.csv";
// --- Cadastrar um novo produto ---
function cadastrarProduto(produto) {
    const produtos = listarProdutos();
    produtos.push(produto);
    (0, fileUtils_1.salvarCSV)(CAMINHO_PRODUTOS, produtos.map(p => [
        p.id.toString(),
        p.nome,
        p.preco.toString(),
        p.categoria
    ]));
    return produto;
}
// --- Listar todos os produtos ---
function listarProdutos() {
    const linhas = (0, fileUtils_1.lerCSV)(CAMINHO_PRODUTOS);
    return linhas.map(linha => ({
        id: Number(linha[0]),
        nome: linha[1] || "",
        preco: Number(linha[2] || 0),
        categoria: linha[3]
    }));
}
// --- Buscar produto por ID ---
function buscarProdutoPorId(id) {
    const produtos = listarProdutos();
    return produtos.find(p => p.id === id);
}
// --- Atualizar produto existente ---
function atualizarProduto(produto) {
    const produtos = listarProdutos();
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index === -1)
        return false;
    produtos[index] = produto;
    (0, fileUtils_1.salvarCSV)(CAMINHO_PRODUTOS, produtos.map(p => [
        p.id.toString(),
        p.nome,
        p.preco.toString(),
        p.categoria
    ]));
    return true;
}
// --- Excluir produto por ID ---
function excluirProdutoPorId(id) {
    const produtos = listarProdutos();
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1)
        return false;
    produtos.splice(index, 1);
    (0, fileUtils_1.salvarCSV)(CAMINHO_PRODUTOS, produtos.map(p => [
        p.id.toString(),
        p.nome,
        p.preco.toString(),
        p.categoria
    ]));
    return true;
}
// --- Consultar produtos por categoria ---
function listarProdutosPorCategoria(categoria) {
    const produtos = listarProdutos();
    return produtos.filter(p => p.categoria === categoria);
}
//# sourceMappingURL=produtoService.js.map