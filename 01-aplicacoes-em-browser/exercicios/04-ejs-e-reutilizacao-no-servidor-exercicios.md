![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: EJS e reutilização no servidor

Praticas, no servidor da biblioteca, as páginas feitas a partir de modelos: os ciclos e as condições, o escaping, o cabeçalho e o rodapé partilhados e as páginas de erro. Os exercícios 1 a 6 são obrigatórios, por esta ordem. Os exercícios 1, 2 e 6 respondem-se sem correr código, e o 6 confirma-se no fim, numa cópia da biblioteca. As respostas vão para o `respostas-04.md`, um ficheiro de texto na tua pasta de Sistemas de Informação, fora do projeto `biblioteca`. Antes de cada resposta, põe o exercício e a alínea, como 1.2 ou 2.5. Entrega o `respostas-04.md`, o `server.js` e a pasta `views` da biblioteca. Para rever: o [guia do tema](../04-ejs-e-reutilizacao-no-servidor.md).

## O cenário

No fim da ficha do tema 03, o servidor da biblioteca responde com JSON: a lista, com o filtro `?disponivel=`, os disponíveis, um livro de cada vez e os erros. Nesta ficha passa a responder com páginas, como o catálogo do guia.

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

Os exercícios 3 a 5 precisam deste array, da rota `/` e da rota `/livros/:id`, com as verificações do [exercício 3 da ficha anterior](03-http-rotas-e-middleware-exercicios.md#exercício-3-um-livro-de-cada-vez). O que te faltar da ficha anterior (o filtro, os disponíveis ou o middleware final) fazes nos exercícios 3 e 5, que dizem o que cada um responde. Se ainda não tens o servidor, prepara-o como em [No servidor da biblioteca](02-primeiro-servidor-exercicios.md#no-servidor-da-biblioteca), na ficha do tema 02. Confirma cada resultado esperado no browser: o código-fonte da página mostra o HTML que chegou, e o separador Rede, o código de estado.

## Exercício 1: prever a página

O modelo da lista é este:

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

1. Escreve o HTML que o browser recebe com os dados `{ titulo: "Todos os livros", livros: livros }`, com o array do cenário. Podes ignorar as linhas em branco e os espaços no início das linhas.
2. Quantas vezes corre o `if`, neste caso? E quantas vezes aparece a palavra `emprestado` no código-fonte da página?
3. E se os dados forem `{ titulo: "Nenhum", livros: [] }`? O que é que o utilizador vê, e o que é que achas que devia ver?

Rever: [Ciclos e condições dentro do modelo](../04-ejs-e-reutilizacao-no-servidor.md#ciclos-e-condições-dentro-do-modelo).

<details>
<summary>Pista</summary>

Faz uma tabela com uma linha por volta do ciclo, como a do guia, e escreve em cada linha o HTML que essa volta junta à página.

</details>

## Exercício 2: escaping ou não

Para cada valor, diz se entra na página com `<%=` ou com `<%-`, e justifica numa frase.

1. O título de um livro, que vem do array `livros`.
2. O `include` do rodapé da biblioteca.
3. O autor que o leitor escreveu num campo de pesquisa, para a página dizer "Pesquisa por autor: ...".
4. O valor que veio em `?disponivel=`, para a página de erro dizer que não serve.
5. A descrição de um livro, que o bibliotecário escreveu com etiquetas `<em>` para pôr os títulos em itálico.

Rever: [Escaping: o que vem de fora nunca vira HTML](../04-ejs-e-reutilizacao-no-servidor.md#escaping-o-que-vem-de-fora-nunca-vira-html) e [Partes partilhadas: o cabeçalho e o rodapé](../04-ejs-e-reutilizacao-no-servidor.md#partes-partilhadas-o-cabeçalho-e-o-rodapé).

<details>
<summary>Pista</summary>

Em cada caso, pensa no que o browser recebia com cada uma das duas marcas, se o valor trouxesse um `<`.

</details>

## Exercício 3: a lista como página

Prepara a biblioteca para o EJS (o `npm install ejs@7.0.1`, o `app.set` e a pasta `views`) e cria o modelo `views/livros.ejs`, com o título e a lista dos livros. Cada livro mostra o título, o autor e o estado, escrito como "disponível" ou "emprestado". Nunca como `true` ou `false`: quem lê a página não sabe o que é um booleano.

Muda as rotas:

1. `GET /livros` responde com esta página. Com `?disponivel=true` ou `?disponivel=false`, mostra só os livros desse estado, e o título da página diz qual é a lista.
2. `GET /livros/disponiveis` responde com a mesma página, o mesmo `livros.ejs`, com outro título e só os livros disponíveis.
3. Com um valor de `?disponivel=` que não seja `true` nem `false`, a resposta continua a ser 400, mas agora é uma página de erro. Cria o modelo `views/erro.ejs`, com um título e uma mensagem, e faz a mensagem dizer qual foi o valor recebido, para o leitor perceber o que escreveu mal.

Para escolher os livros de cada estado, podes usar o `filter` ou um ciclo: nenhum é obrigatório.

Resultado esperado:

| Pedido | Código | O que a página mostra |
| --- | --- | --- |
| `GET /livros` | 200 | Os três livros, dois disponíveis e um emprestado |
| `GET /livros?disponivel=false` | 200 | Só o "Memorial do Convento", emprestado, com um título que o diga |
| `GET /livros/disponiveis` | 200 | "Os Maias" e "Mensagem", com o título dos disponíveis |
| `GET /livros?disponivel=talvez` | 400 | A página de erro, com o valor `talvez` na mensagem |
| `GET /livros?disponivel=<b>talvez</b>` | 400 | A página de erro, com `<b>talvez</b>` escrito como texto, sem negrito |
| `GET /livros?disponivel=true` | 200 | "Os Maias" e "Mensagem", com um título que o diga |
| `GET /livros?disponivel=` | 400 | A página de erro |

Em nenhum destes pedidos o terminal mostra um erro.

Rever: [O Express procura os modelos na pasta views](../04-ejs-e-reutilizacao-no-servidor.md#o-express-procura-os-modelos-na-pasta-views), [O res.render responde com uma página](../04-ejs-e-reutilizacao-no-servidor.md#o-resrender-responde-com-uma-página) e [Um erro também se responde com uma página](../04-ejs-e-reutilizacao-no-servidor.md#um-erro-também-se-responde-com-uma-página).

<details>
<summary>Pista</summary>

Se a página mostra `true` ou `false` no estado de um livro, volta ao modelo do exercício 1.

</details>

<details>
<summary>Pista</summary>

Se, com `?disponivel=<b>talvez</b>`, a palavra aparece a negrito, vê com que marca a mensagem entra na página.

</details>

## Exercício 4: um livro de cada vez

Cria o modelo `views/livro.ejs`, com o título do livro como título da página, o autor e o estado, escrito como no exercício 3. Na página da lista, o título de cada livro passa a ser uma ligação para a sua página.

A página de cada livro tem sempre a ligação "Voltar à lista", para `/livros`. Quando o livro está emprestado, mostra também "Ver livros disponíveis", para `/livros/disponiveis`. Quando está disponível, essa segunda ligação não aparece. Decide onde colocar a condição no modelo, sem criar outra página de detalhe.

A rota `GET /livros/:id` responde com esta página. Os três erros passam a usar o `erro.ejs` do exercício 3. Mantém os códigos e as duas mensagens de 400 da ficha anterior, uma para cada regra do identificador.

Resultado esperado:

| Pedido | Código | O que a página mostra |
| --- | --- | --- |
| `GET /livros/1` | 200 | "Os Maias", de Eça de Queirós, disponível; "Voltar à lista", sem "Ver livros disponíveis" |
| `GET /livros/3` | 200 | "Memorial do Convento", de José Saramago, emprestado; as duas ligações |
| `GET /livros/x` | 400 | A página de erro, com a mensagem do número inteiro |
| `GET /livros/-3` | 400 | A página de erro, com a mensagem do maior do que zero |
| `GET /livros/7` | 404 | A página de erro, a dizer que o livro 7 não existe |
| `GET /livros` | 200 | Cada título é uma ligação para a página do livro: a do "Memorial do Convento" abre `/livros/3` |

Rever: [Passo 4: a página de um equipamento](../04-ejs-e-reutilizacao-no-servidor.md#passo-4-a-página-de-um-equipamento), [Passo 6: as páginas de erro](../04-ejs-e-reutilizacao-no-servidor.md#passo-6-as-páginas-de-erro) e [Ciclos e condições dentro do modelo](../04-ejs-e-reutilizacao-no-servidor.md#ciclos-e-condições-dentro-do-modelo).

<details>
<summary>Pista</summary>

Se `/livros/x` mostra a página de erro certa com o código 404, e a seguir o servidor deixa de responder, procura esse caso nos erros frequentes do guia: [A página de erro certa, com o código errado, e o servidor em baixo](../04-ejs-e-reutilizacao-no-servidor.md#a-página-de-erro-certa-com-o-código-errado-e-o-servidor-em-baixo).

</details>

## Exercício 5: o cabeçalho, o rodapé e o resto

1. Cria os partials `cabecalho.ejs` e `rodape.ejs` da biblioteca, em `views/partials`, e usa-os em todas as páginas. O menu do cabeçalho tem três ligações: o início, todos os livros e os livros disponíveis. Identifica a ligação da página atual com negrito ou com um texto, como `(estás aqui)`, sem acrescentar CSS.
2. A rota `/` deixa de responder com texto e passa a responder com uma página inicial, `views/inicio.ejs`, com uma frase sobre a biblioteca.
3. O middleware final passa a responder com a página de erro, com o 404 e uma mensagem tua.

Cada rota passa ao modelo um dado chamado `paginaAtiva`, além dos dados que já passava, com os valores que escolheres. O cabeçalho usa-o para decidir qual das três ligações fica identificada.

Resultado esperado:

| Página | Ligação identificada no menu |
| --- | --- |
| `/` | Início |
| `/livros`, sem filtro | Todos os livros |
| `/livros/disponiveis` | Disponíveis |
| `/livros?disponivel=true` | Disponíveis |
| `/livros?disponivel=false` | Nenhuma |
| Detalhe de qualquer livro | Nenhuma |
| Qualquer página de erro 400 ou 404 | Nenhuma |

Todas estas páginas mantêm as três ligações do menu e o rodapé, e o separador do browser mostra o título da página.

Rever: [Partes partilhadas: o cabeçalho e o rodapé](../04-ejs-e-reutilizacao-no-servidor.md#partes-partilhadas-o-cabeçalho-e-o-rodapé), [Passo 5: o cabeçalho e o rodapé em partials](../04-ejs-e-reutilizacao-no-servidor.md#passo-5-o-cabeçalho-e-o-rodapé-em-partials) e [Ciclos e condições dentro do modelo](../04-ejs-e-reutilizacao-no-servidor.md#ciclos-e-condições-dentro-do-modelo).

<details>
<summary>Pista</summary>

Se uma página dá um erro `... is not defined` que aponta para o cabeçalho, vê o que a rota dessa página passa no `res.render`.

</details>

## Exercício 6: encontrar o erro

Um colega fez os exercícios 3 e 5. O pedido `GET /livros` recebe o código 500, e o terminal aponta para o ciclo do modelo. O pedido `GET /livros/disponiveis` continua a mostrar os dois livros disponíveis, usando o mesmo `livros.ejs`.

Na rota `/livros`, quando não há filtro, a chamada é esta (o array `livros` é o do cenário):

```js fragment
res.render("livros", { titulo: "Todos os livros", livros: livros.length, paginaAtiva: "livros" });
```

A rota `/livros/disponiveis` é a do exercício 3. A parte do modelo que mostra a lista é esta:

```ejs fragment
<ul>
  <% for (const livro of livros) { %>
    <li><%= livro.titulo %></li>
  <% } %>
</ul>
```

O erro está num só sítio: o resto do servidor e o modelo estão corretos. Responde no `respostas-04.md`:

1. Identifica o que provoca o erro e explica a causa.
2. Escreve a chamada corrigida, sem mudar o modelo.
3. Porque funciona a outra rota com o mesmo modelo?

Resultado esperado: numa cópia da pasta `biblioteca`, com a chamada do colega, `GET /livros` dá 500. Com a tua correção, mostra os três livros, e `GET /livros/disponiveis` continua a mostrar os dois disponíveis.

Rever: [O res.render responde com uma página](../04-ejs-e-reutilizacao-no-servidor.md#o-resrender-responde-com-uma-página) e [Ciclos e condições dentro do modelo](../04-ejs-e-reutilizacao-no-servidor.md#ciclos-e-condições-dentro-do-modelo).

<details>
<summary>Pista</summary>

Segue o valor da propriedade `livros` desde a chamada da rota até ao `for` do modelo.

</details>

## Desafios

### A contagem

Acrescenta a frase "3 livros, 2 disponíveis" por cima da lista, apenas na página de todos os livros, `GET /livros` sem filtro. As listas filtradas e a de `/livros/disponiveis` continuam a funcionar, mas não mostram esta frase. Usa o dado de identificação da página do exercício 5 para distinguir os casos, mantendo o mesmo modelo de lista.

Decide onde se fazem as duas contas: na rota, que passa os números ao modelo, ou no modelo, a partir da lista. Escreve a tua decisão e a razão num comentário junto do código que faz as contas, com `//` no `server.js` ou com `<%# … %>` no modelo. Ambas as escolhas são válidas quando cumprem o resultado pedido.

Resultado esperado em `GET /livros`, numa cópia em que mudas o array:

| Livros no array | Frase |
| --- | --- |
| Os três | `3 livros, 2 disponíveis` |
| Os três, com um só disponível | `3 livros, 1 disponível` |
| Só "Os Maias", disponível | `1 livro, 1 disponível` |
| Só o "Memorial do Convento", emprestado | `1 livro, 0 disponíveis` |
| Nenhum | `0 livros, 0 disponíveis` |

Em todos, as listas filtradas continuam a responder, sem a frase.

Rever: [A rota escolhe os dados, e o modelo mostra-os](../04-ejs-e-reutilizacao-no-servidor.md#a-rota-escolhe-os-dados-e-o-modelo-mostra-os).

## Critérios de conclusão

- O `respostas-04.md` tem os exercícios 1, 2 e 6 respondidos, cada resposta com o exercício e a alínea.
- A biblioteca responde com páginas aos pedidos dos resultados esperados dos exercícios 3 e 4, com os mesmos códigos.
- Todas as páginas, também as de erro, têm o menu com as três ligações, com a página atual identificada como no exercício 5, e o rodapé.
- Se fizeste o desafio, a frase da contagem aparece só em `/livros`, sem filtro, com o singular e o plural certos, e as outras listas continuam a responder.

![Rodapé](../../imagens/rodape.png)
