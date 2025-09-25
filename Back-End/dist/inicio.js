"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
const cadastroService_1 = require("./services/cadastroService");
const pedidoService_1 = require("./services/pedidoService");
const cardapio_1 = require("./data/cardapio");
// --- Funções de entrada ---
function obterString(prompt) {
    let resposta = "";
    do {
        resposta = readlineSync.question(`${prompt}: `).trim();
        if (!resposta)
            console.log("❌ Entrada inválida.");
    } while (!resposta);
    return resposta;
}
function obterNumero(prompt) {
    let numero;
    do {
        numero = readlineSync.questionInt(`${prompt}: `);
        if (numero <= 0)
            console.log("❌ Insira um número positivo.");
    } while (numero <= 0);
    return numero;
}
// --- Estado da aplicação ---
let clienteAtual;
let carrinho = [];
// --- Função para mostrar cardápio e escolher item ---
function escolherItem(cardapio) {
    console.log("\n--- CARDÁPIO ---");
    cardapio.forEach(item => console.log(`${item.id} - ${item.nome} - R$${item.preco.toFixed(2)}`));
    const idStr = obterString("Digite o ID do produto que deseja");
    const id = Number(idStr);
    if (isNaN(id)) {
        console.log("ID inválido!");
        return null;
    }
    const itemEscolhido = cardapio.find(item => item.id === id);
    if (!itemEscolhido) {
        console.log("Produto não encontrado!");
        return null;
    }
    const quantidade = obterNumero("Digite a quantidade");
    return { item: itemEscolhido, quantidade };
}
// --- Menu principal ---
function mostrarMenuPrincipal() {
    console.log("\n===== PIZZARIA Parma =====");
    console.log("1 - Cadastrar/Login Cliente");
    console.log("2 - Pedir");
    console.log("3 - Meu Histórico de Compras");
    console.log("4 - Pizza Mais Pedida");
    console.log("0 - Sair");
    if (clienteAtual) {
        console.log(`\nCliente Atual: ${clienteAtual.nome} | CPF: ${clienteAtual.cpf}`);
    }
    else {
        console.log("\nNenhum cliente logado.");
    }
}
// --- Função para gerar recibo ---
function gerarRecibo(cliente, itens, total, pagamento) {
    let recibo = "\n===== RECIBO PIZZARIA Parma =====\n";
    recibo += `Cliente: ${cliente.nome}\nCPF: ${cliente.cpf}\nEndereço: ${cliente.endereco}\n`;
    recibo += `Data: ${new Date().toLocaleString()}\n`;
    recibo += "\nItens:\n";
    itens.forEach(p => {
        recibo += `- ${p.quantidade}x ${p.item.nome} (R$${p.item.preco.toFixed(2)})\n`;
    });
    recibo += `\nTOTAL: R$${total.toFixed(2)}\nPagamento: ${pagamento}\n`;
    recibo += "================================\n";
    return recibo;
}
// --- Loop principal ---
function main() {
    while (true) {
        mostrarMenuPrincipal();
        const opcao = obterNumero("Escolha uma opção");
        switch (opcao) {
            // --- Cadastro/Login ---
            case 1: {
                const cpf = obterString("Digite seu CPF");
                const clienteExistente = (0, cadastroService_1.buscarClientePorCPF)(cpf);
                if (clienteExistente) {
                    clienteAtual = clienteExistente;
                    console.log(`✅ Bem-vindo de volta, ${clienteAtual.nome}!`);
                }
                else {
                    const nome = obterString("Digite seu nome completo");
                    const telefone = obterString("Digite seu telefone");
                    const endereco = obterString("Digite seu endereço");
                    const clienteId = Date.now();
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
                }
                break;
            }
            // --- Pedir ---
            case 2:
                if (!clienteAtual) {
                    console.log("❌ Cadastre-se ou faça login antes de pedir.");
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
                        const pagamento = obterString("Informe a forma de pagamento (dinheiro/cartão/pix)");
                        (0, pedidoService_1.criarPedido)(clienteAtual, carrinho, total, pagamento);
                        const recibo = gerarRecibo(clienteAtual, carrinho, total, pagamento);
                        console.log(recibo);
                        carrinho = [];
                        break;
                    }
                    if (opPedido === 0)
                        break;
                }
                break;
            // --- Histórico de compras ---
            case 3:
                if (!clienteAtual) {
                    console.log("❌ Cadastre-se ou faça login para consultar o histórico.");
                    break;
                }
                if (clienteAtual.historicoPedidos.length === 0) {
                    console.log("Nenhum pedido registrado.");
                }
                else {
                    console.log("\n--- Histórico de Pedidos ---");
                    clienteAtual.historicoPedidos.forEach((p, idx) => console.log(`${idx + 1} - Total: R$${p.total.toFixed(2)} | Data: ${p.data.toLocaleString()}`));
                }
                break;
            // --- Pizza mais pedida ---
            case 4:
                const data = obterString("Digite a data (DD/MM/AAAA) ou deixe vazio para geral");
                // Aqui você chamaria a função que calcula pizza mais pedida passando a data
                console.log("Função de pizza mais pedida ainda precisa ser implementada.");
                break;
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