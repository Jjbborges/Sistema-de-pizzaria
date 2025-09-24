import type { Cliente } from "../models/pedido";
import { obterString } from "../utils/inputUtils";

let proximoId = 1; // contador global de clientes

export function cadastrarCliente(clienteAtual: Cliente): Cliente {
  const nome = obterString("Digite seu nome completo");
  const cpf = obterString("Digite seu CPF");
  const telefone = obterString("Digite seu telefone");
  const endereco = obterString("Digite seu endereço");

  const novoCliente: Cliente = {
    id: proximoId++,
    nome,
    cpf,
    telefone,
    endereco,
    historicoPedidos: [],
  };

  // Aqui você pode adicionar código para gravar no cadastro.csv
  console.log(`✅ Cliente ${novoCliente.nome} cadastrado com sucesso!`);

  return novoCliente;
}
