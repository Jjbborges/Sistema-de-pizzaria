import readlineSync = require("readline-sync");
import { cadastrarCliente, buscarClientePorCPF, listarTodosClientes } from "./services/cadastroService";
import { criarPedido, calcularTotalPedido, listarPedidos } from "./services/pedidoService";
import { Produto } from "./models/produto";
import { Cliente } from "./models/cliente";
import { listarProdutosPorCategoria, cadastrarProduto, listarProdutos, atualizarProduto, excluirProdutoPorId } from "./services/produtoService";
import { autenticarAdmin } from "./services/adminService";

// ----------------------
// Funções de entrada
// ----------------------
function obterString(prompt: string, validar?: (v: string) => boolean, erro?: string): string {
    let valor: string;
    do {
        valor = readlineSync.question(`${prompt}: `).trim();
        if (validar && !validar(valor)) {
            console.log(erro || "Entrada inválida!");
            valor = "";
        }
    } while (!valor);
    return valor;
}

function obterNumero(prompt: string, permitirZero = true): number {
    let numero: number;
    do {
        numero = readlineSync.questionFloat(`${prompt}: `);
        if (!permitirZero && numero < 0) console.log("Por favor, insira um número válido.");
    } while (!permitirZero && numero < 0);
    return numero;
}

function confirmarPergunta(prompt: string): boolean {
    return readlineSync.keyInYNStrict(prompt);
}

// ----------------------
// Estado da aplicação
// ----------------------
let clienteAtual: Cliente | undefined;
let carrinho: { item: Produto; quantidade: number }[] = [];

// ----------------------
// Escolher item do cardápio
// ----------------------
function escolherItem(cardapio: Produto[]): { item: Produto; quantidade: number } | null {
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
function gerarRecibo(cliente: Cliente, itens: { item: Produto; quantidade: number }[], total: number, pagamento: string, endereco: string, observacao: string): string {
    let recibo = "\n===== RECIBO PIZZARIA Parma =====\n";
    recibo += `Cliente: ${cliente.nome}\n`;
    recibo += `CPF: ${cliente.cpf}\n`;
    recibo += `Endereço: ${endereco}\n`;
    recibo += `Data: ${new Date().toLocaleString()}\n`;
    if (observacao) recibo += `Observação: ${observacao}\n`;
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
function obterCardapio(categoria: "pizza" | "bebida" | "sobremesa") {
    return listarProdutosPorCategoria(categoria);
}

// ----------------------
// Pizza mais pedida
// ----------------------
function pizzaMaisPedidaGlobal(): void {
    const contagem: Record<string, number> = {};
    listarPedidos().forEach(pedido => {
        pedido.itens.forEach(i => {
            contagem[i.item.nome] = (contagem[i.item.nome] || 0) + i.quantidade;
        });
    });
    const maisPedida = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0];
    console.log(`Pizza mais pedida da galera: ${maisPedida ? `${maisPedida[0]} (${maisPedida[1]}x)` : "Nenhuma pizza ainda"}`);
}

// ----------------------
// Menu Admin
// ----------------------
function menuAdmin(): void {
    const usuario = obterString("Usuário admin");
    const senha = obterString("Senha");

    if (!autenticarAdmin(usuario, senha)) {
        console.log("Usuário ou senha inválidos!");
        return;
    }

    console.log(`\nBem-vindo, ${usuario}!`);

    // Aqui você pode colocar as funções de CRUD de produtos, clientes e pedidos
}

// ----------------------
// Menu principal
// ----------------------
function mostrarMenuPrincipal(): void {
    console.log("\n===== PIZZARIA PARMA =====");
    console.log("1 - Cadastrar/Login Cliente");
    if (clienteAtual) {
        console.log("2 - Fazer Pedido");
        console.log("3 - Meu Histórico de Compras");
        console.log("4 - Pizza Mais Pedida");
    }
    console.log("5 - Login Admin");
    console.log("0 - Sair");

    if (clienteAtual) console.log(`\nCliente Atual: ${clienteAtual.nome} | CPF: ${clienteAtual.cpf}`);
}

// ----------------------
// Principal
// ----------------------
function main(): void {
    while (true) {
        mostrarMenuPrincipal();
        const opcao = obterNumero("Escolha uma opção");

        switch (opcao) {
            case 1:
                const cpf = obterString("Digite seu CPF", v => /^\d{11}$/.test(v), "CPF deve ter 11 números.");
                let cliente = buscarClientePorCPF(cpf);
                if (cliente) {
                    console.log(`Bem-vindo de volta, ${cliente.nome}!`);
                    clienteAtual = cliente;
                } else {
                    const nome = obterString("Digite seu nome completo");
                    const telefone = obterString("Digite seu telefone");
                    const endereco = obterString("Digite seu endereço");
                    clienteAtual = cadastrarCliente({ nome, cpf, telefone, endereco });
                    console.log("Cadastro realizado com sucesso!");
                }
                break;

            case 2:
                if (!clienteAtual) { console.log("Faça login primeiro."); break; }

                while (true) {
                    console.log("\n--- GERENCIAR PEDIDO ---");
                    console.log("1 - Adicionar Pizza");
                    console.log("2 - Adicionar Bebida");
                    console.log("3 - Adicionar Sobremesa");
                    console.log("4 - Finalizar Pedido");
                    console.log("0 - Voltar");

                    const opPedido = obterNumero("Escolha uma opção");
                    let item: { item: Produto; quantidade: number } | null = null;

                    if (opPedido === 1) item = escolherItem(obterCardapio("pizza"));
                    else if (opPedido === 2) item = escolherItem(obterCardapio("bebida"));
                    else if (opPedido === 3) item = escolherItem(obterCardapio("sobremesa"));

                    if (item) {
                        carrinho.push(item);
                        console.log(` ${item.quantidade}x ${item.item.nome} adicionado(s) ao carrinho!`);
                    }

                    if (opPedido === 4) {
                        if (carrinho.length === 0) { console.log("Carrinho vazio!"); continue; }
                        const observacao = confirmarPergunta("Deseja adicionar alguma observacao?") ? obterString("Digite sua observacao") : "";
                        const enderecoConfirmado = confirmarPergunta(`Deseja confirmar o endereco atual? ${clienteAtual.endereco}`) ? clienteAtual.endereco : obterString("Digite seu endereco de entrega");
                        const pagamentoInput = obterString("Forma de pagamento (Dinheiro / Cartao / Pix)",
                            v => ["dinheiro", "cartao", "pix"].includes(v.toLowerCase()));
                        const pagamento = pagamentoInput.toLowerCase() as "dinheiro" | "cartao" | "pix";

                        const total = calcularTotalPedido(carrinho);
                        criarPedido(clienteAtual!, carrinho, total, pagamento, enderecoConfirmado, observacao);

                        console.log(gerarRecibo(clienteAtual!, carrinho, total, pagamento, enderecoConfirmado, observacao));
                        carrinho = [];
                        break;
                    }

                    if (opPedido === 0) break;
                }
                break;

            case 3:
                if (!clienteAtual) { console.log("Faça login primeiro."); break; }
                console.log("\n--- Histórico de Compras ---");
                clienteAtual.historicoPedidos.forEach((p: { data: any; total: number; }) => console.log(`- Pedido em ${p.data}: R$${p.total.toFixed(2)}`));
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
