![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o pedido em curso

Laboratório do sexto tema do módulo Aplicações baseadas em browsers. Cerca de 120 minutos, repartidos pelas aulas do tema. Partes do teu catálogo com formulários do tema anterior e dás-lhe um pedido em curso, guardado numa sessão: juntar equipamentos, ver o pedido, tirar, confirmar e cancelar. Pelo caminho, vês porque é que uma variável do servidor não chega, mexes nos cookies com as tuas próprias mãos, e roubas uma sessão a ti mesmo, para perceberes porque é que uma sessão não é uma prova de identidade.

As ideias e o código estão no [guia do tema](06-cookies-e-sessoes.md), e cada parte diz em que secção ou em que passo do exemplo guiado. Escreve o código em vez de o copiar, e antes de cada experiência escreve a previsão no caderno.

## Antes de começar

Precisas do catálogo com formulários do laboratório do tema anterior, a funcionar. Se não o tiveres, copia a pasta [catalogo-com-formularios](../exemplos/aplicacoes-em-browser/catalogo-com-formularios/README.md) dos exemplos para a tua pasta de trabalho e corre `npm install` dentro dela.

Vais precisar de dois "browsers" diferentes no mesmo computador. A forma mais simples é uma janela normal e uma janela anónima do mesmo browser (no Chrome, Ctrl+Shift+N; no Mac, Cmd+Shift+N): têm cookies separados. Duas janelas normais não servem, porque partilham os cookies.

Nas ferramentas de programador, vais usar o separador Rede, a consola, e o separador onde o browser mostra os cookies: no Chrome, "Application" ("Aplicação"), secção "Cookies"; no Firefox, "Armazenamento".

## Parte 1: prever antes de programar

Guia: secções "O HTTP não se lembra de nada" a "Terminar a sessão". Faz-se em papel.

O catálogo do fim do exemplo guiado está a correr. Para cada situação, escreve no caderno o que esperas.

1. Abres a página inicial pela primeira vez. O browser recebe algum cookie?
2. Na janela normal, juntas o projetor ao pedido. Na janela anónima, abres `/pedido`. O que vês?
3. Na janela normal, com dois equipamentos no pedido, o servidor reinicia. Recarregas `/pedido`. O que vês, e o browser ainda tem o cookie?
4. Copias o valor do cookie da janela normal para a janela anónima. O que mostra `/pedido` na anónima?
5. Na janela normal, cancelas o pedido. Antes, tinhas copiado o valor do cookie. Depois do cancelamento, voltas a pôr esse valor no browser. O que mostra `/pedido`?
6. Na consola de uma página do catálogo, escreves `document.cookie`. O que aparece?

No fim do laboratório, na parte 8, voltas a estas previsões.

## Parte 2: a tentativa ingénua

Guia: secção "O HTTP não se lembra de nada".

1. No `server.js`, logo a seguir ao middleware do `express.urlencoded`, acrescenta a tentativa do guia: a variável `pedido` e a rota `POST /pedido/itens` que lhe junta o `equipamento_id`. Acrescenta também uma rota `GET /pedido` provisória, que só escreve o pedido:

   ```js fragment
   app.get("/pedido", (req, res) => {
     res.send(`Pedido: ${pedido.join(", ")}`);
   });
   ```

2. Para enviares um `POST` sem formulário novo, muda temporariamente, no `reserva-nova.ejs`, o `action` do formulário para `/pedido/itens`. Na janela normal, escolhe o projetor e envia (preenche os outros campos, para o browser deixar).
3. Na janela anónima, que não juntou nada, abre `/pedido`. Prevê primeiro.

O que deves ver: `Pedido: 2`, o projetor que juntaste na outra janela. A variável é uma só para o servidor inteiro, e todos os browsers a partilham.

4. Apaga a variável e as duas rotas provisórias, e repõe o `action` do formulário. As rotas certas vêm na parte 4.

## Parte 3: o segredo e o express-session

Guia: secção "A sessão com o express-session" e exemplo guiado, passo 1.

1. Instala o `express-session` com `npm install express-session` e confirma a linha nova no `package.json`.
2. Cria o `.env.example`, com o comentário e a linha `SESSION_SECRET=` sem valor, e confirma que o `.gitignore` tem a linha `.env`. Se o teu projeto não tiver `.gitignore`, cria-o, com as linhas `node_modules/` e `.env`.
3. No `server.js`, acrescenta o `import` da sessão, a leitura do segredo com a verificação e o nome do cookie, e o middleware das sessões, como no passo 1.
4. Para o servidor (Ctrl+C) e arranca-o com `node --watch --env-file=.env server.js`. Prevê primeiro: ainda não há `.env`.

O que deves ver: `node: .env: not found`, e o servidor não arranca.

5. Cria o `.env` como cópia do `.env.example`, sem mudar nada, e arranca outra vez. Prevê primeiro.

O que deves ver: a mensagem do teu `server.js`, a começar por `Falta o SESSION_SECRET`, e o servidor não arranca. O ficheiro existe, mas o segredo está vazio.

6. Gera um segredo com o comando do guia, cola-o no `.env` a seguir ao `SESSION_SECRET=`, e arranca outra vez. O servidor arranca, e as páginas funcionam como antes.

## Parte 4: juntar ao pedido

Guia: secção "O que o middleware faz a cada pedido" e exemplo guiado, passo 2.

1. Abre o separador dos cookies do browser, na janela normal, e confirma que `http://localhost:3000` não tem cookie nenhum. Navega pelo catálogo e confirma que continua sem cookie. Escreve no caderno porquê, com a opção do middleware responsável.
2. Muda o `validarReserva` para o `validarItem`, cria o `item-novo.ejs` e as rotas `GET /pedido/item` e `POST /pedido/itens` do passo 2. Acrescenta a função `linhasDoPedido` e a rota `GET /pedido`.
3. Cria um `pedido.ejs` provisório, só com o cabeçalho, a lista dos equipamentos do pedido (o equipamento e a sala, o dia e o tempo), a mensagem do pedido vazio, a ligação para juntar um equipamento e o rodapé. O completo vem na parte 6.
4. Com o separador Rede aberto, junta o projetor ao pedido. No `POST` a `itens`, copia para o caderno a linha do `Set-Cookie`: o nome, o início do valor e os atributos.
5. No separador dos cookies, confirma o `catalogo.sid`, e regista o que diz cada coluna: a expiração, o `HttpOnly`, o `Secure` e o `SameSite`.
6. Junta o portátil. No `GET` a `pedido` que veio a seguir, procura o cabeçalho `Cookie` do pedido. O que leva, e o que não leva, em comparação com o `Set-Cookie`?
7. Tenta juntar um equipamento com o tempo 12 (com o `novalidate`, se o browser não deixar). O formulário volta com a mensagem, e o pedido continua com dois.

## Parte 5: o menu, e duas sessões isoladas

Guia: exemplo guiado, passos 2 e 3.

1. Acrescenta o middleware que põe o `itensNoPedido` no `res.locals`, depois do middleware das sessões, e muda o menu do cabeçalho para "O teu pedido (...)". Muda as ligações do formulário antigo para `/pedido/item`. Guarda os ficheiros.
2. Recarrega a página inicial na janela normal. Prevê primeiro: o menu mostra os dois equipamentos que juntaste na parte 4?

O que deves ver: "O teu pedido (0)". Ao guardares o `server.js`, o `--watch` reiniciou o servidor. As sessões vivem na memória do servidor, e não no browser, e por isso desapareceram com o reinício. O browser ainda tem o cookie `catalogo.sid`, mas o servidor já não tem nada com aquele identificador, e trata-te como um browser novo. É a situação 3 das previsões da parte 1, e vais vê-la outra vez, de propósito, na parte 7. A partir daqui, cada vez que guardares o `server.js`, os pedidos das duas janelas voltam a zero.

3. Na janela normal, junta outra vez o projetor e o portátil ao pedido. O menu passa a mostrar "O teu pedido (2)".
4. Na janela anónima, abre o catálogo. O que mostra o menu? Junta lá o monitor.
5. Volta à janela normal e recarrega. O que mostra o menu?
6. Para a evidência deste tema, regista no caderno, para cada janela: o que tem o pedido, e os primeiros oito carateres do valor do cookie, a seguir ao `s%3A`. São duas sessões isoladas.

## Parte 6: tirar, confirmar e cancelar

Guia: secção "Terminar a sessão" e exemplo guiado, passos 4 e 5.

1. Acrescenta a rota de remoção do passo 4 e completa o `pedido.ejs` como no passo 5, com o botão de cada equipamento, a confirmação e o cancelamento. Acrescenta a função `erroDoNome` e as rotas da confirmação e do cancelamento. Guarda os ficheiros. O servidor reiniciou outra vez, e os pedidos das duas janelas perderam-se, como na parte 5: junta outra vez o projetor e o portátil na janela normal, e o monitor na janela anónima, e confirma no menu de cada uma "O teu pedido (2)" e "O teu pedido (1)".
2. Na janela normal, tira o primeiro equipamento. O pedido fica com um.
3. Confirma o pedido com o nome vazio (com o `novalidate`, se for preciso). Regista o código e a mensagem.
4. Confirma com o teu nome. Prevê primeiro: para onde vai o browser, e o que acontece ao cookie?

O que deves ver: a lista das reservas, com a reserva nova, e o menu com "O teu pedido (0)". No separador Rede, a resposta ao `POST` a `confirmacao` tem um `Set-Cookie` com o valor vazio e a data de 1970. No separador dos cookies, o `catalogo.sid` desapareceu.

5. Agora o cancelamento, na janela anónima, com uma experiência a mais. Antes de cancelar, copia para o caderno o valor completo do cookie dessa janela. Depois cancela.
6. No separador dos cookies da janela anónima, cria outra vez o cookie `catalogo.sid`, com o valor que copiaste (no Chrome, faz duplo clique na linha vazia da tabela para acrescentar um cookie). Abre `/pedido`. Prevê primeiro.

O que deves ver: "O teu pedido está vazio.". O cookie voltou ao browser, mas a sessão foi destruída no servidor, e o identificador já não leva a nada. Para a evidência deste tema, regista que o estado foi eliminado ao terminar, e como o confirmaste.

## Parte 7: o roubo de uma sessão, e as defesas

Guia: secções "Os atributos do cookie" e "Uma sessão não é uma autenticação".

1. Na janela normal, junta dois equipamentos ao pedido. Copia o valor completo do cookie.
2. Na janela anónima, cria (ou muda) o cookie `catalogo.sid` com esse valor, e abre `/pedido`. Prevê primeiro.

O que deves ver: o pedido da janela normal, com os dois equipamentos. Para o servidor, as duas janelas passaram a ser o mesmo browser. Na anónima, tira um equipamento e volta à normal: o pedido mudou também lá. É um roubo de sessão, feito a ti mesmo.

3. Na janela anónima, muda uma só letra do identificador (antes do ponto) e recarrega `/pedido`. Prevê primeiro.

O que deves ver: o pedido vazio. A assinatura deixou de bater certo, e o servidor ignorou o cookie.

4. Na consola de uma página do catálogo, na janela normal, escreve `document.cookie` e carrega em Enter. Regista o que aparece, e explica-o com o atributo responsável.
5. Com um pedido a meio na janela normal, guarda o `server.js` sem mudar nada, para o `--watch` reiniciar o servidor. Recarrega `/pedido`. O que aconteceu ao pedido? E o cookie, ainda está no browser?

## Parte 8: a configuração justificada, e a evidência

Guia: secções "O middleware e as suas opções", "Os atributos do cookie" e "Segurança".

1. Copia para o caderno esta tabela e preenche a última coluna com a razão de cada valor, por palavras tuas. É o artefacto deste tema: a configuração da sessão, justificada.

| Opção | Valor no catálogo | Porquê |
| --- | --- | --- |
| `secret` | lido do `.env` | |
| `name` | `catalogo.sid` | |
| `resave` | `false` | |
| `saveUninitialized` | `false` | |
| `cookie.httpOnly` | `true` | |
| `cookie.sameSite` | `"lax"` | |
| `cookie.secure` | `false` | |
| `cookie.maxAge` | 30 minutos | |

2. Na linha do `secure`, escreve também o que mudaria num servidor publicado, e porquê.
3. Em pares: um explica ao outro, sem ler, para que servem o `HttpOnly`, o `SameSite` e o `Secure`, e a diferença entre o roubo e a fixação de uma sessão. Depois trocam.
4. Volta às previsões da parte 1 e corrige a lápis o que previste mal.

## Problemas frequentes no laboratório

### O servidor não arranca

Lê a primeira linha do terminal. `node: .env: not found` quer dizer que não há `.env` na pasta; `Falta o SESSION_SECRET` quer dizer que o `.env` não tem o segredo, ou que o servidor arrancou sem o `--env-file=.env`. Guia: "Erros frequentes".

### Todas as páginas dão 500

Se a mensagem fala de `reading 'pedido'`, o middleware das sessões está abaixo do middleware do `res.locals` ou das rotas. Guia: "Erros frequentes".

### As duas janelas mostram o mesmo pedido, sem eu copiar o cookie

São duas janelas normais, que partilham os cookies. Uma delas tem de ser anónima.

### Não encontro onde criar ou mudar um cookie

No Chrome, no separador "Application", secção "Cookies", escolhe `http://localhost:3000`: para mudar um valor, faz duplo clique na célula; para criar um cookie, faz duplo clique na linha vazia no fim da tabela. No Firefox, no separador "Armazenamento", há um botão para acrescentar. O nome tem de ser exatamente `catalogo.sid`.

### O pedido desapareceu sozinho

O servidor reiniciou, ou passaram 30 minutos sem mudar o pedido. Guia: "Erros frequentes", "O pedido desapareceu".

## O que fica no teu caderno

1. As previsões da parte 1, com as correções da parte 8.
2. O resultado da tentativa ingénua da parte 2.
3. Os dois erros de arranque da parte 3.
4. O `Set-Cookie`, os atributos e o cabeçalho `Cookie` da parte 4.
5. A evidência das duas sessões isoladas (parte 5) e do estado eliminado ao terminar (parte 6).
6. As experiências da parte 7: o roubo, o identificador mudado, o `document.cookie` e o reinício.
7. A tabela da configuração justificada, da parte 8.

O professor vai pedir-te que expliques, com o teu servidor aberto, porque é que o pedido não se mistura entre as duas janelas, e porque é que o catálogo não pode confiar no nome guardado com o pedido.

![Rodapé](../imagens/rodape.png)
