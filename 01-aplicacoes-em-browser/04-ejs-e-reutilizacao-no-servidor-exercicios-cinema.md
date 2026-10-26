![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: EJS e reutilização no servidor, no cinema da escola

Trabalho de casa comum a Sistemas de Informação e a Linguagens de Programação. Constróis, a partir de uma pasta vazia, a aplicação do clube de cinema da escola. Um seed põe os filmes no MongoDB Atlas, uma API em Express lê-os com o Mongoose, e o EJS gera no servidor a página do cartaz.

Os exercícios 1, 2, 4 e 5 dão-te o código todo, com a explicação de cada parte. Nos exercícios 3, 6 e 7 trabalhas sozinho. É um trabalho individual. Conta para as atitudes e valores, a autonomia e o empenho, nas duas disciplinas, e não para a nota da avaliação prática.

## O que precisas de saber

Não precisas de nenhum projeto anterior: começas numa pasta vazia. Precisas destas três coisas:

- o Node.js 22 ou mais recente, com o npm, e um editor, como o VS Code;
- a tua conta no MongoDB Atlas, com um cluster, um utilizador da base de dados com a sua palavra-passe e o endereço IP do teu computador autorizado;
- internet, porque a base de dados está no Atlas.

Se ainda não tens a conta, o cluster ou o utilizador, a fase 1 do [laboratório do Atlas de LP](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas-laboratorio.md) mostra como os criar. Se quiseres rever a teoria, tens os guias dos temas [03](03-http-rotas-e-middleware.md) e [04](04-ejs-e-reutilizacao-no-servidor.md) de Sistemas de Informação.

## Como trabalhar

Faz os exercícios por ordem, porque cada um usa o que o anterior construiu. O desafio opcional fica para o fim.

Nos exercícios com código, escreve cada ficheiro como está na ficha e lê a explicação que vem a seguir antes de o pores a correr. Antes de cada experiência, escreve no caderno o que esperas ver. Depois compara com o que aparece.

Os nomes da ficha são obrigatórios: a pasta `cinema-da-escola`, a base `cinema`, a coleção `filmes`, os campos dos documentos, os ficheiros e os caminhos das rotas.

No browser, confirma o código de cada resposta no separador Rede das ferramentas de programador. Na maior parte dos browsers, as ferramentas abrem-se com F12, ou com Cmd+Option+I no Mac.

As perguntas marcadas com "No caderno" respondem-se por escrito, no caderno ou num ficheiro de texto, e entregam-se com o projeto.

## O cenário

O clube de cinema da escola projeta um filme por semana, às quartas-feiras à tarde, no auditório. Cada filme tem um número, o título, o género, a duração em minutos e a idade mínima que o clube definiu para o ver. Tem também a sessão, com o dia e a hora.

| Número | Título | Género | Duração | Idade mínima | Sessão |
| ---: | --- | --- | ---: | ---: | --- |
| 1 | Shrek | Animação | 90 | 6 | 4 de novembro, 15:30 |
| 2 | Regresso ao Futuro | Ficção científica | 116 | 12 | 11 de novembro, 15:30 |
| 3 | Os Goonies | Aventura | 114 | 12 | 18 de novembro, 15:30 |
| 4 | Toy Story | Animação | 81 | 6 | 25 de novembro, 15:30 |
| 5 | Matrix | Ficção científica | 136 | 14 | 2 de dezembro, 15:00 |
| 6 | Jumanji | Aventura | 104 | 12 | 9 de dezembro, 15:30 |
| 7 | O Rei Leão | Animação | 88 | 6 | 16 de dezembro, 15:30 |
| 8 | Interstellar | Ficção científica | 169 | 12 | 6 de janeiro, 14:30 |

No fim, a pasta do projeto fica assim:

```text
cinema-da-escola/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── node_modules/
├── src/
│   ├── server.js
│   ├── seed.js
│   ├── db/
│   │   └── mongoose.js
│   └── models/
│       └── filme.model.js
└── views/
    └── cartaz.ejs
```

## Exercício 1: o projeto, de raiz

1. Cria uma pasta chamada `cinema-da-escola`, fora de qualquer outro projeto, e abre-a no VS Code. Abre um terminal dentro dela, no menu Terminal, com "New Terminal".
2. Cria o projeto e instala os três pacotes de que a aplicação precisa:

   ```bash
   npm init -y
   npm install express mongoose ejs
   ```

   O `npm init -y` cria o `package.json`, a ficha de identidade do projeto, com as respostas por omissão. O `npm install` descarrega os pacotes para a pasta `node_modules` e regista-os no `package.json`. As versões exatas que descarregou ficam no `package-lock.json`. O Express é o servidor, o Mongoose fala com o MongoDB, e o EJS gera as páginas.

3. Abre o `package.json` e deixa-o assim. Mudas duas coisas: o `"type"` passa de `"commonjs"` a `"module"`, e o script `"test"` dá lugar aos três scripts da aplicação. O resto já lá está, e as versões dos pacotes podem ser mais recentes do que estas.

   ```json
   {
     "name": "cinema-da-escola",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "start": "node src/server.js",
       "dev": "node --watch --env-file=.env src/server.js",
       "seed": "node --env-file=.env src/seed.js"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "type": "module",
     "dependencies": {
       "ejs": "^7.0.2",
       "express": "^5.3.0",
       "mongoose": "^9.11.4"
     }
   }
   ```

   Leitura guiada: o `"type": "module"` deixa usar o `import` e o `export` nos ficheiros do projeto. Os três scripts correm-se com `npm run` e o nome. O `npm run dev` arranca o servidor e volta a arrancá-lo sempre que gravas um ficheiro, por causa do `--watch`. O `npm run seed` corre o seed uma vez. Os dois leem o ficheiro `.env`, com o `--env-file`.

4. Cria o ficheiro `.gitignore`, na raiz do projeto, com o que o Git nunca deve guardar:

   ```text
   # Dependências: recriam-se com npm install.
   node_modules/

   # Configuração local e segredos: nunca vão para o Git.
   .env
   ```

   A pasta `node_modules` não se guarda, porque o `npm install` volta a criá-la a partir do `package.json`. O `.env` não se guarda, porque vai ter a palavra-passe da tua base de dados.

5. Cria o ficheiro `.env.example`, também na raiz. Diz que configuração a aplicação precisa, sem nenhum segredo:

   ```text
   # Porta onde a aplicação escuta. Muda-a se a 3000 estiver ocupada.
   PORT=3000

   # Ligação ao MongoDB Atlas, no formato mongodb+srv://utilizador:palavra-passe@...
   # O endereço verdadeiro escreve-se só no .env. No .env.example, esta linha fica vazia.
   MONGODB_URI=

   # Nome da base de dados no Atlas. A cadeia de ligação não o diz.
   DB_NAME=cinema
   ```

6. Cria o `.env` a partir do exemplo. No Windows, na linha de comandos clássica (cmd), o comando é `copy .env.example .env`.

   ```bash
   cp .env.example .env
   ```

7. Põe no `.env` a cadeia de ligação ao teu cluster. No Atlas, carrega em "Connect" (ligar) no teu cluster e escolhe a ligação por "Drivers". Copia a cadeia que começa por `mongodb+srv://` para a linha `MONGODB_URI=` do `.env`. Troca o marcador da palavra-passe, a parte entre `<` e `>`, pela palavra-passe do utilizador da base de dados.

O que deves ver: na pasta, a `node_modules`, o `package.json`, o `package-lock.json`, o `.gitignore`, o `.env.example` e o `.env`. A partir deste momento, o `.env` tem um segredo. Não o copies para mais lado nenhum, e não o entregues.

## Exercício 2: a ligação, o modelo e o seed

Cria a pasta `src` e, dentro dela, as pastas `db` e `models`. Os três ficheiros deste exercício ligam a aplicação à base, descrevem os filmes e põem-nos lá.

### Passo 1: a ligação à base

O ficheiro `src/db/mongoose.js` liga o Mongoose ao teu cluster:

```js
// src/db/mongoose.js: a ligação da aplicação ao MongoDB Atlas, através do Mongoose.
// A cadeia de ligação leva o utilizador e a palavra-passe da base de dados:
// é um segredo, por isso vem do ficheiro .env e nunca está escrita no código.
import mongoose from "mongoose";

/**
 * Liga o Mongoose à base de dados do cinema, no Atlas.
 * Lê a cadeia de ligação de MONGODB_URI e o nome da base de DB_NAME.
 * Se faltar a cadeia ou a ligação falhar, a promessa é rejeitada com o erro,
 * e o server.js não deixa a aplicação arrancar.
 * @returns {Promise<void>} cumprida quando a ligação está feita
 */
export async function ligarBaseDeDados() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("falta a MONGODB_URI no ficheiro .env");
  }

  // A cadeia que o Atlas te dá não diz que base de dados usar. Sem o dbName,
  // o Mongoose usava uma base chamada test, que está vazia.
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || "cinema" });

  // Escreve o nome da base, e nunca a cadeia de ligação, que tem a palavra-passe.
  console.log(`Ligada à base de dados ${mongoose.connection.name}`);
}
```

Leitura guiada: a cadeia de ligação vem do `.env`, através de `process.env.MONGODB_URI`, e nunca fica escrita no código. Se faltar, a função lança um erro, com o `throw`, e quem a chamou decide o que fazer. A cadeia do Atlas não diz que base usar, por isso o nome da base vai à parte, no `dbName`.

A função é `async`, porque ligar a uma base que está noutro computador demora. O `await` espera pela resposta do Atlas, e só depois o programa passa à linha seguinte.

### Passo 2: o modelo dos filmes

O ficheiro `src/models/filme.model.js` diz ao Mongoose como é um filme:

```js
// src/models/filme.model.js: o modelo dos filmes do cinema da escola, no Mongoose.
// O schema descreve a forma dos documentos da coleção filmes, a mesma que
// inseriste no Atlas: cada campo e o seu tipo.
import mongoose from "mongoose";

const filmeSchema = new mongoose.Schema({
  numero: Number,
  titulo: String,
  genero: String,
  duracaoMinutos: Number,
  idadeMinima: Number,
  // A sessão está embutida: é um documento dentro do filme, com o dia e a hora.
  sessao: {
    dia: String,
    hora: String,
  },
});

// O terceiro argumento é o nome da coleção, escrito à mão, como na papelaria.
export const Filme = mongoose.model("Filme", filmeSchema, "filmes");
```

Leitura guiada: o schema tem um campo por cada dado do filme, com o seu tipo. A sessão é um objeto dentro do filme, com o dia e a hora, e o schema descreve-a da mesma forma. O modelo `Filme` é o que o resto da aplicação usa para ler e escrever na coleção `filmes`. O terceiro argumento do `mongoose.model` é o nome da coleção, escrito à mão para não haver surpresas.

### Passo 3: o seed

Um seed é um programa que põe na base os dados de que a aplicação precisa para começar. O ficheiro `src/seed.js` põe lá os oito filmes do clube:

```js
// src/seed.js: põe os oito filmes do clube na base de dados.
// Corre-se à parte, com npm run seed, antes de arrancar o servidor.
// Apaga primeiro os filmes que lá estiverem, por isso pode correr-se
// as vezes que for preciso, sem repetir filmes.
import mongoose from "mongoose";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Filme } from "./models/filme.model.js";

// Os filmes do clube. Cada um é um objeto com os campos do schema,
// e a sessão é um objeto dentro do filme, com o dia e a hora.
const filmes = [
  { numero: 1, titulo: "Shrek", genero: "Animação", duracaoMinutos: 90, idadeMinima: 6, sessao: { dia: "4 de novembro", hora: "15:30" } },
  { numero: 2, titulo: "Regresso ao Futuro", genero: "Ficção científica", duracaoMinutos: 116, idadeMinima: 12, sessao: { dia: "11 de novembro", hora: "15:30" } },
  { numero: 3, titulo: "Os Goonies", genero: "Aventura", duracaoMinutos: 114, idadeMinima: 12, sessao: { dia: "18 de novembro", hora: "15:30" } },
  { numero: 4, titulo: "Toy Story", genero: "Animação", duracaoMinutos: 81, idadeMinima: 6, sessao: { dia: "25 de novembro", hora: "15:30" } },
  { numero: 5, titulo: "Matrix", genero: "Ficção científica", duracaoMinutos: 136, idadeMinima: 14, sessao: { dia: "2 de dezembro", hora: "15:00" } },
  { numero: 6, titulo: "Jumanji", genero: "Aventura", duracaoMinutos: 104, idadeMinima: 12, sessao: { dia: "9 de dezembro", hora: "15:30" } },
  { numero: 7, titulo: "O Rei Leão", genero: "Animação", duracaoMinutos: 88, idadeMinima: 6, sessao: { dia: "16 de dezembro", hora: "15:30" } },
  { numero: 8, titulo: "Interstellar", genero: "Ficção científica", duracaoMinutos: 169, idadeMinima: 12, sessao: { dia: "6 de janeiro", hora: "14:30" } },
];

try {
  await ligarBaseDeDados();
  // O filtro vazio, {}, escolhe todos os documentos: apaga todos os filmes.
  const apagados = await Filme.deleteMany({});
  console.log(`Apagados ${apagados.deletedCount} filmes`);
  // Insere os oito de uma só vez, como o "Insert Document" do Atlas.
  const inseridos = await Filme.insertMany(filmes);
  console.log(`Inseridos ${inseridos.length} filmes`);
} catch (erro) {
  console.error(`O seed falhou: ${erro.message}`);
}

// A ligação à base fica aberta até alguém a fechar. Sem esta linha,
// o programa ficava à espera e não voltava ao terminal.
await mongoose.disconnect();
```

Leitura guiada: o seed liga-se à base com a mesma função do passo 1. Depois apaga todos os filmes da coleção, com o `deleteMany`, e insere os oito, com o `insertMany`. O filtro vazio, `{}`, escolhe todos os documentos, como na barra de consultas do Atlas.

Como apaga primeiro, o seed pode correr-se as vezes que quiseres, e a coleção fica sempre com os mesmos oito filmes. Isto serve para dados de exemplo. Numa base com dados verdadeiros, um `deleteMany({})` apagava-os todos.

A última linha fecha a ligação. Uma ligação aberta mantém o programa à espera de mais trabalho, e o terminal não voltava a aceitar comandos.

### Passo 4: correr o seed

1. No caderno, prevê o que o terminal vai escrever. Depois corre o seed:

   ```bash
   npm run seed
   ```

   O que deves ver: três linhas, `Ligada à base de dados cinema`, `Apagados 0 filmes` e `Inseridos 8 filmes`, e o terminal pronto para outro comando.

2. No caderno, prevê quantos filmes ficam na coleção se correres o seed outra vez. Depois corre-o.

   O que deves ver: `Apagados 8 filmes` e `Inseridos 8 filmes`. A coleção continua com oito.

3. No Atlas, abre o explorador de dados, a base `cinema` e a coleção `filmes`.

   O que deves ver: os oito filmes. Cada um tem o `_id` que o MongoDB lhe deu e um campo `__v` com o valor 0, que nenhum ficheiro teu escreveu. O `__v` é do Mongoose, que o usa para controlar versões dos documentos que insere. Podes ignorá-lo.

## Exercício 3: os filmes na barra do Atlas

Antes de a API ir buscar filmes, descobre no Atlas o que ela vai ter de devolver. Neste exercício trabalhas sozinho.

Na barra de consultas da coleção `filmes`, escreve um filtro para cada pergunta. No caderno, regista o filtro e os títulos dos filmes que aparecem.

1. Que filmes são de animação?
2. Que filmes pode ver um aluno de 12 anos?
3. Que filmes de ficção científica pode ver um aluno de 12 anos?

Antes de executares a pergunta 2, decide se um aluno de 12 anos pode ver um filme com a idade mínima de 12. A tua resposta escolhe o operador: `$lt`, menor do que, ou `$lte`, menor ou igual.

## Exercício 4: a API dos filmes

### Passo 1: o servidor com a lista dos filmes

Cria o ficheiro `src/server.js`:

```js
// src/server.js: a aplicação do cinema da escola.
// Uma API em JSON, com os filmes lidos do MongoDB Atlas através do Mongoose,
// e uma página, o cartaz, gerada no servidor com o EJS a partir dos mesmos
// filmes.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Filme } from "./models/filme.model.js";

const app = express();

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a aplicação usa a 3000.
const PORTA = process.env.PORT || 3000;

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rota de estado: serve para confirmar que a API está ligada e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "Cinema da escola" });
});

// Lista de filmes, lida da base de dados. Por agora, todos os filmes.
app.get("/api/filmes", async (req, res) => {
  const filmes = await Filme.find();
  res.json(filmes);
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Primeiro a ligação à base, e só depois o servidor: uma aplicação que não
// chega aos dados não deve começar a aceitar pedidos.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a aplicação: ${erro.message}`);
    return;
  }
  console.log(`Cinema da escola em http://localhost:${PORTA}`);
});
```

Leitura guiada:

- O middleware de registo corre em todos os pedidos, antes das rotas. Escreve no terminal o método e o endereço, e passa o pedido à frente com o `next()`.
- A rota de estado responde sempre o mesmo, e serve para confirmar que a API está a responder.
- A rota da lista é `async`, porque pergunta à base, e o `await` espera pelos filmes. O `Filme.find()` sem filtro devolve todos, e o `res.json` envia-os em JSON.
- O middleware final só recebe os pedidos a que nenhuma rota respondeu, e responde 404 em JSON.
- No fim, a aplicação liga-se primeiro à base e só depois começa a aceitar pedidos. Uma API que não chega aos dados não deve responder como se estivesse tudo bem.

Arranca o servidor, que fica a correr neste terminal. Para o parar, carregas em Ctrl+C.

```bash
npm run dev
```

O que deves ver: duas linhas, `Ligada à base de dados cinema` e `Cinema da escola em http://localhost:3000`.

No caderno, prevê o código e a resposta de cada pedido. Depois abre-os no browser: `/api/estado`, `/api/filmes`, `/nao-existe` e `/api/filmes/3`.

O que deves ver: 200 com o estado; 200 com os oito filmes, cada um com o `_id` e o `__v`; 404 com `{"erro":"Rota não encontrada"}`. O último também dá esse 404, porque ainda não há uma rota para um filme. No terminal, aparece uma linha por pedido.

### Passo 2: os filtros

Troca a rota da lista por esta, que aceita o género e a idade:

```js fragment
// Lista de filmes, lida da base de dados. Com ?genero=Animação, só os desse
// género; com ?idade=12, só os que um aluno de 12 anos pode ver; com os dois,
// os que cumprem as duas condições.
app.get("/api/filmes", async (req, res) => {
  const genero = req.query.genero;
  const idade = req.query.idade;

  // O filtro começa vazio, e um filtro vazio deixa passar todos os filmes.
  // Cada parâmetro da pesquisa que vier no pedido acrescenta uma condição.
  const filtro = {};
  if (genero) {
    filtro.genero = genero;
  }
  if (idade) {
    const idadeEmNumero = Number(idade); // chega como texto, "12", e passa a número
    if (!Number.isInteger(idadeEmNumero) || idadeEmNumero < 1) {
      res.status(400).json({ erro: "A idade tem de ser um número inteiro maior do que 0" });
      return;
    }
    // Um aluno de 12 anos pode ver os filmes a partir dos 12 e os de idade
    // mínima mais baixa: menor ou igual, $lte, e não menor, $lt.
    filtro.idadeMinima = { $lte: idadeEmNumero };
  }

  const filmes = await Filme.find(filtro);
  res.json(filmes);
});
```

Leitura guiada: o filtro é um objeto que começa vazio, e um filtro vazio deixa passar todos os filmes. Cada parâmetro que vier no endereço acrescenta-lhe uma condição. Com os dois, o filme tem de cumprir as duas, como num filtro do Atlas com dois campos.

A idade chega como texto, `"12"`, como tudo o que vem no endereço. O `Number` passa-a a número, e o `if` recusa-a com 400 se não for um número inteiro maior do que 0. Só uma idade válida chega à base.

Grava. O `--watch` volta a arrancar o servidor sozinho. Na barra de endereço, podes escrever os acentos e os espaços, como em `?genero=Ficção científica`. O browser codifica-os antes de enviar o pedido, e o Express devolve-os ao teu código como os escreveste.

No caderno, prevê o resultado de cada pedido, e depois experimenta:

| Pedido | Código | Resposta |
| --- | --- | --- |
| `/api/filmes?genero=Animação` | 200 | Os três filmes de animação |
| `/api/filmes?genero=Musical` | 200 | `[]` |
| `/api/filmes?idade=12` | 200 | Os filmes da pergunta 2 do exercício 3 |
| `/api/filmes?idade=doze` | 400 | `{"erro":"A idade tem de ser um número inteiro maior do que 0"}` |
| `/api/filmes?idade=0` | 400 | O mesmo erro |
| `/api/filmes?genero=Ficção científica&idade=12` | 200 | Os filmes da pergunta 3 do exercício 3 |

Agora, um erro de propósito. Apaga as quatro linhas do `if` que verifica a idade, do `if (!Number.isInteger` até à chaveta que o fecha, e grava. No caderno, prevê o que acontece com `/api/filmes?idade=doze`, e depois experimenta.

O que deves ver: o código 500 e uma página de erro do Express que fala de `CastError` e de `Cast to Number failed for value "NaN"`. O `Number("doze")` não é um número, e o Mongoose recusou-o ao preparar a consulta. O servidor continua ligado, mas o utilizador recebe uma página com pormenores internos, em vez de uma mensagem clara. Repõe as quatro linhas e grava.

No caderno: compara o filtro que escreveste no Atlas para a pergunta 3 do exercício 3 com o que o servidor passa ao Mongoose no pedido `/api/filmes?genero=Ficção científica&idade=12`. O que é igual, e de onde vem cada valor no servidor?

### Passo 3: um filme de cada vez

Acrescenta esta rota a seguir à rota da lista, antes do middleware final:

```js fragment
// Um filme: GET /api/filmes/3. O :numero é um parâmetro de rota, e o número
// procura-se no campo numero de cada documento, e não no _id.
app.get("/api/filmes/:numero", async (req, res) => {
  const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número do filme tem de ser um número inteiro positivo" });
    return;
  }
  // O find devolve sempre uma lista. Como não há dois filmes com o mesmo
  // número, a lista vem com um filme, ou vazia, se o número não existir.
  const encontrados = await Filme.find({ numero: numero });
  if (encontrados.length === 0) {
    res.status(404).json({ erro: `Não existe o filme ${numero}` });
    return;
  }
  res.json(encontrados[0]);
});
```

Leitura guiada: o `:numero` é um parâmetro de rota, e o número também chega como texto. A rota verifica-o como verificou a idade, e responde 400 se não servir. O `find` devolve sempre uma lista, mesmo quando só um documento cumpre o filtro. Se a lista vier vazia, o filme não existe, e a resposta é 404. Se não, a rota envia o primeiro e único filme da lista.

No caderno, prevê, e depois experimenta: `/api/filmes/3`, `/api/filmes/9` e `/api/filmes/abc`.

O que deves ver: 200 com Os Goonies; 404 com `{"erro":"Não existe o filme 9"}`; 400 com `{"erro":"O número do filme tem de ser um número inteiro positivo"}`.

## Exercício 5: o cartaz

A API responde com dados, em JSON. O cartaz é uma página para pessoas, em HTML, gerada no servidor a partir dos mesmos filmes.

### Passo 1: o motor das páginas

No `server.js`, acrescenta estas linhas logo a seguir à linha da `PORTA`:

```js fragment
// O motor dos modelos das páginas. O Express procura os modelos na pasta
// views da pasta de onde arrancas o servidor, que é a raiz do projeto.
app.set("view engine", "ejs");
```

Leitura guiada: o `app.set` diz ao Express que os modelos das páginas são ficheiros `.ejs`. O Express procura-os na pasta `views` da pasta onde o terminal está quando arrancas o servidor. Com o `npm run dev`, essa pasta é a raiz do projeto, e por isso a pasta `views` fica ao lado do `package.json`, e não dentro de `src`.

### Passo 2: o modelo do cartaz

Cria a pasta `views`, na raiz do projeto, e nela o ficheiro `cartaz.ejs`:

```ejs
<%# O cartaz do cinema da escola. Recebe o titulo e os filmes a mostrar. %>
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title><%= titulo %> | Cinema da escola</title>
  </head>
  <body>
    <h1><%= titulo %></h1>
    <ul>
      <% for (const filme of filmes) { %>
        <li><%= filme.titulo %> (<%= filme.genero %>, <%= filme.duracaoMinutos %> minutos, a partir dos <%= filme.idadeMinima %> anos): <%= filme.sessao.dia %>, às <%= filme.sessao.hora %></li>
      <% } %>
    </ul>
  </body>
</html>
```

Leitura guiada: o modelo é HTML com marcas, e todas as marcas começam por `<%` e acabam em `%>`. A marca `<%# %>` é um comentário, que fica no servidor. A marca `<%= %>` escreve um valor na página, e os carateres especiais do HTML vão como texto. A marca `<% %>`, sem nada a seguir ao `%`, corre JavaScript sem escrever nada. Aqui abre e fecha o `for`, que repete a linha `<li>` uma vez por filme.

### Passo 3: a rota do cartaz

Acrescenta esta rota a seguir à rota de um filme, antes do middleware final:

```js fragment
// O cartaz: uma página, e não JSON. Com ?genero=Animação, só os filmes
// desse género, e o título diz o género.
app.get("/cartaz", async (req, res) => {
  const genero = req.query.genero;
  let titulo = "Cartaz";
  const filtro = {};
  if (genero) {
    titulo = `Cartaz: ${genero}`;
    filtro.genero = genero;
  }
  const filmes = await Filme.find(filtro);
  res.render("cartaz", { titulo: titulo, filmes: filmes });
});
```

Leitura guiada: a rota vai buscar os filmes como a lista da API, com um filtro e o `await`. Em vez do `res.json`, responde com o `res.render`, que junta o modelo `cartaz` com os dados e envia o HTML. Dentro do modelo, os dados chamam-se `titulo` e `filmes`, os nomes das propriedades do objeto. O título decide-se aqui, na rota, com um `if`.

Neste ponto, o teu `server.js` está assim:

```js
// src/server.js: a aplicação do cinema da escola.
// Uma API em JSON, com os filmes lidos do MongoDB Atlas através do Mongoose,
// e uma página, o cartaz, gerada no servidor com o EJS a partir dos mesmos
// filmes.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Filme } from "./models/filme.model.js";

const app = express();

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a aplicação usa a 3000.
const PORTA = process.env.PORT || 3000;

// O motor dos modelos das páginas. O Express procura os modelos na pasta
// views da pasta de onde arrancas o servidor, que é a raiz do projeto.
app.set("view engine", "ejs");

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rota de estado: serve para confirmar que a API está ligada e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "Cinema da escola" });
});

// Lista de filmes, lida da base de dados. Com ?genero=Animação, só os desse
// género; com ?idade=12, só os que um aluno de 12 anos pode ver; com os dois,
// os que cumprem as duas condições.
app.get("/api/filmes", async (req, res) => {
  const genero = req.query.genero;
  const idade = req.query.idade;

  // O filtro começa vazio, e um filtro vazio deixa passar todos os filmes.
  // Cada parâmetro da pesquisa que vier no pedido acrescenta uma condição.
  const filtro = {};
  if (genero) {
    filtro.genero = genero;
  }
  if (idade) {
    const idadeEmNumero = Number(idade); // chega como texto, "12", e passa a número
    if (!Number.isInteger(idadeEmNumero) || idadeEmNumero < 1) {
      res.status(400).json({ erro: "A idade tem de ser um número inteiro maior do que 0" });
      return;
    }
    // Um aluno de 12 anos pode ver os filmes a partir dos 12 e os de idade
    // mínima mais baixa: menor ou igual, $lte, e não menor, $lt.
    filtro.idadeMinima = { $lte: idadeEmNumero };
  }

  const filmes = await Filme.find(filtro);
  res.json(filmes);
});

// Um filme: GET /api/filmes/3. O :numero é um parâmetro de rota, e o número
// procura-se no campo numero de cada documento, e não no _id.
app.get("/api/filmes/:numero", async (req, res) => {
  const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número do filme tem de ser um número inteiro positivo" });
    return;
  }
  // O find devolve sempre uma lista. Como não há dois filmes com o mesmo
  // número, a lista vem com um filme, ou vazia, se o número não existir.
  const encontrados = await Filme.find({ numero: numero });
  if (encontrados.length === 0) {
    res.status(404).json({ erro: `Não existe o filme ${numero}` });
    return;
  }
  res.json(encontrados[0]);
});

// O cartaz: uma página, e não JSON. Com ?genero=Animação, só os filmes
// desse género, e o título diz o género.
app.get("/cartaz", async (req, res) => {
  const genero = req.query.genero;
  let titulo = "Cartaz";
  const filtro = {};
  if (genero) {
    titulo = `Cartaz: ${genero}`;
    filtro.genero = genero;
  }
  const filmes = await Filme.find(filtro);
  res.render("cartaz", { titulo: titulo, filmes: filmes });
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Primeiro a ligação à base, e só depois o servidor: uma aplicação que não
// chega aos dados não deve começar a aceitar pedidos.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a aplicação: ${erro.message}`);
    return;
  }
  console.log(`Cinema da escola em http://localhost:${PORTA}`);
});
```

### Passo 4: o que o browser recebe

1. No caderno, escreve o HTML que esperas encontrar dentro do `<ul>` com o pedido `/cartaz?genero=Aventura`. Depois abre-o no browser e vê o código-fonte da página. Na maior parte dos browsers, abre-se com Ctrl+U, ou com Cmd+Option+U no Mac.

   O que deves ver: dentro do `<ul>`, duas linhas `<li>`, uma para Os Goonies e outra para o Jumanji, com os valores já escritos, e linhas em branco entre elas.

   ```html
   <ul>

       <li>Os Goonies (Aventura, 114 minutos, a partir dos 12 anos): 18 de novembro, às 15:30</li>

       <li>Jumanji (Aventura, 104 minutos, a partir dos 12 anos): 9 de dezembro, às 15:30</li>

   </ul>
   ```

2. No caderno: que partes do teu modelo não aparecem no código-fonte, e porquê?
3. Experimenta `/cartaz` e `/cartaz?genero=Musical`. Com `Musical`, a página mostra só o título, "Cartaz: Musical", porque a lista vazia não tem linhas.
4. No caderno: no teu código, que linha decide que filmes aparecem no cartaz, e que linha decide como cada filme aparece? Diz, para cada uma, se está na rota ou no modelo.

## Exercício 6: a duração máxima, sozinho

Daqui em diante, a ficha não te dá o código. Decides tu onde e como o escrever.

O clube quer saber que filmes cabem numa tarde curta. Acrescenta à lista da API o parâmetro `?duracaoMaxima=`, que deixa só os filmes que duram esse número de minutos ou menos. Junta-se aos outros dois parâmetros, e todos os pedidos do exercício 4 continuam a responder como antes.

| Pedido | Código | Resposta |
| --- | --- | --- |
| `/api/filmes?duracaoMaxima=114` | 200 | Os filmes que duram 114 minutos ou menos |
| `/api/filmes?duracaoMaxima=duas` | 400 | `{"erro":"A duração máxima tem de ser um número inteiro maior do que 0"}` |
| `/api/filmes?duracaoMaxima=0` | 400 | O mesmo erro |
| `/api/filmes?genero=Aventura&duracaoMaxima=110` | 200 | Os filmes de aventura que duram 110 minutos ou menos |
| `/api/filmes?genero=Ficção científica&idade=12&duracaoMaxima=120` | 200 | Os filmes que cumprem as três condições |

No caderno, antes de escreveres o código, escreve que filmes esperas em cada pedido de 200.

## Exercício 7: o cartaz para uma idade, sozinho

O cartaz passa a aceitar também o parâmetro `?idade=`, com a mesma regra da API. O título diz o que se escolheu: o género, a idade, ou os dois, separados por uma vírgula. Com uma idade inválida, a página responde 400, com o título "Idade inválida" e a lista vazia, sem perguntar nada à base.

| Pedido | Código | Título da página | Filmes |
| --- | --- | --- | --- |
| `/cartaz` | 200 | Cartaz | Os oito |
| `/cartaz?genero=Animação` | 200 | Cartaz: Animação | Os três de animação |
| `/cartaz?idade=12` | 200 | Cartaz: para 12 anos | Os que um aluno de 12 anos pode ver |
| `/cartaz?genero=Animação&idade=6` | 200 | Cartaz: Animação, para 6 anos | Os de animação que um aluno de 6 anos pode ver |
| `/cartaz?idade=doze` | 400 | Idade inválida | Nenhum |

O modelo `cartaz.ejs` não precisa de mudar. Confirma o código 400 no separador Rede, porque a página parece normal.

## Apoio

- Exercício 1: Se o `npm` não for reconhecido no terminal, o Node.js não está instalado, ou o terminal foi aberto antes da instalação. Fecha-o e abre outro.
- Exercício 2: `Cannot use import statement outside a module` quer dizer que o `"type"` do `package.json` ainda é `"commonjs"`.
- Exercício 2: Se o seed escrever `O seed falhou: falta a MONGODB_URI no ficheiro .env`, a linha da cadeia de ligação está vazia. Se o terminal disser `node: .env: not found`, falta o próprio ficheiro `.env`.
- Exercício 2: Se o seed ficar parado uns 30 segundos e depois falhar, o Atlas não aceitou a ligação. Confirma que o endereço IP do computador onde estás está autorizado no Atlas, e que tens internet.
- Exercício 2: A mensagem `bad auth : authentication failed` quer dizer que o utilizador ou a palavra-passe da cadeia estão errados. Confirma que tiraste o `<` e o `>` do marcador. Usa o utilizador da base de dados, e não o da tua conta no Atlas.
- Exercício 3: Os filtros com duas condições têm os dois campos dentro das mesmas chavetas.
- Exercício 4: Se a lista vier `[]` e o terminal disser `Ligada à base de dados test`, falta o `DB_NAME=cinema` no `.env`, ou o `dbName` na ligação.
- Exercício 5: `No default engine was specified` quer dizer que falta o `app.set`. `Failed to lookup view "cartaz"` quer dizer que o Express não encontrou o modelo: a mensagem diz em que pasta o procurou.
- Exercício 5: Se uma linha do cartaz aparecer sem o título do filme, e sem erro, essa marca não tem o `=`.
- Exercício 6: A nova condição constrói-se como a da idade, e entra no mesmo filtro.
- Exercício 7: Pensa primeiro no título, com os quatro casos da tabela, e só depois no filtro. O `res.status` e o `res.render` podem juntar-se na mesma resposta.

## Desafio opcional

Este desafio é opcional. Faz primeiro os exercícios 1 a 7.

**Os três filmes mais longos.** Acrescenta à API o pedido `/api/filmes/mais-longos`, que responde com os três filmes de maior duração, do mais longo para o mais curto. No Atlas, isto faz-se com a ordenação e o limite, nos campos "Sort" e "Limit" da barra de consultas. Procura na [documentação do Mongoose](https://mongoosejs.com/docs/queries.html) como se escrevem no servidor.

Quando o pedido funcionar, confirma que `/api/filmes/3` continua a responder com Os Goonies. Se `/api/filmes/mais-longos` responder 400, lê a mensagem e descobre que rota respondeu ao pedido.

## Critérios de conclusão

- O seed põe os oito filmes na base `cinema`, e pode correr-se mais de uma vez sem repetir filmes.
- O caderno tem os três filtros do exercício 3, com os títulos de cada resposta, e as respostas às perguntas dos exercícios 4 e 5.
- A API responde a todos os pedidos das tabelas dos exercícios 4 e 6, com os códigos e os textos certos.
- O cartaz responde a todos os pedidos da tabela do exercício 7, com o título e os filmes certos.
- A cadeia de ligação está só no `.env`, e o `.env` não sai do teu computador.

## Entrega

Entregas, pelo meio e no prazo que o professor indicar, a pasta `cinema-da-escola` e as respostas escritas no caderno ou num ficheiro de texto. A pasta leva o `src`, com o seed, a pasta `views`, o `package.json`, o `package-lock.json`, o `.env.example` e o `.gitignore`.

Não entregues a pasta `node_modules` nem o ficheiro `.env`. O `.env` tem a palavra-passe da tua base de dados, e quem a tiver entra nos teus dados.

## Autoavaliação

No fim, responde por escrito:

1. Nos exercícios 6 e 7, o que te deu mais trabalho, e o que descobriste para o resolver?
2. Consegues explicar, sem o código à frente, o caminho do pedido `/cartaz?genero=Aventura`, do browser à rota, da rota ao Atlas, e de volta ao browser?
3. O que ainda não percebeste bem? Escreve uma dúvida concreta, para levares à aula.

![Rodapé](../imagens/rodape.png)
