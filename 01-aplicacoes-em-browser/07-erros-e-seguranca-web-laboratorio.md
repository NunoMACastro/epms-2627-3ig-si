![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o catálogo preparado para falhar

Laboratório do sétimo tema do módulo Aplicações baseadas em browsers. Cerca de 100 minutos, repartidos pelas aulas do tema. Partes do teu catálogo com sessões do tema anterior. Provocas de propósito uma falha que ninguém previu e lês o que o Express mostra a quem a provoca; substituis essa página por um middleware de erro teu; olhas para o que o servidor escreve no terminal; mexes no segredo; vês o escaping a falhar num atributo sem aspas; proteges os formulários contra o CSRF; e, no fim, fazes a matriz de falhas do teu servidor e verificas a de um colega.

As ideias e o código estão no [guia do tema](07-erros-e-seguranca-web.md), e cada parte diz em que secção ou em que passo do exemplo guiado. Escreve o código em vez de o copiar, e antes de cada experiência escreve a previsão no caderno.

## Antes de começar

Precisas do catálogo com sessões do laboratório do tema anterior, a funcionar, com o `.env` e o segredo. Se não o tiveres, copia a pasta [catalogo-com-sessoes](../exemplos/aplicacoes-em-browser/catalogo-com-sessoes/README.md) dos exemplos, corre `npm install`, cria o `.env` a partir do `.env.example` e gera o segredo com o comando do guia do tema anterior.

Arranca o servidor com `node --watch --env-file=.env server.js`, e mantém o terminal à vista: neste laboratório, o terminal é tão importante como o browser.

## Parte 1: prever antes de programar

Guia: secções "Quem errou: o pedido ou o servidor" e "A matriz de falhas". Faz-se em papel.

Para cada situação, com o catálogo do fim do exemplo guiado, escreve no caderno: é uma falha do pedido ou do servidor? Que código? O que vê quem fez o pedido?

1. `GET /equipamentos/abc`
2. Um formulário de juntar ao pedido enviado sem o campo `_csrf`
3. Um modelo que tenta ler `equipamento.fabricante.nome`
4. Um `POST` com um corpo de 200 000 carateres
5. O servidor arrancado com o segredo `abc123`
6. `GET /equipamentos/%E0%A4%A`

No fim do laboratório, na parte 8, voltas a estas previsões.

## Parte 2: a página de erro do Express

Guia: secção "O erro que ninguém previu" e exemplo guiado, passo 1.

1. No `views/equipamento.ejs`, muda a linha do número para mostrar também o fabricante, que os equipamentos não têm: `<p>Número: <%= equipamento.id %>, de <%= equipamento.fabricante.nome %></p>`. Guarda.
2. Abre `/equipamentos/2`. Prevê primeiro.

O que deves ver: uma página com o código 500, o `TypeError`, a mensagem `Cannot read properties of undefined (reading 'nome')` e o stack trace, com os caminhos das pastas do teu computador.

3. Copia para o caderno três coisas que esta página revela sobre o teu servidor e que um desconhecido não devia saber. Confirma no terminal que o mesmo erro lá está.
4. Para o servidor e arranca-o assim, em modo de produção: no macOS e no Linux, `NODE_ENV=production node --env-file=.env server.js`; na PowerShell do Windows, primeiro `$env:NODE_ENV="production"` e depois `node --env-file=.env server.js`. Abre outra vez `/equipamentos/2`. O que mudou? Repara também no terminal: há um aviso novo, do tema anterior.
5. Para o servidor e volta a arrancá-lo como antes, sem o modo de produção (na PowerShell, fecha o terminal e abre outro). Deixa o erro no modelo: vais precisar dele na parte seguinte.

## Parte 3: o middleware de erro

Guia: secção "O middleware de erro" e exemplo guiado, passo 2.

1. Acrescenta o middleware de erro do guia, com as três partes, no fim do `server.js`, logo antes do `app.listen`.
2. Abre `/equipamentos/2`. Regista o código, o título da página e o que o terminal mostra.
3. Abre o código-fonte da página e procura um caminho de uma pasta do teu computador. Para a evidência deste tema, regista que não há nenhum, e como o confirmaste.
4. O primeiro erro de propósito. Tira o `next` dos parâmetros do middleware de erro, para ficar `(erro, req, res)`. Guarda e abre `/equipamentos/2`. Prevê primeiro.

O que deves ver: a página do Express outra vez, com o stack trace. Com três parâmetros, o Express já não o reconhece como um middleware de erro.

5. Repõe o `next`. O segundo erro de propósito: muda o middleware de erro para cima das rotas, logo a seguir ao middleware de registo. Guarda e abre `/equipamentos/2`. Prevê primeiro, e regista o que aconteceu. Depois, repõe-no no fim.
6. Corrige o erro do modelo e confirma que a página do equipamento volta.
7. Agora um erro que nasce antes das rotas. Com o servidor ligado, noutro terminal, envia um corpo de 200 000 carateres com este comando:

   ```text
   node -e "fetch('http://localhost:3000/pedido/confirmacao', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'nome=' + 'a'.repeat(200000) }).then((resposta) => console.log(resposta.status))"
   ```

   O comando escreve o código da resposta. Regista-o, e o que o terminal do servidor mostra. Depois, no browser, abre `/equipamentos/%E0%A4%A` e regista o código e o título da página.

8. Para perceberes porque é que o middleware garante o `itensNoPedido`, apaga essa linha, guarda, e repete o comando do passo 7. Prevê primeiro: que código dá, e porquê? Repõe a linha.

## Parte 4: o que fica no terminal

Guia: secção "O que se escreve no terminal".

1. Olha para o terminal do servidor e identifica as duas fontes de registo: as linhas do middleware de registo e as do middleware de erro. Para uma falha da parte 3, escreve no caderno onde está o quando, o que pedido e o que falhou.
2. Uma experiência a não deixar ficar. Na rota da confirmação do pedido, logo no início, acrescenta `console.log(req.body);`. Faz um pedido e confirma-o com o teu nome.
3. Regista o que apareceu no terminal. Que dados pessoais estão lá, e quem os pode ler? Tira a linha.

## Parte 5: os segredos

Guia: secção "Os segredos" e exemplo guiado, passo 3.

1. Acrescenta a verificação do tamanho do segredo, a seguir à verificação de que ele existe.
2. Muda temporariamente o segredo no `.env` para `abc123`, e guarda. Prevê primeiro: o que faz o servidor? Regista a mensagem, e confirma que ela não mostra o segredo.
3. Repõe o segredo bom. Junta um equipamento ao pedido e confirma no menu que o pedido tem um.
4. Gera um segredo novo, troca-o no `.env` e guarda, para o `--watch` reiniciar. Recarrega a página do pedido. Prevê primeiro: o que aconteceu ao pedido, e o cookie ainda está no browser? Escreve no caderno porque é que isto é o que se quer quando um segredo foi revelado.

## Parte 6: o escaping em cada sítio

Guia: secção "O escaping depende do sítio".

1. A injeção guardada. Faz um pedido e confirma-o com o nome `<script>alert(1)</script>`. Abre a lista das reservas, e depois o código-fonte dela. Regista como o nome aparece no ecrã e como aparece no código-fonte. Para a evidência deste tema, regista que o HTML inserido foi apresentado como texto.
2. Agora o atributo sem aspas. No `views/pedido.ejs`, no campo do nome da confirmação, tira as aspas do `value`, para ficar `value=<%= valorNome %>`, e tira também o `maxlength="40"`. Guarda.
3. Junta um equipamento ao pedido. Na confirmação, escreve no nome exatamente `x autofocus onfocus=alert(1) aaaaaaaaaaaaaaa`, que tem mais de 40 carateres, e envia. Prevê primeiro.

O que deves ver: o pedido volta com a mensagem do nome comprido, e o browser mostra uma janela com "1". No código-fonte, o campo ficou `value=x autofocus onfocus=alert(1) aaaaaaaaaaaaaaa`: o espaço acabou o valor, e o `autofocus` e o `onfocus` passaram a ser atributos do campo, que correram um script quando o campo ganhou o foco. O `<%=` não mudou nada, porque o valor não tinha nenhum carácter de HTML.

4. Repõe as aspas, e só as aspas, e guarda. Recarrega a página do pedido, escreve outra vez o mesmo nome e envia. Confirma que agora o nome aparece no campo como texto, sem janela nenhuma. Só depois repõe o `maxlength="40"` e guarda. A ordem conta: com o `maxlength` reposto, o browser não te deixa escrever mais de 40 carateres, o nome cortado passa a ser válido, e o pedido é confirmado, em vez de voltar ao formulário.
5. Lê no guia as tabelas do `<script>` e do `href`, e escreve no caderno, numa frase cada, porque é que o escaping também não protege esses dois sítios.

## Parte 7: o token contra o CSRF

Guia: secção "O CSRF" e exemplo guiado, passo 4.

1. Acrescenta as três peças do passo 4: a função `prepararTokenCsrf` (com o `import` do `randomBytes`), a linha do `csrf` no middleware do `res.locals` e o middleware de verificação. Chama a função na rota `GET /pedido/item`.
2. Antes de mexeres nos modelos, tenta juntar um equipamento ao pedido. Prevê primeiro.

O que deves ver: "Pedido recusado", com o código 403. O servidor já exige o token, e o formulário ainda não o envia.

3. Acrescenta o campo escondido aos quatro formulários `POST`: o do `item-novo.ejs` e os três do `pedido.ejs`. Junta dois equipamentos, tira um e confirma o pedido: tudo funciona como antes.
4. Abre o formulário de juntar um equipamento e o seu código-fonte. Copia para o caderno os primeiros oito carateres do valor do campo `_csrf`, e o seu comprimento.
5. Nas ferramentas de programador, no separador "Elements" ("Elementos"; no Firefox, "Inspetor"), encontra o campo escondido do formulário e apaga o valor do `value` (faz duplo clique sobre ele). Envia o formulário. Regista o código e a página.
6. Junta um equipamento ao pedido. O pedido ficou vazio quando o confirmaste, no passo 3, e sem equipamentos a página do pedido não tem os botões de confirmar e de cancelar. Depois abre o pedido em dois separadores do mesmo browser. Num deles, confirma o pedido. No outro, que ficou aberto com a página antiga, carrega em "Cancelar o pedido". Prevê primeiro, e regista o que aconteceu e porquê.
7. Escreve no caderno, por palavras tuas, porque é que uma página de outro site não consegue pôr o token certo no formulário que esconde.

## Parte 8: a matriz de falhas e a revisão de um colega

Guia: secção "A matriz de falhas".

1. Copia para o caderno a matriz do guia, só com as colunas da falha e de como se provoca. Provoca cada falha no teu servidor e preenche as outras três colunas com o que viste, e não com o que o guia diz. Se alguma linha não der o mesmo que o guia, escreve a diferença: é aí que está o que tens de corrigir.
2. Acrescenta à matriz uma falha que o guia não tem, do teu servidor, com a forma de a provocar.
3. **Revisão de um colega.** Troca de computador com um colega. Escolhe três linhas da matriz dele, incluindo a que ele acrescentou, e reproduz cada uma no servidor dele, seguindo só o que ele escreveu na coluna "como se provoca". Para cada linha, regista se conseguiste reproduzir a falha e se o resultado foi o que ele escreveu. Uma linha que não se consegue reproduzir com o que lá está escrito não é evidência: devolve-a com a razão.
4. Volta às previsões da parte 1 e corrige a lápis o que previste mal.

## Problemas frequentes no laboratório

### Continua a aparecer a página do Express

O middleware de erro tem três parâmetros, ou está acima das rotas, ou a própria página de erro está a falhar. Se a página do Express falar do `erro.ejs`, falta a linha do `itensNoPedido`. Guia: "Erros frequentes".

### Todos os formulários dão "Pedido recusado"

Falta o campo escondido num formulário, o nome não é `_csrf`, ou a rota do formulário não chama a `prepararTokenCsrf`. Abre o código-fonte e procura o campo. Guia: "Erros frequentes".

### Na PowerShell, o NODE_ENV não desaparece

Uma variável definida com `$env:` fica até fechares esse terminal. Fecha-o e abre outro.

### O comando do fetch dá um erro de ligação

O servidor não está ligado, ou está noutra porta. Confirma no terminal do servidor o endereço onde está a correr.

### O servidor foi abaixo e não volta

O `--watch` só reinicia quando guardas um ficheiro. Lê a mensagem do terminal, corrige e guarda.

## O que fica no teu caderno

1. As previsões da parte 1, com as correções da parte 8.
2. O que a página do Express revela (parte 2), e a evidência da página de erro sem stack trace (parte 3).
3. Os dois erros do middleware de erro e as respostas ao 413 e ao endereço mal codificado (parte 3).
4. O `console.log(req.body)` e o que ele mostrou (parte 4).
5. A mensagem do segredo curto e o efeito da troca do segredo (parte 5).
6. A evidência do HTML inserido apresentado como texto, e o atributo sem aspas (parte 6).
7. As experiências do token (parte 7).
8. A matriz de falhas do teu servidor e a revisão do colega (parte 8).

O professor vai pedir-te que provoques, à frente dele, uma falha da tua matriz, e que expliques o que o utilizador vê, o que fica no terminal, e porquê.

![Rodapé](../imagens/rodape.png)
