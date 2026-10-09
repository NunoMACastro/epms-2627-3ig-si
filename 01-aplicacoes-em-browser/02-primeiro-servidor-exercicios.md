![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: o primeiro servidor

Segundo tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](02-primeiro-servidor.md) e de fazeres o [laboratório](02-primeiro-servidor-laboratorio.md). Os exercícios 1 e 2 fazem-se em papel; os outros, no computador.

## Objetivo e contexto

No laboratório construíste o servidor do catálogo de equipamentos seguindo passos. Aqui constróis outro servidor, o da biblioteca da escola, que já conheces da ficha do primeiro tema, e tomas decisões que o exemplo do guia não tomou: como contar os pedidos que o servidor recebe, que livros entram numa resposta, e que forma tem uma resposta que não é uma lista.

Os exercícios 1 e 2 treinam a leitura: prever o que um servidor responde e perceber o que uma mensagem de erro diz. Os exercícios 3 a 6 treinam a escrita de rotas. O desafio é opcional.

## Como trabalhar

Nos exercícios 1 e 2, responde antes de experimentar. Nos outros, antes de abrires o browser, escreve o que esperas ver; depois confirma. Quando uma coisa não funcionar, lê a mensagem do terminal pela ordem da secção "Como ler uma mensagem de erro do Node" do guia, antes de pedir ajuda.

Tempo previsto: 60 minutos para os exercícios 1 a 6.

## Exercício 1: ler e prever

Guia: secções "Exemplo guiado", passos 3 e 4, e "O que corre onde, agora com código".

Este é o `server.js` de um servidor com as salas da escola. Lê-o com atenção.

```js
// server.js: as salas da escola.
import express from "express";

const app = express();
const PORTA = 3000;

const salas = [
  { codigo: "A03", lugares: 28 },
  { codigo: "B12", lugares: 24 },
];

app.get("/", (req, res) => {
  res.send("Salas da escola");
});

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

a) Escreve `node server.js` e o servidor arranca sem erros. O que aparece no terminal?

b) Com o servidor ligado, fazem-se estes quatro pedidos, por esta ordem. Para cada um, diz o que o browser recebe e o código de estado.

1. `http://localhost:3000/`
2. `http://localhost:3000/salas`
3. `http://localhost:3000/sala`
4. `http://localhost:3000/salas/B12`

c) Depois dos quatro pedidos, quantas vezes apareceu a frase "Pedido à lista de salas"? Onde apareceu?

## Exercício 2: ler mensagens de erro

Guia: secção "Erros de arranque e como os ler".

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

d) O servidor arrancou e a página inicial funciona, mas o pedido a `/livros` recebe uma página com o código 500, e o terminal mostra:

```text
ReferenceError: livro is not defined
```

## Exercício 3: a lista de livros

Guia: secção "Exemplo guiado".

1. Na tua pasta de trabalho, cria uma pasta `biblioteca` e prepara-a como no laboratório: `npm init -y`, a mudança do `"type"` e `npm install express`.
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

3. Escreve a rota `GET /livros`, que responde com a lista completa dos livros, em JSON. Este passo é igual ao exemplo do guia e serve de aquecimento.
4. A coordenadora da biblioteca quer saber se a lista está a ser consultada. Acrescenta à rota uma linha no terminal que conte os pedidos à lista desde que o servidor foi ligado: `Pedido 1 à lista de livros` no primeiro pedido, `Pedido 2 à lista de livros` no segundo, e assim por diante.

**A decisão nova:** até aqui, cada pedido era tratado sem precisar de nada dos pedidos anteriores. Este número tem de passar de um pedido para o seguinte.

**Resultado esperado:** `http://localhost:3000/livros` mostra os três livros, com o código 200 e o tipo `application/json`, e `http://localhost:3000/` continua a responder como antes. Abre a lista e recarrega-a duas vezes com o botão de recarregar do browser: o terminal mostra, por esta ordem, `Pedido 1 à lista de livros`, `Pedido 2 à lista de livros` e `Pedido 3 à lista de livros`. Um pedido a `/` não muda a contagem. Se parares o servidor e o voltares a ligar, a contagem recomeça em 1.

Se o catálogo de equipamentos do laboratório estiver ligado, para-o primeiro, ou vais encontrar um erro que já conheces.

## Exercício 4: só os livros disponíveis

A funcionária da biblioteca quer uma página só com os livros que têm exemplar na estante. Acrescenta a rota `GET /livros/disponiveis`, que responde com a lista, em JSON, só desses livros.

**Resultado esperado:** com os dados do código de partida, a resposta tem dois livros, "Os Maias" e "Mensagem".

**Pistas,** só se precisares, uma de cada vez:

1. A decisão nova está dentro da função da rota: antes de responder, tens de escolher, do array `livros`, só alguns elementos.
2. Os arrays têm um método que cria um array novo só com os elementos que cumprem uma condição. Usaste-o em JavaScript nos anos anteriores.
3. A condição é sobre o campo `disponivel` de cada livro.

**Para verificar:** muda, no array, o `disponivel` de "Mensagem" para `false`, reinicia o servidor e confirma que a resposta passa a ter só um livro. Depois repõe o valor.

## Exercício 5: um resumo

A coordenadora da biblioteca não quer a lista: quer dois números, o total de livros e quantos estão disponíveis. Acrescenta a rota `GET /resumo`, que responde em JSON com um objeto assim:

```json
{ "total": 3, "disponiveis": 2 }
```

A decisão nova: até agora, todas as respostas em JSON foram arrays que já existiam. Esta resposta é um objeto que tens de construir dentro da função, com valores calculados a partir do array `livros`.

**Resultado esperado:** com os dados do código de partida, exatamente o objeto acima. Se mudares o `disponivel` de um livro e reiniciares o servidor, os números mudam sozinhos: não os escreves à mão no código.

## Exercício 6: dois servidores ao mesmo tempo

Guia: secção "Um programa que não acaba".

Queres ter ligados ao mesmo tempo o catálogo de equipamentos do laboratório e o servidor da biblioteca.

a) Antes de experimentares: se os dois usarem a porta 3000, o que acontece ao segundo que ligares?

b) Muda a porta do servidor da biblioteca para 3001 e liga os dois, cada um no seu terminal. Escreve o endereço que usas no browser para a lista de equipamentos e o endereço para a lista de livros.

c) Para o servidor da biblioteca com Ctrl+C. O que acontece agora a um pedido a `http://localhost:3001/livros`? E a `http://localhost:3000/equipamentos`?

## Desafio (opcional): os autores

Acrescenta a rota `GET /autores`, que responde com uma lista só com os nomes dos autores, em JSON:

```json
["Eça de Queirós", "Fernando Pessoa", "José Saramago"]
```

Pensa depois nisto, sem ter de o programar: se a biblioteca tiver dois livros do mesmo autor, o nome aparece duas vezes na tua resposta? Que decisão terias de tomar para isso não acontecer?

## Entrega e autoavaliação

Entrega:

- as respostas dos exercícios 1, 2 e 6, por escrito;
- o `server.js` da biblioteca com as rotas dos exercícios 3, 4 e 5 (e do desafio, se o fizeste). Não entregues a pasta `node_modules`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: escolhe uma das rotas que escreveste e explica quando é que a sua função corre e o que o browser recebe.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
