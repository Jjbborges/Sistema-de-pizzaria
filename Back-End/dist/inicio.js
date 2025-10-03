"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
const cadastroService_1 = require("./services/cadastroService");
const pedidoService_1 = require("./services/pedidoService");
const produtoService_1 = require("./services/produtoService");
const adminService_1 = require("./services/adminService");
const fileUtils_1 = require("./utils/fileUtils");
const path = require("path");
// ----------------------
// Funções de entrada
// ----------------------
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
// ----------------------
// Estado da aplicação
// ----------------------
let clienteAtual;
let carrinho = [];
// ----------------------
// Escolher item do cardápio
// ----------------------
function escolherItem(cardapio) {
    console.log("\n--- CARDÁPIO ---");
    cardapio.forEach((item) => console.log(`${item.id} - ${item.nome} - R$${item.preco.toFixed(2)} [${item.categoria}]`));
    const id = obterNumero("Digite o ID do produto que deseja", false);
    const itemEscolhido = cardapio.find((item) => item.id === id);
    if (!itemEscolhido) {
        console.log("Produto não encontrado!");
        return null;
    }
    const quantidade = obterNumero("Digite a quantidade desejada", false);
    return { item: itemEscolhido, quantidade };
}
// ----------------------
// Recibo
// ----------------------
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
// ----------------------
// Obter cardápio direto do JSON
// ----------------------
function obterCardapio(categoria) {
    return (0, produtoService_1.listarProdutosPorCategoria)(categoria);
}
// ----------------------
// Pizza mais pedida
// ----------------------
function pizzaMaisPedidaGlobal() {
    const contagem = {};
    (0, pedidoService_1.listarPedidos)().forEach(pedido => {
        pedido.itens.forEach(i => {
            contagem[i.item.nome] = (contagem[i.item.nome] || 0) + i.quantidade;
        });
    });
    const maisPedida = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0];
    console.log(`Pizza mais pedida da galera: ${maisPedida ? `${maisPedida[0]} (${maisPedida[1]}x)` : "Nenhuma pizza ainda"}`);
}
// ----------------------
// Menu Admin completo
// ----------------------
function menuAdmin() {
    const usuario = obterString("Usuário admin");
    const senha = obterString("Senha");
    if (!(0, adminService_1.autenticarAdmin)(usuario, senha)) {
        console.log("Usuário ou senha inválidos!");
        return;
    }
    console.log(`\nBem-vindo, ${usuario}!`);
    while (true) {
        console.log("\n=== MENU ADMIN ===");
        console.log("1 - Gerenciar Cardápio");
        console.log("2 - Gerenciar Clientes");
        console.log("3 - Gerenciar Pedidos");
        console.log("0 - Logout");
        const opcao = obterNumero("Escolha uma opção");
        switch (opcao) {
            case 1: { // Cardápio
                while (true) {
                    console.log("\n--- CARDÁPIO ---");
                    console.log("1 - Cadastrar Produto");
                    console.log("2 - Atualizar Produto");
                    console.log("3 - Excluir Produto");
                    console.log("4 - Listar Produtos");
                    console.log("0 - Voltar");
                    const op = obterNumero("Escolha uma opção");
                    switch (op) {
                        case 1: {
                            const nome = obterString("Nome do produto");
                            const preco = obterNumero("Preço do produto", false);
                            const categoria = obterString("Categoria (pizza/bebida/sobremesa)", v => ["pizza", "bebida", "sobremesa"].includes(v.toLowerCase()));
                            (0, produtoService_1.cadastrarProduto)({ nome, preco, categoria });
                            console.log("Produto cadastrado!");
                            break;
                        }
                        case 2: {
                            const id = obterNumero("ID do produto");
                            const prod = (0, produtoService_1.listarProdutos)().find(p => p.id === id);
                            if (!prod) {
                                console.log("Produto não encontrado!");
                                break;
                            }
                            const nome = obterString(`Nome atual: ${prod.nome}. Novo nome:`) || prod.nome;
                            const preco = obterNumero(`Preço atual: R$${prod.preco}. Novo preço:`) || prod.preco;
                            const categoria = obterString(`Categoria atual: ${prod.categoria}. Nova categoria:`, v => ["pizza", "bebida", "sobremesa"].includes(v.toLowerCase()));
                            (0, produtoService_1.atualizarProduto)({ id: prod.id, nome, preco, categoria });
                            console.log("Produto atualizado!");
                            break;
                        }
                        case 3: {
                            const id = obterNumero("ID do produto a excluir");
                            if ((0, produtoService_1.excluirProdutoPorId)(id))
                                console.log("Produto excluído!");
                            else
                                console.log("Produto não encontrado!");
                            break;
                        }
                        case 4:
                            (0, produtoService_1.listarProdutos)().forEach(p => console.log(`${p.id} - ${p.nome} - R$${p.preco.toFixed(2)} - ${p.categoria}`));
                            break;
                        case 0: break;
                        default:
                            console.log("Opção inválida!");
                            break;
                    }
                    if (op === 0)
                        break;
                }
                break;
            }
            case 2: { // Clientes
                while (true) {
                    console.log("\n--- CLIENTES ---");
                    console.log("1 - Listar Todos");
                    console.log("2 - Consultar Cliente (ID ou Nome)");
                    console.log("3 - Excluir Cliente");
                    console.log("0 - Voltar");
                    const op = obterNumero("Escolha uma opção");
                    switch (op) {
                        case 1:
                            (0, cadastroService_1.listarTodosClientes)().forEach(c => console.log(`${c.id} - ${c.nome} - ${c.cpf} - ${c.telefone}`));
                            break;
                        case 2: {
                            const busca = obterString("Digite ID ou Nome do cliente");
                            let cliente;
                            if (/^\d+$/.test(busca))
                                cliente = (0, cadastroService_1.listarTodosClientes)().find(c => c.id === parseInt(busca));
                            else
                                cliente = (0, cadastroService_1.listarTodosClientes)().find(c => c.nome.toLowerCase() === busca.toLowerCase());
                            if (!cliente) {
                                console.log("Cliente não encontrado!");
                                break;
                            }
                            console.log(`Nome: ${cliente.nome}\nCPF: ${cliente.cpf}\nTelefone: ${cliente.telefone}\nEndereço: ${cliente.endereco}`);
                            console.log("--- Histórico de Pedidos ---");
                            cliente.historicoPedidos.forEach(p => console.log(`- Pedido em ${p.data}: R$${p.total.toFixed(2)}`));
                            break;
                        }
                        case 3: {
                            const id = obterNumero("ID do cliente a excluir");
                            let clientes = (0, cadastroService_1.listarTodosClientes)();
                            const index = clientes.findIndex(c => c.id === id);
                            if (index === -1) {
                                console.log("Cliente não encontrado!");
                                break;
                            }
                            clientes.splice(index, 1);
                            (0, fileUtils_1.salvarJSON)(path.join(__dirname, "../../data/clientes.json"), clientes);
                            console.log("Cliente excluído!");
                            break;
                        }
                        case 0: break;
                        default:
                            console.log("Opção inválida!");
                            break;
                    }
                    if (op === 0)
                        break;
                }
                break;
            }
            case 3: { // Pedidos
                while (true) {
                    console.log("\n--- PEDIDOS ---");
                    console.log("1 - Listar Todos");
                    console.log("2 - Buscar Pedido por ID");
                    console.log("3 - Buscar Pedidos por Cliente (Nome ou CPF)");
                    console.log("4 - Atualizar Status do Pedido");
                    console.log("0 - Voltar");
                    const op = obterNumero("Escolha uma opção");
                    switch (op) {
                        case 1:
                            (0, pedidoService_1.listarPedidos)().forEach(p => console.log(`Pedido ${p.id} | Cliente: ${p.clienteNome} | Total: R$${p.total.toFixed(2)} | Status: ${p.status}`));
                            break;
                        case 2: {
                            const id = obterNumero("Digite ID do pedido");
                            const pedido = (0, pedidoService_1.listarPedidos)().find(p => p.id === id);
                            if (!pedido) {
                                console.log("Pedido não encontrado!");
                                break;
                            }
                            console.log(`Pedido ${pedido.id} | Cliente: ${pedido.clienteNome} | Total: R$${pedido.total.toFixed(2)} | Status: ${pedido.status}`);
                            break;
                        }
                        case 3: {
                            const busca = obterString("Digite Nome ou CPF do cliente");
                            const pedidos = (0, pedidoService_1.listarPedidos)().filter(p => p.clienteNome.toLowerCase() === busca.toLowerCase() ||
                                (() => {
                                    const cliente = (0, cadastroService_1.listarTodosClientes)().find(c => c.id === p.clienteId);
                                    return cliente ? cliente.cpf === busca : false;
                                })());
                            if (pedidos.length === 0) {
                                console.log("Nenhum pedido encontrado!");
                                break;
                            }
                            pedidos.forEach(p => console.log(`Pedido ${p.id} | Cliente: ${p.clienteNome} | Total: R$${p.total.toFixed(2)} | Status: ${p.status}`));
                            break;
                        }
                        case 4: {
                            const id = obterNumero("Digite ID do pedido");
                            const pedido = (0, pedidoService_1.listarPedidos)().find(p => p.id === id);
                            if (!pedido) {
                                console.log("Pedido não encontrado!");
                                break;
                            }
                            const statusInput = obterString("Novo status (pendente / preparo / entregue)", v => ["pendente", "preparo", "entregue"].includes(v.toLowerCase()));
                            pedido.status = statusInput.toLowerCase();
                            console.log("Status atualizado!");
                            break;
                        }
                        case 0: break;
                        default:
                            console.log("Opção inválida!");
                            break;
                    }
                    if (op === 0)
                        break;
                }
                break;
            }
            case 0:
                console.log("Logout admin...");
                return;
            default:
                console.log("Opção inválida!");
                break;
        }
    }
}
// ----------------------
// Menu principal
// ----------------------
function mostrarMenuPrincipal() {
    console.log("\n===== PIZZARIA PARMA =====");
    console.log("1 - Cadastrar/Login Cliente");
    if (clienteAtual) {
        console.log("2 - Fazer Pedido");
        console.log("3 - Meu Histórico de Compras");
        console.log("4 - Pizza Mais Pedida");
    }
    console.log("5 - Login Admin");
    console.log("0 - Sair");
    if (clienteAtual)
        console.log(`\nCliente Atual: ${clienteAtual.nome} | CPF: ${clienteAtual.cpf}`);
}
// ----------------------
// Principal
// ----------------------
function main() {
    while (true) {
        mostrarMenuPrincipal();
        const opcao = obterNumero("Escolha uma opção");
        switch (opcao) {
            case 1:
                // Login ou cadastro do cliente
                const cpf = obterString("Digite seu CPF", v => /^\d{11}$/.test(v), "CPF deve ter 11 números.");
                let cliente = (0, cadastroService_1.buscarClientePorCPF)(cpf);
                if (cliente) {
                    console.log(`Bem-vindo de volta, ${cliente.nome}!`);
                    clienteAtual = cliente;
                }
                else {
                    const nome = obterString("Digite seu nome completo");
                    const telefone = obterString("Digite seu telefone");
                    const endereco = obterString("Digite seu endereço");
                    clienteAtual = (0, cadastroService_1.cadastrarCliente)({ nome, cpf, telefone, endereco });
                    console.log("Cadastro realizado com sucesso!");
                }
                break;
            case 2:
                if (!clienteAtual) {
                    console.log("Faça login primeiro.");
                    break;
                }
                while (true) {
                    console.log("\n--- GERENCIAR PEDIDO ---");
                    console.log("1 - Adicionar Pizza");
                    console.log("2 - Adicionar Bebida");
                    console.log("3 - Adicionar Sobremesa");
                    console.log("4 - Finalizar Pedido");
                    console.log("0 - Voltar");
                    const opPedido = obterNumero("Escolha uma opção");
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
                        const pagamentoInput = obterString("Forma de pagamento (Dinheiro / Cartao / Pix)", v => ["dinheiro", "cartao", "pix"].includes(v.toLowerCase()));
                        const pagamento = pagamentoInput.toLowerCase();
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
                    console.log("Faça login primeiro.");
                    break;
                }
                console.log("\n--- Histórico de Compras ---");
                clienteAtual.historicoPedidos.forEach(p => console.log(`- Pedido em ${p.data}: R$${p.total.toFixed(2)}`));
                break;
            case 4:
                pizzaMaisPedidaGlobal();
                break;
            case 5:
                menuAdmin();
                break;
            case 0:
                console.log("Saindo...");
                process.exit(0);
            default:
                console.log("Opção inválida!");
                break;
        }
    }
}
// Inicia
main();
//# sourceMappingURL=inicio.js.map