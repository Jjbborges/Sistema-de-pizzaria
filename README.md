<div align="center">

  <img src="./pizza.png" alt="Logo" height="200">
  <h1 align="center"><strong>SISTEMA DA PIZZARIA (nome)</strong></h1>
  <p align="center">
	 Este é um projeto completo de um site de pizzaria desenvolvido em TypeScript + Node.js. <br> Aplicativo criado para gerenciar Entrada, Armazenamento, Saída e Consulta por dados do pedido.
  </p>

</div>

<br />

## :computer: Tecnologias

Este projeto foi desenvolvido com as seguintes linguagens: 
<br><br>
[![My Skills](https://skillicons.dev/icons?i=typescript,nodejs&theme=dark)](https://skillicons.dev) 

</div>







### 📄 Arquivos // ainda arrumar

- package.json - Gerencia as dependências e scripts do projeto.
- tsconfig.json - Configurações do TypeScript.

## 🖥️ Uso (menu de console) // ainda arrumar

1. **Entrada** → informe **Nome completo**, **CPF**, **Telefone**, **Pizzas**, **Bebidas**, **Modo de Entrega**, **Forma de Pagamento** e **Endereço**. O sistema grava em `cadastro.csv`.
3. **Saída** → O Sistema calcula o preço dos produtos escolhidos e cria a nota fiscal do pedido. O sistema grava em `pedidos.csv`.
4. **Consulta por placa** → primeiro busca em `ativos.csv`; se não encontrar, mostra a **última saída** de `saidas.csv`.
5. **Listar ativos** → imprime no console todos os veículos atualmente no pátio.
6. **Consulta por CPF**: Procura o histórico de pedidos pelo **CPF** inserido e devolve os valores e produtos escolhidos nas compras anteriores.
7. **Consulta Pizza Mais Pedida**: Inserir um **dia/mês/ano**, que ao ser executado, o sistema devolverá os produtos mais pedidos em tal data.

## ⚙️ Recursos

* **Entrada**: Nome Completo, CPF, Telefone, Endereço, Sabores de Pizza, Bebidas, Modo de entrega, Forma de Pagamento.
* **Armazenamento**: `csv/entradas.csv`, `csv/pedidos.csv`, `csv/saidas.csv` + `csv/resumo_diario.txt`. // não entendi essa parte, validar quem estiver fazendo código
* **Saída**: Preço, Quantidade, Produtos escolhidos. 
* **Consulta por CPF**: Verifica histórico de pedidos realizados com esse CPF. 
* **Consulta Pizza Mais Pedida**: Verifica qual sabor de pizza saiu mais no dia/mês/ano.

### ⚡ Scripts

- `npm tsc`: Compila os arquivos TypeScript para JavaScript na pasta dist.

## 📁 Estrutura de pastas

```
pizzaria/
├─ js/            # arquivos .js gerados pelo TypeScript
├─ ts/            # código-fonte .ts (ex.: ts/index.ts)
├─ csv/           # base de dados em CSV + resumo TXT
├─ json/          # (opcional) configs auxiliares
├─ package.json
└─ tsconfig.json
```

# 👩🏽‍💻 Como utilizar

Você pode baixar este projeto em arquivo .zip, clicando no botão <b>Code</b>, ou então seguir os passos abaixo para clonar o repositório em seu dispositivo:

```bash
# Clone o repositório 
$ git clone https://github.com/Jjbborges/Pizzaria-mimi.git

# Entre no repositório
$ cd Pizzaria-mimi

# Instale as dependências
$ npm install

# Inicie o servidor, utilizando o script 
$ npm run start:dev
```

# Autores

| <img src="" style="width: 100px; height: 100px; border-radius: 50%;"><br> |
| :---------------------------------------------------------------------------------------------------------------------------------------: |
|                                               |

<br />
















### Arquivos CSV gerados

* `csv/entradas.csv`  → `entradaISO,placa,modelo,cor,valorHora`
* `csv/ativos.csv`    → `entradaISO,placa,modelo,cor,valorHora`
* `csv/saidas.csv`    → `entradaISO,saidaISO,placa,modelo,cor,valorHora,horas,preco`
* `csv/resumo_diario.txt` → log simples de entradas/saídas (texto)

---

## 🔧 Pré-requisitos

* **Node.js 16+** (recomendado 18 ou 20)
* **npm**

---

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
    "start": "node js/index.js",
    "dev": "ts-node ts/index.ts"
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
    "rootDir": "./ts",
    "outDir": "./js",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "lib": ["ES2020"]
  },
  "include": ["ts/**/*"]
}
```

> No VS Code, se aparecerem erros de tipos do Node, use **Ctrl+Shift+P → TypeScript: Restart TS Server**.

---

## ▶️ Como executar

Modo desenvolvimento (executa direto o TypeScript):

```bash
npm run dev
```

Transpilar e rodar o JS gerado:

```bash
npm run build && npm start
```

---

## 🖥️ Uso (menu de console)

1. **Entrada** → informe **placa**, **modelo**, **cor** e **valor da hora**. O sistema grava em `entradas.csv` e `ativos.csv`.
2. **Saída** → informe a **placa**. O sistema remove de `ativos.csv`, calcula **horas** (ceil, mínimo 1) e **preço**, e grava em `saidas.csv`.
3. **Consulta por placa** → primeiro busca em `ativos.csv`; se não encontrar, mostra a **última saída** de `saidas.csv`.
4. **Listar ativos** → imprime no console todos os veículos atualmente no pátio.


