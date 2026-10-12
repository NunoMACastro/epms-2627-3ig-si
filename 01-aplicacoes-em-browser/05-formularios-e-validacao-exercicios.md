![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: formulários e validação

Quinto tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](05-formularios-e-validacao.md) e de fazeres o [laboratório](05-formularios-e-validacao-laboratorio.md). Os exercícios 1, 2 e 6 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior, com páginas EJS.

## Objetivo e contexto

A biblioteca da escola quer registar os empréstimos no servidor. A funcionária escolhe o livro numa lista, escreve o número de leitor e carrega em "Emprestar". O servidor verifica os dados, regista o empréstimo e o livro deixa de estar disponível.

Pelo caminho, tens de tomar decisões que a reserva do guia não tomou: que livros oferecer na lista, o que fazer com um livro que existe mas já está emprestado, em que momento da função o livro muda de estado, e para onde levar a funcionária depois de um empréstimo certo.

## Como trabalhar

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o que esperas, e só depois experimenta. Usa o separador Rede para confirmar os códigos, e o Payload para confirmar os campos enviados. Para veres a validação do servidor, usa o `novalidate`, como no laboratório, e tira-o no fim.

Se o teu servidor da biblioteca não tiver tudo o que a ficha do tema anterior pedia, os exercícios 3 a 5 só precisam do array `livros`, da página de erro `erro.ejs` e dos partials. O array é o da ficha anterior: "Os Maias" (1) e "Mensagem" (2) disponíveis, e "Memorial do Convento" (3) emprestado.

Tempo previsto: 80 minutos para os exercícios 1 a 6.

## Exercício 1: onde vêm os dados

Guia: secções "Um formulário que muda alguma coisa" e "O corpo do pedido e o middleware que o lê".

Para cada pedido, diz onde vêm os dados (caminho, pesquisa ou corpo) e escreve como se leem no servidor, por exemplo `req.query.disponivel`.

1. `GET /livros/2`
2. Um formulário com `method="post"` e os campos `livro_id` e `leitor`, enviado para `/emprestimos`
3. Um formulário com `method="get"` e o campo `autor`, enviado para `/livros`
4. Um formulário com `method="post"`, enviado para `/emprestimos/4/devolucao`, sem campos, só com um botão
5. O mesmo formulário do pedido 2, com um campo escondido a mais, `<input type="hidden" name="origem" value="balcao">`

## Exercício 2: prever as respostas

Guia: secções "Validar no servidor", "Quando há erros" e "Quando corre bem".

O servidor da biblioteca, no fim desta ficha, acabou de arrancar e recebe estes pedidos `POST /emprestimos`, por esta ordem. Os números de leitor têm quatro algarismos, de 1000 a 9999. Para cada um, diz o código e o que o browser mostra. Se for o formulário outra vez, diz que mensagem aparece e em que campo.

| Corpo do pedido | Código | O que o browser mostra |
| --- | --- | --- |
| `livro_id=2&leitor=1234` | | |
| `livro_id=2&leitor=5678` | | |
| `livro_id=1&leitor=` | | |
| `livro_id=1&leitor=12` | | |
| `livro_id=3&leitor=1234` | | |

## Exercício 3: o formulário de empréstimo

Guia: secção "O formulário em HTML" e exemplo guiado, passo 1.

Acrescenta à biblioteca a rota `GET /emprestimos/novo`, com o modelo `views/emprestimo-novo.ejs`: um formulário que envia por `POST` para `/emprestimos`, com a lista dos livros (o campo `livro_id`) e o número de leitor (o campo `leitor`). Cada campo tem a sua etiqueta, ligada com o `for` e o `id`, e os atributos que ajudam quem preenche: o campo obrigatório e, no número de leitor, o mínimo e o máximo.

Decide que livros aparecem na lista: todos, ou só os disponíveis? Escreve a tua decisão e a razão no caderno. Pensa também nisto: se a lista só tiver os disponíveis, o servidor ainda tem de verificar se o livro está disponível?

Acrescenta ao menu do cabeçalho uma ligação para os empréstimos, que o exercício 5 vai criar.

**Resultado esperado:** `GET /emprestimos/novo` mostra o formulário; carregar numa etiqueta põe o cursor no campo; o browser não deixa enviar com o número de leitor 12.

## Exercício 4: o empréstimo

Guia: secções "Validar no servidor", "Quando há erros" e "Quando corre bem", e exemplo guiado, passos 3 e 4.

Acrescenta o `express.urlencoded` no sítio certo, uma função `validarEmprestimo`, e a rota `POST /emprestimos`. As regras:

- o livro tem de ser um livro que existe, e tem de estar disponível; são duas mensagens diferentes, porque a funcionária precisa de saber qual das duas falhou;
- o número de leitor é obrigatório e é um número inteiro de 1000 a 9999;
- com erros, a resposta é o formulário outra vez, com o 400, os valores que a funcionária escreveu e uma mensagem junto de cada campo errado;
- sem erros, o empréstimo fica guardado num array, com um `id` dado pelo servidor, o `livroId`, o `leitor` (como número) e `devolvido: false`, e o livro passa a não estar disponível.

Duas decisões são tuas. A primeira: em que ponto da função mudas o livro para não disponível, e porque é que tem de ser aí? Escreve a resposta no caderno. A segunda: para onde redirecionas a funcionária depois de um empréstimo certo? Para a lista dos empréstimos, para a página do livro, ou para o formulário vazio, pronto para o próximo? Escolhe uma, implementa-a com um 303, e justifica-a numa frase.

**Resultado esperado:** os cinco pedidos do exercício 2 dão o que lá previste, se a tua previsão estiver certa. Depois do primeiro, `GET /livros/disponiveis` só tem "Os Maias".

## Exercício 5: a lista dos empréstimos

Guia: exemplo guiado, passo 2.

Acrescenta a rota `GET /emprestimos`, com o modelo `views/emprestimos.ejs`: uma lista com cada empréstimo, o título do livro e o número de leitor, e uma mensagem quando ainda não há empréstimos. Faz com que a rota junte a cada empréstimo o seu livro, para o modelo só ter de mostrar.

Depois, faz um empréstimo e recarrega a página onde o redirecionamento te deixou. Confirma que não se criou um segundo empréstimo, e escreve no caderno porquê.

## Exercício 6: encontrar os erros

Guia: secções "Um formulário que muda alguma coisa" e "Quando corre bem". Os dois erros deste exercício não estão nos erros frequentes do guia, e nenhum deles dá mensagem de erro.

Um colega fez os exercícios 3 a 5, e a biblioteca dele tem dois problemas.

O primeiro: a funcionária preenche o formulário e carrega em "Emprestar". Aparece a lista dos empréstimos, sem empréstimo nenhum, e na barra de endereço fica `/emprestimos?livro_id=1&leitor=1234`. O terminal mostra `GET /emprestimos?livro_id=1&leitor=1234`.

1. O que está errado no formulário dele? Como o descobriste?
2. Porque é que o browser mostrou a lista, e não um erro?

O segundo: a funcionária tenta emprestar "Os Maias" com o leitor 12, recebe a mensagem do número de leitor, corrige para 1234 e volta a enviar. Desta vez, a mensagem é "Esse livro não está disponível.", e "Os Maias" já não aparece na lista dos livros disponíveis, embora a lista dos empréstimos esteja vazia. A rota dele começa assim:

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

## Para ires mais longe

Este exercício é opcional e não conta para o tempo da ficha.

**A devolução.** Na lista dos empréstimos, cada empréstimo que ainda não foi devolvido ganha um botão "Registar a devolução". O botão envia um `POST` para `/emprestimos/:id/devolucao`, com o número do empréstimo no caminho. A devolução marca o empréstimo como devolvido, volta a pôr o livro disponível e redireciona para a lista. Na ficha do tema 3, um formulário não conseguia pôr o número do empréstimo no caminho; com o EJS, consegue: pensa em como.

Decide os códigos e as páginas para estes casos, e escreve a tua decisão no caderno: o número do empréstimo não é um inteiro positivo; o empréstimo não existe; o empréstimo já foi devolvido; a devolução correu bem.

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1, 2 e 6, as decisões dos exercícios 3 e 4, e a pasta da biblioteca com os exercícios 3 a 5: o `server.js` e a pasta `views`. Não entregues a pasta `node_modules`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: porque é que o servidor da biblioteca verifica o número de leitor, se o formulário já tem o mínimo e o máximo.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
