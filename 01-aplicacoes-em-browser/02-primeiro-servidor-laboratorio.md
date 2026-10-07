![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o primeiro servidor

Laboratório do segundo tema do módulo Aplicações baseadas em browsers. Cerca de 90 minutos, em duas aulas. Vais construir do zero o servidor do catálogo de equipamentos, ligá-lo, observá-lo do lado do browser e do lado do terminal e, na parte mais importante, provocar de propósito os erros mais comuns de um primeiro servidor, para aprenderes a reconhecê-los e a corrigi-los.

Cada passo diz o que fazer e o que deves ver. As ideias estão explicadas no [guia do tema](02-primeiro-servidor.md), e cada parte diz em que secção. Quando o que vês não bater certo com o que está escrito, para, lê a mensagem e tenta perceber porquê antes de pedir ajuda: é exatamente isso que este laboratório treina.

## Antes de começar

Precisas de:

- o Node.js instalado, versão 22 ou 24;
- um editor de código, como o Visual Studio Code;
- um terminal: o do sistema ou o que está dentro do editor;
- internet, para o `npm install` da parte 3;
- o browser com as ferramentas de programador, como no laboratório do primeiro tema.

Ao longo do laboratório vais preencher um **registo de arranque**: uma pequena tabela, no caderno ou num ficheiro de texto, com o que fizeste e o que aconteceu. É o artefacto deste tema, e serve para mostrares que sabes pôr um servidor a correr e explicar porque é que ele não arrancou quando não arrancou. Prepara-a já:

| Parte | Comando ou ação | O que aconteceu | Se houve erro: a linha que interessa e a correção |
| --- | --- | --- | --- |
| | | | |

## Parte 1: verificar as ferramentas

Guia: secção "O Node.js: JavaScript fora do browser".

1. Abre um terminal.
2. Escreve `node --version` e carrega em Enter. Deve aparecer uma versão começada por `v`, como `v24.17.0`.
3. Escreve `npm --version`. Deve aparecer um número, como `11.13.0`, sem o `v`.
4. Regista as duas versões na primeira linha do registo de arranque.

Se o terminal disser que `node` não é reconhecido como comando, o Node não está instalado, ou o terminal foi aberto antes da instalação. Fecha o terminal e abre outro; se continuar, chama o professor.

## Parte 2: um programa que acaba

Guia: secção "Primeiro contacto".

1. Cria uma pasta de trabalho para as aulas de Sistemas de Informação, por exemplo `si`, num sítio teu, como os Documentos. Não a cries dentro do repositório dos materiais.
2. Abre essa pasta no editor e cria lá um ficheiro `ola.js` com:

   ```js
   // ola.js: um programa que escreve duas linhas e termina.
   const escola = "EPMS";
   console.log(`Olá, ${escola}!`);
   console.log("Este JavaScript está a correr no Node, e não num browser.");
   ```

3. No terminal, vai para essa pasta com `cd` e corre `node ola.js`.

O que deves ver: as duas linhas, e o terminal outra vez livre, à espera do comando seguinte. O programa correu de cima para baixo e terminou. Guarda esta imagem para comparar com a parte 5.

## Parte 3: preparar a pasta do servidor

Guia: secções "O npm e o ficheiro package.json" e "Módulos ES".

1. Dentro da pasta `si`, cria uma pasta `catalogo-de-equipamentos` e entra nela no terminal:

   ```text
   mkdir catalogo-de-equipamentos
   cd catalogo-de-equipamentos
   ```

2. Cria o `package.json`:

   ```text
   npm init -y
   ```

   O npm mostra o conteúdo do ficheiro que criou. Abre-o no editor e procura a linha do `"type"`. Deve dizer `"commonjs"`.

3. Nessa linha, muda só a palavra `commonjs` para `module`, e guarda o ficheiro. A linha fica `"type": "module"`. Não mexas nas aspas nem na pontuação: como é a última linha dentro das chavetas, não tem vírgula no fim, e não deve passar a ter. Uma vírgula a mais ou a menos faz o ficheiro deixar de ser JSON válido, e o npm queixa-se no passo seguinte.

4. Instala o Express:

   ```text
   npm install express
   ```

   No fim, o npm escreve uma linha como `added 68 packages`. O número pode variar um pouco com a versão.

5. Olha para a pasta, no editor. Tem agora:
   - a pasta `node_modules`, com dezenas de pastas lá dentro;
   - o ficheiro `package-lock.json`;
   - no `package.json`, uma secção nova, `dependencies`, com o Express e a versão.

6. Regista no registo de arranque os três comandos desta parte e o que cada um mudou na pasta.

Pergunta para o caderno: se apagares a pasta `node_modules`, que comando a recria, e de onde é que esse comando sabe o que instalar?

## Parte 4: escrever o servidor

Guia: secção "Exemplo guiado", passos 2 e 3.

1. Na pasta `catalogo-de-equipamentos`, cria o ficheiro `server.js`.
2. Escreve o código do passo 2 do exemplo guiado. Escreve-o, em vez de o copiar: ao escreveres cada linha, lês cada linha. Se fores muito lento a escrever, copia, mas lê cada linha antes de a colares e diz para ti o que ela faz.
3. Guarda o ficheiro.

Antes de o correres, responde no caderno: que linhas correm quando o servidor arranca? E que linhas só correm quando chega um pedido? (Guia: passo 4, "a ordem em que as coisas acontecem".)

## Parte 5: ligar e observar

Guia: passos 5 a 7 do exemplo guiado.

1. No terminal, na pasta `catalogo-de-equipamentos`, liga o servidor:

   ```text
   node server.js
   ```

   O que deves ver: `Servidor a correr em http://localhost:3000`, e o terminal ocupado. Compara com a parte 2: este programa não terminou. Está à escuta.

2. No browser, abre as ferramentas de programador no separador Rede e abre, um de cada vez:
   - `http://localhost:3000/`
   - `http://localhost:3000/equipamentos`
   - `http://localhost:3000/nao-existe`

3. Para cada um, regista no caderno o código de estado e o tipo de conteúdo (o cabeçalho `content-type` da resposta, nos cabeçalhos do pedido). Devem ser, por esta ordem: 200 com `text/html`, 200 com `application/json` e 404 com `text/html`.

4. Para cada um dos três, escreve que linha do `server.js` produziu a resposta. Cuidado com o terceiro: nenhuma linha tua o produziu. Quem respondeu?

## Parte 6: o servidor fala no terminal

Guia: secção "O que corre onde, agora com código".

1. Dentro da função da rota `/equipamentos`, antes do `res.json`, acrescenta:

   ```js fragment
   console.log("Alguém pediu a lista de equipamentos");
   ```

2. Guarda o ficheiro. No browser, recarrega `http://localhost:3000/equipamentos`. Olha para o terminal: apareceu a frase?

   Não apareceu. O servidor está a correr o código que leu quando arrancou (guia: secção "Um programa que não acaba").

3. No terminal, para o servidor com Ctrl+C e volta a ligá-lo com `node server.js`.
4. Antes de continuares, prevê: se pedires a lista três vezes e a página inicial uma vez, quantas vezes aparece a frase no terminal? Escreve a previsão.
5. Faz os quatro pedidos e conta.

O que deves ver: a frase três vezes, uma por cada pedido à lista, e nenhuma pelo pedido à página inicial. Nada disto aparece no browser, nem na consola das ferramentas de programador: o `console.log` corre no servidor e escreve no terminal do servidor.

6. Regista no registo de arranque o que aconteceu antes e depois de reiniciares.

## Parte 7: provocar e corrigir erros

Guia: secção "Erros de arranque e como os ler".

Esta é a parte que conta como evidência do tema. Em cada erro, faz sempre os mesmos cinco passos, e regista-os no registo de arranque:

1. **Prevê:** antes de correres, escreve o que achas que vai acontecer.
2. **Executa** e observa.
3. **Copia a linha que interessa** da mensagem: a do tipo do erro e, se houver, a que diz o ficheiro e o número da linha.
4. **Corrige.**
5. **Confirma** que o servidor volta a arrancar e a responder.

### Erro 1: a porta ocupada

1. Com o servidor ligado num terminal, abre um segundo terminal, vai para a mesma pasta e corre outra vez `node server.js`.
2. O segundo terminal mostra `Não foi possível ligar o servidor: listen EADDRINUSE: address already in use :::3000` e fica outra vez livre. O primeiro servidor continua a funcionar: confirma no browser.
3. Esta mensagem foi escrita por que linha do teu `server.js`? Sem o `if (erro)`, o que teria aparecido?
4. Correção: fecha o segundo terminal. Se quisesses mesmo dois servidores ao mesmo tempo, terias de dar ao segundo outra porta.

### Erro 2: o pacote mal escrito

1. Para o servidor. No `server.js`, na linha do `import`, apaga o último `s` de `"express"`, para ficar `"expres"`. Guarda.
2. Corre `node server.js`.
3. Procura a linha que começa por `Error [ERR_MODULE_NOT_FOUND]`. Diz `Cannot find package 'expres'`. O servidor chegou a ligar?
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
6. Explica no caderno porque é que o servidor arrancou e a rota `/equipamentos` funcionou, se havia um erro no ficheiro.
7. Correção: repõe `res.send`, reinicia o servidor e confirma que `/` volta a responder 200.

## Parte 8: parar o servidor

1. No terminal do servidor, Ctrl+C.
2. No browser, recarrega `http://localhost:3000/`.

O que deves ver: a página de "ligação recusada" do primeiro tema, sem código de estado no separador Rede. Já sabes porquê: nenhum programa está a escutar na porta 3000.

## Parte 9 (opcional): guardar o trabalho no Git

Esta parte é só para quem já usou o Git em Linguagens de Programação. Se ainda não usaste, salta-a: o Git é dado lá.

1. Na pasta `catalogo-de-equipamentos`, cria um ficheiro `.gitignore` com uma só linha: `node_modules/`. É a pasta que nunca se guarda, porque se recria com `npm install`.
2. Corre `git init` e depois `git status`. Confirma que a pasta `node_modules` não aparece na lista.
3. Corre `git add .` e faz o primeiro commit, com uma mensagem que descreva o que o servidor faz:

   ```text
   git commit -m "Primeiro servidor do catálogo, com as rotas / e /equipamentos"
   ```

Uma boa mensagem de commit diz o que mudou, para quem a ler daqui a um mês perceber sem abrir os ficheiros. "Commit 1" ou "alterações" não dizem nada.

## Problemas frequentes no laboratório

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

No Visual Studio Code é fácil ter vários terminais abertos. Procura o que diz "Servidor a correr" e está ocupado. Se não o encontrares, fecha o editor: os servidores ligados nos terminais dele param.

## O que fica no teu caderno

No fim do laboratório deves ter:

1. o registo de arranque, com as versões, os comandos das partes 3 e 5, a experiência do `console.log` da parte 6 e os quatro erros da parte 7, cada um com a previsão, a linha da mensagem que interessa e a correção;
2. as respostas às perguntas das partes 3, 4 e 5;
3. a explicação da parte 7, erro 4.

O professor vai pedir-te que expliques um dos erros: o que diz a mensagem, como soubeste onde procurar e o que corrigiste. É a evidência deste tema.

![Rodapé](../imagens/rodape.png)
