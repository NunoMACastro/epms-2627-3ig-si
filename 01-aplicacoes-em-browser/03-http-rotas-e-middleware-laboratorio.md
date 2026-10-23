![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: HTTP, rotas e middleware

Laboratório do tema HTTP, rotas e middleware. Vais fazer crescer o teu catálogo com detalhe, pesquisa e uma fila de middleware. Cada experiência tem a explicação e a resposta no próprio passo a passo. Avança ao teu ritmo. O [guia](03-http-rotas-e-middleware.md) desenvolve a teoria.


## O que vais construir

Partes do catálogo mínimo e terminas com uma pesquisa na página inicial, respostas verificadas e uma tabela de contratos.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | Prevês as respostas | Tens uma tabela para comparar com o ensaio |
| 2 | Acrescentas detalhe e validação | Distingues identificador inválido de equipamento inexistente |
| 3 | Acrescentas um filtro | Pedes uma lista inteira, filtrada ou vazia |
| 4 | Inspecionas os dados | Localizas pesquisa e caminho no browser |
| 5 | Registas os pedidos | Cada pedido passa pelo registo e continua |
| 6 | Acrescentas um formulário GET | Pesquisas a partir de uma página |
| 7 | Controlas o fim da fila | Pedidos desconhecidos recebem o teu 404 |
| 8 | Verificas o contrato | Cada linha está apoiada numa resposta observada |

## Palavras que vais usar

- **Parâmetro de rota**: valor numa posição do caminho, como o 2 de `/equipamentos/2`.
- **Parâmetro de pesquisa**: nome e valor depois do `?`, usados para filtrar a lista.
- **Validação**: verificação de que os dados cumprem as regras antes de os usar.
- **Código de estado**: número da resposta; 200 indica sucesso, 400 um pedido inválido e 404 um recurso que não existe.
- **Middleware**: função no percurso de um pedido; responde ou chama a função seguinte.
- **`next()`**: entrega o pedido ao próximo passo da fila do Express.
- **Contrato HTTP**: tabela com o que cada pedido aceita e as respostas que pode produzir.
- **Payload**: separador do browser que mostra dados enviados, como os parâmetros de pesquisa.
- **JSON**: formato de texto que representa dados, como arrays e objetos.

## O que precisas

Precisas do catálogo de equipamentos do laboratório do tema anterior, a funcionar, com as rotas `/` e `/equipamentos`. Se não o tiveres, copia a pasta [catalogo-de-equipamentos](../exemplos/aplicacoes-em-browser/catalogo-de-equipamentos/README.md) para a tua pasta de trabalho e corre `npm install` dentro dela.

Se o teu catálogo já tem a rota de detalhe e o filtro por sala da aula, ótimo: nas partes 2 e 3 só acrescentas o que falta.

Em todo o laboratório, depois de mudares o `server.js`, reinicia o servidor (Ctrl+C e `node server.js`), ou usa `node --watch server.js`, que reinicia sozinho quando guardas.

## Se alguma coisa falhar

1. Confirma que o terminal está na pasta onde estão `server.js` e `package.json`. Usa `pwd` ou, no `cmd` do Windows, `cd` sem argumentos.
2. Confirma que o teu servidor está ligado e que o endereço usa a mesma porta e `http`.
3. Guarda a alteração e reinicia o teu processo com Ctrl+C e `node server.js`, ou usa `node --watch server.js`.
4. Lê o terminal antes de alterar outra linha. Escreve o esperado, o obtido e a hipótese que queres verificar.
5. Provoca só um erro de cada vez e repõe o código antes da experiência seguinte.

## Fase 1: prever antes de programar

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secções "Três sítios por onde um pedido traz dados" e "Os códigos de estado que o teu código escolhe".

Copia esta tabela para o caderno e preenche as duas últimas colunas com a tua previsão, antes de escreveres qualquer código. No fim do laboratório voltas a ela.

| Pedido | Onde vêm os dados | Código que esperas |
| --- | --- | --- |
| `GET /equipamentos/2` | | |
| `GET /equipamentos/abc` | | |
| `GET /equipamentos/0` | | |
| `GET /equipamentos/9` | | |
| `GET /equipamentos?sala=B12` | | |
| `GET /equipamentos?sala=Z99` | | |
| `GET /nao-existe` | | |

A resposta, depois de fazeres a previsão: o detalhe do identificador 2 dá 200. `abc` e zero dão 400. O identificador válido sem recurso dá 404. As duas pesquisas dão 200, mesmo quando a lista está vazia. O caminho desconhecido dá 404.

### Paragem 1

Escreveste uma previsão para cada pedido. A fase 8 dá a tabela para a conferires depois de experimentar.

## Fase 2: a rota de detalhe

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), exemplo guiado, passo 1.

Uma rota com `:id` aceita qualquer texto nessa posição do caminho. Converte-o para número, verifica a regra e só depois procura. Um pedido inválido recebe 400; um identificador válido sem equipamento recebe 404.

O `Number(...)` converte o texto recebido: `"2"` passa ao número 2. Com `"abc"`, produz `NaN`, um valor que indica que a conversão não deu um número. O `Number.isInteger(id)` verifica se o resultado é inteiro: dá `true` para 2 e `false` para 2.5, `NaN` ou o texto `"2"`. O `!` inverte essa resposta e o `||` significa "ou". Assim, a condição recusa um valor não inteiro ou menor que 1.

O `res.status(400)` prepara o código de estado, mas ainda não envia a resposta. O `.json(...)` a seguir envia a mensagem em JSON; sem `status`, o Express usaria 200. Depois de responder a um erro, o `return` termina a função para impedir uma segunda resposta.

1. Depois da rota `/equipamentos`, acrescenta este bloco completo ao `server.js`:

```js
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ erro: "O identificador tem de ser um número inteiro positivo" });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === id);
  if (!equipamento) {
    res.status(404).json({ erro: `Não existe o equipamento ${id}` });
    return;
  }
  res.json(equipamento);
});
```

Leitura guiada: lê a conversão primeiro. Cada verificação de erro responde e termina com `return`. Só o caso válido chega à resposta com o equipamento.
2. Reinicia e abre, um de cada vez: `/equipamentos/2`, `/equipamentos/abc`, `/equipamentos/0`, `/equipamentos/2.5` e `/equipamentos/9`.
3. Para cada um, regista o código (no separador Rede) e a mensagem.

O que deves ver: 200 com o projetor; 400 para `abc`, `0` e `2.5`; 404 para o 9.

4. Agora uma experiência. Na linha `const id = Number(req.params.id);`, apaga o `Number(` e o `)` correspondente, para ficar `const id = req.params.id;`. Reinicia e abre `/equipamentos/2`.
5. Prevê antes de abrir. Depois regista o que aconteceu. A resposta é 400: `id` ficou com o texto `"2"`, e `Number.isInteger("2")` é falso. Sem a conversão, a primeira verificação recusa o pedido.
6. Repõe o `Number(...)` e confirma que `/equipamentos/2` volta a responder 200.

### Paragem 2

O detalhe válido responde 200, o identificador inválido responde 400 e o inexistente responde 404. Repuseste o `Number`.

## Fase 3: o filtro por sala

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), exemplo guiado, passo 2.

O filtro não muda a rota: a pesquisa vem depois do `?`. Guarda-se numa variável própria, sem alterar `req.query`. Um filtro sem resultados devolve uma lista vazia, não um erro.

1. Substitui a rota `/equipamentos` por este bloco completo:

```js
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  if (sala) {
    const daSala = equipamentos.filter((equipamento) => equipamento.sala === sala);
    res.json(daSala);
    return;
  }
  res.json(equipamentos);
});
```

Leitura guiada: com uma sala, `filter` cria outra lista e o `return` termina depois de responder. Sem sala, o código chega à lista completa.
2. Abre `/equipamentos?sala=B12`, `/equipamentos?sala=Z99` e `/equipamentos`, sem nada.
3. Abre agora `/equipamentos?Sala=B12`, com o `S` maiúsculo. Prevê primeiro.

O que deves ver: o portátil e o monitor; uma lista vazia, `[]`, com o código 200; a lista toda; e, com `Sala` maiúsculo, outra vez a lista toda.

Pensa antes de continuares: por que `?Sala=B12` devolve tudo? A resposta: `Sala` e `sala` são nomes diferentes. A rota lê só `req.query.sala`, que fica `undefined`, e escolhe a lista completa.

### Paragem 3

Confirma no separador Rede o caminho e a pesquisa, em vez de adivinhar pelos dados mostrados.

## Fase 4: ver os dados do pedido no browser

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "Observar os pedidos no browser".

1. Com o separador Rede aberto, abre `/equipamentos?sala=A03`.
2. Clica no pedido e abre o separador "Payload" ("Carga"). Regista o que aparece em "Query String Parameters".
3. Abre `/equipamentos/3` e procura no Payload o 3. A resposta: não aparece nos parâmetros de pesquisa; faz parte do caminho. Encontra-o em "Headers" ("Cabeçalhos"), no "Request URL" (endereço do pedido). Na pesquisa anterior, o Payload mostra `sala: A03`.

### Paragem 4

Registaste a experiência desta fase e explicaste por que o resultado depende do lugar dos dados ou da comparação dos textos.

## Fase 5: o middleware de registo

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "O middleware" e exemplo guiado, passo 3.

Há trabalho que deve acontecer em todos os pedidos. Uma função de middleware permite escrevê-lo uma vez. `next()` passa o pedido à seguinte; escrever no terminal não envia uma resposta ao browser.

1. Logo a seguir aos dados e antes de todas as rotas, acrescenta este bloco completo:

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

Leitura guiada: a função lê o método e o endereço do pedido atual. Depois chama `next()` para a rota poder responder.
2. Reinicia e faz três pedidos quaisquer. No terminal, aparece uma linha por pedido, com o método e o endereço. Aparecem também linhas `GET /favicon.ico`, que não pediste: é o browser a pedir sozinho o ícone do separador, como explica o passo 3 do exemplo guiado.
3. Agora o primeiro erro de propósito. Apaga a linha `next();` do middleware. Reinicia e abre `/equipamentos`. Prevê antes.

O que deves ver: o browser fica à espera, com o indicador de carregamento a rodar, e não mostra nada. No terminal, aparece a linha `GET /equipamentos` e mais nada. Não há nenhuma mensagem de erro. O middleware recebeu o pedido, não respondeu e não o passou à frente: o pedido ficou parado.

4. Repõe o `next();`, reinicia e confirma que tudo volta a responder.

### Paragem 5

Cada pedido aparece no terminal com o método e o endereço. Repuseste o `next()` e confirmaste que as rotas voltaram a responder.

## Fase 6: a página inicial com uma pesquisa

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "GET e POST, com mais pormenor" e exemplo guiado, passo 4.

Um formulário `GET` põe os seus campos na pesquisa do endereço. O atributo `name` do campo escolhe o nome do parâmetro. Não há dados novos guardados no servidor.

1. Substitui a rota `/` por este bloco completo:

```js
app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="pt">
  <head><meta charset="utf-8"><title>Catálogo de equipamentos</title></head>
  <body>
    <h1>Catálogo de equipamentos</h1>
    <form method="get" action="/equipamentos">
      <label>Sala <input name="sala"></label>
      <button type="submit">Pesquisar</button>
    </form>
  </body>
</html>`);
});
```

Leitura guiada: a rota envia uma página HTML. O formulário aponta para `/equipamentos` e o campo tem `name="sala"`; por isso o browser constrói a pesquisa que a rota da lista já lê.
2. Abre `http://localhost:3000/`, escreve `B12` no campo e carrega em "Pesquisar".
3. Olha para a barra de endereço e para o separador Rede.

O que deves ver: o browser foi para `/equipamentos?sala=B12`. O formulário `GET` transformou o campo `sala` num parâmetro de pesquisa, e a rota que respondeu é a mesma da parte 3.

### Paragem 6

Ao enviares a pesquisa da página inicial, o browser abre `/equipamentos?sala=B12`. A rota da lista lê o parâmetro `sala` e responde com os equipamentos dessa sala.

## Fase 7: o middleware final e a ordem da fila

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "O middleware", com as três regras, e exemplo guiado, passo 5.

Depois de todas as rotas, só chegam os pedidos ainda sem resposta. Um middleware final responde-lhes com o teu 404. Não chama `next()`, porque já terminou o pedido.

1. Depois de todas as rotas, logo antes de `app.listen`, acrescenta:

```js
app.use((req, res) => {
  res.status(404).send("Página não encontrada.");
});
```

Leitura guiada: `status` marca 404 e `send` envia a mensagem. A posição deste bloco garante que não esconde as rotas existentes. Reinicia o servidor.
2. Abre `/nao-existe`. Deves ver "Página não encontrada.", com o código 404.
3. O segundo erro de propósito. Muda o middleware de registo para baixo das rotas, logo antes do middleware final. Reinicia, abre `/equipamentos` e depois `/nao-existe`. Prevê primeiro: que linhas vão aparecer no terminal?

O que deves ver: as duas páginas respondem como antes, mas no terminal só aparece `GET /nao-existe`, e talvez também `GET /favicon.ico`. O pedido a `/equipamentos` foi respondido pela rota, acabou ali e nunca chegou ao middleware de registo. Só passam por ele os pedidos a que nenhuma rota respondeu, a caminho do middleware final, e o pedido do ícone, que o browser faz sozinho, é um deles. É a segunda regra do middleware: o que tem de ver os pedidos antes das rotas tem de estar acima delas.

4. Repõe o middleware de registo no sítio certo, logo a seguir aos dados, reinicia e confirma que `/equipamentos` volta a aparecer no terminal.
5. O terceiro erro de propósito. Muda o middleware final para logo a seguir ao middleware de registo, antes de todas as rotas. Reinicia e abre `/equipamentos`. Prevê primeiro.

O que deves ver: "Página não encontrada." para todos os endereços, incluindo os que existem. O middleware final responde a tudo e não chama `next()`, por isso nenhum pedido chega às rotas. No terminal, cada pedido continua a aparecer, porque o middleware de registo está antes do final.

6. Repõe o middleware final no fim do ficheiro e confirma que as rotas voltam a responder.

### Paragem 7

O middleware de registo ficou antes das rotas e o final depois delas. Repetiste o detalhe válido e o endereço desconhecido.

## Fase 8: a tabela de contratos e a evidência

Para saber mais: no [guia do tema](03-http-rotas-e-middleware.md), secção "A tabela de contratos HTTP".

1. Escreve no caderno a tabela de contratos HTTP do teu servidor, com uma linha por pedido que ele aceita. Usa as colunas método, caminho, entrada e respostas possíveis, incluindo erros. Se acrescentaste alguma coisa, acrescenta a linha.
2. Verifica cada linha no browser, com o separador Rede aberto, e marca-a como verificada.
3. Regista três pedidos de detalhe: um válido, outro com parâmetro inválido e outro com recurso inexistente. Para cada um, guarda o endereço, o código e a mensagem.
4. Volta à tabela de previsões da parte 1 e corrige a lápis o que previste mal. Para cada correção, escreve numa frase o que te enganou.

### Paragem 8

Depois de escreveres e verificares a tua tabela, confere o contrato da aplicação construída neste laboratório:

| Método | Caminho | Entrada | Respostas possíveis |
| --- | --- | --- | --- |
| `GET` | `/` | Nenhuma | 200, página HTML com o formulário de pesquisa por sala |
| `GET` | `/equipamentos` | Pesquisa: `sala`, opcional; ausente ou vazia pede a lista toda | 200, lista JSON de equipamentos; sem correspondências, `[]` |
| `GET` | `/equipamentos/:id` | Caminho: `id`, inteiro positivo | 200, objeto JSON do equipamento; 400, `{"erro":"O identificador tem de ser um número inteiro positivo"}`; 404, `{"erro":"Não existe o equipamento 9"}`, usando o identificador pedido |
| Qualquer | Pedido não tratado pelas rotas anteriores | Nenhuma entrada usada | 404, `Página não encontrada.` |

| Pedido | Dados | Código |
| --- | --- | --- |
| `/equipamentos/2` | caminho | 200 |
| `/equipamentos/abc` | caminho | 400 |
| `/equipamentos/0` | caminho | 400 |
| `/equipamentos/9` | caminho | 404 |
| `/equipamentos?sala=B12` | pesquisa | 200 |
| `/equipamentos?sala=Z99` | pesquisa | 200, lista vazia |
| `/nao-existe` | nenhum campo de dados | 404 |

Esta é a resposta à previsão inicial. Compara-a com a tua só depois de preveres.

O `server.js` completo, para conferires depois das alterações, é este:

```js
// server.js: o catálogo de equipamentos da escola, agora com middleware.
// Mostra os dados que um pedido traz no caminho e na pesquisa, os códigos
// que o código escolhe (200, 400 e 404) e o middleware, que corre antes das rotas.
import express from "express";

const app = express();
const PORTA = 3000;

// Os dados ficam em memória: existem enquanto o servidor estiver ligado.
const equipamentos = [
  { id: 1, nome: "Portátil", sala: "B12" },
  { id: 2, nome: "Projetor", sala: "A03" },
  { id: 3, nome: "Impressora", sala: "Secretaria" },
  { id: 4, nome: "Monitor", sala: "B12" },
];

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Página inicial, com um formulário de pesquisa que envia por GET.
app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="pt">
  <head><meta charset="utf-8"><title>Catálogo de equipamentos</title></head>
  <body>
    <h1>Catálogo de equipamentos</h1>
    <form method="get" action="/equipamentos">
      <label>Sala <input name="sala"></label>
      <button type="submit">Pesquisar</button>
    </form>
  </body>
</html>`);
});

// Lista de equipamentos. Com ?sala=B12, só os dessa sala.
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  if (sala) {
    const daSala = equipamentos.filter((equipamento) => equipamento.sala === sala);
    res.json(daSala);
    return;
  }
  res.json(equipamentos);
});

// Um equipamento: GET /equipamentos/2. O :id é um parâmetro de rota.
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ erro: "O identificador tem de ser um número inteiro positivo" });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === id);
  if (!equipamento) {
    res.status(404).json({ erro: `Não existe o equipamento ${id}` });
    return;
  }
  res.json(equipamento);
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).send("Página não encontrada.");
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
```

Leitura guiada: lê os blocos pela ordem em que um pedido os encontra: registo, rotas e resposta final. O `listen` liga a escuta depois de preparar essa fila.

## Problemas frequentes

### Mudei o código e nada mudou

O servidor não foi reiniciado. Ctrl+C e `node server.js`, ou usa `node --watch server.js`.

### Aparecem no terminal pedidos GET /favicon.ico que não fiz

É o browser a pedir sozinho o ícone que mostra no separador. O catálogo não tem ícone, por isso esse pedido acaba com 404, no middleware final ou na resposta do Express, se o middleware final ainda não existir. Não é um erro do teu código. Guia: exemplo guiado, passo 3.

### Cannot set headers after they are sent to the client

Uma rota respondeu duas vezes: falta um `return` depois de uma resposta de erro. Guia: secção "Responder uma vez, e sair".

### A página inicial aparece como texto, com as etiquetas à vista

Confirma o cabeçalho `Content-Type`: esta rota deve enviar HTML com `res.send`. Confirma também que não escapaste as etiquetas como texto. O `doctype` identifica o documento HTML; a sua ausência não transforma a resposta em texto simples. Compara a tua rota com a da fase 6.

### SyntaxError a apontar para uma linha do HTML

Há uma crase dentro do HTML, que o JavaScript leu como o fim do texto. Dentro de um texto com crases, o HTML não pode ter crases.

## O que fica no teu caderno

1. A tabela de previsões da parte 1, com as correções da parte 8.
2. Os resultados das partes 2 e 3, incluindo as experiências do `Number` e do `Sala` maiúsculo, com a explicação.
3. Os três erros do middleware (partes 5 e 7): a previsão, o que aconteceu e porquê.
4. A tabela de contratos HTTP do teu servidor, verificada, e os três pedidos da evidência.

O professor vai pedir-te que justifiques o código de estado de um dos três pedidos da evidência. Também te vai pedir que expliques o efeito de retirar `next()` ao middleware de registo.

## Desafios

1. Acrescenta `GET /equipamentos/salas`, com as salas sem repetições. Decide onde deve ficar para não ser confundida com a rota de detalhe.
2. Acrescenta a linha dessa rota ao contrato e testa também uma pesquisa sem resultados.

## Antes de terminares

- [ ] O identificador inválido dá 400 e o equipamento inexistente dá 404.
- [ ] O filtro vazio dá 200 com `[]`.
- [ ] Repuseste os três erros provocados e repetiste os pedidos anteriores.
- [ ] O contrato inclui os casos de erro.
- [ ] Consegues explicar, por palavras tuas, o percurso de um pedido na fila do Express.

![Rodapé](../imagens/rodape.png)
