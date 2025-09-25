// src/data/cardapio.ts
//Aqui está o cardapio da pizzaria separado por pizzas, bebidas e sobremesas

import type { CardapioItem } from "../models/pedido";

export const pizzas: CardapioItem[] = [
  { id: 1, nome: "Margherita", preco: 25.0 },
  { id: 2, nome: "Pepperoni", preco: 30.0 },
  { id: 3, nome: "Frango com Catupiry", preco: 32.0 },
  { id: 4, nome: "Calabresa", preco: 28.0 },
  { id: 5, nome: "Portuguesa", preco: 31.0 },
  { id: 6, nome: "Quatro Queijos", preco: 33.0 },
  { id: 7, nome: "Dois Queijos", preco: 45.0}
];

export const bebidas: CardapioItem[] = [
  { id: 101, nome: "Coca-Cola 350ml", preco: 5.0 },
  { id: 102, nome: "Guaraná 350ml", preco: 5.0 },
  { id: 103, nome: "Suco de Laranja 300ml", preco: 6.0 },
  { id: 104, nome: "Água Mineral 500ml", preco: 4.5 }
];

export const sobremesas: CardapioItem[] = [
  { id: 201, nome: "Pizza de Chocolate", preco: 27.0 },
  { id: 202, nome: "Sorvete 2 bolas", preco: 12.0 },
  { id: 203, nome: "Brownie", preco: 10.0 }
];
