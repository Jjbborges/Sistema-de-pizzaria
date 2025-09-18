"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readlineSync = require("readline-sync");
// --- Dados do Cardápio ---
const cardapioCategorizado = {
    pizzas: [
        { id: 1, nome: "Mussarela", preco: 60.00 },
        { id: 2, nome: "Calabresa", preco: 60.00 },
        { id: 3, nome: "Portuguesa", preco: 60.00 },
        { id: 4, nome: "Frango c/ Catupiry", preco: 60.00 },
        { id: 5, nome: "2 Queijos", preco: 60.00 },
    ],
    bebidas: [
        { id: 6, nome: "Refrigerante Lata", preco: 7.00 },
        { id: 7, nome: "Água Mineral", preco: 5.00 },
        { id: 8, nome: "Suco Natural", preco: 10.00 },
    ],
    sobremesas: [
        { id: 9, nome: "Mousse de Chocolate", preco: 15.00 },
        { id: 10, nome: "Pudim", preco: 12.00 },
    ],
};
// --- Dados do Sistema ---
let clientes = [];
let proximoClienteId = 1; // Contador para gerar IDs internos de cliente
// --- Estado do Pedido Atual ---
let carrinho = []; // O carrinho armazena PedidoItem (item + quantidade)
let clienteAtual; // O cliente logado/identificado no momento
const CAMINHO_CSV = "historico_vendas.csv";
// MARK: - ENTRADA (Funções responsáveis por obter dados do usuário)
/**
 * Solicita ao usuário que escolha uma opção do menu.
 * @param prompt Mensagem a ser exibida para o usuário.
 * @returns O número inteiro da opção escolhida.
 */
function obterOpcao(prompt) {
    return readlineSync.questionInt(`\n${prompt}: `);
}
/**
 * Solicita ao usuário uma string (nome, telefone, endereço, etc.).
 * @param prompt Mensagem a ser exibida.
 * @returns A string inserida pelo usuário.
 */
function obterString(prompt) {
    return readlineSync.question(`\n${prompt}: `);
}
/**
 * Solicita ao usuário uma quantidade.
 * @param prompt Mensagem a ser exibida.
 * @returns A quantidade inserida pelo usuário.
 */
function obterQuantidade(prompt) {
    let quantidade;
    do {
        quantidade = readlineSync.questionInt(`\n${prompt}: `);
        if (quantidade <= 0) {
            console.log("A quantidade deve ser um número positivo.");
        }
    } while (quantidade <= 0);
    return quantidade;
}
// MARK: - SAIDA (Funções responsáveis por exibir informações ao usuário)
/**
 * Exibe o menu principal da pizzaria no console.
 */
function mostrarMenuPrincipal() {
    console.log("\n===== PIZZARIA MIMI =====");
    console.log("1 - Cadastrar/Login Cliente");
    console.log("2 - Gerenciar Pedido Atual (Cardápio, Carrinho)");
    console.log("3 - Meu Histórico de Compras"); // Apenas para o cliente logado
    console.log("0 - Sair");
    if (clienteAtual) {
        console.log(`\nCliente Atual: ${clienteAtual.nome} (Tel: ${clienteAtual.telefone})`);
    }
    else {
        console.log("\nNenhum cliente logado.");
    }
}
/**
 * Exibe as categorias do cardápio.
 */
function mostrarMenuCardapio() {
    console.log("\n--- CATEGORIAS DO CARDÁPIO ---");
    console.log("1 - Pizzas");
    console.log("2 - Bebidas");
    console.log("3 - Sobremesas");
    console.log("0 - Voltar");
}
/**
 * Exibe as opções de gerenciamento de pedido (dentro do fluxo de um cliente identificado).
 */
function mostrarMenuGerenciarPedido() {
    console.log("\n--- GERENCIAR PEDIDO ---");
    console.log("1 - Ver Cardápio e Adicionar Itens");
    console.log("2 - Ver Carrinho");
    console.log("3 - Finalizar Pedido");
    console.log("0 - Voltar ao Menu Principal");
}
/**
 * Exibe os itens de uma categoria específica do cardápio.
 * @param categoria Nome da categoria (ex: "Pizzas").
 * @param itens Array de itens da categoria.
 */
function exibirItensDoCardapio(categoria, itens) {
    console.log(`\n--- ${categoria.toUpperCase()} ---`);
    if (itens.length === 0) {
        console.log(`Nenhum item disponível em ${categoria}.`);
        return;
    }
    itens.forEach((item) => {
        console.log(`${item.id} - ${item.nome} - R$ ${item.preco.toFixed(2)}`);
    });
    console.log("0 - Voltar");
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
    carrinho.forEach((pedidoItem, index) => {
        const subtotal = pedidoItem.item.preco * pedidoItem.quantidade;
        console.log(`${index + 1}. ${pedidoItem.item.nome} (x${pedidoItem.quantidade}) - R$ ${subtotal.toFixed(2)}`);
        total += subtotal;
    });
    console.log(`\nTotal do Pedido: R$ ${total.toFixed(2)}`);
}
/**
 * Exibe o histórico de pedidos de um cliente.
 * @param cliente O cliente cujo histórico será exibido.
 */
function exibirHistoricoCliente(cliente) {
    console.log(`\n--- HISTÓRICO DE COMPRAS DE ${cliente.nome.toUpperCase()} (Tel: ${cliente.telefone}) ---`);
    if (cliente.historicoPedidos.length === 0) {
        console.log("Nenhum pedido registrado para este cliente.");
        return;
    }
    let itensMaisComprados = {};
    cliente.historicoPedidos.forEach((pedido) => {
        console.log(`\nPedido ID: ${pedido.id} | Data: ${pedido.data.toLocaleString()} | Total: R$ ${pedido.total.toFixed(2)}`);
        pedido.itens.forEach((pedidoItem) => {
            console.log(`  - ${pedidoItem.item.nome} (x${pedidoItem.quantidade})`);
            itensMaisComprados[pedidoItem.item.nome] = (itensMaisComprados[pedidoItem.item.nome] || 0) + pedidoItem.quantidade;
        });
    });
    // Itens mais comprados
    const itensOrdenados = Object.entries(itensMaisComprados).sort(([, a], [, b]) => b - a);
    if (itensOrdenados.length > 0) {
        console.log("\n--- SEUS ITENS MAIS COMPRADOS ---");
        itensOrdenados.slice(0, 5).forEach(([itemNome, quantidade]) => {
            console.log(`  - ${itemNome}: ${quantidade} unidades`);
        });
    }
}
/**
 * Exibe uma mensagem de sucesso ao finalizar o pedido.
 */
function exibirMensagemFinalizarPedido(pedidoId, nomeCliente, total) {
    console.log(`\n🎉 Pedido ID ${pedidoId} finalizado para ${nomeCliente}! Total: R$ ${total.toFixed(2)}`);
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
 * @param min Opção mínima permitida.
 * @param max Opção máxima permitida.
 */
function exibirMensagemErroOpcaoInvalida(min, max) {
    console.log(`❌ Opção inválida! Por favor, escolha um número entre ${min} e ${max}.`);
}
/**
 * Exibe uma mensagem de erro para escolha de item inválida.
 */
function exibirMensagemErroItemInvalido() {
    console.log("Opção inválida. Por favor, escolha um número de item válido.");
}
/**
 * Exibe uma mensagem informando que o carrinho está vazio para finalizar pedido.
 */
function exibirMensagemCarrinhoVazioParaFinalizar() {
    console.log("\nSeu carrinho está vazio! Adicione alguns itens antes de finalizar.");
}
/**
 * Exibe uma mensagem de confirmação de que o item foi adicionado.
 * @param nomeItem O nome do item que foi adicionado.
 * @param quantidade A quantidade adicionada.
 */
function exibirItemAdicionadoComSucesso(nomeItem, quantidade) {
    console.log(`${quantidade}x ${nomeItem} adicionado(s) ao carrinho!`);
}
/**
 * Exibe mensagem de cliente não encontrado.
 */
function exibirClienteNaoEncontrado() {
    console.log("❌ Cliente não encontrado com o número de telefone informado.");
}
/**
 * Exibe mensagem de cliente cadastrado.
 * @param cliente O cliente cadastrado.
 */
function exibirClienteCadastrado(cliente) {
    console.log(`✅ Cliente ${cliente.nome} cadastrado com sucesso! ID Interno: ${cliente.id}, Telefone: ${cliente.telefone}`);
}
/**
 * Exibe mensagem que é preciso fazer login para realizar um pedido.
 */
function exibirAvisoLoginNecessario() {
    console.log("\n❗ Por favor, faça login ou cadastre-se para prosseguir com o pedido ou ver seu histórico.");
    obterOpcao("Pressione Enter para continuar...");
}
/**
 * Exibe mensagem de telefone já cadastrado.
 */
function exibirTelefoneJaCadastrado() {
    console.log("❌ Este número de telefone já está cadastrado. Tente fazer login ou use outro número.");
}
// MARK: - PROCESSO (Funções que manipulam dados e controlam o fluxo)
/**
 * Salva o histórico de vendas de todos os clientes em um arquivo CSV.
 * O formato inclui detalhes do cliente, pedido e item.
 */
function salvarHistoricoVendasCSV() {
    let csv = "Cliente,Telefone,Data do Pedido,Item,Quantidade,Preço Unitário,Subtotal,Total do Pedido\n";
    clientes.forEach(cliente => {
        cliente.historicoPedidos.forEach(pedido => {
            pedido.itens.forEach(itemPedido => {
                const subtotal = itemPedido.item.preco * itemPedido.quantidade;
                csv += `${cliente.nome},${cliente.telefone},${pedido.data.toISOString()},${itemPedido.item.nome},${itemPedido.quantidade},${itemPedido.item.preco.toFixed(2)},${subtotal.toFixed(2)},${pedido.total.toFixed(2)}\n`;
            });
        });
    });
    try {
        fs.writeFileSync(CAMINHO_CSV, csv, "utf-8");
        console.log(`✅ Histórico de vendas salvo em: ${CAMINHO_CSV}`);
    }
    catch (error) {
        console.error("❌ Erro ao salvar o CSV:", error);
    }
}
/**
 * Encontra um item pelo seu ID em todas as categorias do cardápio.
 * @param id O ID do item a ser procurado.
 * @returns O item encontrado ou undefined se não for encontrado.
 */
function encontrarItemPorId(id) {
    for (const categoria in cardapioCategorizado) {
        const itens = cardapioCategorizado[categoria];
        const item = itens.find(i => i.id === id);
        if (item) {
            return item;
        }
    }
    return undefined;
}
/**
 * Adiciona ou atualiza um item no carrinho.
 * @param item O item do cardápio a ser adicionado.
 * @param quantidade A quantidade do item.
 */
function adicionarOuAtualizarCarrinho(item, quantidade) {
    const itemExistente = carrinho.find(pi => pi.item.id === item.id);
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    }
    else {
        carrinho.push({ item, quantidade });
    }
}
/**
 * Valida um número de telefone simples (apenas se é numérico e tem pelo menos 8 dígitos).
 * Em um sistema real, a validação seria muito mais robusta.
 * @param telefone O número de telefone a ser validado.
 * @returns true se o telefone for válido, false caso contrário.
 */
function validarTelefone(telefone) {
    return /^\d{8,}$/.test(telefone.replace(/\D/g, '')); // Remove não-dígitos e verifica
}
/**
 * Processa o cadastro de um novo cliente.
 * @param telefone O número de telefone do cliente.
 */
function processarNovoCadastroCliente(telefone) {
    const nome = obterString("Digite seu nome completo");
    const endereco = obterString("Digite seu endereço completo");
    const novoCliente = {
        id: proximoClienteId++,
        nome: nome,
        telefone: telefone,
        endereco: endereco,
        historicoPedidos: [],
    };
    clientes.push(novoCliente);
    clienteAtual = novoCliente; // Loga o cliente automaticamente após o cadastro
    exibirClienteCadastrado(novoCliente);
}
/**
 * Gerencia o processo de cadastro ou login do cliente.
 */
function processarCadastroOuLoginCliente() {
    let telefone;
    let clienteEncontrado;
    do {
        telefone = obterString("Digite seu número de telefone (apenas números, ex: 11987654321)");
        if (!validarTelefone(telefone)) {
            console.log("❗ Número de telefone inválido. Por favor, digite apenas números e certifique-se de ter pelo menos 8 dígitos.");
        }
    } while (!validarTelefone(telefone));
    clienteEncontrado = clientes.find(c => c.telefone === telefone);
    if (clienteEncontrado) {
        clienteAtual = clienteEncontrado;
        console.log(`\nBem-vindo(a) de volta, ${clienteAtual.nome}!`);
    }
    else {
        const cadastrar = obterString("Número de telefone não encontrado. Deseja cadastrar-se? (s/n)").toLowerCase();
        if (cadastrar === 's') {
            processarNovoCadastroCliente(telefone);
        }
        else {
            console.log("Operação cancelada. Voltando ao menu principal.");
        }
    }
}
/**
 * Processa a adição de um item ao carrinho, incluindo exibição do cardápio categorizado.
 */
function processarAdicionarItemAoCarrinho() {
    if (!clienteAtual) {
        exibirAvisoLoginNecessario();
        return;
    }
    let escolhaCategoria;
    do {
        mostrarMenuCardapio();
        escolhaCategoria = obterOpcao("Escolha uma categoria (0 para voltar)");
        let itensDaCategoria = [];
        let nomeCategoria = "";
        switch (escolhaCategoria) {
            case 1:
                itensDaCategoria = cardapioCategorizado.pizzas;
                nomeCategoria = "Pizzas";
                break;
            case 2:
                itensDaCategoria = cardapioCategorizado.bebidas;
                nomeCategoria = "Bebidas";
                break;
            case 3:
                itensDaCategoria = cardapioCategorizado.sobremesas;
                nomeCategoria = "Sobremesas";
                break;
            case 0:
                return; // Volta ao menu anterior
            default:
                exibirMensagemErroOpcaoInvalida(0, 3);
                continue;
        }
        let escolhaItem;
        do {
            exibirItensDoCardapio(nomeCategoria, itensDaCategoria);
            escolhaItem = obterOpcao(`Escolha um item de ${nomeCategoria} (0 para voltar)`);
            if (escolhaItem === 0) {
                break; // Volta para a escolha de categoria
            }
            const itemSelecionado = encontrarItemPorId(escolhaItem);
            if (itemSelecionado && itensDaCategoria.includes(itemSelecionado)) {
                const quantidade = obterQuantidade(`Quantas unidades de ${itemSelecionado.nome} deseja?`);
                adicionarOuAtualizarCarrinho(itemSelecionado, quantidade);
                exibirItemAdicionadoComSucesso(itemSelecionado.nome, quantidade);
                const continuarAdicionando = obterString("Deseja adicionar outro item desta categoria? (s/n)").toLowerCase();
                if (continuarAdicionando !== 's') {
                    break; // Sai do loop de itens, volta para categorias
                }
            }
            else {
                exibirMensagemErroItemInvalido();
            }
        } while (true);
    } while (escolhaCategoria !== 0);
}
/**
 * Gerencia o processo de finalização do pedido.
 * Calcula o total, cria um objeto de pedido e o associa ao cliente atual.
 */
function processarFinalizarPedido() {
    if (!clienteAtual) {
        exibirAvisoLoginNecessario();
        return;
    }
    if (carrinho.length === 0) {
        exibirMensagemCarrinhoVazioParaFinalizar();
        return;
    }
    exibirCarrinho();
    const confirmar = obterString("Confirmar pedido? (s/n)").toLowerCase();
    if (confirmar === 's') {
        const totalPedido = carrinho.reduce((sum, pi) => sum + (pi.item.preco * pi.quantidade), 0);
        const novoPedido = {
            id: "PED-" + Date.now().toString(), // ID mais descritivo e único
            data: new Date(),
            itens: [...carrinho], // Cria uma cópia para não alterar o carrinho original
            total: totalPedido,
        };
        clienteAtual.historicoPedidos.push(novoPedido);
        salvarHistoricoVendasCSV(); // Salva o histórico atualizado no CSV
        exibirMensagemFinalizarPedido(novoPedido.id, clienteAtual.nome, novoPedido.total);
        carrinho = []; // Limpa o carrinho após finalizar
        obterOpcao("Pressione Enter para voltar ao menu principal...");
    }
    else {
        console.log("\nPedido cancelado. Você pode continuar adicionando itens.");
        obterOpcao("Pressione Enter para continuar...");
    }
}
/**
 * Gerencia o menu e as ações relacionadas ao pedido atual do cliente.
 */
function processarGerenciarPedido() {
    if (!clienteAtual) {
        exibirAvisoLoginNecessario();
        return;
    }
    let opcaoGerenciarPedido;
    do {
        mostrarMenuGerenciarPedido();
        opcaoGerenciarPedido = obterOpcao("Escolha uma opção");
        switch (opcaoGerenciarPedido) {
            case 1: // Ver Cardápio e Adicionar Itens
                processarAdicionarItemAoCarrinho();
                break;
            case 2: // Ver Carrinho
                exibirCarrinho();
                obterOpcao("Pressione Enter para voltar...");
                break;
            case 3: // Finalizar Pedido
                processarFinalizarPedido();
                if (carrinho.length === 0) { // Se o pedido foi finalizado com sucesso, volta ao menu principal
                    return;
                }
                break;
            case 0: // Voltar ao Menu Principal
                return;
            default:
                exibirMensagemErroOpcaoInvalida(0, 3);
                break;
        }
    } while (true);
}
/**
 * Processa a visualização do histórico de compras do cliente logado.
 */
function processarMeuHistoricoDeCompras() {
    if (!clienteAtual) {
        exibirAvisoLoginNecessario();
        return;
    }
    exibirHistoricoCliente(clienteAtual);
    obterOpcao("Pressione Enter para voltar ao menu principal...");
}
/**
 * Função principal que coordena o fluxo da aplicação,
 * integrando entrada, saída e processos.
 */
function main() {
    // --- Clientes de teste pré-cadastrados ---
    clientes.push({
        id: proximoClienteId++,
        nome: "João Silva",
        telefone: "11987654321",
        endereco: "Rua A, 123",
        historicoPedidos: [],
    });
    clientes.push({
        id: proximoClienteId++,
        nome: "Maria Oliveira",
        telefone: "21991234567",
        endereco: "Av. B, 456",
        historicoPedidos: [],
    });
    console.log("Clientes de teste adicionados: João Silva (Tel: 11987654321), Maria Oliveira (Tel: 21991234567)");
    // --- Fim dos clientes de teste ---
    let opcao;
    do {
        mostrarMenuPrincipal();
        opcao = obterOpcao("Escolha uma opção");
        switch (opcao) {
            case 1: // Cadastrar/Login Cliente
                processarCadastroOuLoginCliente();
                obterOpcao("Pressione Enter para continuar...");
                break;
            case 2: // Gerenciar Pedido Atual
                processarGerenciarPedido();
                break;
            case 3: // Meu Histórico de Compras (cliente logado)
                processarMeuHistoricoDeCompras();
                break;
            case 0: // Sair
                mensagemSairDoPrograma();
                break;
            default:
                exibirMensagemErroOpcaoInvalida(0, 3); // Ajustado para 3 opções principais (sem admin)
                obterOpcao("Pressione Enter para continuar...");
                break;
        }
    } while (true);
}
// Inicia a aplicação
main();
//# sourceMappingURL=inicio.js.map