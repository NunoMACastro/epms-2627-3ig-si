![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: HTTP, rotas e middleware

Praticas, no servidor da biblioteca da ficha anterior, os dados que um pedido traz, os códigos de estado que a rota escolhe e o middleware. Os exercícios 1 a 7 são obrigatórios, por esta ordem. Os exercícios 1, 2 e 5 fazem-se sem correr código, e as respostas deles e a tabela do exercício 7 vão para o `respostas-03.md`, o ficheiro de texto do laboratório. Se ainda não o tens, cria-o na tua pasta de Sistemas de Informação, fora do projeto `biblioteca`. Antes de cada resposta, põe o exercício e a alínea ou o item, como 1.3 ou 5 b). Entrega o `respostas-03.md` e o `server.js` da biblioteca. Para rever: o [guia do tema](../03-http-rotas-e-middleware.md) e o [laboratório](../laboratorios/03-http-rotas-e-middleware-laboratorio-papelaria.md).

## O cenário

O servidor da biblioteca da ficha do tema 02 responde, por agora, à lista dos livros, aos livros disponíveis e a um resumo. As rotas de dados e as respostas de erro usam JSON, e a rota inicial `/` mantém a mensagem de texto.

Os livros são os três do código de partida da ficha anterior:

```js fragment
// Os livros ficam num array, em memória. O campo disponivel diz se há
// pelo menos um exemplar na estante neste momento.
const livros = [
  { id: 1, titulo: "Os Maias", autor: "Eça de Queirós", disponivel: true },
  { id: 2, titulo: "Mensagem", autor: "Fernando Pessoa", disponivel: true },
  { id: 3, titulo: "Memorial do Convento", autor: "José Saramago", disponivel: false },
];
```

Os exercícios 3, 4 e 6 só precisam deste array e das rotas `/` e `/livros`. Se ainda não tens o servidor, prepara-o como em [No servidor da biblioteca](02-primeiro-servidor-exercicios.md#no-servidor-da-biblioteca), na ficha anterior. Confirma cada resultado esperado no browser, com o separador Rede aberto, onde vês o código de estado.

## Exercício 1: onde vêm os dados

Para cada pedido, diz onde vêm os dados (caminho, pesquisa ou corpo). Quando vêm no caminho ou na pesquisa, escreve também como se leem no servidor, por exemplo `req.query.autor`. Para os dados que vêm no corpo, basta dizeres que vêm no corpo, porque neste tema o servidor não o lê.

1. `GET /livros/3`
2. `GET /livros?disponivel=true`
3. Um formulário com `method="post"` e os campos `livro_id` e `leitor`, enviado para `/emprestimos`
4. `GET /leitores/1007/emprestimos`
5. Um formulário com `method="get"` e o campo `titulo`, enviado para `/pesquisa`

Rever: [Parte 1: Os dados que um pedido traz](../03-http-rotas-e-middleware.md#parte-1-os-dados-que-um-pedido-traz) e [O formulário escolhe o sítio dos campos pelo method](../03-http-rotas-e-middleware.md#o-formulário-escolhe-o-sítio-dos-campos-pelo-method).

<details>
<summary>Pista</summary>

Em cada pedido, procura primeiro o `?`, que separa o caminho da pesquisa. Num formulário, escreve primeiro o pedido que o browser envia quando carregas no botão.

</details>

## Exercício 2: prever os códigos

A rota de detalhe dos livros segue a dos equipamentos do guia. Primeiro verifica se o identificador é um inteiro positivo. Depois procura o livro. O servidor tem também a rota `GET /livros` da ficha anterior, que responde com a lista toda. Com os três livros do cenário, que código tem cada pedido?

1. `GET /livros/2`
2. `GET /livros/abc`
3. `GET /livros/-1`
4. `GET /livros/12`
5. `GET /livros?id=2`

Para o pedido 4, justifica o código numa frase. Para o pedido 5, diz também que rota lhe responde e o que vem na resposta.

Rever: [Os três códigos deste tema](../03-http-rotas-e-middleware.md#os-três-códigos-deste-tema) e [Depois do ponto de interrogação: parâmetros de pesquisa](../03-http-rotas-e-middleware.md#depois-do-ponto-de-interrogação-parâmetros-de-pesquisa).

<details>
<summary>Pista</summary>

Para cada pedido, decide primeiro que rota do servidor lhe responde. Só depois segue o que essa rota faz com ele.

</details>

## Exercício 3: um livro de cada vez

No `server.js` da biblioteca, acrescenta a rota `GET /livros/:id`, que responde com o livro pedido, ou com 400 ou 404 e uma mensagem em JSON.

A funcionária escreve muitas vezes o número do livro à mão e, quando se engana, quer saber o que corrigir. A mensagem do 400 distingue duas falhas. Num caso, o valor não é um número inteiro. No outro, é inteiro mas não é maior do que zero.

Resultado esperado: estes pedidos dão estas respostas:

| Pedido | Código | Resposta |
| --- | --- | --- |
| `GET /livros/1` | 200 | o livro "Os Maias", em JSON |
| `GET /livros/x` | 400 | `{"erro":"O identificador tem de ser um número inteiro"}` |
| `GET /livros/-3` | 400 | `{"erro":"O identificador tem de ser maior do que zero"}` |
| `GET /livros/0` | 400 | `{"erro":"O identificador tem de ser maior do que zero"}` |
| `GET /livros/7` | 404 | `{"erro":"Não existe o livro 7"}` |

Se tiveres a rota `/livros/disponiveis` da ficha anterior, ela continua a dar os dois livros disponíveis. Em nenhum destes pedidos o terminal mostra um erro.

Rever: [Os três códigos deste tema](../03-http-rotas-e-middleware.md#os-três-códigos-deste-tema), [Passo 2: o 400 antes do 404](../03-http-rotas-e-middleware.md#passo-2-o-400-antes-do-404), [Responder uma vez, e sair](../03-http-rotas-e-middleware.md#responder-uma-vez-e-sair) e [O caminho fixo vem antes do caminho com parâmetro](../03-http-rotas-e-middleware.md#o-caminho-fixo-vem-antes-do-caminho-com-parâmetro).

## Exercício 4: um filtro com dois valores possíveis

A funcionária quer ver só os livros disponíveis, ou só os emprestados. Muda a rota `GET /livros` para aceitar um parâmetro de pesquisa `disponivel`:

- sem o parâmetro, a resposta é a lista toda, como antes;
- `?disponivel=true` dá só os livros com `disponivel` igual a `true`;
- `?disponivel=false` dá só os outros;
- qualquer outro valor, como `?disponivel=talvez` ou o valor vazio em `?disponivel=`, é um pedido mal feito.

Resultado esperado: `true` dá "Os Maias" e "Mensagem"; `false` dá "Memorial do Convento"; `talvez` e o valor vazio dão 400, com uma mensagem que diga que valores são aceites.

Podes usar um método dos arrays que conheças ou um ciclo: nenhum é obrigatório.

Rever: [Tudo chega como texto](../03-http-rotas-e-middleware.md#tudo-chega-como-texto) e [Passo 1: a rota de detalhe e o filtro](../03-http-rotas-e-middleware.md#passo-1-a-rota-de-detalhe-e-o-filtro).

<details>
<summary>Pista</summary>

Se `?disponivel=true` te dá uma lista vazia, vê de que tipo é o valor que chega em `req.query` e de que tipo é o campo `disponivel` de cada livro.

</details>

<details>
<summary>Pista</summary>

Se `?disponivel=` te dá a lista toda, revê a condição que decide se o parâmetro veio.

</details>

## Exercício 5: a função de registo do colega

Um colega deu um nome à função de registo dos pedidos. No `server.js`, colocou esta parte depois de `const app = express()` e antes de todas as rotas. O fragmento tem um só erro; o resto do servidor está correto.

```js fragment
/**
 * Escreve no terminal o método e o endereço do pedido e passa ao seguinte.
 * Não produz uma resposta HTTP nem devolve um valor.
 * @param {object} req o pedido, com o método e o endereço
 * @param {object} res a resposta disponível para este pedido
 * @param {Function} next a função que passa ao middleware seguinte
 * @returns {void}
 */
const registarPedido = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(registarPedido());
```

Responde no `respostas-03.md`, sem correr o código.

a) Quando corre `registarPedido`: no arranque ou quando chega um pedido? O servidor consegue chegar à instrução que o põe à escuta?

b) Identifica a linha que provoca o erro, explica a causa e corrige uma só linha.

c) Com a correção feita, explica o que acontece à função de registo no arranque e quando chega `GET /livros`.

Rever: [Um middleware é uma função por onde passam os pedidos](../03-http-rotas-e-middleware.md#um-middleware-é-uma-função-por-onde-passam-os-pedidos) e [O arranque corre uma vez, e a função de uma rota a cada pedido](../02-primeiro-servidor.md#o-arranque-corre-uma-vez-e-a-função-de-uma-rota-a-cada-pedido).

<details>
<summary>Pista</summary>

Lê o fragmento linha a linha e, em cada uma, diz se corre no arranque ou só quando chega um pedido.

</details>

## Exercício 6: o registo e o fim da fila

Acrescenta ao servidor da biblioteca o middleware de registo e o middleware final, cada um no sítio certo.

O middleware de registo é igual ao do guia. O final não: as respostas de erro da biblioteca usam JSON, com a mensagem numa chave `erro`, para quem usa o servidor saber sempre onde a procurar. A resposta a um endereço que não existe tem de indicar o método e o endereço do pedido.

Resultado esperado: `GET /livro`, sem o `s`, dá 404 com `{"erro":"Pedido não encontrado: GET /livro"}`, e `GET /livros/1/autor` dá 404 com `{"erro":"Pedido não encontrado: GET /livros/1/autor"}`. `GET /livros/1` continua a dar "Os Maias". O terminal mostra a linha do registo de cada pedido, incluindo as dos endereços errados.

A mensagem pode ter outra redação, desde que mantenha o código 404, a chave `erro`, o método e o endereço do pedido.

Rever: [Um middleware é uma função por onde passam os pedidos](../03-http-rotas-e-middleware.md#um-middleware-é-uma-função-por-onde-passam-os-pedidos), [O middleware final](../03-http-rotas-e-middleware.md#o-middleware-final) e [Uma fila, pela ordem do ficheiro](../03-http-rotas-e-middleware.md#uma-fila-pela-ordem-do-ficheiro).

<details>
<summary>Pista</summary>

Se uma rota que funcionava passou a responder 404, ou se o terminal deixou de mostrar alguns pedidos, vê onde ficou cada middleware.

</details>

## Exercício 7: o contrato da biblioteca

Escreve no `respostas-03.md` a tabela de contratos HTTP do servidor da biblioteca, com uma linha por pedido que ele aceita, incluindo as rotas da ficha anterior que tiveres. Verifica cada linha no browser e marca as que verificaste.

Rever: [A tabela de contratos HTTP](../03-http-rotas-e-middleware.md#a-tabela-de-contratos-http).

<details>
<summary>Pista</summary>

Parte dos pedidos que fizeste nos exercícios 3, 4 e 6. Cada resposta diferente que viste no separador Rede fica na tabela, na linha do pedido que a deu.

</details>

## Desafios

### O resumo da pesquisa

Acrescenta ao servidor da biblioteca uma rota `/resumo-da-pesquisa` que aceite o mesmo filtro `disponivel` e responda com o número de livros selecionados. Mantém as regras dos valores aceites. Testa o caso sem filtro, os dois valores aceites e um valor inválido.

## Critérios de conclusão

- O `respostas-03.md` tem os exercícios 1, 2 e 5 respondidos, cada resposta com o exercício e a alínea ou o item.
- O `respostas-03.md` tem a tabela de contratos do exercício 7, com as linhas verificadas marcadas.
- O servidor da biblioteca dá as respostas dos resultados esperados dos exercícios 3, 4 e 6, e o terminal mostra a linha do registo de cada pedido.
- Se fizeste o desafio, `/resumo-da-pesquisa` conta os livros sem filtro e com cada valor aceite, e recusa com 400 um valor inválido.

![Rodapé](../../imagens/rodape.png)
