![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: cookies e sessões

Praticas, no servidor da biblioteca, uma sessão que guarda, para cada browser, os últimos livros vistos. Os exercícios 1 a 6 são obrigatórios, por esta ordem. Os exercícios 1, 2 e 6 respondem-se no `respostas-06.md`, um ficheiro de texto da tua pasta de Sistemas de Informação que não fica dentro do projeto `biblioteca`. Começa cada resposta pelo exercício e pela alínea, como 2.3. Entrega o `respostas-06.md`, o `server.js`, a pasta `views` e o `.env.example` da biblioteca, e nunca o `.env`, que tem o segredo. Para rever: o [guia do tema](../06-cookies-e-sessoes.md).

## O cenário

No balcão da biblioteca há um computador partilhado, que várias funcionárias usam ao longo do dia. A biblioteca quer que a página inicial mostre os três livros vistos mais recentemente nesse browser, para se voltar depressa a um livro que se estava a consultar. Quer também um botão para apagar esse histórico. Ao contrário do pedido em curso do guia, nada se junta para confirmar no fim: é uma lembrança do que se viu.

A biblioteca continua com os mesmos três livros:

```js fragment
// Os livros ficam num array, em memória. O campo disponivel diz se há
// pelo menos um exemplar na estante neste momento.
const livros = [
  { id: 1, titulo: "Os Maias", autor: "Eça de Queirós", disponivel: true },
  { id: 2, titulo: "Mensagem", autor: "Fernando Pessoa", disponivel: true },
  { id: 3, titulo: "Memorial do Convento", autor: "José Saramago", disponivel: false },
];
```

Os exercícios 3 a 5 partem da biblioteca do fim da ficha do tema 05. Precisam deste array, da rota `GET /livros/:id` com a página `livro.ejs`, da página inicial e dos partials. O que te faltar, fazes com os exercícios 4 e 5 da [ficha do tema 04](04-ejs-e-reutilizacao-no-servidor-exercicios.md). O desafio precisa também do formulário de empréstimo da [ficha do tema 05](05-formularios-e-validacao-exercicios.md).

Para teres duas sessões no mesmo computador, usa uma janela normal e uma anónima. O que o browser guarda vê-se no separador dos cookies, como no [passo 8 do guia](../06-cookies-e-sessoes.md#passo-8-o-cookie-no-browser).

## Exercício 1: onde fica cada informação

Para cada informação, escolhe onde a guardas. As opções são uma variável do servidor, a sessão, o cookie ou nenhum destes sítios. A variável é comum a todos os browsers. A sessão fica no servidor, uma por browser. Justifica numa frase.

1. A lista dos livros da biblioteca.
2. Os livros vistos recentemente neste browser.
3. O identificador da sessão deste browser.
4. Os empréstimos registados.
5. O número de leitor que a funcionária escreveu no último empréstimo, para o formulário seguinte já o ter preenchido.
6. A garantia de que quem está ao balcão é mesmo a funcionária Marta.

Rever: [O HTTP não se lembra de nada](../06-cookies-e-sessoes.md#o-http-não-se-lembra-de-nada), [O pedido fica no servidor, e o cookie só leva o número](../06-cookies-e-sessoes.md#o-pedido-fica-no-servidor-e-o-cookie-só-leva-o-número) e [Uma sessão não é uma autenticação](../06-cookies-e-sessoes.md#uma-sessão-não-é-uma-autenticação).

<details>
<summary>Pista</summary>

Para cada informação, imagina duas funcionárias, cada uma no seu browser, e pergunta se devem ver a mesma ou cada uma a sua.

</details>

## Exercício 2: prever

A biblioteca do fim desta ficha está a correr, e nestas previsões a sessão expira ao fim de 10 minutos. Para cada situação, diz o que mostra a página inicial, na parte dos livros vistos.

1. Na janela normal, vês "Os Maias", depois "Mensagem", depois outra vez "Os Maias", e voltas à página inicial.
2. Logo a seguir, abres a página inicial na janela anónima.
3. Na janela normal, vês os livros 1, 2 e 3, por esta ordem, e depois abres `/livros/9`, que não existe. Voltas à página inicial.
4. Na janela normal, a funcionária vai almoçar e volta 15 minutos depois, sem tocar no computador. Recarrega a página inicial.
5. A biblioteca é reiniciada a meio da manhã. O que acontece aos livros vistos em todos os browsers?

Rever: [Cookies: o browser guarda e devolve](../06-cookies-e-sessoes.md#cookies-o-browser-guarda-e-devolve), [O middleware e as suas opções](../06-cookies-e-sessoes.md#o-middleware-e-as-suas-opções), [O que o middleware faz a cada pedido HTTP](../06-cookies-e-sessoes.md#o-que-o-middleware-faz-a-cada-pedido-http) e [Onde ficam as sessões](../06-cookies-e-sessoes.md#onde-ficam-as-sessões).

<details>
<summary>Pista</summary>

Segue cada janela à parte. Em cada página que abres, pergunta que cookie o browser envia, se envia algum, e o que o servidor ainda tem guardado para ele.

</details>

## Exercício 3: a sessão da biblioteca

Acrescenta a sessão à biblioteca: instala o `express-session`, cria o `.env.example` e o `.env` com o `SESSION_SECRET`, e faz o servidor recusar arrancar sem o segredo. Põe o middleware das sessões no sítio certo. Arranca com `node --watch --env-file=.env server.js`.

Escreve, ao lado de cada opção do middleware, um comentário com a razão do valor, como no guia. Duas decisões são tuas, e são diferentes das do catálogo:

- o nome do cookie;
- a expiração. O computador do balcão é partilhado: quanto tempo deve uma sessão esquecida continuar aberta? Escolhe um valor curto e justifica, no comentário do `maxAge`, porque é adequado a esse uso, comparando-o com os 30 minutos do catálogo. Os 10 minutos do exercício 2 eram só para as previsões.

Resultado esperado: com a linha `SESSION_SECRET=` vazia no `.env`, o servidor não arranca, e o terminal diz o que falta; com um segredo, arranca, e nenhuma página cria cookie ainda.

Rever: [O segredo, fora do código](../06-cookies-e-sessoes.md#o-segredo-fora-do-código), [O middleware e as suas opções](../06-cookies-e-sessoes.md#o-middleware-e-as-suas-opções), [Passo 1: o segredo e o middleware das sessões](../06-cookies-e-sessoes.md#passo-1-o-segredo-e-o-middleware-das-sessões) e [Cookies: o browser guarda e devolve](../06-cookies-e-sessoes.md#cookies-o-browser-guarda-e-devolve).

<details>
<summary>Pista</summary>

Se o servidor não arranca e o terminal diz que falta o `SESSION_SECRET`, mesmo com o `.env` feito, procura esse caso nos erros frequentes do guia: [Falta o SESSION_SECRET](../06-cookies-e-sessoes.md#falta-o-session_secret).

</details>

<details>
<summary>Pista</summary>

Se o browser já recebe um cookie da biblioteca na página inicial, antes de haver alguma coisa para guardar, revê a opção do middleware que decide quando aparece o cookie.

</details>

## Exercício 4: os livros vistos recentemente

Sempre que a página de um livro é mostrada com sucesso, o livro passa a ser o mais recente da lista dos vistos, guardada na sessão. A página inicial mostra a lista, com o título de cada livro como ligação para a sua página, e só a mostra quando houver algum livro.

As regras são estas, e cada uma é uma decisão que tens de escrever no código:

- o mais recente aparece primeiro;
- um livro visto duas vezes aparece uma só vez, na posição da vez mais recente;
- a lista tem, no máximo, três livros;
- um livro que não existe, ou um identificador inválido, não entra na lista.

Decide também o que guardas na sessão para cada livro: o livro inteiro, ou só o seu `id`? Escreve a razão num comentário, junto da linha que guarda o livro na sessão. Para mostrares os títulos na página inicial, segue o exemplo do guia: um middleware que põe a lista no `res.locals`.

As duas escolhas são válidas, se cumprirem as regras do histórico.

Resultado esperado, na janela normal, com o servidor acabado de arrancar e por esta ordem:

| O que fazes | O que acontece |
| --- | --- |
| Abres a página inicial | Nenhuma lista, e o browser ainda não tem o cookie da biblioteca |
| Abres a página de "Mensagem", `/livros/2` | O browser recebe o cookie, com o nome e a expiração do exercício 3 |
| Recarregas a página de "Mensagem" e voltas à página inicial | "Mensagem", uma só vez |
| Vês os livros 1, 2, 1, 3 e 2, por esta ordem, e voltas à página inicial | "Mensagem", "Memorial do Convento" e "Os Maias" |
| Abres `/livros/9`, `/livros/abc` e `/livros/-1` | A página de erro, com 404, 400 e 400; a lista da página inicial não muda |
| Com o catálogo do guia a correr ao mesmo tempo, juntas lá um equipamento ao pedido e voltas à página inicial da biblioteca | A mesma lista, e o pedido do catálogo continua com o equipamento |
| Abres a página inicial na janela anónima | Nenhuma lista |

Em nenhum destes pedidos HTTP o terminal mostra um erro. Para testares o limite, acrescenta por momentos ao array `livros` um quarto livro, `{ id: 4, titulo: "Livro de ensaio", autor: "Autor fictício", disponivel: true }`. Ao guardares, o servidor volta a arrancar, com as sessões vazias. Depois de veres os livros 1, 2, 3 e 4, por esta ordem, a página inicial mostra "Livro de ensaio", "Memorial do Convento" e "Mensagem". No fim, tira o livro de ensaio.

Rever: [O que o middleware faz a cada pedido HTTP](../06-cookies-e-sessoes.md#o-que-o-middleware-faz-a-cada-pedido-http), [Passo 2: juntar ao pedido](../06-cookies-e-sessoes.md#passo-2-juntar-ao-pedido) e [Passo 3: o pedido no menu](../06-cookies-e-sessoes.md#passo-3-o-pedido-no-menu). Para o `unshift`, no guia de arrays do 11.º ano, [Métodos que alteram o array](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/07-Arrays.md#2-métodos-que-alteram-o-array-mutáveis).

<details>
<summary>Pista</summary>

Se a página do primeiro livro que vês dá 500, com `Cannot read properties of undefined` no terminal, vê o que o guia faz da primeira vez, no [passo 2](../06-cookies-e-sessoes.md#passo-2-juntar-ao-pedido).

</details>

<details>
<summary>Pista</summary>

Se guardaste o livro inteiro e um livro aparece duas vezes quando recarregas a sua página, vê como comparas o livro que chega com os que já lá estão.

</details>

<details>
<summary>Pista</summary>

Se os livros vistos desaparecem a meio dos testes, procura a causa nos erros frequentes do guia: [O pedido desapareceu](../06-cookies-e-sessoes.md#o-pedido-desapareceu). Se nenhuma serve, vê no separador Rede o `Set-Cookie` da página do livro: a que horas expira o cookie?

</details>

## Exercício 5: apagar o histórico

Na página inicial, por baixo da lista dos vistos, um botão "Apagar o histórico" envia um `POST` para `/historico/limpeza`, que apaga a lista e redireciona para a página inicial.

A decisão: destruir a sessão inteira, com o `req.session.destroy`, ou apagar só a lista dos vistos, com `delete req.session.vistos`? As duas apagam a lista. Escreve qual escolheste e porquê num comentário por cima da rota de limpeza.

Resultado esperado: vês "Os Maias" e "Mensagem" e carregas em "Apagar o histórico". O `POST /historico/limpeza` responde 303, o `GET /` seguinte 200, e a página inicial não tem a lista nem o botão. A seguir, vês "Memorial do Convento" e voltas à página inicial: a lista tem só esse livro. Se o teu browser deixar mudar cookies, confirma também que a lista saiu do servidor. Copia o valor do cookie da biblioteca antes de apagar. Depois de veres "Memorial do Convento", cola-o por cima do cookie que o browser tem, como no ponto 5 do [passo 8 do guia](../06-cookies-e-sessoes.md#passo-8-o-cookie-no-browser). Recarrega a página inicial: "Os Maias" e "Mensagem" não podem voltar.

Rever: [Terminar a sessão](../06-cookies-e-sessoes.md#terminar-a-sessão) e, para o `delete`, [Ler, escrever e remover](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/08-Objetos-e-this.md#2-ler-escrever-e-remover), no guia de objetos do 11.º ano.

## Exercício 6: encontrar os erros

Um colega fez os exercícios 3 a 5. Analisa separadamente estes dois problemas, em cópias diferentes da biblioteca.

O primeiro: a sessão contém o histórico `[2, 3, 1]`, e a página inicial mostra "Mensagem", "Memorial do Convento" e "Os Maias", por esta ordem. A funcionária carrega em "Apagar o histórico". No separador Rede, o `POST /historico/limpeza` responde 303 e o `GET /` seguinte responde 200. A página continua a mostrar os mesmos três livros. A rota de limpeza dele é esta:

```js fragment
// POST /historico/limpeza: esta rota tem um erro de propósito.
app.post("/historico/limpeza", (req, res) => {
  let vistos = req.session.vistos || [];
  vistos = [];
  res.redirect(303, "/");
});
```

1. Porque continua o histórico? Corrige a rota de acordo com a decisão que tomaste no exercício 5, e escreve a rota corrigida num bloco de código.

O segundo: noutra cópia, as páginas dos livros e a lista de todos os livros funcionam, mas a página inicial dá 500, com `livrosVistos is not defined`. O colega pôs o middleware que enche o `res.locals.livrosVistos` logo antes do middleware final.

2. Porque é que só a página inicial falha, e as outras não?
3. No catálogo do guia, o mesmo engano com o `itensNoPedido` faria falhar as páginas de todas as rotas. Porquê a diferença?
4. Onde deve ficar o middleware?

Rever: [O que o middleware faz a cada pedido HTTP](../06-cookies-e-sessoes.md#o-que-o-middleware-faz-a-cada-pedido-http), [Passo 3: o pedido no menu](../06-cookies-e-sessoes.md#passo-3-o-pedido-no-menu) e [Uma fila, pela ordem do ficheiro](../03-http-rotas-e-middleware.md#uma-fila-pela-ordem-do-ficheiro).

<details>
<summary>Pista</summary>

No primeiro problema, segue o valor de `req.session.vistos` pelas linhas da rota, e depois no `GET /` que o 303 provoca. No segundo, segue o pedido HTTP de cada página pela fila do `server.js`, até à função que lhe responde.

</details>

## Desafios

### O leitor lembrado

Depois de um empréstimo certo, o número de leitor fica guardado na sessão, e o formulário de empréstimo seguinte já o traz preenchido. Implementa-o apenas com números de leitor fictícios. Depois, pensa no computador partilhado do balcão: enquanto a sessão estiver aberta, a funcionária seguinte pode ver o número do último leitor atendido pela funcionária anterior.

Isto é um problema? O que limita esse problema na tua configuração? Responde num comentário junto da linha que guarda o número de leitor na sessão, e justifica se manterias ou rejeitarias esta funcionalidade. Se no exercício 5 escolheste destruir a sessão inteira, diz no comentário da rota de limpeza o que acontece agora ao número lembrado.

Resultado esperado: depois de emprestares "Os Maias" ao leitor 1234, o formulário seguinte traz o 1234. Depois de um empréstimo recusado, com o leitor 12, o formulário seguinte continua a trazer o 1234, e na janela anónima vem vazio.

Rever: [O que o middleware faz a cada pedido HTTP](../06-cookies-e-sessoes.md#o-que-o-middleware-faz-a-cada-pedido-http), [Uma sessão não é uma autenticação](../06-cookies-e-sessoes.md#uma-sessão-não-é-uma-autenticação) e [O formulário volta com os valores e as mensagens](../05-formularios-e-validacao.md#o-formulário-volta-com-os-valores-e-as-mensagens).

<details>
<summary>Pista</summary>

Se o formulário também vem preenchido na janela anónima, vê onde guardaste o número.

</details>

## Critérios de conclusão

- O `respostas-06.md` tem os exercícios 1, 2 e 6 respondidos, cada resposta com o exercício e a alínea, e a rota corrigida do exercício 6 num bloco de código.
- Com a linha do segredo vazia, a biblioteca não arranca. Com um segredo, responde aos resultados esperados dos exercícios 3, 4 e 5.
- Cada decisão dos exercícios 3 a 5 está num comentário, junto do código que decide. Os comentários dão as razões das opções do middleware das sessões, do que guardas por livro e da limpeza que escolheste.
- O `.env.example` tem o nome da variável, sem o valor.
- Se fizeste o desafio, o formulário traz o número do último empréstimo certo só na sessão onde ele foi feito, e o comentário diz se manterias a funcionalidade, e porquê.

![Rodapé](../../imagens/rodape.png)
