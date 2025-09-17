"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline-sync"));
const cardapio = [
    { id: 1, nome: "Mussarela", preco: 30 },
    { id: 2, nome: "Calabresa", preco: 35 },
    { id: 3, nome: "Portuguesa", preco: 40 },
    { id: 4, nome: "Frango c/ Catupiry", preco: 42 },
];
let carrinho = [];
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
    const escolha = readline.questionInt("\nDigite o número da pizza que deseja: ");
    const pizza = cardapio.find((p) => p.id === escolha);
    if (pizza) {
        carrinho.push(pizza);
        console.log(`${pizza.nome} adicionada ao carrinho!`);
    }
    else {
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
    process.exit();
}
function main() {
    let opcao;
    do {
        mostrarMenu();
        opcao = readline.questionInt("\nEscolha uma opção: ");
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
                break;
            default:
                console.log("Opção inválida!");
        }
    } while (opcao !== 0);
}
main();
//# sourceMappingURL=inicio.js.map