"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
const cadastroService_1 = require("./services/cadastroService");
const pedidoService_1 = require("./services/pedidoService");
const cardapio_1 = require("./data/cardapio");
// --- Funções de entrada ---
function obterString(prompt) {
    return readlineSync.question(`\n${prompt}: `);
}
function obterNumero(prompt) {
    return readlineSync.questionInt(`\n${prompt}: `);
}
// --- Função para escolher item do cardápio ---
function escolherItem(cardapio) {
    console.log("\n--- CARDÁPIO ---");
    cardapio.forEach((item) => console.log(`${item.id} - ${item.nome} - R$${item.preco.toFixed(2)}`));
    const idStr = obterString("Digite o ID do produto que deseja");
    const id = Number(idStr);
    if (isNaN(id)) {
        console.log("❌ ID inválido!");
        return null;
    }
    const itemEscolhido = cardapio.find((item) => item.id === id);
    if (!itemEscolhido) {
        console.log("❌ Produto não encontrado!");
        return null;
    }
    const quantidade = obterNumero("Digite a quantidade desejada");
    return {
        item: itemEscolhido,
        quantidade,
    };
}
// --- Estado da aplicação ---
let clienteAtual;
let carrinho = [];
// --- Menu principal ---
function mostrarMenuPrincipal() {
    console.log("\n===== PIZZARIA MIMI =====");
    console.log("1 - Cadastrar/Login Cliente");
    console.log("2 - Pedir");
    console.log("3 - Meu Histórico de Compras");
    console.log("4 - Consulta por CPF");
    console.log("5 - Pizza Mais Pedida");
    console.log("0 - Sair");
    if (clienteAtual) {
        console.log(`\nCliente Atual: ${clienteAtual.nome} | CPF: ${clienteAtual.cpf}`);
    }
    else {
        console.log("\nNenhum cliente logado.");
    }
}
// --- Loop principal ---
function main() {
    while (true) {
        mostrarMenuPrincipal();
        const opcao = obterNumero("Escolha uma opção");
        switch (opcao) {
            // --- Cadastro/Login Cliente ---
            case 1:
                const nome = obterString("Digite seu nome completo");
                const cpf = obterString("Digite seu CPF");
                const telefone = obterString("Digite seu telefone");
                const endereco = obterString("Digite seu endereço");
                const clienteId = Date.now(); // ID único
                clienteAtual = {
                    id: clienteId,
                    nome,
                    cpf,
                    telefone,
                    endereco,
                    historicoPedidos: []
                };
                (0, cadastroService_1.cadastrarCliente)(clienteAtual);
                console.log(`✅ Cliente ${nome} cadastrado com sucesso!`);
                break;
            // --- Pedir ---
            case 2:
                if (!clienteAtual) {
                    console.log("❌ Faça login ou cadastre-se antes de criar um pedido.");
                    break;
                }
                while (true) {
                    console.log("\n--- GERENCIAR PEDIDO ---");
                    console.log("1 - Adicionar Pizza");
                    console.log("2 - Adicionar Bebida");
                    console.log("3 - Adicionar Sobremesa");
                    console.log("4 - Finalizar Pedido");
                    console.log("0 - Voltar ao menu principal");
                    const opPedido = obterNumero("Escolha uma opção");
                    let item = null;
                    if (opPedido === 1)
                        item = escolherItem(cardapio_1.pizzas);
                    else if (opPedido === 2)
                        item = escolherItem(cardapio_1.bebidas);
                    else if (opPedido === 3)
                        item = escolherItem(cardapio_1.sobremesas);
                    if (item) {
                        carrinho.push(item);
                        console.log(`✅ ${item.quantidade}x ${item.item.nome} adicionado(s) ao carrinho!`);
                    }
                    if (opPedido === 4) {
                        if (carrinho.length === 0) {
                            console.log("❌ Carrinho vazio!");
                            continue;
                        }
                        const total = (0, pedidoService_1.calcularTotalPedido)(carrinho);
                        (0, pedidoService_1.criarPedido)(clienteAtual, carrinho, total);
                        console.log(`🎉 Pedido finalizado! Total: R$ ${total.toFixed(2)}`);
                        carrinho = [];
                        break;
                    }
                    if (opPedido === 0)
                        break;
                }
                break;
            // --- Histórico de Compras ---
            case 3:
                if (!clienteAtual) {
                    console.log("❌ Faça login para consultar o histórico.");
                    break;
                }
            // --- Sair ---
            case 0:
                console.log("👋 Saindo do sistema...");
                process.exit(0);
            default:
                console.log("❌ Opção inválida!");
                break;
        }
    }
}
// Inicia o sistema
main();
//# sourceMappingURL=inicio.js.map