![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: erros e segurança web

Sétimo tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](07-erros-e-seguranca-web.md) e de fazeres o [laboratório](07-erros-e-seguranca-web-laboratorio.md). Os exercícios 1, 2, 5 e 6 fazem-se em papel; os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior, com os empréstimos e os livros vistos recentemente.

## Objetivo e contexto

O servidor da biblioteca vai passar a ser usado todos os dias, no balcão, e tem de estar preparado para falhar bem: uma página de erro que não revela nada, um registo útil no terminal, um segredo que não se adivinha, e todos os formulários que mudam alguma coisa protegidos contra o CSRF. Pelo caminho, tens de tomar decisões que o catálogo do guia não tomou: o que a página de erro da biblioteca precisa de ter garantido, e em que páginas se cria o token, quando os formulários que mudam a sessão aparecem em sítios diferentes.

## Como trabalhar

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o que esperas, e só depois experimenta. Para provocar falhas, usa as formas do laboratório: um erro posto de propósito num modelo, o comando do `fetch` com um corpo grande, e o separador "Elements" para mexer no campo escondido.

Se o teu servidor da biblioteca não tiver tudo o que a ficha anterior pedia, os exercícios 3 e 4 só precisam da sessão, da página inicial, do formulário de empréstimo e da lista dos empréstimos.

Tempo previsto: 70 minutos para os exercícios 1 a 6.

## Exercício 1: quem errou

Guia: secções "Quem errou: o pedido ou o servidor" e "O middleware de erro".

Para cada situação na biblioteca do fim desta ficha, diz se é uma falha do pedido ou do servidor, o código, e o que vê a funcionária.

1. `GET /livros/abc`
2. Um empréstimo com o leitor 12
3. Um empréstimo enviado sem o campo `_csrf`
4. O modelo `livro.ejs` com `<%= livro.editora.nome %>`, e os livros não têm editora
5. Um empréstimo com um número de leitor de 200 000 algarismos
6. `GET /livros/disponiveis/extra`

## Exercício 2: o sítio do valor

Guia: secção "O escaping depende do sítio".

Para cada linha de um modelo da biblioteca, com o valor indicado vindo de fora, diz se é segura ou perigosa, porquê, e como a corrigias. Em todas, o valor entra com `<%=`.

1. `<p>Pesquisaste por <%= autor %></p>`, com `<b>Eça</b>`
2. `<input name="leitor" value=<%= leitor %>>`, com `1234 autofocus onfocus=alert(1)`
3. `<a href="<%= site %>">Site da editora</a>`, com `javascript:alert(1)`
4. `<script>const leitor = <%= leitor %>;</script>`, com `1234;alert(1)`
5. `<input name="titulo" value="<%= titulo %>">`, com `"><script>alert(1)</script>`

## Exercício 3: o middleware de erro da biblioteca

Guia: secção "O middleware de erro" e exemplo guiado, passo 2.

Acrescenta à biblioteca o middleware de erro, no sítio certo: regista no terminal a data, o pedido e o stack trace, responde com o código 4xx do erro quando ele trouxer um, e com o 500 em tudo o resto, sempre com a página `erro.ejs` da biblioteca e uma mensagem tua.

A decisão: no catálogo, o middleware tinha de garantir o `itensNoPedido`, porque o cabeçalho o usa. A página de erro da biblioteca precisa de algum valor do `res.locals`? Vê o que o teu `erro.ejs` e o teu cabeçalho usam, decide, e escreve no caderno a razão. Confirma a tua decisão com o pedido de 200 000 algarismos do exercício 1.

Depois, provoca o erro do exercício 1, número 4, e confirma: a página "Erro no servidor", o código 500, nenhum caminho no código-fonte, e o stack trace no terminal. Desfaz o erro no modelo.

## Exercício 4: o token na biblioteca

Guia: secção "O CSRF" e exemplo guiado, passo 4.

Protege todos os pedidos `POST` da biblioteca com um token contra o CSRF, como no catálogo: a função que o cria, a linha no middleware do `res.locals`, a verificação para todos os `POST`, e o campo escondido em todos os formulários `POST`.

A decisão é onde se cria o token. No catálogo, havia um sítio só: o primeiro formulário que mudava a sessão. A biblioteca tem três tipos de formulário `POST`, em três páginas diferentes:

- o formulário de empréstimo, em `/emprestimos/novo`;
- o botão de devolução, um por empréstimo, na lista `/emprestimos`;
- o botão de apagar o histórico, na página inicial, só quando há livros vistos.

Para cada um, decide em que rota chamas a função que cria o token. Pensa em duas situações: uma funcionária que abre a lista dos empréstimos noutro computador, sem nunca ter aberto o formulário de empréstimo; e alguém que viu dois livros e volta à página inicial para apagar o histórico. Escreve as tuas decisões no caderno.

**Resultado esperado:** os três formulários funcionam; cada um, com o campo `_csrf` apagado nas ferramentas de programador, dá "Pedido recusado" com o 403; e a página inicial sem livros vistos não cria cookie nenhum.

## Exercício 5: a revisão de configuração

Guia: secções "O que se escreve no terminal", "Os segredos" e "Segurança: o que este tema junta".

Uma colega mostrou-te este bocado do servidor dela. Encontra todos os problemas de segurança, diz para cada um o que pode correr mal, e escreve a correção.

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

## Exercício 6: encontrar os erros

Guia: secções "O CSRF" e "Erros frequentes". Os dois erros deste exercício não estão nos erros frequentes do guia.

Um colega fez os exercícios 3 e 4, e a biblioteca dele tem dois problemas.

O primeiro: todos os formulários dão "Erro no servidor", com o código 500, e o terminal mostra `TypeError: Cannot read properties of undefined (reading 'csrf')`. O colega pôs o middleware de verificação do token logo a seguir ao middleware de registo, no topo do ficheiro.

1. O que é que está `undefined`, e porquê?
2. Porque é que o resultado é um 500, e não um 403?
3. Onde deve ficar a verificação, e depois de que dois middlewares?

O segundo: a primeira vez que a funcionária abre o formulário de empréstimo e o envia, recebe "Pedido recusado". Volta atrás, recarrega o formulário, envia outra vez, e funciona. A rota do formulário dele é esta:

```js fragment
app.get("/emprestimos/novo", (req, res) => {
  res.render("emprestimo-novo", {
    titulo: "Novo empréstimo",
    livros: livros.filter((livro) => livro.disponivel),
    valores: { livro_id: "", leitor: req.session.leitor || "" },
    erros: {},
  });
  prepararTokenCsrf(req, res);
});
```

4. Porque é que a primeira página não tinha o token, e a segunda tinha?
5. Qual é a correção?

## Para ires mais longe

Este exercício é opcional e não conta para o tempo da ficha.

**O código de referência.** Quando a página "Erro no servidor" aparece, a funcionária não tem nada para dizer ao técnico além de "deu erro". Faz com que o middleware de erro crie um código curto e aleatório para cada falha (por exemplo, oito carateres com o `randomBytes`), o escreva no terminal ao lado do stack trace, e o mostre na página: "Se o problema continuar, indica o código a3f9c2e1". Decide: este código revela alguma coisa sobre o servidor? E porque é que ajuda quem o vai corrigir?

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1, 2, 5 e 6, as decisões dos exercícios 3 e 4, e a pasta da biblioteca: o `server.js`, a pasta `views` e o `.env.example`. Não entregues o `.env` nem a pasta `node_modules`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: porque é que uma página de outro site não consegue fazer um empréstimo na biblioteca em nome da funcionária.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
