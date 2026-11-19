![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: Primeiro servidor

Praticas a leitura de um servidor Express e das mensagens de erro do Node, e escreves as rotas de um servidor novo, o da biblioteca da escola. Os exercícios 1 a 6 são obrigatórios, por esta ordem. As respostas dos exercícios 1 e 2 vão para um ficheiro de texto, o `respostas-02.md`, com o número do exercício e a letra da alínea antes de cada uma. Guarda-o na tua pasta de Sistemas de Informação, fora do projeto `biblioteca`. Os exercícios 3 a 6 fazem-se nesse projeto, que preparas antes do exercício 3. Entrega o `respostas-02.md` e o `server.js` da biblioteca. Para rever: o [guia do tema](../02-primeiro-servidor.md) e o [laboratório](../laboratorios/02-primeiro-servidor-laboratorio.md).

## Sem correr código

### Exercício 1: ler e prever

Este é o `server.js` de um servidor com as salas da escola.

```js
// server.js: as salas da escola.
import express from "express";

const app = express();
const PORTA = 3000;

const salas = [
  { codigo: "A03", lugares: 28 },
  { codigo: "B12", lugares: 24 },
];

// GET /: responde com o texto de apresentação das salas.
app.get("/", (req, res) => {
  res.send("Salas da escola");
});

// GET /salas: regista o pedido no terminal e responde com as salas em JSON.
app.get("/salas", (req, res) => {
  console.log("Pedido à lista de salas");
  res.json(salas);
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
```

a) O servidor arranca sem erros com `node server.js`. O que aparece no terminal?

b) Com o servidor ligado, fazem-se estes quatro pedidos, por esta ordem. Para cada um, diz o que o browser recebe e o código de estado.

1. `http://localhost:3000/`
2. `http://localhost:3000/salas`
3. `http://localhost:3000/sala`
4. `http://localhost:3000/salas/B12`

c) Depois dos quatro pedidos, quantas vezes apareceu a frase "Pedido à lista de salas"? Onde apareceu?

Rever: [O arranque corre uma vez, e a função de uma rota a cada pedido](../02-primeiro-servidor.md#o-arranque-corre-uma-vez-e-a-função-de-uma-rota-a-cada-pedido) e [A resposta leva texto, com res.send, ou dados, com res.json](../02-primeiro-servidor.md#a-resposta-leva-texto-com-ressend-ou-dados-com-resjson).

<details>
<summary>Pista</summary>

Separa as linhas do arranque das que estão dentro das funções das rotas.

</details>

### Exercício 2: ler mensagens de erro

Para cada situação, diz se o erro acontece no arranque ou num pedido, qual é a causa e como se corrige.

a) Ao correr `node server.js` numa pasta acabada de criar, onde só correste `npm init -y` e mudaste o `"type"`:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from C:\Users\aluno\si\biblioteca\server.js
```

b) Ao correr `node server.js`:

```text
Não foi possível ligar o servidor: listen EADDRINUSE: address already in use :::3000
```

c) Ao correr `node server.js`, numa pasta onde correste `npm init -y` e `npm install express` e criaste o `server.js`, o terminal mostra, entre outras linhas:

```text
SyntaxError: Cannot use import statement outside a module
```

d) O pedido a `/livros` recebe uma página com o código 500, e o terminal mostra:

```text
ReferenceError: livro is not defined
```

Rever: [Uma mensagem de erro lê-se pelo tipo e pela linha](../02-primeiro-servidor.md#uma-mensagem-de-erro-lê-se-pelo-tipo-e-pela-linha), [O arranque corre uma vez, e a função de uma rota a cada pedido](../02-primeiro-servidor.md#o-arranque-corre-uma-vez-e-a-função-de-uma-rota-a-cada-pedido), [O "type": "module" deixa o Node aceitar o import](../02-primeiro-servidor.md#o-type-module-deixa-o-node-aceitar-o-import) e [Erros frequentes](../02-primeiro-servidor.md#erros-frequentes).

<details>
<summary>Pista</summary>

Em cada mensagem, começa pelo nome do erro e, quando o há, pelo nome que ele diz não encontrar.

</details>

## No servidor da biblioteca

Nestes exercícios constróis o servidor da biblioteca da escola, a da ficha do tema 01. Antes do exercício 3, prepara o projeto:

1. Na tua pasta de Sistemas de Informação, cria uma pasta `biblioteca` e prepara-a como no laboratório: `npm init -y`, `npm install express` e a mudança do `"type"` para `"module"`. Se não houver internet, usa a pasta preparada pelo professor, como em [O npm install falha ou fica parado](../laboratorios/02-primeiro-servidor-laboratorio.md#o-npm-install-falha-ou-fica-parado), e, depois de a copiares, confirma que o `"type"` é `"module"`. A pasta fica com `package.json`, `package-lock.json` e `node_modules`, ainda sem `server.js`.
2. Cria o `server.js` com este código de partida:

```js
// server.js: o servidor da biblioteca da escola.
// Responde com os livros da biblioteca, guardados num array.
import express from "express";

const app = express();
const PORTA = 3000;

// Os livros ficam num array, em memória. O campo disponivel diz se há
// pelo menos um exemplar na estante neste momento.
const livros = [
  { id: 1, titulo: "Os Maias", autor: "Eça de Queirós", disponivel: true },
  { id: 2, titulo: "Mensagem", autor: "Fernando Pessoa", disponivel: true },
  { id: 3, titulo: "Memorial do Convento", autor: "José Saramago", disponivel: false },
];

// GET /: responde com o texto de apresentação da biblioteca.
app.get("/", (req, res) => {
  res.send("Biblioteca da escola: o servidor está a funcionar.");
});

// Exercício 3: escreve aqui a rota GET /livros.

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
```

Se o catálogo de equipamentos do laboratório estiver ligado, para-o com Ctrl+C antes de ligares a biblioteca.

### Exercício 3: a lista de livros

Escreve a rota `GET /livros`, que responde com a lista completa dos livros, em JSON, como a rota `/equipamentos` do exemplo guiado.

A coordenadora da biblioteca quer saber se a lista está a ser consultada. Acrescenta à rota uma linha no terminal que conte os pedidos à lista desde que o servidor foi ligado: `Pedido 1 à lista de livros` no primeiro pedido, `Pedido 2 à lista de livros` no segundo, e assim por diante.

Resultado esperado: `http://localhost:3000/livros` mostra os três livros, com o código 200 e o tipo `application/json`, e `http://localhost:3000/` continua a responder como antes. Abre a lista e recarrega-a duas vezes com o botão de recarregar do browser: o terminal mostra, por esta ordem, `Pedido 1 à lista de livros`, `Pedido 2 à lista de livros` e `Pedido 3 à lista de livros`. Um pedido a `/` não muda a contagem. Se parares o servidor e o voltares a ligar, a contagem recomeça em 1.

Rever: [O arranque corre uma vez, e a função de uma rota a cada pedido](../02-primeiro-servidor.md#o-arranque-corre-uma-vez-e-a-função-de-uma-rota-a-cada-pedido) e [Passo 4: os equipamentos e a segunda rota](../02-primeiro-servidor.md#passo-4-os-equipamentos-e-a-segunda-rota).

<details>
<summary>Pista</summary>

Decide o que tem de continuar a existir de um pedido para o seguinte.

</details>

### Exercício 4: só os livros disponíveis

A funcionária da biblioteca quer ver só os livros que têm exemplar na estante. Acrescenta a rota `GET /livros/disponiveis`, que responde com a lista, em JSON, só desses livros. Neste exercício e no seguinte, podes usar um método dos arrays que conheças ou um ciclo: nenhum é obrigatório.

Resultado esperado: com os dados do código de partida, a resposta tem dois livros, "Os Maias" e "Mensagem". Depois de pedires os disponíveis, `http://localhost:3000/livros` continua a mostrar os três livros.

Para verificar: muda, no array, o `disponivel` de "Mensagem" para `false`, reinicia o servidor e confirma que a resposta passa a ter só um livro. Depois repõe o valor.

Rever: [O Express liga cada rota a uma função](../02-primeiro-servidor.md#o-express-liga-cada-rota-a-uma-função).

<details>
<summary>Pista</summary>

Antes de responder, a função da rota tem de escolher, do array `livros`, só alguns elementos.

</details>

<details>
<summary>Pista</summary>

Os arrays têm um método que cria um array novo só com os elementos que cumprem uma condição. Usaste-o no 11.º ano: [`filter` - selecionar](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/11-Arrays-HighOrder.md#2-filter---selecionar).

</details>

<details>
<summary>Pista</summary>

A condição é sobre o campo `disponivel` de cada livro.

</details>

### Exercício 5: um resumo

A coordenadora da biblioteca não quer a lista: quer dois números, o total de livros e quantos estão disponíveis. Acrescenta a rota `GET /resumo`, que responde em JSON com um objeto assim:

```json
{ "total": 3, "disponiveis": 2 }
```

Resultado esperado: com os dados do código de partida, exatamente o objeto acima. Se mudares o `disponivel` de um livro e reiniciares o servidor, os números mudam sozinhos: não os escreves à mão no código.

Rever: [A resposta leva texto, com res.send, ou dados, com res.json](../02-primeiro-servidor.md#a-resposta-leva-texto-com-ressend-ou-dados-com-resjson).

### Exercício 6: dois servidores ao mesmo tempo

Queres ter ligados ao mesmo tempo o catálogo de equipamentos do laboratório e o servidor da biblioteca. As respostas das três alíneas ficam num comentário no fim do `server.js` da biblioteca, com `//` no início de cada linha.

a) Se os dois usarem a porta 3000, o que acontece ao segundo que ligares?

b) Muda a porta do servidor da biblioteca para 3001 e liga os dois, cada um no seu terminal. Escreve o endereço que usas no browser para a lista de equipamentos e o endereço para a lista de livros.

c) Para o servidor da biblioteca com Ctrl+C. O que acontece agora a um pedido a `http://localhost:3001/livros`? E a `http://localhost:3000/equipamentos`?

Rever: [Um servidor é um processo que fica à escuta até o parares](../02-primeiro-servidor.md#um-servidor-é-um-processo-que-fica-à-escuta-até-o-parares).

<details>
<summary>Pista</summary>

Identifica cada processo pela porta que ele usa.

</details>

## Desafios

### Os autores

Acrescenta à biblioteca a rota `GET /autores`, que responde com uma lista só com os nomes dos autores, em JSON:

```json
["Eça de Queirós", "Fernando Pessoa", "José Saramago"]
```

Depois, sem o programar, responde num comentário por cima da rota: se a biblioteca tiver dois livros do mesmo autor, o nome aparece duas vezes na tua resposta? Que decisão terias de tomar para isso não acontecer?

## Critérios de conclusão

- O `respostas-02.md` tem os exercícios 1 e 2 respondidos, com o número e a alínea antes de cada resposta.
- O servidor da biblioteca arranca na porta 3001, a do exercício 6. Responde em `/livros`, `/livros/disponiveis` e `/resumo` como dizem os resultados esperados, e o terminal conta os pedidos à lista.
- O comentário no fim do `server.js` tem as respostas das três alíneas do exercício 6.
- Se fizeste o desafio, `/autores` responde com os nomes dos autores, e o comentário por cima da rota responde à pergunta.

![Rodapé](../../imagens/rodape.png)
