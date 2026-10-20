![Cabeçalho](../imagens/cabecalho.png)

# Formulários e validação

Módulo Aplicações baseadas em browsers. Este guia explica como receber, validar e responder aos dados de um formulário. Para praticar, tens o [laboratório](05-formularios-e-validacao-laboratorio.md) e a [ficha de exercícios](05-formularios-e-validacao-exercicios.md).

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte.

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. Um formulário que muda alguma coisa
4. O formulário em HTML
5. O corpo do pedido e o middleware que o lê
6. Validar no servidor
7. Quando há erros: o formulário outra vez
8. Quando corre bem: redirecionar
9. Exemplo guiado: as reservas do catálogo
10. Observar os pedidos no browser
11. Erros frequentes
12. Segurança: o que este tema já pede
13. Verificar o que aprendeste
14. O que vem a seguir

## O que vais aprender

Até aqui, o catálogo só mostrava dados: a lista dos equipamentos, um equipamento, as salas. O único formulário, o da pesquisa por sala, enviava por `GET` e não mudava nada no servidor. Neste tema, o catálogo passa a receber dados que mudam alguma coisa: uma pessoa escolhe um equipamento, um dia e um tempo letivo, escreve o nome, carrega em "Reservar". E o servidor guarda a reserva.

Receber dados de uma pessoa é a parte mais delicada de um servidor. A pessoa pode esquecer-se de um campo, escrever um número fora do que faz sentido, ou escrever coisas que nunca te passariam pela cabeça. E nem sempre é uma pessoa a preencher o formulário com boa vontade: qualquer programa pode enviar um pedido com os dados que quiser, sem passar pelo teu formulário. Por isso o servidor verifica tudo o que recebe, e responde de forma a que quem se enganou perceba o que corrigir.

No fim deste guia deves conseguir:

- explicar porque é que um formulário que muda dados envia por `POST`, e onde vão os dados nesse caso;
- escrever um formulário acessível, com cada campo ligado à sua etiqueta, e os atributos que ajudam quem o preenche;
- ler o corpo de um pedido com o `express.urlencoded` e o `req.body`, e explicar porque é que esse middleware fica antes das rotas;
- validar no servidor cada campo: obrigatório, do tipo certo, dentro dos limites, e com um valor que esteja na lista dos permitidos;
- responder a um formulário com erros com o código 400 e o próprio formulário, com os valores que a pessoa escreveu e uma mensagem junto de cada campo errado;
- responder a um formulário certo com um redirecionamento 303 para uma página `GET`, e explicar o problema que isso evita;
- demonstrar que o servidor recusa um valor vazio e um valor fora do intervalo, mesmo que o browser os deixe passar.

## O que já sabes e vais usar

- Caminho, pesquisa e corpo do pedido, este último ainda só como ideia: [tema 03](03-http-rotas-e-middleware.md).
- `GET`, `POST`, códigos 200/400/404 e `return` depois de uma resposta: [tema 03](03-http-rotas-e-middleware.md).
- Middleware, ordem e caminhos fixos antes dos parametrizados: [tema 03](03-http-rotas-e-middleware.md).
- Valores recebidos como texto e verificação no servidor: [tema 03](03-http-rotas-e-middleware.md).
- `res.render`, marcas EJS, ciclos, condições, partials, páginas de erro e escaping: [tema 04](04-ejs-e-reutilizacao-no-servidor.md).
- Formulários com `<form>`, `<label>`, `<input>`, `<select>`, `<option>` e `<button>`, de HTML dos anos anteriores.
- `trim()` para tirar espaços das pontas e `typeof` para conhecer o tipo, de JavaScript dos anos anteriores.
- Objetos com propriedades acrescentadas depois, como `erros.nome = "..."`, de JavaScript dos anos anteriores.

O exemplo parte do catálogo com páginas. Se não o tiveres a funcionar, copia [catalogo-com-ejs](../exemplos/aplicacoes-em-browser/catalogo-com-ejs/README.md).

## Um formulário que muda alguma coisa

A pesquisa por sala envia por `GET`, e os dados vão no endereço: `/equipamentos?sala=B12`. Está certo, porque uma pesquisa só pede: não muda nada no servidor, pode repetir-se as vezes que se quiser. O endereço pode guardar-se nos favoritos ou enviar-se a alguém.

Uma reserva é outra coisa. Fazê-la muda o servidor: passa a haver mais uma reserva. Fazê-la duas vezes faz duas reservas. Os dados de uma reserva não devem ir no endereço. Assim, evitas que sejam guardados nos favoritos, apareçam no histórico ou sejam partilhados numa mensagem. Por isso um formulário que muda alguma coisa envia por `POST`. E com `POST` os dados não vão no endereço: vão no **corpo** do pedido.

O pedido que o browser envia quando carregas em "Reservar" tem este aspeto:

```text
POST /reservas HTTP/1.1
Content-Type: application/x-www-form-urlencoded

equipamento_id=2&data=2026-10-20&tempo=3&nome=Ana
```

A primeira linha tem o método e o caminho, como sempre. O cabeçalho `Content-Type` diz em que formato vem o corpo. E o corpo, depois da linha em branco, tem os campos do formulário, no mesmo formato da pesquisa: o nome do campo, um `=`, o valor. Os campos separam-se com `&`. Este formato chama-se `urlencoded`, ou "codificado como num endereço". Os espaços, os acentos e os carateres especiais vão em códigos. Por exemplo, `%20` representa um espaço, como num endereço.

Fica a regra que já conhecias, agora com a razão completa: `GET` para pedir, `POST` para mudar. Os dados de um `GET` vão no endereço; os de um `POST`, no corpo.

## O formulário em HTML

O formulário de reserva tem quatro campos: o equipamento, escolhido de uma lista; o dia; o tempo letivo, de 1 a 9; e o nome de quem reserva.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<form method="post" action="/reservas">
  <p>
    <label for="equipamento_id">Equipamento</label>
    <select id="equipamento_id" name="equipamento_id" required>
      <option value="">Escolhe um equipamento</option>
      <% for (const equipamento of equipamentos) { %>
        <option value="<%= equipamento.id %>"><%= equipamento.nome %>, sala <%= equipamento.sala %></option>
      <% } %>
    </select>
  </p>
  <p>
    <label for="data">Dia</label>
    <input id="data" name="data" type="date" required>
  </p>
  <p>
    <label for="tempo">Tempo letivo, de 1 a 9</label>
    <input id="tempo" name="tempo" type="number" min="1" max="9" required>
  </p>
  <p>
    <label for="nome">O teu nome</label>
    <input id="nome" name="nome" maxlength="40" required>
  </p>
  <button type="submit">Reservar</button>
</form>
```

Leitura guiada: lê o `method` e o `action`, depois segue o `name` de cada campo. Os valores escolhidos vão com esses nomes no pedido.

Os dois atributos do `<form>` dizem para onde e como vão os dados: `action="/reservas"` é o caminho do pedido, e `method="post"` é o método. O botão `type="submit"` envia o formulário.

Cada campo tem três atributos que convém não confundir:

- o **`name`** é o nome com que o valor viaja no corpo do pedido, e é o nome que o servidor vai ler. Um campo sem `name` não é enviado. É o atributo que liga o formulário à rota;
- o **`id`** identifica o campo dentro da página, e serve para lhe ligar a etiqueta;
- o **`for`** da etiqueta (`<label>`) aponta para o `id` do campo.

A ligação entre a etiqueta e o campo é a primeira regra de um formulário **acessível**, ou seja, que toda a gente consegue usar. Quem não vê bem pode usar um leitor de ecrã. Esse programa lê em voz alta o texto da etiqueta quando a pessoa chega ao campo. Sem a ligação ouve só "campo de texto", sem saber o que lá escrever. Para todos, carregar na etiqueta põe o cursor no campo, o que dá jeito sobretudo no telemóvel. Neste formulário, o `name` e o `id` têm o mesmo valor, o que é habitual e evita enganos. Mas são duas coisas diferentes.

Na lista do equipamento, o valor de cada opção é o número do equipamento, e o texto é o que a pessoa lê. É o valor, e não o texto, que vai no corpo: escolher "Projetor, sala A03" envia `equipamento_id=2`. A primeira opção tem o valor vazio, para a lista não começar já com um equipamento escolhido sem a pessoa dar por isso.

Os outros atributos ajudam quem preenche. O `required` impede o envio com um campo vazio. O `type="date"` mostra um calendário. O `type="number"`, com `min` e `max`, só aceita números de 1 a 9. O `maxlength="40"` não deixa escrever mais de 40 carateres. Quando um destes não é cumprido, o browser não envia o formulário e mostra um aviso junto do campo. Isto chama-se **validação no browser**. E é útil. Isto acontece porque a pessoa vê o erro antes de perder tempo com um pedido. Mas não protege o servidor de nada. E a secção "Validar no servidor" explica porquê.

## O corpo do pedido e o middleware que o lê

O Express não lê o corpo de um pedido sozinho. Para o ler é preciso um middleware, e o Express traz um feito para este formato:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Middleware que lê o corpo dos formulários enviados por POST e o põe em
// req.body. Tem de estar antes das rotas que usam o req.body.
app.use(express.urlencoded({ extended: false }));
```

Leitura guiada: este middleware corre antes do elemento seguinte da fila. Identifica o que prepara e se chama `next()` ou termina com uma resposta.

Este middleware lê cada corpo neste formato e separa os campos. Desfaz os códigos: o `%20` volta a ser um espaço. Guarda o resultado num objeto, o `req.body`. Depois chama o `next()`, como os middlewares que escreveste no tema 3: é exatamente a mesma coisa, só que escrita por outros. Para o pedido da secção anterior, o `req.body` fica assim:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
{ equipamento_id: "2", data: "2026-10-20", tempo: "3", nome: "Ana" }
```

Leitura guiada: cada propriedade do objeto corresponde ao `name` de um campo. Os valores são textos, incluindo o número do equipamento e o tempo letivo.

Repara nas aspas: os quatro valores são texto, incluindo o 2 e o 3. É a regra do tema 3 outra vez. O corpo de um pedido é texto, e é o servidor que decide que um campo é um número e o converte. O `extended: false` escolhe a forma simples de ler este formato, que chega para formulários.

A segunda regra do middleware, do tema 3, aplica-se aqui por inteiro. Um middleware que prepara alguma coisa para as rotas tem de estar antes delas. Se o `express.urlencoded` estiver abaixo da rota do `POST`, ou se não estiver de todo, quando a rota corre o corpo ainda não foi lido. E o `req.body` não existe: é `undefined`. A primeira linha que tentar ler `req.body.equipamento_id` falha com `TypeError: Cannot read properties of undefined (reading 'equipamento_id')`. E o browser recebe um 500. A ordem certa do ficheiro fica: o middleware de registo, o `express.urlencoded`, as rotas e o middleware final.

O middleware tem também um limite. Por omissão, não aceita um corpo com mais de 100 kilobytes. Um pedido maior é recusado antes da rota, com o código 413. Esse código significa que o pedido é grande demais. Para um formulário de reserva, 100 kilobytes são mais de cem mil letras. E nunca vais lá chegar por engano. O limite existe para alguém não conseguir encher a memória do servidor com um único pedido gigante. É o primeiro dos **limites** deste tema: o servidor decide quanto aceita. E não deixa essa decisão a quem envia.

## Validar no servidor

**Validar** é verificar que os dados recebidos servem, antes de os usar. O browser já valida o formulário, com o `required`, o `min` e o `max`. Então porque é que o servidor tem de o fazer outra vez?

Porque a validação no browser só acontece quando o pedido vem do teu formulário, num browser que a respeite. Qualquer pessoa pode abrir as ferramentas de programador e apagar o `required` de um campo. Qualquer pessoa pode guardar a página e mudar o formulário. E qualquer programa pode enviar um `POST /reservas` com os dados que quiser, sem formulário nenhum. O servidor não tem forma de saber se o pedido veio do teu formulário. A regra é por isso a mesma do tema 3, com a rota de detalhe: **o browser ajuda, o servidor decide**. A validação no browser é para a pessoa não perder tempo; a validação no servidor é a que conta.

Validar cada campo é responder a um pequeno número de perguntas, sempre as mesmas:

| Pergunta | Exemplo na reserva | Se falhar |
| --- | --- | --- |
| O campo veio, e é texto? | O `nome` pode não vir, ou vir repetido | Conta como vazio |
| Está preenchido? | O `nome` não pode ser só espaços | "Escreve o teu nome." |
| É do tipo certo? | O `tempo` é um número inteiro; o `data` é um dia que existe | "O tempo letivo é um número inteiro de 1 a 9." |
| Está dentro dos limites? | O `tempo` vai de 1 a 9; o `nome` tem até 40 carateres | A mensagem do limite |
| É um dos valores permitidos? | O `equipamento_id` tem de ser um equipamento que existe | "Escolhe um equipamento da lista." |

### O campo veio, e é texto?

Em `req.body`, um campo que o formulário não enviou é `undefined`. E um campo enviado duas vezes, como em `nome=Ana&nome=Rita`, não chega como texto: chega como um array, `["Ana", "Rita"]`. Os dois casos aparecem quando o pedido não vem do teu formulário. Os dois fariam o servidor falhar se tentasses chamar o `trim()` sobre eles. Isto acontece porque o `trim()` só existe nos textos. Por isso, antes de mais nada, cada campo passa por uma pequena função:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
/**
 * Devolve o texto de um campo do formulário, sem os espaços das pontas.
 * Um campo que não veio, ou que veio repetido (e chega como um array),
 * não é um texto: devolve o texto vazio.
 * @param {unknown} valor o valor tal como chegou em req.body
 * @returns {string}
 */
function textoDoCampo(valor) {
  if (typeof valor !== "string") {
    return "";
  }
  return valor.trim();
}
```

Leitura guiada: em `textoDoCampo`, começa pelo parâmetro. Segue as verificações pela ordem escrita e identifica o valor de cada `return`.

Primeiro confirma-se o tipo, com o `typeof`, e só depois se usa o `trim()`. Um valor que não é texto passa a ser o texto vazio, e vai falhar na pergunta seguinte, a do campo preenchido, com uma mensagem que faz sentido.

### Está preenchido?

Depois do `trim()`, um campo vazio e um campo só com espaços são o mesmo: o texto vazio, `""`. A verificação fica simples, `if (valores.nome === "")`. Sem o `trim()`, um nome com três espaços passava como preenchido, e a reserva ficava com um nome invisível.

### É do tipo certo?

O `tempo` chega como texto, e é preciso confirmar que é um número inteiro. Faz-se como no tema 3, com o `Number` e o `Number.isInteger`, mas com um cuidado: o `Number("")` dá 0, e não um erro. Por isso a verificação do campo vazio vem primeiro, com a sua mensagem, e só depois a do número.

O `data` é mais traiçoeiro. O campo `type="date"` envia o dia no formato `AAAA-MM-DD`, como `2026-10-20`, mas quem não usar o formulário pode enviar qualquer texto. Para o JavaScript, um dia é um objeto `Date`, e o `new Date("2026-10-20")` cria o dia 20 de outubro. Um texto que não é um dia, como `"abc"`, dá uma data inválida, e isso confirma-se com o `getTime()`, que nesse caso devolve `NaN`. O problema é o meio-termo: o `new Date("2026-02-30")` não dá uma data inválida. Dá 2 de março, porque o JavaScript acerta os dias a mais e passa para o mês seguinte, sem avisar. Um texto com o formato certo e um dia que não existe passava a verificação.

A solução é confirmar que o dia que sai é o mesmo que entrou:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
/**
 * Confirma que um texto no formato AAAA-MM-DD é um dia que existe.
 * O new Date aceita "2026-02-30" e transforma-o em 2 de março; por isso
 * confirma-se que o dia que sai é o mesmo que entrou.
 * @param {string} texto o dia, como o campo type="date" o envia
 * @returns {boolean}
 */
function diaValido(texto) {
  const dia = new Date(texto);
  if (Number.isNaN(dia.getTime())) {
    return false;
  }
  return dia.toISOString().slice(0, 10) === texto;
}
```

Leitura guiada: em `diaValido`, começa pelo parâmetro. Segue as verificações pela ordem escrita e identifica o valor de cada `return`.

O `toISOString()` escreve a data no formato `2026-03-02T00:00:00.000Z`, e o `slice(0, 10)` fica com os dez primeiros carateres, o dia. Para `"2026-10-20"`, sai `"2026-10-20"`, igual ao que entrou. Para `"2026-02-30"`, sai `"2026-03-02"`, diferente, e a função devolve `false`. Para `"abc"`, a primeira verificação já devolveu `false`. Esta ideia, a de que um valor pode parecer do tipo certo e não servir, vale para muito mais do que datas.

### Está dentro dos limites?

Um número inteiro não é ainda um tempo letivo: o tempo vai de 1 a 9, e `tempo < 1 || tempo > 9` apanha os outros. Um nome com o tamanho certo também é um limite: até 40 carateres, verificado com o `length`. O `maxlength` do formulário já impede o browser de escrever mais, mas um pedido feito à mão não tem `maxlength`.

### É um dos valores permitidos?

O `equipamento_id` não é um número qualquer: tem de ser o número de um equipamento que existe. A lista do formulário só oferece esses, mas, outra vez, um pedido feito à mão pode trazer o 9 ou o `abc`. A verificação é procurar o equipamento, com o `find` que já usaste na rota de detalhe. Se não existir, o valor não é permitido.

Repara que aqui um equipamento inexistente é um 400, e não um 404 como na rota de detalhe. Na rota de detalhe, pedia-se o equipamento 9, e ele não existe: 404. Aqui pede-se para criar uma reserva, e os dados enviados não servem: o pedido está mal feito, e é um 400. O equipamento inexistente é parte de um pedido mal feito.

### Só os campos previstos

Há uma quinta pergunta, que não é sobre nenhum campo: e os campos que não deviam lá estar? Um pedido pode trazer, além dos quatro campos, um `id=999` ou um `confirmada=sim`. A resposta é ler só os campos previstos, um a um, pelo nome. E construir a reserva campo a campo, com os valores já verificados. Nunca se guarda o `req.body` inteiro. Se a rota fizesse `reservas.push(req.body)`, qualquer campo inventado por quem envia o pedido ia parar à reserva guardada. Um `id` enviado de fora podia até tomar o lugar do que o servidor devia dar.

### A função que valida a reserva

As cinco perguntas, juntas numa função:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
/**
 * Verifica os campos de uma reserva vindos do formulário.
 * Só lê os quatro campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * @param {object} corpo o req.body do pedido
 * @returns {object} um objeto com os valores e os erros
 */
function validarReserva(corpo) {
  const valores = {
    equipamento_id: textoDoCampo(corpo.equipamento_id),
    data: textoDoCampo(corpo.data),
    tempo: textoDoCampo(corpo.tempo),
    nome: textoDoCampo(corpo.nome),
  };
  const erros = {};

  // O equipamento tem de ser um dos da lista.
  const equipamento = equipamentos.find((equipamento) => equipamento.id === Number(valores.equipamento_id));
  if (!equipamento) {
    erros.equipamento_id = "Escolhe um equipamento da lista.";
  }

  // O dia é obrigatório, e tem de existir no calendário.
  if (valores.data === "") {
    erros.data = "Escolhe o dia da reserva.";
  } else if (!diaValido(valores.data)) {
    erros.data = "Esse dia não existe no calendário.";
  }

  // O tempo letivo é obrigatório, e é um número inteiro de 1 a 9.
  const tempo = Number(valores.tempo);
  if (valores.tempo === "") {
    erros.tempo = "Indica o tempo letivo.";
  } else if (!Number.isInteger(tempo) || tempo < 1 || tempo > 9) {
    erros.tempo = "O tempo letivo é um número inteiro de 1 a 9.";
  }

  // O nome é obrigatório, e tem no máximo 40 carateres.
  if (valores.nome === "") {
    erros.nome = "Escreve o teu nome.";
  } else if (valores.nome.length > 40) {
    erros.nome = "O nome tem, no máximo, 40 carateres.";
  }

  return { valores: valores, erros: erros };
}
```

Leitura guiada: em `validarReserva`, começa pelo parâmetro. Segue as verificações pela ordem escrita e identifica o valor de cada `return`.

A função devolve duas coisas, num objeto. Os `valores` são os quatro campos já limpos, como texto: vão servir para voltar a preencher o formulário, se houver erros. Os `erros` são um objeto com uma propriedade por campo errado. E o valor de cada propriedade é a mensagem. Um formulário sem erros dá um objeto vazio, `{}`. Repara que a função não pára no primeiro erro: verifica os quatro campos, para a pessoa ver tudo o que tem de corrigir de uma vez. E não um erro de cada vez.

Cada mensagem diz o que fazer, e não só o que está mal: "Escolhe o dia da reserva." ajuda mais do que "Dia inválido.". Quem se enganou não está a ler o código: está a olhar para o formulário e quer saber o que mudar.

## Quando há erros: o formulário outra vez

Quando a validação encontra erros, o pedido está mal feito, e o código é 400. Mas a resposta, numa aplicação com páginas, não é uma página de erro solta: é **o próprio formulário**, outra vez, com três diferenças em relação à primeira vez. Tem os valores que a pessoa escreveu, para não ter de os escrever de novo. Tem, junto de cada campo errado, a mensagem desse campo. E tem, no topo, uma frase a dizer que a reserva não foi feita.

Na rota, sabe-se se houve erros contando as propriedades do objeto `erros`. O `Object.keys(erros)` dá a lista dos nomes das propriedades de um objeto, como `["data", "nome"]`; se a lista estiver vazia, não houve erros:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
const resultado = validarReserva(req.body);

// Com erros: o formulário outra vez, com o 400, os valores e as mensagens.
if (Object.keys(resultado.erros).length > 0) {
  res.status(400).render("reserva-nova", {
    titulo: "Nova reserva",
    equipamentos: equipamentos,
    valores: resultado.valores,
    erros: resultado.erros,
  });
  return;
}
```

Leitura guiada: avalia a condição com os dados do exemplo. Só o ramo escolhido produz o resultado; o outro ramo não é executado.

O `return` é obrigatório. E aqui ainda mais do que nos temas anteriores. Sem ele, a rota continuava, guardava a reserva com os dados errados e respondia ao browser como se tivesse corrido bem. O servidor ia abaixo logo a seguir, quando a página do formulário ficasse pronta e já não houvesse a quem a enviar.

O modelo do formulário passa a receber os `valores` e os `erros`. Para cada campo, o valor vai no atributo `value`, e a mensagem, se houver, vai dentro da etiqueta:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<p>
  <label for="nome">O teu nome
    <% if (erros.nome) { %><strong><%= erros.nome %></strong><% } %>
  </label>
  <input id="nome" name="nome" maxlength="40" value="<%= valores.nome %>" required>
</p>
```

Leitura guiada: avalia a condição com os dados do exemplo. Só o ramo escolhido produz o resultado; o outro ramo não é executado.

A mensagem fica dentro do `<label>` por uma razão de acessibilidade: o leitor de ecrã lê a etiqueta inteira quando chega ao campo. Por isso lê também o erro desse campo. Numa página onde o erro estivesse noutro sítio qualquer, quem não vê o ecrã não saberia a que campo pertence.

O valor no `value` entra com `<%=`, e isto é a regra do escaping do tema 4 a proteger um sítio novo, o atributo. Se alguém escrever no nome `"><b>x</b>`, com `<%=` o browser recebe `value="&#34;&gt;&lt;b&gt;x&lt;/b&gt;"`, e o campo mostra o texto tal como foi escrito. Com `<%-`, as aspas fechavam o atributo antes do tempo, e o resto entrava na página como HTML. Os valores que voltam ao formulário são, por definição, valores que vieram do pedido.

Na lista do equipamento não há `value` para preencher: é preciso marcar como escolhida a opção que a pessoa tinha escolhido. Faz-se com o atributo `selected`, só na opção certa:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<option value="<%= equipamento.id %>" <% if (String(equipamento.id) === valores.equipamento_id) { %>selected<% } %>><%= equipamento.nome %>, sala <%= equipamento.sala %></option>
```

Leitura guiada: avalia a condição com os dados do exemplo. Só o ramo escolhido produz o resultado; o outro ramo não é executado.

O `equipamento.id` é um número, e o `valores.equipamento_id` é texto, porque veio do pedido. O `String(...)` converte o número em texto para os dois se poderem comparar com `===`. Sem ele, `2 === "2"` dava sempre `false`, e a lista voltava sempre ao início.

Da primeira vez que o formulário aparece, na rota `GET /reservas/nova`, ainda não há valores nem erros. O modelo é o mesmo, e a rota passa-lhe os quatro valores vazios e um objeto de erros vazio, para o modelo poder usar as variáveis sem erro.

## Quando corre bem: redirecionar

Quando a validação passa, a rota constrói a reserva campo a campo, com os valores verificados, e guarda-a. Falta escolher a resposta, e um `POST` que criou alguma coisa tem mais do que uma resposta certa.

Se a resposta fosse para outro programa, como acontece numa API, o habitual era o código 201, que quer dizer "criado", com os dados da reserva no corpo, em JSON. É o que vais fazer em Linguagens de Programação. Mas aqui a resposta é para uma pessoa, num browser, e o que ela precisa de ver é uma página a confirmar a reserva. Há duas formas de lha dar.

A primeira é responder logo com a página da reserva, com o código 200. Funciona, e tem um defeito que se vê com uma tecla. A página que o browser mostra é a resposta a um `POST`. Se a pessoa a recarregar, o browser não pede a página outra vez: repete o pedido que a trouxe, o `POST`, com o mesmo corpo. Os browsers avisam antes de o fazer, com uma janela a perguntar se queres reenviar os dados do formulário. Mas a maior parte das pessoas carrega em "Continuar" sem ler. O servidor recebe um segundo `POST`, igual ao primeiro, e cria uma segunda reserva igual. O mesmo acontece com o botão "Voltar" seguido de "Avançar". Numa aplicação de reservas, uma reserva repetida ocupa um equipamento sem ninguém o ter pedido.

A segunda forma resolve isto. E é a que se usa. Em vez de responder com a página, o servidor responde com um **redirecionamento**: o código 303, "See Other" (vê outro), sem página nenhuma. Mas com um cabeçalho `Location`, que diz o endereço para onde o browser deve ir. O browser faz sozinho um `GET` a esse endereço, que é a página da reserva. E mostra-a. Agora, a página que está no ecrã é a resposta a um `GET`. Recarregá-la só volta a pedir a página: não cria nada.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Redirecionamento 303: o browser faz um GET à página da reserva.
// Recarregar essa página já não volta a enviar o formulário.
res.redirect(303, `/reservas/${reserva.id}`);
```

Leitura guiada: o código 303 não envia a página de confirmação. O browser lê o destino e faz um novo pedido `GET` a esse endereço.

A este padrão chama-se **PRG**, das iniciais de Post, Redirect, Get: o formulário envia por `POST`, o servidor responde com um redirecionamento. O browser mostra o resultado com um `GET`. O 303 é da família do 302 que viste no laboratório do primeiro tema, na pesquisa da Wikipédia. A diferença é que o 303 diz expressamente que o pedido seguinte é um `GET`, que é o que se quer depois de um `POST`.

O redirecionamento só se faz quando corre bem. Quando há erros, a resposta é o formulário com o 400, como na secção anterior. Não há redirecionamento: os valores e as mensagens só existem durante aquele pedido. E um `GET` novo já não os teria.

O endereço para onde se redireciona, `/reservas/1`, tem de ter uma rota `GET`. Essa rota tem um parâmetro, o número da reserva, e fica abaixo da rota do formulário, `/reservas/nova`, pela regra do tema 3: o caminho fixo antes do caminho com parâmetro. Ao contrário, o pedido a `/reservas/nova` ia parar à rota de uma reserva, com `"nova"` como número, e respondia 400.

## Exemplo guiado: as reservas do catálogo

O exemplo acrescenta reservas ao catálogo com páginas do tema anterior. Começas pelo formulário e por um `POST` sem verificação, para observar o que corre mal. Acrescentas a validação e o formulário com mensagens de erro. Por fim, acrescentas o redirecionamento. O resultado final está pronto a correr na pasta [catalogo-com-formularios](../exemplos/aplicacoes-em-browser/catalogo-com-formularios/README.md) dos exemplos.

### Passo 1: o formulário

No `server.js`, ao lado dos equipamentos, o array das reservas e o número da próxima reserva:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
const reservas = [];
let proximoIdReserva = 1;
```

Leitura guiada: `reservas` começa como um array vazio. `proximoIdReserva` começa em 1 e pode mudar, porque dará um número novo a cada reserva criada.

A rota do formulário, que só mostra a página:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// O formulário de reserva.
app.get("/reservas/nova", (req, res) => {
  res.render("reserva-nova", { titulo: "Nova reserva", equipamentos: equipamentos });
});
```

Leitura guiada: `GET /reservas/nova` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

O modelo `views/reserva-nova.ejs` é o formulário da secção "O formulário em HTML", entre o `include` do cabeçalho e o do rodapé, com um comentário a dizer o que recebe. O cabeçalho ganha duas ligações no menu, `<a href="/reservas">Reservas</a>` e `<a href="/reservas/nova">Fazer uma reserva</a>`, e a página inicial uma ligação para o formulário.

`/reservas/nova` mostra o formulário. Se o enviares, o browser faz `POST /reservas`, e a resposta é a página "Página não encontrada", com 404: ainda não há rota para o `POST`, e o middleware final responde. Repara que o browser não te deixa enviar com um campo vazio, nem com o tempo 12: é a validação no browser a funcionar.

### Passo 2: ler o corpo, ainda sem verificar

A seguir ao middleware de registo, o `express.urlencoded`, da secção "O corpo do pedido e o middleware que o lê". E a rota do `POST`, numa primeira versão que guarda o que vier e responde com a página da reserva:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Criar uma reserva: POST /reservas, com os campos no corpo do pedido.
// Primeira versão: ainda sem verificar nada.
app.post("/reservas", (req, res) => {
  const reserva = {
    id: proximoIdReserva,
    equipamentoId: Number(req.body.equipamento_id),
    data: req.body.data,
    tempo: Number(req.body.tempo),
    nome: req.body.nome,
  };
  proximoIdReserva = proximoIdReserva + 1;
  reservas.push(reserva);
  const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
  res.render("reserva", { titulo: `Reserva ${reserva.id}`, reserva: reserva, equipamento: equipamento });
});
```

Leitura guiada: `POST /reservas` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

O `app.post` regista uma rota para o método `POST`. O caminho `/reservas` é o mesmo de uma rota `GET /reservas`, mas o método é outro, e por isso são duas rotas diferentes: o método faz parte da rota. A reserva tem um `id` dado pelo servidor, e o contador passa ao seguinte.

O modelo da página da reserva, `views/reserva.ejs`:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<%# A página de uma reserva, para onde o browser vai depois de reservar.
    Recebe o titulo, a reserva e o equipamento reservado. %>
<%- include("partials/cabecalho") %>
    <p>Equipamento: <a href="/equipamentos/<%= equipamento.id %>"><%= equipamento.nome %></a>, sala <%= equipamento.sala %></p>
    <p>Dia: <%= reserva.data %>, tempo <%= reserva.tempo %></p>
    <p>Reservado por: <%= reserva.nome %></p>
    <p><a href="/reservas">Ver todas as reservas</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: os `include` juntam os fragmentos escritos por ti. Entre eles, os valores entram com `<%=`, para o browser os receber como texto.

E a lista das reservas, com a rota e o modelo `views/reservas.ejs`:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// A lista das reservas feitas desde que o servidor arrancou.
app.get("/reservas", (req, res) => {
  // Para cada reserva, junta-se o equipamento, para a página mostrar o nome.
  const linhas = [];
  for (const reserva of reservas) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
    linhas.push({ reserva: reserva, equipamento: equipamento });
  }
  res.render("reservas", { titulo: "Reservas", linhas: linhas });
});
```

Leitura guiada: `GET /reservas` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<%# A lista das reservas. Recebe o titulo e as linhas, cada uma com a
    reserva e o equipamento reservado. %>
<%- include("partials/cabecalho") %>
    <% if (linhas.length === 0) { %>
      <p>Ainda não há reservas.</p>
    <% } else { %>
      <ul>
        <% for (const linha of linhas) { %>
          <li><a href="/reservas/<%= linha.reserva.id %>">Reserva <%= linha.reserva.id %></a>: <%= linha.equipamento.nome %>, dia <%= linha.reserva.data %>, tempo <%= linha.reserva.tempo %>, por <%= linha.reserva.nome %></li>
        <% } %>
      </ul>
    <% } %>
    <p><a href="/reservas/nova">Fazer uma reserva</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: os `include` juntam os fragmentos escritos por ti. Entre eles, os valores entram com `<%=`, para o browser os receber como texto.

A rota junta cada reserva ao seu equipamento, numa lista de linhas. O modelo só tem de mostrar essa lista. Como no tema anterior, a decisão sobre os dados fica na rota.

Preenche o formulário com o projetor, um dia, o tempo 3 e o teu nome, e envia. Aparece a página "Reserva 1", e `/reservas` mostra-a na lista. Até aqui, parece tudo bem. Agora três experiências, que o laboratório faz contigo:

- **Recarrega a página "Reserva 1".** O browser pergunta se queres reenviar os dados. Diz que sim, e abre `/reservas`: há duas reservas iguais. É o problema da secção "Quando corre bem", e o passo 4 resolve-o.
- **Envia um pedido sem passar pelo browser, com o equipamento 9.** No laboratório fazes isto tirando a validação do browser. A reserva fica guardada, a página da reserva dá erro 500 (o equipamento 9 não existe. E o modelo tenta ler `equipamento.nome`). A partir daí a lista das reservas também dá 500, para toda a gente. Uma reserva mal feita estragou a aplicação inteira.
- **Envia com o nome só com espaços.** A reserva fica com um nome invisível.

### Passo 3: validar, e o formulário outra vez

As três funções da secção "Validar no servidor" (`textoDoCampo`, `diaValido` e `validarReserva`) ficam no `server.js`, a seguir aos arrays e antes do middleware de registo. A rota do `POST` passa a validar primeiro, a responder com o formulário quando há erros, e só depois a guardar:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Criar uma reserva: POST /reservas, com os campos no corpo do pedido.
app.post("/reservas", (req, res) => {
  const resultado = validarReserva(req.body);

  // Com erros: o formulário outra vez, com o 400, os valores e as mensagens.
  if (Object.keys(resultado.erros).length > 0) {
    res.status(400).render("reserva-nova", {
      titulo: "Nova reserva",
      equipamentos: equipamentos,
      valores: resultado.valores,
      erros: resultado.erros,
    });
    return;
  }

  // Sem erros: a reserva é construída campo a campo, com os valores já
  // verificados, e nunca a partir do req.body inteiro.
  const reserva = {
    id: proximoIdReserva,
    equipamentoId: Number(resultado.valores.equipamento_id),
    data: resultado.valores.data,
    tempo: Number(resultado.valores.tempo),
    nome: resultado.valores.nome,
  };
  proximoIdReserva = proximoIdReserva + 1;
  reservas.push(reserva);
  const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
  res.render("reserva", { titulo: `Reserva ${reserva.id}`, reserva: reserva, equipamento: equipamento });
});
```

Leitura guiada: `POST /reservas` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

A reserva já não lê o `req.body`: lê os `valores` que a validação devolveu, limpos e verificados. O formulário passa a receber sempre os valores e os erros, também na rota do `GET`:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// O formulário de reserva, vazio e sem erros.
// Fica antes de /reservas/:id: um caminho fixo vem antes de um com parâmetro.
app.get("/reservas/nova", (req, res) => {
  res.render("reserva-nova", {
    titulo: "Nova reserva",
    equipamentos: equipamentos,
    valores: { equipamento_id: "", data: "", tempo: "", nome: "" },
    erros: {},
  });
});
```

Leitura guiada: `GET /reservas/nova` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

O modelo `views/reserva-nova.ejs` fica com a frase do topo, os valores e as mensagens, como na secção "Quando há erros":

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<%# O formulário de reserva. Recebe o titulo, os equipamentos para a lista,
    os valores a pôr nos campos e os erros, um por campo. Da primeira vez,
    os valores estão vazios e não há erros; depois de um envio com erros,
    traz o que o utilizador escreveu e as mensagens. %>
<%- include("partials/cabecalho") %>
    <% if (Object.keys(erros).length > 0) { %>
      <p><strong>A reserva não foi feita. Corrige os campos assinalados e volta a enviar.</strong></p>
    <% } %>
    <form method="post" action="/reservas">
      <p>
        <label for="equipamento_id">Equipamento
          <% if (erros.equipamento_id) { %><strong><%= erros.equipamento_id %></strong><% } %>
        </label>
        <select id="equipamento_id" name="equipamento_id" required>
          <option value="">Escolhe um equipamento</option>
          <% for (const equipamento of equipamentos) { %>
            <option value="<%= equipamento.id %>" <% if (String(equipamento.id) === valores.equipamento_id) { %>selected<% } %>><%= equipamento.nome %>, sala <%= equipamento.sala %></option>
          <% } %>
        </select>
      </p>
      <p>
        <label for="data">Dia
          <% if (erros.data) { %><strong><%= erros.data %></strong><% } %>
        </label>
        <input id="data" name="data" type="date" value="<%= valores.data %>" required>
      </p>
      <p>
        <label for="tempo">Tempo letivo, de 1 a 9
          <% if (erros.tempo) { %><strong><%= erros.tempo %></strong><% } %>
        </label>
        <input id="tempo" name="tempo" type="number" min="1" max="9" value="<%= valores.tempo %>" required>
      </p>
      <p>
        <label for="nome">O teu nome
          <% if (erros.nome) { %><strong><%= erros.nome %></strong><% } %>
        </label>
        <input id="nome" name="nome" maxlength="40" value="<%= valores.nome %>" required>
      </p>
      <button type="submit">Reservar</button>
    </form>
<%- include("partials/rodape") %>
```

Leitura guiada: os `include` juntam os fragmentos escritos por ti. Entre eles, os valores entram com `<%=`, para o browser os receber como texto.

Para veres a validação do servidor, vais alterar temporariamente `views/reserva-nova.ejs`. O atributo `novalidate` deixa passar campos vazios e valores fora dos limites. Não muda o tipo dos campos nem acrescenta opções à lista.

1. Acrescenta `novalidate` ao formulário: `<form method="post" action="/reservas" novalidate>`. Guarda, recarrega `/reservas/nova` e envia primeiro vazio. Depois preenche os outros campos corretamente e envia com o tempo 12.
2. Para o dia impossível, muda só o campo do dia de `type="date"` para `type="text"`. Guarda, recarrega, preenche os outros campos corretamente e escreve `2026-02-30`. Envia e repõe `type="date"` no modelo.
3. Para o equipamento inexistente, acrescenta temporariamente, dentro do `select` do equipamento, `<option value="9">Equipamento de ensaio 9</option>`. Guarda, recarrega, escolhe essa opção, preenche os outros campos corretamente e envia. Depois retira essa opção do modelo.
4. No fim, confirma que o dia voltou a `type="date"`, que a opção 9 saiu e que retiraste `novalidate`. Guarda e recarrega: o formulário voltou à versão normal.

Cada envio inválido responde 400 com a mensagem do campo respetivo e não guarda reserva nenhuma. Os outros valores continuam preenchidos. Depois de cada experiência, recarrega o formulário a partir de `/reservas/nova` para preparar o teste seguinte.

### Passo 4: o redirecionamento

Na rota do `POST`, as duas últimas linhas (o `find` do equipamento e o `res.render` da reserva) dão lugar ao redirecionamento:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Redirecionamento 303: o browser faz um GET à página da reserva.
// Recarregar essa página já não volta a enviar o formulário.
res.redirect(303, `/reservas/${reserva.id}`);
```

Leitura guiada: o código 303 não envia a página de confirmação. O browser lê o destino e faz um novo pedido `GET` a esse endereço.

E a página da reserva passa a ter uma rota `GET` própria, abaixo da do formulário e da lista. As verificações são as da rota de detalhe dos equipamentos:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Uma reserva: a página para onde o browser vai depois de reservar.
app.get("/reservas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O número da reserva tem de ser um número inteiro positivo.",
    });
    return;
  }
  const reserva = reservas.find((reserva) => reserva.id === id);
  if (!reserva) {
    res.status(404).render("erro", {
      titulo: "Reserva não encontrada",
      mensagem: `Não existe a reserva ${id}.`,
    });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
  res.render("reserva", { titulo: `Reserva ${reserva.id}`, reserva: reserva, equipamento: equipamento });
});
```

Leitura guiada: `GET /reservas/:id` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

Faz uma reserva e repara na barra de endereço: depois de carregares em "Reservar", o browser mostra `/reservas/1`, e não `/reservas`. Recarrega a página: aparece a mesma reserva, e `/reservas` continua a ter só uma. No separador Rede, o envio aparece como dois pedidos: o `POST /reservas`, com o 303, e o `GET /reservas/1`, com o 200.

### Passo 5: o servidor completo

O `server.js` no fim do exemplo:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js
// server.js: o catálogo de equipamentos da escola, agora com reservas feitas
// num formulário. O formulário envia por POST; o servidor lê o corpo, verifica
// cada campo e, se houver erros, volta a mostrar o formulário com os valores e
// as mensagens. Se estiver tudo bem, guarda a reserva e redireciona o browser
// para a página dela.
import express from "express";

const app = express();
const PORTA = 3000;

// O motor de modelos: o res.render vai procurar os ficheiros .ejs
// na pasta views.
app.set("view engine", "ejs");

// Os dados ficam em memória: existem enquanto o servidor estiver ligado.
const equipamentos = [
  { id: 1, nome: "Portátil", sala: "B12" },
  { id: 2, nome: "Projetor", sala: "A03" },
  { id: 3, nome: "Impressora", sala: "Secretaria" },
  { id: 4, nome: "Monitor", sala: "B12" },
];
const reservas = [];
let proximoIdReserva = 1;

/**
 * Devolve o texto de um campo do formulário, sem os espaços das pontas.
 * Um campo que não veio, ou que veio repetido (e chega como um array),
 * não é um texto: devolve o texto vazio.
 * @param {unknown} valor o valor tal como chegou em req.body
 * @returns {string}
 */
function textoDoCampo(valor) {
  if (typeof valor !== "string") {
    return "";
  }
  return valor.trim();
}

/**
 * Confirma que um texto no formato AAAA-MM-DD é um dia que existe.
 * O new Date aceita "2026-02-30" e transforma-o em 2 de março; por isso
 * confirma-se que o dia que sai é o mesmo que entrou.
 * @param {string} texto o dia, como o campo type="date" o envia
 * @returns {boolean}
 */
function diaValido(texto) {
  const dia = new Date(texto);
  if (Number.isNaN(dia.getTime())) {
    return false;
  }
  return dia.toISOString().slice(0, 10) === texto;
}

/**
 * Verifica os campos de uma reserva vindos do formulário.
 * Só lê os quatro campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * @param {object} corpo o req.body do pedido
 * @returns {object} um objeto com os valores e os erros
 */
function validarReserva(corpo) {
  const valores = {
    equipamento_id: textoDoCampo(corpo.equipamento_id),
    data: textoDoCampo(corpo.data),
    tempo: textoDoCampo(corpo.tempo),
    nome: textoDoCampo(corpo.nome),
  };
  const erros = {};

  // O equipamento tem de ser um dos da lista.
  const equipamento = equipamentos.find((equipamento) => equipamento.id === Number(valores.equipamento_id));
  if (!equipamento) {
    erros.equipamento_id = "Escolhe um equipamento da lista.";
  }

  // O dia é obrigatório, e tem de existir no calendário.
  if (valores.data === "") {
    erros.data = "Escolhe o dia da reserva.";
  } else if (!diaValido(valores.data)) {
    erros.data = "Esse dia não existe no calendário.";
  }

  // O tempo letivo é obrigatório, e é um número inteiro de 1 a 9.
  const tempo = Number(valores.tempo);
  if (valores.tempo === "") {
    erros.tempo = "Indica o tempo letivo.";
  } else if (!Number.isInteger(tempo) || tempo < 1 || tempo > 9) {
    erros.tempo = "O tempo letivo é um número inteiro de 1 a 9.";
  }

  // O nome é obrigatório, e tem no máximo 40 carateres.
  if (valores.nome === "") {
    erros.nome = "Escreve o teu nome.";
  } else if (valores.nome.length > 40) {
    erros.nome = "O nome tem, no máximo, 40 carateres.";
  }

  return { valores: valores, erros: erros };
}

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware que lê o corpo dos formulários enviados por POST e o põe em
// req.body. Tem de estar antes das rotas que usam o req.body.
app.use(express.urlencoded({ extended: false }));

// Página inicial, com a pesquisa por sala e a ligação para reservar.
app.get("/", (req, res) => {
  res.render("inicio", { titulo: "Início" });
});

// Lista de equipamentos. Com ?sala=B12, só os dessa sala.
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  let lista = equipamentos;
  if (sala) {
    lista = equipamentos.filter((equipamento) => equipamento.sala === sala);
  }
  res.render("equipamentos", { titulo: "Equipamentos", equipamentos: lista, sala: sala });
});

// Um equipamento: GET /equipamentos/2. O :id é um parâmetro de rota.
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O identificador tem de ser um número inteiro positivo.",
    });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === id);
  if (!equipamento) {
    res.status(404).render("erro", {
      titulo: "Equipamento não encontrado",
      mensagem: `Não existe o equipamento ${id}.`,
    });
    return;
  }
  res.render("equipamento", { titulo: equipamento.nome, equipamento: equipamento });
});

// O formulário de reserva, vazio e sem erros.
// Fica antes de /reservas/:id: um caminho fixo vem antes de um com parâmetro.
app.get("/reservas/nova", (req, res) => {
  res.render("reserva-nova", {
    titulo: "Nova reserva",
    equipamentos: equipamentos,
    valores: { equipamento_id: "", data: "", tempo: "", nome: "" },
    erros: {},
  });
});

// Criar uma reserva: POST /reservas, com os campos no corpo do pedido.
app.post("/reservas", (req, res) => {
  const resultado = validarReserva(req.body);

  // Com erros: o formulário outra vez, com o 400, os valores e as mensagens.
  if (Object.keys(resultado.erros).length > 0) {
    res.status(400).render("reserva-nova", {
      titulo: "Nova reserva",
      equipamentos: equipamentos,
      valores: resultado.valores,
      erros: resultado.erros,
    });
    return;
  }

  // Sem erros: a reserva é construída campo a campo, com os valores já
  // verificados, e nunca a partir do req.body inteiro.
  const reserva = {
    id: proximoIdReserva,
    equipamentoId: Number(resultado.valores.equipamento_id),
    data: resultado.valores.data,
    tempo: Number(resultado.valores.tempo),
    nome: resultado.valores.nome,
  };
  proximoIdReserva = proximoIdReserva + 1;
  reservas.push(reserva);

  // Redirecionamento 303: o browser faz um GET à página da reserva.
  // Recarregar essa página já não volta a enviar o formulário.
  res.redirect(303, `/reservas/${reserva.id}`);
});

// A lista das reservas feitas desde que o servidor arrancou.
app.get("/reservas", (req, res) => {
  // Para cada reserva, junta-se o equipamento, para a página mostrar o nome.
  const linhas = [];
  for (const reserva of reservas) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
    linhas.push({ reserva: reserva, equipamento: equipamento });
  }
  res.render("reservas", { titulo: "Reservas", linhas: linhas });
});

// Uma reserva: a página para onde o browser vai depois de reservar.
app.get("/reservas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O número da reserva tem de ser um número inteiro positivo.",
    });
    return;
  }
  const reserva = reservas.find((reserva) => reserva.id === id);
  if (!reserva) {
    res.status(404).render("erro", {
      titulo: "Reserva não encontrada",
      mensagem: `Não existe a reserva ${id}.`,
    });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
  res.render("reserva", { titulo: `Reserva ${reserva.id}`, reserva: reserva, equipamento: equipamento });
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).render("erro", {
    titulo: "Página não encontrada",
    mensagem: "Este endereço não existe no catálogo.",
  });
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
```

Leitura guiada: lê os dados iniciais, depois os middlewares pela ordem do ficheiro. Escolhe um pedido da tabela de resultados e segue só a rota que o recebe.

Os modelos são o `reserva-nova.ejs` do passo 3, o `reserva.ejs` e o `reservas.ejs` do passo 2. Os do tema anterior, com as duas ligações novas no menu do cabeçalho e na página inicial.

### Passo 6: os resultados

| Pedido | Código | O que acontece |
| --- | --- | --- |
| `GET /reservas/nova` | 200 | O formulário, vazio |
| `POST /reservas`: projetor, `2026-10-20`, tempo 3, Ana | 303 | O browser vai para `/reservas/1`, com a reserva |
| `GET /reservas/1` | 200 | "Reserva 1": o projetor, o dia, o tempo e o nome |
| `POST /reservas`: tudo vazio | 400 | O formulário, com as quatro mensagens |
| `POST /reservas`: monitor, `2026-10-21`, tempo 12, Rui | 400 | O formulário, com o monitor escolhido, o dia e o nome preenchidos, e a mensagem do tempo |
| `POST /reservas`: dia `2026-02-30` | 400 | O formulário, com "Esse dia não existe no calendário." |
| `POST /reservas`: equipamento 9 | 400 | O formulário, com "Escolhe um equipamento da lista." |
| `POST /reservas`: nome só com espaços | 400 | O formulário, com "Escreve o teu nome." |
| `POST /reservas`: tudo certo, mais `id=999` | 303 | A reserva fica com o número seguinte, e não com o 999 |
| `GET /reservas` | 200 | A lista das reservas feitas |
| `GET /reservas/abc` | 400 | "Pedido inválido" |
| `GET /reservas/99` | 404 | "Reserva não encontrada" |

Usa as alterações temporárias do passo 3 para enviares o formulário vazio, o tempo 12, o dia impossível e o equipamento 9. Para testar `id=999`, acrescenta dentro do formulário `<input type="hidden" name="id" value="999">`, guarda e recarrega. Faz uma reserva válida e confirma que recebe o número do contador, e não 999. Retira o campo escondido no fim.

## Observar os pedidos no browser

Com o separador Rede aberto, envia o formulário e clica no pedido `POST` a `reservas`.

- No separador **Payload** ("Carga", no Chrome em português; no Firefox, "Pedido"), aparece "Form Data", com cada campo e o seu valor, tal como o browser os enviou. É o sítio para confirmar os nomes dos campos: se a rota lê `req.body.nome` e o Payload mostra `nomes`, está encontrado o problema.
- Nos cabeçalhos do pedido, o `Content-Type: application/x-www-form-urlencoded`.
- Na resposta de um envio certo, o código 303 e o cabeçalho `Location: /reservas/1`. Logo a seguir, na lista, o `GET /reservas/1`, que o browser fez sozinho. Na resposta de um envio com erros, o código 400 e, no separador da resposta, o HTML do formulário com as mensagens.

Uma nota sobre o separador Rede: em alguns browsers, a lista é limpa quando a página muda. Se não vires o `POST` antes do `GET` do redirecionamento, liga a opção que mantém o registo ("Preserve log", ou "Manter registo"), no topo do separador, e envia outra vez.

## Erros frequentes

### TypeError: Cannot read properties of undefined (reading 'equipamento_id')

O `req.body` não existe: o `express.urlencoded` não está registado, ou está abaixo da rota do `POST`. O browser recebe um 500. Põe-no a seguir ao middleware de registo e antes de todas as rotas.

### O campo chega vazio, mesmo preenchido

O atributo `name` do campo, no formulário, não é o nome que a validação lê no `req.body`. A rota lê `corpo.nome`, e o formulário tem `name="nome_completo"`: os dois nunca se encontram, e a validação acha sempre que o nome está vazio. Confirma no Payload o nome que o browser enviou. Um campo sem `name` nem sequer é enviado.

### O formulário de reserva responde "Pedido inválido"

A rota `GET /reservas/:id` está acima da rota `GET /reservas/nova`, e o pedido a `/reservas/nova` vai parar à rota de uma reserva, que recebe `"nova"` como número e responde 400. O caminho fixo vem antes do caminho com parâmetro.

### Depois de um envio com erros, a reserva fica guardada e o servidor vai abaixo

Falta o `return` depois do `res.status(400).render(...)`. A rota continua: guarda a reserva com os dados errados e responde com o redirecionamento, que sai logo, como se tivesse corrido bem. Um instante depois, a página do formulário fica pronta, já não há a quem a enviar. O erro `Cannot set headers after they are sent to the client` deita o servidor abaixo, antes de o browser conseguir pedir a página para onde foi redirecionado. O browser mostra que não consegue ligar-se ao servidor. Com o `node --watch`, o terminal acaba em `Failed running 'server.js'. Waiting for file changes before restarting...`. Depois de cada resposta de erro, o `return`.

### O browser não deixa enviar o formulário

É a validação do browser: um campo com `required` está vazio, ou o tempo está fora do `min` e do `max`. Não é um erro. Para experimentares a validação do servidor, usa o `novalidate` do passo 3, e tira-o no fim.

### Depois de um erro, a lista do equipamento volta ao início

A comparação do `selected` está a comparar um número com um texto: `equipamento.id === valores.equipamento_id` dá sempre `false`. Usa `String(equipamento.id) === valores.equipamento_id`.

### Depois de um erro, os campos aparecem vazios

A rota do `POST`, quando há erros, não está a passar os `valores` ao modelo, ou o modelo não os põe no `value` de cada campo. Confirma os dois lados: o `render` com `valores: resultado.valores`, e o `value="<%= valores.nome %>"` no campo.

### A página de uma reserva dá 500, com "Cannot read properties of undefined (reading 'id')"

A reserva aponta para um equipamento que não existe, e o modelo tenta ler o `equipamento.id`. Acontece com a primeira versão do `POST`, sem validação. A correção não é no modelo: é não deixar entrar a reserva, validando o `equipamento_id` antes de a guardar.

## Segurança: o que este tema já pede

- **O servidor valida tudo.** A validação do browser ajuda quem preenche e não protege nada: um pedido pode chegar sem passar pelo formulário. Cada regra está na validação do servidor, mesmo que o formulário já a tenha.
- **Só os campos previstos.** A reserva constrói-se campo a campo, a partir dos valores validados. O `req.body` inteiro nunca é guardado nem passado a outro sítio.
- **O tipo antes do resto.** Um campo pode não vir, ou vir como um array. O `typeof` vem antes do `trim()` e de qualquer outra operação de texto.
- **Os valores voltam ao formulário com `<%=`.** No `value` e em qualquer outro sítio: são, sem exceção, valores que vieram do pedido.
- **Limites.** O servidor decide o tamanho máximo de cada campo e do pedido inteiro. O `express.urlencoded` recusa por omissão um corpo com mais de 100 kilobytes, com o 413.
- **Um `POST` responde com um redirecionamento.** O redirecionamento evita reservas repetidas ao recarregar. A página no ecrã é o resultado de um `GET`, que podes recarregar, guardar e partilhar sem criar outra reserva.
- **O que este tema ainda não trata.** Uma página de outro site pode ter um formulário que envia para o teu `POST /reservas`. O browser de quem a visitar envia-o. Chama-se CSRF, e trata-se no tema Erros e segurança web, depois das sessões.


## Palavras novas deste guia

- Corpo do pedido: parte do pedido HTTP que transporta os campos enviados por `POST`.
- `urlencoded`: formato `nome=valor&nome=valor`, usado por estes formulários.
- `name`: atributo que dá o nome com que um campo é enviado ao servidor.
- `id` e `for`: identificador do campo e referência da etiqueta que a liga a esse campo.
- Validação: verificação de que os dados recebidos servem antes de os usar.
- Lista de valores permitidos: conjunto fechado de opções que o servidor aceita.
- Redirecionamento: resposta que diz ao browser para fazer um pedido a outro endereço.
- PRG: sequência `POST`, redirecionamento e `GET`, que evita repetir uma criação ao recarregar.
- Campo escondido: campo de formulário que é enviado sem estar visível na página.

## Verificar o que aprendeste

1. Porque é que a pesquisa por sala envia por `GET` e o formulário de reserva por `POST`? Onde vão os dados em cada caso?
2. O que liga o atributo `for` de uma etiqueta ao campo? E o que liga o campo à rota que o lê?
3. O `express.urlencoded` está no fim do ficheiro, logo antes do `app.listen`. O que acontece quando se envia o formulário? Porquê?
4. Se o formulário tem `required` e `min="1" max="9"`, porque é que o servidor tem de verificar o tempo outra vez?
5. Porque é que a validação usa o `typeof` antes do `trim()`? Dá um pedido em que isso faça diferença.
6. O `new Date("2026-02-30")` não dá erro. O que dá, e como é que a `diaValido` o apanha?
7. Uma reserva com o equipamento 9: porque é que o código é 400, e não 404 como em `/equipamentos/9`?
8. Depois de um envio com erros, o formulário volta com os valores preenchidos. Porque é que o `value` usa `<%=`, e não `<%-`?
9. O que acontece se recarregares a página de confirmação de uma reserva, numa versão que responde ao `POST` com a página e o 200? E numa que responde com o 303?
10. Porque é que, depois de um envio com erros, a resposta não é um redirecionamento?

## O que vem a seguir

Faz o [laboratório](05-formularios-e-validacao-laboratorio.md) e depois a [ficha de exercícios](05-formularios-e-validacao-exercicios.md).

O próximo tema é Cookies e sessões. Até aqui, o servidor não se lembra de nada entre dois pedidos: cada pedido chega sozinho. O servidor não sabe se foi a mesma pessoa que fez o anterior. Por isso o formulário de reserva pede o nome todas as vezes. Com as sessões, o servidor passa a lembrar-se de quem está a usar a aplicação, entre pedidos. A página de reserva pode, por exemplo, mostrar as reservas dessa pessoa. A segurança dos formulários (o CSRF, que a secção anterior refere) volta depois, no tema Erros e segurança web.

![Rodapé](../imagens/rodape.png)
