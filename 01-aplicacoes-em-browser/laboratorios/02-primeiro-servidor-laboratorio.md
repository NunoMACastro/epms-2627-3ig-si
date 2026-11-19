![Cabeçalho](../../imagens/cabecalho.png)

# Laboratório: Primeiro servidor

## O que vais construir

Constróis, a partir de uma pasta vazia, o servidor do catálogo de equipamentos da escola. É um servidor Express que responde com um texto e com a lista dos equipamentos em JSON. Depois, provocas quatro erros e escreves, no fim do `server.js`, um registo de arranque: um comentário com cada erro e a sua correção.

A tua pasta de trabalho acaba assim, além do que já lá tinhas:

```text
si/                          a tua pasta de trabalho de Sistemas de Informação
├── ola.js                   o primeiro programa, da fase 1
└── catalogo-de-equipamentos/
    ├── .gitignore           o que o Git ignora, da fase 10
    ├── node_modules/        os pacotes instalados; recria-se com npm install
    ├── package-lock.json    as versões exatas dos pacotes
    ├── package.json         a descrição do projeto
    └── server.js            o servidor, com o registo de arranque no fim
```

1. [Fase 1: O Node.js corre JavaScript fora do browser](#fase-1-o-nodejs-corre-javascript-fora-do-browser)
2. [Fase 2: O npm e o ficheiro package.json](#fase-2-o-npm-e-o-ficheiro-packagejson)
3. [Fase 3: Instalar o Express cria a pasta node_modules](#fase-3-instalar-o-express-cria-a-pasta-node_modules)
4. [Fase 4: O "type": "module" deixa o Node aceitar o import](#fase-4-o-type-module-deixa-o-node-aceitar-o-import)
5. [Fase 5: Um servidor é um processo que fica à escuta até o parares](#fase-5-um-servidor-é-um-processo-que-fica-à-escuta-até-o-parares)
6. [Fase 6: O Express liga cada rota a uma função](#fase-6-o-express-liga-cada-rota-a-uma-função)
7. [Fase 7: A resposta leva texto, com res.send, ou dados, com res.json](#fase-7-a-resposta-leva-texto-com-ressend-ou-dados-com-resjson)
8. [Fase 8: O arranque corre uma vez, e a função de uma rota a cada pedido](#fase-8-o-arranque-corre-uma-vez-e-a-função-de-uma-rota-a-cada-pedido)
9. [Fase 9: Uma mensagem de erro lê-se pelo tipo e pela linha](#fase-9-uma-mensagem-de-erro-lê-se-pelo-tipo-e-pela-linha)
10. [Fase 10: Um commit guarda uma fotografia do projeto](#fase-10-um-commit-guarda-uma-fotografia-do-projeto)

## O que precisas

- O Visual Studio Code, com o terminal: menu "Terminal", "New Terminal" (em português, "Novo Terminal").
- O Node.js 24, que traz o npm: `node --version` mostra uma versão como `v24.17.0`, e `npm --version` um número como `11.13.0`. Se o npm der um erro sobre o `npm.ps1`, vê [este problema](#o-npm-não-corre-na-powershell-do-windows).
- O Git, para a fase 10: `git --version` mostra `git version` e um número.
- Internet, para instalar o Express na fase 3.
- Um browser com as ferramentas de programador: no Windows, F12; no Mac, Cmd+Option+I.

## Preparar o projeto

1. Abre a tua pasta de trabalho de Sistemas de Informação no Visual Studio Code, no menu "File", "Open Folder" (em português, "Arquivo", "Abrir Pasta"). Se ainda não a tens, cria-a num sítio teu, como os Documentos, fora de qualquer outro projeto e fora do repositório dos materiais da disciplina. Depois, abre o terminal, que fica já dentro dessa pasta, e escreve `pwd`. É assim no Mac e na PowerShell, o terminal do Visual Studio Code no Windows; na linha de comandos clássica do Windows, escreve `cd`, sem mais nada.

   O que deves ver: o caminho da tua pasta de trabalho. É aí que vais criar o primeiro programa.

## Fase 1: O Node.js corre JavaScript fora do browser

Escreves um programa que escreve duas linhas e corre-lo no terminal, sem browser nenhum. O Node.js é o programa que executa esse JavaScript. Rever: [O Node.js corre JavaScript fora do browser](../02-primeiro-servidor.md#o-nodejs-corre-javascript-fora-do-browser).

1. Cria o ficheiro `ola.js` na tua pasta de trabalho. No explorador do Visual Studio Code, carrega no botão de ficheiro novo ("New File..."), escreve o nome e carrega em Enter. Escreve nele este programa e guarda, com Ctrl+S (no Mac, Cmd+S):

   ```js
   // ola.js: um programa que escreve duas linhas e termina.
   const escola = "EPMS";
   console.log(`Olá, ${escola}!`);
   console.log("Este JavaScript está a correr no Node, e não num browser.");
   ```

2. No terminal, corre o programa:

   ```bash
   node ola.js
   ```

   O que deves ver:

   ```text
   Olá, EPMS!
   Este JavaScript está a correr no Node, e não num browser.
   ```

   E, a seguir, o terminal outra vez pronto para outro comando. Isto quer dizer que o Node correu o ficheiro de cima para baixo e terminou. Se o terminal disser que não conhece o comando `node`, vê [O terminal não conhece o comando node](#o-terminal-não-conhece-o-comando-node).

### Paragem 1

O `ola.js` escreve as duas linhas e o terminal fica livre.

Pensa antes de continuares: se estes `console.log` estivessem no JavaScript de uma página, onde aparecia a frase? A resposta: na consola das ferramentas de programador do browser. No Node, aparece no terminal onde o programa corre.

## Fase 2: O npm e o ficheiro package.json

Crias a pasta do servidor e, dentro dela, o ficheiro `package.json`, que descreve o projeto. Quem o cria é o npm, com `npm init -y`. Rever: [O npm e o ficheiro package.json](../02-primeiro-servidor.md#o-npm-e-o-ficheiro-packagejson).

1. Cria a pasta do servidor dentro da tua pasta de trabalho e entra nela. Os dois comandos são os mesmos no Windows:

   ```bash
   mkdir catalogo-de-equipamentos
   cd catalogo-de-equipamentos
   ```

   O que deves ver: a pasta `catalogo-de-equipamentos` no explorador do editor. Os comandos não escrevem nada no terminal.

2. Cria o `package.json`:

   ```bash
   npm init -y
   ```

   O que deves ver: `Wrote to`, o caminho do `package.json` e, a seguir, o conteúdo que o npm lá escreveu:

   ```json
   {
     "name": "catalogo-de-equipamentos",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "type": "commonjs"
   }
   ```

   O `-y` respondeu "sim" a todas as perguntas do npm, e o ficheiro ficou com os valores por omissão.

### Paragem 2

A pasta `catalogo-de-equipamentos` tem o `package.json`, que podes abrir no editor.

Pensa antes de continuares: não escreveste o nome `catalogo-de-equipamentos` em nenhum comando do npm. De onde o tirou ele? A resposta: do nome da pasta onde correste o `npm init -y`.

## Fase 3: Instalar o Express cria a pasta node_modules

Instalas o Express, o pacote com que vais escrever o servidor. O npm guarda os pacotes na pasta `node_modules` e regista o Express como dependência no `package.json`. Rever: [Instalar o Express cria a pasta node_modules](../02-primeiro-servidor.md#instalar-o-express-cria-a-pasta-node_modules).

1. Na pasta `catalogo-de-equipamentos`, instala o Express. Este é o único passo que precisa de internet.

   ```bash
   npm install express
   ```

   O que deves ver, no fim, linhas como estas:

   ```text
   added 65 packages, and audited 66 packages in 612ms

   31 packages are looking for funding
     run `npm fund` for details

   found 0 vulnerabilities
   ```

   O número de pacotes e o tempo podem ser outros. As duas linhas do `funding` podem ignorar-se. Se o comando ficar parado ou acabar com linhas começadas por `npm error`, vê [O npm install falha ou fica parado](#o-npm-install-falha-ou-fica-parado).

2. Olha para a pasta, no explorador do editor. O que deves ver: duas coisas novas, a pasta `node_modules`, com dezenas de pastas lá dentro, e o ficheiro `package-lock.json`. No `package.json`, depois da linha do `"type"`, há uma secção nova, `"dependencies"`, com a linha `"express": "^5.3.0"`. Isto quer dizer que o Express ficou instalado nesta pasta e que o projeto diz que precisa dele.

### Paragem 3

A pasta tem o `package.json`, com o Express nas dependências, o `package-lock.json` e a pasta `node_modules`.

Pensa antes de continuares: se apagares a pasta `node_modules`, como a voltas a ter? A resposta: com `npm install`, sem mais nada. O comando lê no `package.json` os pacotes de que o projeto precisa e no `package-lock.json` as versões exatas, e instala-os outra vez.

## Fase 4: O "type": "module" deixa o Node aceitar o import

Mudas o `"type"` do `package.json` para `"module"` e escreves a primeira versão do servidor, que começa por um `import`. Com `"type": "module"`, o Node aceita o `import` dos módulos ES. Rever: [O "type": "module" deixa o Node aceitar o import](../02-primeiro-servidor.md#o-type-module-deixa-o-node-aceitar-o-import).

1. Muda o campo `"type"` sem abrires o ficheiro, para não haver aspas nem vírgulas a mexer:

   ```bash
   npm pkg set type=module
   ```

   O que deves ver: nenhuma mensagem. Abre o `package.json` no editor: a linha do `"type"` diz agora `"type": "module"`, e o resto ficou igual.

2. Cria o servidor. No explorador, clica na pasta `catalogo-de-equipamentos`, carrega no botão de ficheiro novo e escreve `server.js`. Escreve nele esta primeira versão, que ainda não tem rotas, e guarda. O comentário do topo já descreve o servidor acabado, com as duas rotas que vais acrescentar nas fases 6 e 7:

   ```js
   // server.js: o primeiro servidor do catálogo de equipamentos da escola.
   // Fica à escuta na porta 3000 e responde a dois pedidos GET.
   import express from "express";

   const app = express();
   const PORTA = 3000;

   // Liga o servidor: a partir daqui fica à escuta na porta 3000.
   // Se não conseguir (por exemplo, porque a porta já está ocupada),
   // o Express chama esta função com o erro.
   app.listen(PORTA, (erro) => {
     if (erro) {
       console.error(`Não foi possível ligar o servidor: ${erro.message}`);
       return;
     }
     console.log(`Servidor a correr em http://localhost:${PORTA}`);
   });
   ```

3. No terminal, na pasta `catalogo-de-equipamentos`, liga o servidor:

   ```bash
   node server.js
   ```

   O que deves ver: `Servidor a correr em http://localhost:3000`, e o terminal fica ocupado, sem voltar a aceitar comandos. Isto quer dizer que o Node aceitou o `import` e que o servidor se ligou à porta 3000. Deixa-o ligado: a fase 5 começa com ele. Se aparecer outra coisa, vê [O servidor não arranca](#o-servidor-não-arranca).

### Paragem 4

O servidor arranca e escreve a mensagem. O `package.json` completo, como deve estar agora:

```json
{
  "name": "catalogo-de-equipamentos",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "express": "^5.3.0"
  }
}
```

O `npm init -y` escreveu tudo até ao `"type"`, e o `npm install` acrescentou as `"dependencies"`. O `npm pkg set` mudou só a palavra do `"type"`.

Pensa antes de continuares: que linha do `server.js` precisava do `"type": "module"`? A resposta: a do `import`, a primeira linha de código.

## Fase 5: Um servidor é um processo que fica à escuta até o parares

Pedes uma página ao servidor, que ainda não tem rotas, e depois paras o processo e voltas a ligá-lo. Um servidor é um processo que fica à escuta numa porta até o parares com Ctrl+C. Rever: [Um servidor é um processo que fica à escuta até o parares](../02-primeiro-servidor.md#um-servidor-é-um-processo-que-fica-à-escuta-até-o-parares).

1. Com o servidor ligado, antes de abrires o endereço, prevê: o servidor ainda não tem nenhuma rota. O que vai mostrar o browser? Depois, no browser, abre `http://localhost:3000/`.

   O que deves ver: `Cannot GET /`. A resposta à previsão: o servidor respondeu, porque está ligado, mas não tem nenhuma rota para `/`. Quem respondeu foi o Express, com o código 404.

2. Para o servidor: no terminal onde ele está a correr, carrega em Ctrl+C (no Mac também é Ctrl, e não Cmd).

   O que deves ver: o terminal outra vez pronto para outro comando. O processo terminou, e a porta 3000 ficou livre.

3. No browser, recarrega a página.

   O que deves ver: uma página de erro do próprio browser. No Chrome, diz "Não é possível aceder a este site" e "localhost recusou estabelecer ligação", com o código `ERR_CONNECTION_REFUSED`. Isto quer dizer que nenhum programa está à escuta na porta 3000, e por isso ninguém respondeu.

4. Liga outra vez o servidor, com `node server.js`, e recarrega a página.

   O que deves ver: `Servidor a correr em http://localhost:3000` no terminal e `Cannot GET /` no browser, como no passo 1.

### Paragem 5

O servidor liga-se, responde ao browser e para quando carregas em Ctrl+C. Está ligado outra vez.

Pensa antes de continuares: porque é que o `ola.js` termina e o `server.js` não? A resposta: o `ola.js` acaba quando chega à última linha, porque não fica nada à espera. O servidor fica à escuta na porta, à espera de pedidos, e o Node só termina quando já não há nada à espera.

## Fase 6: O Express liga cada rota a uma função

Acrescentas ao servidor a primeira rota, a da página inicial. Uma rota liga um método e um caminho a uma função, e o Express chama essa função quando chega um pedido com esse método e esse caminho. Rever: [O Express liga cada rota a uma função](../02-primeiro-servidor.md#o-express-liga-cada-rota-a-uma-função).

1. No `server.js`, entre a linha do `PORTA` e o comentário do `listen`, acrescenta a rota de `/`, e guarda:

   ```js fragment
   // Rota 1: um pedido GET a / recebe um texto.
   app.get("/", (req, res) => {
     res.send("Olá! O servidor está a funcionar.");
   });
   ```

2. No browser, recarrega `http://localhost:3000/`, sem parares o servidor.

   O que deves ver: `Cannot GET /`, como antes. O servidor está a correr o código que leu quando arrancou, e nesse código ainda não havia a rota.

3. No terminal, para o servidor com Ctrl+C, volta a ligá-lo com `node server.js` e recarrega a página.

   O que deves ver: `Olá! O servidor está a funcionar.` Isto quer dizer que, no arranque, o Express registou a rota de `/` e que, quando chegou o pedido, chamou a função dela.

### Paragem 6

A página inicial responde com o texto da rota 1.

Pensa antes de continuares: o que mostra agora `http://localhost:3000/equipamentos`? A resposta: `Cannot GET /equipamentos`, com o código 404, porque o servidor só tem a rota de `/`.

## Fase 7: A resposta leva texto, com res.send, ou dados, com res.json

Acrescentas os equipamentos e a rota que os envia, e vês no separador Rede o que leva cada resposta. O `res.send` envia texto, que o browser trata como HTML, e o `res.json` envia dados em JSON. Rever: [A resposta leva texto, com res.send, ou dados, com res.json](../02-primeiro-servidor.md#a-resposta-leva-texto-com-ressend-ou-dados-com-resjson).

1. No `server.js`, a seguir à linha do `PORTA`, acrescenta os equipamentos, que a rota 2 vai enviar:

   ```js fragment
   // Os equipamentos ficam num array, em memória: existem enquanto o servidor
   // estiver ligado. Mais à frente passam para uma base de dados.
   const equipamentos = [
     { id: 1, nome: "Portátil", sala: "B12" },
     { id: 2, nome: "Projetor", sala: "A03" },
     { id: 3, nome: "Impressora", sala: "Secretaria" },
     { id: 4, nome: "Monitor", sala: "B12" },
   ];
   ```

2. A seguir à rota 1, antes do comentário do `listen`, acrescenta a rota 2:

   ```js fragment
   // Rota 2: um pedido GET a /equipamentos recebe a lista em JSON.
   app.get("/equipamentos", (req, res) => {
     res.json(equipamentos);
   });
   ```

3. Guarda. No terminal, carrega em Ctrl+C e volta a ligar o servidor com `node server.js`. No browser, abre `http://localhost:3000/equipamentos`.

   O que deves ver: os quatro equipamentos, cada um com o `id`, o `nome` e a `sala`. O browser pode mostrá-los arrumados, ou numa só linha, assim:

   ```text
   [{"id":1,"nome":"Portátil","sala":"B12"},{"id":2,"nome":"Projetor","sala":"A03"},{"id":3,"nome":"Impressora","sala":"Secretaria"},{"id":4,"nome":"Monitor","sala":"B12"}]
   ```

4. Abre as ferramentas de programador, no separador "Rede" ("Network"), e abre, um de cada vez, os três endereços da tabela. Em cada um, clica no pedido com o nome do fim do endereço: `localhost`, `equipamentos` ou `nao-existe`. No separador "Cabeçalhos" ("Headers"), lê o "Código de estado" ("Status Code") e, em "Cabeçalhos das respostas" ("Response Headers"), o `Content-Type`.

   O que deves ver:

   | Endereço | Código de estado | `Content-Type` |
   | --- | --- | --- |
   | `http://localhost:3000/` | 200 | `text/html; charset=utf-8` |
   | `http://localhost:3000/equipamentos` | 200 | `application/json; charset=utf-8` |
   | `http://localhost:3000/nao-existe` | 404 | `text/html; charset=utf-8` |

   Isto quer dizer que a página inicial veio como HTML e a lista veio como dados em JSON. Se o código for 304, e não 200, ativa "Desativar cache" ("Disable cache"), no topo do separador Rede, e recarrega.

### Paragem 7

O servidor responde aos três endereços com os códigos e os tipos de conteúdo da tabela. O `server.js` completo, como deve estar agora:

```js
// server.js: o primeiro servidor do catálogo de equipamentos da escola.
// Fica à escuta na porta 3000 e responde a dois pedidos GET.
import express from "express";

const app = express();
const PORTA = 3000;

// Os equipamentos ficam num array, em memória: existem enquanto o servidor
// estiver ligado. Mais à frente passam para uma base de dados.
const equipamentos = [
  { id: 1, nome: "Portátil", sala: "B12" },
  { id: 2, nome: "Projetor", sala: "A03" },
  { id: 3, nome: "Impressora", sala: "Secretaria" },
  { id: 4, nome: "Monitor", sala: "B12" },
];

// Rota 1: um pedido GET a / recebe um texto.
app.get("/", (req, res) => {
  res.send("Olá! O servidor está a funcionar.");
});

// Rota 2: um pedido GET a /equipamentos recebe a lista em JSON.
app.get("/equipamentos", (req, res) => {
  res.json(equipamentos);
});

// Liga o servidor: a partir daqui fica à escuta na porta 3000.
// Se não conseguir (por exemplo, porque a porta já está ocupada),
// o Express chama esta função com o erro.
app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
```

O ficheiro lê-se pela ordem em que corre no arranque: a aplicação e os dados no topo, as duas rotas no meio e o `listen` no fim. É o mesmo código da pasta de exemplos [catalogo-de-equipamentos](../../exemplos/aplicacoes-em-browser/catalogo-de-equipamentos/README.md).

Pensa antes de continuares: quem respondeu a cada um dos três pedidos? A resposta: a `/`, o `res.send` da rota 1; a `/equipamentos`, o `res.json` da rota 2. A `/nao-existe`, o próprio Express, como na Paragem 6.

## Fase 8: O arranque corre uma vez, e a função de uma rota a cada pedido

Acrescentas uma mensagem dentro da rota da lista e contas quantas vezes ela aparece no terminal. O arranque corre uma vez, quando ligas o servidor, e a função de uma rota corre uma vez por cada pedido a esse caminho. Rever: [O arranque corre uma vez, e a função de uma rota a cada pedido](../02-primeiro-servidor.md#o-arranque-corre-uma-vez-e-a-função-de-uma-rota-a-cada-pedido).

1. No `server.js`, dentro da função da rota `/equipamentos`, antes do `res.json`, acrescenta:

   ```js fragment
   console.log("Alguém pediu a lista de equipamentos");
   ```

2. Guarda. No terminal, carrega em Ctrl+C e volta a ligar o servidor, para o Node ler a linha nova. Antes de fazeres pedidos, prevê: a frase aparece quando o servidor liga? E quantas vezes aparece, se pedires a lista três vezes e a página inicial uma vez?

3. No browser, abre `http://localhost:3000/equipamentos` e recarrega-o até o teres pedido três vezes. Depois, abre `http://localhost:3000/` uma vez. Olha para o terminal do servidor.

   O que deves ver:

   ```text
   Servidor a correr em http://localhost:3000
   Alguém pediu a lista de equipamentos
   Alguém pediu a lista de equipamentos
   Alguém pediu a lista de equipamentos
   ```

   A resposta à previsão: a frase não aparece no arranque, e aparece três vezes, uma por cada pedido à lista. O pedido à página inicial corre a função da rota 1, que não tem a frase.

### Paragem 8

Cada pedido à lista escreve uma linha no terminal do servidor.

Pensa antes de continuares: que linhas do `server.js` correm no arranque, e quais esperam por um pedido? A resposta: no arranque correm o `import`, a criação da `app`, a constante `PORTA`, o array, os dois `app.get`, que só registam as rotas, e o `app.listen`. O que está dentro das funções das rotas, o `console.log`, o `res.send` e o `res.json`, só corre quando chega um pedido a esse caminho.

## Fase 9: Uma mensagem de erro lê-se pelo tipo e pela linha

Provocas quatro erros, um de cada vez, e escreves cada um no registo de arranque, um comentário no fim do `server.js`. Uma mensagem de erro lê-se pela linha que começa pelo tipo do erro e pela linha com o nome do ficheiro e o número da linha. Rever: [Uma mensagem de erro lê-se pelo tipo e pela linha](../02-primeiro-servidor.md#uma-mensagem-de-erro-lê-se-pelo-tipo-e-pela-linha).

1. No fim do `server.js`, depois da última linha, acrescenta o início do registo de arranque, e guarda. Fica no fim para as linhas do código não mudarem de número enquanto o escreves:

   ```js fragment
   // Registo de arranque
   //
   // Erro 1: a porta ocupada
   // Caso:
   // Esperado:
   // Obtido:
   // Tipo de erro:
   // Hipótese:
   // Linha da mensagem:
   // Correção:
   // Depois da correção:
   ```

2. Em cada erro, completas as linhas do registo:

   - Caso, Esperado e Obtido: o que fizeste, o que devia acontecer e o que aconteceu, com o servidor a arrancar ou não.
   - Tipo de erro: de escrita, que o Node recusa antes de correr o ficheiro, ou de execução, que aparece com o programa a correr. Há ainda o de lógica, em que o programa corre e dá o resultado errado.
   - Hipótese: a causa que achas que é.
   - Linha da mensagem: a linha que confirma a hipótese, copiada do terminal.
   - Correção: o que mudaste, uma causa de cada vez.
   - Depois da correção: o caso repetido e os pedidos que já funcionavam, e o que mudou.

   Escreves as linhas até à da mensagem logo que vês o erro, antes de leres a resposta e de mudares o código. A correção e o depois da correção ficam para o fim. Para os erros 2, 3 e 4, copia as linhas do erro 1, muda o número e o nome, e completa-as.

### Erro 1: a porta ocupada

1. Com o servidor ligado, abre um segundo terminal: no painel do terminal do editor, carrega no "+". O terminal novo abre na tua pasta de trabalho, por isso entra na pasta do servidor e liga-o outra vez:

   ```bash
   cd catalogo-de-equipamentos
   node server.js
   ```

   O que deves ver, no segundo terminal:

   ```text
   Não foi possível ligar o servidor: listen EADDRINUSE: address already in use :::3000
   ```

   E o segundo terminal fica outra vez livre. No browser, `http://localhost:3000/` continua a responder: o primeiro servidor continua a funcionar.

2. No registo, escreve o erro 1 até à linha da mensagem, com a linha que o segundo terminal mostrou.

3. Pensa: que linha do teu `server.js` escreveu esta mensagem? E sem o `if (erro)`, o que teria aparecido? A resposta: o `console.error` que está dentro do `if (erro)`, na função do `listen`. Sem essa verificação, a função escrevia `Servidor a correr em http://localhost:3000`, mesmo sem ter conseguido a porta. É um erro de execução: o ficheiro não tem erros, e foi o `listen` que falhou, com o programa já a correr.

4. Correção: o segundo processo já terminou sozinho, e não há código para mudar. Para teres dois servidores ao mesmo tempo, o segundo precisava de outra porta. No registo, a correção é não ligar um segundo servidor na mesma porta, e o depois da correção é o primeiro servidor a responder a `/` e a `/equipamentos`. Completa essas duas linhas e guarda. Depois, fecha o segundo terminal, no caixote do lixo do painel.

### Erro 2: o pacote mal escrito

1. No primeiro terminal, para o servidor com Ctrl+C. No `server.js`, na linha do `import`, apaga o último `s` de `"express"`, para ficar `"expres"`. Guarda e corre `node server.js`.

   O que deves ver: várias linhas, e nenhuma diz `Servidor a correr`. A primeira começa por `node:internal/`, e por isso é do próprio Node, e não tua. A que interessa começa pelo tipo do erro:

   ```text
   Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'expres' imported from .../catalogo-de-equipamentos/server.js
   ```

2. No registo, escreve o erro 2 até à linha da mensagem.

3. Isto acontece porque o Node não encontrou o pacote `expres` na `node_modules`. Recusou o ficheiro antes de correr qualquer linha, e por isso não aparece a mensagem do `listen`. É um erro de escrita.

4. Correção: repõe `"express"`, guarda e liga o servidor. O terminal mostra outra vez `Servidor a correr em http://localhost:3000`. Completa o erro 2 no registo, e guarda.

### Erro 3: o "type" errado

1. Para o servidor com Ctrl+C. No `package.json`, na linha do `"type"`, muda a palavra `module` para `commonjs`, sem mexer nas aspas nem na vírgula do fim. Guarda e corre `node server.js`. Se o Node escrever `Invalid package config`, vê [O package.json deixou de funcionar depois de mudar o "type"](#o-packagejson-deixou-de-funcionar-depois-de-mudar-o-type).

   O que deves ver: primeiro, um aviso (`Warning`) que acaba em `Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.`. Depois, o caminho do teu `server.js` com `:3` no fim, a linha do `import` e uma fila de `^` por baixo dela. A seguir, a linha do tipo do erro:

   ```text
   SyntaxError: Cannot use import statement outside a module
   ```

2. No registo, escreve o erro 3 até à linha da mensagem.

3. Isto acontece porque, com `"type": "commonjs"`, o Node lê o ficheiro como CommonJS, o sistema de módulos antigo, que usa `require`, e recusa o `import` da linha 3. O próprio aviso diz a correção. É um erro de escrita, que o Node recusa antes de correr o ficheiro, apesar de a causa estar no `package.json`.

4. Correção: repõe `"type": "module"`, guarda e liga o servidor. Completa o erro 3 no registo, e guarda.

### Erro 4: um erro que só aparece com um pedido

1. Para o servidor com Ctrl+C. Na rota de `/`, muda `res.send` para `res.sendd`. Guarda.

2. Antes de ligares o servidor, prevê: ele vai arrancar? Depois, liga-o com `node server.js`.

   O que deves ver: `Servidor a correr em http://localhost:3000`, como sempre. A resposta à previsão: arranca.

3. No browser, abre `http://localhost:3000/equipamentos`. O que deves ver: a lista, como antes, e no terminal a frase da fase 8.

4. Abre `http://localhost:3000/`. O que deves ver: no browser, uma página com `TypeError: res.sendd is not a function` e várias linhas começadas por `at`; no separador Rede, o código 500. No terminal, a mesma linha do tipo do erro e, por baixo, a linha com o teu ficheiro. O número é o da linha do `res.sendd`, que no ficheiro da Paragem 7 é a 19:

   ```text
   TypeError: res.sendd is not a function
       at file:///.../catalogo-de-equipamentos/server.js:19:7
   ```

5. No registo, escreve o erro 4 até à linha da mensagem.

6. Pensa: porque é que o servidor arrancou, apesar do erro? A resposta: o `res.sendd` está dentro da função da rota de `/`, que não corre no arranque. Só corre quando chega um pedido a `/`. A rota da lista tem outra função, sem o erro, e continua a responder. É um erro de execução: aparece com o programa a correr e interrompe a resposta a `/`, mas o servidor continua ligado.

7. Correção: repõe `res.send` e guarda. No terminal, carrega em Ctrl+C, volta a ligar o servidor e confirma que `/` volta a mostrar `Olá! O servidor está a funcionar.` Completa o erro 4 no registo, e guarda.

### Paragem 9

O `server.js` tem outra vez todos os nomes certos e o `package.json` tem `"type": "module"`. O `/` e o `/equipamentos` respondem com 200, e o registo de arranque, no fim do `server.js`, tem os quatro erros.

Pensa antes de continuares: dos quatro erros, quais impediram o servidor de arrancar, e qual só apareceu com um pedido? A resposta: os erros 2 e 3 impediram o arranque, e o erro 1 impediu o arranque do segundo servidor, enquanto o primeiro continuava a responder. O erro 4 só apareceu com o pedido a `/`.

## Fase 10: Um commit guarda uma fotografia do projeto

Guardas o projeto no Git, num primeiro commit, sem a pasta `node_modules`. O commit guarda uma fotografia dos ficheiros preparados com o `git add`, e o `.gitignore` deixa de fora o que não se guarda. Rever: [Um commit guarda uma fotografia do projeto](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/01-acesso-a-dados/03-arquitetura-e-setup-node.md#um-commit-guarda-uma-fotografia-do-projeto) e [O .gitignore deixa os segredos fora do Git](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/01-acesso-a-dados/03-arquitetura-e-setup-node.md#o-gitignore-deixa-os-segredos-fora-do-git).

1. Se o servidor estiver ligado, para-o com Ctrl+C. Na pasta `catalogo-de-equipamentos`, ao lado do `package.json`, cria o ficheiro `.gitignore` com uma só linha, e guarda:

   ```text
   node_modules/
   ```

   É a pasta que nunca se guarda no Git, porque se recria com `npm install`.

2. Começa o histórico do Git nesta pasta:

   ```bash
   git init
   ```

   O que deves ver: `Initialized empty Git repository in`, o caminho da pasta e `.git/`. Antes, podem aparecer umas linhas começadas por `hint:`, que podes ignorar.

3. Vê o estado da pasta:

   ```bash
   git status --short
   ```

   O que deves ver:

   ```text
   ?? .gitignore
   ?? package-lock.json
   ?? package.json
   ?? server.js
   ```

   A pasta `node_modules` não aparece, porque o `.gitignore` a deixou de fora. Se aparecer, confirma que o ficheiro se chama `.gitignore`, sem `.txt` no fim, e que está ao lado do `package.json`.

4. Diz ao Git quem és, só neste projeto, sem o `--global`, para a configuração não passar para quem usar o computador a seguir. Troca o texto entre aspas pelo teu nome e pelo teu email:

   ```bash
   git config user.name "O teu nome"
   git config user.email "o teu email da escola"
   ```

   O que deves ver: nenhuma mensagem.

5. Prepara os ficheiros e faz o commit, com uma mensagem que diz o que o servidor faz:

   ```bash
   git add .
   git commit -m "Primeiro servidor do catálogo, com as rotas / e /equipamentos"
   ```

   O que deves ver: uma linha como `[master (root-commit) 3aced23]`, seguida da mensagem, e depois `4 files changed` e uma linha `create mode 100644` por cada um dos quatro ficheiros. Noutros computadores, o ramo chama-se `main` em vez de `master`, e o código do commit é sempre outro.

6. Confirma o histórico e o estado:

   ```bash
   git log --oneline
   git status
   ```

   O que deves ver: o `git log --oneline` mostra um commit, com o código curto à frente da mensagem. O `git status` acaba em `nothing to commit, working tree clean`: não ficou nada por guardar.

### Paragem 10

O projeto está no Git, com um commit, e a pasta `node_modules` ficou de fora.

Pensa antes de continuares: um colega copia o teu projeto do Git para outro computador, corre `node server.js` e recebe `Cannot find package 'express'`. Porquê, e o que tem de fazer? A resposta: a pasta `node_modules` não está no Git, e por isso o Express não veio com o projeto. Tem de correr `npm install` na pasta do projeto, que instala o que o `package.json` e o `package-lock.json` dizem.

## Se alguma coisa falhar

1. Estás na pasta certa? No terminal, `pwd` mostra a pasta atual (na linha de comandos clássica do Windows, `cd`, sem mais nada). Os comandos do npm e o `node server.js` correm na pasta `catalogo-de-equipamentos`, a do `package.json`. Se o Node escrever `Error: Cannot find module` e um caminho acabado em `server.js`, estás noutra pasta: entra na do servidor com `cd catalogo-de-equipamentos`.
2. Guardaste o ficheiro e voltaste a ligar o servidor? O servidor só lê o `server.js` quando arranca: depois de cada alteração, guarda, para-o com Ctrl+C e liga-o com `node server.js`.
3. O servidor está ligado? O terminal tem de mostrar `Servidor a correr em http://localhost:3000` e estar ocupado.
4. O teu ficheiro está igual ao do laboratório? Compara o teu `server.js` com o da [Paragem 7](#paragem-7), ou com a pasta de exemplos [catalogo-de-equipamentos](../../exemplos/aplicacoes-em-browser/catalogo-de-equipamentos/README.md), e o teu `package.json` com o da [Paragem 4](#paragem-4). Depois da fase 8, o teu `server.js` tem a mais a linha do `console.log` e, depois da fase 9, o registo.

### O terminal não conhece o comando node

O Node não está instalado, ou o Visual Studio Code foi aberto antes de o instalarem. Fecha o Visual Studio Code e abre-o outra vez, para o terminal novo já conhecer o Node. Se continuar, chama o professor.

### O npm não corre na PowerShell do Windows

Aparece uma mensagem a dizer que o ficheiro `npm.ps1` não pode ser carregado, porque a execução de scripts está desativada. É uma regra de segurança do Windows: não a mudes. Usa a linha de comandos clássica: no painel do terminal do Visual Studio Code, carrega na seta ao lado do "+" e escolhe "Command Prompt". O terminal novo abre na tua pasta de trabalho: entra outra vez na pasta do servidor, com `cd catalogo-de-equipamentos`. Também podes escrever `npm.cmd` em vez de `npm`, por exemplo `npm.cmd install express`.

### O npm install falha ou fica parado

Sem internet, o npm não consegue ir buscar o Express: o comando fica parado muito tempo, ou acaba com linhas começadas por `npm error`. Avisa o professor e pede-lhe a pasta preparada para os computadores da sala. Tem o `package.json`, o `package-lock.json` e a pasta `node_modules`, já com o Express. Copia os três para dentro da tua pasta `catalogo-de-equipamentos` e aceita substituir o teu `package.json`. Depois, continua no passo 2 da fase 3.

Na fase 9, o registo de arranque leva uma linha a mais. Por baixo de `// Registo de arranque`, escreve `// Usei a pasta preparada pelo professor.` Quando houver internet, apaga a pasta `node_modules` e corre `npm install` na tua pasta, que é o passo que ficou por fazer.

Não copies uma pasta `node_modules` de outro computador por tua iniciativa: a pasta preparada é a que serve para os computadores da sala. Se aparecer uma mensagem com `EACCES` ou `permission denied`, não uses `sudo` nem mudes permissões: chama o professor.

### O package.json deixou de funcionar depois de mudar o "type"

O npm escreve `npm error code EJSONPARSE`, com a linha e a coluna do problema, e o Node escreve `Error: Invalid package config`, com o caminho do `package.json`. Ao mudares a linha do `"type"`, apagaste ou acrescentaste uma vírgula ou uma aspa. Compara o teu com o `package.json` da [Paragem 4](#paragem-4): cada linha dentro das chavetas acaba com vírgula, menos a última de cada bloco.

### O servidor não arranca

Lê primeiro a linha que começa pelo tipo do erro, como `SyntaxError`, `TypeError` ou `Error`. Depois, a linha com o nome do teu ficheiro e o número da linha. As linhas começadas por `at` podes ignorá-las, menos a que tem o nome do teu ficheiro. Estas são as mensagens mais comuns:

- `Cannot use import statement outside a module`: o `"type"` do `package.json` não é `"module"`. Corre `npm pkg set type=module`, como na fase 4.
- `Cannot find package 'express'`: o Express não está instalado nesta pasta. Confirma que estás na pasta do servidor e corre `npm install express`, como na fase 3.
- `EADDRINUSE`: a porta 3000 está ocupada. Vê [A porta 3000 está ocupada, e não sabes onde está o servidor](#a-porta-3000-está-ocupada-e-não-sabes-onde-está-o-servidor).
- `SyntaxError`, com outra mensagem: falta fechar uma aspa, um parêntese ou uma chaveta. Uma aspa por fechar aponta a linha certa. Um parêntese ou uma chaveta por fechar pode apontar o fim do ficheiro, depois do registo: procura, a subir, o que abriste e não fechaste.
- `is not a function` ou `is not defined`: um nome mal escrito, como `app.gett`. A linha com o nome do teu ficheiro diz onde está.

### O browser mostra uma página de erro, e não a resposta do servidor

Se a página diz que o `localhost` recusou a ligação, o servidor não está a correr, ou a porta do endereço não é a 3000. Confirma no terminal que está lá `Servidor a correr em http://localhost:3000` e usa exatamente esse endereço. Se a página fala de uma ligação segura, escreveste `https` em vez de `http`: o teu servidor só fala `http`.

### A porta 3000 está ocupada, e não sabes onde está o servidor

No Visual Studio Code é fácil ter vários terminais abertos, e um servidor ligado num que já não vês. Na lista dos terminais, do lado direito do painel, procura o que está ocupado e mostra `Servidor a correr`, e para-o com Ctrl+C. Não feches trabalhos nem pares processos que não reconheces. Se não o encontrares, chama o professor.

## Desafios

1. Acrescenta `GET /salas`, com os nomes das salas onde há equipamentos, sem repetições. Mantém a lista completa de equipamentos a funcionar.

## Antes de terminares

- [ ] Os três pedidos da fase 7 têm os códigos e os tipos de conteúdo esperados.
- [ ] Corrigiste os quatro erros da fase 9 e repetiste os pedidos que já funcionavam.
- [ ] O registo de arranque tem os quatro erros, cada um com todas as linhas preenchidas, do caso ao depois da correção, e a hipótese escrita antes de leres a resposta.
- [ ] No registo, o obtido de cada erro diz se o servidor chegou a arrancar.
- [ ] Consegues explicar, por palavras tuas, porque é que a função de uma rota não corre no arranque.
- [ ] O `git log --oneline` mostra o commit, e a `node_modules` não está nele.

![Rodapé](../../imagens/rodape.png)
