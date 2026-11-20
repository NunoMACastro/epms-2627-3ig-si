![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: erros e segurança web

Preparas a biblioteca para falhar sem mostrar o que tem por dentro, e para recusar os formulários que não saíram das suas páginas. Os exercícios 1 a 6 são obrigatórios e fazem-se pela ordem em que aparecem. As respostas dos exercícios 1, 2, 5 e 6 vão para o `respostas-07.md`, um ficheiro de texto. Guarda-o na pasta de Sistemas de Informação, ao lado do projeto `biblioteca` e não dentro dele. Antes de cada resposta, escreve o número do exercício e, quando há itens, o do item, como 2.5. Entregas esse ficheiro e, da biblioteca, o `server.js`, a pasta `views` e o `.env.example`, mas nunca o `.env`, onde está o segredo. Para rever: o [guia do tema](../07-erros-e-seguranca-web.md).

## O cenário

O servidor da biblioteca vai passar a ser usado todos os dias, no balcão. Tem de estar preparado para falhar bem: uma página de erro que não revela nada e um registo útil no terminal. E todos os formulários que mudam alguma coisa têm de estar protegidos contra o CSRF.

Os exercícios 3 e 4 partem da biblioteca do fim da ficha do tema 06. O exercício 3 precisa da sessão, da página inicial, do formulário de empréstimo e da lista dos empréstimos. O exercício 4 precisa também dos livros vistos e do botão que apaga o histórico. O que te faltar, fazes com os exercícios 3 a 5 da [ficha do tema 05](05-formularios-e-validacao-exercicios.md) e os exercícios 3 a 5 da [ficha do tema 06](06-cookies-e-sessoes-exercicios.md). A devolução, do [desafio da ficha do tema 05](05-formularios-e-validacao-exercicios.md#a-devolução), continua opcional.

## Exercício 1: quem errou

Para cada situação na biblioteca do fim desta ficha, diz se é uma falha do pedido HTTP ou do servidor, o código, e o que vê a funcionária.

1. `GET /livros/abc`
2. Um empréstimo com o leitor 12, token válido e os restantes campos válidos
3. Um empréstimo enviado sem o campo `_csrf`
4. O modelo `livro.ejs` com `<%= livro.editora.nome %>`, e os livros não têm editora
5. Um empréstimo com um número de leitor de 200 000 algarismos, enviado sem passar pelo formulário
6. `GET /livros/disponiveis/extra`

Rever: [Quem errou: o pedido HTTP ou o servidor](../07-erros-e-seguranca-web.md#quem-errou-o-pedido-http-ou-o-servidor), [O middleware de erro](../07-erros-e-seguranca-web.md#o-middleware-de-erro), [O código que o erro traz e o número do menu](../07-erros-e-seguranca-web.md#o-código-que-o-erro-traz-e-o-número-do-menu) e [O token contra o CSRF](../07-erros-e-seguranca-web.md#o-token-contra-o-csrf).

<details>
<summary>Pista</summary>

Em cada situação, pergunta quem pode corrigir a causa: quem fez o pedido HTTP, mudando o que enviou, ou quem mantém a biblioteca, mudando o código.

</details>

## Exercício 2: o sítio do valor

Para cada linha de um modelo da biblioteca, com o valor indicado vindo de fora, diz se é segura ou perigosa, porquê e, se for perigosa, como a corrigias. Em todas, o valor entra com `<%=`.

1. `<p>Pesquisaste por <%= autor %></p>`, com `<b>Eça</b>`
2. `<input name="leitor" value=<%= leitor %>>`, com `1234 autofocus onfocus=alert(1)`
3. `<a href="<%= site %>">Site da editora</a>`, com `javascript:alert(1)`
4. `<script>const leitor = <%= leitor %>;</script>`, com `1234;alert(1)`
5. `<input name="titulo" value="<%= titulo %>">`, com `"><script>alert(1)</script>`

Rever: [O escaping depende do sítio](../07-erros-e-seguranca-web.md#o-escaping-depende-do-sítio) e [Escaping: o que vem de fora nunca vira HTML](../04-ejs-e-reutilizacao-no-servidor.md#escaping-o-que-vem-de-fora-nunca-vira-html).

<details>
<summary>Pista</summary>

Para cada linha, escreve o que o browser recebe depois de o `<%=` trocar os carateres que troca, como nas tabelas do guia, e vê onde acaba o valor.

</details>

## Exercício 3: o middleware de erro da biblioteca

Acrescenta à biblioteca o middleware de erro, no sítio certo. Regista no terminal a data, o pedido HTTP e o stack trace. Responde com o código 4xx do erro, quando ele trouxer um, e com o 500 nos restantes casos. Mostra sempre o `erro.ejs`, com uma mensagem tua.

A decisão: no catálogo, o middleware tinha de garantir o `itensNoPedido`, porque o cabeçalho o usa e um corpo grande demais falha antes do middleware que o prepara. De que valores precisa a página de erro da biblioteca, e de onde vem cada um? Escreve a resposta num comentário, junto do middleware de erro.

O formulário não deixa escrever um número de leitor de 200 000 algarismos. Para enviar esse empréstimo, usa este comando noutro terminal, com a biblioteca ligada. Parece-se com o do [passo 2 do guia](../07-erros-e-seguranca-web.md#passo-2-o-middleware-de-erro), mas envia o empréstimo à biblioteca e escreve no terminal o código e a página que recebe. Se a tua biblioteca não usa a porta 3001, troca-a no endereço:

```bash
node -e "fetch('http://localhost:3001/emprestimos', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'livro_id=1&leitor=' + '1'.repeat(200000) }).then((resposta) => { console.log(resposta.status); return resposta.text(); }).then((pagina) => console.log(pagina))"
```

Casos de teste:

- o empréstimo do item 5 do exercício 1, enviado com o comando: o comando escreve `413` e, por baixo, a tua página de erro, com o menu da biblioteca. No terminal da biblioteca, o teu middleware regista a data, `ERRO POST /emprestimos` e o stack trace, e por baixo não vem mais nenhum erro;
- o erro do item 4 do exercício 1, posto de propósito no `livro.ejs`. Ao abrires um livro, aparece "Erro no servidor", com o código 500 e nenhum caminho no código-fonte, e o stack trace fica no terminal. No fim, desfaz o erro no modelo.

Rever: [O middleware de erro](../07-erros-e-seguranca-web.md#o-middleware-de-erro), [O código que o erro traz e o número do menu](../07-erros-e-seguranca-web.md#o-código-que-o-erro-traz-e-o-número-do-menu) e [Passo 2: o middleware de erro](../07-erros-e-seguranca-web.md#passo-2-o-middleware-de-erro).

<details>
<summary>Pista</summary>

Se continua a aparecer a página do Express, com o stack trace, em vez da tua, olha para o terminal da biblioteca. Se lá não está a linha com a data e `ERRO` que o teu middleware escreve, procura esse caso nos erros frequentes do guia: [Continua a aparecer a página do Express, com o stack trace](../07-erros-e-seguranca-web.md#continua-a-aparecer-a-página-do-express-com-o-stack-trace). Se essa linha está lá e, por baixo, vem outro erro, é a própria página de erro que falha: lê esse segundo erro.

</details>

## Exercício 4: o token na biblioteca

Protege todos os `POST` da biblioteca com um token contra o CSRF, como o do catálogo. Há um token por sessão, que o `res.locals` põe à disposição dos modelos. Todos os formulários `POST` o levam num campo escondido, e uma verificação confere-o em todos os `POST`.

A decisão é onde se cria o token. No catálogo, havia um sítio só: o primeiro formulário que mudava a sessão. No percurso obrigatório, a biblioteca tem dois tipos de formulário `POST`, em páginas diferentes:

- o formulário de empréstimo, em `/emprestimos/novo`;
- o botão de apagar o histórico, na página inicial, só quando há livros vistos.

Se fizeste a devolução, do desafio da ficha do tema 05, tens um terceiro: o botão de devolução, um por empréstimo, na lista `/emprestimos`.

Para cada formulário que tens, decide em que rota chamas a função que cria o token.

Podes preparar o token noutros sítios, desde que cumpras os resultados esperados. Num comentário junto de cada sítio onde crias o token, justifica como essa escolha protege os formulários que tens.

Resultado esperado, com a biblioteca acabada de arrancar e por esta ordem. Faz cada linha numa janela anónima nova, sem outra janela anónima aberta, para o browser não levar o cookie da linha anterior:

| O que fazes | O que acontece |
| --- | --- |
| Abres a página inicial | No separador Rede, a resposta não tem `Set-Cookie` |
| Abres o formulário de empréstimo, apagas o valor do campo `_csrf`, como no [passo 6 do guia](../07-erros-e-seguranca-web.md#passo-6-os-resultados), e emprestas "Os Maias" ao leitor 1234 | 403 e "Pedido recusado"; a lista dos empréstimos continua vazia |
| Abres o formulário de empréstimo e emprestas "Os Maias" ao leitor 1234 | 303, e o empréstimo aparece na lista |
| Com o `novalidate` no `<form>` do `emprestimo-novo.ejs`, como na [matriz de falhas do guia](../07-erros-e-seguranca-web.md#passo-7-a-matriz-de-falhas), abres o formulário, envias "Mensagem" com o leitor 12, corriges para 5678 e envias outra vez. No fim, tiras o `novalidate` | Primeiro, 400 e o formulário com a mensagem do leitor; depois, 303 |
| Vês dois livros, voltas à página inicial, apagas o valor do campo `_csrf` e carregas em "Apagar o histórico" | 403 e "Pedido recusado"; a lista dos vistos continua lá |
| Vês dois livros, voltas à página inicial e carregas em "Apagar o histórico" | 303, e a página inicial já não tem a lista |
| Se tens a devolução: abres a lista dos empréstimos e registas a devolução do primeiro | 303, e o empréstimo aparece como devolvido; sem o valor do campo, 403 |

Nenhum destes pedidos HTTP deixa um erro no terminal.

Rever: [O token contra o CSRF](../07-erros-e-seguranca-web.md#o-token-contra-o-csrf) e [Passo 4: o token contra o CSRF](../07-erros-e-seguranca-web.md#passo-4-o-token-contra-o-csrf).

<details>
<summary>Pista</summary>

Se um formulário dá "Pedido recusado" logo no primeiro envio, procura esse caso nos erros frequentes do guia: [Todos os formulários dão "Pedido recusado"](../07-erros-e-seguranca-web.md#todos-os-formulários-dão-pedido-recusado).

</details>

<details>
<summary>Pista</summary>

Se a página inicial, sem livros vistos, já faz o browser receber um cookie da biblioteca, procura o que guarda alguma coisa na sessão nesse pedido HTTP.

</details>

<details>
<summary>Pista</summary>

Se o formulário que volta com a mensagem do leitor 12 dá 500, com `csrf is not defined` no terminal, vê os dois sítios onde o guia põe o token no `res.locals`.

</details>

## Exercício 5: a revisão de configuração

Uma colega mostrou-te este bocado do servidor dela. Encontra todos os problemas de segurança. No `respostas-07.md`, diz para cada um o que pode correr mal, e escreve a correção.

Podes agrupar problemas relacionados, explicando os riscos e as correções de cada um. O que não está no fragmento é como no teu servidor.

```js fragment
const SEGREDO = process.env.SESSION_SECRET || "biblioteca123";

app.use(session({
  secret: SEGREDO,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: false, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 },
}));

app.post("/emprestimos", (req, res) => {
  console.log("Empréstimo recebido:", req.body, "cookie:", req.headers.cookie);
  // ...
});

app.use((erro, req, res, next) => {
  res.status(500).send(`Erro: ${erro.message}`);
});
```

Rever: [O que se escreve no terminal](../07-erros-e-seguranca-web.md#o-que-se-escreve-no-terminal), [Os segredos](../07-erros-e-seguranca-web.md#os-segredos), [O middleware de erro](../07-erros-e-seguranca-web.md#o-middleware-de-erro), [O middleware e as suas opções](../06-cookies-e-sessoes.md#o-middleware-e-as-suas-opções) e [Os atributos do cookie](../06-cookies-e-sessoes.md#os-atributos-do-cookie).

<details>
<summary>Pista</summary>

Lê o fragmento por partes: o segredo, a sessão e o seu cookie, o que vai para o terminal e o que a funcionária vê quando há um erro. Em cada parte, procura também o que falta, e não só o que está escrito.

</details>

## Exercício 6: encontrar os erros

Um colega fez os exercícios 3 e 4, e a biblioteca dele tem dois problemas. O primeiro analisa-se a ler o código. O segundo reproduz-se numa cópia da tua biblioteca, com a rota dele no lugar da tua.

O primeiro: um `POST` sem o campo `_csrf` regista um empréstimo e recebe 303 para `/emprestimos`. Devia ser recusado com 403. O middleware de verificação está depois do `express.urlencoded`, das sessões e do `res.locals`, antes das rotas. O código dele é este, com um erro de propósito:

```js fragment
// Exercício 6: esta verificação tem um erro de propósito.
app.use((req, res, next) => {
  if (req.method !== "POST") {
    next();
    return;
  }
  const token = req.session.csrf;
  if (!req.body || req.body._csrf !== token) {
    res.status(403).render("erro", {
      titulo: "Pedido recusado",
      paginaAtiva: "",
      mensagem: "Este formulário já não é válido. Volta à página, recarrega-a e tenta outra vez.",
    });
    return;
  }
  next();
});
```

A biblioteca do colega acabou de arrancar, o livro 1 está disponível e este é o primeiro pedido HTTP. Não foi aberto nenhum formulário nem enviado um cookie. O pedido HTTP é `POST /emprestimos`, com `Content-Type: application/x-www-form-urlencoded` e o corpo `livro_id=1&leitor=1234`, sem `_csrf`. Os campos do empréstimo são válidos.

No `respostas-07.md`, explica porque é que a verificação deixa este `POST` passar para a rota, com os valores que ela compara. Escreve também a correção que o faz receber 403, sem perder a guarda do corpo: um `POST` cujo corpo o `express.urlencoded` não leu continua a ser recusado.

O segundo: noutra cópia, a primeira vez que a funcionária abre o formulário de empréstimo e o envia, recebe "Pedido recusado". O servidor não voltou a arrancar entre abrir o formulário e enviá-lo. Volta atrás, recarrega o formulário, envia outra vez, e funciona. A rota do formulário dele é esta:

```js fragment
app.get("/emprestimos/novo", (req, res) => {
  res.render("emprestimo-novo", {
    titulo: "Novo empréstimo",
    paginaAtiva: "",
    livros: livros.filter((livro) => livro.disponivel),
    valores: { livro_id: "", leitor: req.session.leitor || "" },
    erros: {},
  });
  prepararTokenCsrf(req, res);
});
```

No `respostas-07.md`, explica porque é que a primeira página não tinha o token, e a segunda tinha, e escreve a correção.

Rever: [O CSRF: o pedido HTTP que outro site faz em teu nome](../07-erros-e-seguranca-web.md#o-csrf-o-pedido-http-que-outro-site-faz-em-teu-nome), [O token contra o CSRF](../07-erros-e-seguranca-web.md#o-token-contra-o-csrf) e [Passo 4: o token contra o CSRF](../07-erros-e-seguranca-web.md#passo-4-o-token-contra-o-csrf).

<details>
<summary>Pista</summary>

No primeiro problema, escreve o valor de cada parte da condição do `if` neste pedido HTTP, uma de cada vez, e o que dá o `||`. No segundo, abre o código-fonte das duas páginas do formulário e compara o valor do campo `_csrf`; depois, segue o que a sessão tem em cada uma.

</details>

## Desafios

### O código de referência

Quando a página "Erro no servidor" aparece, a funcionária não tem nada para dizer ao técnico além de "deu erro". O middleware deve criar um código curto e aleatório para cada falha. Usa oito carateres hexadecimais, isto é, só os algarismos de 0 a 9 e as letras de a a f. Parte de quatro bytes aleatórios gerados com `randomBytes`: cada byte corresponde a dois carateres hexadecimais.

Escreve o código no terminal, ao lado da data, do pedido HTTP e do stack trace. Mostra o mesmo código apenas na página de erro 500: "Se o problema continuar, indica o código a3f9c2e1". Mantém a página dos erros 4xx como estava. Tira-o só do `randomBytes`, e não do erro nem da sessão. Por ser curto e aleatório, pode repetir-se; não garante uma referência única para sempre.

Resultado esperado: com o erro do item 4 do exercício 1 no `livro.ejs`, abres um livro duas vezes. Cada página "Erro no servidor" mostra um código de oito carateres, diferente da outra, e o mesmo código está no terminal, na linha da data dessa falha. `/livros/abc` continua a dar 400, "Pedido inválido", sem código, e o comando do exercício 3 continua a dar 413, com a tua página.

Responde num comentário, junto do middleware de erro: que diferença há entre mostrar esta referência e mostrar a mensagem interna do erro? E porque é que a referência ajuda quem o vai corrigir?

Rever: [O middleware de erro](../07-erros-e-seguranca-web.md#o-middleware-de-erro), [O que se escreve no terminal](../07-erros-e-seguranca-web.md#o-que-se-escreve-no-terminal) e [O token contra o CSRF](../07-erros-e-seguranca-web.md#o-token-contra-o-csrf).

<details>
<summary>Pista</summary>

Se a página e o terminal mostram códigos diferentes para a mesma falha, conta quantas vezes o teu middleware chama o `randomBytes`.

</details>

## Critérios de conclusão

- O `respostas-07.md` responde aos exercícios 1, 2, 5 e 6, com o número de cada resposta, e tem as duas correções do exercício 6.
- No exercício 3, as falhas dão a página de erro da biblioteca, com o código certo e sem caminhos do teu computador. O terminal fica com a data, o pedido HTTP e o stack trace.
- No exercício 4, a biblioteca dá o resultado de cada linha da tabela, cada uma numa janela nova, sem erros no terminal.
- As decisões dos exercícios 3 e 4 estão em comentários no `server.js`, junto do código que decidem.
- Se fizeste o desafio, a página 500 e o terminal mostram o mesmo código, as páginas dos 4xx ficaram como estavam, e um comentário responde às duas perguntas.

![Rodapé](../../imagens/rodape.png)
