![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: erros e segurança web

Sétimo tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](07-erros-e-seguranca-web.md) e de fazeres o [laboratório](07-erros-e-seguranca-web-laboratorio.md). Os exercícios 1, 2, 5 e 6 fazem-se em papel. Os outros, no computador, sobre o servidor da biblioteca da ficha do tema anterior, com os empréstimos e os livros vistos recentemente.

Avanças ao teu ritmo. O que não acabares na aula, acabas em casa ou na aula seguinte.

## O que precisas de saber

O [guia](07-erros-e-seguranca-web.md) e o [laboratório](07-erros-e-seguranca-web-laboratorio.md) deste tema.

## Objetivo e contexto

O servidor da biblioteca vai passar a ser usado todos os dias, no balcão. Tem de estar preparado para falhar bem: uma página de erro que não revela nada, um registo útil no terminal, um segredo que não se adivinha. Todos os formulários que mudam alguma coisa protegidos contra o CSRF. Pelo caminho, tens de tomar decisões que o catálogo do guia não tomou: o que a página de erro da biblioteca precisa de ter garantido. Em que páginas se cria o token, quando os formulários que mudam a sessão aparecem em sítios diferentes.

## Como trabalhar

Os exercícios 1 a 6 são o percurso obrigatório. Faz o desafio opcional depois. Guarda cada exercício numa cópia da tua pasta `biblioteca`, para poderes voltar à versão anterior.

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o que esperas. E só depois experimenta. Para provocar falhas, usa as formas do laboratório: um erro posto de propósito num modelo, o comando do `fetch` com um corpo grande. O separador "Elements" para mexer no campo escondido.

Podes começar o exercício 3 com a sessão, a página inicial, o formulário de empréstimo e a lista dos empréstimos. Para completar o exercício 4, precisas também do histórico dos livros vistos e do botão que o apaga, da ficha anterior. A devolução continua opcional.


## Exercício 1: quem errou

Guia: secções "Quem errou: o pedido ou o servidor" e "O middleware de erro".

Para cada situação na biblioteca do fim desta ficha, diz se é uma falha do pedido ou do servidor, o código, e o que vê a funcionária.

1. `GET /livros/abc`
2. Um empréstimo com o leitor 12, token válido e os restantes campos válidos
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

Acrescenta à biblioteca o middleware de erro no sítio certo. Regista no terminal a data, o pedido e o stack trace. Responde com o código 4xx do erro, quando ele trouxer um. Usa 500 nos restantes casos. Mostra sempre `erro.ejs` com uma mensagem tua.

A decisão: no catálogo, o middleware tinha de garantir o `itensNoPedido`, porque o cabeçalho o usa. A página de erro da biblioteca precisa de algum valor do `res.locals`? Vê o que o teu `erro.ejs` e o teu cabeçalho usam, decide, e escreve no caderno a razão. Confirma a tua decisão com o pedido de 200 000 algarismos do exercício 1.

Depois, provoca o erro do exercício 1, número 4, e confirma: a página "Erro no servidor", o código 500, nenhum caminho no código-fonte, e o stack trace no terminal. Desfaz o erro no modelo.

## Exercício 4: o token na biblioteca

Guia: secção "O CSRF" e exemplo guiado, passo 4.

Protege todos os pedidos `POST` da biblioteca com um token contra CSRF. Cria a função que prepara o token e a linha correspondente no middleware do `res.locals`. Acrescenta a verificação para todos os `POST`. Inclui o campo escondido em todos os formulários `POST`.

A decisão é onde se cria o token. No catálogo, havia um sítio só: o primeiro formulário que mudava a sessão. No percurso obrigatório, a biblioteca tem dois tipos de formulário `POST`, em páginas diferentes. Se fizeste o desafio da devolução do tema 5, tens também esse terceiro tipo:

- o formulário de empréstimo, em `/emprestimos/novo`;
- o botão de devolução, um por empréstimo, na lista `/emprestimos`, apenas se fizeste esse desafio opcional;
- o botão de apagar o histórico, na página inicial, só quando há livros vistos.

Para cada formulário que tens, decide em que rota chamas a função que cria o token. Pensa numa funcionária que abre o formulário de empréstimo noutro computador e em alguém que viu dois livros e volta à página inicial para apagar o histórico. Se tens a devolução, considera também quem abre diretamente a lista dos empréstimos, sem passar pelo formulário de empréstimo. Escreve as tuas decisões no caderno.

Podes preparar o token noutras localizações, desde que cumpras os resultados esperados. Justifica como cada escolha protege os formulários que tens.

**Resultado esperado:** o formulário de empréstimo e o de apagar o histórico funcionam. Cada um, com o campo `_csrf` apagado nas ferramentas de programador, dá "Pedido recusado" com o 403. A página inicial sem livros vistos não cria cookie nenhum. Estes testes completam o percurso obrigatório. Se tens o botão de devolução, confirma também que funciona com o token e dá 403 sem ele.

## Exercício 5: a revisão de configuração

Guia: secções "O que se escreve no terminal", "Os segredos" e "Segurança: o que este tema junta".

Uma colega mostrou-te este bocado do servidor dela. Encontra todos os problemas de segurança, diz para cada um o que pode correr mal, e escreve a correção.

Revê a tua análise para completar os aspetos que faltem. Podes agrupar problemas relacionados, explicando os riscos e as correções de cada um.

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

Um colega fez os exercícios 3 e 4, e a biblioteca dele tem dois problemas. Analisa cada um numa cópia diferente da biblioteca, para um erro não interferir com o outro.

O primeiro: um pedido sem o campo `_csrf` regista um empréstimo e recebe 303 para `/emprestimos`. Devia ser recusado com 403. O middleware de verificação está depois do `express.urlencoded`, das sessões e do `res.locals`, antes das rotas. O código dele é este, com um erro de propósito:

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

Analisa este caso em papel. A cópia acabou de arrancar, o livro 1 está disponível e este é o primeiro pedido. Não foi aberto nenhum formulário nem enviado um cookie. O pedido é `POST /emprestimos`, com `Content-Type: application/x-www-form-urlencoded` e o corpo `livro_id=1&leitor=1234`, sem `_csrf`. Os campos do empréstimo são válidos. Estas condições isolam o problema da verificação.

1. Que valores são comparados neste pedido?
2. Porque é que a verificação deixa o pedido passar para a rota?
3. Como a corrigias para este pedido receber 403, conservando o tratamento de um corpo que não foi preparado?

O segundo: noutra cópia, a primeira vez que a funcionária abre o formulário de empréstimo e o envia, recebe "Pedido recusado". Volta atrás, recarrega o formulário, envia outra vez, e funciona. A rota do formulário dele é esta:

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

4. Porque é que a primeira página não tinha o token, e a segunda tinha?
5. Qual é a correção?

## Apoio

- Exercício 1: Pergunta quem poderia corrigir a causa: quem envia ou quem mantém.
- Exercício 2: Observa o contexto em que o valor entra e os carateres que ficam intactos.
- Exercício 3: Segue um erro que acontece antes do middleware dos dados da página.
- Exercício 4: Abre cada página como se fosse a primeira visita de uma sessão.
- Exercício 5: Revê segredo, cookie, registos e resposta ao utilizador separadamente.
- Exercício 6: No primeiro caso, segue os valores lidos e o resultado da condição. No segundo, segue a ordem entre criar o token e construir a página.

## Desafio opcional

Este exercício é opcional. Faz primeiro os exercícios 1 a 6.

**O código de referência.** Quando a página "Erro no servidor" aparece, a funcionária não tem nada para dizer ao técnico além de "deu erro". O middleware deve criar um código curto e aleatório para cada falha. Usa oito carateres em representação hexadecimal, que usa os algarismos de 0 a 9 e as letras de a a f. Parte de quatro bytes aleatórios gerados com `randomBytes`: cada byte corresponde a dois carateres hexadecimais.

Escreve o código no terminal, ao lado da data, do pedido e do stack trace. Mostra o mesmo código apenas na página de erro 500: "Se o problema continuar, indica o código a3f9c2e1". Mantém a página dos erros 4xx como estava. O código não deve conter detalhes internos do erro, dados da sessão nem credenciais de acesso. Por ser curto e aleatório, pode repetir-se; não garante uma referência única para sempre.

Decide: que diferença há entre mostrar esta referência e mostrar a mensagem interna do erro? E porque é que a referência ajuda quem o vai corrigir?

## Critérios de conclusão

- Os exercícios obrigatórios estão resolvidos, com as decisões pedidas por escrito.
- O servidor responde aos casos de teste do enunciado.
- Cada erro encontrado tem um caso reproduzível e uma explicação da causa.
- A entrega inclui os ficheiros pedidos e exclui `node_modules` e segredos.

## Entrega


Entrega as respostas dos exercícios 1, 2, 5 e 6, as decisões dos exercícios 3 e 4. A pasta da biblioteca: o `server.js`, a pasta `views` e o `.env.example`. Não entregues o `.env` nem a pasta `node_modules`.

## Autoavaliação

No fim, responde por escrito:

- O que consigo explicar sem ajuda: porque é que uma página de outro site não consegue fazer um empréstimo na biblioteca em nome da funcionária.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
