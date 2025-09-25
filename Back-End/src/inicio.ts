// src/inicio.ts
import readlineSync = require("readline-sync");
import { cadastrarCliente, buscarClientePorCPF } from "./services/cadastroService";
import { criarPedido, calcularTotalPedido } from "./services/pedidoService";
import { Cliente, PedidoItem, CardapioItem } from "./models/pedido";
import { pizzas, bebidas, sobremesas } from "./data/cardapio";

// --- Funções de entrada e validação ---
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

function obterNumero(prompt: string): number {
  let numero: number;
  do {
    numero = readlineSync.questionInt(`${prompt}: `);
    if (numero < 0) console.log("❌ Por favor, insira um número positivo.");
  } while (numero < 0);
  return numero;
  
}
// --- Estado da aplicação ---
let clienteAtual: Cliente | undefined;
let carrinho: PedidoItem[] = [];

// --- Função para escolher item do cardápio ---
function escolherItem(cardapio: CardapioItem[]): PedidoItem | null {
  console.log("\n--- CARDÁPIO ---");
  cardapio.forEach((item) =>
    console.log(`${item.id} - ${item.nome} - R$${item.preco.toFixed(2)}`)
  );

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

  const quantidade = obterNumero("Digite a quantidade desejada");

  return { item: itemEscolhido, quantidade };
}

// --- Menu principal ---
function mostrarMenuPrincipal(): void {
  console.log("\n===== PIZZARIA Parma =====");
  console.log("1 - Cadastrar/Login");
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

// --- Função de recibo ---
function gerarRecibo(cliente: Cliente, itens: PedidoItem[], total: number, pagamento: string): string {
  let recibo = "\n===== RECIBO PIZZARIA Parma =====\n";
  recibo += `Cliente: ${cliente.nome}\n`;
  recibo += `CPF: ${cliente.cpf}\n`;
  recibo += `Endereço: ${cliente.endereco}\n`;
  recibo += `Data: ${new Date().toLocaleString()}\n`;
  recibo += "\nItens:\n";
  itens.forEach((p) => {
    recibo += `- ${p.quantidade}x ${p.item.nome} (R$${p.item.preco.toFixed(2)})\n`;
  });
  recibo += `\nTOTAL: R$${total.toFixed(2)}\n`;
  recibo += `Pagamento: ${pagamento}\n`;
  recibo += "================================\n";
  return recibo;
}

// --- Loop principal ---
function main(): void {
  while (true) {
    mostrarMenuPrincipal();
    const opcao = obterNumero("Escolha uma opção");

    switch (opcao) {
      case 1:
        // --- Cadastro/Login ---
        const cpf = obterString("Digite seu CPF", (v) => /^\d{11}$/.test(v), "CPF deve ter 11 números.");
        let cliente = buscarClientePorCPF(cpf);
        if (cliente) {
          console.log(`👋 Bem-vindo de volta, ${cliente.nome}!`);
          clienteAtual = cliente;
        } else {
          const nome = obterString("Digite seu nome completo", (v) => /^[A-Za-z\s]+$/.test(v), "Nome inválido, sem números.");
          const telefone = obterString("Digite seu telefone");
          const endereco = obterString("Digite seu endereço");
          const clienteId = Date.now();
          clienteAtual = cadastrarCliente({ id: clienteId, nome, cpf, telefone, endereco, historicoPedidos: [] });
        }
        break;

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

            // --- Método de pagamento ---
            const pagamento = obterString("Digite a forma de pagamento (Dinheiro / Cartão / pix)");

            criarPedido(clienteAtual, carrinho, total, pagamento);
            console.log(gerarRecibo(clienteAtual, carrinho, total, pagamento));

            carrinho = [];
            break;
          }

          if (opPedido === 0) break;
        }
        break;

      case 3:
        if (!clienteAtual) {
          console.log("❌ Faça login para consultar o histórico.");
          break;
        }
        console.log("\n--- Histórico de Compras ---");
        clienteAtual.historicoPedidos.forEach((p) =>
          console.log(`- Pedido em ${p.data}: R$${p.total.toFixed(2)}`)
        );
        break;

      case 4:
        console.log("Função de pizza mais pedida ainda não implementada");
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
