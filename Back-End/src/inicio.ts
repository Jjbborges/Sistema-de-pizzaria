//É o inicio de todo o projeto, o código fonte
//Logo abaixo são o import das outras pastas que estão separadas para cada coisa 
import readlineSync = require("readline-sync");
import { cadastrarCliente } from "./services/cadastroService";
import { criarPedido, calcularTotalPedido } from "./services/pedidoService";
import { Cliente, PedidoItem, CardapioItem } from "./models/pedido";
import { pizzas, bebidas, sobremesas } from "./data/cardapio";

// --- Funções de entrada ---
function obterString(prompt: string): string {
  return readlineSync.question(`\n${prompt}: `);
}

function obterNumero(prompt: string): number {
  return readlineSync.questionInt(`\n${prompt}: `);
}
//MARK: Função MENU

// --- Estado da aplicação ---
let clienteAtual: Cliente | undefined;
let carrinho: PedidoItem[] = [];

// --- Menu principal ---
function mostrarMenuPrincipal(): void {
  console.log("\n===== PIZZARIA MIMI =====");
  console.log("1 - Cadastrar");
  console.log("2 - Pedir");
  console.log("3 - Meu Histórico de Compras");
  console.log("5 - Pizza Mais Pedida");
  console.log("0 - Sair");

  if (clienteAtual) {
    console.log(`\nCliente Atual: ${clienteAtual.nome} | CPF: ${clienteAtual.cpf}`);
  } else {
    console.log("\nNenhum cliente logado.");
  }
}

// --- Loop principal ---
function main(): void {
  while (true) {
    mostrarMenuPrincipal();
    const opcao = obterNumero("Escolha uma opção");


  // MARK: Cadastro
    switch (opcao) {
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
        cadastrarCliente(clienteAtual);
        console.log(`Cliente ${nome} cadastrado com sucesso!`);
        break;

//MARK: Cardápio
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

  return {
    item: itemEscolhido,
    quantidade,
  };
}

      //MARK: Pedir
      case 2:
        if (!clienteAtual) {
          console.log("Cadastre-se antes de criar um pedido.");
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
            console.log(` ${item.quantidade}x ${item.item.nome} adicionado(s) ao carrinho!`);
          }

          if (opPedido === 4) {
            if (carrinho.length === 0) {
              console.log("Carrinho vazio!");
              continue;
            }
            const total = calcularTotalPedido(carrinho);
            criarPedido(clienteAtual, carrinho, total);
            console.log(`Pedido finalizado! Total: R$ ${total.toFixed(2)}`);
            carrinho = [];
            break;
          }

          if (opPedido === 0) break;
        }
        break;

      //MARK: Histórico
      case 3:
        if (!clienteAtual) {
          console.log("Faça login para consultar o histórico.");
          break;
        }
      // --- Sair ---
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
