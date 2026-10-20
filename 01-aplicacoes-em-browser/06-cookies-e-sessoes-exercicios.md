![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: cookies e sessões

Sexto tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](06-cookies-e-sessoes.md) e de fazeres o [laboratório](06-cookies-e-sessoes-laboratorio.md). Os exercícios 1, 2 e 6 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior, com os empréstimos.

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte.

## O que precisas de saber

O [guia](06-cookies-e-sessoes.md) e o [laboratório](06-cookies-e-sessoes-laboratorio.md) deste tema.

## Objetivo e contexto

No balcão da biblioteca há um computador partilhado, que várias funcionárias usam ao longo do dia. A biblioteca quer que a página inicial mostre os três livros vistos mais recentemente nesse browser, para se voltar depressa a um livro que se estava a consultar. E um botão para apagar esse histórico.

Não é um pedido em curso, como no guia: não se junta nada para confirmar no fim. E nada acaba com uma confirmação. É uma lembrança do que se fez. Isso obriga a decisões novas. Quanto dura a sessão num computador partilhado? Em que ordem mostras os livros? O que fazes a um livro visto duas vezes? Apagar o histórico termina a sessão inteira?

## Como trabalhar

Os exercícios 1 a 6 são o percurso obrigatório. Faz o desafio opcional depois. Guarda cada exercício numa cópia da tua pasta `biblioteca`, para poderes voltar à versão anterior.

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o que esperas, e só depois experimenta. Usa uma janela normal e uma anónima para teres duas sessões, e o separador dos cookies do browser para ver o que lá está.

Podes continuar mesmo sem ter tudo o que a ficha anterior pedia. Os exercícios 3 a 5 só precisam do array `livros`, da rota `GET /livros/:id` com a sua página. Precisas também da página inicial com os partials.


## Exercício 1: onde fica cada informação

Guia: secções "O HTTP não se lembra de nada", "O pedido fica no servidor, e o cookie só leva o número" e "Uma sessão não é uma autenticação".

Para cada informação, escolhe onde a guardas. As opções são uma variável do servidor, a sessão, o cookie ou nenhum destes sítios. A variável é comum a todos os browsers. A sessão fica no servidor, uma por browser. Justifica numa frase.

1. A lista dos livros da biblioteca.
2. Os livros vistos recentemente neste browser.
3. O identificador da sessão deste browser.
4. Os empréstimos registados.
5. O número de leitor que a funcionária escreveu no último empréstimo, para o formulário seguinte já o ter preenchido.
6. A garantia de que quem está ao balcão é mesmo a funcionária Marta.

## Exercício 2: prever

Guia: secções "A sessão com o express-session", "Os atributos do cookie" e "Terminar a sessão".

A biblioteca do fim desta ficha está a correr, com a sessão a expirar ao fim de 10 minutos. Para cada situação, diz o que mostra a página inicial, na parte dos livros vistos.

1. Na janela normal, vês "Os Maias", depois "Mensagem", depois outra vez "Os Maias", e voltas à página inicial.
2. Logo a seguir, abres a página inicial na janela anónima.
3. Na janela normal, vês os três livros, um a seguir ao outro, e depois um quarto pedido a `/livros/9`, que não existe. Voltas à página inicial.
4. Na janela normal, a funcionária vai almoçar e volta 15 minutos depois, sem tocar no computador. Recarrega a página inicial.
5. A biblioteca é reiniciada a meio da manhã. O que acontece aos livros vistos em todos os browsers?

## Exercício 3: a sessão da biblioteca

Guia: secção "A sessão com o express-session" e exemplo guiado, passo 1.

Acrescenta a sessão à biblioteca: o `express-session`, o `.env.example` e o `.env` com o `SESSION_SECRET`, o servidor a recusar arrancar sem o segredo. O middleware das sessões no sítio certo. Arranca com `node --watch --env-file=.env server.js`.

Escreve, ao lado de cada opção do middleware, um comentário com a razão do valor, como no guia. Duas decisões são tuas, e são diferentes das do catálogo:

- o nome do cookie, que não deve dizer que é do catálogo;
- a expiração. O computador do balcão é partilhado: quanto tempo deve uma sessão esquecida continuar aberta? Escolhe um valor, e escreve no caderno porque é diferente dos 30 minutos do catálogo.

**Resultado esperado:** sem `.env`, o servidor não arranca; com o segredo, arranca, e nenhuma página cria cookie ainda.

## Exercício 4: os livros vistos recentemente

Guia: secção "O que o middleware faz a cada pedido" e exemplo guiado, passos 2 e 3.

Sempre que a página de um livro é mostrada com sucesso, o livro passa a ser o mais recente da lista dos vistos, guardada na sessão. A página inicial mostra a lista, com o título de cada livro como ligação para a sua página, e só a mostra quando houver algum livro.

As regras são estas, e cada uma é uma decisão que tens de escrever no código:

- o mais recente aparece primeiro;
- um livro visto duas vezes aparece uma só vez, na posição da vez mais recente;
- a lista tem, no máximo, três livros;
- um pedido a um livro que não existe, ou com um identificador inválido, não entra na lista.

Decide também o que guardas na sessão para cada livro: o livro inteiro, ou só o seu `id`? Escreve a razão no caderno. Para mostrares os títulos na página inicial, segue o exemplo do guia: um middleware que põe a lista no `res.locals`.

**Resultado esperado:** depois de ver os livros 1, 2, 1, 3 e 2, por esta ordem, a página inicial mostra "Mensagem", "Memorial do Convento" e "Os Maias". Na janela anónima, a página inicial não mostra lista nenhuma.

## Exercício 5: apagar o histórico

Guia: secção "Terminar a sessão".

Na página inicial, por baixo da lista dos vistos, um botão "Apagar o histórico" envia um `POST` para `/historico/limpeza`, que apaga a lista e redireciona para a página inicial.

A decisão: destruir a sessão inteira, com o `req.session.destroy`, ou apagar só a lista dos vistos, com `delete req.session.vistos`? As duas apagam a lista. Pensa no que mais a sessão da biblioteca pode guardar (o desafio desta ficha guarda o número de leitor), e escreve no caderno qual escolheste e porquê.

## Exercício 6: encontrar os erros

Guia: secções "O que o middleware faz a cada pedido" e "Erros frequentes". Os dois erros deste exercício não estão nos erros frequentes do guia.

Antes de leres o erro, conhece `unshift`: é um método que acrescenta um elemento no início de um array já existente. `push` acrescenta no fim. Neste exemplo de números, prevê a ordem que aparece:

```js
// Um ensaio de unshift num array de números, independente da biblioteca.
const numeros = [4, 7];
numeros.unshift(2);
console.log(numeros);
```

O resultado é `[2, 4, 7]`. Primeiro o array contém 4 e 7; `unshift(2)` coloca o 2 antes deles e mantém a ordem dos restantes. O array passou a ter três elementos.

Um colega fez os exercícios 3 a 5, e a biblioteca dele tem dois problemas.

O primeiro: a página inicial abre bem, mas a primeira vez que se abre a página de um livro, dá 500, com `TypeError: Cannot read properties of undefined (reading 'unshift')`. A rota do livro dele termina assim:

```js fragment
  req.session.vistos.unshift(livro.id);
  res.render("livro", { titulo: livro.titulo, livro: livro });
});
```

1. Porque é que o erro aparece na primeira vez? O que é que o colega se esqueceu de fazer, que o guia faz no `POST /pedido/itens`?

O segundo: com o primeiro corrigido, as páginas dos livros e a lista funcionam, mas a página inicial dá 500, com `livrosVistos is not defined`. O colega pôs o middleware que enche o `res.locals.livrosVistos` logo antes do middleware final.

2. Porque é que só a página inicial falha, e as outras não?
3. No catálogo do guia, o mesmo engano com o `itensNoPedido` faria falhar todas as páginas. Porquê a diferença?
4. Onde deve ficar o middleware?

## Apoio

- Exercício 1: Pergunta se a informação pertence a todos ou só a este browser.
- Exercício 2: Segue separadamente as duas janelas e a vida do servidor.
- Exercício 3: Liga o nome e a duração ao uso do balcão partilhado.
- Exercício 4: Testa um repetido, o quarto acesso e um livro inexistente.
- Exercício 5: Pensa no que mais pode estar guardado na mesma sessão.
- Exercício 6: Segue a ordem dos middlewares e confirma se a lista já existe antes de a usar.

## Desafio opcional

Este exercício é opcional. Faz primeiro os exercícios 1 a 6.

**O leitor lembrado.** Depois de um empréstimo certo, o número de leitor fica guardado na sessão, e o formulário de empréstimo seguinte já o traz preenchido. Implementa-o. Depois, pensa no computador partilhado do balcão: a funcionária seguinte vê o número de leitor da anterior. Isto é um problema? O que limita esse problema na tua configuração? Escreve a tua resposta no caderno, e diz se mantinhas esta funcionalidade.

## Critérios de conclusão

- Os exercícios obrigatórios estão resolvidos, com as decisões pedidas por escrito.
- O servidor responde aos casos de teste do enunciado.
- Cada erro encontrado tem um caso reproduzível e uma explicação da causa.
- A entrega inclui os ficheiros pedidos e exclui `node_modules` e segredos.

## Entrega


Entrega as respostas dos exercícios 1, 2 e 6, as decisões dos exercícios 3 a 5, e a pasta da biblioteca: o `server.js`, a pasta `views` e o `.env.example`. Não entregues o `.env` nem a pasta `node_modules`.

## Autoavaliação

No fim, responde por escrito:

- O que consigo explicar sem ajuda: porque é que a janela anónima não vê os livros vistos na janela normal, com os cabeçalhos `Set-Cookie` e `Cookie`.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
