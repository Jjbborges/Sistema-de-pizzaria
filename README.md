<div align="center">

  <img src="./pizza.png" alt="Logo" height="200">
  <h1 align="center"><strong>SISTEMA DA PIZZARIA PARMA</strong></h1>
  <p align="center">
	 Este é um projeto completo de um site de pizzaria desenvolvido em TypeScript + Node.js. <br> Aplicativo criado para gerenciar Entrada, Armazenamento, Saída e Consulta pelos dados do pedido.
  </p>

</div>

<br />

## :computer: Tecnologias

Este projeto foi desenvolvido com as seguintes linguagens: 
<br><br>
[![My Skills](https://skillicons.dev/icons?i=typescript,nodejs&theme=dark)](https://skillicons.dev) 

</div>

<br> 

### 📄 Arquivos 

- package.json - Gerencia as dependências e scripts do projeto.
- tsconfig.json - Configurações do TypeScript.
- inicio.ts - Código de base e menu.
- cardapio.ts - Armazena os itens do Cardápio.
- pedido.ts - Definição de tipos para a estruturação de dados.
- cadastroService.ts - Cadastro de novos clientes
- pedidoService.ts - Base do serviço de pedidos.
- fileUtils.ts - Utilitário de leitura e escrita em CSV.
- inputUtils.ts - Utilitário de entrada de dados pelo terminal.

<br>

### 🗃 Arquivos CSV gerados

* `csv/cadastro.csv`  → `id, nome, cpf, telefone, endereco, historicoPedidos`
* `csv/pedidos.csv`   → `cliente.nome, cliente.cpf, cliente.telefone, cliente.endereco, pedido.id, pedido.data, item.nome, item.quantidade, item.preco, pedido.total`

<br> 

## 🔧 Pré-requisitos

* **Node.js 16+** (recomendado 18 ou 20)
* **npm**
* **Biblioteca readline-sync**

<br>

## 📁 Estrutura de pastas // ainda arrumar

```
Back-End/
├─ dist/          # arquivos .js gerados pelo TypeScript
    ├─ data # código do cardápio .js
	├─ models # estruturação de dados .js
	├─ services # base de cadastros .js
	├─ utils # utilitários .js
├─ src/           # código-fonte .ts (ex.: ts/index.ts)
    ├─ data # código do cardápio .ts
	├─ models # estruturação de dados .ts
	├─ services # base de cadastros .ts
	├─ utils # utilitários .ts
├─ csv/           # base de dados em CSV
├─ node_modules/  # armazena as dependências externas
├─ package.json
├─ package-lock.json
└─ tsconfig.json
```

<br>

## 🚀 Instalação

Na **raiz** do projeto (onde está o `package.json`):

```bash
npm i -D typescript ts-node @types/node
```

Crie (ou confira) os scripts no **package.json**:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```

`tsconfig.json` mínimo recomendado:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "lib": ["ES2020"]
  },
  "include": ["src/**/*"]
}
```

Após isso, instale a biblioteca readline-sync:

```bash
npm install readline-sync
```

No tsconfig.json, garanta que tenha algo assim:

``` bash
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  },
  "include": ["./src"]
}
```

> No VS Code, se aparecerem erros de tipos do Node, use **Ctrl+Shift+P → TypeScript: Restart TS Server**.

<br>

## ▶️ Como executar

Modo desenvolvimento (executa direto o TypeScript):

```bash
npm run dev
```

Transpilar e rodar o JS gerado:

```bash
npm run build && npm start
```

### ⚡ Scripts

- `npm tsc`: Compila os arquivos TypeScript para JavaScript na pasta dist.
- `node dist/inicio.js`: Pode ser usado para rodar arquivo.

<br>

## ⌨ Autores

```
- Gabriele Larena
- João Wagner Bonfim
- Julia Borges
- Karine Silva
- Maria Fernanda Venda
```
<br>

## 🧹 Limpeza / Reset

Para reiniciar os dados, apague os CSVs dentro de `csv/` (eles serão recriados com cabeçalho na próxima execução):

```bash
rm -f csv/*.csv 
```

*(No Windows, apague manualmente ou use `del` no PowerShell.)*



## 🖥️ Uso // ainda arrumar

1. **Entrada** → informe **Nome completo**, **CPF**, **Telefone**, **Pizzas**, **Bebidas**, **Modo de Entrega**, **Forma de Pagamento** e **Endereço**. O sistema grava em `cadastro.csv`.
3. **Saída** → O Sistema calcula o preço dos produtos escolhidos e cria a nota fiscal do pedido. O sistema grava em `pedidos.csv`.
4. **Consulta por placa** → primeiro busca em `ativos.csv`; se não encontrar, mostra a **última saída** de `saidas.csv`.
5. **Listar ativos** → imprime no console todos os veículos atualmente no pátio.
6. **Consulta por CPF** → Procura o histórico de pedidos pelo **CPF** inserido e devolve os valores e produtos escolhidos nas compras anteriores.
7. **Consulta Pizza Mais Pedida** → Inserir um **dia/mês/ano**, que ao ser executado, o sistema devolverá os produtos mais pedidos em tal data.

## ⚙️ Recursos // ainda arrumar

* **Entrada**: Nome Completo, CPF, Telefone, Endereço, Sabores de Pizza, Bebidas, Modo de entrega, Forma de Pagamento.
* **Armazenamento**: `csv/entradas.csv`, `csv/pedidos.csv`, `csv/saidas.csv` + `csv/resumo_diario.txt`. // não entendi essa parte, validar quem estiver fazendo código
* **Saída**: Preço, Quantidade, Produtos escolhidos. 
* **Consulta por CPF**: Verifica histórico de pedidos realizados com esse CPF. 
* **Consulta Pizza Mais Pedida**: Verifica qual sabor de pizza saiu mais no dia/mês/ano.


## 🗃️ Campos e formatos

* **Datas**: ISO (ex.: `2025-08-19T18:40:02.123Z`).
* **Placa**: armazenada em **maiúsculas**.
* **valorHora**: número decimal (ex.: `12.5`).
* **horas**: inteiro ≥ 1 (arredondado para cima a partir da diferença de horários).
* **preco**: `horas × valorHora` com 2 casas decimais.

---

