![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: EJS e reutilização no servidor

Quarto tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](04-ejs-e-reutilizacao-no-servidor.md) e de fazeres o [laboratório](04-ejs-e-reutilizacao-no-servidor-laboratorio.md). Os exercícios 1, 2 e 6 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior.

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte.

## O que precisas de saber

O [guia](04-ejs-e-reutilizacao-no-servidor.md) e o [laboratório](04-ejs-e-reutilizacao-no-servidor-laboratorio.md) deste tema.

## Objetivo e contexto

O servidor da biblioteca responde, por agora, com JSON: a lista dos livros, com o filtro `?disponivel=`, os livros disponíveis, um livro de cada vez e os erros. Nesta ficha passa a responder com páginas, como o catálogo do guia. Pelo caminho, tens de tomar decisões que o catálogo não tomou. Como mostras um valor `true` ou `false` a quem lê a página? Como usas o mesmo modelo em duas rotas diferentes? Como mostras, numa página de erro, um valor que veio do pedido?

## Como trabalhar

Os exercícios 1 a 6 são o percurso obrigatório. Faz o desafio opcional depois. Guarda cada exercício numa cópia da tua pasta `biblioteca`, para poderes voltar à versão anterior.

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o que esperas ver, e só depois abre o browser. Usa o código-fonte da página e o separador Rede para confirmar o que chegou e com que código.

Podes fazer os exercícios mesmo que a tua biblioteca ainda não tenha tudo o que a ficha anterior pedia. Os exercícios 3 a 5 só precisam do array `livros`, da rota `/` e da rota `/livros/:id` com as suas verificações. O array é este:

```js
const livros = [
  { id: 1, titulo: "Os Maias", autor: "Eça de Queirós", disponivel: true },
  { id: 2, titulo: "Mensagem", autor: "Fernando Pessoa", disponivel: true },
  { id: 3, titulo: "Memorial do Convento", autor: "José Saramago", disponivel: false },
];
```


## Exercício 1: prever a página

Guia: secção "Ciclos e condições dentro do modelo".

Neste modelo, a condição está dentro do ciclo, e não à volta dele, como no guia:

```ejs
<h1><%= titulo %></h1>
<ul>
  <% for (const livro of livros) { %>
    <li>
      <%= livro.titulo %>:
      <% if (livro.disponivel) { %>disponível<% } else { %>emprestado<% } %>
    </li>
  <% } %>
</ul>
```

1. Escreve o HTML que o browser recebe com os dados `{ titulo: "Todos os livros", livros: livros }`, com o array acima. Podes ignorar as linhas em branco e os espaços no início das linhas.
2. Quantas vezes corre o `if`, neste caso? E quantas vezes aparece a palavra `emprestado` no código-fonte da página?
3. E se os dados forem `{ titulo: "Nenhum", livros: [] }`? O que é que o utilizador vê, e o que é que achas que devia ver?

## Exercício 2: escaping ou não

Guia: secção "Escaping: o que vem de fora nunca vira HTML".

Para cada valor, diz se entra na página com `<%=` ou com `<%-`, e justifica numa frase.

1. O título de um livro, que vem do array `livros`.
2. O `include` do rodapé da biblioteca.
3. O autor que o leitor escreveu num campo de pesquisa, para a página dizer "Pesquisa por autor: ...".
4. O valor que veio em `?disponivel=`, para a página de erro dizer que não serve.
5. A descrição de um livro, que o bibliotecário escreveu com etiquetas `<em>` para pôr os títulos em itálico. Pensa bem neste: quem escreveu o valor merece confiança, mas o que acontece se alguém se enganar, ou se um dia a descrição vier de um formulário?

## Exercício 3: a lista como página

Guia: exemplo guiado, passos 1 a 3 e 6.

Prepara a biblioteca para o EJS (o `npm install ejs@7.0.1`, o `app.set` e a pasta `views`) e cria o modelo `views/livros.ejs`, com o título e a lista dos livros. Cada livro mostra o título, o autor e o estado, escrito como "disponível" ou "emprestado". Nunca como `true` ou `false`: quem lê a página não sabe o que é um booleano.

Muda as rotas:

1. `GET /livros` responde com esta página. Com `?disponivel=true` ou `?disponivel=false`, mostra só os livros desse estado, e o título da página diz qual é a lista.
2. `GET /livros/disponiveis` responde com a mesma página, o mesmo `livros.ejs`, com outro título e só os livros disponíveis. Não cries um segundo modelo: decide o que muda no `res.render`.
3. Com um valor de `?disponivel=` que não seja `true` nem `false`, a resposta continua a ser 400, mas agora é uma página de erro. Cria o modelo `views/erro.ejs`, com um título e uma mensagem, e faz a mensagem dizer qual foi o valor recebido, para o leitor perceber o que escreveu mal.

Para selecionar os livros de cada estado, podes usar `filter` ou ciclos equivalentes. O que conta é a lista escolhida e a resposta aos casos de teste.

**Resultado esperado:**

| Pedido | Código | O que a página mostra |
| --- | --- | --- |
| `GET /livros` | 200 | Os três livros, dois disponíveis e um emprestado |
| `GET /livros?disponivel=false` | 200 | Só o "Memorial do Convento", emprestado, com um título que o diga |
| `GET /livros/disponiveis` | 200 | "Os Maias" e "Mensagem", com o título dos disponíveis |
| `GET /livros?disponivel=talvez` | 400 | A página de erro, com o valor `talvez` na mensagem |
| `GET /livros?disponivel=<b>talvez</b>` | 400 | A página de erro, com `<b>talvez</b>` escrito como texto, sem negrito |

## Exercício 4: um livro de cada vez

Guia: exemplo guiado, passos 4 e 6.

Cria o modelo `views/livro.ejs`, com o título do livro como título da página, o autor e o estado, escrito como no exercício 3. Na página da lista, o título de cada livro passa a ser uma ligação para a sua página.

A página de cada livro tem sempre a ligação "Voltar à lista", para `/livros`. Quando o livro está emprestado, mostra também "Ver livros disponíveis", para `/livros/disponiveis`. Quando está disponível, essa segunda ligação não aparece. Decide onde colocar a condição no modelo, sem criar outra página de detalhe.

A rota `GET /livros/:id` responde com esta página. Os três erros passam a usar o `erro.ejs` do exercício 3. Mantém os códigos e as duas mensagens de 400 da ficha anterior, uma para cada regra do identificador. Usa um só modelo de erro para os três casos.

**Resultado esperado:**

| Pedido | Código | O que a página mostra |
| --- | --- | --- |
| `GET /livros/1` | 200 | "Os Maias", de Eça de Queirós, disponível; "Voltar à lista", sem "Ver livros disponíveis" |
| `GET /livros/3` | 200 | "Memorial do Convento", de José Saramago, emprestado; as duas ligações |
| `GET /livros/x` | 400 | A página de erro, com a mensagem do número inteiro |
| `GET /livros/-3` | 400 | A página de erro, com a mensagem do maior do que zero |
| `GET /livros/7` | 404 | A página de erro, a dizer que o livro 7 não existe |

## Exercício 5: o cabeçalho, o rodapé e o resto

Guia: secção "Partes partilhadas: o cabeçalho e o rodapé" e exemplo guiado, passo 5.

1. Cria os partials `cabecalho.ejs` e `rodape.ejs` da biblioteca, em `views/partials`, e usa-os em todas as páginas. O menu do cabeçalho tem três ligações: o início, todos os livros e os livros disponíveis. Identifica a ligação da página atual com negrito ou um texto equivalente, sem acrescentar CSS.
2. A rota `/` deixa de responder com texto e passa a responder com uma página inicial, `views/inicio.ejs`, com uma frase sobre a biblioteca.
3. O middleware final passa a responder com a página de erro, com o 404 e uma mensagem tua.

Cada rota passa ao modelo um dado chamado `paginaAtiva`, além dos dados que já passava. Escolhe os seus valores e usa condições no cabeçalho para decidir qual das três ligações fica identificada. Na versão final, todas as chamadas a `res.render` fornecem esse dado, incluindo as respostas de erro.

Confirma estes casos:

| Página | Ligação identificada no menu |
| --- | --- |
| `/` | Início |
| `/livros`, sem filtro | Todos os livros |
| `/livros/disponiveis` | Disponíveis |
| `/livros?disponivel=true` | Disponíveis |
| `/livros?disponivel=false` | Nenhuma |
| Detalhe de qualquer livro | Nenhuma |
| Qualquer página de erro 400 ou 404 | Nenhuma |

Antes de dares o exercício por acabado, abre todas estas páginas. Confirma que mantêm as três ligações do menu, o rodapé e o título certo no separador do browser.

## Exercício 6: encontrar o erro

Guia: secção "Erros frequentes". Este exercício tem um erro intencional que o guia não mostrou.

Um colega fez os exercícios 3 e 5. O pedido `GET /livros` recebe o código 500, e o terminal aponta para o ciclo do modelo. O pedido `GET /livros/disponiveis` continua a mostrar os dois livros disponíveis, usando o mesmo `livros.ejs`.

Na rota `/livros`, quando não há filtro, a chamada é esta. Usa o array `livros` do início da ficha:

```js fragment
res.render("livros", { titulo: "Todos os livros", livros: livros.length, paginaAtiva: "livros" });
```

A propriedade `paginaAtiva` usa aqui o valor `"livros"` para identificar "Todos os livros" no menu e está correta. A rota `/livros/disponiveis` passa a lista dos dois livros disponíveis na propriedade `livros`, como no exercício 3. Também fornece o valor correto de `paginaAtiva` para identificar "Disponíveis". A parte do modelo que mostra a lista é esta:

```ejs fragment
<ul>
  <% for (const livro of livros) { %>
    <li><%= livro.titulo %></li>
  <% } %>
</ul>
```

Responde primeiro em papel, antes de experimentar:

1. Que valor e que tipo recebe o modelo na propriedade `livros`, em `GET /livros`? Segue esse valor até ao ciclo e explica a causa do erro.
2. Escreve a chamada corrigida, mudando apenas o segundo argumento de `res.render`. Mantém o modelo.
3. Porque funciona a outra rota com o mesmo modelo? Prevê o que cada pedido deve mostrar depois da correção. Só depois experimenta os dois pedidos numa cópia da biblioteca e compara com a previsão.

## Apoio

- Exercício 1: Segue um livro de cada vez e separa o modelo do HTML produzido.
- Exercício 2: Distingue os ficheiros escritos por ti dos valores recebidos.
- Exercício 3: Compara o que cada rota precisa de passar ao mesmo modelo.
- Exercício 4: Separa a validade do identificador da existência do livro.
- Exercício 5: Confere cada página, incluindo os erros.
- Exercício 6: Segue o valor desde a chamada da rota até à instrução do modelo onde o erro aparece. Muda uma causa de cada vez.

## Desafio opcional

Este exercício é opcional. Faz primeiro os exercícios 1 a 6.

**A contagem.** Acrescenta a frase "3 livros, 2 disponíveis" por cima da lista, apenas na página de todos os livros, `GET /livros` sem filtro. As listas filtradas e a de `/livros/disponiveis` continuam a funcionar, mas não mostram esta frase. Usa o dado de identificação da página do exercício 5 para distinguir os casos, mantendo o mesmo modelo de lista.

Decide onde se fazem as duas contas: na rota, que passa os números ao modelo, ou no modelo, a partir da lista. Escreve a tua decisão e a razão, com a secção "Ciclos e condições dentro do modelo" do guia ao lado, e implementa-a. Ambas as escolhas são válidas quando cumprem o resultado pedido.

Experimenta numa cópia com os três livros, depois com apenas um disponível, com apenas um emprestado e sem livros. Confirma o singular e o plural nas duas partes da frase, incluindo quando existe um único livro disponível. Depois de cada alteração, verifica também as listas filtradas: não devem mostrar a frase nem deixar de responder.

## Critérios de conclusão

- Os exercícios obrigatórios estão resolvidos, com as decisões pedidas por escrito.
- O servidor responde aos casos de teste do enunciado.
- Cada erro encontrado tem um caso reproduzível e uma explicação da causa.
- A entrega inclui os ficheiros pedidos e exclui `node_modules` e segredos.

## Entrega


Entrega as respostas dos exercícios 1, 2 e 6 e a pasta da biblioteca com os exercícios 3 a 5: o `server.js` e a pasta `views`. Não entregues a pasta `node_modules`.

## Autoavaliação

No fim, responde por escrito:

- O que consigo explicar sem ajuda: porque é que o browser nunca executa os modelos da biblioteca, com uma página tua como exemplo.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
