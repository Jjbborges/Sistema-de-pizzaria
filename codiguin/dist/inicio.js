"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
// Array constante que representa o cardápio disponível na pizzaria
const cardapio = [
    { id: 1, nome: "Mussarela", preco: 60.00 },
    { id: 2, nome: "Calabresa", preco: 60.00 },
    { id: 3, nome: "Portuguesa", preco: 60.00 },
    { id: 4, nome: "Frango c/ Catupiry", preco: 60.00 },
    { id: 5, nome: "2 Queijos", preco: 60.00 },
];
// Array que armazena as pizzas selecionadas pelo usuário (estado do carrinho)
let carrinho = [];
// MARK: - ENTRADA (Funções responsáveis por obter dados do usuário)
/**
 * Solicita ao usuário que escolha uma opção do menu.
 * @returns O número inteiro da opção escolhida.
 */
function obterOpcaoDoMenu() {
    return readlineSync.questionInt("\nEscolha uma opção: ");
}
/**
 * Solicita ao usuário o ID da pizza que deseja adicionar ao carrinho.
 * @returns O ID inteiro da pizza escolhida.
 */
function obterEscolhaDePizza() {
    return readlineSync.questionInt("\nDigite o número da pizza que deseja: ");
}
// MARK: - SAIDA (Funções responsáveis por exibir informações ao usuário)
/**
 * Exibe o menu principal da pizzaria no console.
 */
function mostrarMenu() {
    console.log("\n===== PIZZARIA MIMI =====");
    console.log("1 - Ver cardápio");
    console.log("2 - Adicionar pizza ao carrinho");
    console.log("3 - Ver carrinho");
    console.log("4 - Finalizar pedido");
    console.log("0 - Sair");
}
/**
 * Exibe todos os itens do cardápio com seus IDs, nomes e preços.
 */
function exibirCardapio() {
    console.log("\n--- CARDÁPIO ---");
    cardapio.forEach((pizza) => {
        console.log(`${pizza.id} - ${pizza.nome} - R$ ${pizza.preco.toFixed(2)}`);
    });
}
/**
 * Exibe o conteúdo atual do carrinho de compras e o total.
 */
function exibirCarrinho() {
    console.log("\n--- SEU CARRINHO ---");
    if (carrinho.length === 0) {
        console.log("Seu carrinho está vazio no momento.");
        return;
    }
    let total = 0;
    carrinho.forEach((pizza, index) => {
        console.log(`${index + 1}. ${pizza.nome} - R$ ${pizza.preco.toFixed(2)}`);
        total += pizza.preco;
    });
    console.log(`\nTotal do Pedido: R$ ${total.toFixed(2)}`);
}
/**
 * Exibe uma mensagem de sucesso ao finalizar o pedido e encerra o programa.
 */
function mensagemFinalizarPedidoESair() {
    console.log("\n🎉 Pedido finalizado com sucesso! Muito obrigado pela preferência 🍕 Esperamos vê-lo novamente em breve!");
    process.exit(0);
}
/**
 * Exibe uma mensagem de despedida e encerra o programa.
 */
function mensagemSairDoPrograma() {
    console.log("👋 Saindo do programa... Até a próxima!");
    process.exit(0);
}
/**
 * Exibe uma mensagem de erro para opções inválidas.
 */
function exibirMensagemErroOpcaoInvalida() {
    console.log("❌ Opção inválida! Por favor, escolha um número entre 0 e 4.");
}
/**
 * Exibe uma mensagem de erro para escolha de pizza inválida.
 */
function exibirMensagemErroPizzaInvalida() {
    console.log("Opção inválida. Por favor, escolha um número de pizza válido.");
}
/**
 * Exibe uma mensagem informando que o carrinho está vazio para finalizar pedido.
 */
function exibirMensagemCarrinhoVazioParaFinalizar() {
    console.log("\nSeu carrinho está vazio! Adicione algumas pizzas antes de finalizar.");
}
/**
 * Exibe uma mensagem de confirmação de que a pizza foi adicionada.
 * @param nomePizza O nome da pizza que foi adicionada.
 */
function exibirPizzaAdicionadaComSucesso(nomePizza) {
    console.log(`${nomePizza} adicionada ao carrinho!`);
}
// MARK: - PROCESSO (Funções que manipulam dados e controlam o fluxo)
/**
 * Adiciona uma pizza selecionada pelo usuário ao carrinho.
 * Envolve etapas de exibição de saída, entrada e manipulação de variáveis.
 */
function processarAdicionarPizza() {
    exibirCardapio(); // Saída
    const escolha = obterEscolhaDePizza(); // Entrada
    const pizzaSelecionada = cardapio.find((p) => p.id === escolha); // Processo: busca no cardápio
    if (pizzaSelecionada) {
        carrinho.push(pizzaSelecionada); // Processo: adiciona ao carrinho (variável)
        exibirPizzaAdicionadaComSucesso(pizzaSelecionada.nome); // Saída
    }
    else {
        exibirMensagemErroPizzaInvalida(); // Saída
    }
}
/**
 * Gerencia o processo de finalização do pedido.
 * Verifica o carrinho e, se não estiver vazio, exibe o pedido e encerra.
 */
function processarFinalizarPedido() {
    if (carrinho.length === 0) {
        exibirMensagemCarrinhoVazioParaFinalizar(); // Saída
        return;
    }
    exibirCarrinho(); // Saída (exibe o carrinho antes de finalizar)
    mensagemFinalizarPedidoESair(); // Saída e Processo (encerra o programa)
}
/**
 * Função principal que coordena o fluxo da aplicação,
 * integrando entrada, saída e processos.
 */
function main() {
    let opcao;
    do {
        mostrarMenu(); // Saída
        opcao = obterOpcaoDoMenu(); // Entrada
        switch (opcao) {
            case 1:
                exibirCardapio(); // Saída
                break;
            case 2:
                processarAdicionarPizza(); // Processo (que envolve Entrada e Saída)
                break;
            case 3:
                exibirCarrinho(); // Saída
                break;
            case 4:
                processarFinalizarPedido(); // Processo (que envolve Saída)
                break;
            case 0:
                mensagemSairDoPrograma(); // Saída e Processo (encerra o programa)
                break;
            default:
                exibirMensagemErroOpcaoInvalida(); // Saída
                break;
        }
    } while (true); // Loop infinito até que o usuário escolha '0' ou '4' para sair via process.exit(0)
}
// Inicia a aplicação
main();
//# sourceMappingURL=inicio.js.map