import readlineSync = require("readline-sync");

type Pizza = {
  id: number;
  nome: string;
  preco: number;
};

const cardapio: Pizza[] = [
  { id: 1, nome: "Mussarela", preco: 60.00 },
  { id: 2, nome: "Calabresa", preco: 60.00 },
  { id: 3, nome: "Portuguesa", preco: 60.00 },
  { id: 4, nome: "Frango c/ Catupiry", preco: 60.00 },
];

let carrinho: Pizza[] = [];

function mostrarMenu() {
  console.log("\n===== PIZZARIA DA MIMI =====");
  console.log("1 - Ver cardápio");
  console.log("2 - Adicionar pizza ao carrinho");
  console.log("3 - Ver carrinho");
  console.log("4 - Finalizar pedido");
  console.log("0 - Sair");
}

function verCardapio() {
  console.log("\n--- CARDÁPIO ---");
  cardapio.forEach((pizza) => {
    console.log(`${pizza.id} - ${pizza.nome} - R$ ${pizza.preco.toFixed(2)}`);
  });
}

function adicionarPizza() {
  verCardapio();
  const escolha = readlineSync.questionInt("\nDigite o número da pizza que deseja: ");
  const pizza = cardapio.find((p) => p.id === escolha);
  if (pizza) {
    carrinho.push(pizza);
    console.log(`${pizza.nome} adicionada ao carrinho!`);
  } else {
    console.log("Opção inválida.");
  }
}

function verCarrinho() {
  console.log("\n--- CARRINHO ---");
  if (carrinho.length === 0) {
    console.log("Carrinho vazio.");
    return;
  }
  let total = 0;
  carrinho.forEach((pizza, index) => {
    console.log(`${index + 1}. ${pizza.nome} - R$ ${pizza.preco.toFixed(2)}`);
    total += pizza.preco;
  });
  console.log(`\nTotal: R$ ${total.toFixed(2)}`);
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    console.log("\nSeu carrinho está vazio!");
    return;
  }
  verCarrinho();
  console.log("\nPedido finalizado! Obrigado pela preferência 🍕");
  process.exit(0);
}

function main() {
  let opcao: number;
  do {
    mostrarMenu();
    opcao = readlineSync.questionInt("\nEscolha uma opção: ");
    switch (opcao) {
      case 1:
        verCardapio();
        break;
      case 2:
        adicionarPizza();
        break;
      case 3:
        verCarrinho();
        break;
      case 4:
        finalizarPedido();
        break;
      case 0:
        console.log("Saindo...");
        process.exit(0);
      default:
        console.log("Opção inválida!");
    }
  } while (opcao !== 0);
}

main();
