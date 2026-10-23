![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: EJS e reutilização no servidor

Laboratório do quarto tema do módulo Aplicações baseadas em browsers. Partes do teu catálogo com middleware do tema anterior e transformas as respostas em páginas. Começas pela lista e pela pesquisa com a lista vazia. Acrescentas o detalhe de cada equipamento, o cabeçalho e o rodapé partilhados, e as páginas de erro. Pelo caminho, provocas de propósito os erros que mais vais encontrar com o EJS, vês o escaping a funcionar e a falhar. No fim comparas os teus modelos com o HTML que o browser recebe de facto.

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui. O [guia](04-ejs-e-reutilizacao-no-servidor.md) tem a teoria completa, para saberes mais. Antes de cada experiência, escreve a previsão no caderno e confere-a com a resposta desta fase.

## O que vais construir

Vais continuar o catálogo numa pasta de trabalho própria. O destino é o exemplo completo deste tema, com as experiências descritas nas fases.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | O EJS executa as marcas no servidor | Conferes a paragem 1 antes de continuar |
| 2 | Uma rota escolhe os dados e pede um modelo com `res.render` | Conferes a paragem 2 antes de continuar |
| 3 | Uma lista sem resultados continua a ser uma resposta válida | Conferes a paragem 3 antes de continuar |
| 4 | O identificador escolhe o equipamento no servidor | Conferes a paragem 4 antes de continuar |
| 5 | Um partial é uma parte reutilizada por várias páginas | Conferes a paragem 5 antes de continuar |
| 6 | O código HTTP e a mensagem têm papéis diferentes | Conferes a paragem 6 antes de continuar |
| 7 | O escaping transforma carateres de HTML em texto | Conferes a paragem 7 antes de continuar |
| 8 | Comparar a vista com a resposta permite localizar onde o EJS correu | Conferes a paragem 8 antes de continuar |

## Palavras que vais usar

- Modelo EJS: ficheiro HTML com marcas onde o servidor coloca os dados.
- Renderizar: juntar um modelo aos dados para construir o HTML da resposta.
- Vista: outro nome para um modelo de página, guardado em `views`.
- Marca EJS: delimitação como `<%= nome %>`, que o EJS lê no servidor.
- Partial: parte de um modelo, como o cabeçalho, incluída por outras páginas.
- Escaping: troca dos carateres especiais de HTML por códigos para que um valor apareça como texto.
- Código-fonte da página: HTML recebido pelo browser, depois de o servidor preencher o modelo.

## O que precisas

- Node 24 LTS: executa JavaScript no servidor, no computador ou num contentor Docker preparado pelo professor. No terminal desse ambiente, corre `node --version`; deve aparecer `v24` seguido da versão instalada.
- npm: instala os pacotes do projeto. Confirma com `npm --version`, que mostra a versão instalada.
- Um editor para criares e guardares os ficheiros. No VS Code, abre a pasta de trabalho com "Ficheiro > Abrir Pasta".
- Um browser com ferramentas de programador. Abre-as com F12 ou com o menu de ferramentas do browser.
- Uma pasta nova para a tua cópia do exemplo de partida indicado abaixo. Não trabalhes dentro da pasta distribuída.

Os comandos `node` e `npm` deste laboratório executam-se no ambiente indicado pelo professor. Se usares Docker, usa o terminal do contentor preparado, aberto na pasta do projeto.

## Se alguma coisa falhar

1. Confirma a pasta no terminal: `pwd` no macOS/Linux ou `Get-Location` na PowerShell. Nela devem existir `package.json` e `server.js`. Usa `cd` e o caminho da tua cópia para lá entrar.
2. Confirma que guardaste o ficheiro e que o browser mostra o endereço do teu servidor.
3. Lê a primeira mensagem do terminal antes de mudares código. Compara o resultado esperado, o obtido e uma hipótese para a causa.
4. Se a porta 3000 estiver ocupada, não pares outro processo. Na tua cópia, muda `PORTA` para 3100 e usa essa porta em todos os endereços deste laboratório.

## Preparar o projeto

Precisas do catálogo com middleware do laboratório do tema anterior, a funcionar. Se não o tiveres, copia a pasta [catalogo-com-middleware](../exemplos/aplicacoes-em-browser/catalogo-com-middleware/README.md) dos exemplos para a tua pasta de trabalho e corre `npm install` dentro dela. Se fizeste o laboratório da API da papelaria, em vez do do catálogo, faz esta cópia: a pasta da papelaria fica para Linguagens de Programação.

Precisas também de internet para o `npm install ejs@7.0.1` da fase 2. Para trabalhares sem rede, o professor precisa de preparar e testar previamente as dependências nos computadores da escola, incluindo Express e EJS 7.0.1. A cópia de apoio tem de ser compatível com esses postos. Uma pasta trazida de casa, por si só, não confirma essa compatibilidade.

Se a rede falhar, usa a preparação fornecida pelo professor. Não repitas o `npm install` desta secção nem o `npm install ejs@7.0.1` da fase 2. Continuas a escrever, executar e corrigir o servidor. A instalação individual pelo npm fica por observar quando houver ligação. Não entregues nem guardes a pasta `node_modules` no Git.

Arranca o servidor com `node --watch server.js`, dentro da pasta do projeto, e deixa-o ligado. O `--watch` reinicia-o quando guardas o `server.js`. Os modelos não precisam disso: o Express volta a lê-los a cada pedido, e basta recarregar a página.

## Fase 1: prever o que o browser recebe

O EJS executa as marcas no servidor. O browser recebe o HTML produzido.

`<%= ... %>` escreve o valor no HTML com escaping. Por exemplo, troca `<` por `&lt;`, para o valor aparecer como texto. `<% ... %>` executa JavaScript, como um `if` ou um `for`, sem escrever esse código na resposta. O HTML entre essas marcas só é produzido no ramo escolhido ou em cada volta do ciclo. `<%# ... %>` é um comentário do modelo e não entra no HTML da resposta.

O modelo seguinte serve para preveres o HTML produzido. Ainda não é para o copiares para o projeto:

```ejs
<h1><%= titulo %></h1>
<% if (equipamentos.length === 0) { %>
  <p>Nada a mostrar.</p>
<% } else { %>
  <ul>
    <% for (const equipamento of equipamentos) { %>
      <li><%= equipamento.nome %> (<%= equipamento.sala %>)</li>
    <% } %>
  </ul>
<% } %>
<%# fim da lista %>
```

Escreve no caderno o HTML que o browser recebe em cada um destes três casos. Podes ignorar as linhas em branco e os espaços no início das linhas.

1. Com os dados `{ titulo: "Sala B12", equipamentos: [{ nome: "Portátil", sala: "B12" }, { nome: "Monitor", sala: "B12" }] }`.
2. Com os dados `{ titulo: "Sala Z99", equipamentos: [] }`.
3. Com os dados `{ titulo: "Teste", equipamentos: [{ nome: "<i>Rato</i>", sala: "C01" }] }`. Escreve também o que o utilizador vê no ecrã, e diz se o rato aparece em itálico.

No fim do laboratório, na parte 8, voltas a estas previsões.


### Respostas para conferires esta fase

Sem linhas em branco nem espaços no início das linhas, que o EJS deixa onde estavam as marcas:

1. Com os dois equipamentos:

```html
<h1>Sala B12</h1>
<ul>
<li>Portátil (B12)</li>
<li>Monitor (B12)</li>
</ul>
```

2. Com a lista vazia:

```html
<h1>Sala Z99</h1>
<p>Nada a mostrar.</p>
```

3. Com o nome com etiquetas:

```html
<h1>Teste</h1>
<ul>
<li>&lt;i&gt;Rato&lt;/i&gt; (C01)</li>
</ul>
```

O utilizador vê `<i>Rato</i> (C01)`, com as etiquetas escritas e sem itálico. Em nenhum dos três casos aparece o comentário `<%# fim da lista %>`.

Se a tua previsão foi diferente: escrever o `<ul>` no caso 2 (o `else` não correu. E o `<ul>` está dentro dele). Escrever as marcas `<%` no HTML. E prever o itálico no caso 3. Este último é o que interessa: volta na parte 7.

### Paragem 1

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 2: a primeira página, e um erro de propósito

Uma rota escolhe os dados e pede um modelo com `res.render`. O Express precisa de saber que o motor é o EJS.


1. Na pasta do catálogo, instala o EJS com `npm install ejs@7.0.1` e confirma a linha nova no `package.json`.
2. Cria a pasta `views`, ao lado do `server.js`, e nela o ficheiro `equipamentos.ejs`, com o modelo da referência de código desta fase.
3. Muda a rota `/equipamentos` para a da referência de código desta fase: a `lista` escolhida primeiro, com `let`, e um só `res.render` no fim. Não acrescentes ainda o `app.set`.
4. Guarda e abre `/equipamentos`. Prevê antes o que vai acontecer.

O que deves ver: uma página de erro, com o código 500 e a mensagem `No default engine was specified and no extension was provided.` O `res.render` pediu um modelo chamado `equipamentos`, sem extensão. O Express não sabe que tipo de ficheiro procurar. O servidor não foi abaixo: só este pedido falhou.

5. Acrescenta o `app.set("view engine", "ejs");` logo a seguir ao `const PORTA = 3000;`, guarda e recarrega.

O que deves ver: a página "Equipamentos", com os quatro equipamentos numa lista. Experimenta também `/equipamentos?sala=B12`, que mostra o portátil e o monitor, e `/equipamentos?sala=Z99`, que mostra só o título: a lista está vazia, e um `<ul>` vazio não se vê.

6. Vai à página inicial, escreve `B12` na pesquisa e carrega em "Pesquisar". A pesquisa leva-te agora a uma página, e não a JSON.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

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

### Respostas para conferires esta fase

Sem o `app.set`: 500, com `Error: No default engine was specified and no extension was provided.` numa página do Express, e o servidor continua ligado. Com o `app.set`: a página "Equipamentos" com os quatro, `?sala=B12` com o portátil e o monitor, `?sala=Z99` só com o título. A pesquisa da página inicial leva a `/equipamentos?sala=B12`, agora uma página.

Erro a esperar: a pasta `views` dentro de outra pasta, ou o ficheiro gravado como `equipamentos.ejs.txt` ou `equipamentos.html`, que dão `Failed to lookup view "equipamentos" in views directory`, com o caminho da pasta procurada. Outro: deixar as duas respostas antigas da rota e acrescentar o `render`, que dá duas respostas no mesmo pedido.

### Paragem 2

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 3: a pesquisa e a lista vazia

Uma lista sem resultados continua a ser uma resposta válida. A condição no modelo transforma o vazio numa mensagem.


1. No `res.render` da lista, passa também a `sala`, e substitui o `<ul>` do modelo pelas duas condições da referência de código desta fase.
2. Abre `/equipamentos?sala=Z99` e `/equipamentos`, sem nada. A primeira mostra a sala pesquisada e a mensagem da lista vazia; a segunda não mostra a linha da pesquisa, porque não houve pesquisa.
3. Agora um erro de propósito. No `res.render`, apaga a parte `, sala: sala`. Guarda, recarrega `/equipamentos` e lê a mensagem com atenção. Prevê primeiro.

O que deves ver: uma página de erro com o código 500 e `ReferenceError`. A mensagem mostra o caminho de `equipamentos.ejs` e um número de linha. Por baixo, mostra as linhas do modelo à volta, com `>>` a apontar para o `if (sala)`. No fim, `sala is not defined`. O modelo usou uma variável que a rota não lhe deu. Repara que o erro aparece mesmo sem pesquisa: não é a sala vazia que faz falta, é a variável.

4. Copia para o caderno a linha da mensagem que diz o ficheiro e a linha. Depois repõe o `sala: sala` e confirma que a página volta.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

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

A primeira condição mostra a sala pesquisada, só quando há uma. A segunda escolhe entre a mensagem e a lista. `/equipamentos?sala=Z99` mostra agora "Pesquisa pela sala Z99." e "Não há equipamentos nesta sala.", com o código 200. A sala pesquisada vem do pedido e entra com `<%=`: o EJS escapa os carateres de HTML para a sala aparecer como texto. Na fase 7 vais comparar este resultado com `<%-`.

### Respostas para conferires esta fase

`?sala=Z99` mostra "Pesquisa pela sala Z99." e "Não há equipamentos nesta sala."; `/equipamentos`, sem pesquisa, mostra a lista sem a linha da pesquisa.

Sem `sala: sala`: 500, `ReferenceError` com o caminho do `equipamentos.ejs` e o número da linha do `if (sala)` (o número depende do teu modelo. Com o modelo do passo 3 do guia, ainda sem os partials, que só entram na parte 5, é a linha 10. No modelo final do exemplo, com os partials, seria a linha 4), as linhas à volta com `>>` nessa linha. E `sala is not defined`. O erro aparece mesmo em `/equipamentos` sem pesquisa. E é essa a observação que conta: o modelo precisa da variável, mesmo vazia. E quem lha dá é a rota.

### Paragem 3

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 4: a página de um equipamento

O identificador escolhe o equipamento no servidor. O modelo recebe o equipamento encontrado e mostra a sua página.


1. Cria o modelo `views/equipamento.ejs`, da referência de código desta fase, e muda a resposta de sucesso da rota de detalhe para o `res.render` desse passo.
2. No modelo da lista, põe o nome de cada equipamento numa ligação para a sua página, como na referência de código desta fase.
3. Abre `/equipamentos`, clica no projetor e, na página dele, clica na sala. Voltas à lista, filtrada pela sala A03.
4. Abre `/equipamentos/abc` e `/equipamentos/9`. Por agora, continuam a responder com JSON, com o 400 e o 404 do tema anterior. A parte 6 trata deles.
5. Outro erro de propósito. No modelo da lista, dentro da ligação, troca `<%= equipamento.nome %>` por `<% equipamento.nome %>`, sem o `=`. Guarda e recarrega a lista. Prevê primeiro.

O que deves ver: nenhum erro, e quatro ligações sem texto, que quase não se veem. A marca `<% %>` correu o código, que calculou o nome, e não o escreveu. É o erro mais difícil de encontrar deste tema, precisamente porque não há mensagem nenhuma.

6. Repõe o `=` e confirma que os nomes voltam.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

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

`/equipamentos/3` mostra a impressora, com a ligação para a sala Secretaria. Os erros desta rota (`/equipamentos/abc` e `/equipamentos/9`) continuam, por agora, a responder com JSON. A fase 6 trata disso.

### Respostas para conferires esta fase

Na lista, as ligações levam a `/equipamentos/1` a `/equipamentos/4`; o projetor mostra "Número: 2" e a ligação para a sala A03, que volta à lista filtrada. `/equipamentos/abc` e `/equipamentos/9` ainda respondem com JSON, 400 e 404.

Com `<%` sem `=`: nenhum erro, e quatro `<a>` vazios, que o browser quase não mostra. A falta de mensagem também é um sintoma: o código corre, mas as ligações ficam vazias.

### Paragem 4

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 5: o cabeçalho e o rodapé

Um partial é uma parte reutilizada por várias páginas. O cabeçalho abre o documento; o rodapé fecha-o.


1. Cria a pasta `views/partials`, com o `cabecalho.ejs` e o `rodape.ejs` da referência de código desta fase.
2. Nos modelos `equipamentos.ejs` e `equipamento.ejs`, troca o início da página pelo `include` do cabeçalho e o fim pelo `include` do rodapé. Tira também o `<h1>`, que o cabeçalho já escreve.
3. Cria o `views/inicio.ejs` da referência de código desta fase e muda a rota `/` para o `res.render("inicio", { titulo: "Início" })`. A rota fica sem HTML nenhum.
4. Abre `/`, `/equipamentos` e `/equipamentos/2`. As três têm o menu no topo e o rodapé no fim, e o título de cada uma é diferente, embora o cabeçalho seja o mesmo ficheiro.
5. Muda o texto do rodapé, por exemplo para dizer o teu nome, guarda e recarrega as três páginas, sem reiniciar o servidor. A mudança aparece nas três.
6. Outro erro de propósito. Em `equipamentos.ejs`, troca o `<%-` do `include` do cabeçalho por `<%=`. Guarda e recarrega a lista. Prevê primeiro.

O que deves ver: o início da página escrito como texto, com `<!doctype html>`, `<title>`, `<nav>` e as outras etiquetas à vista, e a lista por baixo. O `<%=` fez escaping ao HTML do cabeçalho, e o browser mostrou-o como texto. Repara que o título do separador do browser deixou de ser o da página.

7. Repõe o `<%-` e confirma que a página volta ao normal.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

O catálogo terá uma página inicial, uma lista, uma página para cada equipamento e uma página de erro. As quatro começam com o mesmo `<!doctype html>`, o `<head>`, o título e o menu de navegação. Acabam da mesma maneira, com o rodapé e o fecho das etiquetas. Repetir esse HTML em quatro ficheiros é o problema das crases outra vez: mudar o menu obrigava a mudá-lo em quatro sítios. Basta esquecer um para as páginas deixarem de ser iguais.

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

As duas páginas que já existem repetem o mesmo início e o mesmo fim, e a página inicial ainda está num texto com crases. É altura de criar os dois partials mostrados nesta fase, em `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs`, e de os usar.

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

### Respostas para conferires esta fase

As três páginas têm o menu, o título próprio e o rodapé. A mudança do rodapé aparece nas três à primeira recarga, sem reiniciar.

Com o `include` do cabeçalho em `<%=`: o início da página aparece escrito como texto, com `<!doctype html>`, `<title>Equipamentos | Catálogo de equipamentos</title>`, `<nav>`, os `<a>` e o `<h1>` à vista. E a lista por baixo, normal. A página já não tem um `<title>` verdadeiro, e o separador deixa de mostrar o título que escreveste no modelo. O browser pode apresentar o endereço em seu lugar; a forma exata depende do browser.

Se deixares o `<h1>` depois de incluir o cabeçalho, a página terá dois títulos. Se deixares o `</body></html>` depois do rodapé, terá dois fechos. O browser costuma não se queixar, mas o código-fonte mostra-o. Confere também o fim dos modelos.

### Paragem 5

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 6: as páginas de erro

O código HTTP e a mensagem têm papéis diferentes. A rota escolhe o código; o modelo mostra a mensagem.


1. Cria o `views/erro.ejs` da referência de código desta fase.
2. Na rota de detalhe, troca as duas respostas de erro em JSON pelas da referência de código desta fase, sem tirar os `return`.
3. Troca também o middleware final pelo da referência de código desta fase.
4. Com o separador Rede aberto, abre `/equipamentos/abc`, `/equipamentos/0`, `/equipamentos/9` e `/nao-existe`, e regista o código e o título de cada página.

O que deves ver: 400, 400, 404 e 404, com as páginas "Pedido inválido", "Pedido inválido", "Equipamento não encontrado" e "Página não encontrada", todas com o menu e o rodapé. Os códigos são os do tema anterior: a rota continua a escolhê-los, e o modelo `erro.ejs` não sabe qual é.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

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

### Respostas para conferires esta fase

| Pedido | Código | Página |
| --- | --- | --- |
| `/equipamentos/abc` | 400 | Pedido inválido |
| `/equipamentos/0` | 400 | Pedido inválido |
| `/equipamentos/9` | 404 | Equipamento não encontrado |
| `/nao-existe` | 404 | Página não encontrada |

Erro a esperar. E difícil de ver: tirar um `return` ao trocar o `res.status(400).json(...)` pelo `render`. A página mostra "Pedido inválido". E o código é 404, com `Cannot set headers after they are sent to the client` no terminal: o `render` só envia a página depois de ler o modelo. Entretanto o código da rota chega ao `res.status(404)`. E o servidor vai abaixo: o erro acontece quando a segunda página fica pronta, fora da rota. E ninguém o apanha. O pedido seguinte fica sem resposta. Com o `node --watch`, o terminal acaba em `Failed running 'server.js'. Waiting for file changes before restarting...`. E o servidor só volta quando se guardar um ficheiro. O guia tem este caso nos erros frequentes. O código errado só se vê no separador Rede. E é por isso que a parte pede o código de cada página. O servidor em baixo vê-se na página seguinte que abrires.

### Paragem 6

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 7: o escaping a funcionar, e a falhar

O escaping transforma carateres de HTML em texto. Só os fragmentos escritos por ti entram com `<%-`.


1. Na página inicial, escreve na pesquisa `<i>B12</i>`, com as etiquetas, e carrega em "Pesquisar".

O que deves ver: "Pesquisa pela sala `<i>B12</i>`.", com as etiquetas escritas e sem itálico, e a mensagem da lista vazia, porque nenhuma sala se chama assim. O texto da sala aparece a negrito, mas isso vem do `<strong>` que o teu modelo põe à volta de qualquer sala pesquisada. Na barra de endereço, as etiquetas aparecem com códigos (`%3Ci%3E`), e o servidor recebeu-as tal como as escreveste.

2. Agora a experiência que mostra porque é que isto importa. No modelo da lista, troca `<%= sala %>` por `<%- sala %>`. Guarda e repete a pesquisa por `<i>B12</i>`. Prevê primeiro.

O que deves ver: "Pesquisa pela sala ***B12***.", com o B12 em itálico, e as etiquetas desapareceram. O HTML que escreveste na pesquisa entrou na página como HTML.

3. Com o `<%-` ainda no modelo, pesquisa por `<script>alert("olá")</script>`.

O que deves ver: o browser mostra uma janela com "olá". O JavaScript que escreveste num campo de pesquisa correu dentro da página do catálogo. Se em vez de um `alert` fosse um script a ler ou a mudar a página. Se o endereço desta pesquisa fosse enviado a outra pessoa, era ela que o corria, sem saber. É a injeção de código na página de que fala o guia.

4. Repõe o `<%= sala %>` e repete as duas pesquisas. As duas aparecem como texto, e não há janela nenhuma.


### Respostas para conferires esta fase

| Pesquisa | Com `<%= sala %>` | Com `<%- sala %>` |
| --- | --- | --- |
| `<i>B12</i>` | "Pesquisa pela sala `<i>B12</i>`.", com as etiquetas escritas e sem itálico | "Pesquisa pela sala B12.", com o B12 em itálico e sem as etiquetas |
| `<script>alert("olá")</script>` | O texto do script escrito na página | Uma janela com "olá"; a linha da pesquisa fica sem a sala |

Nas duas pesquisas, a lista fica vazia, com a mensagem. Isto acontece porque nenhuma sala se chama assim. Com o `<%=`, o browser recebe `&lt;i&gt;B12&lt;/i&gt;`. Com o `<%-`, recebe `<i>B12</i>`. Nos dois casos a sala aparece a negrito, por causa do `<strong>` do modelo. É por isso que a experiência usa o itálico: com o `<b>`, as duas versões apareceriam a negrito. A diferença visível seria só as etiquetas desaparecerem. Na pesquisa com o `alert`, o servidor envia o `<script>` tal como foi escrito. O browser executa-o como parte da página, e por isso aparece a janela com "olá".

Confere a pergunta: "quem é que escreveu este script?" Tu. "E se o endereço desta pesquisa fosse enviado a um colega?" Corria no browser do colega, dentro da página do catálogo. É a injeção de código na página.

Se o browser da sala bloquear ou não mostrar a janela, a demonstração do itálico chega para a ideia. Não usar outro script além do `alert`.

### Paragem 7

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 8: o que o browser recebe, e a evidência

Comparar a vista com a resposta permite localizar onde o EJS correu. A comparação é uma prova do percurso dos dados.


1. Abre `/equipamentos?sala=B12` e o código-fonte da página (Ctrl+U; no Mac, Cmd+Option+U). Põe ao lado, no editor, o teu `views/equipamentos.ejs`.
2. Copia esta tabela para o caderno e preenche a última coluna, a comparar o modelo com o código-fonte:

| O que procurar | No modelo | No código-fonte |
| --- | --- | --- |
| As marcas `<%` | Várias | |
| O ciclo `for` | Um | |
| Os `<li>` | Um | |
| A frase "Não há equipamentos nesta sala." | Uma | |
| O comentário do início | Um | |
| O `<head>` e o menu | Nenhum | |

3. No separador Rede, clica no pedido da lista e regista o código e o `Content-Type` da resposta. Abre um pedido do tema anterior que ainda tenhas noutro servidor, ou recorda-o: que `Content-Type` tinha?
4. Volta às previsões da parte 1 e corrige a lápis o que previste mal. Para cada correção, escreve numa frase o que te enganou.
5. Para a evidência deste tema, escreve no caderno, por palavras tuas, a resposta a esta pergunta: porque é que o browser nunca executa o modelo `equipamentos.ejs`? Usa a tabela que acabaste de preencher como prova.

### Respostas para conferires esta fase

| O que procurar | No modelo | No código-fonte |
| --- | --- | --- |
| As marcas `<%` | Várias | Nenhuma |
| O ciclo `for` | Um | Nenhum |
| Os `<li>` | Um | Dois, um para o portátil e outro para o monitor |
| A frase "Não há equipamentos nesta sala." | Uma | Nenhuma: o `else` foi o ramo que correu |
| O comentário do início | Um | Nenhum |
| O `<head>` e o menu | Nenhum | Um de cada, vindos do cabeçalho |

No separador Rede: 200 e `Content-Type: text/html; charset=utf-8`. Os pedidos do tema anterior tinham `application/json`.

O browser não executa o modelo porque o modelo nunca lá chega. O EJS correu no servidor, substituiu as marcas pelo que produziram. E o browser recebeu só o resultado, que é HTML. A tabela prova-o: o que estava no modelo e não é HTML (as marcas, o ciclo, a condição, o comentário) não está no código-fonte.



### Paragem 8

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.

## Problemas frequentes

### A página de erro tem uma mensagem que não percebo

Começa pela primeira linha, a que diz o tipo do erro. Compara a mensagem com estes casos:

- `No default engine`: falta `app.set("view engine", "ejs");` depois de criar a aplicação. Acrescenta essa configuração ao `server.js`.
- `Cannot find module 'ejs'`: o pacote não está instalado na pasta do projeto. Corre `npm install ejs@7.0.1` nessa pasta.
- `Failed to lookup view`: o Express não encontrou o modelo. Confere o nome no `res.render`, a pasta `views` e a pasta onde arrancaste o servidor.
- `is not defined`: o modelo usa uma variável que não recebeu. Acrescenta-a ao objeto do `res.render`, com o nome exato que o modelo usa.
- `Unexpected token 'catch'`: o JavaScript das marcas EJS está incompleto. Confere as chavetas do `for` ou do `if`, incluindo o fecho `<% } %>`. O `catch` vem do código que o EJS cria à volta do modelo.

### Failed to lookup view, e o ficheiro existe

Confirma três coisas, por esta ordem: o nome no `res.render` é igual ao do ficheiro, sem `.ejs`. O ficheiro está dentro da pasta `views`. E não ao lado dela. E o servidor foi arrancado dentro da pasta do projeto. A mensagem diz a pasta onde o Express procurou: compara-a com a tua.

### O npm install ejs não funciona

Sem internet, o npm não consegue descarregar o pacote. Usa a preparação fornecida pelo professor, com Express e EJS 7.0.1 preparados e testados nos computadores da escola, e uma cópia de apoio compatível. Se ainda não estiver disponível, avisa o professor antes de continuares. Trazer uma pasta instalada em casa não prova que funcione nesses postos. A instalação individual pelo npm fica por observar quando houver ligação. A pasta `node_modules` não faz parte da entrega nem vai para o Git.

### Mudei o modelo e a página não mudou

Confirma que guardaste o ficheiro e que estás a abrir a página certa. Os modelos são lidos a cada pedido, e não é preciso reiniciar. Se mudaste o `server.js`, o `--watch` reinicia sozinho; sem ele, faz Ctrl+C e volta a arrancar.

### A página aparece toda desformatada, com partes no sítio errado

Uma etiqueta ficou aberta ou foi fechada duas vezes. O cabeçalho abre o `<html>` e o `<body>`, e só o rodapé os fecha: confirma que nenhuma página os fecha por conta própria e que todas incluem os dois partials.

### Aparecem no terminal pedidos GET /favicon.ico

É o browser a pedir o ícone do separador, como no tema anterior. Agora a resposta é a página "Página não encontrada", com 404, que o browser ignora.

## O que fica no teu caderno

1. As previsões da parte 1, com as correções da parte 8.
2. Os três erros provocados (partes 2, 3 e 4) e o do `include` (parte 5): a previsão, o que aconteceu e porquê.
3. Os códigos e os títulos das quatro páginas de erro da parte 6.
4. As quatro pesquisas da parte 7, com o que viste com `<%=` e com `<%-`.
5. A tabela da parte 8 e a tua resposta à pergunta da evidência.

Com a tabela da parte 8 aberta, explica ao professor porque é que o browser não executa o modelo. Diz também o que aconteceria se o `<%= sala %>` passasse a `<%- sala %>`.

## Conferência dos ficheiros finais

Depois de desfazeres todos os erros provocados, confere os teus ficheiros com esta versão completa. Os nomes e as rotas mantêm a sequência do catálogo.

### `server.js` completo

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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/equipamento.ejs` completo

```ejs
<%# A página de um equipamento. Recebe o titulo e o equipamento. %>
<%- include("partials/cabecalho") %>
    <p>Número: <%= equipamento.id %></p>
    <p>Sala: <a href="/equipamentos?sala=<%= equipamento.sala %>"><%= equipamento.sala %></a></p>
    <p><a href="/equipamentos">Voltar à lista</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/equipamentos.ejs` completo

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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/erro.ejs` completo

```ejs
<%# A página de erro, para o 400 e para o 404. Recebe o titulo e a
    mensagem; o código de estado é a rota que o escolhe. %>
<%- include("partials/cabecalho") %>
    <p><%= mensagem %></p>
    <p><a href="/">Voltar ao início</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/inicio.ejs` completo

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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/partials/cabecalho.ejs` completo

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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/partials/rodape.ejs` completo

```ejs
<%# O fim de todas as páginas do catálogo. %>
    <footer>
      <p>Catálogo de equipamentos da escola. Página gerada no servidor.</p>
    </footer>
  </body>
</html>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

## Desafios

1. No cabeçalho, mostra uma ligação adicional para a sala B12. Explica porque a mudança aparece em todas as páginas.

## Antes de terminares

- [ ] Desfizeste os erros provocados e confirmaste o catálogo a funcionar.
- [ ] Guardaste as previsões, os resultados e as explicações pedidas.
- [ ] Consegues explicar onde correm o JavaScript e o EJS e que dados chegam ao browser.

![Rodapé](../imagens/rodape.png)
