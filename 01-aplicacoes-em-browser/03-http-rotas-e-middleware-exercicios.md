![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: HTTP, rotas e middleware

Terceiro tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](03-http-rotas-e-middleware.md) e de fazeres o [laboratório](03-http-rotas-e-middleware-laboratorio.md). Os exercícios 1, 2 e 5 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior.

## Objetivo e contexto

O servidor da biblioteca responde, por agora, à lista dos livros, aos livros disponíveis e a um resumo. Nesta ficha passa a mostrar um livro de cada vez, a filtrar a lista e a registar empréstimos. Pelo caminho, tens de tomar decisões que o catálogo do guia não tomou: o que fazer com um parâmetro de pesquisa que só pode ter dois valores, e o que fazer quando um empréstimo muda o estado de um livro.

## Como trabalhar

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o resultado que esperas, e só depois abre o browser. Usa o separador Rede para confirmar o código de cada resposta.

Se o teu servidor da biblioteca não tiver as rotas da ficha anterior, não faz mal: os exercícios 3, 4 e 6 só precisam do array `livros` e da rota `/`.

Tempo previsto: 90 minutos para os exercícios 1 a 7.

## Exercício 1: onde vêm os dados

Guia: secção "Três sítios por onde um pedido traz dados".

Para cada pedido, diz onde vêm os dados (caminho, pesquisa ou corpo) e escreve como se leem no servidor, por exemplo `req.query.autor`.

1. `GET /livros/3`
2. `GET /livros?disponivel=true`
3. Um formulário com `method="post"` e os campos `livro_id` e `leitor`, enviado para `/emprestimos`
4. `GET /leitores/1007/emprestimos`
5. Um formulário com `method="get"` e o campo `titulo`, enviado para `/pesquisa`

## Exercício 2: prever os códigos

Guia: secção "Os códigos de estado que o teu código escolhe".

A rota de detalhe dos livros vai ser escrita como a dos equipamentos no passo 1 do guia: primeiro verifica se o identificador é um inteiro positivo, depois procura o livro. Com os três livros da ficha anterior, que código tem cada pedido?

1. `GET /livros/1`
2. `GET /livros/x`
3. `GET /livros/-3`
4. `GET /livros/7`

Para o pedido 4, explica numa frase porque é que não é 400.

## Exercício 3: um livro de cada vez

Guia: exemplo guiado, passo 1.

No `server.js` da biblioteca, acrescenta a rota `GET /livros/:id`, que responde com o livro pedido, ou com 400 ou 404 e uma mensagem em JSON, como no guia.

**Resultado esperado:** os códigos do exercício 2. A mensagem do 404 diz que livro não existe, por exemplo `{"erro":"Não existe o livro 7"}`.

## Exercício 4: um filtro com dois valores possíveis

Guia: exemplo guiado, passo 2, e a secção "Tudo chega como texto".

A funcionária quer ver só os livros disponíveis, ou só os emprestados. Muda a rota `GET /livros` para aceitar um parâmetro de pesquisa `disponivel`:

- sem o parâmetro, a resposta é a lista toda, como antes;
- `?disponivel=true` dá só os livros com `disponivel` igual a `true`;
- `?disponivel=false` dá só os outros;
- qualquer outro valor, como `?disponivel=talvez`, é um pedido mal feito.

**Resultado esperado:** `true` dá "Os Maias" e "Mensagem"; `false` dá "Memorial do Convento"; `talvez` dá 400, com uma mensagem que diga que valores são aceites.

**A decisão nova:** o filtro do guia comparava o texto do parâmetro com um texto do array (a sala). Aqui, o parâmetro chega como texto, `"true"`, e o campo do livro é um booleano, `true`. Pensa em como os comparas, antes de escrever código.

**Pista, só se precisares:** `"true" === true` é `false`.

## Exercício 5: o middleware fora do sítio

Guia: secção "O middleware".

Um colega escreveu o servidor da biblioteca com os middlewares por esta ordem (as rotas estão resumidas):

```js fragment
app.use((req, res) => {
  res.status(404).send("Página não encontrada.");
});

app.get("/livros", (req, res) => { /* ... */ });
app.post("/emprestimos", (req, res) => { /* usa req.body.livro_id */ });

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
});

app.use(express.urlencoded({ extended: false }));
```

a) Que resposta tem um pedido `GET /livros`? E o que aparece no terminal?

b) Este código tem três erros de middleware. Para cada um, diz qual é e que sintoma teria, se os outros dois estivessem corrigidos.

c) Escreve a ordem certa destas quatro partes, só com os nomes: rotas, middleware final, `express.urlencoded`, middleware de registo.

## Exercício 6: emprestar um livro

Guia: exemplo guiado, passo 5.

Acrescenta ao servidor da biblioteca:

- o middleware de registo e o `express.urlencoded`, no sítio certo;
- uma rota `GET /emprestimos/novo`, com um formulário que envia por `POST` para `/emprestimos` os campos `livro_id` e `leitor` (o número de leitor);
- a rota `POST /emprestimos`, que cria o empréstimo;
- uma rota `GET /emprestimos`, com a lista dos empréstimos;
- o middleware final.

As regras do empréstimo:

- o livro tem de existir e o número de leitor tem de ser um inteiro positivo; se não, 400;
- o livro tem de estar disponível; se não estiver, também 400, com uma mensagem que o diga;
- se estiver tudo bem, o empréstimo fica guardado num array, com um `id` dado pelo servidor, o `livroId` e o `leitor`, e a resposta é 201 com o empréstimo, em JSON.

**A decisão nova:** a reserva do guia só criava uma coisa nova. Este empréstimo muda também o livro: depois de emprestado, deixa de estar disponível. Onde, na função, fazes essa mudança, e porque é que tem de ser depois das verificações?

**Resultado esperado:** emprestar o livro 2 dá 201. Tentar emprestá-lo outra vez dá 400, a dizer que não está disponível. `GET /livros?disponivel=true` passa a dar só "Os Maias". O livro 9 dá 400, e o livro 3, que já estava emprestado, também.

## Exercício 7: o contrato da biblioteca

Guia: secção "A tabela de contratos HTTP".

Escreve a tabela de contratos HTTP do servidor da biblioteca, com uma linha por pedido que ele aceita, incluindo as rotas da ficha anterior que tiveres. Verifica cada linha no browser e marca as que verificaste.

## Desafio (opcional): a devolução

Na ficha do primeiro tema desenhaste o diagrama de uma devolução. Agora programa-a: a rota `POST /emprestimos/:id/devolucao` marca o empréstimo como devolvido e volta a pôr o livro disponível.

Decide tu os códigos para estes casos, e escreve a tua decisão numa linha nova da tabela do exercício 7:

- o identificador do empréstimo não é um inteiro positivo;
- o empréstimo não existe;
- o empréstimo já foi devolvido;
- a devolução correu bem.

Como um `POST` não se faz pela barra de endereço, acrescenta à rota `GET /emprestimos/novo` um segundo formulário, com um campo para o número do empréstimo, ou testa a rota com um formulário numa página nova. Pensa: o número do empréstimo vai no caminho, e um formulário `POST` envia os campos no corpo. Como resolves isto sem mudar a rota?

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1, 2 e 5, o `server.js` da biblioteca com os exercícios 3, 4 e 6 (e o desafio, se o fizeste) e a tabela do exercício 7. Não entregues a pasta `node_modules`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: escolhe uma das três regras do middleware e explica-a com um exemplo.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
