![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: HTTP, rotas e middleware

Terceiro tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](03-http-rotas-e-middleware.md) e de fazeres o [laboratório](03-http-rotas-e-middleware-laboratorio.md). Os exercícios 1, 2 e 5 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior.

## Objetivo e contexto

O servidor da biblioteca responde, por agora, à lista dos livros, aos livros disponíveis e a um resumo. Nesta ficha passa a mostrar um livro de cada vez, a filtrar a lista, a escrever no terminal os pedidos que recebe e a responder aos endereços que não existem. Pelo caminho, tens de tomar decisões que o catálogo do guia não tomou: como dizer qual das regras do identificador falhou, o que fazer com um parâmetro de pesquisa que só pode ter dois valores, e que forma dar à resposta de um endereço que não existe, num servidor que responde sempre em JSON.

## Como trabalhar

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o resultado que esperas, e só depois abre o browser. Usa o separador Rede para confirmar o código de cada resposta.

Se o teu servidor da biblioteca não tiver as rotas da ficha anterior, não faz mal: os exercícios 3, 4 e 6 só precisam do array `livros` e da rota `/`.

Tempo previsto: 70 minutos para os exercícios 1 a 7.

## Exercício 1: onde vêm os dados

Guia: secção "Três sítios por onde um pedido traz dados".

Para cada pedido, diz onde vêm os dados (caminho, pesquisa ou corpo). Quando vêm no caminho ou na pesquisa, escreve também como se leem no servidor, por exemplo `req.query.autor`. Para os dados que vêm no corpo, basta dizeres que vêm no corpo: lê-los no servidor é do tema dos formulários.

1. `GET /livros/3`
2. `GET /livros?disponivel=true`
3. Um formulário com `method="post"` e os campos `livro_id` e `leitor`, enviado para `/emprestimos`
4. `GET /leitores/1007/emprestimos`
5. Um formulário com `method="get"` e o campo `titulo`, enviado para `/pesquisa`

## Exercício 2: prever os códigos

Guia: secção "Os códigos de estado que o teu código escolhe".

A rota de detalhe dos livros vai ser escrita como a dos equipamentos no passo 1 do guia: primeiro verifica se o identificador é um inteiro positivo, depois procura o livro. O servidor tem também a rota `GET /livros` da ficha anterior, que responde com a lista toda. Com os três livros da ficha anterior, que código tem cada pedido?

1. `GET /livros/1`
2. `GET /livros/x`
3. `GET /livros/-3`
4. `GET /livros/7`
5. `GET /livros?id=2`

Para o pedido 4, explica numa frase porque é que não é 400. Para o pedido 5, diz também que rota lhe responde e o que vem na resposta.

## Exercício 3: um livro de cada vez

Guia: exemplo guiado, passo 1.

No `server.js` da biblioteca, acrescenta a rota `GET /livros/:id`, que responde com o livro pedido, ou com 400 ou 404 e uma mensagem em JSON.

A funcionária escreve muitas vezes o número do livro à mão e, quando se engana, quer saber o que corrigir. Por isso, a mensagem do 400 diz qual das duas regras do identificador falhou: ou não é um número inteiro, ou é um inteiro mas não é maior do que zero.

**Resultado esperado:** os pedidos 1 a 4 do exercício 2, e mais o do livro 0, dão estas respostas:

| Pedido | Código | Resposta |
| --- | --- | --- |
| `GET /livros/1` | 200 | o livro "Os Maias", em JSON |
| `GET /livros/x` | 400 | `{"erro":"O identificador tem de ser um número inteiro"}` |
| `GET /livros/-3` | 400 | `{"erro":"O identificador tem de ser maior do que zero"}` |
| `GET /livros/0` | 400 | `{"erro":"O identificador tem de ser maior do que zero"}` |
| `GET /livros/7` | 404 | `{"erro":"Não existe o livro 7"}` |

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

Um colega escreveu o servidor da biblioteca com os middlewares e as rotas por esta ordem (o conteúdo das rotas está resumido):

```js fragment
app.use((req, res) => {
  res.status(404).send("Página não encontrada.");
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
});

app.get("/livros/:id", (req, res) => { /* responde com um livro, ou com 400 ou 404 */ });
app.get("/livros/disponiveis", (req, res) => { /* responde com os livros disponíveis */ });
app.get("/livros", (req, res) => { /* responde com a lista */ });
```

a) Que resposta tem um pedido `GET /livros`? E o que aparece no terminal?

b) Este código tem três erros, todos ligados à fila do Express. Para cada um, diz qual é e que sintoma teria, se os outros dois estivessem corrigidos.

c) Escreve a ordem certa destas cinco partes, só com os nomes: a rota `/livros`, a rota `/livros/:id`, a rota `/livros/disponiveis`, o middleware final e o middleware de registo.

## Exercício 6: o registo e o fim da fila

Guia: secção "O middleware" e exemplo guiado, passos 3 e 5.

Acrescenta ao servidor da biblioteca o middleware de registo e o middleware final, cada um no sítio certo. Se tiveres a rota `/livros/disponiveis` da ficha anterior, confirma também que ela está acima da rota `/livros/:id` do exercício 3.

O middleware de registo é igual ao do guia. O final não: todas as respostas da biblioteca são JSON, incluindo as de erro, com a mensagem numa chave `erro`, para quem usa o servidor saber sempre onde a procurar. A resposta a um endereço que não existe também tem de ser assim, e tem de dizer que pedido não foi encontrado, com o método e o endereço.

**A decisão nova:** o middleware final do guia responde sempre o mesmo texto. Este tem de construir a mensagem a partir do pedido. Que propriedades do `req` usas? E porque é que pôr o endereço do pedido nesta resposta não tem o perigo de que fala a secção de segurança do guia, quando diz que o texto do utilizador não se cola em HTML?

**Resultado esperado:** `GET /livro`, sem o `s`, dá 404 com `{"erro":"Pedido não encontrado: GET /livro"}`. `GET /livros/1` continua a dar "Os Maias". O terminal mostra uma linha por pedido, incluindo a do endereço errado.

## Exercício 7: o contrato da biblioteca

Guia: secção "A tabela de contratos HTTP".

Escreve a tabela de contratos HTTP do servidor da biblioteca, com uma linha por pedido que ele aceita, incluindo as rotas da ficha anterior que tiveres. Verifica cada linha no browser e marca as que verificaste.

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1, 2 e 5, o `server.js` da biblioteca com os exercícios 3, 4 e 6 e a tabela do exercício 7. Não entregues a pasta `node_modules`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: escolhe uma das três regras do middleware e explica-a com um exemplo.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
