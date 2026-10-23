![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: HTTP, rotas e middleware na papelaria

Laboratório do tema HTTP, rotas e middleware na API da papelaria, em articulação com Linguagens de Programação. Vais construir a API num só ficheiro e observar os mesmos mecanismos do catálogo. Se o professor indicar este percurso, substitui o laboratório do catálogo. Avança ao teu ritmo. O [guia](03-http-rotas-e-middleware.md) tem a teoria completa.


## O que vais construir

Vais criar `papelaria-api` com oito artigos em memória. O resultado serve de ponto de partida para o trabalho de LP; aqui não ligas a nenhuma base de dados.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | Prevês os pedidos | Tens uma tabela para comparar |
| 2 | Preparas projeto e lista | A API responde com os oito artigos |
| 3 | Acrescentas detalhe | A API distingue 200, 400 e 404 |
| 4 | Acrescentas categoria | A lista pode vir filtrada ou vazia |
| 5 | Inspecionas o pedido | Distingues pesquisa de caminho |
| 6 | Acrescentas registo | Cada pedido aparece no terminal |
| 7 | Defines o fim da fila | Até os erros respondem em JSON |
| 8 | Verificas o contrato | Guardas uma tabela apoiada nos testes |

## Palavras que vais usar

- **Parâmetro de rota**: valor numa posição do caminho, como o 2 de `/api/artigos/2`.
- **Parâmetro de pesquisa**: nome e valor depois do `?`, usados para filtrar a lista.
- **Validação**: verificação de que os dados cumprem as regras antes de os usar.
- **Código de estado**: número da resposta; 200 indica sucesso, 400 um pedido inválido e 404 um recurso que não existe.
- **Middleware**: função no percurso de um pedido; responde ou chama a função seguinte.
- **`next()`**: entrega o pedido ao próximo passo da fila do Express.
- **Contrato HTTP**: tabela com o que cada pedido aceita e as respostas que pode produzir.
- **Payload**: separador do browser que mostra dados enviados, como os parâmetros de pesquisa.
- **JSON**: formato de texto que representa dados, como arrays e objetos.
- **API**: interface que permite a outro programa pedir operações e receber dados. Nesta API, as respostas são JSON.
- **Stock**: quantidade de um artigo que existe na papelaria.
- **Cêntimos**: unidade inteira usada nos preços; 250 cêntimos são 2,50 euros.

## O que precisas

Precisas de um editor de código, como o Visual Studio Code, de um terminal e do browser com as ferramentas de programador. Usa o ambiente Node 24 indicado pelo professor, instalado no posto ou preparado em Docker. No terminal desse ambiente, `node --version` deve mostrar `v24` seguido da versão. Os comandos `npm` e `node` deste laboratório correm nesse terminal. Precisas também de internet para o `npm install` da fase 2.

Na falta de ligação, pede ao professor um ambiente com as dependências preparadas para este projeto e para o sistema em uso. O `npm install express` precisa de acesso aos pacotes; copiar uma pasta `node_modules` feita noutro computador não garante compatibilidade. Se receberes um ambiente preparado, continua a partir do passo indicado pelo professor e faz a instalação pelo npm quando houver ligação. A pasta `node_modules` não entra nas entregas nem no Git.

Trabalha numa pasta tua, fora do repositório dos materiais. Este percurso articula SI e Linguagens de Programação com a mesma aplicação. A pasta que vais criar, `papelaria-api`, fica disponível para ser retomada em LP como projeto, com scripts, configuração e Git. O professor indica quando se faz essa continuação. Por isso, não lhe mudes o nome e não a apagues no fim da aula.

Esta API responde só com dados, em JSON, e não tem páginas. A diferença está no conteúdo da resposta: este percurso envia dados, enquanto o catálogo também tem uma página HTML com formulário. O browser pode mostrar o JSON para o inspecionares; uma interface como o React pode usá-lo para construir páginas. Quem vai mostrar os dados é o React, mais à frente, em Linguagens de Programação. Por isso, este laboratório não tem a página com a pesquisa do laboratório do catálogo. O formulário de pesquisa por `GET`, que transforma um campo num parâmetro de pesquisa, está no passo 4 do exemplo guiado, e o professor mostra-o a funcionar no projetor.

Todos os caminhos desta API começam por `/api`, como `/api/artigos`. É uma convenção que separa os endereços que respondem com dados dos endereços das páginas, e que vai dar jeito quando a API e o React se juntarem.

Em todo o laboratório, depois de mudares o `server.js`, o servidor tem de ser reiniciado. A forma mais cómoda é arrancá-lo com `node --watch server.js`, que o reinicia sozinho sempre que guardas o ficheiro.

## Se alguma coisa falhar

1. Confirma que o terminal está na pasta onde estão `server.js` e `package.json`. Usa `pwd` ou, no `cmd` do Windows, `cd` sem argumentos.
2. Confirma que o teu servidor está ligado e que o endereço usa a mesma porta e `http`.
3. Guarda a alteração e reinicia o teu processo com Ctrl+C e `node server.js`, ou usa `node --watch server.js`.
4. Lê o terminal antes de alterar outra linha. Escreve o esperado, o obtido e a hipótese que queres verificar.
5. Provoca só um erro de cada vez e repõe o código antes da experiência seguinte.

## Fase 1: prever antes de programar

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secções "Três sítios por onde um pedido traz dados" e "Os códigos de estado que o teu código escolhe".

Copia esta tabela para o caderno e preenche as duas últimas colunas com a tua previsão, antes de escreveres qualquer código. Os artigos estão na parte 2: o artigo 2 é a esferográfica azul, e há oito artigos, com os identificadores de 1 a 8. No fim do laboratório voltas a esta tabela.

| Pedido | Onde vêm os dados | Código que esperas |
| --- | --- | --- |
| `GET /api/artigos/2` | | |
| `GET /api/artigos/abc` | | |
| `GET /api/artigos/0` | | |
| `GET /api/artigos/99` | | |
| `GET /api/artigos?categoria=Papel` | | |
| `GET /api/artigos?categoria=Cola` | | |
| `GET /nao-existe` | | |

A resposta, depois de fazeres a previsão: o detalhe do identificador 2 dá 200. `abc` e zero dão 400. O identificador válido sem recurso dá 404. As duas pesquisas dão 200, mesmo quando a lista está vazia. O caminho desconhecido dá 404.

### Paragem 1

Escreveste uma previsão para cada pedido. A fase 8 dá a tabela para a conferires depois de experimentar.

## Fase 2: o projeto e a lista dos artigos

Um projeto Node reúne os seus ficheiros e dependências numa pasta. O npm prepara essa pasta e instala o Express, que vai receber pedidos. O `"type": "module"` permite usar `import`. A leitura complementar está no [guia Primeiro servidor](02-primeiro-servidor.md).

1. Na tua pasta de trabalho, cria a pasta do projeto e instala o Express:

   ```bash
   mkdir papelaria-api
   cd papelaria-api
   npm init -y
   npm install express
   ```

2. Abre a pasta `papelaria-api` no editor. No terminal, corre `npm pkg set type=module`. O comando define o campo `"type"` do `package.json` como `"module"`, mesmo que ainda não exista. Sem esta mudança, o Node não aceita o `import` da primeira linha do servidor.
3. Cria o ficheiro `server.js`, ao lado do `package.json`, com este código. O array dos artigos podes copiá-lo, porque são dados e não há nada a aprender em escrevê-los à mão. O resto escreve-o tu, linha a linha, e lê os comentários.

   ```js
   // server.js: a API da papelaria, num só ficheiro.
   // Responde só com dados, em JSON.
   import express from "express";

   const app = express();
   const PORTA = 3000;

   // Os artigos da papelaria, em memória: existem enquanto o servidor estiver
   // ligado. São os mesmos oito que vais guardar no MongoDB Atlas em Linguagens
   // de Programação, com um id numérico em vez do _id.
   const artigos = [
     { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
     { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
     { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
     { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
     { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
     { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
     { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
     { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
   ];

   // Lista de artigos.
   app.get("/api/artigos", (req, res) => {
     res.json(artigos);
   });

   app.listen(PORTA, (erro) => {
     if (erro) {
       console.error(`Não foi possível ligar a API: ${erro.message}`);
       return;
     }
     console.log(`API a correr em http://localhost:${PORTA}`);
   });
   ```

   Os preços estão em cêntimos, como no Atlas: 250 são 2,50 euros. Guardar dinheiro em números inteiros de cêntimos evita os erros de arredondamento das casas decimais. E é por isso que o campo se chama `precoCentimos`, para ninguém o confundir com euros.

4. Arranca o servidor:

   ```bash
   node --watch server.js
   ```

   O terminal mostra `API a correr em http://localhost:3000`.

5. No browser, abre `http://localhost:3000/api/artigos`.

O que deves ver: a lista dos oito artigos, em JSON. Se o terminal mostrar um erro com `Cannot use import statement outside a module`, falta a mudança do passo 2. Se mostrar `EADDRINUSE`, tens outro servidor ligado na porta 3000, provavelmente o catálogo: para-o com Ctrl+C no terminal onde ele está a correr.

### Paragem 2

`GET /api/artigos` responde 200 com os oito artigos em JSON, e o servidor continua à escuta no terminal.

## Fase 3: a rota de detalhe

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), exemplo guiado, passo 1.

Uma rota com `:id` lê um valor do caminho. Converte-se para número e valida-se antes de procurar. Um valor inválido recebe 400; um identificador válido sem artigo recebe 404.

O `Number(...)` converte o texto recebido: `"2"` passa ao número 2. Com `"abc"`, produz `NaN`, um valor que indica que a conversão não deu um número. O `Number.isInteger(id)` verifica se o resultado é inteiro: dá `true` para 2 e `false` para 2.5, `NaN` ou o texto `"2"`. O `!` inverte essa resposta e o `||` significa "ou". Assim, a condição recusa um valor não inteiro ou menor que 1.

O `res.status(400)` prepara o código de estado, mas ainda não envia a resposta. O `.json(...)` a seguir envia a mensagem em JSON; sem `status`, o Express usaria 200. Depois de responder a um erro, o `return` termina a função para impedir uma segunda resposta.

1. Depois de `/api/artigos`, acrescenta este bloco completo ao `server.js`. As mensagens preservam o contrato usado em LP:

```js
app.get("/api/artigos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
    return;
  }
  const artigo = artigos.find((artigo) => artigo.id === id);
  if (!artigo) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
});
```

Leitura guiada: segue conversão, validação, procura e resposta. O `return` de cada erro impede uma segunda resposta. Aqui os nomes são `artigos` e `artigo`, porque os dados são da papelaria.
2. Guarda e abre, um de cada vez: `/api/artigos/2`, `/api/artigos/abc`, `/api/artigos/0`, `/api/artigos/2.5` e `/api/artigos/99`.
3. Para cada um, regista o código (no separador Rede das ferramentas de programador) e a mensagem.

O que deves ver: 200 com a esferográfica azul; 400 para `abc`, `0` e `2.5`, com a mensagem do identificador; e 404 para o 99, com `Não existe o artigo 99`.

4. Agora uma experiência. Na linha `const id = Number(req.params.id);`, apaga o `Number(` e o `)` correspondente, para ficar `const id = req.params.id;`. Guarda e abre `/api/artigos/2`.
5. Prevê antes de abrir e regista o resultado. A resposta é 400: sem `Number`, o identificador é o texto `"2"`, e `Number.isInteger("2")` é falso.
6. Repõe o `Number(...)` e confirma que `/api/artigos/2` volta a responder 200.

### Paragem 3

O detalhe válido responde 200, o identificador inválido responde 400 e o inexistente responde 404. Repuseste o `Number` e confirmaste que `/api/artigos/2` volta a responder 200.

## Fase 4: o filtro por categoria

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), exemplo guiado, passo 2.

A pesquisa depois do `?` afina a lista sem mudar a rota. Guarda-se numa variável própria. Não se escreve de volta em `req.query`.

1. Substitui a rota `/api/artigos` por este bloco completo:

```js
app.get("/api/artigos", (req, res) => {
  const categoria = req.query.categoria;
  if (categoria) {
    const daCategoria = artigos.filter((artigo) => artigo.categoria === categoria);
    res.json(daCategoria);
    return;
  }
  res.json(artigos);
});
```

Leitura guiada: com uma categoria, `filter` cria uma lista nova com os artigos que têm o mesmo texto. Sem categoria, responde com todos. Uma lista vazia continua a ser um resultado válido.
2. Abre `/api/artigos?categoria=Papel`, `/api/artigos?categoria=Cola` e `/api/artigos`, sem nada.

O que deves ver: o caderno, o bloco de notas e a resma de papel, que são os três artigos da categoria Papel. Uma lista vazia, `[]`, com o código 200. Isto acontece porque a papelaria não tem nenhum artigo da categoria Cola. E a lista toda.

3. Prevê o resultado de `/api/artigos?categoria=papel` e só depois abre. A resposta é `[]` com 200: `"papel"` e `"Papel"` são textos diferentes na comparação `===`. Regista a explicação. A pesquisa vazia `?categoria=` devolve todos, porque o texto vazio não entra no `if`.

Guarda esta experiência no caderno para a continuação prevista em Linguagens de Programação. Quando o professor retomar este percurso em LP, podes comparar a mesma pergunta no MongoDB Atlas, com o filtro `{ categoria: "papel" }`. Antes de a fazeres, lê o que escreveste aqui e faz a previsão.

### Paragem 4

Registaste a experiência desta fase e explicaste por que o resultado depende do lugar dos dados ou da comparação dos textos.

## Fase 5: ver os dados do pedido no browser

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "Observar os pedidos no browser".

1. Com o separador Rede aberto, abre `/api/artigos?categoria=Escrita`.
2. Clica no pedido e abre o separador "Payload" ("Carga", no Chrome em português). Regista o que aparece em "Query String Parameters".
3. Abre `/api/artigos/3` e procura no Payload o 3. A resposta: está no caminho, que aparece em "Headers" ("Cabeçalhos"), em "Request URL". No pedido anterior, o Payload mostra `categoria: Escrita`.

No Safari, abre "Network" e escolhe o pedido. No separador "Headers", a secção "Summary" mostra a URL e o código; "Query String Parameters" mostra `categoria: Escrita`. No pedido a `/api/artigos/3`, o 3 faz parte da URL e não aparece como parâmetro de pesquisa.

### Paragem 5

Consegues indicar o caminho, a pesquisa e o código da resposta observada nesta fase.

## Fase 6: o middleware de registo

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "O middleware" e exemplo guiado, passo 3.

O middleware escreve uma mensagem sem responder. Chama `next()` para a rota poder continuar a tratar o pedido.

1. Depois dos artigos e antes das rotas, acrescenta:

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

Leitura guiada: `req.method` e `req.url` descrevem o pedido atual. A última chamada entrega-o ao próximo passo da fila.
2. Guarda e faz três pedidos quaisquer. No terminal, aparece uma linha por pedido, com o método e o endereço. Aparecem também linhas `GET /favicon.ico`, que não pediste: é o browser a pedir sozinho o ícone do separador, como explica o passo 3 do exemplo guiado.
3. Agora o primeiro erro de propósito. Apaga a linha `next();` do middleware. Guarda e abre `/api/artigos`. Prevê antes.

O que deves ver: o browser fica à espera de uma resposta nova. Pode continuar a mostrar a página anterior enquanto a navegação decorre. No terminal, aparece a linha `GET /api/artigos`, sem uma mensagem de erro do Express. O middleware recebeu o pedido, não respondeu e não o passou à frente: o pedido ficou parado.

No ambiente Docker indicado pelo professor, também aparecem pedidos automáticos para confirmar se a API responde. Reconheces esses pedidos pela pesquisa `verificacao=docker`; são separados da tua ação no browser.

4. Repõe o `next();`, guarda e volta a abrir `/api/artigos` para confirmar que tudo responde. Se a navegação antiga terminar com erro de ligação durante o reinício, faz um pedido novo depois de o servidor arrancar.

### Paragem 6

Depois de repores o `next()`, `/api/artigos` volta a responder com a lista. O pedido aparece no terminal antes de a rota responder.

## Fase 7: o middleware final e a ordem da fila

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "O middleware", com as três regras, e exemplo guiado, passo 5.

1. Antes de acrescentares o middleware final, abre `/nao-existe` e regista o código e o que o browser mostra.

O que deves ver: o código 404 e uma pequena página com o texto `Cannot GET /nao-existe`. Nenhuma rota respondeu, e o Express respondeu por ti, com a sua resposta de omissão, que é uma página HTML. Numa API, que responde sempre com dados, essa página é um problema: um programa que esteja à espera de JSON não a sabe ler.

2. Depois de todas as rotas e antes de `app.listen`, acrescenta este bloco completo:

```js
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});
```

Leitura guiada: o código 404 marca um pedido sem rota; `json` mantém o formato que os clientes desta API esperam. O bloco não chama `next()` porque já respondeu.
3. Abre outra vez `/nao-existe`. Deves ver `{"erro":"Rota não encontrada"}`, com o código 404. Abre também `http://localhost:3000/`, o endereço sem caminho nenhum: esta API não tem página inicial, e a resposta é a mesma.
4. O segundo erro de propósito. Muda o middleware de registo para baixo das rotas, logo antes do middleware final. Guarda, abre `/api/artigos` e depois `/nao-existe`. Prevê primeiro: que linhas vão aparecer no terminal?

O que deves ver: os dois pedidos respondem como antes, mas no terminal só aparece `GET /nao-existe`, e talvez também `GET /favicon.ico`. O pedido a `/api/artigos` foi respondido pela rota, acabou ali e nunca chegou ao middleware de registo. Só passam por ele os pedidos a que nenhuma rota respondeu, a caminho do middleware final, e o pedido do ícone, que o browser faz sozinho, é um deles. É a segunda regra do middleware: o que tem de ver os pedidos antes das rotas tem de estar acima delas.

5. Repõe o middleware de registo no sítio certo, logo a seguir aos artigos, guarda e confirma que `/api/artigos` volta a aparecer no terminal.
6. O terceiro erro de propósito. Muda o middleware final para logo a seguir ao middleware de registo, antes de todas as rotas. Guarda e abre `/api/artigos/2`. Prevê primeiro.

O que deves ver: `{"erro":"Rota não encontrada"}` em todos os endereços, incluindo os que existem. O middleware final responde a tudo e não chama `next()`, por isso nenhum pedido chega às rotas. No terminal, cada pedido continua a aparecer, porque o middleware de registo está antes do final.

7. Repõe o middleware final no fim do ficheiro, logo antes do `app.listen`, e confirma que as rotas voltam a responder.

### Paragem 7

O middleware de registo ficou antes das rotas e o final depois delas. Repetiste o detalhe válido e o endereço desconhecido.

## Fase 8: a tabela de contratos e a evidência

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "A tabela de contratos HTTP".

1. Escreve no caderno a tabela de contratos HTTP da tua API, com uma linha por pedido que ela aceita, e mais uma para o que acontece a qualquer outro pedido. Em cada linha, todas as respostas possíveis, incluindo as de erro, com o código e o corpo.
2. Verifica cada linha no browser, com o separador Rede aberto, e marca-a como verificada.
3. Regista três pedidos de detalhe: um válido, outro com parâmetro inválido e outro com recurso inexistente. Para cada um, guarda o endereço, o código e a mensagem.
4. Volta à tabela de previsões da parte 1 e corrige a lápis o que previste mal. Para cada correção, escreve numa frase o que te enganou.

Guarda a tabela. Em Linguagens de Programação, no tema API Express e contratos, vais escrever o contrato desta API antes de lhe acrescentares rotas novas. E a tua tabela é o ponto de partida.

### Paragem 8

Depois de escreveres e verificares a tua tabela, confere o contrato da aplicação construída neste laboratório:

| Método | Caminho | Entrada | Respostas possíveis |
| --- | --- | --- | --- |
| `GET` | `/api/artigos` | Pesquisa: `categoria`, opcional; ausente ou vazia pede a lista toda | 200, lista JSON de artigos; sem correspondências, `[]` |
| `GET` | `/api/artigos/:id` | Caminho: `id`, inteiro positivo | 200, objeto JSON do artigo; 400, `{"erro":"O identificador do artigo tem de ser um número inteiro positivo"}`; 404, `{"erro":"Não existe o artigo 99"}`, usando o identificador pedido |
| Qualquer | Pedido não tratado pelas rotas anteriores | Nenhuma entrada usada | 404, `{"erro":"Rota não encontrada"}` |

O contrato confirma: detalhe válido dá 200; `abc`, zero e decimal dão 400; 99 dá 404. Papel dá três artigos e Cola dá uma lista vazia com 200. O pedido desconhecido dá 404 em JSON.

Confere o ficheiro `server.js` completo depois das alterações:

```js
// server.js: a API da papelaria, num só ficheiro.
// Responde só com dados, em JSON. Mostra os dados que um pedido traz no
// caminho e na pesquisa, os códigos 200, 400 e 404 e o middleware.
import express from "express";

const app = express();
const PORTA = 3000;

// Os artigos da papelaria, em memória: existem enquanto o servidor estiver
// ligado. São os mesmos oito que vais guardar no MongoDB Atlas em Linguagens
// de Programação, com um id numérico em vez do _id.
const artigos = [
  { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
  { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
  { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
  { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
  { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
  { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
  { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
  { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
];

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Lista de artigos. Com ?categoria=Papel, só os dessa categoria.
app.get("/api/artigos", (req, res) => {
  const categoria = req.query.categoria;
  if (categoria) {
    const daCategoria = artigos.filter((artigo) => artigo.categoria === categoria);
    res.json(daCategoria);
    return;
  }
  res.json(artigos);
});

// Um artigo: GET /api/artigos/2. O :id é um parâmetro de rota.
app.get("/api/artigos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
    return;
  }
  const artigo = artigos.find((artigo) => artigo.id === id);
  if (!artigo) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
// Numa API, até o "não encontrado" é uma resposta em JSON.
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
```

Leitura guiada: o registo vem antes da lista e do detalhe. O middleware final fica depois dessas rotas. O `listen` só começa a escutar depois de a fila estar preparada.

## Problemas frequentes

### Cannot use import statement outside a module

O `package.json` ainda tem `"type": "commonjs"`. Muda para `"module"` e volta a arrancar. Guia do tema anterior: os erros de arranque.

### Não foi possível ligar a API: listen EADDRINUSE

Já há um servidor na porta 3000, quase sempre um que deixaste ligado noutro terminal, como o catálogo. Para-o com Ctrl+C no terminal dele.

### Mudei o código e nada mudou

O servidor não foi reiniciado. Se o arrancaste com `node server.js`, faz Ctrl+C e volta a arrancar; com `node --watch server.js`, basta guardar o ficheiro. Confirma também que guardaste: um ficheiro por guardar tem uma marca no separador do editor.

### Aparecem no terminal pedidos GET /favicon.ico que não fiz

É o browser a pedir sozinho o ícone que mostra no separador. A API não tem ícone, por isso esse pedido acaba com 404, no middleware final ou na resposta de omissão do Express, se o middleware final ainda não existir. Não é um erro do teu código. Guia: exemplo guiado, passo 3.

### Cannot set headers after they are sent to the client

Uma rota respondeu duas vezes: falta um `return` depois de uma resposta de erro. Guia: secção "Responder uma vez, e sair".

### Todos os pedidos aos artigos dão Rota não encontrada

Confirma primeiro se o middleware final está acima das rotas, como na experiência da fase 7. Depois compara o caminho pedido com o da rota. Pode estar `/artigos` onde devia estar `/api/artigos`. Compara letra a letra o caminho do `app.get` com o endereço.

## O que fica no teu caderno

1. A tabela de previsões da parte 1, com as correções da parte 8.
2. Os resultados das partes 3 e 4, incluindo as experiências do `Number` e da categoria em minúsculas, com a explicação.
3. Os três erros do middleware (partes 6 e 7): a previsão, o que aconteceu e porquê.
4. A tabela de contratos HTTP da tua API, verificada, e os três pedidos da evidência.

O professor vai pedir-te que justifiques o código de estado de um dos três pedidos da evidência. Também te vai pedir que expliques o efeito de retirar `next()` ao middleware de registo.

## Desafios

1. Acrescenta uma rota de caminho fixo `/api/artigos/sem-stock` que devolva os artigos com stock zero. Decide a sua posição antes de a experimentar.
2. Acrescenta a rota ao contrato e confirma que o detalhe do artigo 2 continua a responder.

## Antes de terminares

- [ ] A API mantém as mensagens combinadas com LP.
- [ ] Registaste 200, 400 e 404 e consegues justificar a diferença.
- [ ] Corrigiste todos os erros provocados e repetiste os pedidos anteriores.
- [ ] Guardaste a pasta `papelaria-api` e a tabela de contratos.
- [ ] Consegues explicar, por palavras tuas, o que muda entre um parâmetro do caminho e um da pesquisa.

![Rodapé](../imagens/rodape.png)
