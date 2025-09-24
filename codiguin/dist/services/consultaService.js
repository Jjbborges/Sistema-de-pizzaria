"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarPorCPF = consultarPorCPF;
exports.pizzaMaisPedida = pizzaMaisPedida;
exports.consultarPorPlaca = consultarPorPlaca;
exports.listarAtivos = listarAtivos;
const fs = require("fs");
const CAMINHO_CADASTRO = "csv/cadastro.csv";
const CAMINHO_PEDIDOS = "csv/pedidos.csv";
const CAMINHO_ATIVOS = "csv/ativos.csv";
const CAMINHO_SAIDAS = "csv/saidas.csv";
/**
 * Consulta o histórico de pedidos por CPF.
 * @param cpf CPF do cliente.
 * @returns Array de strings com os pedidos encontrados.
 */
function consultarPorCPF(cpf) {
    if (!fs.existsSync(CAMINHO_PEDIDOS))
        return [];
    const linhas = fs.readFileSync(CAMINHO_PEDIDOS, "utf-8").split("\n").slice(1); // ignorar cabeçalho
    const resultados = [];
    linhas.forEach((line) => {
        const colunas = line.split(",");
        const cpfPedido = colunas[2] ?? "";
        if (cpfPedido === cpf) {
            resultados.push(line);
        }
    });
    return resultados;
}
/**
 * Retorna a pizza mais pedida em uma data específica.
 * @param data String no formato DD/MM/AAAA
 * @returns Nome da pizza mais pedida
 */
function pizzaMaisPedida(data) {
    if (!fs.existsSync(CAMINHO_PEDIDOS))
        return "Nenhum pedido";
    const linhas = fs.readFileSync(CAMINHO_PEDIDOS, "utf-8").split("\n").slice(1);
    const contador = {};
    linhas.forEach((line) => {
        const colunas = line.split(",");
        const dataPedido = colunas[1] ?? "";
        const item = colunas[3] ?? "";
        if (dataPedido === data) {
            contador[item] = (contador[item] || 0) + 1;
        }
    });
    let maisPedida = "Nenhum pedido";
    let quantidadeMax = 0;
    let pizzaTop = ""; // nome diferente da função
    for (const pizza in contador) {
        if ((contador[pizza] || 0) > quantidadeMax) {
            quantidadeMax = contador[pizza] || 0;
            pizzaTop = pizza;
        }
    }
    return pizzaTop;
    return maisPedida;
}
/**
 * Consulta por placa de veículo.
 * Primeiro busca em ativos.csv; se não encontrar, retorna última saída de saidas.csv
 * @param placa Placa do veículo
 * @returns String com resultado
 */
function consultarPorPlaca(placa) {
    if (fs.existsSync(CAMINHO_ATIVOS)) {
        const linhasAtivos = fs.readFileSync(CAMINHO_ATIVOS, "utf-8").split("\n").slice(1);
        for (const line of linhasAtivos) {
            const colunas = line.split(",");
            if ((colunas[0] ?? "") === placa) {
                return `Ativo: ${line}`;
            }
        }
    }
    if (fs.existsSync(CAMINHO_SAIDAS)) {
        const linhasSaidas = fs.readFileSync(CAMINHO_SAIDAS, "utf-8").split("\n").slice(1);
        const ultimaSaida = linhasSaidas[linhasSaidas.length - 1] ?? "";
        return `Última saída: ${ultimaSaida}`;
    }
    return "Nenhum registro encontrado.";
}
/**
 * Lista todos os veículos atualmente ativos (no pátio).
 */
function listarAtivos() {
    if (!fs.existsSync(CAMINHO_ATIVOS)) {
        console.log("Nenhum veículo ativo encontrado.");
        return;
    }
    const linhas = fs.readFileSync(CAMINHO_ATIVOS, "utf-8").split("\n").slice(1);
    if (linhas.length === 0) {
        console.log("Nenhum veículo ativo encontrado.");
        return;
    }
    console.log("\n--- Veículos Ativos ---");
    linhas.forEach((line, index) => {
        console.log(`${index + 1}. ${line}`);
    });
}
//# sourceMappingURL=consultaService.js.map