![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: Primeiro servidor

Laboratório do tema Primeiro servidor. Vais construir um catálogo com duas rotas e um registo de arranque. Depois provocas quatro erros, um de cada vez, para aprenderes a lê-los e a corrigir a causa. Avança ao teu ritmo. O [guia](02-primeiro-servidor.md) tem a teoria completa.


## O que vais construir

O resultado é um servidor que responde ao browser e uma tabela que explica o seu arranque e os erros provocados.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | Confirmas Node e npm | Sabes quais são as versões instaladas |
| 2 | Escreves `ola.js` | Um programa escreve e termina |
| 3 | Preparas o projeto | O Express está instalado e os módulos ES definidos |
| 4 | Escreves `server.js` | O ficheiro tem duas rotas e inicia a escuta |
| 5 | Fazes três pedidos | Distingues HTML, JSON e o 404 do Express |
| 6 | Acrescentas um registo | Vês uma mensagem por pedido à lista |
| 7 | Provocas quatro erros | Corriges cada causa e voltas a testar |
| 8 | Paras o servidor | Reconheces uma ligação recusada |
| 9, opcional | Guardas no Git | Guardas os ficheiros sem os pacotes instalados |

## Palavras que vais usar

- **Node.js**: programa que executa JavaScript fora do browser.
- **Terminal**: janela onde escreves comandos e lês as mensagens do servidor.
- **npm**: programa que instala os pacotes de que o projeto precisa.
- **Pacote**: código preparado para ser instalado e usado, como o Express.
- **Módulo ES**: ficheiro que usa `import` e `export` para partilhar código.
- **Express**: pacote que liga caminhos e métodos HTTP às funções que respondem.
- **Rota**: método e caminho reconhecidos pela aplicação, com a função que responde.
- **Porta**: número pelo qual o browser chega ao programa à escuta.
- **JSON**: texto que representa dados, como um array de objetos.
- **Processo**: programa que está a correr.
- **Arranque**: preparação que o servidor executa uma vez ao ser ligado.
- **Commit**: registo de uma versão dos ficheiros no Git, usado só na fase opcional.

## O que precisas

Precisas de:

- o Node.js 24 instalado, para executar o JavaScript do servidor;
- um editor de código, como o Visual Studio Code;
- um terminal: o do sistema ou o que está dentro do editor;
- internet, para o `npm install` da parte 3;
- o browser com as ferramentas de programador, como no laboratório do primeiro tema.

Ao longo do laboratório vais preencher um **registo de arranque**: uma pequena tabela, no caderno ou num ficheiro de texto, com o que fizeste e o que aconteceu. É o artefacto deste tema, e serve para mostrares que sabes pôr um servidor a correr e explicar porque é que ele não arrancou quando não arrancou. Prepara-a já:

| Parte | Comando ou ação | O que aconteceu | Se houve erro: a linha que interessa e a correção |
| --- | --- | --- | --- |
| | | | |

## Se alguma coisa falhar

1. Confirma a pasta atual com `pwd`, ou com `cd` sem argumentos na Linha de comandos do Windows. Procura o teu `package.json` com `ls` ou `dir`.
2. O servidor tem de continuar a correr num terminal para o browser lhe conseguir pedir páginas.
3. Depois de alterar o código, guarda o ficheiro e reinicia só o teu servidor com Ctrl+C e `node server.js`.
4. Lê primeiro a linha com `SyntaxError`, `TypeError` ou `Error`. Depois procura o teu ficheiro e a linha indicada.
5. Se a porta estiver ocupada, procura o terminal do teu servidor. Não pares processos de outras pessoas.

## Fase 1: verificar as ferramentas

Para saber mais: no [guia do tema](02-primeiro-servidor.md), secção "O Node.js: JavaScript fora do browser".

1. No Visual Studio Code, abre o menu "Terminal" e escolhe "Novo Terminal". Também podes abrir o terminal do sistema. Surge uma linha onde podes escrever comandos.
Os nomes dos menus são os que deves procurar; se a tradução do teu editor diferir, pede ajuda ao professor.

2. Escreve `node --version` e carrega em Enter. Deve aparecer uma versão começada por `v`, como `v24.17.0`.
3. Escreve `npm --version`. Deve aparecer um número, como `11.13.0`, sem o `v`.
4. Regista as duas versões na primeira linha do registo de arranque.

Se o terminal disser que `node` não é reconhecido como comando, o Node não está instalado, ou o terminal foi aberto antes da instalação. Fecha o terminal e abre outro; se continuar, chama o professor.

### Paragem 1

Registaste duas versões. Se o Node ou o npm não forem encontrados, resolve isso com o professor antes de avançar.

## Fase 2: um programa que acaba

Para saber mais: no [guia do tema](02-primeiro-servidor.md), secção "Primeiro contacto".

1. Cria uma pasta de trabalho para as aulas de Sistemas de Informação, por exemplo `si`, num sítio teu, como os Documentos. Não a cries dentro do repositório dos materiais.
2. Abre essa pasta no editor. No explorador de ficheiros, cria um ficheiro com o nome `ola.js`. Antes de o correres, prevê: o terminal vai ficar ocupado? Escreve o ficheiro completo:

   ```js
   // ola.js: um programa que escreve duas linhas e termina.
   const escola = "EPMS";
   console.log(`Olá, ${escola}!`);
   console.log("Este JavaScript está a correr no Node, e não num browser.");
   ```

   Leitura guiada: o ficheiro define o nome da escola e usa-o na primeira mensagem. A segunda chamada escreve outra linha; depois não há mais trabalho e o processo termina.

3. No terminal, vai para essa pasta com `cd` e corre `node ola.js`.

O que deves ver: as duas linhas, e o terminal outra vez livre, à espera do comando seguinte. O programa correu de cima para baixo e terminou. Guarda esta imagem para comparar com a parte 5.

### Paragem 2

`ola.js` escreve duas linhas e devolve o terminal. A previsão confirma-se: este processo termina.

## Fase 3: preparar a pasta do servidor

Para saber mais: no [guia do tema](02-primeiro-servidor.md), secções "O npm e o ficheiro package.json" e "Módulos ES".

1. Dentro da pasta `si`, cria uma pasta `catalogo-de-equipamentos` e entra nela no terminal:

   ```bash
   mkdir catalogo-de-equipamentos
   cd catalogo-de-equipamentos
   ```

2. Cria o `package.json`:

   ```bash
   npm init -y
   ```

   O npm mostra o conteúdo do ficheiro que criou. Abre-o no editor e procura a linha do `"type"`. Se existir, pode dizer `"commonjs"`.

3. Define o campo com `npm pkg set type=module` no terminal e abre de novo o ficheiro para conferir. O comando acrescenta o campo se faltar e altera-o se existir. A linha fica `"type": "module"`. Não mexas nas aspas nem na pontuação: como é a última linha dentro das chavetas, não tem vírgula no fim, e não deve passar a ter. Uma vírgula a mais ou a menos faz o ficheiro deixar de ser JSON válido, e o npm queixa-se no passo seguinte.

4. Instala o Express:

   ```bash
   npm install express
   ```

   No fim, o npm escreve uma linha como `added 65 packages`. O número pode variar um pouco com a versão.

5. Olha para a pasta, no editor. Tem agora:
   - a pasta `node_modules`, com dezenas de pastas lá dentro;
   - o ficheiro `package-lock.json`;
   - no `package.json`, uma secção nova, `dependencies`, com o Express e a versão.

6. Regista no registo de arranque os três comandos desta parte e o que cada um mudou na pasta.

Pensa antes de continuares: como recrias `node_modules`? A resposta: `npm install`, sem argumentos, lê as dependências do `package.json` e as versões do `package-lock.json`.

### Paragem 3

`package.json` tem `"type": "module"` e o Express nas dependências; `node_modules` e `package-lock.json` existem.

## Fase 4: escrever o servidor

Para saber mais: no [guia do tema](02-primeiro-servidor.md), secção "Exemplo guiado", passos 2 e 3.

Quando chega um pedido, o Express chama a função da rota com dois objetos: `req` e `res`. O `req` contém os dados do pedido, como o método e o caminho. O `res` permite preparar e enviar a resposta ao browser.

`res.send(...)` envia o conteúdo indicado; quando recebe texto, o Express usa o tipo HTML. `res.json(...)` transforma arrays ou objetos em texto JSON e envia a resposta com esse tipo de conteúdo. Por isso, a primeira rota envia uma frase e a segunda envia a lista de equipamentos em JSON. Estas respostas vão para o browser; o `console.log` escreve no terminal do servidor.

1. Na pasta `catalogo-de-equipamentos`, cria o ficheiro `server.js`.
2. Escreve o `server.js` completo. Lê cada linha e tenta dizer o seu papel.

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

Leitura guiada: primeiro o ficheiro importa o Express e cria a aplicação e os dados. As chamadas `app.get` registam as duas rotas. O `listen` tenta iniciar a escuta e escreve o resultado no terminal.
3. Guarda o ficheiro.

Antes de o correres, prevê: que linhas correm no arranque e quais esperam por um pedido? A resposta: o arranque cria os dados, regista as rotas e liga a escuta. O interior de cada função de rota só corre quando chega um pedido correspondente.

### Paragem 4

Guarda o ficheiro e corre `node server.js`. A mensagem de arranque confirma que está à escuta. Para o teu servidor com Ctrl+C; vais voltar a ligá-lo na fase seguinte. Se falhar, lê a mensagem antes de avançar.

## Fase 5: ligar e observar

Para saber mais: no [guia do tema](02-primeiro-servidor.md), passos 5 a 7 do exemplo guiado.

1. No terminal, na pasta `catalogo-de-equipamentos`, liga o servidor:

   ```bash
   node server.js
   ```

   O que deves ver: `Servidor a correr em http://localhost:3000`, e o terminal ocupado. Compara com a parte 2: este programa não terminou. Está à escuta.

2. No browser, abre as ferramentas de programador no separador Rede e abre, um de cada vez:
   - `http://localhost:3000/`
   - `http://localhost:3000/equipamentos`
   - `http://localhost:3000/nao-existe`

3. Para cada um, regista no caderno o código de estado e o tipo de conteúdo (o cabeçalho `content-type` da resposta, nos cabeçalhos do pedido). Devem ser, por esta ordem: 200 com `text/html`, 200 com `application/json` e 404 com `text/html`.

4. Para cada um dos três, identifica quem respondeu. A resposta: `res.send` responde a `/` e `res.json` responde a `/equipamentos`. No terceiro pedido nenhuma rota tua corresponde; o próprio Express responde 404.

### Paragem 5

A tabela tem 200/HTML, 200/JSON e 404/HTML, por esta ordem.

## Fase 6: o servidor fala no terminal

Para saber mais: no [guia do tema](02-primeiro-servidor.md), secção "O que corre onde, agora com código".

1. Dentro da função da rota `/equipamentos`, antes do `res.json`, acrescenta:

   ```js fragment
   console.log("Alguém pediu a lista de equipamentos");
   ```

2. Guarda o ficheiro. No browser, recarrega `http://localhost:3000/equipamentos`. Olha para o terminal: apareceu a frase?

   Não apareceu. O servidor está a correr o código que leu quando arrancou (guia: secção "Um programa que não acaba").

3. No terminal, para o servidor com Ctrl+C e volta a ligá-lo com `node server.js`.
4. Antes de continuares, prevê: se pedires a lista três vezes e a página inicial uma vez, quantas vezes aparece a frase no terminal? Escreve a previsão.
5. Faz os quatro pedidos e conta. A resposta à previsão é três: só os pedidos à lista passam pela função onde acrescentaste a mensagem.

O que deves ver: a frase três vezes, uma por cada pedido à lista, e nenhuma pelo pedido à página inicial. Nada disto aparece no browser, nem na consola das ferramentas de programador: o `console.log` corre no servidor e escreve no terminal do servidor.

6. Regista no registo de arranque o que aconteceu antes e depois de reiniciares.

### Paragem 6

Depois do reinício, três pedidos à lista produzem três mensagens no terminal.

## Fase 7: provocar e corrigir erros

Para saber mais: no [guia do tema](02-primeiro-servidor.md), secção "Erros de arranque e como os ler".

Esta é a parte que conta como evidência do tema. Em cada erro, faz sempre os mesmos cinco passos, e regista-os no registo de arranque:

1. Observa o caso e escreve o resultado esperado e o obtido. Distingue um erro de escrita, de execução ou de lógica.
2. Formula uma hipótese sobre a causa, antes de mudar o código.
3. Verifica a hipótese com a linha da mensagem e o ficheiro indicado.
4. Corrige uma causa de cada vez.
5. Repete o caso e os pedidos que já passavam, e explica o que mudou.

### Erro 1: a porta ocupada

1. Com o servidor ligado num terminal, abre um segundo terminal, vai para a mesma pasta e corre outra vez `node server.js`.
2. O segundo terminal mostra `Não foi possível ligar o servidor: listen EADDRINUSE: address already in use :::3000` e fica outra vez livre. O primeiro servidor continua a funcionar: confirma no browser.
3. Esta mensagem foi escrita por que linha do teu `server.js`? Sem o `if (erro)`, o que teria aparecido? A resposta: o `console.error` do `listen` escreve a mensagem de erro. Sem essa verificação, a função anunciaria que o servidor estava a correr, mesmo sem ter conseguido a porta.
4. Correção: fecha o segundo terminal. Se quisesses mesmo dois servidores ao mesmo tempo, terias de dar ao segundo outra porta.

### Erro 2: o pacote mal escrito

1. Para o servidor. No `server.js`, na linha do `import`, apaga o último `s` de `"express"`, para ficar `"expres"`. Guarda.
2. Corre `node server.js`.
3. Procura a linha que começa por `Error [ERR_MODULE_NOT_FOUND]`. Diz `Cannot find package 'expres'`. O servidor chegou a ligar? A resposta: não. O `import` falhou antes de criar a aplicação e de chegar ao `listen`.
4. Correção: repõe `"express"`, guarda e liga o servidor.

### Erro 3: o "type" errado

1. Para o servidor. No `package.json`, na linha do `"type"`, muda outra vez a palavra `module` para `commonjs`, sem mexer na pontuação. Guarda.
2. Corre `node server.js`.
3. Procura a linha que começa por `SyntaxError`. Diz `Cannot use import statement outside a module`, e por cima o Node mostra a linha do `import`. Lê também o aviso que vem antes: o próprio Node sugere a correção.
4. Correção: repõe `"type": "module"` e liga o servidor.

### Erro 4: um erro que só aparece com um pedido

1. Para o servidor. Na rota `/`, muda `res.send` para `res.sendd`. Guarda.
2. Prevê: o servidor vai arrancar?
3. Corre `node server.js`. Arranca, e escreve a mensagem do costume.
4. No browser, abre `http://localhost:3000/equipamentos`. Funciona.
5. Abre `http://localhost:3000/`. No separador Rede, o código é 500. No terminal aparece `TypeError: res.sendd is not a function`.
6. Explica por que o servidor arrancou apesar do erro. A resposta: `res.sendd` está dentro da função de `/`, que não corre no arranque. A rota da lista tem outra função, sem esse erro, e continua a responder.
7. Correção: repõe `res.send`, reinicia o servidor e confirma que `/` volta a responder 200.

### Paragem 7

Repuseste todos os nomes e o `type`. `/` e `/equipamentos` voltam a responder 200.

## Fase 8: parar o servidor

1. No terminal do servidor, Ctrl+C.
2. No browser, recarrega `http://localhost:3000/`.

O que deves ver: a página de "ligação recusada" do primeiro tema, sem código de estado no separador Rede. Já sabes porquê: nenhum programa está a escutar na porta 3000.

### Paragem 8

Sem o processo, o browser não recebe um código de estado.

## Fase 9 (opcional): guardar o trabalho no Git

Esta parte é só para quem já usou o Git em Linguagens de Programação. Se ainda não usaste, salta-a: o Git é dado lá.

1. Na pasta `catalogo-de-equipamentos`, cria um ficheiro `.gitignore` com uma só linha: `node_modules/`. É a pasta que nunca se guarda, porque se recria com `npm install`.
2. Corre `git init` e depois `git status`. Confirma que a pasta `node_modules` não aparece na lista.
3. Corre `git add .` e faz o primeiro commit, com uma mensagem que descreva o que o servidor faz:

   ```bash
   git commit -m "Primeiro servidor do catálogo, com as rotas / e /equipamentos"
   ```

Uma boa mensagem de commit diz o que mudou, para quem a ler daqui a um mês perceber sem abrir os ficheiros. "Commit 1" ou "alterações" não dizem nada.

### Paragem 9

Se fizeste esta fase, `git status` não apresenta `node_modules` entre os ficheiros a guardar.

## Problemas frequentes

### No Windows, o npm não corre na PowerShell

Aparece uma mensagem a dizer que o ficheiro `npm.ps1` não pode ser carregado porque a execução de scripts está desativada. É uma regra de segurança do Windows. Não a mudes: usa a "Linha de comandos" (cmd) em vez da PowerShell, ou escreve `npm.cmd` em vez de `npm`, por exemplo `npm.cmd install express`. No Visual Studio Code, podes escolher a "Command Prompt" no menu do terminal.

### O npm install falha ou fica parado

O `npm install` precisa de internet. Se a rede da escola estiver em baixo, avisa o professor. Se aparecer uma mensagem com `EACCES` ou `permission denied`, não uses `sudo` nem mudes permissões por tua conta: chama o professor.

### O package.json deixou de funcionar depois de mudar o "type"

O npm escreve `npm error code EJSONPARSE`, seguido de linhas com `JSON.parse` e a posição do problema, e o Node escreve `Error: Invalid package config`, com o caminho do `package.json`. Ao mudares a linha do `"type"`, apagaste ou acrescentaste uma vírgula, ou uma aspa. Compara com o `package.json` do guia: cada linha dentro das chavetas acaba com vírgula, menos a última. A mensagem do npm diz a linha e a coluna onde o problema está, e mostra o texto à volta.

### Escrevi o código e o servidor não arranca

Lê a mensagem pela ordem da secção "Como ler uma mensagem de erro do Node" do guia: o tipo do erro primeiro, o ficheiro e a linha a seguir. Os erros mais comuns de escrita são uma aspa ou um parêntese por fechar (aparece um `SyntaxError` a apontar para a linha) e um nome mal escrito (`is not a function` ou `is not defined`).

### O servidor arranca, mas o browser mostra "ligação recusada"

O endereço tem `https` em vez de `http`, ou a porta não é a 3000. Confirma o endereço que o terminal escreveu e usa exatamente esse.

### Não sei em que terminal está o servidor

No Visual Studio Code é fácil ter vários terminais abertos. Procura o que diz "Servidor a correr" e está ocupado. Se não o encontrares, pede ajuda ao professor. Não feches outros trabalhos nem pares processos que não reconheces.

## O que fica no teu caderno

No fim do laboratório deves ter:

1. O registo de arranque tem as versões, os comandos das fases 3 e 5 e a experiência do `console.log` da fase 6. Inclui os quatro erros da fase 7. Cada um tem a previsão, a linha da mensagem que interessa e a correção;
2. as respostas às perguntas das partes 3, 4 e 5;
3. a explicação da parte 7, erro 4.

O professor vai pedir-te que expliques um dos erros: o que diz a mensagem, como soubeste onde procurar e o que corrigiste. É a evidência deste tema.

## Desafios

1. Acrescenta `GET /salas`, com os nomes das salas onde há equipamentos, sem repetições. Mantém a lista completa de equipamentos a funcionar.
2. Muda a mensagem da página inicial e confirma que só aparece depois de reiniciares o servidor.

## Antes de terminares

- [ ] Os três pedidos da fase 5 têm os códigos e tipos esperados.
- [ ] Corrigiste os quatro erros e repetiste os pedidos que já funcionavam.
- [ ] O registo distingue o arranque de cada pedido.
- [ ] Consegues explicar, por palavras tuas, por que a função de uma rota não corre no arranque.

![Rodapé](../imagens/rodape.png)
