![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: formulários e validação

Praticas, no servidor da biblioteca, um formulário que muda dados. O servidor lê o corpo do pedido, verifica cada campo e responde com o formulário outra vez, quando há erros, ou com um redirecionamento, quando corre bem. Os exercícios 1 a 6 são todos obrigatórios, por esta ordem. Os exercícios 1, 2 e 6 respondem-se sem correr código, no `respostas-05.md`. É um ficheiro de texto na tua pasta de Sistemas de Informação, fora do projeto `biblioteca`. Antes de cada resposta, põe o exercício e a alínea, como 1.4 ou 6.3. No exercício 2, numera os pedidos pela ordem da tabela, de 2.1 a 2.5. Entrega o `respostas-05.md`, o `server.js` e a pasta `views` da biblioteca. Para rever: o [guia do tema](../05-formularios-e-validacao.md).

## O cenário

A biblioteca da escola quer registar os empréstimos no servidor. A funcionária escolhe o livro numa lista, escreve o número de leitor e carrega em "Emprestar". O servidor verifica os dados, regista o empréstimo e o livro deixa de estar disponível.

Os livros são os três do código de partida da biblioteca:

```js fragment
// Os livros ficam num array, em memória. O campo disponivel diz se há
// pelo menos um exemplar na estante neste momento.
const livros = [
  { id: 1, titulo: "Os Maias", autor: "Eça de Queirós", disponivel: true },
  { id: 2, titulo: "Mensagem", autor: "Fernando Pessoa", disponivel: true },
  { id: 3, titulo: "Memorial do Convento", autor: "José Saramago", disponivel: false },
];
```

Os exercícios 3 a 5 partem da biblioteca do fim da ficha do tema 04. Precisam deste array, da rota `/livros/disponiveis`, da página de erro `erro.ejs` e dos partials, com o menu e a página atual identificada. O que te faltar, fazes com os exercícios 3 e 5 da [ficha do tema 04](04-ejs-e-reutilizacao-no-servidor-exercicios.md).

Confirma cada resultado esperado no browser: o separador Rede mostra o código de estado e, no Payload, os campos que o formulário enviou. Há envios que o teu formulário não deixa fazer, como um número de leitor fora dos limites ou um livro que não está na lista. Para os testares, faz no modelo as mudanças temporárias do [passo 3 do guia](../05-formularios-e-validacao.md#passo-3-validar-e-o-formulário-outra-vez), e tira-as no fim.

## Exercício 1: de onde vêm os dados

Para cada pedido, diz de onde vêm os dados (caminho, pesquisa ou corpo) e escreve como se leem no servidor, por exemplo `req.query.disponivel`.

1. `GET /livros/2`
2. Um formulário com `method="post"` e os campos `livro_id` e `leitor`, enviado para `/emprestimos`
3. Um formulário com `method="get"` e o campo `autor`, enviado para `/livros`
4. Um formulário com `method="post"`, enviado para `/emprestimos/4/devolucao`, que a rota `/emprestimos/:id/devolucao` recebe, sem campos, só com um botão
5. O mesmo formulário do pedido 2, com um campo escondido a mais, `<input type="hidden" name="origem" value="balcao">`

Rever: [Um formulário que muda alguma coisa](../05-formularios-e-validacao.md#um-formulário-que-muda-alguma-coisa), [O corpo do pedido e o middleware que o lê](../05-formularios-e-validacao.md#o-corpo-do-pedido-e-o-middleware-que-o-lê) e [O formulário escolhe o sítio dos campos pelo method](../03-http-rotas-e-middleware.md#o-formulário-escolhe-o-sítio-dos-campos-pelo-method).

<details>
<summary>Pista</summary>

Escreve o pedido que o browser envia em cada caso, com o método, o caminho e o corpo, como o pedido da reserva no guia.

</details>

## Exercício 2: prever as respostas

O servidor da biblioteca, no fim desta ficha, acabou de arrancar e recebe estes pedidos `POST /emprestimos`, por esta ordem. Os números de leitor são números inteiros de 1000 a 9999. Para cada um, diz o código e o que o browser mostra. No 303, basta dizeres que o browser é redirecionado; se for o formulário outra vez, diz que mensagem aparece e em que campo.

| Corpo do pedido | Código | O que o browser mostra |
| --- | --- | --- |
| `livro_id=2&leitor=1234` | | |
| `livro_id=2&leitor=5678` | | |
| `livro_id=1&leitor=` | | |
| `livro_id=1&leitor=12` | | |
| `livro_id=3&leitor=1234` | | |

Rever: [Parte 2: O servidor verifica cada campo](../05-formularios-e-validacao.md#parte-2-o-servidor-verifica-cada-campo) e [Parte 3: O que o servidor responde ao formulário](../05-formularios-e-validacao.md#parte-3-o-que-o-servidor-responde-ao-formulário).

<details>
<summary>Pista</summary>

Quando a resposta é o formulário outra vez, escreve que campos voltam preenchidos e que mensagem aparece em cada campo errado, como no formulário de reserva do guia.

</details>

## Exercício 3: o formulário de empréstimo

Acrescenta a rota `GET /emprestimos/novo`, com o modelo `views/emprestimo-novo.ejs`. Esse formulário envia por `POST` para `/emprestimos`. Tem a lista dos livros, no campo `livro_id`, a começar pela opção vazia "Escolhe um livro", como a do guia, e o número de leitor, no campo `leitor`. Cada campo tem a sua etiqueta, ligada com o `for` e o `id`. Usa os atributos que ajudam quem preenche: os campos obrigatórios e, no número de leitor, o mínimo e o máximo.

Decide que livros aparecem na lista: todos, ou só os disponíveis? Escreve a decisão e a razão num comentário na rota `GET /emprestimos/novo`.

Acrescenta ao menu do cabeçalho uma ligação para os empréstimos, que o exercício 5 vai criar. Mantém as ligações e a identificação da página atual do tema anterior. A lista dos empréstimos identifica "Empréstimos"; o formulário não identifica nenhuma ligação como atual.

Resultado esperado: `GET /emprestimos/novo` mostra o formulário, com o menu sem nenhuma ligação identificada. O browser não deixa enviar sem escolher um livro, nem com o número de leitor 12 ou 10000. Carregar numa etiqueta ativa o seu campo, e na do número de leitor aparece o cursor.

Rever: [O formulário em HTML](../05-formularios-e-validacao.md#o-formulário-em-html), [Passo 1: o formulário](../05-formularios-e-validacao.md#passo-1-o-formulário) e [Partes partilhadas: o cabeçalho e o rodapé](../04-ejs-e-reutilizacao-no-servidor.md#partes-partilhadas-o-cabeçalho-e-o-rodapé).

<details>
<summary>Pista</summary>

Se `/emprestimos/novo` dá um erro `paginaAtiva is not defined`, vê o que as rotas do tema anterior passam ao `res.render` para o cabeçalho.

</details>

## Exercício 4: o empréstimo

Acrescenta o `express.urlencoded` no sítio certo, uma função `validarEmprestimo`, e a rota `POST /emprestimos`. As regras:

- o livro tem de ser um livro que existe, e tem de estar disponível; são duas mensagens diferentes;
- o número de leitor é obrigatório e é um número inteiro de 1000 a 9999;
- com erros, a resposta é o formulário outra vez, com o 400 e uma mensagem junto de cada campo errado. Conserva o número de leitor. O livro continua escolhido se ainda fizer parte das opções;
- sem erros, o empréstimo fica guardado num array, com um `id` dado pelo servidor, o `livroId`, o `leitor` (como número) e `devolvido: false`. O livro passa a não estar disponível.

Se mostras só os disponíveis, um livro pode ter sido emprestado entre a abertura do formulário e o envio. Nesse caso, mostra a mensagem de indisponibilidade e volta à opção "Escolhe um livro". Se mostras todos os livros, o livro continua escolhido, com a mensagem a explicar porque foi recusado.

A decisão é tua: para onde redirecionas a funcionária depois de um empréstimo certo? Para a lista dos empréstimos, para a página do livro, ou para o formulário vazio, pronto para o próximo? Escolhe uma, implementa-a com um 303, e justifica-a numa frase, num comentário por cima do redirecionamento.

O teste completo do redirecionamento só se faz depois do exercício 5, quando a lista dos empréstimos já existir. Se o destino que escolheste já existe, podes confirmar já na Rede o 303 e o `GET` para esse destino. Recarregar a página de destino não pode registar outro empréstimo: explica porquê no comentário do redirecionamento.

Resultado esperado, com o servidor acabado de arrancar e os pedidos por esta ordem:

| Pedido | Código | O que o browser mostra |
| --- | --- | --- |
| `POST /emprestimos` com `livro_id=1&leitor=10000` | 400 | O formulário, com a mensagem do número de leitor, "Os Maias" escolhido e o 10000 no campo |
| `GET /livros/disponiveis` | 200 | "Os Maias" e "Mensagem" |
| `POST /emprestimos` com `livro_id=7&leitor=1000` | 400 | O formulário, com a mensagem do livro que não existe, e nenhuma no número de leitor |
| `POST /emprestimos` com `livro_id=1&leitor=1000` | 303 | Na Rede, segue-se um `GET` ao destino que escolheste |
| `POST /emprestimos` com `livro_id=1&leitor=9999` | 400 | O formulário, com a mensagem do livro emprestado, diferente da do livro que não existe, e nenhuma no número de leitor |
| `POST /emprestimos` com `livro_id=2&leitor=999` | 400 | O formulário, com a mensagem do número de leitor e "Mensagem" escolhido |
| `GET /livros/disponiveis` | 200 | Só "Mensagem" |

Em nenhum destes pedidos o terminal mostra um erro. Depois do exercício 5, recarregar a página de destino mostra-a outra vez, sem a janela que pergunta se queres reenviar os dados, e a lista continua com um só empréstimo.

Rever: [O corpo do pedido e o middleware que o lê](../05-formularios-e-validacao.md#o-corpo-do-pedido-e-o-middleware-que-o-lê), [Parte 2: O servidor verifica cada campo](../05-formularios-e-validacao.md#parte-2-o-servidor-verifica-cada-campo), [Parte 3: O que o servidor responde ao formulário](../05-formularios-e-validacao.md#parte-3-o-que-o-servidor-responde-ao-formulário) e [Passo 3: validar, e o formulário outra vez](../05-formularios-e-validacao.md#passo-3-validar-e-o-formulário-outra-vez).

<details>
<summary>Pista</summary>

Se, depois de um envio com erros, o browser não consegue ligar ao servidor, procura esse caso nos erros frequentes do guia: [Depois de um envio com erros, o servidor vai abaixo](../05-formularios-e-validacao.md#depois-de-um-envio-com-erros-o-servidor-vai-abaixo).

</details>

<details>
<summary>Pista</summary>

Se o formulário volta sempre com "Escolhe um livro", mesmo quando o livro escolhido ainda está na lista, o problema está no `selected`. Vê o que o guia diz dele em [O formulário volta com os valores e as mensagens](../05-formularios-e-validacao.md#o-formulário-volta-com-os-valores-e-as-mensagens).

</details>

## Exercício 5: a lista dos empréstimos

Acrescenta a rota `GET /emprestimos`, com o modelo `views/emprestimos.ejs`: uma lista com cada empréstimo, o título do livro e o número de leitor. Uma mensagem quando ainda não há empréstimos. Faz com que a rota junte a cada empréstimo o seu livro, para o modelo só ter de mostrar.

A lista mostra a ligação "Novo empréstimo" apenas enquanto houver pelo menos um livro disponível. Quando já não houver nenhum, mostra uma mensagem clara em vez dessa ligação. A lista dos empréstimos continua visível nos dois casos.

Decide que dado precisas de preparar para o modelo e como o vais calcular. Escreve essa decisão num comentário na rota `GET /emprestimos`, junto do cálculo.

Os casos de teste são estes três momentos, a partir dos dados iniciais e sem empréstimos:

| Momento | Livros disponíveis | O que confirmar na lista dos empréstimos |
| --- | ---: | --- |
| Antes de emprestar | 2 | Mensagem de lista vazia e ligação "Novo empréstimo" |
| Depois de emprestar "Mensagem" ao leitor 1234 | 1 | Um empréstimo e a ligação |
| Depois de emprestar "Os Maias" ao leitor 5678 | 0 | Dois empréstimos, mensagem de indisponibilidade e nenhuma ligação "Novo empréstimo" |

Confirma também que o cabeçalho identifica "Empréstimos" nesta página e que as páginas do tema anterior continuam a funcionar. Depois de criares a lista, retoma e conclui o teste de redirecionamento do exercício 4.

Rever: a lista das reservas, em [Passo 2: ler o corpo, ainda sem verificar](../05-formularios-e-validacao.md#passo-2-ler-o-corpo-ainda-sem-verificar), e [A rota escolhe os dados, e o modelo mostra-os](../04-ejs-e-reutilizacao-no-servidor.md#a-rota-escolhe-os-dados-e-o-modelo-mostra-os).

<details>
<summary>Pista</summary>

Se a lista dá um erro `Cannot read properties of undefined (reading 'titulo')`, vê com que tipo de valor guardaste o `livroId` no exercício 4.

</details>

## Exercício 6: encontrar os erros

Um colega fez os exercícios 3 a 5, e a biblioteca dele tem dois problemas.

O primeiro: a funcionária preenche o formulário e carrega em "Emprestar". Aparece a lista dos empréstimos, sem empréstimo nenhum, e na barra de endereço fica `/emprestimos?livro_id=1&leitor=1234`. O terminal mostra `GET /emprestimos?livro_id=1&leitor=1234`.

1. O que está errado no formulário dele? Como o descobriste?
2. Porque é que o browser mostrou a lista, e não um erro?

O segundo: a funcionária tenta emprestar "Os Maias" com o leitor 12, recebe a mensagem do número de leitor, corrige para 1234 e volta a enviar. Desta vez, a mensagem é "Esse livro não está disponível.", e "Os Maias" já não aparece na lista dos livros disponíveis, embora a lista dos empréstimos esteja vazia. O formulário dele mostra todos os livros. A rota dele começa assim:

```js fragment
app.post("/emprestimos", (req, res) => {
  const resultado = validarEmprestimo(req.body);
  const escolhido = livros.find((livro) => livro.id === Number(resultado.valores.livro_id));
  if (escolhido) {
    escolhido.disponivel = false;
  }
  if (Object.keys(resultado.erros).length > 0) {
```

3. O que aconteceu ao livro na primeira tentativa? Porquê?
4. Onde deve ficar a mudança do livro? Que regra geral tiras daqui para as operações que mudam dados?

Rever: [Um formulário que muda alguma coisa](../05-formularios-e-validacao.md#um-formulário-que-muda-alguma-coisa), [O formulário escolhe o sítio dos campos pelo method](../03-http-rotas-e-middleware.md#o-formulário-escolhe-o-sítio-dos-campos-pelo-method) e [Parte 3: O que o servidor responde ao formulário](../05-formularios-e-validacao.md#parte-3-o-que-o-servidor-responde-ao-formulário).

<details>
<summary>Pista</summary>

No primeiro problema, compara o pedido que o terminal mostra com o pedido que o formulário devia enviar. No segundo, segue o valor de `disponivel` de "Os Maias" pelas linhas da rota, na tentativa com o leitor 12.

</details>

## Desafios

### A devolução

Na lista dos empréstimos, cada empréstimo que ainda não foi devolvido ganha um botão "Registar a devolução". O botão envia um `POST` para `/emprestimos/:id/devolucao`, com o número do empréstimo no caminho. A devolução marca o empréstimo como devolvido, volta a pôr o livro disponível e redireciona para a lista.

Decide os códigos e as páginas para estes casos, e justifica a decisão num comentário por cima da rota da devolução:

- o número do empréstimo não é um inteiro positivo;
- o empréstimo não existe;
- o empréstimo já foi devolvido;
- a devolução correu bem.

Confirma que os erros dão uma página HTML e não alteram os dados. Depois de uma devolução bem-sucedida, a lista deve mostrar o empréstimo como devolvido e o livro deve voltar a estar disponível. Repetir o pedido de devolução deve dar o erro que escolheste para um empréstimo já devolvido.

Escrever um endereço na barra faz um `GET`, e não um `POST`. Por isso, para testares o número que não serve e o empréstimo que não existe, muda temporariamente o `action` de um botão para `/emprestimos/abc/devolucao` e para `/emprestimos/99/devolucao`. Para repetires a devolução, abre a lista em dois separadores, devolve num deles e carrega no mesmo botão do outro.

Rever: [Quando corre bem: redirecionar](../05-formularios-e-validacao.md#quando-corre-bem-redirecionar) e [Passo 4: o redirecionamento](../05-formularios-e-validacao.md#passo-4-o-redirecionamento).

<details>
<summary>Pista</summary>

O pedido 4 do exercício 1 é um destes botões.

</details>

## Critérios de conclusão

- O `respostas-05.md` tem os exercícios 1, 2 e 6 respondidos, cada resposta com o exercício e a alínea ou a linha.
- A biblioteca responde aos resultados esperados dos exercícios 3 a 5, e cada decisão desses exercícios está num comentário, junto do código que decide.
- Todas as páginas têm o menu, com a ligação para os empréstimos e a página atual identificada como pede o exercício 3, e o rodapé.
- Se fizeste o desafio, a devolução responde aos quatro casos com os códigos que escolheste, e um pedido recusado não muda nenhum empréstimo nem nenhum livro.

![Rodapé](../../imagens/rodape.png)
