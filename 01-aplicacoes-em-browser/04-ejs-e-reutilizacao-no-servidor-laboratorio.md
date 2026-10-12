![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o catálogo com páginas

Laboratório do quarto tema do módulo Aplicações baseadas em browsers. Cerca de 100 minutos, repartidos pelas aulas do tema. Partes do teu catálogo com middleware do tema anterior e transformas as respostas em páginas: primeiro a lista, depois a pesquisa com a lista vazia, a página de cada equipamento, o cabeçalho e o rodapé partilhados e as páginas de erro. Pelo caminho, provocas de propósito os erros que mais vais encontrar com o EJS, vês o escaping a funcionar e a falhar, e no fim comparas os teus modelos com o HTML que o browser recebe de facto.

As ideias e o código estão no [guia do tema](04-ejs-e-reutilizacao-no-servidor.md), e cada parte diz em que secção. O exemplo guiado do guia faz o mesmo caminho, passo a passo: usa-o para perceber cada passo, e escreve tu o código, em vez de o copiar. Antes de cada experiência, escreve a previsão no caderno.

## Antes de começar

Precisas do catálogo com middleware do laboratório do tema anterior, a funcionar. Se não o tiveres, copia a pasta [catalogo-com-middleware](../exemplos/aplicacoes-em-browser/catalogo-com-middleware/README.md) dos exemplos para a tua pasta de trabalho e corre `npm install` dentro dela. Se fizeste o laboratório da API da papelaria, em vez do do catálogo, faz esta cópia: a pasta da papelaria fica para Linguagens de Programação.

Precisas também de internet para o `npm install ejs` da parte 2. Se a rede falhar, o professor tem a pasta `node_modules` numa pen.

Arranca o servidor com `node --watch server.js`, dentro da pasta do projeto, e deixa-o ligado. O `--watch` reinicia-o quando guardas o `server.js`. Os modelos não precisam disso: o Express volta a lê-los a cada pedido, e basta recarregar a página.

## Parte 1: prever o que o browser recebe

Guia: secções "As marcas do EJS" e "Ciclos e condições dentro do modelo". Faz-se em papel, antes de abrir o computador.

Este modelo não é o do guia:

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

## Parte 2: a primeira página, e um erro de propósito

Guia: secção "Preparar o Express para o EJS" e exemplo guiado, passos 1 e 2.

1. Na pasta do catálogo, instala o EJS com `npm install ejs` e confirma a linha nova no `package.json`.
2. Cria a pasta `views`, ao lado do `server.js`, e nela o ficheiro `equipamentos.ejs`, com o modelo do passo 2 do guia.
3. Muda a rota `/equipamentos` para a do passo 2: a `lista` escolhida primeiro, com `let`, e um só `res.render` no fim. Não acrescentes ainda o `app.set`.
4. Guarda e abre `/equipamentos`. Prevê antes o que vai acontecer.

O que deves ver: uma página de erro, com o código 500 e a mensagem `No default engine was specified and no extension was provided.` O `res.render` pediu um modelo chamado `equipamentos`, sem extensão, e o Express não sabe que tipo de ficheiro procurar. O servidor não foi abaixo: só este pedido falhou.

5. Acrescenta o `app.set("view engine", "ejs");` logo a seguir ao `const PORTA = 3000;`, guarda e recarrega.

O que deves ver: a página "Equipamentos", com os quatro equipamentos numa lista. Experimenta também `/equipamentos?sala=B12`, que mostra o portátil e o monitor, e `/equipamentos?sala=Z99`, que mostra só o título: a lista está vazia, e um `<ul>` vazio não se vê.

6. Vai à página inicial, escreve `B12` na pesquisa e carrega em "Pesquisar". A pesquisa leva-te agora a uma página, e não a JSON.

## Parte 3: a pesquisa e a lista vazia

Guia: exemplo guiado, passo 3.

1. No `res.render` da lista, passa também a `sala`, e substitui o `<ul>` do modelo pelas duas condições do passo 3.
2. Abre `/equipamentos?sala=Z99` e `/equipamentos`, sem nada. A primeira mostra a sala pesquisada e a mensagem da lista vazia; a segunda não mostra a linha da pesquisa, porque não houve pesquisa.
3. Agora um erro de propósito. No `res.render`, apaga a parte `, sala: sala`. Guarda, recarrega `/equipamentos` e lê a mensagem com atenção. Prevê primeiro.

O que deves ver: uma página de erro com o código 500 e `ReferenceError`, o caminho do teu `equipamentos.ejs`, um número de linha e, por baixo, as linhas do modelo à volta, com `>>` a apontar para a linha do `if (sala)`. No fim, `sala is not defined`. O modelo usou uma variável que a rota não lhe deu. Repara que o erro aparece mesmo sem pesquisa: não é a sala vazia que faz falta, é a variável.

4. Copia para o caderno a linha da mensagem que diz o ficheiro e a linha. Depois repõe o `sala: sala` e confirma que a página volta.

## Parte 4: a página de um equipamento

Guia: exemplo guiado, passo 4.

1. Cria o modelo `views/equipamento.ejs`, do passo 4, e muda a resposta de sucesso da rota de detalhe para o `res.render` desse passo.
2. No modelo da lista, põe o nome de cada equipamento numa ligação para a sua página, como no passo 4.
3. Abre `/equipamentos`, clica no projetor e, na página dele, clica na sala. Voltas à lista, filtrada pela sala A03.
4. Abre `/equipamentos/abc` e `/equipamentos/9`. Por agora, continuam a responder com JSON, com o 400 e o 404 do tema anterior. A parte 6 trata deles.
5. Outro erro de propósito. No modelo da lista, dentro da ligação, troca `<%= equipamento.nome %>` por `<% equipamento.nome %>`, sem o `=`. Guarda e recarrega a lista. Prevê primeiro.

O que deves ver: nenhum erro, e quatro ligações sem texto, que quase não se veem. A marca `<% %>` correu o código, que calculou o nome, e não o escreveu. É o erro mais difícil de encontrar deste tema, precisamente porque não há mensagem nenhuma.

6. Repõe o `=` e confirma que os nomes voltam.

## Parte 5: o cabeçalho e o rodapé

Guia: secção "Partes partilhadas: o cabeçalho e o rodapé" e exemplo guiado, passo 5.

1. Cria a pasta `views/partials`, com o `cabecalho.ejs` e o `rodape.ejs` do guia.
2. Nos modelos `equipamentos.ejs` e `equipamento.ejs`, troca o início da página pelo `include` do cabeçalho e o fim pelo `include` do rodapé. Tira também o `<h1>`, que o cabeçalho já escreve.
3. Cria o `views/inicio.ejs` do passo 5 e muda a rota `/` para o `res.render("inicio", { titulo: "Início" })`. A rota fica sem HTML nenhum.
4. Abre `/`, `/equipamentos` e `/equipamentos/2`. As três têm o menu no topo e o rodapé no fim, e o título de cada uma é diferente, embora o cabeçalho seja o mesmo ficheiro.
5. Muda o texto do rodapé, por exemplo para dizer o teu nome, guarda e recarrega as três páginas, sem reiniciar o servidor. A mudança aparece nas três.
6. O terceiro erro de propósito. Em `equipamentos.ejs`, troca o `<%-` do `include` do cabeçalho por `<%=`. Guarda e recarrega a lista. Prevê primeiro.

O que deves ver: o início da página escrito como texto, com `<!doctype html>`, `<title>`, `<nav>` e as outras etiquetas à vista, e a lista por baixo. O `<%=` fez escaping ao HTML do cabeçalho, e o browser mostrou-o como texto. Repara que o título do separador do browser deixou de ser o da página.

7. Repõe o `<%-` e confirma que a página volta ao normal.

## Parte 6: as páginas de erro

Guia: exemplo guiado, passo 6.

1. Cria o `views/erro.ejs` do passo 6.
2. Na rota de detalhe, troca as duas respostas de erro em JSON pelas do passo 6, sem tirar os `return`.
3. Troca também o middleware final pelo do passo 6.
4. Com o separador Rede aberto, abre `/equipamentos/abc`, `/equipamentos/0`, `/equipamentos/9` e `/nao-existe`, e regista o código e o título de cada página.

O que deves ver: 400, 400, 404 e 404, com as páginas "Pedido inválido", "Pedido inválido", "Equipamento não encontrado" e "Página não encontrada", todas com o menu e o rodapé. Os códigos são os do tema anterior: a rota continua a escolhê-los, e o modelo `erro.ejs` não sabe qual é.

## Parte 7: o escaping a funcionar, e a falhar

Guia: secção "Escaping: o que vem de fora nunca vira HTML".

1. Na página inicial, escreve na pesquisa `<b>B12</b>`, com as etiquetas, e carrega em "Pesquisar".

O que deves ver: "Pesquisa pela sala <b>B12</b>.", com as etiquetas escritas, sem negrito, e a mensagem da lista vazia, porque nenhuma sala se chama assim. Na barra de endereço, as etiquetas aparecem com códigos (`%3Cb%3E`), e o servidor recebeu-as tal como as escreveste.

2. Agora a experiência que mostra porque é que isto importa. No modelo da lista, troca `<%= sala %>` por `<%- sala %>`. Guarda e repete a pesquisa do passo 1. Prevê primeiro.

O que deves ver: "Pesquisa pela sala **B12**.", com o B12 a negrito. O HTML que escreveste na pesquisa entrou na página como HTML.

3. Com o `<%-` ainda no modelo, pesquisa por `<script>alert("olá")</script>`.

O que deves ver: o browser mostra uma janela com "olá". O JavaScript que escreveste num campo de pesquisa correu dentro da página do catálogo. Se em vez de um `alert` fosse um script a ler ou a mudar a página, e se o endereço desta pesquisa fosse enviado a outra pessoa, era ela que o corria, sem saber. É a injeção de código na página de que fala o guia.

4. Repõe o `<%= sala %>` e repete as duas pesquisas. As duas aparecem como texto, e não há janela nenhuma.

## Parte 8: o que o browser recebe, e a evidência

Guia: secção "O que o browser recebe".

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
5. Para a evidência deste tema, escreve no caderno, por palavras tuas, a resposta a esta pergunta: porque é que o browser nunca executa o modelo `equipamentos.ejs`? Usa a tabela do passo 2 como prova.

## Problemas frequentes no laboratório

### A página de erro tem uma mensagem que não percebo

Começa pela primeira linha, a que diz o tipo do erro, e procura-a na secção "Erros frequentes" do guia. Estão lá as mensagens deste laboratório: `No default engine`, `Cannot find module 'ejs'`, `Failed to lookup view`, `is not defined` e `Unexpected token 'catch'`.

### Failed to lookup view, e o ficheiro existe

Confirma três coisas, por esta ordem: o nome no `res.render` é igual ao do ficheiro, sem `.ejs`; o ficheiro está dentro da pasta `views`, e não ao lado dela; e o servidor foi arrancado dentro da pasta do projeto. A mensagem diz a pasta onde o Express procurou: compara-a com a tua.

### O npm install ejs não funciona

Sem internet, o npm não consegue descarregar o pacote. Pede ao professor a pasta da pen, ou faz a instalação em casa e traz a pasta do projeto.

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

O professor vai pedir-te que expliques, com a tabela da parte 8 aberta, porque é que o browser não executa o modelo, e que digas o que acontecia se o `<%= sala %>` passasse a `<%- sala %>`.

![Rodapé](../imagens/rodape.png)
