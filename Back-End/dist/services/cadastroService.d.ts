import { Cliente } from "../models/pedido";
/**
 * Lista todos os clientes cadastrados
 */
export declare function listarTodosClientes(): Cliente[];
/**
 * Cadastra um novo cliente com ID automático
 */
export declare function cadastrarCliente(cliente: Omit<Cliente, "id" | "historicoPedidos">): Cliente;
/**
 * Busca um cliente pelo CPF
 */
export declare function buscarClientePorCPF(cpf: string): Cliente | undefined;
//# sourceMappingURL=cadastroService.d.ts.map