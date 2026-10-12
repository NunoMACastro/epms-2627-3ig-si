![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: EJS e reutilização no servidor

Quarto tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](04-ejs-e-reutilizacao-no-servidor.md) e de fazeres o [laboratório](04-ejs-e-reutilizacao-no-servidor-laboratorio.md). Os exercícios 1, 2 e 6 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior.

## Objetivo e contexto

O servidor da biblioteca responde, por agora, com JSON: a lista dos livros, com o filtro `?disponivel=`, os livros disponíveis, um livro de cada vez e os erros. Nesta ficha passa a responder com páginas, como o catálogo do guia. Pelo caminho, tens de tomar decisões que o catálogo não tomou: como mostrar um valor que é `true` ou `false` a quem lê a página, como usar o mesmo modelo em duas rotas diferentes, e como mostrar, numa página de erro, um valor que veio do pedido.

## Como trabalhar

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o que esperas ver, e só depois abre o browser. Usa o código-fonte da página e o separador Rede para confirmar o que chegou e com que código.

Se o teu servidor da biblioteca não tiver tudo o que a ficha do tema anterior pedia, não faz mal: os exercícios 3 a 5 só precisam do array `livros`, da rota `/` e da rota `/livros/:id` com as suas verificações. O array é este:

```js
const livros = [
  { id: 1, titulo: "Os Maias", autor: "Eça de Queirós", disponivel: true },
  { id: 2, titulo: "Mensagem", autor: "Fernando Pessoa", disponivel: true },
  { id: 3, titulo: "Memorial do Convento", autor: "José Saramago", disponivel: false },
];
```

Tempo previsto: 70 minutos para os exercícios 1 a 6.

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

Prepara a biblioteca para o EJS (o `npm install ejs`, o `app.set` e a pasta `views`) e cria o modelo `views/livros.ejs`, com o título e a lista dos livros. Cada livro mostra o título, o autor e o estado, escrito como "disponível" ou "emprestado", e nunca como `true` ou `false`: quem lê a página não sabe o que é um booleano.

Muda as rotas:

1. `GET /livros` responde com esta página. Com `?disponivel=true` ou `?disponivel=false`, mostra só os livros desse estado, e o título da página diz qual é a lista.
2. `GET /livros/disponiveis` responde com a mesma página, o mesmo `livros.ejs`, com outro título e só os livros disponíveis. Não cries um segundo modelo: decide o que muda no `res.render`.
3. Com um valor de `?disponivel=` que não seja `true` nem `false`, a resposta continua a ser 400, mas agora é uma página de erro. Cria o modelo `views/erro.ejs`, com um título e uma mensagem, e faz a mensagem dizer qual foi o valor recebido, para o leitor perceber o que escreveu mal.

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

A rota `GET /livros/:id` responde com esta página, e os seus três erros passam a usar o `erro.ejs` do exercício 3, com os mesmos códigos e as mesmas duas mensagens de 400 da ficha anterior, uma para cada regra do identificador. Usa um só modelo de erro para os três casos.

**Resultado esperado:**

| Pedido | Código | O que a página mostra |
| --- | --- | --- |
| `GET /livros/3` | 200 | "Memorial do Convento", de José Saramago, emprestado |
| `GET /livros/x` | 400 | A página de erro, com a mensagem do número inteiro |
| `GET /livros/-3` | 400 | A página de erro, com a mensagem do maior do que zero |
| `GET /livros/7` | 404 | A página de erro, a dizer que o livro 7 não existe |

## Exercício 5: o cabeçalho, o rodapé e o resto

Guia: secção "Partes partilhadas: o cabeçalho e o rodapé" e exemplo guiado, passo 5.

1. Cria os partials `cabecalho.ejs` e `rodape.ejs` da biblioteca, em `views/partials`, e usa-os em todas as páginas. O menu do cabeçalho tem três ligações: o início, todos os livros e os livros disponíveis.
2. A rota `/` deixa de responder com texto e passa a responder com uma página inicial, `views/inicio.ejs`, com uma frase sobre a biblioteca.
3. O middleware final passa a responder com a página de erro, com o 404 e uma mensagem tua.

Antes de dares o exercício por acabado, abre todas as páginas da biblioteca, incluindo as de erro, e confirma que nenhuma ficou sem menu, sem rodapé ou com o título errado no separador do browser.

## Exercício 6: encontrar os erros

Guia: secção "Erros frequentes". Os dois erros deste exercício não estão no guia, mas as mensagens leem-se da mesma maneira.

Um colega fez os exercícios 3 e 5, e a biblioteca dele tem dois problemas.

O primeiro: `GET /livros` dá uma página de erro com o código 500, que acaba em `livros is not defined`, e `GET /livros/disponiveis`, que usa o mesmo modelo, funciona. A rota `/livros` dele tem esta linha:

```js fragment
res.render("livros", { titulo: "Todos os livros", lista: livros });
```

1. Porque é que o erro diz que `livros` não está definido, se o array `livros` existe no `server.js`?
2. Porque é que a outra rota, com o mesmo modelo, funciona?
3. Qual é a correção mais pequena?

O segundo: depois de mudar o estado de cada livro, todas as rotas que mostram a lista dão `SyntaxError: Unexpected token 'else' ... while compiling ejs`. A linha que ele mudou no `livros.ejs` é esta:

```ejs
<% if (livro.disponivel) %>disponível<% } else { %>emprestado<% } %>
```

4. Encontra o erro e escreve a linha corrigida.
5. Porque é que esta mensagem aparece em todas as rotas que usam o `livros.ejs`, e a do primeiro problema só aparecia numa?

## Para ires mais longe

Este exercício é opcional e não conta para o tempo da ficha.

**A contagem.** Na página de todos os livros, por cima da lista, a frase "3 livros, 2 disponíveis". Decide onde se fazem as duas contas: na rota, que passa os números ao modelo, ou no modelo, a partir da lista. Escreve a tua decisão e a razão, com a secção "Ciclos e condições dentro do modelo" do guia ao lado, e implementa-a. A frase também deve aparecer bem quando só houver um livro.

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1, 2 e 6 e a pasta da biblioteca com os exercícios 3 a 5: o `server.js` e a pasta `views`. Não entregues a pasta `node_modules`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: porque é que o browser nunca executa os modelos da biblioteca, com uma página tua como exemplo.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
