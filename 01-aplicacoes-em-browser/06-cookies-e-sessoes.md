![Cabeçalho](../imagens/cabecalho.png)

# Cookies e sessões

Módulo Aplicações baseadas em browsers. Este guia explica como guardar um pedido separado para cada browser numa sessão. Para praticar, tens o [laboratório](06-cookies-e-sessoes-laboratorio.md) e a [ficha de exercícios](06-cookies-e-sessoes-exercicios.md).

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte.

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. O HTTP não se lembra de nada
4. Cookies: o browser guarda e devolve
5. O pedido fica no servidor, e o cookie só leva o número
6. A sessão com o express-session
7. Os atributos do cookie
8. Terminar a sessão
9. Uma sessão não é uma autenticação
10. Exemplo guiado: o pedido em curso
11. Observar os cookies no browser
12. Erros frequentes
13. Segurança: o que este tema já pede
14. Verificar o que aprendeste
15. O que vem a seguir

## O que vais aprender

No tema anterior, cada reserva era de um só equipamento. Uma professora que quisesse o projetor e o portátil para a mesma aula tinha de preencher o formulário duas vezes. E escrever o nome duas vezes. Neste tema, o catálogo passa a ter um **pedido em curso**. A professora junta primeiro o projetor, depois o portátil. Pode navegar pelo catálogo entre os dois, consultar o pedido quando quiser e retirar o que já não quer. No fim escreve o nome uma vez e confirma tudo, ou cancela.

Nos ensaios, usa um nome fictício, como "Ana Reserva", e os dados inventados dos equipamentos. O nome escrito não verifica quem está a usar o catálogo: não há contas nem autenticação.

Para isto, o servidor tem de se lembrar, de um pedido HTTP para o seguinte, do que esta professora já juntou. De não o misturar com o que outra pessoa, noutro computador, está a juntar ao mesmo tempo. É isso que as sessões fazem.

No fim deste guia deves conseguir:

- explicar porque é que o HTTP não guarda estado entre pedidos, e porque é que uma variável do servidor não resolve isso;
- explicar o que é um cookie, quem o cria, quem o guarda e quando é que viaja;
- explicar porque é que os dados de uma sessão ficam no servidor e o cookie só leva um identificador;
- configurar o `express-session`, com o segredo fora do código e cada opção justificada;
- guardar, ler e apagar dados na sessão com o `req.session`, e terminar uma sessão;
- explicar para que servem os atributos `HttpOnly`, `SameSite`, `Secure` e a expiração do cookie;
- explicar porque é que uma sessão não é uma autenticação, e o que são o roubo e a fixação de uma sessão;
- demonstrar duas sessões isoladas e o estado de uma sessão eliminado depois de a terminar.

## O que já sabes e vais usar

- Validação no servidor, `textoDoCampo`, `diaValido`, formulário com erros e redirecionamento 303: [tema 05](05-formularios-e-validacao.md).
- Cabeçalhos do pedido e da resposta e separador Rede: [tema 01](01-do-pedido-a-resposta.md).
- Configuração fora do código e `.env`, do tema Arquitetura e setup Node de LP.
- `.env.example`, que documenta as variáveis, e `--env-file`, que lê o `.env` no arranque, do mesmo tema de LP.
- `.gitignore`, que mantém o `.env` fora do Git, do mesmo tema de LP. O segredo da sessão vai viver nesse ficheiro de ambiente.

O exemplo parte do catálogo com formulários. Se não o tiveres a funcionar, copia [catalogo-com-formularios](../exemplos/aplicacoes-em-browser/catalogo-com-formularios/README.md).

## O HTTP não se lembra de nada

Cada pedido HTTP chega sozinho ao servidor. Traz o método, o caminho, os cabeçalhos e, às vezes, um corpo, e o servidor responde a esse pedido com o que lá vem. Quando chega o pedido seguinte, o servidor não sabe se veio do mesmo browser, da mesma pessoa, ou de outro computador do outro lado do mundo. Diz-se que o HTTP é um protocolo **sem estado**: não guarda nada de um pedido para o outro.

Até aqui isto não fez falta. A lista dos equipamentos é igual para toda a gente. Uma reserva, no tema anterior, ia inteira num só `POST`, com os quatro campos no corpo. Mas um pedido em curso atravessa vários pedidos HTTP: juntar o projetor é um pedido, ver o catálogo é outro, juntar o portátil é outro, e confirmar é outro ainda. Entre eles, alguém tem de guardar o que já foi juntado.

A primeira ideia que costuma aparecer é uma variável no servidor:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// A tentativa ingénua: o pedido numa variável do servidor, sem sessões.
let pedido = [];
app.post("/pedido/itens", (req, res) => {
  pedido.push(req.body.equipamento_id);
  res.redirect(303, "/pedido");
});
```

Leitura guiada: `POST /pedido/itens` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

Funciona enquanto há uma só pessoa a usar o catálogo. Com duas, deixa de funcionar, e de uma forma traiçoeira: a variável é uma só, para o servidor inteiro, e todos os pedidos de todos os browsers a usam. A professora junta o projetor, e o colega que abre o catálogo noutra sala vê o projetor no pedido dele, sem ter juntado nada. O laboratório mostra-o com duas janelas do browser. O servidor precisa de saber **de que browser** vem cada pedido, para guardar um pedido separado para cada um. É aqui que entram os cookies.

## Cookies: o browser guarda e devolve

Um **cookie** é um pequeno texto, com um nome e um valor, que o servidor pede ao browser para guardar. Que o browser devolve depois, sozinho, em todos os pedidos seguintes ao mesmo servidor.

O servidor pede-o com um cabeçalho na resposta, o `Set-Cookie`:

```text
HTTP/1.1 303 See Other
Location: /pedido
Set-Cookie: catalogo.sid=s%3Am9fcUL...; Path=/; Expires=Mon, 12 Oct 2026 01:04:19 GMT; HttpOnly; SameSite=Lax
```

O browser guarda o cookie `catalogo.sid`, com o valor que vem a seguir ao `=`. A partir daí junta-o a cada pedido que faz a esse servidor, num cabeçalho do pedido, o `Cookie`:

```text
GET /pedido HTTP/1.1
Host: localhost:3000
Cookie: catalogo.sid=s%3Am9fcUL...
```

O servidor não precisa de fazer nada para receber o cookie: vem sempre, em todos os pedidos, até expirar ou ser apagado. É por aí que o servidor passa a reconhecer o browser: dois pedidos com o mesmo cookie vêm do mesmo browser.

Na linha do `Set-Cookie`, depois do nome e do valor, vêm os **atributos** do cookie, separados por `;`. Dizem ao browser as regras do cookie: o `Path=/` diz que é para todos os caminhos do site. O `Expires` diz até quando o deve guardar. O `HttpOnly` e o `SameSite` são regras de segurança, que têm uma secção própria. Os atributos são instruções para o browser. E não viajam de volta: no cabeçalho `Cookie` do pedido só vão o nome e o valor.

Dois pormenores que convém saber desde já. Um cookie é de um site: o browser só o envia ao servidor que o criou, e não a outros. E é de um browser: uma janela anónima, outro perfil do mesmo browser ou outro browser no mesmo computador têm os seus próprios cookies, separados. Para o servidor, são browsers diferentes.

## O pedido fica no servidor, e o cookie só leva o número

Se o cookie vai e vem em todos os pedidos, porque não guardar o próprio pedido dentro dele, como `pedido=2,1`? Há três razões para não o fazer.

A primeira é que o cookie está no computador do utilizador, e o utilizador pode mudá-lo. As ferramentas de programador deixam editar qualquer cookie, e um programa pode enviar o cabeçalho `Cookie` que quiser. Um cookie com o pedido seria um pedido que o utilizador escreve à mão, sem passar por nenhuma validação. É a regra dos temas anteriores: o que vem do browser não é de confiança.

A segunda é o tamanho. Um cookie pode ter, no máximo, cerca de 4 kilobytes, e viaja em todos os pedidos, até nos da página inicial, que não precisam dele. Um pedido com muitos equipamentos, e mais tarde com mais dados, não caberia, ou tornaria todos os pedidos mais pesados.

A terceira é a privacidade. Um cookie fica guardado no computador, e qualquer pessoa com acesso ao browser o pode ler. Os dados de um pedido não têm de estar lá.

A solução é separar as duas coisas. Os dados do pedido ficam **no servidor**, num sítio próprio para cada browser. O cookie só leva um **identificador**: um código comprido e aleatório, que diz ao servidor qual dos sítios é o deste browser. A este conjunto, os dados guardados no servidor para um browser, mais o identificador que o browser guarda no cookie, chama-se uma **sessão**. É como o talão de um bengaleiro: o casaco fica lá dentro, e tu só levas o número. Quem te devolve o casaco é quem tem o talão.

Para o identificador não poder ser inventado, o servidor **assina-o**: junta-lhe uma assinatura calculada a partir dele e de um segredo que só o servidor conhece. É a parte do valor do cookie que vem depois do ponto. Quando o cookie volta, o servidor recalcula a assinatura com o seu segredo. Se a assinatura não bater certo, o servidor ignora o cookie e trata o pedido como vindo de um browser novo. A diferença mostra que o identificador ou a assinatura foram alterados, ou que o segredo já não é o mesmo. Sem conhecer o segredo, ninguém consegue fabricar um identificador que o servidor aceite.

## A sessão com o express-session

O Express não trata as sessões sozinho, mas a mesma equipa que faz o Express mantém um middleware para isso, o `express-session`. Instala-se como os outros pacotes:

```bash
npm install express-session@1.19.0
```

E importa-se no início do `server.js`, ao lado do Express:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
import session from "express-session";
```

Leitura guiada: esta linha importa o pacote com o nome `session`. Ainda não o ativa; esse nome será usado para configurar o middleware.

### O segredo, fora do código

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

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: avalia a condição com os dados do exemplo. Só o ramo escolhido produz o resultado; o outro ramo não é executado.

O `process.exit(1)` termina o programa logo ali; o 1 diz ao terminal que terminou com um erro. É melhor um servidor que não arranca e diz porquê do que um servidor que arranca sem segredo e falha mais tarde, a meio de um pedido. O nome do cookie fica numa constante, porque vai ser usado em dois sítios: na configuração e quando a sessão terminar.

### O middleware e as suas opções

O middleware das sessões regista-se depois do `express.urlencoded` e antes das rotas, porque as rotas vão usar o que ele prepara:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: este middleware corre antes do elemento seguinte da fila. Identifica o que prepara e se chama `next()` ou termina com uma resposta.

Cada opção tem uma razão. E escrevê-la ao lado é parte do trabalho: uma configuração de segurança que ninguém sabe justificar é uma configuração que alguém vai mudar sem saber o que estraga.

- `secret`: o segredo que assina o identificador, lido do `.env`.
- `name`: o nome do cookie. Por omissão seria `connect.sid`, que diz a quem olha que o servidor usa o `express-session`; um nome do teu site não diz nada.
- `resave: false`: no fim de cada pedido, a sessão só volta a ser guardada se tiver mudado. Guardar uma sessão que não mudou é trabalho inútil.
- `saveUninitialized: false`: uma sessão nova, em que não se guardou nada, não é guardada, e o browser não recebe cookie nenhum. Quem só vê o catálogo não fica com um cookie sem razão; o cookie só aparece quando a pessoa junta o primeiro equipamento ao pedido. É também uma questão de privacidade: não se guarda nada sobre quem não pediu nada.
- `cookie`: os atributos do cookie, que têm a secção seguinte.

### O que o middleware faz a cada pedido

Para cada pedido, o middleware procura o cookie `catalogo.sid`. Se o encontrar, e a assinatura estiver certa, vai buscar ao servidor os dados dessa sessão e põe-nos em `req.session`. Se não houver cookie, ou se a assinatura não bater certo, ou se a sessão já não existir no servidor, cria uma sessão nova e vazia. Em qualquer dos casos, a rota encontra um `req.session`, que é um objeto onde pode ler e escrever o que quiser:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
req.session.pedido = []; // guardar
const pedido = req.session.pedido; // ler
```

Leitura guiada: a primeira linha guarda um array vazio na sessão. A segunda lê esse array para a variável local `pedido`; nenhuma delas envia uma resposta HTTP.

No fim do pedido, se a sessão mudou, o middleware guarda-a no servidor e, se for preciso, manda ao browser o `Set-Cookie`. A rota não trata do cookie: trata só do `req.session`, como se fosse um objeto que se lembra de um pedido para o outro. Daqui a dois pedidos, o mesmo browser encontra lá o que lá deixou; outro browser encontra outro objeto, o seu.

### Onde ficam as sessões

O `express-session` guarda as sessões, por omissão, na memória do próprio servidor, num armazém chamado `MemoryStore`. Tem duas consequências. Quando o servidor reinicia, todas as sessões desaparecem: o browser continua a enviar o cookie. Mas o servidor já não tem nada com aquele identificador. E trata-o como um browser novo. E o `MemoryStore` não serve para um servidor a sério, que corre muito tempo e com muitos utilizadores: vai ocupando memória. Não funciona com mais do que um processo. O próprio `express-session` o avisa no terminal, quando o servidor corre em modo de produção. Para aprender, em `localhost`, serve. Num servidor publicado, as sessões vão para uma base de dados. E é um assunto do segundo módulo.

## Os atributos do cookie

O cookie da sessão é a chave do pedido de alguém. Os atributos são a forma de dizer ao browser como a guardar:

| Atributo | O que diz ao browser | Porque está ligado |
| --- | --- | --- |
| `HttpOnly` | O JavaScript das páginas não pode ler este cookie; só o browser o envia ao servidor | Se alguém conseguir meter um script numa página do catálogo (é o ataque do tema 4), esse script não consegue ler o cookie e enviá-lo para fora |
| `SameSite=Lax` | Não enviar este cookie nos pedidos `POST` que cheguem ao catálogo vindos de páginas de outros sites; nas ligações normais para o catálogo, envia | Uma página de outro site com um formulário que envia para o teu `POST /pedido/confirmacao` não leva o cookie, e não mexe no pedido de ninguém. É uma primeira defesa contra o CSRF, que o tema 7 trata |
| `Secure` | Só enviar o cookie por HTTPS, a ligação cifrada | Por HTTP sem cifra, quem estiver na mesma rede pode ler o cookie a passar. Em `http://localhost` não há HTTPS, por isso aqui fica `false`; num servidor publicado, com HTTPS, fica `true` |
| `Expires`, a partir do `maxAge` | Apagar o cookie a esta hora | Uma sessão esquecida aberta num computador da escola acaba sozinha. Aqui, 30 minutos depois da última vez que o pedido mudou |

O `maxAge` escreve-se em milissegundos. E por isso a conta `30 * 60 * 1000`: 30 minutos, 60 segundos cada, 1000 milissegundos cada segundo. A conta fica escrita. E não o resultado (1 800 000), para quem lê perceber o que é. O `express-session` transforma o `maxAge` no `Expires` do cookie, com a hora certa. Volta a fazê-lo sempre que a sessão muda: cada vez que juntas ou tiras um equipamento, o cookie ganha mais 30 minutos. Uma página que só lê o pedido não muda a sessão. E não mexe na hora.

Repara que nenhum destes atributos torna a sessão uma prova de identidade. Tornam mais difícil roubar o cookie, mas quem o tiver continua a ter a sessão. É a secção "Uma sessão não é uma autenticação".

## Terminar a sessão

Quando a professora confirma o pedido, ou o cancela, o pedido acabou, e a sessão também deve acabar. Terminar uma sessão tem dois lados, e os dois são precisos.

No servidor, a sessão é destruída: os dados desaparecem do armazém. E aquele identificador deixa de servir para alguma coisa. Faz-se com o `req.session.destroy`, que recebe uma função para correr quando acabar, como o `app.listen`: a função recebe um erro, se a destruição falhou. E é dentro dela que se responde.

No browser, o cookie é apagado. Faz-se com o `res.clearCookie`, com o nome do cookie: o servidor manda um `Set-Cookie` com o valor vazio e uma data de expiração no passado, `Expires=Thu, 01 Jan 1970`, e o browser apaga-o.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: `POST /pedido/cancelamento` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

Destruir a sessão no servidor é o que importa para a segurança. Apagar o cookie só limpa o browser. Se a sessão continuasse a existir no servidor, quem tivesse copiado o cookie antes continuava a ter acesso a ela. Com o `destroy`, um cookie antigo, guardado por quem quer que seja, já não leva a nada: o servidor não encontra a sessão. Trata o pedido como vindo de um browser novo, com um pedido vazio. É a evidência que a planificação pede: o estado eliminado ao terminar.

## Uma sessão não é uma autenticação

Uma sessão sabe uma coisa: que vários pedidos vieram **do mesmo browser**. Não sabe quem está ao teclado. O nome que a professora escreve ao confirmar o pedido é só um texto: qualquer pessoa podia ter escrito "Ana". E a sessão é de quem tiver o cookie, seja quem for.

**Autenticação** é outra coisa: é confirmar quem uma pessoa é, por exemplo com um nome de utilizador e uma palavra-passe verificados pelo servidor. Este tema não faz autenticação. E não a finge. O catálogo não tem contas, nem palavras-passe, nem páginas que só alguns podem ver. Um pedido em curso não precisa de saber quem és: precisa de não se misturar com o de outra pessoa. E a sessão chega para isso. Usar uma sessão como se fosse uma prova de identidade (por exemplo, achar que quem tem o cookie com o nome "Ana" é a Ana) é um erro de segurança. É o primeiro que este tema quer evitar.

Como a sessão é de quem tem o cookie, há dois ataques que convém conhecer pelo nome.

O **roubo de sessão** (em inglês, session hijacking) é alguém conseguir o identificador de outra pessoa e usá-lo no seu browser. A partir daí, para o servidor, os dois browsers são o mesmo. E o atacante vê e muda o pedido da vítima. No laboratório observas este efeito nas tuas próprias sessões locais, copiando o cookie de uma janela tua para outra, com dados inventados. As defesas são as dos atributos: o `HttpOnly` impede um script de ler o cookie, o `Secure` impede que seja lido a passar pela rede. A expiração encurta o tempo em que um cookie roubado serve.

A **fixação de sessão** (session fixation) é o contrário: o atacante não rouba o identificador da vítima, consegue que a vítima use um identificador que ele já conhece. Se depois a vítima fizer alguma coisa importante nessa sessão (numa aplicação com contas, entrar com a palavra-passe), o atacante, que conhece o identificador, fica com acesso. A defesa é dar à sessão um identificador novo no momento importante, com o `req.session.regenerate`, que o `express-session` também tem. Não a usas neste tema, porque o catálogo não tem esse momento; mas, numa aplicação com autenticação, é obrigatória.

## Exemplo guiado: o pedido em curso

O exemplo parte do catálogo com formulários do tema anterior. O formulário de reserva passa a juntar equipamentos a um pedido guardado na sessão, e o nome só se pede no fim, ao confirmar. O resultado final está pronto a correr na pasta [catalogo-com-sessoes](../exemplos/aplicacoes-em-browser/catalogo-com-sessoes/README.md) dos exemplos.

### Passo 1: o segredo e o middleware das sessões

Na pasta do catálogo, `npm install express-session@1.19.0`. Cria o `.env.example` e o `.env` da secção "O segredo, fora do código", e confirma que o `.gitignore` tem a linha `.env`. No `server.js`, o `import` da sessão, a leitura do segredo e o nome do cookie, logo a seguir ao `const PORTA`, e o middleware das sessões a seguir ao `express.urlencoded`.

A partir daqui, o servidor arranca com `node --watch --env-file=.env server.js`. Nada muda nas páginas: o middleware não cria sessão nenhuma enquanto nenhuma rota guardar alguma coisa nela, e por isso o browser não recebe cookie nenhum.

### Passo 2: juntar ao pedido

O formulário de reserva do tema anterior passa a juntar um equipamento ao pedido: os mesmos campos, menos o nome. Na tua cópia, retira do `server.js` as rotas completas `GET /reservas/nova` e `POST /reservas`. Apaga `views/reserva-nova.ejs`, que deixa de ser usado. Mantém o array `reservas`, o contador, as rotas `GET /reservas` e `GET /reservas/:id`, e os modelos `reservas.ejs` e `reserva.ejs`.

Nesta mesma etapa, troca as ligações para `/reservas/nova` por `/pedido/item` em `views/partials/cabecalho.ejs`, `views/inicio.ejs` e `views/reservas.ejs`. Usa o texto "Juntar um equipamento ao pedido". A ligação para ver `/reservas` mantém-se. Assim, nenhuma página continua a oferecer o formulário antigo.

Substitui a função `validarReserva` por `validarItem`, com a mesma verificação do equipamento, do dia e do tempo, e sem o bloco do nome. Mantém a guarda inicial do tema anterior. Sem corpo lido, o objeto vazio faz os três campos falharem na validação habitual, e a rota mostra o formulário com 400 e as mensagens:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: em `validarItem`, começa pelo parâmetro. Segue as verificações pela ordem escrita e identifica o valor de cada `return`.

O modelo `views/item-novo.ejs` é o `reserva-nova.ejs` sem o campo do nome, a enviar para `/pedido/itens`:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: os `include` juntam os fragmentos escritos por ti. Entre eles, os valores entram com `<%=`, para o browser os receber como texto.

As rotas para mostrar o formulário e para receber o `POST`:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: `GET /pedido/item` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

A rota do `POST` valida como no tema anterior. A diferença está no que faz quando corre bem: em vez de criar uma reserva, junta o equipamento ao pedido desta sessão, em `req.session.pedido`. Da primeira vez, a sessão ainda não tem pedido nenhum, e o `req.session.pedido` é `undefined`: por isso o `if` cria-o, como um array vazio, antes do `push`. É neste momento que a sessão deixa de estar vazia, e o browser recebe o cookie. O item guarda o número do equipamento, e não o equipamento inteiro: o nome e a sala vêm sempre da lista dos equipamentos, que é a fonte de verdade.

A página do pedido mostra o que lá está. Uma pequena função junta a cada item o seu equipamento, para a página poder mostrar o nome, como a lista das reservas fazia no tema anterior:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: o ciclo percorre os itens do pedido. Para cada item, procura o equipamento pelo identificador e junta os dois numa linha. No fim, devolve o array das linhas.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// O pedido em curso: os equipamentos já juntos, a confirmação e o cancelamento.
app.get("/pedido", (req, res) => {
  const pedido = req.session.pedido || [];
  res.render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: "", erroNome: "" });
});
```

Leitura guiada: `GET /pedido` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

O `req.session.pedido || []` dá o pedido da sessão, ou um array vazio se ainda não houver pedido. Antes de abrir essa página, cria `views/pedido.ejs` com esta versão provisória completa. Mostra a lista, a ligação para juntar mais um equipamento e a mensagem do pedido vazio. Os botões de remoção, confirmação e cancelamento entram nos passos seguintes.

Antes de experimentares, prevê o que a página mostra com um pedido vazio e com dois equipamentos. Confere as duas situações depois de criares o modelo.

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

Leitura guiada: `linhasDoPedido` já juntou cada equipamento ao item da sessão. A vista mostra o nome, a sala, o dia e o tempo de cada linha. Se não houver linhas, mostra a mensagem do pedido vazio.

Abre o catálogo em duas janelas: uma normal e uma anónima. Na normal, junta o projetor e o portátil. Na anónima, abre `/pedido`: está vazio. Junta lá o monitor, e volta à normal: continua com os seus dois. São duas sessões, isoladas, uma para cada browser.

### Passo 3: o pedido no menu

O menu passa a mostrar quantos equipamentos tem o pedido, em todas as páginas. O número vem da sessão, e todas as rotas teriam de o passar ao `res.render`. Em vez disso, um middleware põe-no no **`res.locals`**, um objeto que o Express junta automaticamente aos dados de todos os modelos:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```js fragment
// Para todas as páginas: quantos equipamentos tem o pedido desta sessão.
// O res.locals põe o valor à disposição de todos os modelos, incluindo o cabeçalho.
app.use((req, res, next) => {
  const pedido = req.session.pedido;
  res.locals.itensNoPedido = pedido ? pedido.length : 0;
  next();
});
```

Leitura guiada: este middleware corre antes do elemento seguinte da fila. Identifica o que prepara e se chama `next()` ou termina com uma resposta.

Fica depois do middleware das sessões, porque lê o `req.session`, e antes das rotas, porque os modelos das rotas vão usar o valor. No cabeçalho, a ligação do menu passa a ser:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

```ejs
<a href="/pedido">O teu pedido (<%= itensNoPedido %>)</a>
```

Leitura guiada: o EJS calcula a expressão entre as marcas. Com `<%=`, o valor entra como texto e os carateres de HTML são escapados.

Mantém a ligação para `/pedido/item` que atualizaste no passo 2, no menu, na página inicial e na lista das reservas. A ligação para `/pedido` acrescenta a contagem; não substitui o acesso ao novo formulário.

### Passo 4: tirar do pedido

Cada equipamento do pedido ganha um botão para o tirar. O botão é um pequeno formulário `POST`, porque tirar muda o pedido, e o caminho leva a posição do equipamento na lista: `/pedido/itens/2/remocao` tira o segundo.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: `POST /pedido/itens/:posicao/remocao` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

A posição vem do pedido, por isso verifica-se como um identificador: tem de ser um inteiro, de 1 até ao número de equipamentos do pedido. O `splice(posicao - 1, 1)` tira do array um elemento, na posição indicada; o `- 1` é porque a página conta a partir de 1 e o array a partir de 0.

### Passo 5: confirmar e cancelar

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

Substitui agora o conteúdo provisório de `views/pedido.ejs` por esta versão completa, com os equipamentos, o botão de cada um, a confirmação com o nome e o cancelamento. Na confirmação, escreve um nome fictício.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: os `include` juntam os fragmentos escritos por ti. Entre eles, os valores entram com `<%=`, para o browser os receber como texto.

O ciclo é um `for` com contador, e não um `for...of`, porque a página precisa da posição de cada equipamento para o botão de remoção. A confirmação e o cancelamento só aparecem quando o pedido tem alguma coisa.

A confirmação valida o nome, cria uma reserva por equipamento e termina a sessão:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

Leitura guiada: em `erroDoNome`, começa pelo parâmetro. Segue as verificações pela ordem escrita e identifica o valor de cada `return`.

Na confirmação também pode chegar um pedido sem corpo, mesmo quando a sessão já tem equipamentos. A variável local `corpo` recebe `req.body`; se não existir, fica com um objeto vazio, como na validação do item. A `textoDoCampo` recebe então `undefined` para o nome e devolve texto vazio. A `erroDoNome` encontra o erro habitual, sem criar reservas nem terminar a sessão.

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

  // Sem corpo lido, o nome fica vazio e a validação devolve a sua mensagem.
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

Leitura guiada: `POST /pedido/confirmacao` escolhe esta função. Lê os dados antes da resposta e identifica o ponto onde o pedido termina.

Se o nome estiver errado, a resposta é a página do pedido outra vez, com o 400, o nome escrito e a mensagem, como no tema anterior. Se o pedido estiver vazio (o formulário não aparece, mas um pedido feito à mão pode chegar), a resposta é a página de erro. Quando tudo está certo, as reservas são criadas, a sessão é destruída, o cookie é apagado, e o browser vai para a lista das reservas.

O cancelamento é a rota da secção "Terminar a sessão": destrói a sessão sem criar reservas, e volta à página inicial.

### Passo 6: o servidor completo

O `server.js` no fim do exemplo:

Antes de experimentares, prevê o que esta parte faz no pedido ou no HTML da resposta. Confere a previsão com o resultado explicado a seguir.

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

  // Sem corpo lido, o nome fica vazio e a validação devolve a sua mensagem.
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

Leitura guiada: lê os dados iniciais, depois os middlewares pela ordem do ficheiro. Escolhe um pedido da tabela de resultados e segue só a rota que o recebe.

Os modelos novos são o `item-novo.ejs` do passo 2 e o `pedido.ejs` do passo 5. O `reserva-nova.ejs` e as duas rotas antigas de criação saíram no passo 2. O cabeçalho, a página inicial e a lista das reservas já têm as ligações para `/pedido/item`. As rotas de consulta `/reservas` e `/reservas/:id` continuam disponíveis.

### Passo 7: os resultados

| O que se faz | O que acontece |
| --- | --- |
| Abrir o catálogo pela primeira vez | Nenhum cookie: nada foi guardado na sessão |
| Juntar o projetor ao pedido | 303 para `/pedido`, com o `Set-Cookie` do `catalogo.sid`; o menu passa a "O teu pedido (1)" |
| Juntar o portátil | O pedido tem dois equipamentos; o cookie é o mesmo, com mais 30 minutos |
| Juntar um equipamento com o tempo 12 | 400, o formulário com a mensagem do tempo; o pedido continua com dois |
| Abrir `/pedido` numa janela anónima | O pedido está vazio: é outro browser, outra sessão |
| Tirar o primeiro equipamento | O pedido fica só com o portátil |
| Confirmar com o nome vazio | 400, a página do pedido com "Escreve o teu nome." |
| Confirmar com o nome | 303 para `/reservas`, com a reserva criada; o `Set-Cookie` apaga o cookie; o menu volta a "O teu pedido (0)" |
| Cancelar, na outra janela | 303 para a página inicial; o cookie é apagado, e o pedido dessa janela desaparece |
| Reiniciar o servidor com um pedido a meio | O pedido desaparece: as sessões estavam na memória do servidor |

## Observar os cookies no browser

Há três sítios onde vês os cookies e a sessão a trabalhar.

Faz estas observações apenas no catálogo local e nas sessões que criaste para o ensaio. Se o browser da escola impedir a edição de cookies, acompanha a demonstração do professor e regista as previsões e o que observas. A experiência individual fica por realizar quando tiveres acesso a um browser que a permita.

**O separador Rede.** Junta um equipamento ao pedido e clica no `POST` a `itens`. Nos cabeçalhos da resposta está o `Set-Cookie`, com o nome, o valor e os atributos. Depois clica no `GET` a `pedido` que veio a seguir: nos cabeçalhos do pedido está o `Cookie`, só com o nome e o valor. Repete com um pedido à página inicial: o cookie também vai, embora a página inicial não precise dele. O browser envia-o sempre.

**O armazenamento do browser.** Nas ferramentas de programador, o separador "Application" do Chrome ("Aplicação"; no Firefox, "Armazenamento") tem, à esquerda, a secção "Cookies", com uma entrada para `http://localhost:3000`. Lá está o `catalogo.sid`, com o valor e uma coluna para cada atributo: a data de expiração, o `HttpOnly` assinalado, o `SameSite` com `Lax`, e o `Secure` por assinalar. É também ali que se pode mudar ou apagar um cookie à mão, e é por isso que nada do que lá está pode ser de confiança.

**A consola.** No separador "Console", escreve `document.cookie` e carrega em Enter. É a forma de o JavaScript de uma página ler os cookies dessa página. O `catalogo.sid` não aparece: é o `HttpOnly` a funcionar.

## Erros frequentes

### Falta o SESSION_SECRET

O terminal mostra a mensagem do `server.js` e o servidor não arranca. Ou não há `SESSION_SECRET` no `.env`, ou está vazio, ou o servidor arrancou sem o `--env-file=.env` e não leu o ficheiro. Confirma as três coisas, por esta ordem.

### node: .env: not found

O servidor arrancou com o `--env-file=.env`, e não há `.env` na pasta onde o arrancaste. Copia o `.env.example` para `.env`, escreve lá o segredo, e arranca dentro da pasta do projeto. É o mesmo erro do laboratório de Linguagens de Programação.

### Todas as páginas dão 500, com Cannot read properties of undefined (reading 'pedido')

O `req.session` não existe: o middleware das sessões está abaixo do middleware que põe o número no `res.locals`, ou abaixo das rotas. Como esse middleware corre em todos os pedidos, nenhuma página funciona. A ordem certa: o registo, o `express.urlencoded`, a sessão, o `res.locals`, as rotas e o middleware final.

### O pedido desapareceu

Três causas possíveis, e só uma é um erro. O servidor reiniciou (com o `--watch`, basta guardar o `server.js`): as sessões estavam na memória. Passaram mais de 30 minutos desde a última mudança ao pedido: o cookie expirou. Ou estás noutra janela, anónima, ou noutro browser: é outra sessão. Nos três casos, o comportamento está certo.

### Duas janelas do mesmo browser partilham o pedido

Não é um erro. Duas janelas normais, ou dois separadores, do mesmo browser partilham os cookies, e por isso a sessão. Para teres duas sessões no mesmo computador, usa uma janela normal e uma anónima, ou dois perfis, ou dois browsers.

### O menu continua a mostrar o número antigo

A página no ecrã foi construída antes da mudança. Recarrega-a: o número vem da sessão, e cada página nova lê-o outra vez.

## Segurança: o que este tema já pede

- **O segredo fora do código e do Git.** No `.env`, com o `.env.example` a documentar o nome, e o servidor a recusar arrancar sem ele.
- **Os dados no servidor, só o identificador no cookie.** Nada do que está no cookie é de confiança, e o identificador é assinado.
- **Os atributos justificados.** `HttpOnly` sempre; `SameSite=Lax`; `Secure` com HTTPS, e `false` só em `localhost`; e uma expiração curta.
- **Nenhum cookie sem razão.** Com o `saveUninitialized: false`, só tem sessão quem guardou alguma coisa nela.
- **Terminar é destruir.** No fim de um pedido, a sessão é destruída no servidor, e não só o cookie apagado no browser.
- **Uma sessão não é uma autenticação.** Nada no catálogo confia num nome guardado na sessão, nem trata a presença do cookie como prova de identidade.
- **O `MemoryStore` é só para desenvolvimento.** Num servidor publicado, as sessões vão para um armazém próprio.
- **O que ainda falta.** O `SameSite=Lax` dificulta o CSRF, mas não é toda a defesa. O tema Erros e segurança web acrescenta a proteção própria contra o CSRF nos pedidos que mudam o estado da sessão.


## Palavras novas deste guia

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

## Verificar o que aprendeste

1. Porque é que uma variável no servidor não serve para guardar o pedido de cada pessoa?
2. Quem cria um cookie, quem o guarda, e quando é que ele viaja? Em que cabeçalhos?
3. Dá duas razões para o pedido não ir dentro do cookie.
4. O que é o texto que vem depois do ponto, no valor do cookie `catalogo.sid`? O que acontece se alguém mudar uma letra do identificador?
5. Para que serve o `saveUninitialized: false`? Quando é que o browser recebe o cookie pela primeira vez?
6. Explica, para cada atributo, de que ataque ou de que problema protege: `HttpOnly`, `SameSite=Lax`, `Secure`, a expiração.
7. Porque é que o `Secure` está `false` no catálogo, e o que muda num servidor publicado?
8. O que faz o `req.session.destroy`, e porque não chega apagar o cookie?
9. Uma colega diz: "a sessão sabe que sou eu, porque escrevi o meu nome no pedido". Está certa? Explica.
10. O que é o roubo de uma sessão? E a fixação? Diz uma defesa para cada um.

## O que vem a seguir

Faz o [laboratório](06-cookies-e-sessoes-laboratorio.md) e depois a [ficha de exercícios](06-cookies-e-sessoes-exercicios.md).

O próximo tema é Erros e segurança web. As páginas de erro do catálogo dizem pouco, de propósito. Mas a página de erro do próprio Express, a dos erros 500, mostra o caminho dos ficheiros e o código: o tema trata disso. Trata também dos segredos, dos registos no terminal, do escaping em mais sítios do que o conteúdo e os atributos. Do CSRF, a defesa que falta aos formulários que mudam a sessão. É o último tema antes da integração do módulo, em que o catálogo junta tudo o que foi feito até aqui.

![Rodapé](../imagens/rodape.png)
