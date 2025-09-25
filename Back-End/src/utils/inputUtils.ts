import readlineSync = require("readline-sync");

// Garante que sempre retorna uma string não vazia
export function obterString(prompt: string): string {
  let resposta: string = "";
  do {
    resposta = readlineSync.question(`${prompt}: `).trim();
    if (!resposta) {
      console.log("Entrada inválida. Por favor, preencha o campo.");
    }
  } while (!resposta);
  return resposta;
}

// Para números
export function obterNumero(prompt: string): number {
  let numero: number;
  do {
    numero = readlineSync.questionInt(`${prompt}: `);
    if (numero < 0) {
      console.log("Por favor, insira um número válido.");
    }
  } while (numero < 0);
  return numero;
}
