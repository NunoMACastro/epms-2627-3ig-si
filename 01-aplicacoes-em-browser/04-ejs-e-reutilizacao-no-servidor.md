![Cabeçalho](../imagens/cabecalho.png)

# EJS e reutilização no servidor

Módulo Aplicações baseadas em browsers. Quarto tema do módulo, com quatro aulas de 60 minutos, que chegam para a teoria deste guia (cerca de uma hora, repartida pelas aulas), para o laboratório (cerca de 100 minutos) e para a ficha (cerca de 70 minutos). Este guia explica como o servidor constrói páginas HTML a partir de modelos, com os dados de cada pedido, como se partilha o cabeçalho e o rodapé entre todas as páginas, e porque é que um valor que vem de fora nunca pode entrar na página como HTML. Os passos para o fazeres no teu computador estão no [laboratório](04-ejs-e-reutilizacao-no-servidor-laboratorio.md), e os exercícios para fazeres sozinho estão na [ficha](04-ejs-e-reutilizacao-no-servidor-exercicios.md).

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. O problema do HTML dentro de textos com crases
4. Um modelo de página, preenchido no servidor
5. Preparar o Express para o EJS
6. As marcas do EJS
7. Ciclos e condições dentro do modelo
8. Partes partilhadas: o cabeçalho e o rodapé
9. Escaping: o que vem de fora nunca vira HTML
10. Exemplo guiado: o catálogo passa a ter páginas
11. O que o browser recebe
12. Erros frequentes
13. Segurança: o que este tema já pede
14. Verificar o que aprendeste
15. O que vem a seguir

## O que vais aprender

Até aqui, o catálogo de equipamentos respondia quase sempre com dados em JSON. Para quem usa o catálogo no browser, isso não é uma aplicação: é uma lista de chavetas e aspas. A única página a sério era a página inicial, com a pesquisa, e estava escrita dentro de um texto com crases, no meio do código JavaScript. Neste tema, o catálogo passa a responder com páginas: a lista dos equipamentos, a página de cada equipamento e as páginas de erro, todas com o mesmo cabeçalho e o mesmo rodapé, construídas no servidor a partir de ficheiros próprios, os modelos.

A ferramenta que faz isto chama-se EJS. O nome vem de Embedded JavaScript, JavaScript embutido: um ficheiro EJS é HTML normal, com umas marcas pelo meio onde entra JavaScript, para escrever um valor, repetir uma linha para cada equipamento ou mostrar uma mensagem só em certos casos.

No fim deste guia deves conseguir:

- explicar onde corre um modelo EJS e o que o browser recebe, e porque é que o browser nunca executa o modelo;
- preparar o Express para usar o EJS e responder com `res.render`, passando ao modelo os dados de que a página precisa;
- escrever um modelo com valores, ciclos e condições;
- tirar o HTML repetido para partials, o cabeçalho e o rodapé, e incluí-los em todas as páginas;
- escolher entre `<%=` e `<%-`, e explicar porque é que um valor que vem do pedido nunca vai num `<%-`;
- responder a um pedido errado com uma página de erro e com o código de estado certo;
- comparar o código de um modelo com o HTML que chega ao browser.

## O que já sabes e vais usar

Do tema anterior, o catálogo com middleware: a lista com o filtro por sala (`req.query.sala`), a rota de detalhe com o parâmetro de rota (`req.params.id`) e as duas verificações, o 400 e o 404, com o `res.status` e o `return`, a página inicial com a pesquisa por `GET`, o middleware de registo e o middleware final. O exemplo guiado deste tema parte desse servidor, e por isso convém que o tenhas a funcionar. Se não o tiveres, a pasta [catalogo-com-middleware](../exemplos/aplicacoes-em-browser/catalogo-com-middleware/README.md) dos exemplos tem-no pronto.

Do segundo tema: o `npm install` de um pacote e o que ele faz ao `package.json` e à pasta `node_modules`.

De HTML, dos anos anteriores: a estrutura de uma página (`<!doctype html>`, `<html>`, `<head>`, `<body>`), os títulos, os parágrafos, as listas com `<ul>` e `<li>`, as ligações com `<a href="...">` e os formulários com `<form>`, `<label>` e `<input>`.

De JavaScript: o `if` e o `else`, o `.length` de um array e o ciclo `for...of`, que percorre um array elemento a elemento. Se o `for...of` já te esqueceu, estas três linhas escrevem no terminal o nome de cada equipamento, um por linha: a cada volta, a variável `equipamento` fica com o elemento seguinte do array, até não haver mais.

```js fragment
for (const equipamento of equipamentos) {
  console.log(equipamento.nome);
}
```

## O problema do HTML dentro de textos com crases

No tema anterior, a página inicial do catálogo estava escrita assim, dentro da rota:

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
  </body>
</html>`);
});
```

Funciona, e para uma página pequena e fixa até chega. O guia desse tema avisava que era desconfortável de propósito. Quando o catálogo tiver várias páginas, e páginas com dados, este desconforto passa a ser um problema, por quatro razões.

A primeira é que o editor não te ajuda. Para o JavaScript, tudo o que está entre as crases é só um texto: não há cores no HTML, não há aviso de uma etiqueta mal fechada, e um erro no HTML só se descobre no browser.

A segunda é que uma crase dentro do HTML acaba o texto antes do tempo. Viste isto no laboratório do tema anterior, no problema "SyntaxError a apontar para uma linha do HTML": o JavaScript lê a crase como o fim do texto, e o resto do HTML passa a ser código sem sentido.

A terceira aparece quando a página tem dados. Para mostrar a lista dos equipamentos como uma lista HTML, era preciso construir o texto peça a peça, com um `map` que transforma cada equipamento num `<li>` e um `join` que os cola:

```js fragment
const itens = equipamentos.map((equipamento) => `<li>${equipamento.nome}, na sala ${equipamento.sala}</li>`).join("");
res.send(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Equipamentos</title></head><body><h1>Equipamentos</h1><ul>${itens}</ul></body></html>`);
```

Lê-se mal, escreve-se mal e corrige-se pior. E cada página nova repete o mesmo `<!doctype html>`, o mesmo `<head>` e, mais à frente, o mesmo menu de navegação e o mesmo rodapé. Uma mudança no rodapé obriga a procurá-lo em todas as rotas.

A quarta razão é a mais séria, e tem uma secção própria mais à frente. O `${equipamento.nome}` entra na página tal como está. Se um valor tiver etiquetas HTML, o browser interpreta-as como HTML. Num valor que vem do pedido, como a sala pesquisada, isso quer dizer que quem escreve o endereço pode meter HTML, e até JavaScript, na tua página.

A solução para as quatro é a mesma: separar o HTML do código. O HTML de cada página passa para um ficheiro seu, onde o editor o reconhece como HTML. A rota deixa de escrever HTML: escolhe os dados e o código de estado, e pede a página. E os valores entram na página por um caminho que trata das etiquetas sozinho.

## Um modelo de página, preenchido no servidor

Um **modelo** (em inglês, template) é um ficheiro de HTML com marcas nos sítios onde entram os dados. Pensa numa declaração da secretaria da escola: há uma minuta, com o texto fixo e espaços em branco para o nome, o número e o ano. Para cada pedido, a secretaria preenche os espaços e entrega a folha preenchida. Quem pede a declaração recebe a folha pronta, e nunca vê a minuta com os espaços em branco.

No servidor passa-se o mesmo. A cada pedido, a rota escolhe os dados e entrega-os, com o nome do modelo, ao EJS. O EJS preenche o modelo e devolve o HTML final, que o servidor envia ao browser. A esta operação chama-se **renderizar** o modelo: construir a página a partir do modelo e dos dados. Em Express faz-se com `res.render`.

Passo a passo, para o pedido da lista dos equipamentos da sala B12, e com o sítio onde cada passo acontece:

| Passo | Onde | O que acontece |
| --- | --- | --- |
| 1 | Browser | O utilizador pede `/equipamentos?sala=B12`, e o browser envia o pedido `GET` |
| 2 | Servidor | A rota lê `req.query.sala` e escolhe os equipamentos dessa sala |
| 3 | Servidor | A rota chama `res.render("equipamentos", { ... })`, com o nome do modelo e os dados |
| 4 | Servidor | O EJS lê o ficheiro `views/equipamentos.ejs`, corre as marcas com os dados e produz o HTML |
| 5 | Servidor | O Express envia o HTML, com o código 200 e o tipo `text/html` |
| 6 | Browser | O browser mostra a página, como mostraria um ficheiro HTML qualquer |

Repara em que sítio aparece o EJS: só no servidor, nos passos 3 e 4. O browser recebe HTML, e só HTML. Não recebe o ficheiro `.ejs`, não recebe as marcas, não recebe os dados soltos e não executa nenhum JavaScript do modelo: o JavaScript das marcas correu no servidor, antes de a resposta sair. Por isso se diz que estas páginas são construídas **do lado do servidor**. Para o browser, uma página feita com EJS é igual a uma página escrita à mão.

Isto tem uma consequência prática. O modelo pode usar os dados que a rota lhe passou, mas não sabe nada do que se passa no browser: não sabe em que botão o utilizador carregou, nem pode reagir a um clique sem um pedido novo. Cada vez que a página muda, é porque o browser fez um pedido e o servidor construiu uma página nova.

Em Linguagens de Programação, a mesma turma constrói aplicações de outra maneira: o servidor envia só os dados, em JSON, e é o React, a correr no browser, que constrói a página. As duas formas resolvem o mesmo problema, juntar dados e HTML, em sítios diferentes. Nesta disciplina, o servidor é que faz a página.

## Preparar o Express para o EJS

O EJS é um pacote do npm, como o Express. Instala-se dentro da pasta do projeto:

```text
npm install ejs
```

O `package.json` ganha uma linha `"ejs"` nas dependências, ao lado do `"express"`, e a pasta `node_modules` ganha a pasta do EJS. Não é preciso nenhum `import` do EJS no `server.js`: é o Express que o vai buscar quando for preciso, desde que lhe digas que é esse o motor de modelos que queres usar. Diz-se com uma linha, logo a seguir a criar a aplicação:

```js fragment
// O motor de modelos: o res.render vai procurar os ficheiros .ejs
// na pasta views.
app.set("view engine", "ejs");
```

O `app.set` muda uma definição da aplicação. A definição `"view engine"`, motor de vistas, diz ao Express que, quando uma rota pedir uma página pelo nome, a deve procurar num ficheiro com a extensão `.ejs` e passá-la ao EJS. Os modelos chamam-se também **vistas** (em inglês, views), e o Express procura-os numa pasta chamada `views`, ao lado do `server.js`:

```text
catalogo/
├── package.json
├── server.js
└── views/
    └── equipamentos.ejs
```

Para responder com uma página, a rota usa `res.render`, em vez do `res.json` ou do `res.send`:

```js fragment
res.render("equipamentos", { titulo: "Equipamentos", equipamentos: lista });
```

O primeiro argumento é o nome do modelo, sem a extensão e sem a pasta: `"equipamentos"` quer dizer `views/equipamentos.ejs`. O segundo é um objeto com os dados que a página vai usar. Cada propriedade deste objeto passa a ser uma variável dentro do modelo, com o mesmo nome: dentro de `equipamentos.ejs` há uma variável `titulo`, com o texto `"Equipamentos"`, e uma variável `equipamentos`, com o array. O modelo só conhece o que a rota lhe passar. Se usar um nome que não está neste objeto, dá erro.

O `res.render` é uma resposta, como o `res.json`: um pedido tem uma só resposta, e as regras do tema anterior continuam. Escolhe-se o código com `res.status` antes, como em `res.status(404).render(...)`, e depois de uma resposta de erro vem o `return`. O tipo da resposta passa a ser `text/html`, porque o que sai é uma página.

Uma última nota sobre a pasta. O Express procura a pasta `views` a partir da pasta onde o servidor arrancou. Arranca sempre o servidor dentro da pasta do projeto, com `node server.js` ou `node --watch server.js`: arrancado de outra pasta, não encontra os modelos.

## As marcas do EJS

Um ficheiro `.ejs` é HTML com marcas. Todas as marcas começam por `<%` e acabam em `%>`, e o carácter logo a seguir ao `<%` diz o que a marca faz. Neste tema usas quatro:

| Marca | O que faz | O que chega ao browser |
| --- | --- | --- |
| `<%= valor %>` | Escreve o valor na página, com escaping | O valor, como texto |
| `<% código %>` | Corre código JavaScript, sem escrever nada | Nada da marca; só o HTML que o código deixar passar |
| `<%# comentário %>` | Um comentário para quem lê o modelo | Nada |
| `<%- valor %>` | Escreve o valor sem escaping, tal como está | O valor, como HTML |

A marca que mais vais escrever é a `<%= %>`. Com os dados `{ titulo: "Equipamentos" }`, esta linha do modelo:

```ejs
<h1><%= titulo %></h1>
```

chega ao browser assim:

```html
<h1>Equipamentos</h1>
```

Entre `<%=` e `%>` pode estar qualquer expressão de JavaScript que dê um valor: uma variável, uma propriedade, como `equipamento.nome`, ou uma conta, como `equipamentos.length`. O que se escreve na página é o resultado.

A marca `<% %>`, sem nada a seguir ao `%`, corre código e não escreve nada. Serve para os ciclos e as condições, na secção seguinte. É também a fonte de um engano frequente: quem escreve `<% equipamento.nome %>` em vez de `<%= equipamento.nome %>` não recebe erro nenhum, e a página fica com um espaço vazio onde devia estar o nome. O código correu, calculou o nome e não o escreveu, porque não lhe pediram.

A marca `<%# %>` é um comentário. Ao contrário de um comentário de HTML (`<!-- ... -->`), que vai na página e qualquer pessoa pode ler no código-fonte, um comentário de EJS fica no servidor. É o sítio certo para explicar o modelo a quem o vai ler a seguir, como os comentários num ficheiro JavaScript.

A marca `<%- %>`, com um hífen, escreve o valor tal como está, sem escaping. Tem um uso certo neste tema, os partials, e um uso errado, que é perigoso. A secção do escaping explica a diferença.

Uma regra que poupa trabalho: nas marcas que escrevem um valor, o `<%=` e o `<%-`, o espaço entre a marca e o valor é opcional, mas torna o modelo mais fácil de ler. Escreve `<%= titulo %>`, com os dois espaços.

## Ciclos e condições dentro do modelo

Uma lista de equipamentos é a mesma linha de HTML repetida, uma vez para cada equipamento. Num modelo, escreve-se com um `for...of`, partido em duas marcas `<% %>`: uma abre o ciclo, com a chaveta de abertura, e a outra fecha-o, com a chaveta de fecho. O HTML que fica entre as duas marcas é repetido a cada volta:

```ejs
<ul>
  <% for (const equipamento of equipamentos) { %>
    <li><%= equipamento.nome %>, na sala <%= equipamento.sala %></li>
  <% } %>
</ul>
```

Com os quatro equipamentos do catálogo, o browser recebe:

```html
<ul>
    <li>Portátil, na sala B12</li>
    <li>Projetor, na sala A03</li>
    <li>Impressora, na sala Secretaria</li>
    <li>Monitor, na sala B12</li>
</ul>
```

Lê o modelo como se fosse JavaScript com bocados de HTML pelo meio. O `for` abre a chaveta na primeira marca; o `<li>` é o corpo do ciclo; a chaveta fecha na segunda marca. O EJS transforma o modelo inteiro num programa que vai juntando o HTML à página, e o corpo do ciclo é executado quatro vezes, uma por equipamento, com a variável `equipamento` a mudar a cada volta. A chaveta de fecho, `<% } %>`, é obrigatória e é a que mais se esquece. Sem ela, o EJS nem chega a construir a página, e o erro é estranho: fala de um `Unexpected token 'catch'`, como mostra a secção dos erros frequentes.

As condições escrevem-se da mesma maneira, com o `if` e o `else` partidos em marcas:

```ejs
<% if (equipamentos.length === 0) { %>
  <p>Não há equipamentos nesta sala.</p>
<% } else { %>
  <ul>
    ...
  </ul>
<% } %>
```

Só um dos dois blocos de HTML chega ao browser: o parágrafo, se a lista estiver vazia, ou a lista, se tiver equipamentos. O outro nem aparece no código-fonte da página. Lembra-te do tema anterior: uma pesquisa por uma sala sem equipamentos não é um erro, é uma lista vazia, com o código 200. Mas uma lista vazia, numa página, é um `<ul>` sem nada dentro, que o utilizador vê como um espaço em branco. A condição transforma esse espaço numa frase que diz o que se passou.

Há uma divisão de trabalho a respeitar entre a rota e o modelo. A rota decide **que dados** a página mostra: é na rota que se lê a sala do pedido e se filtram os equipamentos. O modelo decide **como** os mostra: em lista, com que texto, com que mensagem quando não há nada. Um modelo que filtra, procura ou verifica dados está a fazer o trabalho da rota, fica difícil de ler e mistura duas coisas que mudam por razões diferentes. O `if` do exemplo não decide nada sobre os dados: só escolhe entre duas formas de mostrar o que já lá está.

## Partes partilhadas: o cabeçalho e o rodapé

Quando o catálogo tiver uma página inicial, uma lista, uma página para cada equipamento e uma página de erro, as quatro começam da mesma maneira, com o `<!doctype html>`, o `<head>`, o título e o menu de navegação, e acabam da mesma maneira, com o rodapé e o fecho das etiquetas. Repetir esse HTML em quatro ficheiros é o problema das crases outra vez: mudar o menu obrigava a mudá-lo em quatro sítios, e basta esquecer um para as páginas deixarem de ser iguais.

A solução é pôr esse HTML num ficheiro à parte e incluí-lo em todas as páginas. Um bocado de modelo que vive num ficheiro próprio, para ser incluído por outros modelos, chama-se **partial**, uma parte. No catálogo há dois, numa pasta `views/partials`, para não se misturarem com as páginas:

```text
views/
├── equipamentos.ejs
├── equipamento.ejs
├── erro.ejs
├── inicio.ejs
└── partials/
    ├── cabecalho.ejs
    └── rodape.ejs
```

O cabeçalho tem tudo o que vem antes do conteúdo da página: o início do documento, o `<head>`, o menu e o título visível. Abre o `<html>` e o `<body>`, e deixa-os abertos:

```ejs
<%# O início de todas as páginas do catálogo. Usa o titulo da página
    que o inclui. %>
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title><%= titulo %> | Catálogo de equipamentos</title>
  </head>
  <body>
    <nav>
      <a href="/">Início</a> |
      <a href="/equipamentos">Todos os equipamentos</a>
    </nav>
    <h1><%= titulo %></h1>
```

O rodapé tem o que vem depois, e fecha as etiquetas que o cabeçalho deixou abertas:

```ejs
<%# O fim de todas as páginas do catálogo. %>
    <footer>
      <p>Catálogo de equipamentos da escola. Página gerada no servidor.</p>
    </footer>
  </body>
</html>
```

Cada página inclui os dois, com a função `include` do EJS, e entre eles fica só o que é dela:

```ejs
<%- include("partials/cabecalho") %>
    <p>O conteúdo desta página.</p>
<%- include("partials/rodape") %>
```

O caminho do `include` é relativo ao ficheiro que inclui. As páginas estão em `views`, por isso o cabeçalho é `"partials/cabecalho"`, sem a extensão. E o partial vê os mesmos dados da página que o inclui: é por isso que o cabeçalho pode escrever `<%= titulo %>`. Cada rota passa um `titulo` diferente no `res.render`, e o mesmo cabeçalho escreve, em cada página, o título dessa página.

Repara na marca do `include`: é `<%-`, com hífen, e não `<%=`. O `include` devolve o HTML do partial, e esse HTML tem de chegar ao browser como HTML. Com `<%=`, o EJS faria escaping a esse HTML, e o browser mostraria as etiquetas como texto, com `<title>` e `<nav>` escritos no meio da página. É o único uso do `<%-` neste tema, e é seguro porque o HTML dos partials foi escrito por ti, e não veio de fora.

O cabeçalho abre etiquetas que só o rodapé fecha. Isto obriga a uma disciplina: todas as páginas incluem os dois, sempre pela mesma ordem, e nenhuma fecha o `<body>` ou o `<html>` por conta própria. Em troca, uma mudança no menu, no `<head>` ou no rodapé faz-se uma vez, e aparece em todas as páginas ao mesmo tempo.

## Escaping: o que vem de fora nunca vira HTML

A página da lista mostra a sala pesquisada: "Pesquisa pela sala B12". A sala vem do pedido, do `?sala=`, e quem escreve o endereço pode escrever lá o que quiser. Imagina este pedido:

```text
/equipamentos?sala=<i>B12</i>
```

(O browser mostra os `<` e `>` na barra de endereço com códigos, `%3C` e `%3E`, porque não podem ir num endereço tal como estão; o Express desfaz esses códigos, e o `req.query.sala` fica com o texto `<i>B12</i>`.)

Com `<%= sala %>`, a página mostra exatamente o que o utilizador escreveu, com as etiquetas à vista: "Pesquisa pela sala `<i>B12</i>`". O EJS trocou os carateres que têm significado em HTML por códigos que o browser mostra como texto, e não interpreta. É isto o **escaping**:

| Carácter | Escrito como |
| --- | --- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&#34;` |
| `'` | `&#39;` |

O browser recebe `&lt;i&gt;B12&lt;/i&gt;`, desenha `<i>B12</i>` no ecrã, e não há itálico nenhum: para ele, aquilo é texto. O texto aparece a negrito, mas isso vem do `<strong>` que o modelo põe à volta de qualquer sala pesquisada, e não do que o utilizador escreveu.

Com `<%- sala %>`, o EJS escreve o valor tal como está. O browser recebe `<i>B12</i>`, interpreta as etiquetas e mostra B12 em itálico, sem as etiquetas. Parece inofensivo, mas o problema não é o itálico. Quem consegue meter um `<i>` na tua página consegue meter um `<script>`, e o browser executa-o como se fosse parte da página. Basta enviar a alguém um endereço com um script na sala, e quem o abrir corre esse script no teu site: pode ver o que está na página, mudar o que lá está, ou enviar dados para outro lado. A este ataque chama-se injeção de código na página, ou XSS (de cross-site scripting).

A regra que sai daqui é simples. Todos os valores entram na página com `<%=`: os que vêm do pedido, porque qualquer pessoa os pode escrever, e os outros também, porque amanhã podem vir de um formulário ou de uma base de dados onde alguém escreveu um `<`. O `<%-` fica só para o `include` dos partials, cujo HTML foi escrito por ti. Se um dia precisares de pôr numa página HTML que vem de outro sítio, a resposta certa não é o `<%-`: é perguntar porque é que esse HTML não está num modelo.

O escaping do `<%=` protege os dois sítios onde os valores deste tema aparecem: o conteúdo de uma etiqueta, como `<p><%= mensagem %></p>`, e o valor de um atributo entre aspas, como `href="/equipamentos/<%= equipamento.id %>"`. Os atributos escrevem-se sempre entre aspas, para o valor não poder sair delas. E há um sítio onde o `<%=` não chega para proteger: dentro de uma etiqueta `<script>`. Neste tema não precisas de pôr valores dentro de scripts, e não deves. O tema Erros e segurança web volta a este assunto.

## Exemplo guiado: o catálogo passa a ter páginas

O exemplo parte do catálogo com middleware do tema anterior e transforma-o, passo a passo, num catálogo com páginas: primeiro uma página só, depois a pesquisa, depois a página de cada equipamento, depois o cabeçalho e o rodapé partilhados, e no fim as páginas de erro. Em cada passo, o servidor continua a funcionar, e podes abrir as páginas no browser. O resultado final está pronto a correr na pasta [catalogo-com-ejs](../exemplos/aplicacoes-em-browser/catalogo-com-ejs/README.md) dos exemplos.

### Passo 1: instalar e preparar

Na pasta do catálogo, `npm install ejs`. No `server.js`, logo a seguir ao `const PORTA = 3000;`, a linha do motor de modelos:

```js fragment
// O motor de modelos: o res.render vai procurar os ficheiros .ejs
// na pasta views.
app.set("view engine", "ejs");
```

E, ao lado do `server.js`, a pasta `views`, por agora vazia. Nada muda nas respostas: o EJS só trabalha quando uma rota chamar o `res.render`.

### Passo 2: a primeira página, a lista

A rota da lista respondia com `res.json`, e tinha duas respostas, uma com o filtro e outra sem ele. Uma página não muda com o filtro: muda só a lista que ela mostra. Por isso a rota passa a escolher primeiro a lista, numa variável, e a responder uma só vez, no fim:

```js fragment
// Lista de equipamentos. Com ?sala=B12, só os dessa sala.
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  let lista = equipamentos;
  if (sala) {
    lista = equipamentos.filter((equipamento) => equipamento.sala === sala);
  }
  res.render("equipamentos", { titulo: "Equipamentos", equipamentos: lista });
});
```

A `lista` começa com todos os equipamentos, e só muda se o pedido trouxer uma sala. É declarada com `let`, e não com `const`, porque o `if` lhe pode dar outro valor. No fim, o `res.render` pede o modelo `equipamentos` com dois dados: o título da página e a lista a mostrar. Dentro do modelo, a lista vai chamar-se `equipamentos`, porque é esse o nome da propriedade.

O modelo, em `views/equipamentos.ejs`, é por agora uma página completa:

```ejs
<%# A lista de equipamentos. Recebe o titulo e os equipamentos a mostrar. %>
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title><%= titulo %> | Catálogo de equipamentos</title>
  </head>
  <body>
    <h1><%= titulo %></h1>
    <ul>
      <% for (const equipamento of equipamentos) { %>
        <li><%= equipamento.nome %>, na sala <%= equipamento.sala %></li>
      <% } %>
    </ul>
  </body>
</html>
```

`/equipamentos` mostra agora uma página com o título "Equipamentos" e uma lista com os quatro equipamentos, e `/equipamentos?sala=B12` a mesma página só com o portátil e o monitor. A pesquisa da página inicial continua a funcionar, e agora leva a uma página, e não a JSON.

Experimenta `/equipamentos?sala=Z99`. A página aparece com o título e sem mais nada: a lista está vazia, e um `<ul>` vazio não se vê. O passo seguinte resolve isso.

### Passo 3: a pesquisa e a lista vazia

A página passa a dizer que sala foi pesquisada, quando houve pesquisa, e a explicar a lista vazia, quando não há equipamentos. Para isso, o modelo precisa de saber a sala. Na rota, o `res.render` passa-a também:

```js fragment
res.render("equipamentos", { titulo: "Equipamentos", equipamentos: lista, sala: sala });
```

Quando não há pesquisa, `req.query.sala` é `undefined`, e é isso que o modelo recebe na variável `sala`. Não faz mal: o importante é que a propriedade `sala` exista no objeto, mesmo vazia. Se a rota não a passasse de todo, o modelo, ao usar `sala`, daria o erro `sala is not defined`.

No modelo, o `<ul>` dá lugar a duas condições:

```ejs
<% if (sala) { %>
  <p>Pesquisa pela sala <strong><%= sala %></strong>.</p>
<% } %>
<% if (equipamentos.length === 0) { %>
  <p>Não há equipamentos nesta sala.</p>
<% } else { %>
  <ul>
    <% for (const equipamento of equipamentos) { %>
      <li><%= equipamento.nome %>, na sala <%= equipamento.sala %></li>
    <% } %>
  </ul>
<% } %>
```

A primeira condição mostra a sala pesquisada, só quando há uma. A segunda escolhe entre a mensagem e a lista. `/equipamentos?sala=Z99` mostra agora "Pesquisa pela sala Z99." e "Não há equipamentos nesta sala.", com o código 200. A sala pesquisada vem do pedido e entra com `<%=`: a secção do escaping explica porquê, e o laboratório mostra o que acontece se não entrar.

### Passo 4: a página de um equipamento

A rota de detalhe mantém as duas verificações do tema anterior. Só muda a última linha, a resposta de sucesso, que passa a ser uma página:

```js fragment
res.render("equipamento", { titulo: equipamento.nome, equipamento: equipamento });
```

O título da página é o nome do equipamento. O modelo, em `views/equipamento.ejs`, também é por agora uma página completa:

```ejs
<%# A página de um equipamento. Recebe o titulo e o equipamento. %>
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title><%= titulo %> | Catálogo de equipamentos</title>
  </head>
  <body>
    <h1><%= titulo %></h1>
    <p>Número: <%= equipamento.id %></p>
    <p>Sala: <a href="/equipamentos?sala=<%= equipamento.sala %>"><%= equipamento.sala %></a></p>
    <p><a href="/equipamentos">Voltar à lista</a></p>
  </body>
</html>
```

A sala é uma ligação para a pesquisa dessa sala: o valor entra duas vezes, no `href` e no texto da ligação, e as duas com `<%=`. Para se chegar a esta página sem escrever o endereço, a lista passa a ter ligações. No modelo da lista, o `<li>` fica assim:

```ejs
<li><a href="/equipamentos/<%= equipamento.id %>"><%= equipamento.nome %></a>, na sala <%= equipamento.sala %></li>
```

`/equipamentos/3` mostra a impressora, com a ligação para a sala Secretaria. Os erros desta rota (`/equipamentos/abc` e `/equipamentos/9`) continuam, por agora, a responder com JSON. O passo 6 trata disso.

### Passo 5: o cabeçalho e o rodapé em partials

As duas páginas que já existem repetem o mesmo início e o mesmo fim, e a página inicial ainda está num texto com crases. É altura de criar os dois partials da secção "Partes partilhadas", em `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs`, e de os usar.

Em `equipamentos.ejs`, tudo o que vinha antes das condições passa a ser o `include` do cabeçalho, e tudo o que vinha depois passa a ser o `include` do rodapé. O `<h1>` sai da página, porque o cabeçalho já o escreve com o título. O mesmo em `equipamento.ejs`. As páginas ficam só com o que é delas, e ganham, sem mais trabalho, o menu de navegação do cabeçalho e o rodapé.

A página inicial passa a ser um modelo, `views/inicio.ejs`:

```ejs
<%# A página inicial, com a pesquisa por sala. O formulário envia por GET,
    e o campo sala vai no endereço: /equipamentos?sala=B12. %>
<%- include("partials/cabecalho") %>
    <p>Pesquisa os equipamentos de uma sala.</p>
    <form method="get" action="/equipamentos">
      <label>Sala <input name="sala"></label>
      <button type="submit">Pesquisar</button>
    </form>
<%- include("partials/rodape") %>
```

E a rota `/` deixa de ter HTML:

```js fragment
// Página inicial, com a pesquisa por sala.
app.get("/", (req, res) => {
  res.render("inicio", { titulo: "Início" });
});
```

Como o cabeçalho usa o `titulo`, todas as rotas que renderizam uma página têm de o passar. Esquecê-lo dá `titulo is not defined`, numa página de erro com o código 500.

### Passo 6: as páginas de erro

A rota de detalhe responde 400 e 404 com JSON, e o middleware final responde com um texto solto. Num catálogo feito de páginas, um erro também deve ser uma página, com o mesmo cabeçalho, uma mensagem e uma ligação para voltar. Uma só página serve para todos os erros, `views/erro.ejs`, porque o que muda de erro para erro é só o título e a mensagem:

```ejs
<%# A página de erro, para o 400 e para o 404. Recebe o titulo e a
    mensagem; o código de estado é a rota que o escolhe. %>
<%- include("partials/cabecalho") %>
    <p><%= mensagem %></p>
    <p><a href="/">Voltar ao início</a></p>
<%- include("partials/rodape") %>
```

O código de estado não aparece no modelo, e é de propósito: quem escolhe o código é a rota, com `res.status`, como no tema anterior. O modelo só escreve a página. Na rota de detalhe, as duas respostas de erro ficam assim:

```js fragment
res.status(400).render("erro", {
  titulo: "Pedido inválido",
  mensagem: "O identificador tem de ser um número inteiro positivo.",
});
```

```js fragment
res.status(404).render("erro", {
  titulo: "Equipamento não encontrado",
  mensagem: `Não existe o equipamento ${id}.`,
});
```

O objeto dos dados ficou comprido, e por isso está escrito em várias linhas, uma por propriedade: é o mesmo objeto, só arrumado para se ler melhor. Cada uma das respostas continua seguida do seu `return`. O middleware final usa a mesma página:

```js fragment
// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).render("erro", {
    titulo: "Página não encontrada",
    mensagem: "Este endereço não existe no catálogo.",
  });
});
```

A mensagem do middleware final não repete o endereço pedido. Podia, mas o endereço vem de fora, e não traz nada que o utilizador não saiba já.

### Passo 7: o servidor completo

O `server.js` no fim do exemplo:

```js
// server.js: o catálogo de equipamentos da escola, agora com páginas EJS.
// As rotas escolhem os dados e o código de estado; as páginas são construídas
// a partir dos modelos da pasta views, que partilham o cabeçalho e o rodapé
// da pasta views/partials. O browser recebe só o HTML que daí resulta.
import express from "express";

const app = express();
const PORTA = 3000;

// O motor de modelos: o res.render vai procurar os ficheiros .ejs
// na pasta views.
app.set("view engine", "ejs");

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

// Página inicial, com a pesquisa por sala.
app.get("/", (req, res) => {
  res.render("inicio", { titulo: "Início" });
});

// Lista de equipamentos. Com ?sala=B12, só os dessa sala.
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  let lista = equipamentos;
  if (sala) {
    lista = equipamentos.filter((equipamento) => equipamento.sala === sala);
  }
  res.render("equipamentos", { titulo: "Equipamentos", equipamentos: lista, sala: sala });
});

// Um equipamento: GET /equipamentos/2. O :id é um parâmetro de rota.
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O identificador tem de ser um número inteiro positivo.",
    });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === id);
  if (!equipamento) {
    res.status(404).render("erro", {
      titulo: "Equipamento não encontrado",
      mensagem: `Não existe o equipamento ${id}.`,
    });
    return;
  }
  res.render("equipamento", { titulo: equipamento.nome, equipamento: equipamento });
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).render("erro", {
    titulo: "Página não encontrada",
    mensagem: "Este endereço não existe no catálogo.",
  });
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
```

As rotas já não têm HTML nenhum. Cada uma faz o que fazia no tema anterior (lê o pedido, verifica, procura, escolhe o código) e acaba a pedir uma página com os dados certos. O HTML está todo nos modelos. A lista, no fim:

```ejs
<%# A lista de equipamentos. Recebe o titulo, os equipamentos a mostrar
    e a sala pesquisada, que fica vazia quando não houve pesquisa. %>
<%- include("partials/cabecalho") %>
    <% if (sala) { %>
      <p>Pesquisa pela sala <strong><%= sala %></strong>.</p>
    <% } %>
    <% if (equipamentos.length === 0) { %>
      <p>Não há equipamentos nesta sala.</p>
    <% } else { %>
      <ul>
        <% for (const equipamento of equipamentos) { %>
          <li><a href="/equipamentos/<%= equipamento.id %>"><%= equipamento.nome %></a>, na sala <%= equipamento.sala %></li>
        <% } %>
      </ul>
    <% } %>
<%- include("partials/rodape") %>
```

E a página de um equipamento:

```ejs
<%# A página de um equipamento. Recebe o titulo e o equipamento. %>
<%- include("partials/cabecalho") %>
    <p>Número: <%= equipamento.id %></p>
    <p>Sala: <a href="/equipamentos?sala=<%= equipamento.sala %>"><%= equipamento.sala %></a></p>
    <p><a href="/equipamentos">Voltar à lista</a></p>
<%- include("partials/rodape") %>
```

A página inicial, a de erro e os dois partials são os dos passos 5 e 6.

### Passo 8: os resultados

| Pedido | Código | O que a página mostra |
| --- | --- | --- |
| `/` | 200 | "Início", com a pesquisa por sala |
| `/equipamentos` | 200 | "Equipamentos", com os quatro, cada um com ligação para a sua página |
| `/equipamentos?sala=B12` | 200 | "Pesquisa pela sala B12.", com o portátil e o monitor |
| `/equipamentos?sala=Z99` | 200 | "Pesquisa pela sala Z99." e "Não há equipamentos nesta sala." |
| `/equipamentos/2` | 200 | "Projetor", com o número 2 e a ligação para a sala A03 |
| `/equipamentos/abc` | 400 | "Pedido inválido", com a mensagem do identificador |
| `/equipamentos/0` | 400 | "Pedido inválido", com a mesma mensagem |
| `/equipamentos/9` | 404 | "Equipamento não encontrado", com "Não existe o equipamento 9." |
| `/nao-existe` | 404 | "Página não encontrada" |

Todas as páginas têm o menu no topo e o rodapé no fim, e todas chegam com o tipo `text/html`. Os códigos são os do tema anterior: mudou a forma da resposta, e não a decisão de qual é o código.

## O que o browser recebe

A planificação deste tema pede uma coisa concreta: comparar o código de um modelo com o HTML que chega de facto ao browser. Há duas formas de ver o que chegou.

A primeira é o código-fonte da página. Com a página aberta, carrega em Ctrl+U (no Mac, Cmd+Option+U), ou procura, no menu que abre com o botão direito do rato, a opção de ver o código-fonte da página. O browser mostra o HTML exatamente como o recebeu. Abre o código-fonte de `/equipamentos?sala=B12` e compara-o com `views/equipamentos.ejs`:

- não há nenhuma marca `<%`: todas foram substituídas pelo que produziram;
- não há `for` nem `if`: em vez do ciclo, há dois `<li>`, um para o portátil e outro para o monitor, escritos um a um;
- a mensagem "Não há equipamentos nesta sala." não aparece em lado nenhum, porque o `else` foi o ramo que correu;
- o comentário do início do modelo não está lá;
- onde estavam as marcas que não escrevem nada, ficaram linhas em branco ou espaços: o EJS tirou as marcas e deixou o resto da linha;
- o `<head>`, o menu e o rodapé estão lá, embora o modelo da lista não os tenha: vieram dos partials.

A segunda é o separador Rede das ferramentas de programador, que já conheces. Clica no pedido `equipamentos?sala=B12` e confirma o código, 200, e, nos cabeçalhos da resposta, o `Content-Type: text/html; charset=utf-8`. No separador da resposta ("Response", ou "Resposta") está o mesmo HTML do código-fonte. Faz o mesmo com um pedido do tema anterior, que respondia em JSON, e a diferença está nesse cabeçalho: `application/json` lá, `text/html` aqui. É o cabeçalho que diz ao browser se deve mostrar o que recebeu como dados ou desenhá-lo como página.

Quando o professor te perguntar porque é que o browser não executa o modelo, é isto que respondes: o modelo nunca lá chega. Correu no servidor, e o browser recebeu o resultado.

## Erros frequentes

### Error: No default engine was specified and no extension was provided.

Uma rota chamou o `res.render`, e o Express não sabe que motor usar: falta a linha `app.set("view engine", "ejs");`. A página de erro aparece com o código 500, e o servidor continua ligado.

### Error: Cannot find module 'ejs'

O `app.set` está lá, mas o pacote não foi instalado nesta pasta. Corre `npm install ejs` dentro da pasta do projeto e confirma a linha no `package.json`. O servidor arranca sem erro, porque o Express só vai buscar o EJS quando a primeira página for pedida.

### Error: Failed to lookup view "equipamentoo" in views directory

O Express não encontrou o ficheiro do modelo. A mensagem diz o nome que procurou e a pasta onde procurou, e uma das duas está errada: o nome no `res.render` não é o do ficheiro (aqui, um `o` a mais), o ficheiro não está dentro de `views`, ou o servidor arrancou fora da pasta do projeto, e a pasta `views` que ele procura não é a tua.

### ReferenceError: ... sala is not defined

O modelo usa uma variável que a rota não lhe passou. A mensagem mostra o caminho do modelo, o número da linha e as linhas à volta, com `>>` na linha do problema. Acrescenta a propriedade ao objeto do `res.render`, com o nome que o modelo usa, mesmo que o valor possa ser `undefined`. Se o modelo é um partial, como o cabeçalho com o `titulo`, todas as páginas que o incluem têm de passar esse dado.

### Onde devia estar um valor, não aparece nada

Duas causas, e nenhuma dá erro. Escreveste `<% valor %>` em vez de `<%= valor %>`: o código correu e não escreveu nada. Ou escreveste mal o nome de uma propriedade, como `equipamento.nomee`: o JavaScript dá `undefined` para uma propriedade que não existe, e o EJS escreve `undefined` como vazio. Compara o nome no modelo com o nome no array, letra a letra.

### SyntaxError: Unexpected token 'catch' ... while compiling ejs

O EJS não conseguiu transformar o modelo num programa, porque o JavaScript das marcas está incompleto. Quase sempre é uma chaveta: um `<% for (...) { %>` ou um `<% if (...) { %>` sem o `<% } %>` correspondente, ou ao contrário. A palavra `catch` não está no teu modelo: é do código que o EJS junta à volta dele, e a falta da chaveta só se nota lá. Conta as chavetas que abrem e as que fecham.

### A página de erro certa, com o código errado, e o servidor em baixo

Pedes `/equipamentos/abc`, a página diz "Pedido inválido", e o separador Rede mostra o código 404, em vez de 400. No terminal aparece `Cannot set headers after they are sent to the client`, e a seguir o servidor pára: o pedido seguinte, seja a que página for, já não tem resposta. Com o `node --watch`, o terminal acaba em `Failed running 'server.js'. Waiting for file changes before restarting...`, e o servidor só volta quando guardares um ficheiro.

Falta o `return` depois do `res.status(400).render(...)`. Com o `res.json`, do tema anterior, o browser recebia a primeira resposta e o código certo, e o servidor continuava ligado. Com o `res.render`, a página só sai um instante depois, quando o EJS acaba de ler o modelo, e nesse instante o código da rota continua: não encontra o equipamento, chega ao `res.status(404)` e troca o código antes de a primeira página sair. Quando a segunda página fica pronta, a resposta já foi enviada, e o erro que isso provoca acontece fora da rota, onde ninguém o apanha: por isso o servidor vai abaixo. Depois de cada resposta de erro, o `return`, como sempre.

### As etiquetas do cabeçalho aparecem como texto na página

O `include` foi escrito com `<%=` em vez de `<%-`. O EJS fez escaping ao HTML do partial, e o browser mostra `<title>`, `<nav>` e o resto como texto. O `include` usa sempre `<%-`.

### Mudei o modelo e não sei se tenho de reiniciar o servidor

Não tens. O Express volta a ler o modelo a cada pedido, enquanto estás a desenvolver, e basta recarregar a página. O `node --watch` também não reinicia por causa de um `.ejs`, só por causa dos ficheiros JavaScript. Mudanças no `server.js` continuam a precisar de reinício, como antes.

## Segurança: o que este tema já pede

- **Todos os valores com `<%=`.** O escaping é a defesa contra o HTML e o JavaScript metidos na página por quem escreve o pedido. O `<%-` fica só para o `include` dos partials, cujo HTML é teu.
- **Atributos sempre entre aspas.** O escaping do `<%=` conta com as aspas: `href="/equipamentos/<%= equipamento.id %>"`, e nunca sem elas.
- **Nenhum valor dentro de `<script>`.** O escaping de HTML não protege o JavaScript de uma página. Neste tema não precisas, e no tema Erros e segurança web vês porquê.
- **A página não substitui a verificação.** Um formulário ou uma ligação na página não impedem ninguém de escrever o endereço à mão. As verificações do 400 e do 404 continuam na rota, como no tema anterior.
- **Um erro mostra pouco.** As páginas de erro do catálogo dizem o que correu mal com uma frase, e não mais. A página de erro do próprio Express, a dos erros acima com o código 500, mostra o caminho dos ficheiros no teu computador e as linhas do código: ajuda enquanto programas, mas um servidor a sério não a pode mostrar a quem o usa. É outro assunto do tema Erros e segurança web.

## Verificar o que aprendeste

1. O utilizador abre `/equipamentos?sala=A03`. Diz, por ordem, o que acontece no browser e o que acontece no servidor, até a página aparecer.
2. Porque é que o browser não executa o modelo `equipamentos.ejs`?
3. Qual é a diferença entre `<% equipamento.nome %>` e `<%= equipamento.nome %>`? Qual delas dá erro?
4. Uma rota faz `res.render("erro", { mensagem: "Sem stock" })`, e o modelo inclui o cabeçalho, que usa o `titulo`. O que acontece?
5. Porque é que o `include` se escreve com `<%-`, e a sala pesquisada com `<%=`? O que acontecia se trocasses os dois?
6. A página da lista mostra a mensagem "Não há equipamentos nesta sala." quando a lista está vazia. Porque é que o código continua a ser 200, e não 404?
7. Onde se filtram os equipamentos pela sala: na rota ou no modelo? Porquê?
8. Abres o código-fonte de uma página do catálogo. Diz três coisas do modelo que não encontras lá, e uma que encontras e não está no modelo da página.

## O que vem a seguir

O próximo tema é Formulários e validação. A página inicial já tem um formulário, mas envia por `GET` e só pesquisa. No próximo tema, os formulários enviam por `POST`, para criar coisas, como uma reserva; o servidor lê o corpo do pedido, verifica cada campo e, se alguma coisa estiver errada, volta a mostrar o formulário com os dados que o utilizador já tinha escrito e uma mensagem a explicar o erro. Esse formulário é um modelo EJS, com tudo o que este tema mostrou: valores com `<%=`, condições para as mensagens de erro, e o cabeçalho e o rodapé partilhados.

![Rodapé](../imagens/rodape.png)
