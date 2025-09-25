import readlineSync = require("readline-sync");
import { cadastrarCliente, buscarClientePorCPF } from "./services/cadastroService";
import { criarPedido, calcularTotalPedido } from "./services/pedidoService";
import { Cliente, PedidoItem, CardapioItem } from "./models/pedido";
import { pizzas, bebidas, sobremesas } from "./data/cardapio";

// --- Funções de entrada ---
function obterString(prompt: string): string {
  let resposta = "";
  do {
    resposta = readlineSync.question(`${prompt}: `).trim();
    if (!resposta) console.log("❌ Entrada inválida.");
  } while (!resposta);
  return resposta;
}

export function obterNumero(prompt: string): number {
  let numero: number;
  do {
    numero = readlineSync.questionInt(`${prompt}: `);
    if (numero < 0) {
      console.log("❌ Por favor, insira um número válido (0 ou positivo).");
    }
  } while (numero < 0);
  return numero;
}


// --- Estado da aplicação ---
let clienteAtual: Cliente | undefined;
let carrinho: PedidoItem[] = [];

// --- Função para mostrar cardápio e escolher item ---
function escolherItem(cardapio: CardapioItem[]): PedidoItem | null {
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
function mostrarMenuPrincipal(): void {
  console.log("\n===== PIZZARIA Parma =====");
  console.log("1 - Cadastrar/Login Cliente");
  console.log("2 - Pedir");
  console.log("3 - Meu Histórico de Compras");
  console.log("4 - Pizza Mais Pedida");
  console.log("0 - Sair");

  if (clienteAtual) {
    console.log(`\nCliente Atual: ${clienteAtual.nome} | CPF: ${clienteAtual.cpf}`);
  } else {
    console.log("\nNenhum cliente logado.");
  }
}

// --- Função para gerar recibo ---
function gerarRecibo(cliente: Cliente, itens: PedidoItem[], total: number, pagamento: string): string {
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
function main(): void {
  while (true) {
    mostrarMenuPrincipal();
    const opcao = obterNumero("Escolha uma opção");

    switch (opcao) {
      // --- Cadastro/Login ---
      case 1: {
        const cpf = obterString("Digite seu CPF");
        const clienteExistente = buscarClientePorCPF(cpf);

        if (clienteExistente) {
          clienteAtual = clienteExistente;
          console.log(`✅ Bem-vindo de volta, ${clienteAtual.nome}!`);
        } else {
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
          cadastrarCliente(clienteAtual);
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

          let item: PedidoItem | null = null;
          if (opPedido === 1) item = escolherItem(pizzas);
          else if (opPedido === 2) item = escolherItem(bebidas);
          else if (opPedido === 3) item = escolherItem(sobremesas);

          if (item) {
            carrinho.push(item);
            console.log(`✅ ${item.quantidade}x ${item.item.nome} adicionado(s) ao carrinho!`);
          }

          if (opPedido === 4) {
            if (carrinho.length === 0) {
              console.log("❌ Carrinho vazio!");
              continue;
            }

            const total = calcularTotalPedido(carrinho);
            const pagamento = obterString("Informe a forma de pagamento (dinheiro/cartão/pix)");

            criarPedido(clienteAtual, carrinho, total, pagamento);
            const recibo = gerarRecibo(clienteAtual, carrinho, total, pagamento);
            console.log(recibo);

            carrinho = [];
            break;
          }

          if (opPedido === 0) break;
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
        } else {
          console.log("\n--- Histórico de Pedidos ---");
          clienteAtual.historicoPedidos.forEach((p, idx) =>
            console.log(`${idx + 1} - Total: R$${p.total.toFixed(2)} | Data: ${p.data.toLocaleString()}`)
          );
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
