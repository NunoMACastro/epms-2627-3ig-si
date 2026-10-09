![Cabeçalho](../imagens/cabecalho.png)

# HTTP, rotas e middleware

Módulo Aplicações baseadas em browsers. Terceiro tema do módulo, com quatro aulas de 60 minutos. Este guia explica como um pedido traz dados até ao servidor, como o servidor escolhe o código de estado da resposta e o que é o middleware, o código que corre antes das rotas. Os passos para o fazeres no teu computador estão no [laboratório](03-http-rotas-e-middleware-laboratorio.md), e os exercícios para fazeres sozinho estão na [ficha](03-http-rotas-e-middleware-exercicios.md).

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. Três sítios por onde um pedido traz dados
4. GET e POST, com mais pormenor
5. Os códigos de estado que o teu código escolhe
6. O middleware
7. Exemplo guiado: o catálogo cresce
8. Observar os pedidos no browser
9. A tabela de contratos HTTP
10. Erros frequentes
11. Segurança: o que este tema já pede
12. Verificar o que aprendeste
13. O que vem a seguir

## O que vais aprender

No tema anterior, o servidor respondia sempre a mesma coisa ao mesmo endereço: a lista toda dos equipamentos. Um servidor útil responde ao que lhe pedem: este equipamento e não outro, só os desta sala, esta reserva com estes dados. Para isso, o pedido tem de trazer dados, e o servidor tem de os ler, de os verificar e de responder com o código certo, incluindo quando o pedido está mal feito. É isso que este tema trata, e é o coração do HTTP visto do lado do servidor.

No fim deste guia deves conseguir:

- dizer, para um pedido, se os dados vêm no caminho, nos parâmetros de pesquisa ou no corpo, e lê-los com `req.params`, `req.query` e `req.body`;
- escolher entre `GET` e `POST` para uma operação, e explicar a escolha;
- escolher o código de estado de uma resposta (200, 201, 400 ou 404) e distinguir um parâmetro inválido de um recurso inexistente;
- explicar o que é o middleware, escrever um, e prever o que acontece quando a ordem do `app.use` muda;
- observar, nas ferramentas de programador do browser, os dados que cada pedido levou e a resposta que recebeu;
- descrever o servidor numa tabela de contratos HTTP: para cada pedido, o que entra e que respostas pode ter.

## O que já sabes e vais usar

Do primeiro tema: o pedido e a resposta HTTP, as partes de um endereço (caminho e parâmetros de pesquisa), os métodos `GET` e `POST`, as famílias de códigos de estado e o separador Rede das ferramentas de programador.

Do segundo tema: o servidor do catálogo de equipamentos, com o `import` do Express, o `app.get`, a função da rota com `req` e `res`, o `res.send` e o `res.json`, o `app.listen` com o `if (erro)`, os dois momentos do ficheiro (o arranque e cada pedido) e a forma de ler uma mensagem de erro do Node.

De JavaScript: `Number(...)` para converter texto em número, o `find` e o `filter` dos arrays, e o `return` para sair de uma função.

Nas aulas, o catálogo já ganhou uma rota que mostra um só equipamento e um filtro por sala. O exemplo guiado parte daí e explica essas duas partes com mais pormenor, antes de acrescentar o que é novo.

## Três sítios por onde um pedido traz dados

Um pedido HTTP pode trazer dados em três sítios, e cada um serve uma coisa diferente. O sítio certo escolhe-se pelo papel que os dados têm no pedido: identificar o que se pede, afinar o pedido, ou levar os dados de uma operação que muda alguma coisa.

### No caminho: parâmetros de rota

No endereço `/equipamentos/2`, o `2` faz parte do caminho e identifica um equipamento. Do lado do servidor, a rota escreve-se com dois pontos antes do nome do parâmetro:

```js fragment
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id);
  // ...
});
```

O `:id` quer dizer "aqui vem um valor, e chama-lhe `id`". O Express compara o caminho do pedido com o da rota, parte a parte, e guarda o que estava no lugar do `:id` em `req.params.id`. Esta rota responde a `/equipamentos/2`, a `/equipamentos/99` e também a `/equipamentos/abc`: o Express não sabe que o `id` devia ser um número. Verificá-lo é trabalho teu.

Usa-se um **parâmetro de rota** para identificar o recurso que se pede: este equipamento, esta reserva. É a parte do endereço que diz "qual".

### Depois do ponto de interrogação: parâmetros de pesquisa

No endereço `/equipamentos?sala=B12`, o `sala=B12` vem depois do `?` e não muda o que se pede (continua a ser a lista de equipamentos), mas afina-o: só os da sala B12. O Express guarda cada parâmetro de pesquisa em `req.query`, pelo nome:

```js fragment
const sala = req.query.sala; // "B12", ou undefined se não vier nenhum ?sala=
```

Usa-se um **parâmetro de pesquisa** para filtrar, ordenar, escolher uma página de resultados ou passar uma opção. São normalmente opcionais: sem `?sala=`, a rota devolve a lista toda. A rota não muda por haver ou não parâmetros de pesquisa: `/equipamentos` e `/equipamentos?sala=B12` chegam à mesma rota.

### No corpo do pedido

Quando um formulário envia dados com `method="post"`, os dados não vão no endereço: vão no **corpo** do pedido, como viste no exemplo guiado do primeiro tema:

```text
POST /reservas HTTP/1.1
Content-Type: application/x-www-form-urlencoded

equipamento_id=2&data=2026-10-20&tempo=3
```

O formato é o mesmo dos parâmetros de pesquisa (nome, `=`, valor, separados por `&`), mas o sítio é outro. O Express não lê o corpo sozinho: precisa de um middleware que o leia e ponha os valores em `req.body`. A secção 6 explica o que é, e o exemplo guiado acrescenta-o.

Usa-se o **corpo** para enviar os dados de uma operação que cria ou altera alguma coisa: os campos da reserva, os dados de um novo equipamento.

### Tudo chega como texto

Seja qual for o sítio, os valores chegam sempre como texto. Em `/equipamentos/2`, `req.params.id` é `"2"`, entre aspas, e não o número 2. E `"2" === 2` é `false`. Por isso, antes de comparar com o `id` de um equipamento, converte-se com `Number(...)`. É a causa de muitos "não encontrado" que deviam ter encontrado.

| Sítio | Exemplo | Lê-se em | Serve para |
| --- | --- | --- | --- |
| Caminho | `/equipamentos/2` | `req.params.id` | Identificar o recurso |
| Pesquisa | `/equipamentos?sala=B12` | `req.query.sala` | Filtrar, ordenar, opções |
| Corpo | `equipamento_id=2&...` num `POST` | `req.body.equipamento_id` | Dados de uma operação que muda alguma coisa |

### Para confirmar

1. Em `/reservas/5?formato=curto`, o que está em `req.params` e o que está em `req.query`?
2. Porque é que `equipamentos.find((e) => e.id === req.params.id)` nunca encontra nada?
3. Um pedido para criar um equipamento novo: os dados vão no caminho, na pesquisa ou no corpo?

## GET e POST, com mais pormenor

No primeiro tema ficou a regra: `GET` para ver, `POST` para mudar. Há mais três diferenças práticas, que decorrem dessa.

**Onde vão os dados.** Num `GET`, os dados vão no endereço, nos parâmetros de pesquisa: ficam no histórico do browser, podem ser guardados nos favoritos e enviados a alguém, e ficam escritos nos registos dos servidores por onde o pedido passa. Num `POST`, vão no corpo: não aparecem na barra de endereço. Isto não quer dizer que um `POST` seja secreto (sem HTTPS, o corpo também viaja à vista), mas uma palavra-passe nunca vai num `GET`, porque ficaria registada em todo o lado.

**Repetir.** Um `GET` pode repetir-se as vezes que se quiser. Se recarregares uma página que resultou de um `POST`, o browser avisa que vai reenviar o formulário, porque sabe que isso pode repetir a operação: uma segunda reserva igual à primeira. O tema dos formulários mostra como evitar esse problema.

**Os formulários escolhem.** Um formulário HTML diz o método no atributo `method`:

```text
<form method="get" action="/equipamentos">   os campos vão para o endereço: /equipamentos?sala=B12
<form method="post" action="/reservas">      os campos vão para o corpo do pedido
```

Uma pesquisa é um formulário `GET`: não muda nada, e o resultado pode ser guardado ou partilhado pelo endereço. Uma reserva é um formulário `POST`. Sem `method`, o formulário usa `GET`.

## Os códigos de estado que o teu código escolhe

### O 200 por omissão e o res.status

Até agora, o Express pôs sempre o código 200 nas respostas das tuas rotas, e o 404 nos pedidos para os quais não havia rota. Quando a resposta não correu bem, ou correu bem de uma forma especial, és tu que escolhes o código, com `res.status(...)` antes do `send` ou do `json`:

```js fragment
res.status(404).json({ erro: "Não existe o equipamento 9" });
```

O `res.status` não envia nada: só marca o código. Quem envia é o `json` a seguir. Por isso escrevem-se juntos, numa linha.

### Os quatro códigos deste tema

**200 OK.** O pedido correu bem e a resposta tem o que se pediu. É o que o Express põe se não disseres nada.

**201 Created.** O pedido criou alguma coisa nova, como uma reserva. É o código que o catálogo deste tema dá a um `POST` que criou uma reserva, e a resposta traz o que foi criado, com o identificador que o servidor lhe deu. Não é a única resposta possível a um pedido que criou alguma coisa: a subsecção "Depois de criar: 201, 303 ou 200", mais abaixo, explica quando se usa cada uma.

**400 Bad Request.** O pedido está mal feito, e o servidor recusa-se a tratá-lo: um identificador que não é um número, um campo obrigatório em falta, um tempo letivo negativo. A culpa é de quem fez o pedido, e repetir o mesmo pedido dá sempre o mesmo erro.

**404 Not Found.** O pedido está bem feito, mas o que se pediu não existe: o equipamento 9, quando só há quatro.

A diferença entre 400 e 404 é a que mais se confunde. Pensa assim: `abc` nunca pode ser o número de um equipamento, por isso `/equipamentos/abc` é um pedido mal feito, 400. O 9 podia ser o número de um equipamento; acontece que não existe, por isso `/equipamentos/9` é 404. Primeiro verifica-se se o pedido faz sentido; só depois se procura.

E há um caso que não é erro nenhum: `/equipamentos?sala=Z99`, uma sala sem equipamentos. A lista existe, só que está vazia. A resposta é 200 com `[]`. Um filtro que não encontra nada não é um recurso inexistente.

Falta o 500, que já conheces do tema anterior: o servidor falhou ao tratar um pedido que até podia estar certo. Não é um código que escolhas: é o que o Express responde quando o teu código rebenta. O tema dos erros e da segurança trata de como responder a isso de forma controlada.

### Depois de criar: 201, 303 ou 200

Um `POST` que criou uma reserva tem mais do que uma resposta certa, e a escolha depende de quem vai ler a resposta.

Se a resposta é para outro programa, que vai usar os dados, o código é 201, e o corpo traz o que foi criado, em JSON. A um servidor que responde assim, com dados para programas e não com páginas para pessoas, chama-se uma **API** (Application Programming Interface, interface de programação de aplicações). O catálogo deste tema ainda responde em JSON, como uma API, e por isso o exemplo guiado responde 201 com a reserva: é a forma mais direta de veres, no browser e no separador Rede, o que o servidor criou.

Se a resposta é para uma pessoa, que enviou um formulário numa página, o que ela precisa de ver é uma página de confirmação. Aqui, o mais habitual é o servidor responder com um redirecionamento, o código **303 See Other** ("vê outro"), com um cabeçalho `location` que aponta para a página da reserva, por exemplo `/reservas/28`. O browser faz sozinho um `GET` a esse endereço e mostra a confirmação. O 303 é da mesma família do 302 que viste na pesquisa da Wikipédia, no laboratório do primeiro tema; a diferença é que o 303 diz expressamente ao browser que o pedido seguinte é um `GET`, que é o que se quer depois de um `POST`. Responder logo 200 com a página de confirmação, como no exemplo guiado do primeiro tema, também funciona. Porque é que, numa página, o redirecionamento costuma ser a melhor escolha, explica-o o tema dos formulários, que é onde o vais usar.

### Responder uma vez, e sair

Cada pedido tem uma resposta, e uma só. Depois de um `res.status(400).json(...)`, a função tem de acabar, e é para isso que serve o `return` a seguir. Sem ele, a função continua, chega ao `res.json(equipamento)` mais abaixo, e tenta responder outra vez ao mesmo pedido. O browser recebe a primeira resposta, e o terminal mostra:

```text
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

"Não é possível definir os cabeçalhos depois de terem sido enviados": já houve resposta. Quando vires esta mensagem, procura uma resposta de erro sem `return` a seguir.

### Para confirmar

1. `/equipamentos/0`: 400 ou 404? E `/equipamentos/5`?
2. Uma pesquisa de equipamentos por nome que não encontra nenhum: que código?
3. No catálogo deste tema, que responde em JSON, um `POST /reservas` que guardou uma reserva nova: que código, e o que deve vir no corpo da resposta?

## O middleware

### O que é

Até agora, cada pedido ia direto para a rota que lhe correspondia. Há trabalho, porém, que se quer fazer em todos os pedidos, ou em muitos, antes de chegar à rota: escrever no terminal que pedido chegou, ler o corpo de um formulário, mais tarde verificar quem está a fazer o pedido. Escrever esse código dentro de cada rota seria repeti-lo dezenas de vezes.

Um **middleware** é uma função que o Express chama para os pedidos que chegam, antes das rotas. Recebe os mesmos `req` e `res` que as rotas, e mais um terceiro parâmetro, `next`, uma função que quer dizer "passa ao seguinte". Regista-se com `app.use`:

```js fragment
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

Este middleware escreve no terminal o método e o endereço de cada pedido (por exemplo, `GET /equipamentos?sala=B12`) e chama `next()`, para o pedido continuar o caminho. Corre para todos os pedidos, seja qual for o caminho, porque o `app.use` não lhe deu nenhum.

### Uma fila, pela ordem do ficheiro

O Express guarda os middlewares e as rotas pela ordem em que aparecem no ficheiro, e cada pedido percorre essa fila de cima para baixo. Em cada passo, a função que está na vez faz uma de duas coisas: ou responde, e o pedido acaba ali; ou chama `next()`, e o pedido passa à seguinte. Uma rota é, na prática, uma paragem que só aceita pedidos de um método e de um caminho, e que responde.

```text
pedido GET /equipamentos/2
   │
   ↓
middleware de registo         escreve "GET /equipamentos/2" e chama next()
   │
   ↓
middleware que lê o corpo     não há corpo; chama next()
   │
   ↓
rota GET /                    não é este caminho; o Express passa à seguinte
   │
   ↓
rota GET /equipamentos/:id    é este: responde 200 com o equipamento
                              (o pedido acaba aqui)

middleware final (404)        só chega aqui um pedido a que ninguém respondeu
```

Daqui saem as três regras do middleware, e cada uma corresponde a um erro que vais provocar no laboratório:

1. **Um middleware que não responde tem de chamar `next()`.** Se não chamar, o pedido fica parado: o browser fica à espera, com o indicador de carregamento a rodar, até desistir. Não aparece nenhuma mensagem de erro, o que torna este engano difícil de encontrar.
2. **Um middleware que prepara alguma coisa para as rotas tem de vir antes delas.** O que lê o corpo do pedido tem de estar acima das rotas que usam `req.body`. Se estiver abaixo, quando a rota corre o corpo ainda não foi lido.
3. **Um middleware que responde a tudo tem de vir depois de tudo.** O que responde "não encontrado" tem de ser o último. Se estiver em primeiro, responde 404 a todos os pedidos, e as rotas nunca chegam a correr.

A mesma fila decide entre duas rotas que servem o mesmo pedido. O Express fica com a primeira rota que encaixa no pedido, mesmo que haja mais abaixo outra que encaixe melhor. Imagina que acrescentas ao catálogo a rota `GET /reservas/:id`, para mostrar uma reserva, e que a escreves acima da rota `GET /reservas/nova`, a do formulário. Um pedido a `/reservas/nova` chega primeiro à rota com o parâmetro, e encaixa nela: o `:id` aceita qualquer valor naquele lugar do caminho, por isso o Express põe o texto `"nova"` em `req.params.id` e chama essa função. Se ela verificar o identificador como a rota de detalhe dos equipamentos, responde 400, porque `nova` não é um número, e a rota do formulário nunca chega a correr. No terminal não aparece nenhuma mensagem de erro, porque para o Express correu tudo bem: encontrou uma rota e ela respondeu.

Daqui sai a regra das rotas: quando duas rotas começam pelo mesmo caminho, a que tem o caminho fixo vem antes da que tem um parâmetro. `/reservas/nova` fica acima de `/reservas/:id`. Na ficha deste tema, o servidor da biblioteca pode ter o mesmo caso: se tiver a rota `/livros/disponiveis`, da ficha anterior, ela tem de ficar acima da rota `/livros/:id` que vais acrescentar. Nem todas as rotas parecidas entram em conflito. `GET /reservas`, sem mais nada, não encaixa em `/reservas/:id`, porque o Express compara o caminho parte a parte e `/reservas` tem uma parte a menos. E `POST /reservas` também não, porque o método é outro.

### O middleware que lê os formulários

O Express traz alguns middlewares feitos. O que lê o corpo de um formulário enviado por `POST` regista-se assim:

```js fragment
app.use(express.urlencoded({ extended: false }));
```

`urlencoded` é o nome do formato do corpo de um formulário (o `nome=valor&nome=valor`, o mesmo do `Content-Type: application/x-www-form-urlencoded`). Este middleware lê o corpo, separa os campos e põe-nos em `req.body`, como um objeto: `{ equipamento_id: "2", data: "2026-10-20", tempo: "3" }`. Os valores continuam a ser texto. O `extended: false` escolhe a forma simples de ler o formato, que é a que chega para formulários.

Sem este middleware, `req.body` não existe: é `undefined`. Uma rota que faça `req.body.equipamento_id` rebenta com `TypeError: Cannot read properties of undefined (reading 'equipamento_id')`, e o browser recebe um 500.

### O middleware final

O último `app.use` do servidor, sem caminho e sem `next`, apanha os pedidos a que nenhuma rota respondeu:

```js fragment
app.use((req, res) => {
  res.status(404).send("Página não encontrada.");
});
```

Substitui o `Cannot GET /...` do Express por uma resposta tua. Não precisa do parâmetro `next`, porque responde sempre.

### Para confirmar

1. Num middleware, o que acontece se não chamares `next()` nem responderes?
2. Porque é que o `express.urlencoded` tem de estar acima das rotas?
3. Se o middleware final estiver logo a seguir ao middleware de registo, que resposta tem um pedido a `/equipamentos`?

## Exemplo guiado: o catálogo cresce

O catálogo do tema anterior tinha duas rotas. Neste exemplo ganha a rota de detalhe e o filtro por sala, que já viste nas aulas, com a verificação que faltava, e depois o middleware e a primeira operação que muda dados: fazer uma reserva.

O resultado esperado, escrito antes de testar:

- `/equipamentos/2` responde 200 com o projetor; `/equipamentos/abc` responde 400; `/equipamentos/9` responde 404;
- `/equipamentos?sala=B12` responde com o portátil e o monitor; `?sala=Z99` responde 200 com uma lista vazia;
- o formulário de reserva, enviado com o equipamento 2, cria a reserva 1 e responde 201; enviado com o equipamento 9, responde 400;
- cada pedido aparece escrito no terminal;
- um endereço que não existe responde 404 com "Página não encontrada.".

### Passo 1: a rota de detalhe, com as duas verificações

```js fragment
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

A primeira verificação é nova. `Number("abc")` dá `NaN` (Not a Number, não é um número), `Number("2.5")` dá 2,5 e `Number("0")` dá 0. `Number.isInteger(id)` só é verdadeiro para números inteiros, e o `id < 1` recusa o zero e os negativos. Se a verificação falha, o pedido está mal feito: 400, e `return`. Só depois de o identificador fazer sentido é que se procura, e se a procura não encontra, é 404.

As mensagens de erro vão em JSON, com uma chave `erro`, porque as outras respostas desta rota também são JSON. Quem recebe a resposta sabe sempre onde procurar a mensagem.

### Passo 2: o filtro por sala

```js fragment
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

Sem `?sala=`, `req.query.sala` é `undefined`, o `if` não entra e a resposta é a lista toda. Com `?sala=B12`, o `filter` cria uma lista nova só com os equipamentos dessa sala. Se não houver nenhum, a lista nova está vazia, e a resposta é 200 com `[]`: como viste na secção 5, um filtro sem resultados não é um erro.

### Passo 3: o middleware de registo

Logo a seguir à criação da `app` e aos dados, antes de todas as rotas:

```js fragment
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

A partir daqui, cada pedido deixa uma linha no terminal. `req.url` é o endereço do pedido sem o servidor e a porta: o caminho e os parâmetros de pesquisa, como `/equipamentos?sala=B12`.

### Passo 4: a página inicial, com uma pesquisa por GET

A rota `/` deixa de responder com uma frase e passa a responder com uma pequena página HTML, com um formulário de pesquisa e uma ligação para o formulário de reserva. O HTML está escrito dentro de um texto com crases, que permite várias linhas:

```js fragment
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
    <p><a href="/reservas/nova">Fazer uma reserva</a></p>
  </body>
</html>`);
});
```

Quando escreves `B12` e carregas em "Pesquisar", o browser faz `GET /equipamentos?sala=B12`: o nome do campo, `sala`, passa a ser o nome do parâmetro de pesquisa. É a mesma rota do passo 2, agora usada a partir de um formulário. Escrever HTML assim, dentro de um texto, é desconfortável e fácil de errar; no próximo tema, o EJS resolve isso.

### Passo 5: o formulário de reserva e o POST

O formulário vem de uma rota `GET`, como qualquer página:

```js fragment
app.get("/reservas/nova", (req, res) => {
  res.send(`<!doctype html>
<html lang="pt">
  <head><meta charset="utf-8"><title>Nova reserva</title></head>
  <body>
    <h1>Nova reserva</h1>
    <form method="post" action="/reservas">
      <p><label>Número do equipamento <input name="equipamento_id" required></label></p>
      <p><label>Dia <input name="data" type="date" required></label></p>
      <p><label>Tempo <input name="tempo" type="number" min="1" required></label></p>
      <button type="submit">Reservar</button>
    </form>
  </body>
</html>`);
});
```

Quando é enviado, o browser faz `POST /reservas`, com os três campos no corpo. Para os ler, o middleware do formulário regista-se a seguir ao middleware de registo e antes das rotas:

```js fragment
app.use(express.urlencoded({ extended: false }));
```

E a rota que recebe o `POST`:

```js fragment
app.post("/reservas", (req, res) => {
  const equipamentoId = Number(req.body.equipamento_id);
  const data = req.body.data;
  const tempo = Number(req.body.tempo);

  const equipamento = equipamentos.find((equipamento) => equipamento.id === equipamentoId);
  if (!equipamento || !data || !Number.isInteger(tempo) || tempo < 1) {
    res.status(400).json({ erro: "Reserva inválida: confirma o equipamento, o dia e o tempo" });
    return;
  }

  const reserva = { id: proximoIdReserva, equipamentoId, data, tempo };
  proximoIdReserva = proximoIdReserva + 1;
  reservas.push(reserva);
  res.status(201).json(reserva);
});
```

`app.post` regista uma rota para o método `POST`; é o mesmo caminho de uma possível rota `GET /reservas`, mas outro método, e por isso outra rota. A função lê os três campos do `req.body` e converte os dois números. Recusa com 400 se o equipamento não existir, se o dia faltar ou se o tempo não for um inteiro positivo: os atributos `required` e `min` do formulário ajudam quem o preenche, mas não protegem nada, porque qualquer pessoa pode enviar um `POST` sem passar pelo formulário. Se estiver tudo bem, cria a reserva com o identificador seguinte, guarda-a no array `reservas` e responde 201 com ela, em JSON.

Aqui um equipamento inexistente dá 400, e não 404, como na rota de detalhe. A diferença está no que se pediu: na rota de detalhe pedia-se o equipamento 9, e ele não existe; aqui pediu-se para criar uma reserva, e os dados enviados não servem. O que não existe é parte de um pedido mal feito.

Para completar, no início do ficheiro, ao lado dos equipamentos, o array das reservas e o contador do identificador; e uma rota para ver as reservas feitas:

```js fragment
const reservas = [];
let proximoIdReserva = 1;

app.get("/reservas", (req, res) => {
  res.json(reservas);
});
```

### Passo 6: o middleware final

Depois de todas as rotas, e antes do `app.listen`, o middleware da secção 6 que responde "Página não encontrada.". A partir daqui, o `Cannot GET /...` do Express deixa de aparecer: é a tua resposta que aparece, a qualquer método e a qualquer caminho que nenhuma rota tratou.

### Passo 7: o servidor completo

```js
// server.js: o catálogo de equipamentos da escola, agora com reservas.
// Mostra as três formas de um pedido trazer dados (no caminho, na pesquisa
// e no corpo) e o middleware, que corre antes das rotas.
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
const reservas = [];
let proximoIdReserva = 1;

// Middleware 1: escreve no terminal cada pedido que chega, e passa-o à frente.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware 2: lê os dados enviados por um formulário com method="post"
// e põe-nos em req.body. Sem ele, req.body não existe.
app.use(express.urlencoded({ extended: false }));

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
    <p><a href="/reservas/nova">Fazer uma reserva</a></p>
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

// Um equipamento: GET /equipamentos/2. O :id é um parâmetro de caminho.
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

// Formulário de reserva, que envia por POST para /reservas.
app.get("/reservas/nova", (req, res) => {
  res.send(`<!doctype html>
<html lang="pt">
  <head><meta charset="utf-8"><title>Nova reserva</title></head>
  <body>
    <h1>Nova reserva</h1>
    <form method="post" action="/reservas">
      <p><label>Número do equipamento <input name="equipamento_id" required></label></p>
      <p><label>Dia <input name="data" type="date" required></label></p>
      <p><label>Tempo <input name="tempo" type="number" min="1" required></label></p>
      <button type="submit">Reservar</button>
    </form>
  </body>
</html>`);
});

// Criar uma reserva: POST /reservas, com os dados no corpo do pedido.
app.post("/reservas", (req, res) => {
  const equipamentoId = Number(req.body.equipamento_id);
  const data = req.body.data;
  const tempo = Number(req.body.tempo);

  const equipamento = equipamentos.find((equipamento) => equipamento.id === equipamentoId);
  if (!equipamento || !data || !Number.isInteger(tempo) || tempo < 1) {
    res.status(400).json({ erro: "Reserva inválida: confirma o equipamento, o dia e o tempo" });
    return;
  }

  const reserva = { id: proximoIdReserva, equipamentoId, data, tempo };
  proximoIdReserva = proximoIdReserva + 1;
  reservas.push(reserva);
  res.status(201).json(reserva);
});

// Lista das reservas feitas desde que o servidor arrancou.
app.get("/reservas", (req, res) => {
  res.json(reservas);
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

Este servidor, com o `package.json` e o `package-lock.json`, está na pasta de exemplos: [catalogo-com-reservas](../exemplos/aplicacoes-em-browser/catalogo-com-reservas/README.md). A versão do tema anterior, com as duas primeiras rotas, continua em [catalogo-de-equipamentos](../exemplos/aplicacoes-em-browser/catalogo-de-equipamentos/README.md).

### Passo 8: os resultados

Com o servidor ligado, cada endereço dá:

| Pedido | Código | Resposta |
| --- | --- | --- |
| `GET /equipamentos/2` | 200 | `{"id":2,"nome":"Projetor","sala":"A03"}` |
| `GET /equipamentos/abc` | 400 | `{"erro":"O identificador tem de ser um número inteiro positivo"}` |
| `GET /equipamentos/9` | 404 | `{"erro":"Não existe o equipamento 9"}` |
| `GET /equipamentos?sala=B12` | 200 | o portátil e o monitor |
| `GET /equipamentos?sala=Z99` | 200 | `[]` |
| `POST /reservas`, equipamento 2, dia 2026-10-20, tempo 3 | 201 | `{"id":1,"equipamentoId":2,"data":"2026-10-20","tempo":3}` |
| `POST /reservas`, equipamento 9 | 400 | `{"erro":"Reserva inválida: confirma o equipamento, o dia e o tempo"}` |
| `GET /reservas` | 200 | a lista com a reserva 1 |
| `GET /nao-existe` | 404 | `Página não encontrada.` |

E o terminal tem uma linha por pedido, escrita pelo middleware de registo: `GET /equipamentos/2`, `GET /equipamentos/abc`, `POST /reservas`, e assim por diante.

As reservas ficam no array enquanto o servidor estiver ligado. Se o reiniciares, voltam a zero, e a próxima reserva volta a ser a número 1. É mais uma razão para o servidor de dados do segundo módulo.

## Observar os pedidos no browser

Com o separador Rede das ferramentas de programador aberto, cada pedido ao teu servidor mostra o que levou. Clica no pedido e procura o separador "Payload" (em português, "Carga"; no Firefox, "Pedido"):

- num `GET` com parâmetros de pesquisa, aparece "Query String Parameters", com cada parâmetro e o seu valor;
- num `POST` de formulário, aparece "Form Data", com cada campo e o seu valor, e nos cabeçalhos do pedido aparece `Content-Type: application/x-www-form-urlencoded`;
- num parâmetro de rota não aparece nada no Payload: o valor faz parte do caminho, e vê-se no Request URL.

No separador "Headers", o Status Code mostra o código que o teu código escolheu. Depois de enviares o formulário de reserva, o browser mostra o JSON da reserva criada, e o separador Rede mostra o `POST /reservas` com o 201.

É esta a forma de confirmar, sem adivinhar, o que o browser enviou e o que o servidor respondeu. Quando um formulário não faz o que esperavas, a primeira pergunta é: os campos chegaram ao servidor, com o nome que a rota espera? O Payload responde.

## A tabela de contratos HTTP

Um servidor descreve-se, para quem o usa, numa tabela com uma linha por pedido que aceita: o método, o caminho, o que o pedido traz e que respostas pode ter. Chama-se-lhe contrato porque é uma promessa: quem fizer este pedido, assim, recebe uma destas respostas. A do catálogo é esta:

| Método | Caminho | Entrada | Respostas |
| --- | --- | --- | --- |
| `GET` | `/` | nenhuma | 200, página HTML com a pesquisa |
| `GET` | `/equipamentos` | pesquisa: `sala`, opcional | 200, lista em JSON, vazia se não houver nenhum |
| `GET` | `/equipamentos/:id` | caminho: `id`, inteiro positivo | 200, o equipamento; 400 se o `id` não for válido; 404 se não existir |
| `GET` | `/reservas/nova` | nenhuma | 200, página HTML com o formulário |
| `POST` | `/reservas` | corpo: `equipamento_id`, `data`, `tempo` | 201, a reserva criada; 400 se os dados não servirem |
| `GET` | `/reservas` | nenhuma | 200, lista das reservas em JSON |
| qualquer | qualquer outro | | 404, `Página não encontrada.` |

Esta tabela é o artefacto deste tema: no laboratório, escreves a do teu servidor e verificas cada linha no browser. Um contrato que não se verificou é só uma intenção.

## Erros frequentes

### O pedido fica a carregar e nunca acaba

Um middleware não chamou `next()` nem respondeu. No terminal, a linha do middleware de registo aparece (se ele estiver antes do culpado), e mais nada. Procura o middleware que não chama `next()`.

### Cannot read properties of undefined (reading '...')

```text
TypeError: Cannot read properties of undefined (reading 'equipamento_id')
```

Num `POST`, `req.body` é `undefined`: o `express.urlencoded` não está registado, ou está abaixo da rota. O browser recebe um 500.

### Todos os pedidos dão "Página não encontrada."

O middleware final está antes das rotas. Tem de ser o último `app.use` do ficheiro, logo antes do `app.listen`.

### Cannot set headers after they are sent to the client

```text
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

A função de uma rota respondeu duas vezes ao mesmo pedido: falta um `return` depois de uma resposta de erro.

### A rota de detalhe não aceita um equipamento que existe

O `req.params.id` não foi convertido com `Number(...)`. Com a verificação do passo 1, a resposta é 400, porque um texto não é um número inteiro: `Number.isInteger("2")` é falso. Sem essa verificação, a resposta é 404, porque `"2" === 2` também é falso. Converte primeiro, e só depois verifica e compara.

### O campo chega vazio, ou não chega

O nome do campo no formulário (o atributo `name`) não é o nome que a rota lê em `req.body`. `name="equipamento"` no formulário e `req.body.equipamento_id` na rota não se encontram. Confirma no Payload o nome que o browser enviou.

### O filtro devolve tudo

O nome do parâmetro de pesquisa no endereço não é o que a rota lê: `?Sala=B12` com maiúscula, ou `?sala =B12` com um espaço. `req.query.sala` fica `undefined` e a rota devolve a lista toda.

### POST a um endereço que só tem rota GET

Uma rota `app.get("/reservas", ...)` não responde a um `POST /reservas`, e vice-versa. O método faz parte da rota. Com o middleware final, a resposta é "Página não encontrada.".

## Segurança: o que este tema já pede

**O servidor verifica sempre.** Os atributos `required`, `type="number"` e `min` do formulário são ajudas para quem preenche, e o browser respeita-os. Mas um pedido pode chegar ao servidor sem passar pelo formulário, com os valores que quem o envia quiser. Cada regra verifica-se no servidor, mesmo que o formulário já a verifique.

**O texto do utilizador não se cola em HTML.** A resposta ao `POST /reservas` é JSON, e não uma página que escreva o dia que o utilizador enviou. Juntar texto escrito por alguém a um HTML, sem o tratar, permite a esse alguém meter HTML e JavaScript seus na página que outros vão ver. No próximo tema, o EJS trata disso por ti, e o tema dos erros e da segurança explica o ataque com mais pormenor.

**Nada de segredos no endereço.** Os parâmetros de pesquisa ficam no histórico e nos registos. Uma palavra-passe, ou qualquer dado pessoal sensível, nunca vai num `GET`.

## Verificar o que aprendeste

1. Para cada pedido, diz onde vêm os dados e como se leem no servidor: `/equipamentos/3`; `/equipamentos?sala=A03`; um formulário de reserva enviado por `POST`.
2. Porque é que todos os valores que chegam num pedido têm de ser tratados como texto?
3. Pesquisar equipamentos por sala: `GET` ou `POST`? Fazer uma reserva? Justifica.
4. Explica a diferença entre um 400 e um 404, com um exemplo de cada no catálogo.
5. Porque é que um filtro sem resultados responde 200?
6. O que é um middleware? O que faz o `next()`?
7. Por que ordem ficam, no ficheiro, o middleware de registo, o `express.urlencoded`, as rotas e o middleware final? Porquê?
8. Num `POST`, o terminal mostra `Cannot read properties of undefined (reading 'tempo')`. O que falta, ou está no sítio errado?
9. Onde vês, no browser, os campos que um formulário enviou?
10. Escreve a linha da tabela de contratos HTTP para `GET /reservas/:id`, uma rota que mostra uma reserva.

## O que vem a seguir

No tema 4, EJS e reutilização no servidor, as respostas deixam de ser JSON e texto escrito à mão: o servidor passa a gerar páginas HTML a partir de modelos, com os equipamentos numa lista, e um cabeçalho e um rodapé comuns a todas as páginas. É o que permite, finalmente, que o catálogo seja uma aplicação que se usa no browser, e não uma lista de dados.

Antes disso, faz o [laboratório](03-http-rotas-e-middleware-laboratorio.md), em que acrescentas tudo isto ao teu catálogo e provocas os erros de ordem do middleware, e a [ficha](03-http-rotas-e-middleware-exercicios.md), com o servidor da biblioteca.

![Rodapé](../imagens/rodape.png)
