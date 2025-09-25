"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
const cadastroService_1 = require("./services/cadastroService");
const pedidoService_1 = require("./services/pedidoService");
const produtoService_1 = require("./services/produtoService");
// Funções de entrada e validação
function obterString(prompt, validar, erro) {
    let valor;
    do {
        valor = readlineSync.question(`${prompt}: `).trim();
        if (validar && !validar(valor)) {
            console.log(erro || "Entrada inválida!");
            valor = "";
        }
    } while (!valor);
    return valor;
}
function obterNumero(prompt, permitirZero = true) {
    let numero;
    do {
        numero = readlineSync.questionFloat(`${prompt}: `);
        if (!permitirZero && numero < 0)
            console.log("Por favor, insira um número válido.");
    } while (!permitirZero && numero < 0);
    return numero;
}
function confirmarPergunta(prompt) {
    return readlineSync.keyInYNStrict(prompt);
}
// Estado da aplicação
let clienteAtual;
let carrinho = [];
// MARK: cardápio
function escolherItem(cardapio) {
    console.log("\n--- CARDÁPIO ---");
    cardapio.forEach((item) => console.log(`${item.id} - ${item.nome} - R$${item.preco.toFixed(2)}`));
    const idStr = obterString("Digite o ID do produto que deseja");
    const id = Number(idStr);
    if (isNaN(id)) {
        console.log("ID inválido!");
        return null;
    }
    const itemEscolhido = cardapio.find((item) => item.id === id);
    if (!itemEscolhido) {
        console.log("Produto não encontrado!");
        return null;
    }
    const quantidade = obterNumero("Digite a quantidade desejada", false);
    return { item: itemEscolhido, quantidade };
}
// MARK: Menu
function mostrarMenuPrincipal() {
    console.log("\n===== PIZZARIA PARMA =====");
    console.log("1 - Cadastrar/Login");
    console.log("2 - Fazer pedido");
    console.log("3 - Meu Histórico de Compras");
    console.log("4 - Pizza Mais Pedida");
    console.log("5 - Gerenciar Cardápio");
    console.log("0 - Sair");
    if (clienteAtual)
        console.log(`\nCliente Atual: ${clienteAtual.nome} | CPF: ${clienteAtual.cpf}`);
    else
        console.log("\nNenhum cliente logado.");
}
// MARK: recibo
function gerarRecibo(cliente, itens, total, pagamento, endereco, observacao) {
    let recibo = "\n===== RECIBO PIZZARIA Parma =====\n";
    recibo += `Cliente: ${cliente.nome}\n`;
    recibo += `CPF: ${cliente.cpf}\n`;
    recibo += `Endereço: ${endereco}\n`;
    recibo += `Data: ${new Date().toLocaleString()}\n`;
    if (observacao)
        recibo += `Observação: ${observacao}\n`;
    recibo += "\nItens:\n";
    itens.forEach((p) => {
        recibo += `- ${p.quantidade}x ${p.item.nome} (R$${p.item.preco.toFixed(2)})\n`;
    });
    recibo += `\nTOTAL: R$${total.toFixed(2)}\n`;
    recibo += `Pagamento: ${pagamento}\n`;
    recibo += "================================\n";
    return recibo;
}
// MARK: Pizza mais pedida
function pizzaMaisPedida(cliente, periodo) {
    const contagem = {};
    const agora = new Date();
    cliente.historicoPedidos.forEach(pedido => {
        const dataPedido = new Date(pedido.data);
        let incluir = false;
        switch (periodo) {
            case "diario":
                incluir = dataPedido.toDateString() === agora.toDateString();
                break;
            case "semanal":
                const semanaAtual = Math.ceil((agora.getDate() + 6 - agora.getDay()) / 7);
                const semanaPedido = Math.ceil((dataPedido.getDate() + 6 - dataPedido.getDay()) / 7);
                incluir = semanaAtual === semanaPedido && dataPedido.getMonth() === agora.getMonth();
                break;
            case "mensal":
                incluir = dataPedido.getMonth() === agora.getMonth() && dataPedido.getFullYear() === agora.getFullYear();
                break;
            case "anual":
                incluir = dataPedido.getFullYear() === agora.getFullYear();
                break;
        }
        if (incluir) {
            pedido.itens.forEach(i => {
                contagem[i.item.nome] = (contagem[i.item.nome] || 0) + i.quantidade;
            });
        }
    });
    const maisPedida = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0];
    return maisPedida ? `${maisPedida[0]} (${maisPedida[1]}x)` : "Nenhuma pizza nesse período";
}
// MARK: Obter cardápio direto do CSV
function obterCardapio(categoria) {
    return (0, produtoService_1.listarProdutosPorCategoria)(categoria);
}
// MARK: Principal
function main() {
    while (true) {
        mostrarMenuPrincipal();
        const opcao = obterNumero("Escolha uma opção");
        switch (opcao) {
            case 1:
                const cpf = obterString("Digite seu CPF", (v) => /^\d{11}$/.test(v), "CPF deve ter 11 números.");
                let cliente = (0, cadastroService_1.buscarClientePorCPF)(cpf);
                if (cliente) {
                    console.log(`Bem-vindo de volta, ${cliente.nome}!`);
                    clienteAtual = cliente;
                }
                else {
                    const nome = obterString("Digite seu nome completo", (v) => /^[A-Za-z\s]+$/.test(v), "Nome inválido, sem números.");
                    const telefone = obterString("Digite seu telefone");
                    const endereco = obterString("Digite seu endereço");
                    const clienteId = Date.now();
                    clienteAtual = (0, cadastroService_1.cadastrarCliente)({ id: clienteId, nome, cpf, telefone, endereco, historicoPedidos: [] });
                    console.log("Cadastro realizado com sucesso!");
                }
                break;
            case 2:
                if (!clienteAtual) {
                    console.log(" Faça login ou cadastre-se antes de criar um pedido.");
                    break;
                }
                while (true) {
                    console.log("\n--- GERENCIAR PEDIDO ---");
                    console.log("1 - Adicionar Pizza");
                    console.log("2 - Adicionar Bebida");
                    console.log("3 - Adicionar Sobremesa");
                    console.log("4 - Finalizar Pedido");
                    console.log("0 - Voltar ao menu principal");
                    const opPedido = obterNumero("Escolha uma opcao");
                    let item = null;
                    if (opPedido === 1)
                        item = escolherItem(obterCardapio("pizza"));
                    else if (opPedido === 2)
                        item = escolherItem(obterCardapio("bebida"));
                    else if (opPedido === 3)
                        item = escolherItem(obterCardapio("sobremesa"));
                    if (item) {
                        carrinho.push(item);
                        console.log(` ${item.quantidade}x ${item.item.nome} adicionado(s) ao carrinho!`);
                    }
                    if (opPedido === 4) {
                        if (carrinho.length === 0) {
                            console.log("Carrinho vazio!");
                            continue;
                        }
                        const observacao = confirmarPergunta("Deseja adicionar alguma observacao?") ? obterString("Digite sua observacao") : "";
                        const enderecoConfirmado = confirmarPergunta(`Deseja confirmar o endereco atual? ${clienteAtual.endereco}`) ? clienteAtual.endereco : obterString("Digite seu endereco de entrega");
                        const pagamento = obterString("Digite a forma de pagamento (Dinheiro / Cartao / Pix)");
                        const total = (0, pedidoService_1.calcularTotalPedido)(carrinho);
                        (0, pedidoService_1.criarPedido)(clienteAtual, carrinho, total, pagamento, enderecoConfirmado, observacao);
                        console.log(gerarRecibo(clienteAtual, carrinho, total, pagamento, enderecoConfirmado, observacao));
                        carrinho = [];
                        break;
                    }
                    if (opPedido === 0)
                        break;
                }
                break;
            case 3:
                if (!clienteAtual) {
                    console.log("Faça login para consultar o histórico.");
                    break;
                }
                console.log("\n--- Histórico de Compras ---");
                clienteAtual.historicoPedidos.forEach((p) => console.log(`- Pedido em ${p.data}: R$${p.total.toFixed(2)}`));
                break;
            case 4:
                if (!clienteAtual) {
                    console.log("Faça login primeiro.");
                    break;
                }
                console.log("\n--- Pizza Mais Pedida ---");
                console.log(`Diário: ${pizzaMaisPedida(clienteAtual, "diario")}`);
                console.log(`Semanal: ${pizzaMaisPedida(clienteAtual, "semanal")}`);
                console.log(`Mensal: ${pizzaMaisPedida(clienteAtual, "mensal")}`);
                console.log(`Anual: ${pizzaMaisPedida(clienteAtual, "anual")}`);
                break;
            case 5:
                while (true) {
                    console.log("\n--- GERENCIAR CARDÁPIO ---");
                    console.log("1 - Cadastrar novo produto");
                    console.log("2 - Atualizar produto existente");
                    console.log("3 - Excluir produto");
                    console.log("4 - Listar produtos");
                    console.log("0 - Voltar ao menu principal");
                    const opCardapio = obterNumero("Escolha uma opção");
                    switch (opCardapio) {
                        case 1: {
                            const nomeNovo = obterString("Digite o nome do produto");
                            const precoNovo = obterNumero("Digite o preço do produto", false);
                            const categoriaNova = obterString("Digite a categoria (pizza / bebida / sobremesa)", v => ["pizza", "bebida", "sobremesa"].includes(v.toLowerCase()), "Categoria inválida");
                            const idNovo = Date.now();
                            (0, produtoService_1.cadastrarProduto)({ id: idNovo, nome: nomeNovo, preco: precoNovo, categoria: categoriaNova });
                            console.log("Produto cadastrado com sucesso!");
                            break;
                        }
                        case 2: {
                            const idAtualizar = obterNumero("Digite o ID do produto a atualizar", false);
                            const todosProdutos = (0, produtoService_1.listarProdutos)();
                            const prodAtualizar = todosProdutos.find(p => p.id === idAtualizar);
                            if (!prodAtualizar) {
                                console.log("Produto não encontrado!");
                                break;
                            }
                            const novoNome = obterString(`Nome atual: ${prodAtualizar.nome}. Novo nome:`);
                            const novoPreco = obterNumero(`Preço atual: R$${prodAtualizar.preco}. Novo preço:`, false);
                            const novaCategoria = obterString(`Categoria atual: ${prodAtualizar.categoria}. Nova categoria:`, v => ["pizza", "bebida", "sobremesa"].includes(v.toLowerCase()), "Categoria inválida");
                            if ((0, produtoService_1.atualizarProduto)({ id: prodAtualizar.id, nome: novoNome, preco: novoPreco, categoria: novaCategoria })) {
                                console.log("Produto atualizado com sucesso!");
                            }
                            else {
                                console.log("Erro ao atualizar produto.");
                            }
                            break;
                        }
                        case 3: {
                            const idExcluir = obterNumero("Digite o ID do produto a excluir", false);
                            if ((0, produtoService_1.excluirProdutoPorId)(idExcluir)) {
                                console.log("Produto excluído com sucesso!");
                            }
                            else {
                                console.log("Produto não encontrado!");
                            }
                            break;
                        }
                        case 4: {
                            const todosProdutos = (0, produtoService_1.listarProdutos)();
                            console.log("\n--- PRODUTOS CADASTRADOS ---");
                            todosProdutos.forEach(p => console.log(`${p.id} - ${p.nome} - R$${p.preco.toFixed(2)} - ${p.categoria}`));
                            break;
                        }
                        case 0:
                            break;
                        default:
                            console.log("Opção inválida!");
                            break;
                    }
                    if (opCardapio === 0)
                        break;
                }
                break;
            case 0:
                console.log("Saindo do sistema...");
                process.exit(0);
            default:
                console.log("Opção inválida!");
                break;
        }
    }
}
// Inicia o sistema
main();
//# sourceMappingURL=inicio.js.map