![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: EJS e reutilização no servidor, no cinema da escola

Trabalho de casa comum a Sistemas de Informação e a Linguagens de Programação. Fazes uma aplicação com o que aprendeste nas duas disciplinas. Os filmes ficam no MongoDB Atlas, uma API em Express vai buscá-los com o Mongoose, e o EJS gera no servidor a página do cartaz. É um trabalho individual. Conta para as atitudes e valores, a autonomia e o empenho, nas duas disciplinas, e não para a nota da avaliação prática.

## O que precisas de saber

De Sistemas de Informação:

- o tema 03 e o [laboratório da papelaria](03-http-rotas-e-middleware-laboratorio-papelaria.md), com as rotas, os parâmetros de rota e de pesquisa, os códigos 400 e 404 e o middleware;
- o [guia do tema 04](04-ejs-e-reutilizacao-no-servidor.md), até à secção "As marcas do EJS", e as fases 1 e 2 do [laboratório](04-ejs-e-reutilizacao-no-servidor-laboratorio.md).

De Linguagens de Programação:

- o [laboratório do Atlas](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas-laboratorio.md), sobretudo as fases 2 e 3, em que inseriste os artigos e escreveste os primeiros filtros;
- o exemplo da [API da papelaria ligada ao Atlas](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/exemplos/acesso-a-dados/papelaria-api-com-atlas/README.md), com o Mongoose e o `.env`.

## Como trabalhar

Os exercícios 1 a 4 são obrigatórios e fazem-se por ordem, porque cada um usa o anterior. O desafio opcional fica para o fim.

Os exercícios 1 e 4 respondem-se no caderno. Os exercícios 2 e 3 fazem-se no computador, numa pasta nova chamada `cinema-da-escola`. Organiza-a como a API da papelaria ligada ao Atlas, com o `server.js`, a ligação à base e o modelo dentro de `src`, e a cadeia de ligação no `.env`. O projeto precisa de três pacotes: o Express, o Mongoose e o EJS.

A pasta `views` fica na raiz do projeto, ao lado do `package.json`, e não dentro de `src`. O Express procura os modelos na pasta `views` da pasta onde o terminal está quando arrancas o servidor. Com `npm run dev`, essa pasta é a raiz do projeto.

Os exercícios dizem o que a aplicação tem de fazer, e não como. Os nomes que a ficha dá são obrigatórios: a base `cinema`, a coleção `filmes`, os campos dos documentos e os caminhos das rotas. Os outros nomes escolhes tu.

Antes de abrires um pedido no browser, escreve o que esperas receber. Depois confirma a resposta e o código no separador Rede das ferramentas de programador.

## O cenário

O clube de cinema da escola projeta um filme por semana, às quartas-feiras à tarde, no auditório. Cada filme tem um número, o título, o género, a duração em minutos e a idade mínima que o clube definiu para o ver. Tem também a sessão, embutida, com o dia e a hora. São estes oito:

```js
[
  { numero: 1, titulo: "Shrek", genero: "Animação", duracaoMinutos: 90, idadeMinima: 6, sessao: { dia: "4 de novembro", hora: "15:30" } },
  { numero: 2, titulo: "Regresso ao Futuro", genero: "Ficção científica", duracaoMinutos: 116, idadeMinima: 12, sessao: { dia: "11 de novembro", hora: "15:30" } },
  { numero: 3, titulo: "Os Goonies", genero: "Aventura", duracaoMinutos: 114, idadeMinima: 12, sessao: { dia: "18 de novembro", hora: "15:30" } },
  { numero: 4, titulo: "Toy Story", genero: "Animação", duracaoMinutos: 81, idadeMinima: 6, sessao: { dia: "25 de novembro", hora: "15:30" } },
  { numero: 5, titulo: "Matrix", genero: "Ficção científica", duracaoMinutos: 136, idadeMinima: 14, sessao: { dia: "2 de dezembro", hora: "15:00" } },
  { numero: 6, titulo: "Jumanji", genero: "Aventura", duracaoMinutos: 104, idadeMinima: 12, sessao: { dia: "9 de dezembro", hora: "15:30" } },
  { numero: 7, titulo: "O Rei Leão", genero: "Animação", duracaoMinutos: 88, idadeMinima: 6, sessao: { dia: "16 de dezembro", hora: "15:30" } },
  { numero: 8, titulo: "Interstellar", genero: "Ficção científica", duracaoMinutos: 169, idadeMinima: 12, sessao: { dia: "6 de janeiro", hora: "14:30" } }
]
```

## Exercício 1: os filmes no Atlas

No teu cluster do Atlas, cria a base de dados `cinema`, com a coleção `filmes`. Insere os oito filmes de uma só vez, como inseriste os artigos da papelaria, e confirma que a coleção ficou com oito documentos.

Depois escreve, na barra de consultas do Atlas, um filtro para cada pergunta. Regista no caderno o filtro e os títulos dos filmes que aparecem.

1. Que filmes são de animação?
2. Que filmes pode ver um aluno de 12 anos?
3. Que filmes de ficção científica pode ver um aluno de 12 anos?

Antes de executares a pergunta 2, decide se um aluno de 12 anos pode ver um filme com a idade mínima de 12. A tua resposta escolhe o operador.

## Exercício 2: a API dos filmes

Constrói a API do cinema, com os filmes lidos da base que criaste no exercício 1. A API responde sempre em JSON e escreve no terminal cada pedido que chega. A tabela diz o que cada pedido tem de responder, e os textos dos erros são estes, à letra.

| Pedido | Código | Resposta |
| --- | --- | --- |
| `/api/estado` | 200 | `{"estado":"ok","aplicacao":"Cinema da escola"}` |
| `/api/filmes` | 200 | Os oito filmes |
| `/api/filmes?genero=Animação` | 200 | Os três filmes de animação |
| `/api/filmes?genero=Musical` | 200 | `[]` |
| `/api/filmes?idade=12` | 200 | Os filmes da pergunta 2 do exercício 1 |
| `/api/filmes?idade=doze` | 400 | `{"erro":"A idade tem de ser um número inteiro maior do que 0"}` |
| `/api/filmes?idade=0` | 400 | O mesmo erro |
| `/api/filmes?genero=Ficção científica&idade=12` | 200 | Os filmes da pergunta 3 do exercício 1 |
| `/api/filmes/3` | 200 | Os Goonies |
| `/api/filmes/9` | 404 | `{"erro":"Não existe o filme 9"}` |
| `/api/filmes/abc` | 400 | `{"erro":"O número do filme tem de ser um número inteiro positivo"}` |
| `/nao-existe` | 404 | `{"erro":"Rota não encontrada"}` |

Na API da papelaria ligada ao Atlas, a rota de um artigo ainda lia de um array. Aqui não há array: todas as rotas leem da base, e a rota de um filme procura o número no campo `numero` dos documentos.

Na barra de endereço do browser, podes escrever os acentos e os espaços, como em `?genero=Ficção científica`. O browser codifica-os antes de enviar o pedido, e o Express devolve-os ao teu código como os escreveste.

Quando a tabela estiver toda certa, prevê quantos filmes vêm com `?idade=13` e com `?idade=14`. Escreve a previsão no caderno, com a razão, e só depois experimenta.

## Exercício 3: o cartaz

Acrescenta à aplicação o cartaz do clube: uma página em `/cartaz`, e não JSON, gerada no servidor com o EJS a partir dos filmes da base. Cada filme aparece numa linha da lista, assim:

```text
Shrek (Animação, 90 minutos, a partir dos 6 anos): 4 de novembro, às 15:30
```

O título da página é "Cartaz". Com `?genero=Animação`, a página mostra só os filmes de animação, e o título passa a "Cartaz: Animação". Os valores entram na página com a marca `<%= %>`.

Experimenta `/cartaz`, `/cartaz?genero=Aventura` e `/cartaz?genero=Musical`. Com `Musical`, a página mostra só o título, como a lista vazia da fase 2 do laboratório.

## Exercício 4: o que o browser recebe

Responde no caderno.

1. Antes de abrires o código-fonte de `/cartaz?genero=Aventura`, escreve o HTML que esperas encontrar dentro do `<ul>`. Depois abre o código-fonte e compara. Que partes do teu modelo não aparecem lá, e porquê?
2. No teu código, que linha decide que filmes aparecem no cartaz, e que linha decide como cada filme aparece? Diz, para cada uma, se está na rota ou no modelo.
3. Compara o filtro que escreveste no Atlas para a pergunta 3 do exercício 1 com o que o teu servidor passa ao Mongoose no pedido `/api/filmes?genero=Ficção científica&idade=12`. O que é igual, e de onde vem cada valor no servidor?

## Apoio

- Exercício 1: Os filtros com duas condições e os operadores de comparação estão na fase 3 do laboratório do Atlas.
- Exercício 2: Começa pela lista sem filtros, depois acrescenta um filtro de cada vez, e só no fim os dois juntos. Um filtro é um objeto. Pensa em como o construir quando o pedido traz um parâmetro, os dois ou nenhum.
- Exercício 2: Se um pedido com letras em vez de números responder com uma página de erro que fala de `CastError`, o valor do pedido chegou à base sem ser verificado.
- Exercício 2: O `find` devolve sempre uma lista, mesmo quando só um documento cumpre o filtro.
- Exercício 3: A rota do cartaz vai buscar os filmes como a lista da API e responde como a rota da fase 2 do laboratório. Se aparecer `Failed to lookup view`, a mensagem diz em que pasta o Express procurou o modelo.
- Exercício 4: Põe o código-fonte da página e o teu modelo lado a lado. Na maior parte dos browsers, o código-fonte abre-se com Ctrl+U.

## Desafio opcional

Este desafio é opcional. Faz primeiro os exercícios 1 a 4.

**Os três filmes mais longos.** Acrescenta à API o pedido `/api/filmes/mais-longos`, que responde com os três filmes de maior duração, do mais longo para o mais curto. No Atlas, fizeste o mesmo na fase 5 do laboratório, com a ordenação e o limite. Procura na [documentação do Mongoose](https://mongoosejs.com/docs/queries.html) como se escrevem no servidor.

Quando o pedido funcionar, confirma que `/api/filmes/3` continua a responder com Os Goonies. Se `/api/filmes/mais-longos` responder 400, lê a mensagem e descobre que rota respondeu ao pedido.

## Critérios de conclusão

- A base `cinema` tem a coleção `filmes` com os oito filmes, e o caderno tem os três filtros do exercício 1, com os títulos de cada resposta.
- A API responde a todos os pedidos da tabela do exercício 2, com os códigos e os textos certos, e lê os filmes da base em todas as rotas.
- O cartaz mostra os filmes da base, com e sem o filtro do género, e com o título certo.
- O caderno tem as respostas do exercício 4.
- A cadeia de ligação está só no `.env`, e o `.env` não sai do teu computador.

## Entrega

Entregas, pelo meio e no prazo que o professor indicar, a pasta `cinema-da-escola` e as respostas dos exercícios 1 e 4, escritas no caderno ou num ficheiro de texto. A pasta leva o `src`, a pasta `views`, o `package.json`, o `package-lock.json`, o `.env.example` e o `.gitignore`.

Não entregues a pasta `node_modules` nem o ficheiro `.env`. O `.env` tem a palavra-passe da tua base de dados, e quem a tiver entra nos teus dados.

## Autoavaliação

No fim, responde por escrito:

1. Que pedido da tabela do exercício 2 te deu mais trabalho, e o que descobriste para o pôr a funcionar?
2. Consegues explicar, sem o código à frente, o caminho do pedido `/cartaz?genero=Aventura`, do browser à rota, da rota ao Atlas, e de volta ao browser?
3. O que ainda não percebeste bem? Escreve uma dúvida concreta, para levares à aula.

![Rodapé](../imagens/rodape.png)
