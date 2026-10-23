![Cabeçalho](../imagens/cabecalho.png)

# Erros e segurança web

Módulo Aplicações baseadas em browsers. Este guia explica como tratar falhas e proteger os formulários e os dados. Para praticar, tens o [laboratório](07-erros-e-seguranca-web-laboratorio.md) e a [ficha de exercícios](07-erros-e-seguranca-web-exercicios.md).

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte.

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. Quem errou: o pedido ou o servidor
4. O erro que ninguém previu
5. O middleware de erro
6. O que se escreve no terminal
7. Os segredos
8. O escaping depende do sítio
9. O CSRF: o pedido que outro site faz em teu nome
10. Exemplo guiado: o catálogo preparado para falhar
11. A matriz de falhas
12. Erros frequentes
13. Segurança: o que este tema junta
14. Verificar o que aprendeste
15. O que vem a seguir

## O que vais aprender

Um servidor a sério vai falhar. Vai receber pedidos mal feitos, por engano ou de propósito. Vai ter erros que ninguém previu, num modelo ou numa rota. E vai estar à vista de quem o quer usar contra os outros. O que distingue um servidor bem feito não é nunca falhar: é falhar bem. Dizer a quem fez o pedido o que pode fazer a seguir. E mais nada. Dizer a quem o vai corrigir tudo o que precisa. E só a ele. E não dar a quem o ataca nenhuma informação nem nenhuma porta.

No fim deste guia deves conseguir:

- distinguir uma falha do pedido (400, 403, 404) de uma falha do servidor (500), e escolher a resposta de cada uma;
- explicar porque é que a página de erro do Express não pode chegar a quem usa a aplicação, e substituí-la por um middleware de erro teu;
- escrever no terminal o que é preciso para corrigir uma falha, sem escrever segredos nem dados pessoais;
- guardar os segredos fora do código, e verificar ao arrancar que existem e servem;
- explicar porque é que o escaping protege o texto HTML e os atributos de texto com aspas, e porque não resolve os outros contextos;
- explicar o que é o CSRF e protegê-lo com um token, nos formulários que mudam a sessão;
- descrever as falhas do teu servidor numa matriz: como se provoca cada uma, o código, o que o utilizador vê e o que fica no terminal.

## O que já sabes e vais usar

- Pedido em sessão, segredo no `.env`, `res.locals` e destruição da sessão: [tema 06](06-cookies-e-sessoes.md).
- Códigos 200/400/404, middleware, ordem e `return` depois de uma resposta: [tema 03](03-http-rotas-e-middleware.md).
- Páginas de erro e escaping com `<%=`: [tema 04](04-ejs-e-reutilizacao-no-servidor.md).
- Redirecionamento 303 e validação dos campos no servidor: [tema 05](05-formularios-e-validacao.md).
- `Cannot set headers after they are sent to the client` sem o `return`: [tema 04](04-ejs-e-reutilizacao-no-servidor.md). Aqui explicamos porque nem o middleware de erro evita essa falha.

O exemplo parte do catálogo com sessões. Se não o tiveres a funcionar, copia [catalogo-com-sessoes](../exemplos/aplicacoes-em-browser/catalogo-com-sessoes/README.md).

## Quem errou: o pedido ou o servidor

Os códigos de estado de erro dividem-se em duas famílias, e a primeira pergunta perante uma falha é a qual delas pertence.

Os códigos começados por **4** dizem que o problema está no pedido. O servidor está bem; quem pediu é que pediu uma coisa que não existe, que está mal escrita ou que não pode fazer. Quem fez o pedido pode corrigi-lo, e a página de erro deve dizer-lhe como. Já conheces três, e este tema junta-lhes outros dois:

| Código | Quando | No catálogo |
| --- | --- | --- |
| 400 | O pedido está mal feito | `/equipamentos/abc`; um formulário com um campo errado |
| 403 | O pedido foi percebido, e é recusado | Um formulário que não traz o token contra o CSRF (secção 9) |
| 404 | O que se pediu não existe | `/equipamentos/9`; um endereço que nenhuma rota trata |
| 413 | O pedido é grande demais | Um formulário com mais de 100 kilobytes (o limite do `express.urlencoded`, do tema 5) |

Os códigos começados por **5** dizem que o problema está no servidor. O pedido podia estar certo. E o servidor falhou: um erro no código de uma rota, um modelo que tenta ler uma propriedade que não existe, uma base de dados que não responde. O mais comum é o **500**, Internal Server Error, erro interno do servidor. Quem fez o pedido não pode fazer nada para o corrigir, a não ser tentar mais tarde. Quem tem de agir é quem mantém o servidor. E para isso precisa de saber o que aconteceu.

Daqui sai a regra deste tema. Uma falha tem dois destinatários. E cada um recebe coisas diferentes. **Quem fez o pedido** recebe uma página com o código certo, uma frase que diz o que se passou e o que pode fazer. Nada sobre o funcionamento do servidor. **Quem mantém o servidor** recebe, no terminal, tudo o que precisa para encontrar e corrigir a causa. Nunca o contrário.

## O erro que ninguém previu

Os erros 400 e 404 do catálogo são previstos: há um `if` que os deteta e uma resposta escrita para eles. Neste exemplo, vamos provocar um 500 com uma linha que falha quando não devia. É uma falha inesperada do servidor. Imagina que um modelo tenta escrever o nome do fabricante de um equipamento, `equipamento.fabricante.nome`, e os equipamentos não têm fabricante. O `equipamento.fabricante` é `undefined`, e ler uma propriedade de `undefined` dá um erro.

O que o Express faz a um erro destes depende de haver ou não quem o trate. Sem nada que o trate, o Express responde ele próprio, com uma página de erro sua. Durante o desenvolvimento, essa página mostra a mensagem do erro e o **stack trace**. Esta lista mostra as funções que estavam a correr quando o erro aconteceu. Cada uma aparece com o caminho do ficheiro e o número da linha:

```text
TypeError: /Users/ana/projetos/catalogo/views/equipamento.ejs:4
...
Cannot read properties of undefined (reading 'nome')
    at eval ("/Users/ana/projetos/catalogo/views/equipamento.ejs":13:41)
    at /Users/ana/projetos/catalogo/node_modules/ejs/lib/cjs/ejs.js:617:23
```

Para ti, a programar, isto é ouro: diz o ficheiro, a linha e o erro. Para qualquer outra pessoa, é informação que não lhe diz respeito. E parte dela é perigosa. Mostra a organização das pastas e o nome de quem as tem. Revela também as bibliotecas usadas. A pasta `node_modules` aparece nos caminhos, com o nome de cada ficheiro e a linha. E às vezes um bocado do código. Quem procura uma forma de atacar um servidor começa exatamente por aqui: provocar erros e ler o que eles revelam. A resposta ao utilizador deve esconder o stack trace.

O Express sabe disto. Quando o servidor corre em modo de produção, com a variável de ambiente `NODE_ENV=production`, a página de erro do Express mostra só "Internal Server Error", sem pormenores. Mas não convém depender de alguém se lembrar de pôr essa variável. Mesmo essa página não serve: está em inglês, não tem o cabeçalho nem o menu do catálogo. E não diz ao utilizador o que pode fazer. A solução é tratar tu os erros, com um middleware próprio.

## O middleware de erro

O Express tem um tipo especial de middleware, só para erros. Distingue-se dos outros por uma única coisa: tem **quatro parâmetros**, e o primeiro é o erro.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: os quatro parâmetros identificam um middleware de erro. Primeiro regista a falha; depois garante o dado do cabeçalho e responde com 500 e a página geral.

Quando uma rota, um middleware ou um modelo falham, o Express deixa de correr as rotas e os middlewares normais. Salta para o primeiro middleware de erro seguinte. Passa-lhe o erro no primeiro parâmetro. No Express 5, isto acontece com um erro numa rota normal ou num modelo EJS. Não é preciso fazer nada para o apanhar.

O middleware faz as duas coisas da regra. Escreve no terminal a data, o pedido e o `erro.stack`, que tem a mensagem e o stack trace: é para quem mantém o servidor. E responde com o código 500 e a página de erro do catálogo, com uma frase geral: é para quem fez o pedido. Repara que a página não usa o `erro.message`. A mensagem de um erro inesperado é escrita para programadores, pode ter caminhos, nomes de variáveis ou pedaços de dados. Não ajuda em nada quem está a usar o catálogo.

O middleware tem mais duas partes. A primeira garante o `itensNoPedido`. A página de erro inclui o cabeçalho. E o cabeçalho usa o `itensNoPedido`, que um middleware põe no `res.locals`. Mas um erro pode acontecer antes desse middleware, por exemplo no `express.urlencoded`, quando o corpo de um pedido é grande demais. Nesse caso, o `itensNoPedido` ainda não existe, a página de erro falha a construir-se. E o Express responde com a sua própria página, com o stack trace. Uma página de erro tem de funcionar mesmo quando tudo o resto falhou. Por isso o middleware garante o valor de que ela precisa: `res.locals.itensNoPedido || 0` fica com o valor que lá estiver, ou com 0 se não houver nenhum.

A segunda respeita o código de alguns erros. Nem todos os erros que chegam ao middleware são falhas do servidor. O `express.urlencoded` recusa um corpo com mais de 100 kilobytes com um erro que traz a propriedade `status` com o valor 413. O Express recusa um endereço com um código mal escrito, como `%E0%A4%A`, com um erro que traz o 400. Estes erros são falhas do pedido. E responder-lhes com o 500 seria dizer que o servidor falhou quando não falhou. Por isso, se o erro trouxer um código 4xx, a resposta usa esse código e uma página "Pedido recusado". Tudo o resto é um 500.

Três regras, e a primeira apanha toda a gente:

- **São quatro parâmetros, mesmo que não uses o `next`.** O Express conta os parâmetros da função para saber se é um middleware de erro. Com três, `(erro, req, res)`, é um middleware normal, que nunca recebe os erros, e a página do Express, com o stack trace, volta a aparecer.
- **Fica no fim do ficheiro**, depois de todas as rotas e do middleware final do 404, logo antes do `app.listen`. Um erro salta para o primeiro middleware de erro que estiver **abaixo** do sítio onde aconteceu; um middleware de erro acima das rotas nunca recebe os erros delas.
- **Não substitui o `return`.** O caso do tema 4, a página de erro sem `return` depois, continua a deitar o servidor abaixo, mesmo com o middleware de erro. O erro `Cannot set headers` acontece depois de a resposta ter saído, fora do caminho normal do Express, e não chega a nenhum middleware. O `return` continua obrigatório.

## O que se escreve no terminal

O que o servidor escreve no terminal é o seu **registo**. E é a única forma de saber, depois, o que aconteceu. O catálogo já tem dois registos: o middleware de registo, do tema 3, escreve uma linha por pedido, com o método e o endereço. E o middleware de erro escreve, para cada falha, a data, o pedido e o stack trace.

Um bom registo é mínimo: tem o que é preciso para perceber e corrigir uma falha, e mais nada. Para cada falha, isso quer dizer **quando** aconteceu, **que pedido** a provocou e **o que** falhou, com o stack trace. Com estas três coisas, quem lê o registo consegue reproduzir a falha e encontrar a linha.

E há coisas que nunca se escrevem no registo. Isto acontece porque o registo é lido por quem mantém o servidor, guardado em ficheiros, copiado para outros sítios. E não é um lugar seguro:

- **Segredos**: o `SESSION_SECRET`, palavras-passe, chaves de acesso. Nem mesmo numa mensagem de erro sobre eles: a mensagem do catálogo sobre um segredo curto diz quantos carateres tem, e não o segredo.
- **Identificadores de sessão e cookies**: quem tem o identificador tem a sessão, como viste no tema anterior. Escrever o cabeçalho `Cookie` no registo é deixar lá as chaves de todos os pedidos em curso.
- **O corpo dos pedidos**: o `req.body` tem o que as pessoas escrevem nos formulários, e isso inclui nomes, números de aluno e, numa aplicação com contas, palavras-passe. Um `console.log(req.body)` deixado de quando estavas a depurar é um registo de dados pessoais.

O endereço do pedido, que o middleware de registo escreve, também pode ter dados nos parâmetros de pesquisa. No catálogo, a sala pesquisada não é um dado pessoal, e pode ficar. Numa aplicação em que a pesquisa fosse por nome de aluno, já não podia.

## Os segredos

Do tema anterior, o segredo da sessão vive no `.env`, que não vai para o Git, e o servidor recusa-se a arrancar sem ele. Este tema acrescenta uma verificação e uma regra.

A verificação é o tamanho. Um segredo curto, como `teste` ou `123456`, é fácil de adivinhar. Quem souber o segredo consegue assinar identificadores de sessão. O servidor recusa um segredo com menos de 32 carateres, com uma mensagem que diz o tamanho, e não o segredo:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Um segredo curto adivinha-se. A mensagem não mostra o segredo: só o tamanho.
if (SEGREDO.length < 32) {
  console.error(`O SESSION_SECRET tem ${SEGREDO.length} carateres; tem de ter pelo menos 32.`);
  process.exit(1);
}
```

Leitura guiada: avalia a condição com os dados do exemplo. Só o ramo escolhido produz o resultado; o outro ramo não é executado.

Esta verificação só recusa segredos demasiado curtos. Escrever a mesma letra 32 vezes passa no teste, mas continua fácil de adivinhar. Usa o comando de geração aleatória do tema anterior, em vez de inventares um segredo. O comando cria 32 bytes aleatórios. O `toString("hex")` escreve-os como 64 carateres, de `0` a `9` e de `a` a `f`. Guarda o resultado apenas no `.env`.

A regra é o que fazer quando um segredo é revelado: se foi para o Git, se apareceu num registo, se alguém o viu no teu ecrã. A resposta é sempre trocá-lo por um novo. Não chega apagá-lo do sítio onde apareceu. Isto acontece porque não sabes quem o viu.

Nesta configuração, trocar o segredo faz deixar de aceitar os identificadores assinados com o segredo antigo. A assinatura deixa de bater certo. Quem tivesse roubado um identificador antigo também deixa de o poder usar. Os identificadores antigos deixariam de ser aceites mesmo se os dados das sessões continuassem guardados numa base de dados.

No catálogo, reler o segredo novo exige reiniciar o servidor. Esse reinício também apaga as sessões do `MemoryStore`, porque só estavam na memória do processo. São dois efeitos diferentes: o reinício perde os dados e o segredo novo invalida as assinaturas antigas. Ver o pedido vazio depois da troca não permite atribuir o resultado só à mudança do segredo.

## O escaping depende do sítio

No tema 4, o escaping do `<%=` protegia dois sítios: o conteúdo de uma etiqueta, como `<p><%= mensagem %></p>`. E o valor de um atributo de texto **entre aspas**, como `value="<%= nome %>"`. O guia avisava que havia sítios onde não chegava. Este tema mostra quais. Isto acontece porque cada sítio de uma página tem os seus carateres perigosos. O escaping do `<%=` só trata os do HTML: o `<`, o `>`, o `&`, as aspas e o apóstrofo.

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

O que fica é uma regra curta para este catálogo. Os valores recebidos entram no texto de elementos HTML, como um parágrafo, ou em atributos de texto entre aspas, como `value` e `title`. Usam sempre `<%=`. Não entram em scripts nem em atributos como `onfocus`, que contêm código. Nos endereços, aplica-se a validação já explicada: pôr aspas não basta. O objetivo é apresentar como texto um valor com HTML inserido por alguém.

Há ainda um caso que convém ver com estes olhos. O nome que alguém escreve ao confirmar um pedido aparece na lista das reservas, que **toda a gente** vê. Se esse nome entrasse sem escaping, um script escrito por uma pessoa correria no browser de todas as outras que abrissem a lista, e não só no seu. A esta variante chama-se injeção guardada, e é a mais grave, porque não precisa de enganar ninguém para clicar numa ligação: basta abrir a lista. No catálogo, o nome entra com `<%=`, e um `<script>` escrito no nome aparece na lista como texto.

## O CSRF: o pedido que outro site faz em teu nome

O tema 6 deixou dito que o `SameSite=Lax` é uma primeira defesa contra o CSRF. É altura de perceber o ataque e acrescentar a verificação do token aos formulários.

**CSRF** quer dizer cross-site request forgery, falsificação de um pedido entre sites. O ataque aproveita uma regra do tema anterior: o browser envia o cookie de um site em todos os pedidos a esse site, sem perguntar a ninguém. Imagina que a professora tem um pedido em curso no catálogo e, noutro separador, abre uma página de outro site, feita por alguém mal-intencionado. Essa página tem um formulário escondido, que envia sozinho um `POST` para `http://localhost:3000/pedido/cancelamento`. O pedido sai do browser da professora, e se o browser lhe juntar o cookie da sessão do catálogo, o servidor vê um pedido de cancelamento vindo da sessão dela. Para o servidor, foi a professora que cancelou. Ela nem soube.

O `SameSite=Lax` do tema 6 trava este ataque nos browsers atuais: um `POST` que vem de outro site não leva o cookie. O servidor vê um browser sem sessão. Mas não chega, por três razões. Há browsers antigos que não respeitam o `SameSite`. O `Lax` deixa passar o cookie numa navegação normal por `GET`, como carregar numa ligação, e por isso uma rota que mudasse alguma coisa com um `GET` ficava desprotegida. E uma mudança na configuração do cookie, feita por quem não conhece a razão, tira a proteção sem ninguém dar por isso. O `SameSite` não substitui a análise das outras formas de ataque.

A proteção contra o CSRF usada neste catálogo acrescenta um **token contra o CSRF**. É um código aleatório, um por sessão. Fica guardado na sessão e entra em cada formulário que muda alguma coisa, num campo escondido. Quando o formulário é enviado, o token vai no corpo, e o servidor compara-o com o da sessão. Se não bater certo, ou não vier, o pedido é recusado com o 403.

O ataque falha porque a página do atacante não consegue saber o token. O token está escrito nas páginas do catálogo. E o browser não deixa uma página de outro site ler o conteúdo das páginas do catálogo: é a regra da mesma origem, que os browsers aplicam a tudo. O atacante consegue fazer o browser *enviar* um pedido. Mas não consegue *ler* as respostas. E por isso não sabe o que pôr no campo escondido.

No catálogo, a defesa tem três peças. Uma função cria o token, quando a sessão ainda não o tem, e põe-no no `res.locals`:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: o `if` cria o token apenas quando a sessão ainda não o tem. Depois, a função copia o token para `res.locals.csrf`, para o modelo o usar. Não devolve um valor: altera esses dois objetos.

O `randomBytes(32)` do `node:crypto` dá 32 bytes aleatórios, e o `toString("hex")` escreve-os como 64 carateres de `0` a `9` e de `a` a `f`. É a mesma receita do comando que gera o `SESSION_SECRET`. A rota do formulário que junta um equipamento ao pedido, que é o primeiro formulário que muda a sessão, chama a função antes de mostrar a página:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: `GET /pedido/item` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

Daqui vem uma mudança em relação ao tema anterior: o cookie da sessão passa a aparecer quando se abre este formulário. Não só quando se junta o primeiro equipamento. A sessão tem de existir para guardar o token que o formulário vai levar. Quem só vê o catálogo continua sem cookie.

A segunda peça põe o token, quando existe, à disposição de todas as páginas, no mesmo middleware que já punha o número de equipamentos do pedido:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: este middleware corre antes do elemento seguinte da fila. Identifica o que prepara e se chama `next()` ou termina com uma resposta.

E cada formulário `POST` leva o campo escondido, com o token:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<input type="hidden" name="_csrf" value="<%= csrf %>">
```

Leitura guiada: o EJS calcula a expressão entre as marcas. Com `<%=`, o valor entra como texto e os carateres de HTML são escapados.

A terceira peça é a verificação, num middleware que corre antes de todas as rotas e só faz alguma coisa nos pedidos `POST`:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Proteção contra o CSRF: todos os pedidos POST têm de trazer, no campo
// escondido _csrf, o token desta sessão. Sem ele, ou com outro, recusa-se.
app.use((req, res, next) => {
  if (req.method !== "POST") {
    next();
    return;
  }
  const token = req.session.csrf;
  // Sem corpo lido pelo express.urlencoded, não há campo _csrf para comparar.
  if (!token || !req.body || req.body._csrf !== token) {
    res.status(403).render("erro", {
      titulo: "Pedido recusado",
      mensagem: "Este formulário já não é válido. Volta à página do formulário, recarrega-a e tenta outra vez.",
    });
    return;
  }
  next();
});
```

Leitura guiada: este middleware corre antes do elemento seguinte da fila. Identifica o que prepara e se chama `next()` ou termina com uma resposta.

O `||` avalia as condições da esquerda para a direita e pára quando encontra uma verdadeira. Sem token na sessão, o pedido é logo recusado. Se houver token, verifica-se depois o `!req.body`: sem corpo lido pelo `express.urlencoded`, também não há campo `_csrf`. Nesse caso, o pedido recebe 403 sem tentar ler uma propriedade de `undefined`. Só quando existe corpo se compara o campo com o token da sessão. Isto também recusa um corpo enviado com um tipo que o `express.urlencoded` não lê.

Por estar num middleware geral, e não em cada rota, nenhum formulário novo fica desprotegido por esquecimento: um `POST` sem o token é recusado, venha para onde vier. Fica depois do `express.urlencoded`, porque lê o `req.body`, e depois da sessão, porque lê o `req.session`. Quando a sessão termina, o token vai com ela, e um formulário antigo, de uma página que ficou aberta, é recusado; a mensagem diz o que fazer.

Repara numa consequência para as rotas: **nada que mude dados se faz com `GET`**. Um `GET` não leva token, e uma ligação de outro site leva o cookie. O catálogo cumpre-o desde o tema 5: juntar, tirar, confirmar e cancelar são todos `POST`.

## Exemplo guiado: o catálogo preparado para falhar

O exemplo parte do catálogo com sessões do tema anterior. As páginas e as rotas não mudam; o que muda é o que acontece quando alguma coisa corre mal. O resultado final está pronto a correr na pasta [catalogo-com-seguranca](../exemplos/aplicacoes-em-browser/catalogo-com-seguranca/README.md) dos exemplos.

### Passo 1: provocar um 500 e ler a página do Express

Para ver a página de erro do Express, é preciso uma falha ainda sem tratamento próprio. No laboratório, provocas uma no modelo da página de um equipamento, com o `equipamento.fabricante.nome` da secção "O erro que ninguém previu". Abre `/equipamentos/2`: o browser mostra a página do Express, com o código 500, o `TypeError` e o stack trace, com os caminhos do teu computador. Repara também no terminal: o Express escreve lá o mesmo erro.

### Passo 2: o middleware de erro

Coloca o middleware de erro no fim do `server.js`, depois do middleware final e antes de `app.listen`. Inclui as três partes explicadas: o registo, a garantia de `itensNoPedido` e o tratamento dos códigos 4xx. Com o mesmo erro no modelo, `/equipamentos/2` passa a mostrar a página "Erro no servidor", com o menu do catálogo, a frase geral e o código 500. No terminal, a linha com a data e o pedido. E o stack trace. No código-fonte da página, nenhum caminho. Desfaz o erro no modelo. E a página do equipamento volta.

### Passo 3: o tamanho do segredo

A verificação do tamanho, a seguir à verificação de que o segredo existe. Se o teu segredo foi gerado com o comando do tema anterior, tem 64 carateres, e nada muda.

### Passo 4: o token contra o CSRF

O `import { randomBytes } from "node:crypto";` no início do ficheiro, a função `prepararTokenCsrf` ao lado das outras funções, a linha do `csrf` no middleware do `res.locals`, o middleware de verificação logo a seguir. A chamada à função na rota `GET /pedido/item`. Nos modelos, o campo escondido entra nos quatro formulários `POST`: o de juntar um equipamento, em `item-novo.ejs`. Os três da página do pedido, em `pedido.ejs` (o de cada botão de remoção, o da confirmação e o do cancelamento). Os dois modelos, completos:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: os `include` juntam os fragmentos escritos por ti. Entre eles, os valores entram com `<%=`, para o browser os receber como texto.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: os `include` juntam os fragmentos escritos por ti. Entre eles, os valores entram com `<%=`, para o browser os receber como texto.

O formulário de pesquisa da página inicial não leva token: envia por `GET`, e não muda nada.

### Passo 5: o servidor completo

O `server.js` no fim do exemplo:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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
  // Sem corpo lido pelo express.urlencoded, não há campo _csrf para comparar.
  if (!token || !req.body || req.body._csrf !== token) {
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

Leitura guiada: lê os dados iniciais, depois os middlewares pela ordem do ficheiro. Escolhe um pedido da tabela de resultados e segue só a rota que o recebe.

### Passo 6: os resultados

| O que se faz | O que acontece |
| --- | --- |
| Arrancar com um segredo de 10 carateres | O servidor não arranca: "tem 10 carateres; tem de ter pelo menos 32" |
| Abrir `/pedido/item` | O formulário, com o campo escondido `_csrf`; a sessão e o cookie são criados aqui |
| Juntar um equipamento | 303 para `/pedido`, como antes |
| Juntar um equipamento com o campo `_csrf` apagado ou mudado | 403, "Pedido recusado" |
| Confirmar um pedido com o nome `<script>alert(1)</script>` | A lista das reservas mostra o nome como texto |
| Um erro num modelo | 500, "Erro no servidor", sem caminhos na página; o stack trace no terminal |
| Um corpo de 200 000 carateres | 413, "Pedido recusado" |
| Trocar o `SESSION_SECRET` e reiniciar, com um pedido a meio | O pedido desaparece: o identificador antigo já não bate certo |

## A matriz de falhas

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

As linhas do 400 por um endereço mal codificado e do 413 mostram falhas que nascem antes das rotas. Uma acontece no Express e outra no `express.urlencoded`. A página de erro precisa do `itensNoPedido`, mesmo quando o middleware habitual ainda não o preparou. Com o middleware completo, o corpo grande recebe 413 e a página "Pedido recusado". Sem a garantia desse dado, a própria página de erro falha. Se também faltasse o tratamento dos códigos 4xx, o corpo grande receberia 500. A matriz permite distinguir estas causas: preenche-a provocando cada falha no teu servidor, e não só imaginando o resultado.

## Erros frequentes

### Continua a aparecer a página do Express, com o stack trace

O middleware de erro tem três parâmetros, e não quatro, ou está acima das rotas. Confirma os dois: `(erro, req, res, next)`, e depois do middleware final, logo antes do `app.listen`.

### O middleware de erro está certo, e o servidor vai abaixo na mesma

Falta um `return` depois de uma resposta, como no tema 4. O middleware de erro não apanha esta falha. Procura, na rota do pedido que estava a ser feito, uma resposta de erro sem o `return` a seguir.

### Todos os formulários dão "Pedido recusado"

O campo escondido não está no formulário, tem outro nome (o middleware lê `_csrf`), ou o `csrf` não chega ao modelo. Abre o código-fonte da página e procura o `name="_csrf"`: tem de estar dentro do `<form>`, com um valor de 64 carateres. Se o valor estiver vazio, a sessão ainda não tem token. A rota do formulário deve chamar `prepararTokenCsrf`, ou a sessão já deve ter um token.

### Depois de confirmar o pedido, um formulário de outro separador dá "Pedido recusado"

Não é um erro. A sessão terminou, e o token foi com ela. Recarrega a página do formulário.

### O servidor não arranca, e o segredo está no .env

O segredo tem menos de 32 carateres. A mensagem diz quantos tem. Gera um novo com o comando do tema anterior.

### Depois de trocar o segredo, os pedidos em curso desapareceram

Não é um erro: é o efeito de trocar o segredo, e é o que se quer quando o segredo antigo foi revelado.

## Segurança: o que este tema junta

- **Falhar bem.** Para quem pede, o código certo e uma frase que diz o que fazer; para quem mantém, o registo completo no terminal. Nunca um stack trace nem uma mensagem de erro interna numa página.
- **Um middleware de erro com quatro parâmetros, no fim.** E o `return` depois de cada resposta, que o middleware de erro não substitui.
- **Registos mínimos.** Quando, que pedido e o que falhou. Nem segredos, nem cookies, nem o corpo dos pedidos.
- **Segredos fora do código, verificados ao arrancar, e trocados quando revelados.**
- **Valores no texto HTML e em atributos de texto com aspas, com `<%=`.** Nada em scripts nem em atributos de código; endereços vindos de fora validados.
- **Token contra o CSRF em todos os `POST` que mudam a sessão, e nada que mude dados com `GET`.** O `SameSite=Lax` fica, como uma segunda defesa.


## Palavras novas deste guia

- Middleware de erro: função com quatro parâmetros que o Express chama quando uma operação falha.
- Stack trace: lista das chamadas e linhas do código relacionadas com uma falha.
- Registo do servidor: informação escrita para quem mantém e corrige a aplicação.
- Escaping contextual: proteção que depende do sítio onde o valor entra na página.
- Injeção guardada: código perigoso guardado como dado e mostrado depois a outras pessoas.
- CSRF: pedido provocado por outro site que tenta aproveitar a sessão do browser.
- Token contra CSRF: código aleatório da sessão que o servidor exige nos formulários que mudam dados.
- Mesma origem: regra que impede uma página de outro site de ler as páginas do catálogo.
- Matriz de falhas: tabela que diz como provocar cada falha e conferir a resposta.

## Verificar o que aprendeste

1. Diz se cada uma é uma falha do pedido ou do servidor. E o código: o tempo 12 num formulário. O equipamento 9. Um modelo que lê uma propriedade de `undefined`. Um formulário sem o token.
2. Porque é que a página de erro do Express não pode chegar a quem usa o catálogo? Dá dois exemplos do que ela revela.
3. O que distingue um middleware de erro de um middleware normal? E onde fica?
4. Um colega diz: "com o middleware de erro, já não preciso do `return` depois das respostas de erro". Está certo? Porquê?
5. O que escreve o middleware de erro no terminal, e o que mostra ao utilizador? Porque é que a página não usa o `erro.message`?
6. Diz três coisas que nunca se escrevem no registo, e porquê.
7. Porque é que um atributo sem aspas é perigoso, mesmo com `<%=`?
8. Porque é que o escaping não protege um `href` com o valor `javascript:alert(1)`? O que protege?
9. Explica o ataque CSRF com o cancelamento do pedido. Porque é que o `SameSite=Lax` não chega sozinho?
10. Porque é que a página de outro site não consegue descobrir o token do catálogo?

## O que vem a seguir

Faz o [laboratório](07-erros-e-seguranca-web-laboratorio.md) e depois a [ficha de exercícios](07-erros-e-seguranca-web-exercicios.md).

O próximo tema integra o módulo num percurso completo do catálogo. Junta as rotas, as páginas, os formulários, as sessões e a segurança trabalhados desde o primeiro servidor. É ensaiado como um todo, com a matriz de falhas como lista do que verificar. Depois vem a evidência individual do módulo, em que cada um mostra e explica uma alteração ao seu próprio servidor. A matriz de falhas que fazes neste tema é a primeira coisa que vais usar nos dois.

![Rodapé](../imagens/rodape.png)
