![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: Cookies e sessões

Laboratório do sexto tema do módulo Aplicações baseadas em browsers. Partes do teu catálogo com formulários do tema anterior e dás-lhe um pedido em curso, guardado numa sessão: juntar equipamentos, ver o pedido, tirar, confirmar e cancelar. Pelo caminho, vês porque é que uma variável do servidor não chega, mexes nos cookies com as tuas próprias mãos. Roubas uma sessão a ti mesmo, para perceberes porque é que uma sessão não é uma prova de identidade.

As experiências fazem-se no teu servidor local, com dados inventados e apenas com os cookies das sessões que criaste para este trabalho. Na confirmação, usa também um nome fictício. O nome é um texto associado às reservas, não uma verificação de quem está a usar o catálogo.

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui. O [guia](06-cookies-e-sessoes.md) tem a teoria completa, para saberes mais. Antes de cada experiência, escreve a previsão no caderno e confere-a com a resposta desta fase.

## O que vais construir

Vais continuar o catálogo numa pasta de trabalho própria. O destino é o exemplo completo deste tema, com as experiências descritas nas fases.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | A sessão pertence ao browser que apresenta o identificador | Conferes a paragem 1 antes de continuar |
| 2 | Uma variável global pertence ao processo inteiro | Conferes a paragem 2 antes de continuar |
| 3 | O segredo assina o identificador | Conferes a paragem 3 antes de continuar |
| 4 | Cada sessão começa sem pedido | Conferes a paragem 4 antes de continuar |
| 5 | O `res.locals` põe dados à disposição dos modelos desta resposta | Conferes a paragem 5 antes de continuar |
| 6 | Terminar tem dois lados: destruir a sessão no servidor e apagar o cookie no browser | Conferes a paragem 6 antes de continuar |
| 7 | O cookie funciona como uma chave | Conferes a paragem 7 antes de continuar |
| 8 | Cada opção responde a um risco ou necessidade | Conferes a paragem 8 antes de continuar |

## Palavras que vais usar

- Cookie: pequeno valor que o browser guarda a pedido do servidor e devolve nos pedidos seguintes.
- Sessão: dados guardados no servidor para distinguir o estado de cada browser.
- Identificador de sessão: código que permite ao servidor encontrar a sessão, sem levar o pedido inteiro.
- Assinatura: verificação feita com um segredo, que permite detetar um identificador alterado.
- `HttpOnly`: atributo que impede os scripts da página de lerem o cookie.
- `Secure`: atributo que restringe o envio do cookie a HTTPS.
- `SameSite`: atributo que limita quando o cookie segue em pedidos iniciados noutro site.
- `MemoryStore`: armazém de sessões em memória, usado só em desenvolvimento.
- `res.locals`: objeto com dados que os modelos da resposta podem usar.
- Autenticação: verificação da identidade de quem usa uma aplicação.
- Roubo de sessão: uso do identificador de outra pessoa para aceder à sessão dela.
- Fixação de sessão: levar uma vítima a usar um identificador que o atacante já conhece.

## O que precisas

- Node 24 LTS, instalado no computador ou no ambiente Docker preparado pelo professor: executa JavaScript no servidor. No terminal desse ambiente, corre `node --version`; deve aparecer `v24` seguido da versão instalada.
- npm: instala os pacotes do projeto. Confirma com `npm --version`, que mostra a versão instalada.
- Um editor para criares e guardares os ficheiros. No VS Code, abre a pasta de trabalho com "Ficheiro > Abrir Pasta".
- Um browser com ferramentas de programador. Abre-as com F12 ou com o menu de ferramentas do browser.
- Uma pasta nova para a tua cópia do exemplo de partida indicado abaixo. Não trabalhes dentro da pasta distribuída.

## Se alguma coisa falhar

1. Confirma a pasta no terminal: `pwd` no macOS/Linux ou `Get-Location` na PowerShell. Nela devem existir `package.json` e `server.js`. Usa `cd` e o caminho da tua cópia para lá entrar.
2. Confirma que guardaste o ficheiro e que o browser mostra o endereço do teu servidor.
3. Lê a primeira mensagem do terminal antes de mudares código. Compara o resultado esperado, o obtido e uma hipótese para a causa.
4. Se a porta 3000 estiver ocupada, não pares outro processo. Na tua cópia, muda `PORTA` para 3100 e usa essa porta em todos os endereços deste laboratório.

## Preparar o projeto

Precisas do catálogo com formulários do laboratório do tema anterior, a funcionar. Se não o tiveres, copia a pasta [catalogo-com-formularios](../exemplos/aplicacoes-em-browser/catalogo-com-formularios/README.md) dos exemplos para a tua pasta de trabalho e corre `npm install` dentro dela. Se usares o apoio sem internet em Docker, segue a instalação preparada pelo professor. Usa o par de `package.json` e `package-lock.json` indicado para este tema, em vez de instalar a partir da internet. O código de partida continua a ser o catálogo com formulários; ter a dependência já instalada não acrescenta as rotas nem as páginas de sessões.

Vais precisar de dois "browsers" diferentes no mesmo computador. A forma mais simples é uma janela normal e uma janela anónima do mesmo browser (no Chrome, Ctrl+Shift+N; no Mac, Cmd+Shift+N): têm cookies separados. Duas janelas normais não servem, porque partilham os cookies.

Se a janela anónima estiver desativada no computador da escola, usa dois browsers diferentes. O que precisas é de dois conjuntos de cookies separados, não apenas de duas janelas.

Nas ferramentas de programador, vais usar o separador Rede, a consola, e o separador onde o browser mostra os cookies: no Chrome, "Application" ("Aplicação"), secção "Cookies"; no Firefox, "Armazenamento".

Se o browser da escola não permitir criar ou editar cookies, acompanha a demonstração do professor nesses passos. Escreve a tua previsão e o resultado observado, e assinala que os acompanhaste em demonstração. Esses passos ficam por realizares individualmente quando tiveres um browser que o permita.

## Fase 1: prever antes de programar

A sessão pertence ao browser que apresenta o identificador. Um reinício do armazém em memória apaga os dados do servidor.


Imagina o catálogo final já a correr. As situações seguintes são independentes: em cada uma, parte do estado que ela descreve. Nesta fase, escreve apenas o que esperas no caderno; ainda vais construir as rotas e as páginas necessárias para experimentar.

1. Abres a página inicial pela primeira vez. O browser recebe algum cookie?
2. Na janela normal, juntas o projetor ao pedido. Na janela anónima, abres `/pedido`. O que vês?
3. Na janela normal, com dois equipamentos no pedido, o servidor reinicia. Recarregas `/pedido`. O que vês, e o browser ainda tem o cookie?
4. A janela normal tem um pedido com dois equipamentos. Copias o valor do cookie dessa janela para a janela anónima. O que mostra `/pedido` na anónima?
5. Na janela normal, cancelas o pedido. Antes, tinhas copiado o valor do cookie. Depois do cancelamento, voltas a pôr esse valor no browser. O que mostra `/pedido`?
6. Na consola de uma página do catálogo, escreves `document.cookie`. O que aparece?

No fim do laboratório, na parte 8, voltas a estas previsões.


### Respostas para conferires esta fase

1. Não. Com o `saveUninitialized: false`, nada é guardado e o browser não recebe cookie nenhum.
2. O pedido vazio: a janela anónima é outro browser, com outra sessão.
3. O pedido vazio. O cookie continua no browser, mas a sessão estava na memória do servidor, que reiniciou.
4. O pedido da janela normal: a sessão é de quem tem o identificador.
5. O pedido vazio: a sessão foi destruída no servidor, e o identificador já não leva a nada.
6. Nada do `catalogo.sid` (uma linha vazia, se não houver outros cookies): o `HttpOnly` impede o JavaScript de o ler.

As previsões mais erradas, por experiência de quem vê sessões pela primeira vez: a 3 ("o pedido continua. Isto acontece porque o cookie ainda lá está"), a 4 ("não dá. Isto acontece porque é outro browser") e a 5 ("aparece outra vez. Isto acontece porque o cookie voltou"). As três são o centro do tema: o cookie é só a chave. E o que conta é o que o servidor tem.

### Paragem 1

Compara as tuas previsões com as respostas desta fase e explica as diferenças. Ainda não executaste estas experiências: vais fazê-las ao longo do laboratório e voltar às previsões na fase 8.
## Fase 2: a tentativa ingénua

Uma variável global pertence ao processo inteiro. Dois browsers diferentes recebem os mesmos dados dessa variável.


1. No `server.js`, logo a seguir ao middleware do `express.urlencoded`, acrescenta a tentativa da referência de código desta fase: a variável `pedido` e a rota `POST /pedido/itens` que lhe junta o `equipamento_id`. Acrescenta também uma rota `GET /pedido` provisória, que só escreve o pedido:

   ```js fragment
   app.get("/pedido", (req, res) => {
     res.send(`Pedido: ${pedido.join(", ")}`);
   });
   ```

2. Para enviares um `POST` sem formulário novo, muda temporariamente, no `reserva-nova.ejs`, o `action` do formulário para `/pedido/itens`. Na janela normal, escolhe o projetor e envia (preenche os outros campos, para o browser deixar).
3. Na janela anónima, que não juntou nada, abre `/pedido`. Prevê primeiro.

O que deves ver: `Pedido: 2`, o projetor que juntaste na outra janela. A variável é uma só para o servidor inteiro, e todos os browsers a partilham.

4. Apaga a variável e as duas rotas provisórias, e repõe o `action` do formulário. As rotas certas vêm na parte 4.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

Cada pedido HTTP chega sozinho ao servidor. Traz o método, o caminho, os cabeçalhos e, às vezes, um corpo, e o servidor responde a esse pedido com o que lá vem. Quando chega o pedido seguinte, o servidor não sabe se veio do mesmo browser, da mesma pessoa, ou de outro computador do outro lado do mundo. Diz-se que o HTTP é um protocolo **sem estado**: não guarda nada de um pedido para o outro.

Até aqui isto não fez falta. A lista dos equipamentos é igual para toda a gente. Uma reserva, no tema anterior, ia inteira num só `POST`, com os quatro campos no corpo. Mas um pedido em curso atravessa vários pedidos HTTP: juntar o projetor é um pedido, ver o catálogo é outro, juntar o portátil é outro, e confirmar é outro ainda. Entre eles, alguém tem de guardar o que já foi juntado.

A primeira ideia que costuma aparecer é uma variável no servidor:

```js fragment
// A tentativa ingénua: o pedido numa variável do servidor, sem sessões.
let pedido = [];
app.post("/pedido/itens", (req, res) => {
  pedido.push(req.body.equipamento_id);
  res.redirect(303, "/pedido");
});
```

Funciona enquanto há uma só pessoa a usar o catálogo. Com duas, deixa de funcionar, e de uma forma traiçoeira: a variável é uma só, para o servidor inteiro, e todos os pedidos de todos os browsers a usam. A professora junta o projetor, e o colega que abre o catálogo noutra sala vê o projetor no pedido dele, sem ter juntado nada. O laboratório mostra-o com duas janelas do browser. O servidor precisa de saber **de que browser** vem cada pedido, para guardar um pedido separado para cada um. É aqui que entram os cookies.

### Respostas para conferires esta fase

A janela anónima mostra `Pedido: 2`. A explicação que se quer: a variável é uma só, criada quando o servidor arranca. Todos os pedidos de todos os browsers a usam. O servidor não tem forma de saber de que browser vem cada pedido. Erro a esperar no fim: deixar as rotas provisórias, que depois chocam com as da parte 4 (a primeira rota registada responde).

### Paragem 2

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 3: o segredo e o express-session

O segredo assina o identificador. O middleware encontra os dados da sessão antes de as rotas os usarem.


1. Instala o `express-session` com `npm install express-session@1.19.0` e confirma a linha nova no `package.json`. Se o apoio sem internet já instalou essa versão pelo par de manifestos preparado, confirma-a e continua sem repetir a instalação pela internet.
2. Cria o `.env.example`, com o comentário e a linha `SESSION_SECRET=` sem valor, e confirma que o `.gitignore` tem a linha `.env`. Se o teu projeto não tiver `.gitignore`, cria-o, com as linhas `node_modules/` e `.env`.
3. No `server.js`, acrescenta o `import` da sessão, a leitura do segredo com a verificação e o nome do cookie. O middleware das sessões, como na referência de código desta fase.
4. Para o servidor (Ctrl+C) e arranca-o com `node --watch --env-file=.env server.js`. Prevê primeiro: ainda não há `.env`.

O que deves ver: `node: .env: not found`, e o servidor não arranca.

5. Cria o `.env` como cópia do `.env.example`, sem mudar nada, e arranca outra vez. Prevê primeiro.

O que deves ver: a mensagem do teu `server.js`, a começar por `Falta o SESSION_SECRET`, e o servidor não arranca. O ficheiro existe, mas o segredo está vazio.

6. Gera um segredo com o comando da referência de código desta fase, cola-o no `.env` a seguir ao `SESSION_SECRET=`, e arranca outra vez. O servidor arranca, e as páginas funcionam como antes.



Se usares a configuração Docker preparada pelo professor, o comando de arranque fornecido recebe o segredo do ambiente. Não precisas de o copiar para o código nem de o mostrar ao browser. Os passos 4 e 5 demonstram duas falhas diferentes do arranque com `--env-file`: ficheiro ausente e segredo vazio. No Docker, ensaia-os numa cópia de trabalho com o comando indicado pelo professor, sem alterar o segredo do ambiente comum. Depois repõe o arranque preparado.

### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

O Express não trata as sessões sozinho, mas a mesma equipa que faz o Express mantém um middleware para isso, o `express-session`. Instala-se como os outros pacotes:

```bash
npm install express-session@1.19.0
```

E importa-se no início do `server.js`, ao lado do Express:

```js fragment
import session from "express-session";
```

#### O segredo, fora do código

O middleware precisa do segredo que assina os identificadores. O segredo é configuração. E uma configuração que não pode ser conhecida: se estivesse escrito no `server.js`, ia para o Git com o código. Qualquer pessoa com acesso ao repositório podia assinar os identificadores que quisesse. Por isso fica no `.env`, que não vai para o Git, como aprendeste em Linguagens de Programação. O `.env.example`, que vai para o Git, diz o nome da variável, sem o valor:

```text
# O segredo que assina o cookie da sessão. Escreve no teu .env um texto longo
# e aleatório, e nunca o ponhas no Git nem no código.
SESSION_SECRET=
```

No teu `.env`, escreves `SESSION_SECRET=` seguido de um texto longo e aleatório. Este comando escreve um, com 64 carateres, que podes copiar:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

O servidor arranca com o `--env-file`, para ler o `.env`:

```bash
node --watch --env-file=.env server.js
```

No `server.js`, o segredo lê-se do ambiente. Se não existir, o servidor recusa-se a arrancar, com uma mensagem que diz o que fazer:

```js fragment
// O segredo que assina o cookie da sessão vem do ambiente, e nunca do código.
// Sem ele, o servidor recusa-se a arrancar.
const SEGREDO = process.env.SESSION_SECRET;
if (!SEGREDO) {
  console.error("Falta o SESSION_SECRET. Copia o .env.example para .env, escreve lá um segredo e arranca com: node --env-file=.env server.js");
  process.exit(1);
}

// O nome do cookie da sessão, usado na configuração e ao terminar a sessão.
const NOME_DO_COOKIE = "catalogo.sid";
```

O `process.exit(1)` termina o programa logo ali; o 1 diz ao terminal que terminou com um erro. É melhor um servidor que não arranca e diz porquê do que um servidor que arranca sem segredo e falha mais tarde, a meio de um pedido. O nome do cookie fica numa constante, porque vai ser usado em dois sítios: na configuração e quando a sessão terminar.

#### O middleware e as suas opções

O middleware das sessões regista-se depois do `express.urlencoded` e antes das rotas, porque as rotas vão usar o que ele prepara:

```js fragment
// Middleware das sessões: lê o cookie de cada pedido, encontra a sessão
// desse browser e põe-na em req.session. Cada opção está justificada.
app.use(session({
  secret: SEGREDO, // assina o cookie: o servidor só aceita identificadores que ele próprio deu
  name: NOME_DO_COOKIE, // o nome do cookie no browser
  resave: false, // não volta a guardar uma sessão que não mudou
  saveUninitialized: false, // não cria sessão, nem cookie, a quem ainda não guardou nada
  cookie: {
    httpOnly: true, // o JavaScript das páginas não consegue ler o cookie
    sameSite: "lax", // o cookie não vai nos pedidos POST que outros sites façam ao catálogo
    secure: false, // com HTTPS seria true; em http://localhost tem de ser false
    maxAge: 30 * 60 * 1000, // 30 minutos, em milissegundos, contados da última mudança
  },
}));
```

Cada opção tem uma razão. E escrevê-la ao lado é parte do trabalho: uma configuração de segurança que ninguém sabe justificar é uma configuração que alguém vai mudar sem saber o que estraga.

- `secret`: o segredo que assina o identificador, lido do `.env`.
- `name`: o nome do cookie. Por omissão seria `connect.sid`, que diz a quem olha que o servidor usa o `express-session`; um nome do teu site não diz nada.
- `resave: false`: no fim de cada pedido, a sessão só volta a ser guardada se tiver mudado. Guardar uma sessão que não mudou é trabalho inútil.
- `saveUninitialized: false`: uma sessão nova, em que não se guardou nada, não é guardada, e o browser não recebe cookie nenhum. Quem só vê o catálogo não fica com um cookie sem razão; o cookie só aparece quando a pessoa junta o primeiro equipamento ao pedido. É também uma questão de privacidade: não se guarda nada sobre quem não pediu nada.
- `cookie`: as regras que o browser aplica ao cookie. Os comentários da configuração explicam `httpOnly`, `sameSite`, `secure` e `maxAge`.

#### O que o middleware faz a cada pedido

Para cada pedido, o middleware procura o cookie `catalogo.sid`. Se o encontrar, e a assinatura estiver certa, vai buscar ao servidor os dados dessa sessão e põe-nos em `req.session`. Se não houver cookie, ou se a assinatura não bater certo, ou se a sessão já não existir no servidor, cria uma sessão nova e vazia. Em qualquer dos casos, a rota encontra um `req.session`, que é um objeto onde pode ler e escrever o que quiser:

```js fragment
req.session.pedido = []; // guardar
const pedido = req.session.pedido; // ler
```

No fim do pedido, se a sessão mudou, o middleware guarda-a no servidor e, se for preciso, manda ao browser o `Set-Cookie`. A rota não trata do cookie: trata só do `req.session`, como se fosse um objeto que se lembra de um pedido para o outro. Daqui a dois pedidos, o mesmo browser encontra lá o que lá deixou; outro browser encontra outro objeto, o seu.

#### Onde ficam as sessões

O `express-session` guarda as sessões, por omissão, na memória do próprio servidor, num armazém chamado `MemoryStore`. Tem duas consequências. Quando o servidor reinicia, todas as sessões desaparecem: o browser continua a enviar o cookie. Mas o servidor já não tem nada com aquele identificador. E trata-o como um browser novo. E o `MemoryStore` não serve para um servidor a sério, que corre muito tempo e com muitos utilizadores: vai ocupando memória. Não funciona com mais do que um processo. O próprio `express-session` o avisa no terminal, quando o servidor corre em modo de produção. Para aprender, em `localhost`, serve. Num servidor publicado, as sessões vão para uma base de dados. E é um assunto do segundo módulo.

### Respostas para conferires esta fase

Sem `.env`: `node: .env: not found`, e o servidor não arranca. Com o `.env` copiado do exemplo, sem segredo: a mensagem `Falta o SESSION_SECRET...`, e o servidor sai. Com o segredo: arranca, e as páginas funcionam como antes, sem cookie.

Confere esta ideia: um servidor que não arranca e diz porquê é melhor do que um que arranca sem segredo. E o `.env` nunca vai para o Git: confirma o teu `.gitignore`.

### Paragem 3

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 4: juntar ao pedido

Cada sessão começa sem pedido. A primeira alteração cria a lista e guarda os itens desse browser.


1. Abre o separador dos cookies do browser, na janela normal, e confirma que `http://localhost:3000` não tem cookie nenhum. Navega pelo catálogo e confirma que continua sem cookie. Escreve no caderno porquê, com a opção do middleware responsável.
2. No `server.js`, retira as rotas completas `GET /reservas/nova` e `POST /reservas`, que criavam uma reserva diretamente. Mantém `GET /reservas` e `GET /reservas/:id`. Substitui `validarReserva` por `validarItem` e acrescenta as rotas `GET /pedido/item`, `POST /pedido/itens` e `GET /pedido`, e a função `linhasDoPedido` desta fase. Cria `views/item-novo.ejs` com o modelo mostrado abaixo.
3. Cria o `views/pedido.ejs` provisório completo desta fase e apaga o antigo `views/reserva-nova.ejs`. Em `views/partials/cabecalho.ejs`, `views/inicio.ejs` e `views/reservas.ejs`, troca cada ligação `/reservas/nova` por `/pedido/item`. No menu, usa o texto "Juntar um equipamento ao pedido"; na página inicial e na lista das reservas, usa "Fazer um pedido de reserva". Guarda tudo e confirma que o menu, a página inicial e a lista das reservas abrem o novo formulário. O modelo provisório mostra a lista e o pedido vazio; os botões entram na fase 6.
4. Com o separador Rede aberto, junta o projetor ao pedido. No `POST` a `itens`, copia para o caderno a linha do `Set-Cookie`: o nome, o início do valor e os atributos.
5. No separador dos cookies, confirma o `catalogo.sid`, e regista o que diz cada coluna: a expiração, o `HttpOnly`, o `Secure` e o `SameSite`.
6. Junta o portátil. No `GET` a `pedido` que veio a seguir, procura o cabeçalho `Cookie` do pedido. O que leva, e o que não leva, em comparação com o `Set-Cookie`?
7. Tenta juntar um equipamento com o tempo 12 (com o `novalidate`, se o browser não deixar). O formulário volta com a mensagem, e o pedido continua com dois.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

O formulário de reserva do tema anterior passa a juntar um equipamento ao pedido: os mesmos campos, menos o nome. Na tua cópia, retira do `server.js` as rotas completas `GET /reservas/nova` e `POST /reservas`. Apaga `views/reserva-nova.ejs`, que deixa de ser usado. Mantém o array `reservas`, o contador, as rotas `GET /reservas` e `GET /reservas/:id`, e os modelos `reservas.ejs` e `reserva.ejs`.

Nesta mesma etapa, troca as ligações para `/reservas/nova` por `/pedido/item` em `views/partials/cabecalho.ejs`, `views/inicio.ejs` e `views/reservas.ejs`. No menu, usa o texto "Juntar um equipamento ao pedido"; na página inicial e na lista das reservas, usa "Fazer um pedido de reserva". A ligação para ver `/reservas` mantém-se. Assim, nenhuma página continua a oferecer o formulário antigo.

Substitui a função `validarReserva` por `validarItem`, com a mesma verificação do equipamento, do dia e do tempo, e sem o bloco do nome:

```js fragment
/**
 * Verifica um equipamento a juntar ao pedido: o equipamento, o dia e o tempo.
 * Só lê os três campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * @param {object|undefined} corpo o req.body do pedido, que pode não existir
 * @returns {object} um objeto com os valores e os erros
 */
function validarItem(corpo) {
  // Sem corpo lido, todos os campos faltam e recebem os erros já previstos.
  if (!corpo) {
    corpo = {};
  }
  const valores = {
    equipamento_id: textoDoCampo(corpo.equipamento_id),
    data: textoDoCampo(corpo.data),
    tempo: textoDoCampo(corpo.tempo),
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

  return { valores: valores, erros: erros };
}
```

O modelo `views/item-novo.ejs` é o `reserva-nova.ejs` sem o campo do nome, a enviar para `/pedido/itens`:

```ejs
<%# O formulário para juntar um equipamento ao pedido. Recebe o titulo,
    os equipamentos para a lista, os valores a pôr nos campos e os erros,
    um por campo. O nome só se pede no fim, ao confirmar o pedido. %>
<%- include("partials/cabecalho") %>
    <% if (Object.keys(erros).length > 0) { %>
      <p><strong>O equipamento não foi juntado ao pedido. Corrige os campos assinalados e volta a enviar.</strong></p>
    <% } %>
    <form method="post" action="/pedido/itens">
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
      <button type="submit">Juntar ao pedido</button>
    </form>
    <p><a href="/pedido">Voltar ao pedido</a></p>
<%- include("partials/rodape") %>
```

As rotas para mostrar o formulário e para receber o `POST`:

```js fragment
// O formulário para juntar um equipamento ao pedido.
app.get("/pedido/item", (req, res) => {
  res.render("item-novo", {
    titulo: "Juntar ao pedido",
    equipamentos: equipamentos,
    valores: { equipamento_id: "", data: "", tempo: "" },
    erros: {},
  });
});

// Juntar um equipamento ao pedido: valida, e guarda o item na sessão.
app.post("/pedido/itens", (req, res) => {
  const resultado = validarItem(req.body);
  if (Object.keys(resultado.erros).length > 0) {
    res.status(400).render("item-novo", {
      titulo: "Juntar ao pedido",
      equipamentos: equipamentos,
      valores: resultado.valores,
      erros: resultado.erros,
    });
    return;
  }

  // Da primeira vez, a sessão ainda não tem pedido: começa vazio.
  if (!req.session.pedido) {
    req.session.pedido = [];
  }
  req.session.pedido.push({
    equipamentoId: Number(resultado.valores.equipamento_id),
    data: resultado.valores.data,
    tempo: Number(resultado.valores.tempo),
  });
  res.redirect(303, "/pedido");
});
```

A rota do `POST` valida como no tema anterior. A diferença está no que faz quando corre bem: em vez de criar uma reserva, junta o equipamento ao pedido desta sessão, em `req.session.pedido`. Da primeira vez, a sessão ainda não tem pedido nenhum, e o `req.session.pedido` é `undefined`: por isso o `if` cria-o, como um array vazio, antes do `push`. É neste momento que a sessão deixa de estar vazia, e o browser recebe o cookie. O item guarda o número do equipamento, e não o equipamento inteiro: o nome e a sala vêm sempre da lista dos equipamentos, que é a fonte de verdade.

A página do pedido mostra o que lá está. Uma pequena função junta a cada item o seu equipamento, para a página poder mostrar o nome, como a lista das reservas fazia no tema anterior:

```js fragment
/**
 * Junta a cada item do pedido o seu equipamento, para a página mostrar o nome.
 * @param {object[]} pedido os itens guardados na sessão
 * @returns {object[]} uma linha por item, com o item e o equipamento
 */
function linhasDoPedido(pedido) {
  const linhas = [];
  for (const item of pedido) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === item.equipamentoId);
    linhas.push({ item: item, equipamento: equipamento });
  }
  return linhas;
}
```

```js fragment
// O pedido em curso: os equipamentos já juntos, a confirmação e o cancelamento.
app.get("/pedido", (req, res) => {
  const pedido = req.session.pedido || [];
  res.render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: "", erroNome: "" });
});
```

O `req.session.pedido || []` dá o pedido da sessão, ou um array vazio se ainda não houver pedido. O modelo provisório completo `views/pedido.ejs` vem a seguir; mostra a lista, a ligação para juntar mais um equipamento e a mensagem do pedido vazio. A versão com os botões de remoção, confirmação e cancelamento entra na fase 6.

Depois de realizares os passos 4 a 7 desta fase, tens o projetor e o portátil na janela normal. Esta referência serve para conferires o código: não voltes a juntar os equipamentos só por a leres. Antes da fase 5, a normal tem os seus dois itens e a anónima ainda não juntou nenhum. Na fase seguinte vais comparar as duas sessões, depois da alteração que reinicia o servidor.

### `views/pedido.ejs` provisório completo

Cria este ficheiro para a paragem 4. Os botões de remoção, confirmação e cancelamento entram na fase 6.

```ejs
<%# views/pedido.ejs: a primeira lista dos itens da sessão. %>
<%- include("partials/cabecalho") %>
<% if (linhas.length === 0) { %>
  <p>O teu pedido está vazio.</p>
<% } else { %>
  <ul>
    <% for (const linha of linhas) { %>
      <li><%= linha.equipamento.nome %>, sala <%= linha.equipamento.sala %>, dia <%= linha.item.data %>, tempo <%= linha.item.tempo %></li>
    <% } %>
  </ul>
<% } %>
<p><a href="/pedido/item">Juntar um equipamento</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: `linhasDoPedido` já juntou cada equipamento ao item da sessão. A vista limita-se a mostrar essa associação e trata a lista vazia.

### Respostas para conferires esta fase

- **Passo 1.** Sem cookie, a navegar pelo catálogo: é o `saveUninitialized: false`.
- **Passo 4.** O `Set-Cookie` do primeiro `POST` a `itens`: `catalogo.sid=s%3A...`, com `Path=/`, `Expires` (30 minutos depois), `HttpOnly` e `SameSite=Lax`. Não tem `Secure`.
- **Passo 5.** No separador dos cookies: a expiração, o `HttpOnly` assinalado, o `Secure` por assinalar, e o `SameSite` com `Lax`.
- **Passo 6.** O cabeçalho `Cookie` do pedido leva só `catalogo.sid=` e o valor. Os atributos não voltam: são instruções para o browser.
- **Passo 7.** O tempo 12 dá 400 com o formulário e a mensagem; o pedido continua com dois.

Se o primeiro equipamento der `Cannot read properties of undefined (reading 'push')`, confirma o `if` que cria `req.session.pedido` antes do `push`. Numa sessão nova ainda não existe essa lista. Só depois de a criar podes juntar-lhe equipamentos.

### Paragem 4

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 5: o menu, e duas sessões isoladas

O `res.locals` põe dados à disposição dos modelos desta resposta. O menu mostra o tamanho do pedido desta sessão.


1. Acrescenta o middleware que põe o `itensNoPedido` no `res.locals`, depois do middleware das sessões, e muda o menu do cabeçalho para "O teu pedido (...)". Mantém as ligações para `/pedido/item` que atualizaste na fase 4. Guarda os ficheiros.
2. Recarrega a página inicial na janela normal. Prevê primeiro: o menu mostra os dois equipamentos que juntaste na parte 4?

O que deves ver: "O teu pedido (0)". Ao guardares o `server.js`, o `--watch` reiniciou o servidor. As sessões vivem na memória do servidor, e não no browser, e por isso desapareceram com o reinício. O browser ainda tem o cookie `catalogo.sid`, mas o servidor já não tem nada com aquele identificador, e trata-te como um browser novo. É a situação 3 das previsões da parte 1, e vais vê-la outra vez, de propósito, na parte 7. A partir daqui, cada vez que guardares o `server.js`, os pedidos das duas janelas voltam a zero.

3. Na janela normal, junta outra vez o projetor e o portátil ao pedido. O menu passa a mostrar "O teu pedido (2)".
4. Na janela anónima, abre o catálogo. O que mostra o menu? Junta lá o monitor.
5. Volta à janela normal e recarrega. O que mostra o menu?
6. Para a evidência deste tema, regista no caderno, para cada janela: o que tem o pedido, e os primeiros oito carateres do valor do cookie, a seguir ao `s%3A`. São duas sessões isoladas.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

O menu passa a mostrar quantos equipamentos tem o pedido, em todas as páginas. O número vem da sessão. E todas as rotas teriam de o passar ao `res.render`. Em vez disso, um middleware põe-no no **`res.locals`**, um objeto que o Express junta automaticamente aos dados de todos os modelos:

```js fragment
// Para todas as páginas: quantos equipamentos tem o pedido desta sessão.
// O res.locals põe o valor à disposição de todos os modelos, incluindo o cabeçalho.
app.use((req, res, next) => {
  const pedido = req.session.pedido;
  res.locals.itensNoPedido = pedido ? pedido.length : 0;
  next();
});
```

Fica depois do middleware das sessões, porque lê o `req.session`, e antes das rotas, porque os modelos das rotas vão usar o valor. No cabeçalho, a ligação do menu passa a ser:

```ejs
<a href="/pedido">O teu pedido (<%= itensNoPedido %>)</a>
```

Mantém as ligações para `/pedido/item` atualizadas na fase 4, no menu, na página inicial e na lista das reservas. Acrescenta a ligação para `/pedido` com a contagem, sem retirar a do novo formulário.

### Respostas para conferires esta fase

- **Passo 2.** "O teu pedido (0)", e não (2). O passo 1 muda o `server.js`, o `--watch` reinicia o servidor, e as sessões, que estão na memória do servidor, perdem-se nas duas janelas. O browser fica com o cookie antigo, que já não leva a nada. É a previsão 3 da parte 1, vista mais cedo, e convém aproveitá-la: dizer em voz alta que a sessão vive no servidor. Que o cookie é só a chave. A partir daqui, cada vez que a turma guardar o `server.js`, os pedidos voltam a zero; o laboratório já o diz, e manda voltar a juntar os equipamentos.
- **Passo 3.** Depois de juntar outra vez o projetor e o portátil, a janela normal mostra "O teu pedido (2)". O valor do cookie mudou: a sessão é nova, com outro identificador.
- **Passo 4.** A anónima mostra "O teu pedido (0)" e, depois de juntar o monitor, "(1)".
- **Passo 5.** A normal continua com 2.
- **Passo 6.** Os valores dos cookies das duas janelas são diferentes: são dois identificadores aleatórios, e na prática nunca coincidem nos oito primeiros carateres. É a primeira evidência da planificação.

Erro a esperar: o middleware do `res.locals` antes do das sessões, que dá 500 em todas as páginas com `reading 'pedido'`.

### Paragem 5

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 6: tirar, confirmar e cancelar

Terminar tem dois lados: destruir a sessão no servidor e apagar o cookie no browser. Vais testar os dois.


1. Acrescenta a rota de remoção apresentada nesta fase. Substitui o `pedido.ejs` pela versão completa desta fase. Ela inclui os botões de cada equipamento, a confirmação e o cancelamento. Acrescenta a função `erroDoNome` e as rotas da confirmação e do cancelamento. Guarda os ficheiros. O servidor reiniciou outra vez, e os pedidos das duas janelas perderam-se, como na parte 5: junta outra vez o projetor e o portátil na janela normal. Junta o monitor na janela anónima. Confirma no menu de cada uma "O teu pedido (2)" e "O teu pedido (1)".
2. Na janela normal, tira o primeiro equipamento. O pedido fica com um.
3. Confirma o pedido com o nome vazio (com o `novalidate`, se for preciso). Regista o código e a mensagem.
4. Confirma com um nome inventado, por exemplo "Ana". Prevê primeiro: para onde vai o browser, e o que acontece ao cookie?

O que deves ver: a lista das reservas, com a reserva nova, e o menu com "O teu pedido (0)". No separador Rede, a resposta ao `POST` a `confirmacao` tem um `Set-Cookie` com o valor vazio e a data de 1970. No separador dos cookies, o `catalogo.sid` desapareceu.

5. Agora o cancelamento, na janela anónima, com uma experiência a mais. Antes de cancelar, copia para o caderno o valor completo do cookie dessa janela. Depois cancela.
6. No separador dos cookies da janela anónima, cria outra vez `catalogo.sid` com o valor copiado. No Chrome, faz duplo clique na linha vazia da tabela para acrescentares um cookie. Abre `/pedido`. Prevê primeiro.

O que deves ver: "O teu pedido está vazio.". O cookie voltou ao browser, mas a sessão foi destruída no servidor, e o identificador já não leva a nada. Para a evidência deste tema, regista que o estado foi eliminado ao terminar, e como o confirmaste.



### Referência de código desta fase

Lê as explicações e usa cada bloco no ficheiro indicado. Os ficheiros novos aparecem completos; as alterações dizem o que substituem.

Cada equipamento do pedido ganha um botão para o tirar. O botão é um pequeno formulário `POST`, porque tirar muda o pedido, e o caminho leva a posição do equipamento na lista: `/pedido/itens/2/remocao` tira o segundo.

```js fragment
// Tirar um equipamento do pedido: POST /pedido/itens/2/remocao tira o segundo.
app.post("/pedido/itens/:posicao/remocao", (req, res) => {
  const pedido = req.session.pedido || [];
  const posicao = Number(req.params.posicao);
  if (!Number.isInteger(posicao) || posicao < 1 || posicao > pedido.length) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "Esse equipamento não está no teu pedido.",
    });
    return;
  }
  pedido.splice(posicao - 1, 1);
  res.redirect(303, "/pedido");
});
```

A posição vem do pedido, por isso verifica-se como um identificador: tem de ser um inteiro, de 1 até ao número de equipamentos do pedido. O `splice(posicao - 1, 1)` tira do array um elemento, na posição indicada; o `- 1` é porque a página conta a partir de 1 e o array a partir de 0.

O botão de remoção precisa da posição de cada linha. O `for...of` dá-te cada elemento; aqui vais usar um **`for` com contador**, que também dá o índice. Lê as três partes de `for (let i = 0; i < linhas.length; i++)` por esta ordem:

- `let i = 0` cria o contador uma vez, antes da primeira volta. Um array começa no índice 0.
- `i < linhas.length` é a condição verificada antes de cada volta. Só se executa o corpo enquanto for verdadeira.
- `i++` soma 1 ao contador depois de cada volta. Depois volta-se a verificar a condição.

`linhas[i]` lê o elemento no índice atual. A página apresenta a posição com `i + 1`, porque para quem a usa o primeiro equipamento é o número 1.

Antes de leres o modelo, prevê as posições para duas linhas: projetor e portátil. Confere a execução:

| `i` antes da condição | `i < 2` | O que esta volta apresenta | Depois da volta |
| --- | --- | --- | --- |
| 0 | Verdadeiro | Projetor, posição 1 | `i++` passa `i` a 1 |
| 1 | Verdadeiro | Portátil, posição 2 | `i++` passa `i` a 2 |
| 2 | Falso | Nada; o ciclo termina | Não há incremento |

O índice 2 já ficaria fora dessas duas linhas. A condição impede essa leitura.

A página do pedido, completa, com os equipamentos, o botão de cada um, a confirmação com o nome e o cancelamento:

```ejs
<%# O pedido em curso, guardado na sessão. Recebe o titulo, as linhas (cada
    uma com o item e o equipamento), e o nome e o erro do formulário de
    confirmação, vazios da primeira vez. %>
<%- include("partials/cabecalho") %>
    <% if (linhas.length === 0) { %>
      <p>O teu pedido está vazio.</p>
    <% } else { %>
      <ol>
        <% for (let i = 0; i < linhas.length; i++) { %>
          <li>
            <%= linhas[i].equipamento.nome %>, sala <%= linhas[i].equipamento.sala %>: dia <%= linhas[i].item.data %>, tempo <%= linhas[i].item.tempo %>
            <form method="post" action="/pedido/itens/<%= i + 1 %>/remocao">
              <button type="submit">Tirar do pedido</button>
            </form>
          </li>
        <% } %>
      </ol>
    <% } %>
    <p><a href="/pedido/item">Juntar um equipamento ao pedido</a></p>
    <% if (linhas.length > 0) { %>
      <h2>Confirmar o pedido</h2>
      <form method="post" action="/pedido/confirmacao">
        <p>
          <label for="nome">O teu nome
            <% if (erroNome) { %><strong><%= erroNome %></strong><% } %>
          </label>
          <input id="nome" name="nome" maxlength="40" value="<%= valorNome %>" required>
        </p>
        <button type="submit">Confirmar o pedido</button>
      </form>
      <h2>Cancelar o pedido</h2>
      <form method="post" action="/pedido/cancelamento">
        <button type="submit">Cancelar o pedido</button>
      </form>
    <% } %>
<%- include("partials/rodape") %>
```

O ciclo é um `for` com contador, e não um `for...of`, porque a página precisa da posição de cada equipamento para o botão de remoção. A confirmação e o cancelamento só aparecem quando o pedido tem alguma coisa.

A confirmação valida o nome, cria uma reserva por equipamento e termina a sessão:

```js fragment
/**
 * Verifica o nome de quem confirma o pedido: obrigatório, e até 40 carateres.
 * Devolve a mensagem de erro, ou o texto vazio se o nome servir.
 * @param {string} nome o nome, já limpo pela textoDoCampo
 * @returns {string}
 */
function erroDoNome(nome) {
  if (nome === "") {
    return "Escreve o teu nome.";
  }
  if (nome.length > 40) {
    return "O nome tem, no máximo, 40 carateres.";
  }
  return "";
}
```

```js fragment
// Confirmar o pedido: cria uma reserva por equipamento e termina a sessão.
app.post("/pedido/confirmacao", (req, res) => {
  const pedido = req.session.pedido || [];
  if (pedido.length === 0) {
    res.status(400).render("erro", {
      titulo: "Pedido vazio",
      mensagem: "Não há nada no teu pedido para confirmar.",
    });
    return;
  }

  let corpo = req.body;
  if (!corpo) {
    corpo = {};
  }
  const nome = textoDoCampo(corpo.nome);
  const erroNome = erroDoNome(nome);
  if (erroNome !== "") {
    res.status(400).render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: nome, erroNome: erroNome });
    return;
  }

  for (const item of pedido) {
    reservas.push({
      id: proximoIdReserva,
      equipamentoId: item.equipamentoId,
      data: item.data,
      tempo: item.tempo,
      nome: nome,
    });
    proximoIdReserva = proximoIdReserva + 1;
  }

  // O pedido acabou: a sessão é destruída no servidor, e o cookie apagado no browser.
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível terminar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/reservas");
  });
});
```

Se o nome estiver errado, a resposta é a página do pedido outra vez, com o 400, o nome escrito e a mensagem, como no tema anterior. Se o pedido estiver vazio (o formulário não aparece, mas um pedido feito à mão pode chegar), a resposta é a página de erro. Quando tudo está certo, as reservas são criadas, a sessão é destruída, o cookie é apagado, e o browser vai para a lista das reservas.

A rota de cancelamento completa está abaixo. Destrói a sessão sem criar reservas e volta à página inicial.

Quando a professora confirma o pedido, ou o cancela, o pedido acabou, e a sessão também deve acabar. Terminar uma sessão tem dois lados, e os dois são precisos.

No servidor, a sessão é destruída: os dados desaparecem do armazém. E aquele identificador deixa de servir para alguma coisa. Faz-se com o `req.session.destroy`, que recebe uma função para correr quando acabar, como o `app.listen`: a função recebe um erro, se a destruição falhou. E é dentro dela que se responde.

No browser, o cookie é apagado. Faz-se com o `res.clearCookie`, com o nome do cookie: o servidor manda um `Set-Cookie` com o valor vazio e uma data de expiração no passado, `Expires=Thu, 01 Jan 1970`, e o browser apaga-o.

```js fragment
// Cancelar o pedido: termina a sessão sem criar reservas.
app.post("/pedido/cancelamento", (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível cancelar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/");
  });
});
```

Destruir a sessão no servidor é o que importa para a segurança. Apagar o cookie só limpa o browser; se a sessão continuasse a existir no servidor, quem tivesse copiado o cookie antes continuava a ter acesso a ela. Com o `destroy`, um cookie antigo, guardado por quem quer que seja, já não leva a nada: o servidor não encontra a sessão. Trata o pedido como vindo de um browser novo, com um pedido vazio. É a evidência que a planificação pede: o estado eliminado ao terminar.

### Respostas para conferires esta fase

- **Passo 1.** O passo 1 volta a mudar o `server.js`, e os pedidos voltam a perder-se. Depois de juntar outra vez os equipamentos, a normal mostra "O teu pedido (2)" e a anónima "O teu pedido (1)". Se saltares esta parte, não terás nada para tirar. O passo 2 dará 400, "Esse equipamento não está no teu pedido.". Na janela anónima, faltará o botão de cancelar, que só aparece com o pedido preenchido.
- **Passo 2.** Tirar o primeiro equipamento deixa só o portátil, e o menu passa a "(1)".
- **Passo 3.** Nome vazio: 400, a página do pedido com "Escreve o teu nome.".
- **Passo 4.** Com o nome: a lista das reservas, com uma reserva por equipamento do pedido. O `Set-Cookie` da resposta ao `POST` a `confirmacao` com o valor vazio e `Expires=Thu, 01 Jan 1970 00:00:00 GMT`; o cookie desaparece do separador dos cookies; o menu volta a "(0)".
- **Passo 6.** O cookie antigo, recriado à mão: o pedido vazio. É a confirmação de que o estado acabou: o estado eliminado ao terminar, e eliminado no servidor, e não só no browser.

Confere a pergunta: "se o servidor só apagasse o cookie, e não destruísse a sessão, o que acontecia aqui?" O pedido voltava a aparecer: quem tivesse guardado o identificador continuava com acesso.

### Paragem 6

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 7: o roubo de uma sessão, e as defesas

O cookie funciona como uma chave. Quem copia uma chave válida pode abrir a mesma sessão.


1. Na janela normal, junta dois equipamentos ao pedido. Copia o valor completo do cookie.
2. Na janela anónima, cria (ou muda) o cookie `catalogo.sid` com esse valor, e abre `/pedido`. Prevê primeiro.

O que deves ver: o pedido da janela normal, com os dois equipamentos. Para o servidor, as duas janelas passaram a ser o mesmo browser. Na anónima, tira um equipamento e volta à normal: o pedido mudou também lá. É um roubo de sessão, feito a ti mesmo.

3. Na janela anónima, muda uma só letra do identificador (antes do ponto) e recarrega `/pedido`. Prevê primeiro.

O que deves ver: o pedido vazio. A assinatura deixou de bater certo, e o servidor ignorou o cookie.

4. Na consola de uma página do catálogo, na janela normal, escreve `document.cookie` e carrega em Enter. Regista o que aparece, e explica-o com o atributo responsável.
5. Com um pedido a meio na janela normal, vai ao terminal onde arrancaste este servidor e pára-o com Ctrl+C. Na mesma pasta, arranca-o de novo com `node --watch --env-file=.env server.js`. Não apagues os cookies. Recarrega `/pedido`. O que aconteceu ao pedido? E o cookie, ainda está no browser?

Guardar um ficheiro sem alterações pode não provocar um reinício. A paragem e o arranque explícitos permitem comparar o estado antes e depois do reinício do teu processo.


### Respostas para conferires esta fase

- **Passo 2.** A janela anónima, com o valor copiado, mostra o pedido da normal. Uma mudança numa janela vê-se na outra. É um roubo de sessão.
- **Passo 3.** Uma letra mudada antes do ponto: o pedido vazio. A assinatura deixou de bater certo, e o servidor criou uma sessão nova para aquele browser.
- **Passo 4.** O `document.cookie` não mostra o `catalogo.sid`: é o `HttpOnly`.
- **Passo 5.** Depois do reinício: o pedido vazio, e o cookie ainda está no browser. O servidor não reconhece o identificador, porque as sessões estavam na memória.

A pergunta que liga a parte 7 ao guia: "se o roubo é tão fácil com acesso ao browser, de que servem os atributos?" Os atributos reduzem formas de obter e usar o cookie. O `HttpOnly` impede a leitura por um script na página. O `Secure` protege o envio na rede. A expiração encurta o tempo em que um cookie roubado serve.

### Paragem 7

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.
## Fase 8: a configuração justificada, e a evidência

Cada opção responde a um risco ou necessidade. A configuração explica-se em função do ambiente local e do HTTPS.


1. Copia para o caderno esta tabela e preenche a última coluna com a razão de cada valor, por palavras tuas. É o artefacto deste tema: a configuração da sessão, justificada.

| Opção | Valor no catálogo | Porquê |
| --- | --- | --- |
| `secret` | lido do `.env` | |
| `name` | `catalogo.sid` | |
| `resave` | `false` | |
| `saveUninitialized` | `false` | |
| `cookie.httpOnly` | `true` | |
| `cookie.sameSite` | `"lax"` | |
| `cookie.secure` | `false` | |
| `cookie.maxAge` | 30 minutos | |

2. Na linha do `secure`, escreve também o que mudaria num servidor publicado, e porquê.
3. Em pares: um explica ao outro, sem ler, para que servem o `HttpOnly`, o `SameSite` e o `Secure`. A diferença entre o roubo e a fixação de uma sessão. Depois trocam.
4. Volta às previsões da parte 1 e corrige a lápis o que previste mal.

### Respostas para conferires esta fase

| Opção | Valor | Razão esperada |
| --- | --- | --- |
| `secret` | do `.env` | Assina o identificador; fora do código e do Git, para ninguém poder assinar identificadores falsos |
| `name` | `catalogo.sid` | Não revela que o servidor usa o express-session, como o `connect.sid` revelaria |
| `resave` | `false` | Só guarda a sessão quando ela muda |
| `saveUninitialized` | `false` | Nenhum cookie a quem não guardou nada; privacidade |
| `cookie.httpOnly` | `true` | Os scripts da página não leem o cookie; protege do roubo por XSS |
| `cookie.sameSite` | `"lax"` | O cookie não vai nos `POST` vindos de outros sites; primeira defesa contra o CSRF |
| `cookie.secure` | `false` | Em `http://localhost` não há HTTPS; num servidor publicado, com HTTPS, passa a `true`, para o cookie nunca viajar sem cifra |
| `cookie.maxAge` | 30 minutos | Uma sessão esquecida acaba sozinha |

Na explicação em pares, o que se procura: o roubo é usar o identificador de outra pessoa. A fixação é pôr a vítima a usar um identificador que o atacante já conhece. A defesa é um identificador novo no momento importante (`req.session.regenerate`), que o catálogo não tem porque não tem autenticação.

### Paragem 8

Confirma os resultados descritos antes de continuares. Se houver diferença, escreve o esperado e o obtido. Formula uma hipótese e muda uma causa de cada vez.

## Problemas frequentes

### O servidor não arranca

Lê a primeira linha do terminal. `node: .env: not found` quer dizer que não há `.env` na pasta; `Falta o SESSION_SECRET` quer dizer que o `.env` não tem o segredo, ou que o servidor arrancou sem o `--env-file=.env`.

### Todas as páginas dão 500

Se a mensagem fala de `reading 'pedido'`, o middleware das sessões está abaixo do middleware do `res.locals` ou das rotas.

### As duas janelas mostram o mesmo pedido, sem eu copiar o cookie

São duas janelas normais, que partilham os cookies. Uma delas tem de ser anónima.

### Não encontro onde criar ou mudar um cookie

No Chrome, no separador "Application", secção "Cookies", escolhe `http://localhost:3000`: para mudar um valor, faz duplo clique na célula. Para criar um cookie, faz duplo clique na linha vazia no fim da tabela. No Firefox, no separador "Armazenamento", há um botão para acrescentar. O nome tem de ser exatamente `catalogo.sid`.

### O pedido desapareceu sozinho

O servidor reiniciou, ou passaram 30 minutos sem renovar a validade do cookie.

## O que fica no teu caderno

1. As previsões da parte 1, com as correções da parte 8.
2. O resultado da tentativa ingénua da parte 2.
3. Os dois erros de arranque da parte 3.
4. O `Set-Cookie`, os atributos e o cabeçalho `Cookie` da parte 4.
5. A evidência das duas sessões isoladas (parte 5) e do estado eliminado ao terminar (parte 6).
6. As experiências da parte 7: o roubo, o identificador mudado, o `document.cookie` e o reinício.
7. A tabela da configuração justificada, da parte 8.

O professor vai pedir-te que expliques, com o teu servidor aberto, porque é que o pedido não se mistura entre as duas janelas. Porque é que o catálogo não pode confiar no nome guardado com o pedido.

## Conferência dos ficheiros finais

Depois de desfazeres todos os erros provocados, confere os teus ficheiros com esta versão completa. Os nomes e as rotas mantêm a sequência do catálogo.

### `server.js` completo

```js
// server.js: o catálogo de equipamentos da escola, agora com um pedido em curso.
// Quem quer reservar junta ao pedido um ou mais equipamentos, página a página,
// e no fim confirma tudo de uma vez, ou cancela. O pedido fica guardado na
// sessão: os dados ficam no servidor, e o browser só guarda um cookie com o
// identificador da sessão.
import express from "express";
import session from "express-session";

const app = express();
const PORTA = 3000;

// O segredo que assina o cookie da sessão vem do ambiente, e nunca do código.
// Sem ele, o servidor recusa-se a arrancar.
const SEGREDO = process.env.SESSION_SECRET;
if (!SEGREDO) {
  console.error("Falta o SESSION_SECRET. Copia o .env.example para .env, escreve lá um segredo e arranca com: node --env-file=.env server.js");
  process.exit(1);
}

// O nome do cookie da sessão, usado na configuração e ao terminar a sessão.
const NOME_DO_COOKIE = "catalogo.sid";

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
 * Verifica um equipamento a juntar ao pedido: o equipamento, o dia e o tempo.
 * Só lê os três campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * @param {object|undefined} corpo o req.body do pedido, que pode não existir
 * @returns {object} um objeto com os valores e os erros
 */
function validarItem(corpo) {
  // Sem corpo lido, todos os campos faltam e recebem os erros já previstos.
  if (!corpo) {
    corpo = {};
  }
  const valores = {
    equipamento_id: textoDoCampo(corpo.equipamento_id),
    data: textoDoCampo(corpo.data),
    tempo: textoDoCampo(corpo.tempo),
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

  return { valores: valores, erros: erros };
}

/**
 * Verifica o nome de quem confirma o pedido: obrigatório, e até 40 carateres.
 * Devolve a mensagem de erro, ou o texto vazio se o nome servir.
 * @param {string} nome o nome, já limpo pela textoDoCampo
 * @returns {string}
 */
function erroDoNome(nome) {
  if (nome === "") {
    return "Escreve o teu nome.";
  }
  if (nome.length > 40) {
    return "O nome tem, no máximo, 40 carateres.";
  }
  return "";
}

/**
 * Junta a cada item do pedido o seu equipamento, para a página mostrar o nome.
 * @param {object[]} pedido os itens guardados na sessão
 * @returns {object[]} uma linha por item, com o item e o equipamento
 */
function linhasDoPedido(pedido) {
  const linhas = [];
  for (const item of pedido) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === item.equipamentoId);
    linhas.push({ item: item, equipamento: equipamento });
  }
  return linhas;
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

// Middleware das sessões: lê o cookie de cada pedido, encontra a sessão
// desse browser e põe-na em req.session. Cada opção está justificada.
app.use(session({
  secret: SEGREDO, // assina o cookie: o servidor só aceita identificadores que ele próprio deu
  name: NOME_DO_COOKIE, // o nome do cookie no browser
  resave: false, // não volta a guardar uma sessão que não mudou
  saveUninitialized: false, // não cria sessão, nem cookie, a quem ainda não guardou nada
  cookie: {
    httpOnly: true, // o JavaScript das páginas não consegue ler o cookie
    sameSite: "lax", // o cookie não vai nos pedidos POST que outros sites façam ao catálogo
    secure: false, // com HTTPS seria true; em http://localhost tem de ser false
    maxAge: 30 * 60 * 1000, // 30 minutos, em milissegundos, contados da última mudança
  },
}));

// Para todas as páginas: quantos equipamentos tem o pedido desta sessão.
// O res.locals põe o valor à disposição de todos os modelos, incluindo o cabeçalho.
app.use((req, res, next) => {
  const pedido = req.session.pedido;
  res.locals.itensNoPedido = pedido ? pedido.length : 0;
  next();
});

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

// O pedido em curso: os equipamentos já juntos, a confirmação e o cancelamento.
app.get("/pedido", (req, res) => {
  const pedido = req.session.pedido || [];
  res.render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: "", erroNome: "" });
});

// O formulário para juntar um equipamento ao pedido.
app.get("/pedido/item", (req, res) => {
  res.render("item-novo", {
    titulo: "Juntar ao pedido",
    equipamentos: equipamentos,
    valores: { equipamento_id: "", data: "", tempo: "" },
    erros: {},
  });
});

// Juntar um equipamento ao pedido: valida, e guarda o item na sessão.
app.post("/pedido/itens", (req, res) => {
  const resultado = validarItem(req.body);
  if (Object.keys(resultado.erros).length > 0) {
    res.status(400).render("item-novo", {
      titulo: "Juntar ao pedido",
      equipamentos: equipamentos,
      valores: resultado.valores,
      erros: resultado.erros,
    });
    return;
  }

  // Da primeira vez, a sessão ainda não tem pedido: começa vazio.
  if (!req.session.pedido) {
    req.session.pedido = [];
  }
  req.session.pedido.push({
    equipamentoId: Number(resultado.valores.equipamento_id),
    data: resultado.valores.data,
    tempo: Number(resultado.valores.tempo),
  });
  res.redirect(303, "/pedido");
});

// Tirar um equipamento do pedido: POST /pedido/itens/2/remocao tira o segundo.
app.post("/pedido/itens/:posicao/remocao", (req, res) => {
  const pedido = req.session.pedido || [];
  const posicao = Number(req.params.posicao);
  if (!Number.isInteger(posicao) || posicao < 1 || posicao > pedido.length) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "Esse equipamento não está no teu pedido.",
    });
    return;
  }
  pedido.splice(posicao - 1, 1);
  res.redirect(303, "/pedido");
});

// Confirmar o pedido: cria uma reserva por equipamento e termina a sessão.
app.post("/pedido/confirmacao", (req, res) => {
  const pedido = req.session.pedido || [];
  if (pedido.length === 0) {
    res.status(400).render("erro", {
      titulo: "Pedido vazio",
      mensagem: "Não há nada no teu pedido para confirmar.",
    });
    return;
  }

  let corpo = req.body;
  if (!corpo) {
    corpo = {};
  }
  const nome = textoDoCampo(corpo.nome);
  const erroNome = erroDoNome(nome);
  if (erroNome !== "") {
    res.status(400).render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: nome, erroNome: erroNome });
    return;
  }

  for (const item of pedido) {
    reservas.push({
      id: proximoIdReserva,
      equipamentoId: item.equipamentoId,
      data: item.data,
      tempo: item.tempo,
      nome: nome,
    });
    proximoIdReserva = proximoIdReserva + 1;
  }

  // O pedido acabou: a sessão é destruída no servidor, e o cookie apagado no browser.
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível terminar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/reservas");
  });
});

// Cancelar o pedido: termina a sessão sem criar reservas.
app.post("/pedido/cancelamento", (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível cancelar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/");
  });
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
    <p><a href="/pedido/item">Fazer um pedido de reserva</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

### `views/item-novo.ejs` completo

```ejs
<%# O formulário para juntar um equipamento ao pedido. Recebe o titulo,
    os equipamentos para a lista, os valores a pôr nos campos e os erros,
    um por campo. O nome só se pede no fim, ao confirmar o pedido. %>
<%- include("partials/cabecalho") %>
    <% if (Object.keys(erros).length > 0) { %>
      <p><strong>O equipamento não foi juntado ao pedido. Corrige os campos assinalados e volta a enviar.</strong></p>
    <% } %>
    <form method="post" action="/pedido/itens">
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
      <button type="submit">Juntar ao pedido</button>
    </form>
    <p><a href="/pedido">Voltar ao pedido</a></p>
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
      <a href="/pedido/item">Juntar um equipamento ao pedido</a> |
      <a href="/pedido">O teu pedido (<%= itensNoPedido %>)</a>
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

### `views/pedido.ejs` completo

```ejs
<%# O pedido em curso, guardado na sessão. Recebe o titulo, as linhas (cada
    uma com o item e o equipamento), e o nome e o erro do formulário de
    confirmação, vazios da primeira vez. %>
<%- include("partials/cabecalho") %>
    <% if (linhas.length === 0) { %>
      <p>O teu pedido está vazio.</p>
    <% } else { %>
      <ol>
        <% for (let i = 0; i < linhas.length; i++) { %>
          <li>
            <%= linhas[i].equipamento.nome %>, sala <%= linhas[i].equipamento.sala %>: dia <%= linhas[i].item.data %>, tempo <%= linhas[i].item.tempo %>
            <form method="post" action="/pedido/itens/<%= i + 1 %>/remocao">
              <button type="submit">Tirar do pedido</button>
            </form>
          </li>
        <% } %>
      </ol>
    <% } %>
    <p><a href="/pedido/item">Juntar um equipamento ao pedido</a></p>
    <% if (linhas.length > 0) { %>
      <h2>Confirmar o pedido</h2>
      <form method="post" action="/pedido/confirmacao">
        <p>
          <label for="nome">O teu nome
            <% if (erroNome) { %><strong><%= erroNome %></strong><% } %>
          </label>
          <input id="nome" name="nome" maxlength="40" value="<%= valorNome %>" required>
        </p>
        <button type="submit">Confirmar o pedido</button>
      </form>
      <h2>Cancelar o pedido</h2>
      <form method="post" action="/pedido/cancelamento">
        <button type="submit">Cancelar o pedido</button>
      </form>
    <% } %>
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
    <p><a href="/pedido/item">Fazer um pedido de reserva</a></p>
<%- include("partials/rodape") %>
```

Leitura guiada: o nome do ficheiro indica o seu papel. No servidor, segue primeiro os middlewares e depois as rotas. Nos modelos, segue os dados recebidos e as marcas que os mostram.

## Desafios

1. Mostra na página do pedido quantos equipamentos pertencem à sala B12, sem mudar os dados guardados na sessão.

## Antes de terminares

- [ ] Desfizeste os erros provocados e confirmaste o catálogo a funcionar.
- [ ] Guardaste as previsões, os resultados e as explicações pedidas.
- [ ] Consegues explicar onde correm o JavaScript e o EJS e que dados chegam ao browser.

![Rodapé](../imagens/rodape.png)
