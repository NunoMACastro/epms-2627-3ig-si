![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: HTTP, rotas e middleware

Terceiro tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](03-http-rotas-e-middleware.md) e de fazeres o [laboratório](03-http-rotas-e-middleware-laboratorio.md). Os exercícios 1, 2 e 5 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior.

## O que precisas de saber

O [guia do tema](03-http-rotas-e-middleware.md) e o [laboratório](03-http-rotas-e-middleware-laboratorio.md).

## O contexto desta ficha

O servidor da biblioteca responde, por agora, à lista dos livros, aos livros disponíveis e a um resumo. Nesta ficha passa a mostrar um livro de cada vez, a filtrar a lista, a escrever no terminal os pedidos que recebe e a responder aos endereços que não existem. Vais tomar decisões que o catálogo do guia não tomou. Escolhes a mensagem para cada regra do identificador e tratas uma pesquisa que só aceita dois valores. Também escolhes o formato do erro de um endereço inexistente. As rotas de dados e as respostas de erro usam JSON; a rota inicial `/` mantém a mensagem de texto.

## Como trabalhar

Avança ao teu ritmo. O que não acabares na aula pode ficar para casa ou para a aula seguinte. Faz os exercícios pela ordem indicada; os desafios são opcionais.

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o resultado que esperas, e só depois abre o browser. Usa o separador Rede para confirmar o código de cada resposta.

Os exercícios 3, 4 e 6 só precisam do array `livros` e da rota `/`. Podes fazê-los mesmo que ainda não tenhas as outras rotas da ficha anterior.


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

A rota de detalhe dos livros segue a dos equipamentos do guia. Primeiro verifica se o identificador é um inteiro positivo. Depois procura o livro. O servidor tem também a rota `GET /livros` da ficha anterior, que responde com a lista toda. Com os três livros da ficha anterior, que código tem cada pedido?

1. `GET /livros/1`
2. `GET /livros/x`
3. `GET /livros/-3`
4. `GET /livros/7`
5. `GET /livros?id=2`

Para o pedido 4, explica numa frase porque é que não é 400. Para o pedido 5, diz também que rota lhe responde e o que vem na resposta.

## Exercício 3: um livro de cada vez

Guia: exemplo guiado, passo 1.

No `server.js` da biblioteca, acrescenta a rota `GET /livros/:id`, que responde com o livro pedido, ou com 400 ou 404 e uma mensagem em JSON.

A funcionária escreve muitas vezes o número do livro à mão e, quando se engana, quer saber o que corrigir. A mensagem do 400 distingue duas falhas. Num caso, o valor não é um número inteiro. No outro, é inteiro mas não é maior do que zero.

Mantém as duas mensagens distintas. Podes organizar as condições de outra forma, desde que os pedidos recebam as respostas pedidas; não tens de escrever dois `if`.

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
- qualquer outro valor, como `?disponivel=talvez` ou o valor vazio em `?disponivel=`, é um pedido mal feito.

**Resultado esperado:** `true` dá "Os Maias" e "Mensagem"; `false` dá "Memorial do Convento"; `talvez` e o valor vazio dão 400, com uma mensagem que diga que valores são aceites.

O exercício é obrigatório. Podes usar condições e ciclos equivalentes; não é obrigatório usar um método específico de arrays.

Neste exercício, o filtro do guia comparava o texto do parâmetro com um texto do array (a sala). Aqui, o parâmetro chega como texto, `"true"`, e o campo do livro é um booleano, `true`. Pensa em como os comparas, antes de escrever código.

**Pista, só se precisares:** `"true" === true` é `false`.

## Exercício 5: o registo que impede o arranque

Guia: secção "O middleware".

Um colega deu um nome à função de registo dos pedidos. No `server.js`, colocou esta parte depois de `const app = express()` e antes de todas as rotas. O fragmento tem um único erro intencional; as outras partes do servidor mantêm-se corretas.

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

Responde em papel antes de experimentares.

a) Prevê quando corre `registarPedido`: no arranque ou quando chega um pedido? O servidor consegue chegar à instrução que o põe à escuta?

b) Identifica a linha que provoca o erro, explica a causa e corrige uma só linha.

c) Com a correção feita, explica o que acontece à função de registo no arranque e quando chega `GET /livros`.

## Exercício 6: o registo e o fim da fila

Guia: secção "O middleware" e exemplo guiado, passos 3 e 5.

Acrescenta ao servidor da biblioteca o middleware de registo e o middleware final, cada um no sítio certo. Se tiveres a rota `/livros/disponiveis` da ficha anterior, confirma também que ela está acima da rota `/livros/:id` do exercício 3.

O middleware de registo é igual ao do guia. O final não: as respostas de erro da biblioteca usam JSON, com a mensagem numa chave `erro`, para quem usa o servidor saber sempre onde a procurar. As rotas de dados também respondem em JSON; a rota inicial `/` mantém o texto. A resposta a um endereço que não existe tem de indicar o método e o endereço do pedido.

Neste exercício, o middleware final do guia responde sempre o mesmo texto. Este tem de construir a mensagem a partir do pedido. Que propriedades do `req` usas? O guia avisa que o texto do utilizador não se cola em HTML. Por que podes pôr o endereço do pedido nesta resposta JSON?

**Resultado esperado:** `GET /livro`, sem o `s`, dá 404 com `{"erro":"Pedido não encontrado: GET /livro"}`. `GET /livros/1` continua a dar "Os Maias". O terminal mostra uma linha por pedido, incluindo a do endereço errado.

O exercício é obrigatório. A mensagem pode ter outra redação, desde que mantenha o código 404, a chave `erro`, o método e o endereço do pedido.

## Exercício 7: o contrato da biblioteca

Guia: secção "A tabela de contratos HTTP".

Escreve a tabela de contratos HTTP do servidor da biblioteca, com uma linha por pedido que ele aceita, incluindo as rotas da ficha anterior que tiveres. Verifica cada linha no browser e marca as que verificaste.

## Apoio

- Exercício 1: o `?` separa caminho e pesquisa; um formulário `GET` também produz pesquisa.
- Exercício 2: decide primeiro qual é o caminho, sem a pesquisa.
- Exercício 3: testa separadamente um texto, zero e um número inexistente.
- Exercício 4: um texto não vazio não é necessariamente o valor booleano que procuras.
- Exercício 5: lê também as instruções que correm antes de o servidor ficar à escuta.
- Exercício 6: mantém o formato das outras respostas e verifica o estado no browser.
- Exercício 7: inclui os erros e o caso sem parâmetros, além do sucesso.

## Desafio opcional

Acrescenta ao servidor da biblioteca uma rota `/resumo-da-pesquisa` que aceite o mesmo filtro `disponivel` e responda com o número de livros selecionados. Mantém as regras dos valores aceites. Testa o caso sem filtro, os dois valores aceites e um valor inválido.

## Critérios de conclusão

Entrega as respostas dos exercícios 1, 2 e 5, o `server.js` da biblioteca com os exercícios 3, 4 e 6 e a tabela do exercício 7. Não entregues a pasta `node_modules`.

## Autoavaliação

No fim, responde por escrito:

- O que consigo explicar sem ajuda: escolhe uma das três regras do middleware e explica-a com um exemplo.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
