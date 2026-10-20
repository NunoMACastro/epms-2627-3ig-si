![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: Erros e segurança web

Laboratório do sétimo tema do módulo Aplicações baseadas em browsers. Partes do teu catálogo com sessões do tema anterior. Provocas de propósito uma falha que ninguém previu e lês o que o Express mostra a quem a provoca. Substituis essa página por um middleware de erro teu. Olhas para o que o servidor escreve no terminal. Mexes no segredo. Vês o escaping a falhar num atributo sem aspas. Proteges os formulários contra o CSRF. E, no fim, fazes a matriz de falhas do teu servidor e verificas a de um colega.

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui. O [guia](07-erros-e-seguranca-web.md) tem a teoria completa, para saberes mais. Antes de cada experiência, escreve a previsão no caderno e confere-a com a resposta desta fase.

## O que vais construir

Vais continuar o catálogo numa pasta de trabalho própria. O destino é o exemplo completo deste tema, com as experiências descritas nas fases.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | Uma falha prevista do pedido tem uma resposta de recusa | Conferes a paragem 1 antes de continuar |
| 2 | Uma mensagem técnica ajuda quem corrige o servidor | Conferes a paragem 2 antes de continuar |
| 3 | O middleware de erro recebe quatro parâmetros | Conferes a paragem 3 antes de continuar |
| 4 | Um registo serve para reproduzir e corrigir falhas | Conferes a paragem 4 antes de continuar |
| 5 | Um segredo revelado tem de ser substituído | Conferes a paragem 5 antes de continuar |
| 6 | O escaping do HTML depende do contexto | Conferes a paragem 6 antes de continuar |
| 7 | O token é um código aleatório da sessão, incluído no formulário | Conferes a paragem 7 antes de continuar |
| 8 | A matriz junta casos reproduzíveis e resultados conferidos | Conferes a paragem 8 antes de continuar |

## Palavras que vais usar

- Middleware de erro: função com quatro parâmetros que o Express chama quando uma operação falha.
- Stack trace: lista das chamadas e linhas do código relacionadas com uma falha.
- Registo do servidor: informação escrita para quem mantém e corrige a aplicação.
- Escaping contextual: proteção que depende do sítio onde o valor entra na página.
- Injeção guardada: código perigoso guardado como dado e mostrado depois a outras pessoas.
- CSRF: pedido provocado por outro site que tenta aproveitar a sessão do browser.
- Token contra CSRF: código aleatório da sessão que o servidor exige nos formulários que mudam dados.
- Mesma origem: regra que impede uma página de outro site de ler as páginas do catálogo.
- Matriz de falhas: tabela que diz como provocar cada falha e conferir a resposta.

## O que precisas

- Node 24 LTS: executa JavaScript no servidor. Abre o terminal do editor e corre `node --version`; deve aparecer `v24` seguido da versão instalada.
- npm: instala os pacotes do projeto. Confirma com `npm --version`, que mostra a versão instalada.
- Um editor para criares e guardares os ficheiros. No VS Code, abre a pasta de trabalho com "Ficheiro > Abrir Pasta".
- Um browser com ferramentas de programador. Abre-as com F12 ou com o menu de ferramentas do browser.
- Uma pasta nova para a tua cópia do exemplo de partida indicado abaixo. Não trabalhes dentro da pasta distribuída.

## Se alguma coisa falhar

1. Confirma a pasta no terminal: `pwd` no macOS/Linux ou `Get-Location` na PowerShell. Nela devem existir `package.json` e `server.js`. Usa `cd` e o caminho da tua cópia para lá entrar.
2. Confirma que guardaste o ficheiro e que o browser mostra o endereço do teu servidor.
3. Lê a primeira mensagem do terminal antes de mudares código. Compara o resultado esperado, o obtido e uma hipótese para a causa.
4. Se a porta 3000 estiver ocupada, não pares outro processo. Na tua cópia, muda `PORTA` para 3100 e usa essa porta em todos os endereços deste laboratório.

## Preparar o projeto

Precisas do catálogo com sessões do laboratório do tema anterior, a funcionar, com o `.env` e o segredo. Se não o tiveres, copia a pasta [catalogo-com-sessoes](../exemplos/aplicacoes-em-browser/catalogo-com-sessoes/README.md) dos exemplos, corre `npm install`, cria o `.env` a partir do `.env.example` e gera um segredo com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Copia o resultado só para o teu `.env`.

Arranca o servidor com `node --watch --env-file=.env server.js`, e mantém o terminal à vista: neste laboratório, o terminal é tão importante como o browser.

## Fase 1: prever antes de programar

Uma falha prevista do pedido tem uma resposta de recusa. Uma falha inesperada do código precisa de ser corrigida no servidor.


Para cada situação, com o catálogo do fim do exemplo guiado, escreve no caderno: é uma falha do pedido ou do servidor? Que código? O que vê quem fez o pedido?

1. `GET /equipamentos/abc`
2. Um formulário de juntar ao pedido enviado sem o campo `_csrf`
3. Um modelo que tenta ler `equipamento.fabricante.nome`
4. Um `POST` com um corpo de 200 000 carateres
5. O servidor arrancado com o segredo `abc123`
6. `GET /equipamentos/%E0%A4%A`

No fim do laboratório, na parte 8, voltas a estas previsões.


### Respostas para conferires esta fase

| Situação | De quem | Código | O que vê quem pediu |
| --- | --- | --- | --- |
| `/equipamentos/abc` | Pedido | 400 | "Pedido inválido" |
| Formulário sem `_csrf` | Pedido | 403 | "Pedido recusado" |
| `equipamento.fabricante.nome` | Servidor | 500 | "Erro no servidor" |
| Corpo de 200 000 carateres | Pedido | 413 | "Pedido recusado" |
| Segredo `abc123` | Servidor (configuração) | nenhum: não arranca | nada, o servidor não está ligado |
| `/equipamentos/%E0%A4%A` | Pedido | 400 | "Pedido recusado" |

As previsões mais erradas: o 413 e o endereço mal codificado como 500 (parecem "erros estranhos", e são falhas do pedido). O segredo curto como "arranca, e falha depois".

### Paragem 1

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 2: a página de erro do Express

Uma mensagem técnica ajuda quem corrige o servidor. A mesma mensagem pode revelar informação a quem só usa a aplicação.


1. No `views/equipamento.ejs`, muda a linha do número para mostrar também o fabricante, que os equipamentos não têm: `<p>Número: <%= equipamento.id %>, de <%= equipamento.fabricante.nome %></p>`. Guarda.
2. Abre `/equipamentos/2`. Prevê primeiro.

O que deves ver: uma página com o código 500, o `TypeError`, a mensagem `Cannot read properties of undefined (reading 'nome')` e o stack trace, com os caminhos das pastas do teu computador.

3. Copia para o caderno três coisas que esta página revela sobre o teu servidor e que um desconhecido não devia saber. Confirma no terminal que o mesmo erro lá está.
4. Para o servidor e arranca-o assim, em modo de produção: no macOS e no Linux, `NODE_ENV=production node --env-file=.env server.js`; na PowerShell do Windows, primeiro `$env:NODE_ENV="production"` e depois `node --env-file=.env server.js`. Abre outra vez `/equipamentos/2`. O que mudou? Repara também no terminal: há um aviso novo, do tema anterior.
5. Para o servidor e volta a arrancá-lo como antes, sem o modo de produção (na PowerShell, fecha o terminal e abre outro). Deixa o erro no modelo: vais precisar dele na parte seguinte.


### Respostas para conferires esta fase

O que a página revela, para o passo 3: o caminho das pastas do projeto, com o nome da conta do utilizador do computador. O nome e a linha do ficheiro do modelo. Que o servidor usa o EJS e o Express (a `node_modules` aparece nos caminhos, com o nome de cada ficheiro e a linha. A versão não aparece). E um bocado do modelo, com as linhas à volta da que falhou. Compara as três coisas que registaste com estes exemplos.

Em modo de produção: "Internal Server Error", sem pormenores, e o aviso do `MemoryStore` no terminal. Porque não basta pôr `NODE_ENV=production`? A resposta: depende de alguém se lembrar. A página continua sem o catálogo, em inglês, e sem dizer o que fazer.

### Paragem 2

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 3: o middleware de erro

O middleware de erro recebe quatro parâmetros. Fica depois do código que pode falhar e responde sem detalhes internos.


1. Acrescenta o middleware de erro da referência de código desta fase, com as três partes, no fim do `server.js`, logo antes do `app.listen`.
2. Abre `/equipamentos/2`. Regista o código, o título da página e o que o terminal mostra.
3. Abre o código-fonte da página e procura um caminho de uma pasta do teu computador. Para a evidência deste tema, regista que não há nenhum, e como o confirmaste.
4. O primeiro erro de propósito. Tira o `next` dos parâmetros do middleware de erro, para ficar `(erro, req, res)`. Guarda e abre `/equipamentos/2`. Prevê primeiro.

O que deves ver: a página do Express outra vez, com o stack trace. Com três parâmetros, o Express já não o reconhece como um middleware de erro.

5. Repõe o `next`. O segundo erro de propósito: muda o middleware de erro para cima das rotas, logo a seguir ao middleware de registo. Guarda e abre `/equipamentos/2`. Prevê primeiro, e regista o que aconteceu. Depois, repõe-no no fim.
6. Corrige o erro do modelo e confirma que a página do equipamento volta.
7. Agora um erro que nasce antes das rotas. Com o servidor ligado, noutro terminal, envia um corpo de 200 000 carateres com este comando:

   ```bash
   node -e "fetch('http://localhost:3000/pedido/confirmacao', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'nome=' + 'a'.repeat(200000) }).then((resposta) => console.log(resposta.status))"
   ```

   O comando escreve o código da resposta. Regista-o, e o que o terminal do servidor mostra. Depois, no browser, abre `/equipamentos/%E0%A4%A` e regista o código e o título da página.

8. Para perceberes porque é que o middleware garante o `itensNoPedido`, apaga essa linha, guarda, e repete o comando da referência de código desta fase. Prevê primeiro: que código dá, e porquê? Repõe a linha.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

O Express tem um tipo especial de middleware, só para erros. Distingue-se dos outros por uma única coisa: tem **quatro parâmetros**, e o primeiro é o erro.

```js fragment
// Middleware de erro: tem quatro parâmetros, e o Express só o chama quando
// uma rota, um middleware ou um modelo falham. Regista o erro completo no
// terminal, para quem o vai corrigir, e mostra ao utilizador uma página que
// não revela nada do servidor. Fica depois de tudo, como o middleware final.
app.use((erro, req, res, next) => {
  console.error(`${new Date().toISOString()} ERRO ${req.method} ${req.url}`);
  console.error(erro.stack);

  // A página de erro inclui o cabeçalho, que usa o itensNoPedido. Se a falha
  // aconteceu antes do middleware que o prepara, ele ainda não existe.
  res.locals.itensNoPedido = res.locals.itensNoPedido || 0;

  // Alguns erros já trazem um código 4xx: o express.urlencoded dá o 413 a um
  // corpo grande demais. Esses são falhas do pedido; tudo o resto é um 500.
  if (erro.status >= 400 && erro.status < 500) {
    res.status(erro.status).render("erro", {
      titulo: "Pedido recusado",
      mensagem: "O servidor não conseguiu tratar este pedido. Volta à página anterior e tenta outra vez.",
    });
    return;
  }
  res.status(500).render("erro", {
    titulo: "Erro no servidor",
    mensagem: "Alguma coisa correu mal do nosso lado. Tenta outra vez daqui a pouco.",
  });
});
```

Quando uma rota, um middleware ou um modelo falham, o Express deixa de correr as rotas e os middlewares normais. Salta para o primeiro middleware de erro seguinte. Passa-lhe o erro no primeiro parâmetro. No Express 5, isto acontece com um erro numa rota normal, com um erro numa rota `async` e com um erro num modelo EJS. Não é preciso fazer nada para o apanhar.

O middleware faz as duas coisas da regra. Escreve no terminal a data, o pedido e o `erro.stack`, que tem a mensagem e o stack trace: é para quem mantém o servidor. E responde com o código 500 e a página de erro do catálogo, com uma frase geral: é para quem fez o pedido. Repara que a página não usa o `erro.message`. A mensagem de um erro inesperado é escrita para programadores, pode ter caminhos, nomes de variáveis ou pedaços de dados. Não ajuda em nada quem está a usar o catálogo.

O middleware tem mais duas partes. E as duas apareceram ao experimentar, o que diz muito sobre este tipo de código. A primeira garante o `itensNoPedido`. A página de erro inclui o cabeçalho. E o cabeçalho usa o `itensNoPedido`, que um middleware põe no `res.locals`. Mas um erro pode acontecer antes desse middleware, por exemplo no `express.urlencoded`, quando o corpo de um pedido é grande demais. Nesse caso, o `itensNoPedido` ainda não existe, a página de erro falha a construir-se. E o Express responde com a sua própria página, com o stack trace. Uma página de erro tem de funcionar mesmo quando tudo o resto falhou. Por isso o middleware garante o valor de que ela precisa: `res.locals.itensNoPedido || 0` fica com o valor que lá estiver, ou com 0 se não houver nenhum.

A segunda respeita o código de alguns erros. Nem todos os erros que chegam ao middleware são falhas do servidor. O `express.urlencoded` recusa um corpo com mais de 100 kilobytes com um erro que traz a propriedade `status` com o valor 413. O Express recusa um endereço com um código mal escrito, como `%E0%A4%A`, com um erro que traz o 400. Estes erros são falhas do pedido. E responder-lhes com o 500 seria dizer que o servidor falhou quando não falhou. Por isso, se o erro trouxer um código 4xx, a resposta usa esse código e uma página "Pedido recusado". Tudo o resto é um 500.

Três regras, e a primeira apanha toda a gente:

- **São quatro parâmetros, mesmo que não uses o `next`.** O Express conta os parâmetros da função para saber se é um middleware de erro. Com três, `(erro, req, res)`, é um middleware normal, que nunca recebe os erros, e a página do Express, com o stack trace, volta a aparecer.
- **Fica no fim do ficheiro**, depois de todas as rotas e do middleware final do 404, logo antes do `app.listen`. Um erro salta para o primeiro middleware de erro que estiver **abaixo** do sítio onde aconteceu; um middleware de erro acima das rotas nunca recebe os erros delas.
- **Não substitui o `return`.** O caso do tema 4, a página de erro sem `return` depois, continua a deitar o servidor abaixo, mesmo com o middleware de erro. O erro `Cannot set headers` acontece depois de a resposta ter saído, fora do caminho normal do Express, e não chega a nenhum middleware. O `return` continua obrigatório.

### Respostas para conferires esta fase

- **Passo 2.** 500, "Erro no servidor"; no terminal, a linha com a data, `ERRO GET /equipamentos/2`, e o stack trace do `TypeError`.
- **Passo 3.** Nenhum caminho no código-fonte. A forma de o confirmar é procurar, no código-fonte, o nome de uma pasta do computador ou a palavra `node_modules`.
- **Passo 4.** Com três parâmetros: a página do Express, com o stack trace.
- **Passo 5.** Acima das rotas: a página do Express, com o stack trace. O erro salta para o primeiro middleware de erro **abaixo** do sítio onde aconteceu, e não há nenhum.
- **Passo 7.** O `fetch` escreve `413`; o terminal do servidor mostra a linha do erro com `PayloadTooLargeError: request entity too large`. O endereço mal codificado dá 400 e "Pedido recusado", com `URIError: Failed to decode param` no terminal.
- **Passo 8.** Sem a linha do `itensNoPedido`: o `fetch` escreve `413`. E a resposta é a página do Express, com o stack trace e `itensNoPedido is not defined` no `erro.ejs`. O código continua a ser o 413 porque o middleware de erro já o tinha escolhido com o `res.status` antes de a página falhar. O Express mantém-no. O que muda é a página, que deixa de ser a do catálogo e volta a revelar o servidor. Quem previr 500 está a pensar na versão sem a parte dos 4xx, que é a história contada no guia. A explicação que se quer: o erro nasce no `express.urlencoded`, antes do middleware que põe o `itensNoPedido`. A página de erro inclui o cabeçalho, que o usa. A página de erro falha. E o Express responde com a sua. Uma página de erro tem de funcionar quando tudo o resto falhou.

### Paragem 3

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 4: o que fica no terminal

Um registo serve para reproduzir e corrigir falhas. Dados pessoais, segredos e cookies devem ficar fora dele.


1. Olha para o terminal do servidor e identifica as duas fontes de registo: as linhas do middleware de registo e as do middleware de erro. Para uma falha da parte 3, escreve no caderno onde está o quando, o que pedido e o que falhou.
2. Uma experiência a não deixar ficar. Na rota da confirmação do pedido, logo no início, acrescenta `console.log(req.body);`. Faz um pedido e confirma-o com o teu nome.
3. Regista o que apareceu no terminal. Que dados pessoais estão lá, e quem os pode ler? Tira a linha.


### Respostas para conferires esta fase

- **Passo 1.** O quando é a data no início da linha do middleware de erro. O pedido, o método e o endereço a seguir; o que falhou, o stack trace. O middleware de registo só tem o pedido.
- **Passo 3.** O `console.log(req.body)` mostra `{ nome: '...' }`, com o nome de quem confirmou o pedido. É um dado pessoal escrito no registo. Quem aceder ao terminal ou aos ficheiros de registo poderá lê-lo. Nesta altura o formulário ainda não tem o campo `_csrf`, que só entra na parte 7. Se a experiência for repetida no fim, o registo mostra também o token da sessão, que é outra coisa que não pode lá ficar. A resposta: o registo não é um sítio seguro. E o que lá vai fica.

### Paragem 4

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 5: os segredos

Um segredo revelado tem de ser substituído. O ficheiro de ambiente é lido no arranque do processo.


1. Acrescenta a verificação do tamanho do segredo, a seguir à verificação de que ele existe.
2. Muda temporariamente o segredo no `.env` para `abc123` e guarda. Para o processo com Ctrl+C e arranca outra vez com `node --watch --env-file=.env server.js`. Prevê primeiro: o que faz o servidor? Regista a mensagem, e confirma que ela não mostra o segredo.
3. Repõe o segredo bom e reinicia com Ctrl+C e `node --watch --env-file=.env server.js`. Junta um equipamento ao pedido e confirma no menu que o pedido tem um.
4. Gera um segredo novo, troca-o no `.env` e guarda. Para garantir que o processo relê o `.env`, para com Ctrl+C e arranca outra vez com `node --watch --env-file=.env server.js`. Recarrega a página do pedido. Prevê primeiro: o que aconteceu ao pedido, e o cookie ainda está no browser? Escreve no caderno porque é que isto é o que se quer quando um segredo foi revelado.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

Do tema anterior, o segredo da sessão vive no `.env`, que não vai para o Git, e o servidor recusa-se a arrancar sem ele. Este tema acrescenta uma verificação e uma regra.

A verificação é o tamanho. Um segredo curto, como `teste` ou `123456`, adivinha-se, e quem o adivinhar assina os identificadores de sessão que quiser. O servidor recusa um segredo com menos de 32 carateres, com uma mensagem que diz o tamanho, e não o segredo:

```js fragment
// Um segredo curto adivinha-se. A mensagem não mostra o segredo: só o tamanho.
if (SEGREDO.length < 32) {
  console.error(`O SESSION_SECRET tem ${SEGREDO.length} carateres; tem de ter pelo menos 32.`);
  process.exit(1);
}
```

A regra é o que fazer quando um segredo é revelado: se foi para o Git, se apareceu num registo, se alguém o viu no teu ecrã. A resposta é sempre trocá-lo por um novo. Não chega apagá-lo do sítio onde apareceu. Isto acontece porque não sabes quem o viu. Trocar o segredo da sessão tem uma consequência que vais ver no laboratório: todas as sessões em curso deixam de valer. Isto acontece porque os identificadores foram assinados com o segredo antigo e já não batem certo. É o preço. E é o que se quer: quem tivesse roubado um identificador também o perde.

### Respostas para conferires esta fase

- **Passo 2.** `O SESSION_SECRET tem 6 carateres; tem de ter pelo menos 32.`, e o servidor não arranca. A mensagem diz o tamanho e não o segredo.
- **Passo 4.** O pedido desaparece. E o cookie continua no browser. O identificador foi assinado com o segredo antigo, a assinatura deixa de bater certo. E o servidor trata o browser como novo. É o que se quer quando um segredo foi revelado: quem tivesse roubado um identificador perde-o também. Uma nota para quem perguntar: neste catálogo, com as sessões na memória, o reinício sozinho já esvaziava o pedido (é a parte 7 do tema anterior). A experiência não separa as duas causas. O que a troca do segredo acrescenta é que os identificadores antigos deixariam de valer mesmo com as sessões guardadas numa base de dados. Isto acontece porque a assinatura deixa de bater certo.

### Paragem 5

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 6: o escaping em cada sítio

O escaping do HTML depende do contexto. Valores só entram no conteúdo ou em atributos com aspas.


1. A injeção guardada. Faz um pedido e confirma-o com o nome `<script>alert(1)</script>`. Abre a lista das reservas, e depois o código-fonte dela. Regista como o nome aparece no ecrã e como aparece no código-fonte. Para a evidência deste tema, regista que o HTML inserido foi apresentado como texto.
2. Agora o atributo sem aspas. No `views/pedido.ejs`, no campo do nome da confirmação, tira as aspas do `value`, para ficar `value=<%= valorNome %>`, e tira também o `maxlength="40"`. Guarda.
3. Junta um equipamento ao pedido. Na confirmação, escreve no nome exatamente `x autofocus onfocus=alert(1) aaaaaaaaaaaaaaa`, que tem mais de 40 carateres, e envia. Prevê primeiro.

O que deves ver: o pedido volta com a mensagem do nome comprido. E o browser mostra uma janela com "1". No código-fonte, o campo ficou `value=x autofocus onfocus=alert(1) aaaaaaaaaaaaaaa`: o espaço acabou o valor. O `autofocus` e o `onfocus` passaram a ser atributos do campo, que correram um script quando o campo ganhou o foco. O `<%=` não mudou nada. Isto acontece porque o valor não tinha nenhum carácter de HTML.

4. Repõe as aspas. E só as aspas. E guarda. Recarrega a página do pedido, escreve outra vez o mesmo nome e envia. Confirma que agora o nome aparece no campo como texto, sem janela nenhuma. Só depois repõe o `maxlength="40"` e guarda. A ordem conta: com o `maxlength` reposto, o browser não te deixa escrever mais de 40 carateres, o nome cortado passa a ser válido. O pedido é confirmado, em vez de voltar ao formulário.
5. Lê nesta fase as tabelas do `<script>` e do `href`, e escreve no caderno, numa frase cada, porque é que o escaping também não protege esses dois sítios.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

No tema 4, o escaping do `<%=` protegia dois sítios: o conteúdo de uma etiqueta, como `<p><%= mensagem %></p>`. E o valor de um atributo **entre aspas**, como `value="<%= nome %>"`. O guia avisava que havia sítios onde não chegava. Este tema mostra quais. Isto acontece porque cada sítio de uma página tem os seus carateres perigosos. O escaping do `<%=` só trata os do HTML: o `<`, o `>`, o `&`, as aspas e o apóstrofo.

Com o valor `x autofocus onfocus=alert(1)`, que não tem nenhum destes carateres:

| Onde está o valor | O modelo | O que o browser recebe | Resultado |
| --- | --- | --- | --- |
| Conteúdo ou atributo com aspas | `<input value="<%= v %>">` | `<input value="x autofocus onfocus=alert(1)">` | Seguro: é tudo o valor do atributo |
| Atributo sem aspas | `<input value=<%= v %>>` | `<input value=x autofocus onfocus=alert(1)>` | Perigoso: o espaço acaba o valor, e o resto são atributos novos; o `onfocus` corre um script quando o campo ganha o foco |

O escaping não mudou nada, porque não havia nada para mudar. Sem as aspas, o fim do valor é marcado por um espaço, e o espaço não é escapado. Por isso, **os atributos levam sempre aspas**.

Dentro de um `<script>`, o problema é o mesmo, noutra língua. Com o valor `1;alert(1)`:

| O modelo | O que o browser recebe | Resultado |
| --- | --- | --- |
| `<script>const tempo = <%= v %>;</script>` | `<script>const tempo = 1;alert(1);</script>` | O valor virou código JavaScript, que corre |
| `<script>const nome = "<%= v %>";</script>`, com `Ana" + alert(1) + "` | `<script>const nome = "Ana&#34; + alert(1) + &#34;";</script>` | Não corre, mas o nome fica com `&#34;` escrito, porque dentro de um script o browser não desfaz os códigos do HTML |

O escaping do HTML protege mal e estraga os dados. A regra é **não pôr valores dentro de scripts**. O catálogo não tem scripts, e é a forma mais simples de cumprir a regra.

Nos endereços, o perigo é outro. Um `href` com um endereço escrito por alguém, como `<a href="<%= site %>">`, recebe tal e qual o valor `javascript:alert(1)`, que não tem nenhum carácter de HTML. Quando alguém carregar na ligação, o browser corre o script, em vez de abrir uma página. O escaping não ajuda; o que ajuda é a validação, do tema 5: um endereço que vem de fora só se aceita se começar por `https://` ou `http://`. O catálogo não guarda endereços de ninguém, mas uma aplicação com o "site do fornecedor" teria de o fazer.

O que fica é uma regra curta. Os valores só entram em dois sítios: no conteúdo de uma etiqueta e no valor de um atributo entre aspas, sempre com `<%=`. Em mais nenhum. E é exatamente isto que a evidência deste tema pede: um valor com HTML, inserido por alguém, apresentado como texto.

Há ainda um caso que convém ver com estes olhos. O nome que alguém escreve ao confirmar um pedido aparece na lista das reservas, que **toda a gente** vê. Se esse nome entrasse sem escaping, um script escrito por uma pessoa correria no browser de todas as outras que abrissem a lista, e não só no seu. A esta variante chama-se injeção guardada, e é a mais grave, porque não precisa de enganar ninguém para clicar numa ligação: basta abrir a lista. No catálogo, o nome entra com `<%=`, e um `<script>` escrito no nome aparece na lista como texto.

### Respostas para conferires esta fase

- **Passo 1.** No ecrã, `<script>alert(1)</script>` escrito como texto; no código-fonte, `&lt;script&gt;alert(1)&lt;/script&gt;`. É a confirmação pedida nesta fase.
- **Passo 3.** O pedido volta com 400 e a mensagem do nome comprido (44 carateres); no código-fonte, `value=x autofocus onfocus=alert(1) aaaaaaaaaaaaaaa`. O browser põe o foco no campo e corre o `alert`. Não foi visto num browser; o HTML foi confirmado.
- **Passo 4.** Só com as aspas repostas, o mesmo nome volta com 400 e aparece no campo como texto: `value="x autofocus onfocus=alert(1) aaaaaaaaaaaaaaa"`, sem janela nenhuma. O `maxlength` repõe-se só depois. Com `maxlength`, o browser só deixa escrever 40 carateres. O nome cortado é válido. O pedido é confirmado com um 303 para a lista das reservas, em vez de voltar ao formulário. Se um aluno repuser os dois ao mesmo tempo, é isto que vê. O nome aparece na lista como texto, o que também mostra o escaping. Mas não o campo.
- **Passo 5.** O `<script>`: os carateres perigosos de JavaScript (o `;`, os parênteses) não são escapados, e dentro de um script com aspas o escaping estraga os dados. O `href`: o `javascript:` não tem carateres de HTML, passa intacto, e só a validação o trava.

### Paragem 6

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 7: o token contra o CSRF

O token é um código aleatório da sessão, incluído no formulário. Um `POST` só prossegue se apresentar o mesmo código.


1. Acrescenta as três peças apresentadas nesta fase. São a função `prepararTokenCsrf`, a linha do `csrf` no middleware do `res.locals` e o middleware de verificação. A função precisa do `import` de `randomBytes`. Chama a função na rota `GET /pedido/item`.
2. Antes de mexeres nos modelos, tenta juntar um equipamento ao pedido. Prevê primeiro.

O que deves ver: "Pedido recusado", com o código 403. O servidor já exige o token, e o formulário ainda não o envia.

3. Acrescenta o campo escondido aos quatro formulários `POST`: o do `item-novo.ejs` e os três do `pedido.ejs`. Junta dois equipamentos, tira um e confirma o pedido: tudo funciona como antes.
4. Abre o formulário de juntar um equipamento e o seu código-fonte. Copia para o caderno os primeiros oito carateres do valor do campo `_csrf`, e o seu comprimento.
5. Nas ferramentas de programador, no separador "Elements" ("Elementos"; no Firefox, "Inspetor"), encontra o campo escondido do formulário e apaga o valor do `value` (faz duplo clique sobre ele). Envia o formulário. Regista o código e a página.
6. Junta um equipamento ao pedido. O pedido ficou vazio quando o confirmaste, no passo 3, e sem equipamentos a página do pedido não tem os botões de confirmar e de cancelar. Depois abre o pedido em dois separadores do mesmo browser. Num deles, confirma o pedido. No outro, que ficou aberto com a página antiga, carrega em "Cancelar o pedido". Prevê primeiro, e regista o que aconteceu e porquê.
7. Escreve no caderno, por palavras tuas, porque é que uma página de outro site não consegue pôr o token certo no formulário que esconde.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

O tema 6 deixou dito que o `SameSite=Lax` é uma primeira defesa contra o CSRF. É altura de ver o ataque e a defesa completa.

**CSRF** quer dizer cross-site request forgery, falsificação de um pedido entre sites. O ataque aproveita uma regra do tema anterior: o browser envia o cookie de um site em todos os pedidos a esse site, sem perguntar a ninguém. Imagina que a professora tem um pedido em curso no catálogo e, noutro separador, abre uma página de outro site, feita por alguém mal-intencionado. Essa página tem um formulário escondido, que envia sozinho um `POST` para `http://localhost:3000/pedido/cancelamento`. O pedido sai do browser da professora, e se o browser lhe juntar o cookie da sessão do catálogo, o servidor vê um pedido de cancelamento vindo da sessão dela. Para o servidor, foi a professora que cancelou. Ela nem soube.

O `SameSite=Lax` do tema 6 trava este ataque nos browsers atuais: um `POST` que vem de outro site não leva o cookie. O servidor vê um browser sem sessão. Mas não chega, por três razões. Há browsers antigos que não respeitam o `SameSite`. O `Lax` deixa passar o cookie numa navegação normal por `GET`, como carregar numa ligação, e por isso uma rota que mudasse alguma coisa com um `GET` ficava desprotegida. E uma mudança na configuração do cookie, feita por quem não conhece a razão, tira a proteção sem ninguém dar por isso. A planificação e o documento da stack dizem o mesmo: o `SameSite` não substitui toda a análise.

A defesa completa é um **token contra o CSRF**: um código aleatório, um por sessão, guardado na sessão e escrito em cada formulário que muda alguma coisa, num campo escondido. Quando o formulário é enviado, o token vai no corpo, e o servidor compara-o com o da sessão. Se não bater certo, ou não vier, o pedido é recusado com o 403.

O ataque falha porque a página do atacante não consegue saber o token. O token está escrito nas páginas do catálogo. E o browser não deixa uma página de outro site ler o conteúdo das páginas do catálogo: é a regra da mesma origem, que os browsers aplicam a tudo. O atacante consegue fazer o browser *enviar* um pedido. Mas não consegue *ler* as respostas. E por isso não sabe o que pôr no campo escondido.

No catálogo, a defesa tem três peças. Uma função cria o token, quando a sessão ainda não o tem, e põe-no no `res.locals`:

```js fragment
/**
 * Garante que a sessão tem um token contra o CSRF, e põe-no à disposição dos
 * modelos. O token é um código aleatório, um por sessão, que os formulários
 * enviam num campo escondido; uma página de outro site não o conhece.
 * @param {object} req o pedido
 * @param {object} res a resposta
 */
function prepararTokenCsrf(req, res) {
  if (!req.session.csrf) {
    req.session.csrf = randomBytes(32).toString("hex");
  }
  res.locals.csrf = req.session.csrf;
}
```

O `randomBytes(32)` do `node:crypto` dá 32 bytes aleatórios, e o `toString("hex")` escreve-os como 64 carateres de `0` a `9` e de `a` a `f`. É a mesma receita do comando que gera o `SESSION_SECRET`. A rota do formulário que junta um equipamento ao pedido, que é o primeiro formulário que muda a sessão, chama a função antes de mostrar a página:

```js fragment
// O formulário para juntar um equipamento ao pedido. É aqui que a sessão
// recebe o token contra o CSRF, porque é o primeiro formulário que a muda.
app.get("/pedido/item", (req, res) => {
  prepararTokenCsrf(req, res);
  res.render("item-novo", {
    titulo: "Juntar ao pedido",
    equipamentos: equipamentos,
    valores: { equipamento_id: "", data: "", tempo: "" },
    erros: {},
  });
});
```

Daqui vem uma mudança em relação ao tema anterior: o cookie da sessão passa a aparecer quando se abre este formulário. Não só quando se junta o primeiro equipamento. A sessão tem de existir para guardar o token que o formulário vai levar. Quem só vê o catálogo continua sem cookie.

A segunda peça põe o token, quando existe, à disposição de todas as páginas, no mesmo middleware que já punha o número de equipamentos do pedido:

```js fragment
// Para todas as páginas: quantos equipamentos tem o pedido desta sessão, e o
// token contra o CSRF, se a sessão já o tiver. O res.locals põe os dois à
// disposição de todos os modelos.
app.use((req, res, next) => {
  const pedido = req.session.pedido;
  res.locals.itensNoPedido = pedido ? pedido.length : 0;
  res.locals.csrf = req.session.csrf || "";
  next();
});
```

E cada formulário `POST` leva o campo escondido, com o token:

```ejs
<input type="hidden" name="_csrf" value="<%= csrf %>">
```

A terceira peça é a verificação, num middleware que corre antes de todas as rotas e só faz alguma coisa nos pedidos `POST`:

```js fragment
// Proteção contra o CSRF: todos os pedidos POST têm de trazer, no campo
// escondido _csrf, o token desta sessão. Sem ele, ou com outro, recusa-se.
app.use((req, res, next) => {
  if (req.method !== "POST") {
    next();
    return;
  }
  const token = req.session.csrf;
  if (!token || req.body._csrf !== token) {
    res.status(403).render("erro", {
      titulo: "Pedido recusado",
      mensagem: "Este formulário já não é válido. Volta à página do formulário, recarrega-a e tenta outra vez.",
    });
    return;
  }
  next();
});
```

Por estar num middleware geral, e não em cada rota, nenhum formulário novo fica desprotegido por esquecimento: um `POST` sem o token é recusado, venha para onde vier. Fica depois do `express.urlencoded`, porque lê o `req.body`, e depois da sessão, porque lê o `req.session`. Quando a sessão termina, o token vai com ela, e um formulário antigo, de uma página que ficou aberta, é recusado; a mensagem diz o que fazer.

Repara numa consequência para as rotas: **nada que mude dados se faz com `GET`**. Um `GET` não leva token, e uma ligação de outro site leva o cookie. O catálogo cumpre-o desde o tema 5: juntar, tirar, confirmar e cancelar são todos `POST`.

O `import { randomBytes } from "node:crypto";` no início do ficheiro, a função `prepararTokenCsrf` ao lado das outras funções, a linha do `csrf` no middleware do `res.locals`, o middleware de verificação logo a seguir. A chamada à função na rota `GET /pedido/item`. Nos modelos, o campo escondido entra nos quatro formulários `POST`: o de juntar um equipamento, em `item-novo.ejs`. Os três da página do pedido, em `pedido.ejs` (o de cada botão de remoção, o da confirmação e o do cancelamento). Os dois modelos, completos:

```ejs
<%# O formulário para juntar um equipamento ao pedido. Recebe o titulo,
    os equipamentos para a lista, os valores a pôr nos campos e os erros,
    um por campo. O nome só se pede no fim, ao confirmar o pedido. O campo
    escondido _csrf leva o token da sessão. %>
<%- include("partials/cabecalho") %>
    <% if (Object.keys(erros).length > 0) { %>
      <p><strong>O equipamento não foi juntado ao pedido. Corrige os campos assinalados e volta a enviar.</strong></p>
    <% } %>
    <form method="post" action="/pedido/itens">
      <input type="hidden" name="_csrf" value="<%= csrf %>">
      <p>
        <label for="equipamento_id">Equipamento
          <% if (erros.equipamento_id) { %><strong><%= erros.equipamento_id %></strong><% } %>
        </label>
        <select id="equipamento_id" name="equipamento_id" required>
          <option value="">Escolhe um equipamento</option>
          <% for (const equipamento of equipamentos) { %>
            <option value="<%= equipamento.id %>" <% if (String(equipamento.id) === valores.equipamento_id) { %>selected<% } %>><%= equipamento.nome %>, sala <%= equipamento.sala %></option>
          <% } %>
        </select>
      </p>
      <p>
        <label for="data">Dia
          <% if (erros.data) { %><strong><%= erros.data %></strong><% } %>
        </label>
        <input id="data" name="data" type="date" value="<%= valores.data %>" required>
      </p>
      <p>
        <label for="tempo">Tempo letivo, de 1 a 9
          <% if (erros.tempo) { %><strong><%= erros.tempo %></strong><% } %>
        </label>
        <input id="tempo" name="tempo" type="number" min="1" max="9" value="<%= valores.tempo %>" required>
      </p>
      <button type="submit">Juntar ao pedido</button>
    </form>
    <p><a href="/pedido">Voltar ao pedido</a></p>
<%- include("partials/rodape") %>
```

```ejs
<%# O pedido em curso, guardado na sessão. Recebe o titulo, as linhas (cada
    uma com o item e o equipamento), e o nome e o erro do formulário de
    confirmação, vazios da primeira vez. Cada formulário leva, no campo
    escondido _csrf, o token da sessão. %>
<%- include("partials/cabecalho") %>
    <% if (linhas.length === 0) { %>
      <p>O teu pedido está vazio.</p>
    <% } else { %>
      <ol>
        <% for (let i = 0; i < linhas.length; i++) { %>
          <li>
            <%= linhas[i].equipamento.nome %>, sala <%= linhas[i].equipamento.sala %>: dia <%= linhas[i].item.data %>, tempo <%= linhas[i].item.tempo %>
            <form method="post" action="/pedido/itens/<%= i + 1 %>/remocao">
              <input type="hidden" name="_csrf" value="<%= csrf %>">
              <button type="submit">Tirar do pedido</button>
            </form>
          </li>
        <% } %>
      </ol>
    <% } %>
    <p><a href="/pedido/item">Juntar um equipamento ao pedido</a></p>
    <% if (linhas.length > 0) { %>
      <h2>Confirmar o pedido</h2>
      <form method="post" action="/pedido/confirmacao">
        <input type="hidden" name="_csrf" value="<%= csrf %>">
        <p>
          <label for="nome">O teu nome
            <% if (erroNome) { %><strong><%= erroNome %></strong><% } %>
          </label>
          <input id="nome" name="nome" maxlength="40" value="<%= valorNome %>" required>
        </p>
        <button type="submit">Confirmar o pedido</button>
      </form>
      <h2>Cancelar o pedido</h2>
      <form method="post" action="/pedido/cancelamento">
        <input type="hidden" name="_csrf" value="<%= csrf %>">
        <button type="submit">Cancelar o pedido</button>
      </form>
    <% } %>
<%- include("partials/rodape") %>
```

O formulário de pesquisa da página inicial não leva token: envia por `GET`, e não muda nada.

### Respostas para conferires esta fase

- **Passo 2.** "Pedido recusado", 403. Erro a esperar, que convém antecipar: quem acrescentar a verificação e testar logo o formulário acha que estragou tudo. É o passo pensado para isso.
- **Passo 4.** 64 carateres, de `0` a `9` e de `a` a `f`.
- **Passo 5.** 403, "Pedido recusado".
- **Passo 6.** Primeiro, juntar um equipamento: depois da confirmação do passo 3, o pedido está vazio. A página do pedido não tem os formulários de confirmar e de cancelar. Com o equipamento juntado, o separador antigo dá "Pedido recusado", com o 403: a confirmação destruiu a sessão, e o token foi com ela. A mensagem da página diz o que fazer.
- **Passo 7.** A resposta: o token está escrito nas páginas do catálogo. O browser não deixa uma página de outro site ler as páginas do catálogo (a regra da mesma origem). O atacante consegue fazer o browser enviar o pedido. Mas não sabe o que pôr no campo escondido.

### Paragem 7

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 8: a matriz de falhas e a revisão de um colega

A matriz junta casos reproduzíveis e resultados conferidos. Outra pessoa deve conseguir repetir cada linha.


1. Copia para o caderno a matriz da referência de código desta fase, só com as colunas da falha e de como se provoca. Provoca cada falha no teu servidor e preenche as outras três colunas com o que viste, e não com o que o guia diz. Se alguma linha não der o mesmo que o guia, escreve a diferença: é aí que está o que tens de corrigir.
2. Acrescenta à matriz uma falha que o guia não tem, do teu servidor, com a forma de a provocar.
3. **Revisão de um colega.** Troca de computador com um colega. Escolhe três linhas da matriz dele, incluindo a que ele acrescentou, e reproduz cada uma no servidor dele, seguindo só o que ele escreveu na coluna "como se provoca". Para cada linha, regista se conseguiste reproduzir a falha e se o resultado foi o que ele escreveu. Uma linha que não se consegue reproduzir com o que lá está escrito não é evidência: devolve-a com a razão.
4. Volta às previsões da parte 1 e corrige a lápis o que previste mal.


### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

Neste tema, vais construir uma **matriz de falhas**, uma tabela das falhas que o servidor conhece. Cada linha indica como provocar a falha e que código resulta. Indica também o que o utilizador vê e o que fica no terminal. Serve para três coisas: obriga a pensar em cada falha antes de ela acontecer. É a lista do que se verifica antes de entregar o trabalho. E é o que se dá a quem vai manter o servidor. A do catálogo:

| Falha | Como se provoca | Código | O que o utilizador vê | O que fica no terminal |
| --- | --- | --- | --- | --- |
| Identificador inválido | `/equipamentos/abc` | 400 | "Pedido inválido", com a regra do identificador | A linha do pedido |
| Equipamento que não existe | `/equipamentos/9` | 404 | "Equipamento não encontrado" | A linha do pedido |
| Endereço que não existe | `/nao-existe` | 404 | "Página não encontrada" | A linha do pedido |
| Campo inválido num formulário | O tempo 12, com o `novalidate` | 400 | O formulário, com a mensagem no campo | A linha do pedido |
| Formulário sem o token, ou com outro | Apagar o `_csrf` nas ferramentas de programador | 403 | "Pedido recusado", com o que fazer | A linha do pedido |
| Endereço mal codificado | `/equipamentos/%E0%A4%A` | 400 | "Pedido recusado" | A data, o pedido e o erro |
| Corpo grande demais | Um nome com 200 000 carateres, enviado sem o formulário | 413 | "Pedido recusado" | A data, o pedido e o erro |
| Erro no código ou num modelo | O `equipamento.fabricante.nome` | 500 | "Erro no servidor", sem pormenores | A data, o pedido e o stack trace |
| Segredo em falta ou curto | Arrancar sem `.env`, ou com um segredo de 10 carateres | (não arranca) | Nada: o servidor não está ligado | A mensagem, sem o segredo |

As linhas do 400 por um endereço mal codificado e do 413 são das que só se descobrem experimentando. Os dois erros nascem antes das rotas, um no Express e outro no `express.urlencoded`. Foi ao provocar o 413 que se viu que a página de erro falhava sem o `itensNoPedido`. E que o 413 virava um 500. Sem a matriz, essas duas falhas só apareceriam no dia em que alguém as provocasse por acaso. É o que o laboratório te pede: preencher a matriz do teu servidor provocando cada falha. E não só imaginando-a.

### Respostas para conferires esta fase

- **Passo 1.** Num servidor igual ao do exemplo, a matriz desta fase confere linha a linha. Se o 413 der 500, confere a parte dos 4xx no middleware de erro. Se a página de erro falhar com um corpo grande, confere a linha de `itensNoPedido`.
- **Passo 2.** Falhas que a turma costuma acrescentar: um equipamento que não está no pedido, na remoção (400). A confirmação de um pedido vazio feita à mão (400). Um dia inexistente num formulário (400).
- **Passo 3.** A revisão do colega serve para conferir se outra pessoa consegue repetir o teu caso. A coluna "como se provoca" deve permitir que outra pessoa reproduza a falha. Indica o endereço exato, o que escrever em cada campo e a ferramenta a usar. Uma linha com "dá erro se o formulário estiver mal" não se reproduz. E deve ser devolvida.

### Paragem 8

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.

## Problemas frequentes

### Continua a aparecer a página do Express

O middleware de erro tem três parâmetros, ou está acima das rotas, ou a própria página de erro está a falhar. Se a página do Express falar do `erro.ejs`, falta a linha do `itensNoPedido`.

### Todos os formulários dão "Pedido recusado"

Falta o campo escondido num formulário, o nome não é `_csrf`, ou a rota do formulário não chama a `prepararTokenCsrf`. Abre o código-fonte e procura o campo.

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

## Conferência dos ficheiros finais

Depois de desfazeres todos os erros provocados, confere os teus ficheiros com esta versão completa. Os nomes e as rotas mantêm a sequência do catálogo.

### `server.js` completo

```js
// server.js: o catálogo de equipamentos da escola, com o pedido em curso na
// sessão, agora preparado para quando as coisas correm mal: um middleware de
// erro que regista a falha no terminal e mostra ao utilizador uma página que
// não revela nada do servidor, e um token contra o CSRF em todos os
// formulários que mudam a sessão.
import express from "express";
import session from "express-session";
import { randomBytes } from "node:crypto";

const app = express();
const PORTA = 3000;

// O segredo que assina o cookie da sessão vem do ambiente, e nunca do código.
// Sem ele, o servidor recusa-se a arrancar.
const SEGREDO = process.env.SESSION_SECRET;
if (!SEGREDO) {
  console.error("Falta o SESSION_SECRET. Copia o .env.example para .env, escreve lá um segredo e arranca com: node --env-file=.env server.js");
  process.exit(1);
}
// Um segredo curto adivinha-se. A mensagem não mostra o segredo: só o tamanho.
if (SEGREDO.length < 32) {
  console.error(`O SESSION_SECRET tem ${SEGREDO.length} carateres; tem de ter pelo menos 32.`);
  process.exit(1);
}

// O nome do cookie da sessão, usado na configuração e ao terminar a sessão.
const NOME_DO_COOKIE = "catalogo.sid";

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
const reservas = [];
let proximoIdReserva = 1;

/**
 * Devolve o texto de um campo do formulário, sem os espaços das pontas.
 * Um campo que não veio, ou que veio repetido (e chega como um array),
 * não é um texto: devolve o texto vazio.
 * @param {unknown} valor o valor tal como chegou em req.body
 * @returns {string}
 */
function textoDoCampo(valor) {
  if (typeof valor !== "string") {
    return "";
  }
  return valor.trim();
}

/**
 * Confirma que um texto no formato AAAA-MM-DD é um dia que existe.
 * O new Date aceita "2026-02-30" e transforma-o em 2 de março; por isso
 * confirma-se que o dia que sai é o mesmo que entrou.
 * @param {string} texto o dia, como o campo type="date" o envia
 * @returns {boolean}
 */
function diaValido(texto) {
  const dia = new Date(texto);
  if (Number.isNaN(dia.getTime())) {
    return false;
  }
  return dia.toISOString().slice(0, 10) === texto;
}

/**
 * Verifica um equipamento a juntar ao pedido: o equipamento, o dia e o tempo.
 * Só lê os três campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * @param {object} corpo o req.body do pedido
 * @returns {object} um objeto com os valores e os erros
 */
function validarItem(corpo) {
  const valores = {
    equipamento_id: textoDoCampo(corpo.equipamento_id),
    data: textoDoCampo(corpo.data),
    tempo: textoDoCampo(corpo.tempo),
  };
  const erros = {};

  // O equipamento tem de ser um dos da lista.
  const equipamento = equipamentos.find((equipamento) => equipamento.id === Number(valores.equipamento_id));
  if (!equipamento) {
    erros.equipamento_id = "Escolhe um equipamento da lista.";
  }

  // O dia é obrigatório, e tem de existir no calendário.
  if (valores.data === "") {
    erros.data = "Escolhe o dia da reserva.";
  } else if (!diaValido(valores.data)) {
    erros.data = "Esse dia não existe no calendário.";
  }

  // O tempo letivo é obrigatório, e é um número inteiro de 1 a 9.
  const tempo = Number(valores.tempo);
  if (valores.tempo === "") {
    erros.tempo = "Indica o tempo letivo.";
  } else if (!Number.isInteger(tempo) || tempo < 1 || tempo > 9) {
    erros.tempo = "O tempo letivo é um número inteiro de 1 a 9.";
  }

  return { valores: valores, erros: erros };
}

/**
 * Verifica o nome de quem confirma o pedido: obrigatório, e até 40 carateres.
 * Devolve a mensagem de erro, ou o texto vazio se o nome servir.
 * @param {string} nome o nome, já limpo pela textoDoCampo
 * @returns {string}
 */
function erroDoNome(nome) {
  if (nome === "") {
    return "Escreve o teu nome.";
  }
  if (nome.length > 40) {
    return "O nome tem, no máximo, 40 carateres.";
  }
  return "";
}

/**
 * Garante que a sessão tem um token contra o CSRF, e põe-no à disposição dos
 * modelos. O token é um código aleatório, um por sessão, que os formulários
 * enviam num campo escondido; uma página de outro site não o conhece.
 * @param {object} req o pedido
 * @param {object} res a resposta
 */
function prepararTokenCsrf(req, res) {
  if (!req.session.csrf) {
    req.session.csrf = randomBytes(32).toString("hex");
  }
  res.locals.csrf = req.session.csrf;
}

/**
 * Junta a cada item do pedido o seu equipamento, para a página mostrar o nome.
 * @param {object[]} pedido os itens guardados na sessão
 * @returns {object[]} uma linha por item, com o item e o equipamento
 */
function linhasDoPedido(pedido) {
  const linhas = [];
  for (const item of pedido) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === item.equipamentoId);
    linhas.push({ item: item, equipamento: equipamento });
  }
  return linhas;
}

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware que lê o corpo dos formulários enviados por POST e o põe em
// req.body. Tem de estar antes das rotas que usam o req.body.
app.use(express.urlencoded({ extended: false }));

// Middleware das sessões: lê o cookie de cada pedido, encontra a sessão
// desse browser e põe-na em req.session. Cada opção está justificada.
app.use(session({
  secret: SEGREDO, // assina o cookie: o servidor só aceita identificadores que ele próprio deu
  name: NOME_DO_COOKIE, // o nome do cookie no browser
  resave: false, // não volta a guardar uma sessão que não mudou
  saveUninitialized: false, // não cria sessão, nem cookie, a quem ainda não guardou nada
  cookie: {
    httpOnly: true, // o JavaScript das páginas não consegue ler o cookie
    sameSite: "lax", // o cookie não vai nos pedidos POST que outros sites façam ao catálogo
    secure: false, // com HTTPS seria true; em http://localhost tem de ser false
    maxAge: 30 * 60 * 1000, // 30 minutos, em milissegundos, contados da última mudança
  },
}));

// Para todas as páginas: quantos equipamentos tem o pedido desta sessão, e o
// token contra o CSRF, se a sessão já o tiver. O res.locals põe os dois à
// disposição de todos os modelos.
app.use((req, res, next) => {
  const pedido = req.session.pedido;
  res.locals.itensNoPedido = pedido ? pedido.length : 0;
  res.locals.csrf = req.session.csrf || "";
  next();
});

// Proteção contra o CSRF: todos os pedidos POST têm de trazer, no campo
// escondido _csrf, o token desta sessão. Sem ele, ou com outro, recusa-se.
app.use((req, res, next) => {
  if (req.method !== "POST") {
    next();
    return;
  }
  const token = req.session.csrf;
  if (!token || req.body._csrf !== token) {
    res.status(403).render("erro", {
      titulo: "Pedido recusado",
      mensagem: "Este formulário já não é válido. Volta à página do formulário, recarrega-a e tenta outra vez.",
    });
    return;
  }
  next();
});

// Página inicial, com a pesquisa por sala e a ligação para reservar.
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

// O pedido em curso: os equipamentos já juntos, a confirmação e o cancelamento.
app.get("/pedido", (req, res) => {
  const pedido = req.session.pedido || [];
  res.render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: "", erroNome: "" });
});

// O formulário para juntar um equipamento ao pedido. É aqui que a sessão
// recebe o token contra o CSRF, porque é o primeiro formulário que a muda.
app.get("/pedido/item", (req, res) => {
  prepararTokenCsrf(req, res);
  res.render("item-novo", {
    titulo: "Juntar ao pedido",
    equipamentos: equipamentos,
    valores: { equipamento_id: "", data: "", tempo: "" },
    erros: {},
  });
});

// Juntar um equipamento ao pedido: valida, e guarda o item na sessão.
app.post("/pedido/itens", (req, res) => {
  const resultado = validarItem(req.body);
  if (Object.keys(resultado.erros).length > 0) {
    res.status(400).render("item-novo", {
      titulo: "Juntar ao pedido",
      equipamentos: equipamentos,
      valores: resultado.valores,
      erros: resultado.erros,
    });
    return;
  }

  // Da primeira vez, a sessão ainda não tem pedido: começa vazio.
  if (!req.session.pedido) {
    req.session.pedido = [];
  }
  req.session.pedido.push({
    equipamentoId: Number(resultado.valores.equipamento_id),
    data: resultado.valores.data,
    tempo: Number(resultado.valores.tempo),
  });
  res.redirect(303, "/pedido");
});

// Tirar um equipamento do pedido: POST /pedido/itens/2/remocao tira o segundo.
app.post("/pedido/itens/:posicao/remocao", (req, res) => {
  const pedido = req.session.pedido || [];
  const posicao = Number(req.params.posicao);
  if (!Number.isInteger(posicao) || posicao < 1 || posicao > pedido.length) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "Esse equipamento não está no teu pedido.",
    });
    return;
  }
  pedido.splice(posicao - 1, 1);
  res.redirect(303, "/pedido");
});

// Confirmar o pedido: cria uma reserva por equipamento e termina a sessão.
app.post("/pedido/confirmacao", (req, res) => {
  const pedido = req.session.pedido || [];
  if (pedido.length === 0) {
    res.status(400).render("erro", {
      titulo: "Pedido vazio",
      mensagem: "Não há nada no teu pedido para confirmar.",
    });
    return;
  }

  const nome = textoDoCampo(req.body.nome);
  const erroNome = erroDoNome(nome);
  if (erroNome !== "") {
    res.status(400).render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: nome, erroNome: erroNome });
    return;
  }

  for (const item of pedido) {
    reservas.push({
      id: proximoIdReserva,
      equipamentoId: item.equipamentoId,
      data: item.data,
      tempo: item.tempo,
      nome: nome,
    });
    proximoIdReserva = proximoIdReserva + 1;
  }

  // O pedido acabou: a sessão é destruída no servidor, e o cookie apagado no browser.
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível terminar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/reservas");
  });
});

// Cancelar o pedido: termina a sessão sem criar reservas.
app.post("/pedido/cancelamento", (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível cancelar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/");
  });
});

// A lista das reservas feitas desde que o servidor arrancou.
app.get("/reservas", (req, res) => {
  // Para cada reserva, junta-se o equipamento, para a página mostrar o nome.
  const linhas = [];
  for (const reserva of reservas) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
    linhas.push({ reserva: reserva, equipamento: equipamento });
  }
  res.render("reservas", { titulo: "Reservas", linhas: linhas });
});

// Uma reserva: a página para onde o browser vai depois de reservar.
app.get("/reservas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O número da reserva tem de ser um número inteiro positivo.",
    });
    return;
  }
  const reserva = reservas.find((reserva) => reserva.id === id);
  if (!reserva) {
    res.status(404).render("erro", {
      titulo: "Reserva não encontrada",
      mensagem: `Não existe a reserva ${id}.`,
    });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
  res.render("reserva", { titulo: `Reserva ${reserva.id}`, reserva: reserva, equipamento: equipamento });
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).render("erro", {
    titulo: "Página não encontrada",
    mensagem: "Este endereço não existe no catálogo.",
  });
});

// Middleware de erro: tem quatro parâmetros, e o Express só o chama quando
// uma rota, um middleware ou um modelo falham. Regista o erro completo no
// terminal, para quem o vai corrigir, e mostra ao utilizador uma página que
// não revela nada do servidor. Fica depois de tudo, como o middleware final.
app.use((erro, req, res, next) => {
  console.error(`${new Date().toISOString()} ERRO ${req.method} ${req.url}`);
  console.error(erro.stack);

  // A página de erro inclui o cabeçalho, que usa o itensNoPedido. Se a falha
  // aconteceu antes do middleware que o prepara, ele ainda não existe.
  res.locals.itensNoPedido = res.locals.itensNoPedido || 0;

  // Alguns erros já trazem um código 4xx: o express.urlencoded dá o 413 a um
  // corpo grande demais. Esses são falhas do pedido; tudo o resto é um 500.
  if (erro.status >= 400 && erro.status < 500) {
    res.status(erro.status).render("erro", {
      titulo: "Pedido recusado",
      mensagem: "O servidor não conseguiu tratar este pedido. Volta à página anterior e tenta outra vez.",
    });
    return;
  }
  res.status(500).render("erro", {
    titulo: "Erro no servidor",
    mensagem: "Alguma coisa correu mal do nosso lado. Tenta outra vez daqui a pouco.",
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
    <p><a href="/pedido/item">Fazer um pedido de reserva</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/item-novo.ejs` completo

```ejs
<%# O formulário para juntar um equipamento ao pedido. Recebe o titulo,
    os equipamentos para a lista, os valores a pôr nos campos e os erros,
    um por campo. O nome só se pede no fim, ao confirmar o pedido. O campo
    escondido _csrf leva o token da sessão. %>
<%- include("partials/cabecalho") %>
    <% if (Object.keys(erros).length > 0) { %>
      <p><strong>O equipamento não foi juntado ao pedido. Corrige os campos assinalados e volta a enviar.</strong></p>
    <% } %>
    <form method="post" action="/pedido/itens">
      <input type="hidden" name="_csrf" value="<%= csrf %>">
      <p>
        <label for="equipamento_id">Equipamento
          <% if (erros.equipamento_id) { %><strong><%= erros.equipamento_id %></strong><% } %>
        </label>
        <select id="equipamento_id" name="equipamento_id" required>
          <option value="">Escolhe um equipamento</option>
          <% for (const equipamento of equipamentos) { %>
            <option value="<%= equipamento.id %>" <% if (String(equipamento.id) === valores.equipamento_id) { %>selected<% } %>><%= equipamento.nome %>, sala <%= equipamento.sala %></option>
          <% } %>
        </select>
      </p>
      <p>
        <label for="data">Dia
          <% if (erros.data) { %><strong><%= erros.data %></strong><% } %>
        </label>
        <input id="data" name="data" type="date" value="<%= valores.data %>" required>
      </p>
      <p>
        <label for="tempo">Tempo letivo, de 1 a 9
          <% if (erros.tempo) { %><strong><%= erros.tempo %></strong><% } %>
        </label>
        <input id="tempo" name="tempo" type="number" min="1" max="9" value="<%= valores.tempo %>" required>
      </p>
      <button type="submit">Juntar ao pedido</button>
    </form>
    <p><a href="/pedido">Voltar ao pedido</a></p>
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
      <a href="/equipamentos">Todos os equipamentos</a> |
      <a href="/reservas">Reservas</a> |
      <a href="/pedido">O teu pedido (<%= itensNoPedido %>)</a>
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

### `views/pedido.ejs` completo

```ejs
<%# O pedido em curso, guardado na sessão. Recebe o titulo, as linhas (cada
    uma com o item e o equipamento), e o nome e o erro do formulário de
    confirmação, vazios da primeira vez. Cada formulário leva, no campo
    escondido _csrf, o token da sessão. %>
<%- include("partials/cabecalho") %>
    <% if (linhas.length === 0) { %>
      <p>O teu pedido está vazio.</p>
    <% } else { %>
      <ol>
        <% for (let i = 0; i < linhas.length; i++) { %>
          <li>
            <%= linhas[i].equipamento.nome %>, sala <%= linhas[i].equipamento.sala %>: dia <%= linhas[i].item.data %>, tempo <%= linhas[i].item.tempo %>
            <form method="post" action="/pedido/itens/<%= i + 1 %>/remocao">
              <input type="hidden" name="_csrf" value="<%= csrf %>">
              <button type="submit">Tirar do pedido</button>
            </form>
          </li>
        <% } %>
      </ol>
    <% } %>
    <p><a href="/pedido/item">Juntar um equipamento ao pedido</a></p>
    <% if (linhas.length > 0) { %>
      <h2>Confirmar o pedido</h2>
      <form method="post" action="/pedido/confirmacao">
        <input type="hidden" name="_csrf" value="<%= csrf %>">
        <p>
          <label for="nome">O teu nome
            <% if (erroNome) { %><strong><%= erroNome %></strong><% } %>
          </label>
          <input id="nome" name="nome" maxlength="40" value="<%= valorNome %>" required>
        </p>
        <button type="submit">Confirmar o pedido</button>
      </form>
      <h2>Cancelar o pedido</h2>
      <form method="post" action="/pedido/cancelamento">
        <input type="hidden" name="_csrf" value="<%= csrf %>">
        <button type="submit">Cancelar o pedido</button>
      </form>
    <% } %>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/reserva.ejs` completo

```ejs
<%# A página de uma reserva, para onde o browser vai depois de reservar.
    Recebe o titulo, a reserva e o equipamento reservado. %>
<%- include("partials/cabecalho") %>
    <p>Equipamento: <a href="/equipamentos/<%= equipamento.id %>"><%= equipamento.nome %></a>, sala <%= equipamento.sala %></p>
    <p>Dia: <%= reserva.data %>, tempo <%= reserva.tempo %></p>
    <p>Reservado por: <%= reserva.nome %></p>
    <p><a href="/reservas">Ver todas as reservas</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/reservas.ejs` completo

```ejs
<%# A lista das reservas. Recebe o titulo e as linhas, cada uma com a
    reserva e o equipamento reservado. %>
<%- include("partials/cabecalho") %>
    <% if (linhas.length === 0) { %>
      <p>Ainda não há reservas.</p>
    <% } else { %>
      <ul>
        <% for (const linha of linhas) { %>
          <li><a href="/reservas/<%= linha.reserva.id %>">Reserva <%= linha.reserva.id %></a>: <%= linha.equipamento.nome %>, dia <%= linha.reserva.data %>, tempo <%= linha.reserva.tempo %>, por <%= linha.reserva.nome %></li>
        <% } %>
      </ul>
    <% } %>
    <p><a href="/pedido/item">Fazer um pedido de reserva</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

## Desafios

1. Acrescenta à matriz o caso de remover uma posição que não está no pedido. Escreve como o reproduzir e confere a resposta.

## Antes de terminares

- [ ] Desfizeste os erros provocados e confirmaste o catálogo a funcionar.
- [ ] Guardaste as previsões, os resultados e as explicações pedidas.
- [ ] Consegues explicar onde correm o JavaScript e o EJS e que dados chegam ao browser.

![Rodapé](../imagens/rodape.png)
