![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: Formulários e validação

Laboratório do quinto tema do módulo Aplicações baseadas em browsers. Partes do catálogo com páginas do tema anterior e acrescentas-lhe as reservas. Começas pelo formulário e pelo `POST` que o recebe. Depois, juntas a validação, o formulário com mensagens de erro e o redirecionamento no sucesso. Pelo caminho, vês o que corre mal sem cada uma destas peças. Isto acontece porque as provocas de propósito. No fim verificas o servidor de um colega com uma lista de verificação. O colega verifica o teu servidor.

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui. O [guia](05-formularios-e-validacao.md) tem a teoria completa, para saberes mais. Antes de cada experiência, escreve a previsão no caderno e confere-a com a resposta desta fase.

## O que vais construir

Vais continuar o catálogo numa pasta de trabalho própria. O destino é o exemplo completo deste tema, com as experiências descritas nas fases.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | Um `POST` pode mudar o estado | Conferes a paragem 1 antes de continuar |
| 2 | O formulário junta campos pelo `name` | Conferes a paragem 2 antes de continuar |
| 3 | O corpo chega codificado e precisa de ser lido antes da rota | Conferes a paragem 3 antes de continuar |
| 4 | Guardar sem verificar permite que um pedido estrague os dados | Conferes a paragem 4 antes de continuar |
| 5 | Validar é verificar cada campo antes de mudar o array | Conferes a paragem 5 antes de continuar |
| 6 | O 303 indica ao browser uma página que pode pedir com `GET` | Conferes a paragem 6 antes de continuar |
| 7 | O servidor constrói a reserva pelos campos permitidos | Conferes a paragem 7 antes de continuar |
| 8 | O browser ajuda a preencher | Conferes a paragem 8 antes de continuar |

## Palavras que vais usar

- Corpo do pedido: parte do pedido HTTP que transporta os campos enviados por `POST`.
- `urlencoded`: formato `nome=valor&nome=valor`, usado por estes formulários.
- `name`: atributo que dá o nome com que um campo é enviado ao servidor.
- `id` e `for`: identificador do campo e referência da etiqueta que a liga a esse campo.
- Validação: verificação de que os dados recebidos servem antes de os usar.
- Lista de valores permitidos: conjunto fechado de opções que o servidor aceita.
- Redirecionamento: resposta que diz ao browser para fazer um pedido a outro endereço.
- PRG: sequência `POST`, redirecionamento e `GET`, que evita repetir uma criação ao recarregar.
- Campo escondido: campo de formulário que é enviado sem estar visível na página.

## O que precisas

- Node 24 LTS: executa JavaScript no servidor. No terminal do computador ou do contentor Docker preparado, corre `node --version`; deve aparecer `v24` seguido da versão instalada.
- npm: instala os pacotes do projeto. No mesmo terminal, confirma com `npm --version`, que mostra a versão instalada.
- Um editor para criares e guardares os ficheiros. No VS Code, abre a pasta de trabalho com "Ficheiro > Abrir Pasta".
- Um browser com ferramentas de programador. Abre-as com F12 ou com o menu de ferramentas do browser.
- Uma pasta nova para a tua cópia do exemplo de partida indicado abaixo. Não trabalhes dentro da pasta distribuída.

## Se alguma coisa falhar

1. Confirma a pasta no terminal: `pwd` no macOS/Linux ou `Get-Location` na PowerShell. Nela devem existir `package.json` e `server.js`. Usa `cd` e o caminho da tua cópia para lá entrar.
2. Confirma que guardaste o ficheiro e que o browser mostra o endereço do teu servidor.
3. Lê a primeira mensagem do terminal antes de mudares código. Compara o resultado esperado, o obtido e uma hipótese para a causa.
4. Se a porta 3000 estiver ocupada, não pares outro processo. Na tua cópia, muda `PORTA` para 3100 e usa essa porta em todos os endereços deste laboratório.

## Preparar o projeto

Precisas do catálogo com páginas do laboratório do tema anterior, a funcionar. Se não o tiveres, copia a pasta [catalogo-com-ejs](../exemplos/aplicacoes-em-browser/catalogo-com-ejs/README.md) dos exemplos para a tua pasta de trabalho e corre `npm install` dentro dela.

Se usares Docker, executa os comandos Node/npm no terminal do contentor preparado pelo professor, com a tua pasta de trabalho selecionada. Se não houver internet, usa a instalação do apoio fornecido pelo professor em vez de `npm install`; depois continua com os mesmos ficheiros.

Arranca o servidor com `node --watch server.js`, dentro da pasta do projeto. As reservas ficam num array, em memória: sempre que o servidor reinicia, voltam a zero. Para limpar as reservas de teste, usa o terminal onde arrancaste este servidor. Faz Ctrl+C e volta a correr `node --watch server.js`. Assim, começas com o array vazio e o contador em 1, sem depender de guardar um ficheiro sem alterações.

Mantém aberto o separador Rede das ferramentas de programador durante todo o laboratório.

## Fase 1: prever antes de programar

Um `POST` pode mudar o estado. As previsões devem seguir a ordem dos pedidos, sem repor os dados entre linhas.


O servidor do fim do exemplo guiado recebe estes pedidos `POST /reservas`, um a seguir ao outro, logo depois de arrancar. Para cada um, escreve no caderno o código da resposta e o que o browser acaba por mostrar.

| Corpo do pedido | Código | O que o browser mostra |
| --- | --- | --- |
| `equipamento_id=1&data=2026-11-03&tempo=2&nome=Inês` | | |
| `equipamento_id=1&data=2026-11-03&tempo=2&nome=` | | |
| `equipamento_id=1&data=2026-11-03&tempo=10&nome=Inês` | | |
| `equipamento_id=7&data=2026-11-03&tempo=2&nome=Inês` | | |
| `equipamento_id=1&data=2026-11-31&tempo=2&nome=Inês` | | |
| `equipamento_id=4&data=2026-11-04&tempo=9&nome=Inês&id=50` | | |

No fim do laboratório, na parte 8, voltas a esta tabela.


### Respostas para conferires esta fase

Com o servidor do fim do exemplo, acabado de arrancar:

| Corpo do pedido | Código | O que o browser mostra |
| --- | --- | --- |
| `equipamento_id=1&data=2026-11-03&tempo=2&nome=Inês` | 303 | A página da reserva 1 (`/reservas/1`) |
| `...&nome=` | 400 | O formulário, com "Escreve o teu nome." e os outros campos preenchidos |
| `...&tempo=10&...` | 400 | O formulário, com "O tempo letivo é um número inteiro de 1 a 9." |
| `equipamento_id=7&...` | 400 | O formulário, com "Escolhe um equipamento da lista." e a lista no início |
| `...&data=2026-11-31&...` | 400 | O formulário, com "Esse dia não existe no calendário." (novembro tem 30 dias) |
| `equipamento_id=4&data=2026-11-04&tempo=9&nome=Inês&id=50` | 303 | A página da reserva 2, e não da 50 |

As previsões mais erradas, por experiência de temas anteriores: o equipamento 7 como 404 (o guia explica porque é 400), o 31 de novembro como aceite. A última como reserva 50 ou como 400 por ter um campo a mais. O tempo 9 é aceite: é o limite. E está incluído.

### Paragem 1

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 2: o formulário

O formulário junta campos pelo `name`. A etiqueta usa o `for` para apontar para o `id` do campo.


1. Acrescenta ao `server.js` o array `reservas` e o `proximoIdReserva`, e a rota `GET /reservas/nova` da referência de código desta fase.
2. Cria o `views/reserva-nova.ejs`, com o formulário da referência de código desta fase. Acrescenta as duas ligações ao menu do cabeçalho e a ligação à página inicial.
3. Abre `/reservas/nova` e carrega em cada etiqueta (o texto "Equipamento", "Dia" e os outros). O cursor vai para o campo dessa etiqueta: é o `for` a apontar para o `id`.
4. Tenta enviar o formulário vazio, e depois com o tempo 12. Regista o que o browser faz, e se aparece algum pedido no separador Rede.
5. Preenche tudo bem e envia. Prevê primeiro o que vais ver.

O que deves ver: a página "Página não encontrada", com o 404, e no separador Rede um `POST` a `reservas`. Ainda não há rota para o `POST`, e o middleware final respondeu. Nos passos anteriores, não houve pedido nenhum: o browser não deixou o formulário sair.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

O formulário de reserva tem quatro campos: o equipamento, escolhido de uma lista; o dia; o tempo letivo, de 1 a 9; e o nome de quem reserva.

O ficheiro `views/reserva-nova.ejs` inicial fica completo com o cabeçalho, o formulário e o rodapé:

```ejs
<%# views/reserva-nova.ejs: primeiro formulário de reserva, ainda sem mensagens. %>
<%- include("partials/cabecalho") %>
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
<%- include("partials/rodape") %>
```

Os dois atributos do `<form>` dizem para onde e como vão os dados: `action="/reservas"` é o caminho do pedido, e `method="post"` é o método. O botão `type="submit"` envia o formulário.

Cada campo tem três atributos que convém não confundir:

- o **`name`** é o nome com que o valor viaja no corpo do pedido, e é o nome que o servidor vai ler. Um campo sem `name` não é enviado. É o atributo que liga o formulário à rota;
- o **`id`** identifica o campo dentro da página, e serve para lhe ligar a etiqueta;
- o **`for`** da etiqueta (`<label>`) aponta para o `id` do campo.

A ligação entre a etiqueta e o campo é a primeira regra de um formulário **acessível**, ou seja, que toda a gente consegue usar. Quem usa um leitor de ecrã, porque não vê bem, ouve o texto da etiqueta quando chega ao campo. Sem a ligação ouve só "campo de texto", sem saber o que lá escrever. Para todos, carregar na etiqueta põe o cursor no campo, o que dá jeito sobretudo no telemóvel. Neste formulário, o `name` e o `id` têm o mesmo valor, o que é habitual e evita enganos, mas são duas coisas diferentes.

Na lista do equipamento, o valor de cada opção é o número do equipamento, e o texto é o que a pessoa lê. É o valor, e não o texto, que vai no corpo: escolher "Projetor, sala A03" envia `equipamento_id=2`. A primeira opção tem o valor vazio, para a lista não começar já com um equipamento escolhido sem a pessoa dar por isso.

Os outros atributos ajudam quem preenche. O `required` impede o envio com um campo vazio. O `type="date"` mostra um calendário. O `type="number"`, com `min` e `max`, só aceita números de 1 a 9. O `maxlength="40"` não deixa escrever mais de 40 carateres. Quando um destes não é cumprido, o browser não envia o formulário e mostra um aviso junto do campo. Isto chama-se **validação no browser**, e é útil, porque a pessoa vê o erro antes de perder tempo com um pedido. Mas um pedido pode vir de outro programa ou de um formulário alterado. Na fase 5 vais validar no servidor antes de guardar os valores.

No `server.js`, ao lado dos equipamentos, o array das reservas e o número da próxima reserva:

```js fragment
const reservas = [];
let proximoIdReserva = 1;
```

A rota do formulário, que só mostra a página:

```js fragment
// O formulário de reserva.
app.get("/reservas/nova", (req, res) => {
  res.render("reserva-nova", { titulo: "Nova reserva", equipamentos: equipamentos });
});
```

O modelo `views/reserva-nova.ejs` é o formulário completo mostrado nesta fase, entre o `include` do cabeçalho e o do rodapé, com um comentário a dizer o que recebe. O cabeçalho ganha duas ligações no menu, `<a href="/reservas">Reservas</a>` e `<a href="/reservas/nova">Fazer uma reserva</a>`, e a página inicial uma ligação para o formulário.

`/reservas/nova` mostra o formulário. Se o enviares, o browser faz `POST /reservas`, e a resposta é a página "Página não encontrada", com 404: ainda não há rota para o `POST`, e o middleware final responde. Repara que o browser não te deixa enviar com um campo vazio, nem com o tempo 12: é a validação no browser a funcionar.

### Respostas para conferires esta fase

Carregar numa etiqueta põe o cursor no campo. O formulário vazio e o tempo 12 não saem do browser, e o separador Rede não mostra pedido nenhum. Bem preenchido, o `POST /reservas` dá 404 com a página "Página não encontrada": o middleware final apanha todos os métodos.

Erro a esperar: o `for` a apontar para o `name` de um campo cujo `id` é diferente, ou um campo sem `id`. A etiqueta deixa de funcionar e não há erro nenhum; vê-se carregando nela.

### Paragem 2

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 3: ler o corpo, e dois erros de propósito

O corpo chega codificado e precisa de ser lido antes da rota. O `express.urlencoded` prepara o `req.body`.


1. Acrescenta as rotas `POST /reservas` e `GET /reservas` da referência de código desta fase. Cria os modelos `views/reserva.ejs` e `views/reservas.ejs`. Não acrescentes ainda o `express.urlencoded`.
2. Preenche o formulário com o projetor, um dia, o tempo 3 e o teu nome, e envia. Prevê primeiro.

O que deves ver: uma página de erro com o código 500 e, no início, `TypeError: Cannot read properties of undefined (reading 'equipamento_id')`. Sem o middleware, o `req.body` não existe.

3. Acrescenta a linha `app.use(express.urlencoded({ extended: false }));` no fim do ficheiro, logo antes do `app.listen`. Guarda e envia outra vez. Prevê primeiro.
4. Regista o que aconteceu, e explica-o no caderno com a segunda regra do middleware.
5. Muda a linha para o sítio certo: a seguir ao middleware de registo e antes das rotas. Guarda e envia outra vez.

O que deves ver: a página "Reserva 1", com o projetor, o dia, o tempo e o teu nome.

6. No separador Rede, clica no `POST` a `reservas` e abre o Payload. Copia para o caderno o que aparece em "Form Data". Confirma que os nomes são os `name` do formulário.
7. Abre `/reservas` num segundo separador: a reserva está na lista. Mantém o primeiro separador na página "Reserva 1", para a experiência da fase seguinte. Não voltes a enviar o formulário nesta fase.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

A linha `app.use(express.urlencoded({ extended: false }));` lê o corpo do formulário e põe os campos em `req.body` antes de a rota os usar. O lugar certo é a seguir ao middleware de registo e antes das rotas. Coloca-a só quando os passos 3 e 5 o indicarem, para observares a diferença. A rota do `POST` tem esta primeira versão, que guarda o que vier e responde com a página da reserva:

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

O `app.post` regista uma rota para o método `POST`. O caminho `/reservas` é o mesmo de uma rota `GET /reservas`, mas o método é outro, e por isso são duas rotas diferentes: o método faz parte da rota. A reserva tem um `id` dado pelo servidor, e o contador passa ao seguinte.

O modelo da página da reserva, `views/reserva.ejs`:

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

E a lista das reservas, com a rota e o modelo `views/reservas.ejs`:

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

A rota junta cada reserva ao seu equipamento, numa lista de linhas. O modelo só tem de mostrar essa lista. Como no tema anterior, a decisão sobre os dados fica na rota.

O envio do passo 5 criou a reserva 1. A lista do passo 7 mostra essa mesma reserva, sem criar outra. As experiências de reenvio e de dados inválidos ficam para a fase 4, onde cada pedido tem uma previsão e uma observação próprias.

### Respostas para conferires esta fase

Sem o `express.urlencoded`: 500 e `TypeError: Cannot read properties of undefined (reading 'equipamento_id')`. No fim do ficheiro: o mesmo erro. A explicação esperada é a segunda regra do middleware: o que prepara alguma coisa para as rotas tem de vir antes delas. Quando a rota corre, o middleware de baixo ainda não correu, e para este pedido nunca chega a correr, porque a rota já respondeu com o erro.

No sítio certo: a página "Reserva 1". No Payload, em "Form Data": `equipamento_id`, `data`, `tempo` e `nome`, com os valores escolhidos; o equipamento aparece como número (o `value` da opção), e não como "Projetor".

### Paragem 3

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 4: o que corre mal sem validação

Guardar sem verificar permite que um pedido estrague os dados. Vais provocar a falha numa cópia de estudo.


1. No primeiro separador, prevê o que acontece ao recarregar a página "Reserva 1". Recarrega-a e aceita reenviar os dados do formulário. Depois consulta `/reservas` no segundo separador. Quantas reservas há? Escreve no caderno porque é que isto é um problema numa aplicação de reservas.
2. Agora vais enviar um pedido que o browser não deixaria passar. No `views/reserva-nova.ejs`, acrescenta ao `<form>` o atributo `novalidate`, que desliga a validação do browser nesse formulário. Guarda, abre `/reservas/nova` e envia o formulário sem preencher nada. Prevê primeiro.

O que deves ver: uma página de erro com o código 500 e `Cannot read properties of undefined (reading 'id')`, a apontar para o `reserva.ejs`. A reserva foi guardada com um equipamento que não existe, e a página dela não consegue mostrar o nome do equipamento.

3. Abre `/reservas`. Prevê primeiro: a lista funciona?

O que deves ver: também um 500. A reserva errada está no array, e a lista tropeça nela. A partir de agora, a lista das reservas está estragada para toda a gente, até o servidor reiniciar. Foi um só pedido.

4. No terminal onde arrancaste este servidor, faz Ctrl+C e volta a correr `node --watch server.js`. Abre `/reservas` e confirma "Ainda não há reservas.". A reserva inválida e as duas reservas de teste desapareceram. Deixa ficar o `novalidate`: vais precisar dele na fase seguinte. O campo do dia continua com `type="date"`.


### Respostas para conferires esta fase

- **Passo 1.** Recarregar e aceitar o reenvio cria a reserva 2, igual à 1. Numa aplicação de reservas, ocupa o equipamento duas vezes, e a pessoa nem sabe que a segunda reserva existe.
- **Passo 2.** Com `novalidate` e o formulário vazio, o `equipamento_id` chega como texto vazio, o `Number("")` dá 0. Não há equipamento 0: a reserva é guardada com o `equipamentoId` 0, e a página dela dá 500, com `Cannot read properties of undefined (reading 'id')` e o `>>` na linha 4 do `reserva.ejs`.
- **Passo 3.** A lista também dá 500, no `reservas.ejs`. Confere esta ideia: um só pedido mal feito estragou uma página para toda a gente, até o servidor reiniciar.
- **Passo 4.** Depois de parar e arrancar este servidor, a lista volta a funcionar e está vazia. O contador voltou a 1, porque os dados existem apenas na memória deste processo.

### Paragem 4

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 5: validar, e o formulário outra vez

Validar é verificar cada campo antes de mudar o array. Quando falha, o formulário volta com os valores e as mensagens.


1. Acrescenta ao `server.js` as três funções da referência de código desta fase: a `textoDoCampo`, a `diaValido` e a `validarReserva`. Transcreve-as, lendo as explicações e os comentários. A `diaValido` é uma função de apoio fornecida: deves compreender o que verifica, aplicá-la e explicar os casos. Não tens de a escrever de raiz.
2. Muda a rota `POST /reservas` para a da referência de código desta fase: valida primeiro, responde com o formulário quando há erros, e só depois constrói e guarda a reserva.
3. Muda a rota `GET /reservas/nova` para passar os valores vazios e os erros vazios, e o modelo `reserva-nova.ejs` para o da referência de código desta fase. Mantém o `novalidate` no `<form>`.
4. Envia o formulário vazio. Regista o código e as mensagens. Confirma em `/reservas` que nenhuma reserva foi guardada.
5. Preenche tudo bem, mas com o tempo 12. Regista o código, a mensagem e o que ficou preenchido nos outros campos, incluindo a lista do equipamento.
6. Agora o dia que não existe. O calendário do browser não te deixa escolher o 30 de fevereiro, por isso muda temporariamente, no modelo, o `type="date"` do campo do dia para `type="text"`. Escreve `2026-02-30` e envia. Regista a mensagem. Depois repõe o `type="date"`.
7. No nome, escreve `"><b>x</b>`, com as aspas, deixa o tempo vazio, e envia. Prevê primeiro: o que aparece no campo do nome, quando o formulário voltar?

O que deves ver: o campo do nome com o texto `"><b>x</b>` tal como o escreveste, e nenhum negrito na página. O valor voltou ao `value` com `<%=`, que fez escaping às aspas e às etiquetas.

8. Faz uma reserva certa. A página da reserva aparece, como antes.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

Em `req.body`, um campo que o formulário não enviou é `undefined`. E um campo enviado duas vezes, como em `nome=Ana&nome=Rita`, não chega como texto: chega como um array, `["Ana", "Rita"]`. Os dois casos aparecem quando o pedido não vem do teu formulário. Os dois fariam o servidor falhar se tentasses chamar o `trim()` sobre eles, porque o `trim()` só existe nos textos. Por isso, antes de mais nada, cada campo passa por uma pequena função:

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

Primeiro confirma-se o tipo, com o `typeof`, e só depois se usa o `trim()`. Um valor que não é texto passa a ser o texto vazio, e vai falhar na pergunta seguinte, a do campo preenchido, com uma mensagem que faz sentido.

O `tempo` chega como texto, e é preciso confirmar que é um número inteiro. Faz-se como no tema 3, com o `Number` e o `Number.isInteger`, mas com um cuidado: o `Number("")` dá 0, e não um erro. Por isso a verificação do campo vazio vem primeiro, com a sua mensagem, e só depois a do número.

O `data` é mais traiçoeiro. O campo `type="date"` envia o dia no formato `AAAA-MM-DD`, como `2026-10-20`, mas quem não usar o formulário pode enviar qualquer texto. Para o JavaScript, um dia é um objeto `Date`, e o `new Date("2026-10-20")` cria o dia 20 de outubro. Um texto que não é um dia, como `"abc"`, dá uma data inválida, e isso confirma-se com o `getTime()`, que nesse caso devolve `NaN`. O problema é o meio-termo: o `new Date("2026-02-30")` não dá uma data inválida. Dá 2 de março, porque o JavaScript acerta os dias a mais e passa para o mês seguinte, sem avisar. Um texto com o formato certo e um dia que não existe passava a verificação.

A solução é confirmar que o dia que sai é o mesmo que entrou. A função `diaValido`, fornecida abaixo, trata desta verificação. Usa-a tal como está e segue a explicação para perceberes porque aceita ou recusa cada dia:

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

O `toISOString()` escreve a data no formato `2026-03-02T00:00:00.000Z`, e o `slice(0, 10)` fica com os dez primeiros carateres, o dia. Para `"2026-10-20"`, sai `"2026-10-20"`, igual ao que entrou. Para `"2026-02-30"`, sai `"2026-03-02"`, diferente, e a função devolve `false`. Para `"abc"`, a primeira verificação já devolveu `false`. Esta ideia, a de que um valor pode parecer do tipo certo e não servir, vale para muito mais do que datas.

Se o pedido vier sem corpo, ou com um formato que o `express.urlencoded` não lê, o `req.body` pode não existir. A função trata-o como um objeto vazio: todos os campos faltam e recebem as mensagens já previstas. Esta proteção fica na validação; os erros provocados na primeira versão da fase 3 continuam a mostrar a falta do middleware.

As cinco perguntas, juntas numa função:

```js fragment
/**
 * Verifica os campos de uma reserva vindos do formulário.
 * Só lê os quatro campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * @param {object|undefined} corpo o req.body do pedido, que pode não existir
 * @returns {object} um objeto com os valores e os erros
 */
function validarReserva(corpo) {
  // Sem corpo lido, todos os campos faltam e recebem os erros já previstos.
  if (!corpo) {
    corpo = {};
  }
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

A função devolve duas coisas, num objeto. Os `valores` são os quatro campos já limpos, como texto: vão servir para voltar a preencher o formulário, se houver erros. Os `erros` são um objeto com uma propriedade por campo errado, e o valor de cada propriedade é a mensagem. Um formulário sem erros dá um objeto vazio, `{}`. A função verifica os quatro campos e não pára no primeiro erro. A pessoa vê de uma vez tudo o que tem de corrigir.

Cada mensagem diz o que fazer, e não só o que está mal: "Escolhe o dia da reserva." ajuda mais do que "Dia inválido.". Quem se enganou não está a ler o código: está a olhar para o formulário e quer saber o que mudar.

As três funções mostradas nesta fase (`textoDoCampo`, `diaValido` e `validarReserva`) ficam no `server.js`, a seguir aos arrays e antes do middleware de registo.

Para saber se há erros, a rota conta as propriedades do objeto `erros`. O `Object.keys(resultado.erros)` devolve uma lista com os nomes dessas propriedades, como `["data", "nome"]`. A propriedade `length` dá o número de elementos da lista. Se for maior do que zero, há pelo menos um erro. Com o objeto vazio, `{}`, a lista também fica vazia e o número é zero.

A rota do `POST` passa a validar primeiro, a responder com o formulário quando há erros, e só depois a guardar:

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

A reserva já não lê o `req.body`: lê os `valores` que a validação devolveu, limpos e verificados. O formulário passa a receber sempre os valores e os erros, também na rota do `GET`:

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

Na lista do equipamento, é preciso voltar a marcar a opção escolhida. O `equipamento.id` é um número, como `2`, mas o valor recebido do formulário é texto, como `"2"`. O `String(equipamento.id)` converte o número em texto para o comparar com `valores.equipamento_id`, usando `===`. Quando são iguais, o modelo escreve o atributo `selected` nessa opção. Sem a conversão, `2 === "2"` seria `false` e a lista voltaria ao início.

O modelo `views/reserva-nova.ejs` fica com a frase do topo, os valores e as mensagens, como mostra este modelo completo. Mantém também o atributo temporário `novalidate` pedido no passo 3:

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

Para conferires estes envios, segue os passos 4 a 7 desta fase. O `novalidate` deixa passar o formulário vazio e o tempo 12, mas não muda o calendário. Para `2026-02-30`, muda temporariamente o campo do dia para `type="text"`, guarda, recarrega e envia com os restantes campos válidos. Depois repõe `type="date"`. Mantém o `novalidate` até à fase 8, onde o vais retirar.

### Respostas para conferires esta fase

- **Passo 4.** Vazio: 400, com as quatro mensagens e a frase do topo. Em `/reservas`, nenhuma reserva nova.
- **Passo 5.** Tempo 12: 400, com a mensagem do tempo; o equipamento continua escolhido, o dia e o nome continuam preenchidos. O tempo mostra o 12, para a pessoa ver o que escreveu mal.
- **Passo 6.** `2026-02-30`, com o campo em `type="text"`: 400, com "Esse dia não existe no calendário.".
- **Passo 7.** `"><b>x</b>` no nome, com o tempo vazio: o campo volta com o texto tal como foi escrito; no código-fonte, `value="&#34;&gt;&lt;b&gt;x&lt;/b&gt;"`. Sem o escaping, as aspas fechariam o atributo e o `<b>` entraria na página.

Erros a esperar: a lista do equipamento a voltar sempre ao início (falta o `String(...)` no `selected`). Os campos a voltar vazios (o `render` do 400 sem os `valores`, ou o `value` em falta no modelo). Se a rota `GET /reservas/nova` não passar os valores e os erros vazios, abrir o formulário dá `erros is not defined`. O modelo usa `erros` na frase do topo, antes de chegar a `valores`.

### Paragem 5

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 6: o redirecionamento

O 303 indica ao browser uma página que pode pedir com `GET`. Recarregar essa página não repete a criação.


1. Com a página da reserva feita no passo 8 da fase 5 no ecrã, prevê o resultado de a recarregar. Recarrega-a e aceita reenviar. Confirma em `/reservas` que há duas reservas iguais. É o problema da fase 4, que a validação não resolveu.
2. Na rota do `POST`, troca as duas últimas linhas pelo `res.redirect(303, ...)` da referência de código desta fase. Acrescenta a rota `GET /reservas/:id`, abaixo da rota do formulário e da lista, e guarda. No terminal deste servidor, faz Ctrl+C e volta a correr `node --watch server.js`. Confirma em `/reservas` que a lista ficou vazia.
3. Antes de enviar, liga no separador Rede a opção que mantém o registo ("Preserve log"). Faz uma reserva. Repara no endereço que o browser mostra no fim, e nos dois pedidos no separador Rede. Regista o código de cada um e o `Location` da resposta ao `POST`.
4. Recarrega a página da reserva. O browser pergunta alguma coisa? Quantas reservas há em `/reservas`?
5. Um erro de propósito. Muda a rota `GET /reservas/:id` para cima da rota `GET /reservas/nova`. Guarda e abre `/reservas/nova`. Prevê primeiro.

O que deves ver: a página "Pedido inválido", com o 400. O pedido a `/reservas/nova` foi parar à rota de uma reserva, com `"nova"` como número.

6. Repõe a ordem certa e confirma que o formulário volta.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

Na rota do `POST`, as duas últimas linhas (o `find` do equipamento e o `res.render` da reserva) dão lugar ao redirecionamento:

```js fragment
// Redirecionamento 303: o browser faz um GET à página da reserva.
// Recarregar essa página já não volta a enviar o formulário.
res.redirect(303, `/reservas/${reserva.id}`);
```

E a página da reserva passa a ter uma rota `GET` própria, abaixo da do formulário e da lista. As verificações são as da rota de detalhe dos equipamentos:

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

No envio do passo 3, a barra de endereço passou a mostrar `/reservas/1`, em vez de `/reservas`. O recarregamento do passo 4 pede essa mesma reserva, e `/reservas` continua a ter só uma. No separador Rede, o envio aparece como dois pedidos: o `POST /reservas`, com o 303, e o `GET /reservas/1`, com o 200. Esta referência explica esses passos; não é preciso criar outra reserva.

### Respostas para conferires esta fase

- **Passo 1.** Antes do redirecionamento, recarregar e reenviar cria uma reserva repetida, como na parte 4. A validação não resolve este problema, porque a reserva repetida é válida.
- **Passo 2.** O arranque explícito limpa as duas reservas de teste e repõe o contador em 1.
- **Passo 3.** Depois do redirecionamento: o browser termina em `/reservas/1`. No separador Rede, o `POST /reservas` com o 303 e `Location: /reservas/1`, e o `GET /reservas/1` com o 200.
- **Passo 4.** Recarregar `/reservas/1` não pergunta nada e não cria reserva nenhuma: é um `GET`, e `/reservas` continua com uma só.
- **Passo 5.** Com `/reservas/:id` acima de `/reservas/nova`: "Pedido inválido", 400, com "O número da reserva tem de ser um número inteiro positivo.".

### Paragem 6

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 7: os campos a mais, e o return esquecido

O servidor constrói a reserva pelos campos permitidos. O identificador é escolhido pelo servidor, mesmo que o pedido traga outro.


1. No `reserva-nova.ejs`, dentro do `<form>`, acrescenta um campo escondido, que o utilizador não vê mas o browser envia: `<input type="hidden" name="id" value="999">`. Guarda. No terminal deste servidor, faz Ctrl+C e volta a correr `node --watch server.js`. Abre o formulário, prevê o número que o servidor vai dar e faz uma reserva.
2. Confirma no Payload que o `id=999` foi enviado. Que número ficou a ter a reserva? Escreve no caderno porque é que o 999 não entrou, apontando a linha do `server.js` responsável.
3. Tira o campo escondido e guarda o modelo.
4. O último erro de propósito, e o mais perigoso. Para separar esta experiência da anterior, faz Ctrl+C no terminal deste servidor. Na rota do `POST`, apaga o `return` que vem a seguir ao `res.status(400).render(...)` e guarda. Arranca de novo com `node --watch server.js`. Abre o formulário e envia-o vazio (o `novalidate` ainda lá está). Prevê primeiro: o que mostra o browser, e o que acontece no terminal?

O que deves ver: a barra de endereço muda para `/reservas/1`, como se a reserva tivesse corrido bem, e o browser diz que não consegue ligar-se ao servidor. No terminal aparece `Cannot set headers after they are sent to the client` e, a seguir, `Failed running 'server.js'. Waiting for file changes before restarting...`: o servidor foi abaixo. Sem o `return`, a rota continuou depois do formulário com os erros, guardou a reserva vazia e redirecionou. Quando a página do formulário ficou pronta, já não havia a quem a enviar. O erro deitou o servidor abaixo antes de o browser pedir a página da reserva.

5. Repõe o `return` e guarda. No terminal deste servidor, faz Ctrl+C e volta a correr `node --watch server.js`. Confirma que `/reservas/nova` mostra o formulário e que `/reservas` está vazio. Confirma também que retiraste o campo escondido e que o dia voltou a `type="date"`. O `novalidate` só sai no início da fase 8.


### Respostas para conferires esta fase

- **Passo 2.** O `id=999` aparece no Payload e no `req.body`, e a reserva fica com o número 1, porque reiniciaste o servidor antes do envio. A linha responsável é a construção da reserva campo a campo, em que o `id` vem do `proximoIdReserva`, e não do pedido; a `validarReserva` nem lê o `id`. Podes explicar pela construção da reserva ou pelos campos que a validação lê: as duas observações mostram porque é que o 999 não entra.
- **Passo 4.** Sem o `return`: a barra de endereço muda para `/reservas/1`, o browser não consegue ligar-se, e o terminal mostra o `Cannot set headers after they are sent to the client` e o `Failed running`. A reserva vazia foi guardada, mas perde-se com a queda do servidor (está em memória). Com uma base de dados, a reserva errada ficaria lá guardada mesmo depois de o servidor parar.
- **Passo 5.** Com o `return` reposto e um novo arranque, o formulário funciona e não há reservas. A experiência terminou com o código corrigido e os dados limpos.

### Paragem 7

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 8: a evidência e a verificação por pares

O browser ajuda a preencher. O servidor continua a verificar pedidos feitos sem essas ajudas.


1. Tira o `novalidate` do `<form>`. A validação do browser volta a funcionar, e a do servidor continua lá.
2. **Envio sem JavaScript.** Nas ferramentas de programador, desliga o JavaScript da página. No Chrome, abre o menu de comandos com Ctrl+Shift+P (no Mac, Cmd+Shift+P). Escreve "JavaScript" para encontrar a opção de o desligar. Recarrega o formulário, faz uma reserva e confirma que tudo funciona igual. No caderno, explica porquê: que JavaScript há nas tuas páginas, e onde corre o que faz a reserva? Volta a ligar o JavaScript.
3. **Valor vazio e valor fora do intervalo.** Regista dois envios recusados pelo servidor. Num, deixa o nome vazio; no outro, usa um tempo fora do intervalo. Guarda o código e a mensagem de cada resposta. Como o browser já não os deixa passar, volta a pôr o `novalidate` só para estes dois envios, e tira-o no fim.
4. **Verificação por pares.** Troca de computador com um colega. Com o servidor dele, verifica cada linha desta lista e marca-a como cumprida ou não. Ele faz o mesmo com o teu.

| Verificação | Cumprida? |
| --- | --- |
| Carregar em cada etiqueta põe o cursor no campo certo | |
| O formulário vazio não sai do browser (validação do browser) | |
| Com `novalidate`, o formulário vazio dá 400 e uma mensagem em cada campo | |
| Depois de um erro, os campos certos continuam preenchidos, incluindo a lista do equipamento | |
| Um nome com `"><b>x</b>` volta ao campo como texto, sem negrito | |
| Um envio certo termina noutro endereço, `/reservas/` com um número, depois de um 303 | |
| Recarregar a página da reserva não cria outra reserva | |
| `/reservas/nova` mostra o formulário, e não "Pedido inválido" | |

5. Para cada linha não cumprida, mostra ao colega o que falha e ajuda-o a encontrar a causa. Depois, cada um explica ao outro, sem ler, porque é que a validação do servidor é a que conta.
6. Volta às previsões da parte 1 e corrige a lápis o que previste mal.

### Respostas para conferires esta fase

- **Passo 2.** Envio sem JavaScript: funciona igual. As páginas do catálogo não têm JavaScript nenhum: o formulário é HTML, o browser envia-o sozinho, e o que faz a reserva corre no servidor.
- **Passo 3.** Nome vazio: 400 e "Escreve o teu nome.". Tempo fora do intervalo: 400 e "O tempo letivo é um número inteiro de 1 a 9.".
- **Passo 4.** A lista de verificação: num servidor igual ao do exemplo, as oito linhas estão cumpridas. As que mais falham, por experiência dos erros previsíveis: a lista do equipamento depois de um erro e o `for` das etiquetas.
- **Passo 5.** A validação do browser só existe quando o pedido vem do formulário, num browser que a respeite. Qualquer pessoa a pode tirar, e qualquer programa pode enviar o pedido sem formulário. O servidor não sabe de onde veio o pedido, e por isso verifica tudo.



### Paragem 8

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.

## Problemas frequentes

### O formulário envia, mas a validação diz que um campo está vazio

O `name` desse campo, no formulário, não é o nome que a `validarReserva` lê. Compara, no Payload, os nomes enviados com os nomes da função.

### Depois de um erro, a lista do equipamento volta a "Escolhe um equipamento"

Falta o `String(...)` na comparação do `selected`.

### O servidor foi abaixo e não volta

O `--watch` espera por alterações nos ficheiros que acompanha. Corrige o que o terminal indica e guarda. Para garantir um novo arranque, faz Ctrl+C no terminal deste servidor e volta a correr `node --watch server.js`.

### Não consigo escolher o 30 de fevereiro no calendário

É o browser a ajudar. Na parte 5, passo 6, o campo do dia passa temporariamente a `type="text"`.

### A página das reservas dá 500

Há no array uma reserva com um equipamento que não existe, da fase 4. No terminal deste servidor, faz Ctrl+C e volta a correr `node --watch server.js`. O novo arranque limpa o array e repõe o contador em 1. Confirma a lista vazia antes de continuar.

## O que fica no teu caderno

1. As previsões da parte 1, com as correções da parte 8.
2. O "Form Data" da parte 3 e os dois erros do `express.urlencoded`, com a explicação.
3. As três experiências da parte 4, sem validação.
4. Os envios da parte 5: o código, as mensagens e o que ficou preenchido.
5. Os dois pedidos do redirecionamento da parte 6, com os códigos e o `Location`.
6. A resposta da parte 7 sobre o `id=999`, e o que aconteceu sem o `return`.
7. A evidência da parte 8: o envio sem JavaScript, o valor vazio e o valor fora do intervalo, e a lista de verificação do teu colega.

O professor vai pedir-te que expliques, com o teu servidor aberto, porque é que a validação do servidor é a que conta. O que acontece ao recarregar a página de uma reserva com e sem o redirecionamento.

## Conferência dos ficheiros finais

Depois de desfazeres todos os erros provocados, confere os teus ficheiros com esta versão completa. Os nomes e as rotas mantêm a sequência do catálogo.

### `server.js` completo

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
 * @param {object|undefined} corpo o req.body do pedido, que pode não existir
 * @returns {object} um objeto com os valores e os erros
 */
function validarReserva(corpo) {
  // Sem corpo lido, todos os campos faltam e recebem os erros já previstos.
  if (!corpo) {
    corpo = {};
  }
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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/equipamento.ejs` completo

```ejs
<%# A página de um equipamento. Recebe o titulo e o equipamento. %>
<%- include("partials/cabecalho") %>
    <p>Número: <%= equipamento.id %></p>
    <p>Sala: <a href="/equipamentos?sala=<%= equipamento.sala %>"><%= equipamento.sala %></a></p>
    <p><a href="/equipamentos">Voltar à lista</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/equipamentos.ejs` completo

```ejs
<%# A lista de equipamentos. Recebe o titulo, os equipamentos a mostrar
    e a sala pesquisada, que fica vazia quando não houve pesquisa. %>
<%- include("partials/cabecalho") %>
    <% if (sala) { %>
      <p>Pesquisa pela sala <strong><%= sala %></strong>.</p>
    <% } %>
    <% if (equipamentos.length === 0) { %>
      <p>Não há equipamentos nesta sala.</p>
    <% } else { %>
      <ul>
        <% for (const equipamento of equipamentos) { %>
          <li><a href="/equipamentos/<%= equipamento.id %>"><%= equipamento.nome %></a>, na sala <%= equipamento.sala %></li>
        <% } %>
      </ul>
    <% } %>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/erro.ejs` completo

```ejs
<%# A página de erro, para o 400 e para o 404. Recebe o titulo e a
    mensagem; o código de estado é a rota que o escolhe. %>
<%- include("partials/cabecalho") %>
    <p><%= mensagem %></p>
    <p><a href="/">Voltar ao início</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/inicio.ejs` completo

```ejs
<%# A página inicial, com a pesquisa por sala. O formulário envia por GET,
    e o campo sala vai no endereço: /equipamentos?sala=B12. %>
<%- include("partials/cabecalho") %>
    <p>Pesquisa os equipamentos de uma sala.</p>
    <form method="get" action="/equipamentos">
      <label>Sala <input name="sala"></label>
      <button type="submit">Pesquisar</button>
    </form>
    <p><a href="/reservas/nova">Fazer uma reserva</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/partials/cabecalho.ejs` completo

```ejs
<%# O início de todas as páginas do catálogo. Usa o titulo da página
    que o inclui. %>
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title><%= titulo %> | Catálogo de equipamentos</title>
  </head>
  <body>
    <nav>
      <a href="/">Início</a> |
      <a href="/equipamentos">Todos os equipamentos</a> |
      <a href="/reservas">Reservas</a> |
      <a href="/reservas/nova">Fazer uma reserva</a>
    </nav>
    <h1><%= titulo %></h1>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/partials/rodape.ejs` completo

```ejs
<%# O fim de todas as páginas do catálogo. %>
    <footer>
      <p>Catálogo de equipamentos da escola. Página gerada no servidor.</p>
    </footer>
  </body>
</html>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/reserva-nova.ejs` completo

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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/reserva.ejs` completo

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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/reservas.ejs` completo

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

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

## Desafios

1. Na página da lista, acrescenta uma frase com o número total de reservas. Decide onde calcular o número.

## Antes de terminares

- [ ] Desfizeste os erros provocados e confirmaste o catálogo a funcionar.
- [ ] Guardaste as previsões, os resultados e as explicações pedidas.
- [ ] Consegues explicar onde correm o JavaScript e o EJS e que dados chegam ao browser.

![Rodapé](../imagens/rodape.png)
