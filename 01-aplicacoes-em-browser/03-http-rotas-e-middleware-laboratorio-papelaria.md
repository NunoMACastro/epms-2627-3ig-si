![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: a API da papelaria

Segundo laboratório do terceiro tema do módulo Aplicações baseadas em browsers, feito em conjunto com Linguagens de Programação. Cerca de 90 minutos, repartidos pelas três primeiras aulas do tema. Treina exatamente o mesmo que o [laboratório do catálogo](03-http-rotas-e-middleware-laboratorio.md): os dados no caminho e na pesquisa, os códigos 200, 400 e 404, o middleware de registo, o middleware final e a ordem da fila. Muda o sítio onde os aplicas. Em vez de partires do catálogo de equipamentos, crias de raiz a API da papelaria, com os mesmos oito artigos que vais guardar no MongoDB Atlas em Linguagens de Programação. Se o professor te pediu este laboratório, não precisas de fazer o do catálogo.

O [guia do tema](03-http-rotas-e-middleware.md) explica as ideias com o catálogo, no exemplo guiado, e cada parte deste laboratório diz em que secção. O trabalho de passar cada passo do catálogo para a papelaria é teu: onde o guia escreve `equipamentos`, `sala` e `/equipamentos`, tu escreves `artigos`, `categoria` e `/api/artigos`. É nessa passagem que se vê se percebeste o passo ou se só o copiaste. Antes de cada experiência, escreve a previsão no caderno: é a previsão errada que mostra o que ainda não estava percebido.

## Antes de começar

Precisas do Node.js, versão 22 ou 24 (`node --version`), de um editor de código, como o Visual Studio Code, de um terminal e do browser com as ferramentas de programador. Precisas também de internet para o `npm install` da parte 2. Se a rede da escola falhar, o professor tem a pasta `node_modules` numa pen.

Trabalha numa pasta tua, fora do repositório dos materiais. A pasta que vais criar, `papelaria-api`, serve às duas disciplinas: de tarde, em Linguagens de Programação, vais pegar nela e transformá-la num projeto, com scripts, configuração e Git. Por isso, não lhe mudes o nome e não a apagues no fim da aula.

Esta API responde só com dados, em JSON, e não tem páginas. É essa a diferença entre uma API e o catálogo: o catálogo mostra uma página inicial com um formulário, e a API não mostra nada, só responde ao que lhe pedem. Quem vai mostrar os dados é o React, mais à frente, em Linguagens de Programação. Por isso, este laboratório não tem a página com a pesquisa do laboratório do catálogo. O formulário de pesquisa por `GET`, que transforma um campo num parâmetro de pesquisa, está no passo 4 do exemplo guiado, e o professor mostra-o a funcionar no projetor.

Todos os caminhos desta API começam por `/api`, como `/api/artigos`. É uma convenção que separa os endereços que respondem com dados dos endereços das páginas, e que vai dar jeito quando a API e o React se juntarem.

Em todo o laboratório, depois de mudares o `server.js`, o servidor tem de ser reiniciado. A forma mais cómoda é arrancá-lo com `node --watch server.js`, que o reinicia sozinho sempre que guardas o ficheiro.

## Parte 1: prever antes de programar

Guia: secções "Três sítios por onde um pedido traz dados" e "Os códigos de estado que o teu código escolhe".

Copia esta tabela para o caderno e preenche as duas últimas colunas com a tua previsão, antes de escreveres qualquer código. Os artigos estão na parte 2: o artigo 2 é a esferográfica azul, e há oito artigos, com os identificadores de 1 a 8. No fim do laboratório voltas a esta tabela.

| Pedido | Onde vêm os dados | Código que esperas |
| --- | --- | --- |
| `GET /api/artigos/2` | | |
| `GET /api/artigos/abc` | | |
| `GET /api/artigos/0` | | |
| `GET /api/artigos/99` | | |
| `GET /api/artigos?categoria=Papel` | | |
| `GET /api/artigos?categoria=Cola` | | |
| `GET /nao-existe` | | |

## Parte 2: o projeto e a lista dos artigos

Guia do tema anterior, [Primeiro servidor](02-primeiro-servidor.md): é o que lá fizeste com o catálogo, agora com outros dados.

1. Na tua pasta de trabalho, cria a pasta do projeto e instala o Express:

   ```text
   mkdir papelaria-api
   cd papelaria-api
   npm init -y
   npm install express
   ```

2. Abre a pasta `papelaria-api` no editor. No `package.json`, na linha do `"type"`, muda a palavra `commonjs` para `module`. Sem esta mudança, o Node não aceita o `import` da primeira linha do servidor.
3. Cria o ficheiro `server.js`, ao lado do `package.json`, com este código. O array dos artigos podes copiá-lo, porque são dados e não há nada a aprender em escrevê-los à mão. O resto escreve-o tu, linha a linha, e lê os comentários.

   ```js
   // server.js: a API da papelaria, num só ficheiro.
   // Responde só com dados, em JSON.
   import express from "express";

   const app = express();
   const PORTA = 3000;

   // Os artigos da papelaria, em memória: existem enquanto o servidor estiver
   // ligado. São os mesmos oito que vais guardar no MongoDB Atlas em Linguagens
   // de Programação, com um id numérico em vez do _id.
   const artigos = [
     { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
     { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
     { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
     { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
     { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
     { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
     { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
     { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
   ];

   // Lista de artigos.
   app.get("/api/artigos", (req, res) => {
     res.json(artigos);
   });

   app.listen(PORTA, (erro) => {
     if (erro) {
       console.error(`Não foi possível ligar a API: ${erro.message}`);
       return;
     }
     console.log(`API a correr em http://localhost:${PORTA}`);
   });
   ```

   Os preços estão em cêntimos, como no Atlas: 250 são 2,50 euros. Guardar dinheiro em números inteiros de cêntimos evita os erros de arredondamento das casas decimais, e é por isso que o campo se chama `precoCentimos`, para ninguém o confundir com euros.

4. Arranca o servidor:

   ```text
   node --watch server.js
   ```

   O terminal mostra `API a correr em http://localhost:3000`.

5. No browser, abre `http://localhost:3000/api/artigos`.

O que deves ver: a lista dos oito artigos, em JSON. Se o terminal mostrar um erro com `Cannot use import statement outside a module`, falta a mudança do passo 2. Se mostrar `EADDRINUSE`, tens outro servidor ligado na porta 3000, provavelmente o catálogo: para-o com Ctrl+C no terminal onde ele está a correr.

## Parte 3: a rota de detalhe

Guia: exemplo guiado, passo 1.

1. Escreve, a seguir à rota `/api/artigos`, a rota `GET /api/artigos/:id`, a partir da rota do passo 1 do guia, com as mesmas duas verificações. Muda o caminho, o array (`artigos`), o nome da variável que guarda o que encontraste (`artigo`) e as duas mensagens de erro, que devem ser exatamente estas, porque são as que a API vai ter em Linguagens de Programação:
   - no 400: `O identificador do artigo tem de ser um número inteiro positivo`;
   - no 404: `` Não existe o artigo ${id} ``, com o número do pedido no fim.
2. Guarda e abre, um de cada vez: `/api/artigos/2`, `/api/artigos/abc`, `/api/artigos/0`, `/api/artigos/2.5` e `/api/artigos/99`.
3. Para cada um, regista o código (no separador Rede das ferramentas de programador) e a mensagem.

O que deves ver: 200 com a esferográfica azul; 400 para `abc`, `0` e `2.5`, com a mensagem do identificador; e 404 para o 99, com `Não existe o artigo 99`.

4. Agora uma experiência. Na linha `const id = Number(req.params.id);`, apaga o `Number(` e o `)` correspondente, para ficar `const id = req.params.id;`. Guarda e abre `/api/artigos/2`.
5. Prevê antes de abrir. Depois regista o que aconteceu, e explica-o no caderno com a secção "Tudo chega como texto" do guia.
6. Repõe o `Number(...)` e confirma que `/api/artigos/2` volta a responder 200.

## Parte 4: o filtro por categoria

Guia: exemplo guiado, passo 2.

1. Muda a rota `/api/artigos` para ler o parâmetro de pesquisa `categoria`, como a rota do passo 2 do guia lê a `sala`. Com uma categoria, a rota responde só com os artigos dessa categoria; sem ela, responde com todos.
2. Abre `/api/artigos?categoria=Papel`, `/api/artigos?categoria=Cola` e `/api/artigos`, sem nada.

O que deves ver: o caderno, o bloco de notas e a resma de papel, que são os três artigos da categoria Papel; uma lista vazia, `[]`, com o código 200, porque a papelaria não tem nenhum artigo da categoria Cola; e a lista toda.

3. Agora escreve a categoria em minúsculas: `/api/artigos?categoria=papel`. Prevê primeiro, e só depois abre. Regista o que aconteceu e explica-o numa frase, a partir da forma como a rota compara a categoria de cada artigo com a do pedido.

Guarda esta experiência no caderno. De tarde, em Linguagens de Programação, vais fazer exatamente a mesma pergunta ao MongoDB Atlas, com o filtro `{ categoria: "papel" }`. Antes de a fazeres, lê o que escreveste aqui e faz a previsão.

## Parte 5: ver os dados do pedido no browser

Guia: secção "Observar os pedidos no browser".

1. Com o separador Rede aberto, abre `/api/artigos?categoria=Escrita`.
2. Clica no pedido e abre o separador "Payload" ("Carga", no Chrome em português). Regista o que aparece em "Query String Parameters".
3. Abre `/api/artigos/3` e procura no Payload o 3. Não está lá. Onde o encontras?

## Parte 6: o middleware de registo

Guia: secção "O middleware" e exemplo guiado, passo 3.

1. Acrescenta o middleware de registo do passo 3, logo a seguir ao array dos artigos e antes de todas as rotas. Este passa tal como está no guia, porque não depende dos dados: escreve o método e o endereço de qualquer pedido.
2. Guarda e faz três pedidos quaisquer. No terminal, aparece uma linha por pedido, com o método e o endereço. Aparecem também linhas `GET /favicon.ico`, que não pediste: é o browser a pedir sozinho o ícone do separador, como explica o passo 3 do exemplo guiado.
3. Agora o primeiro erro de propósito. Apaga a linha `next();` do middleware. Guarda e abre `/api/artigos`. Prevê antes.

O que deves ver: o browser fica à espera, com o indicador de carregamento a rodar, e não mostra nada. No terminal, aparece a linha `GET /api/artigos` e mais nada. Não há nenhuma mensagem de erro. O middleware recebeu o pedido, não respondeu e não o passou à frente: o pedido ficou parado.

4. Repõe o `next();`, guarda e confirma que tudo volta a responder.

## Parte 7: o middleware final e a ordem da fila

Guia: secção "O middleware", com as três regras, e exemplo guiado, passo 5.

1. Antes de acrescentares o middleware final, abre `/nao-existe` e regista o código e o que o browser mostra.

O que deves ver: o código 404 e uma pequena página com o texto `Cannot GET /nao-existe`. Nenhuma rota respondeu, e o Express respondeu por ti, com a sua resposta de omissão, que é uma página HTML. Numa API, que responde sempre com dados, essa página é um problema: um programa que esteja à espera de JSON não a sabe ler.

2. Acrescenta o middleware final depois de todas as rotas, logo antes do `app.listen`, a partir do passo 5 do guia, com uma diferença: em vez de responder com o texto "Página não encontrada.", responde com o código 404 e com o JSON `{ erro: "Rota não encontrada" }`. Usa o `res.status(404).json(...)`, como nas respostas de erro da rota de detalhe.
3. Abre outra vez `/nao-existe`. Deves ver `{"erro":"Rota não encontrada"}`, com o código 404. Abre também `http://localhost:3000/`, o endereço sem caminho nenhum: esta API não tem página inicial, e a resposta é a mesma.
4. O segundo erro de propósito. Muda o middleware de registo para baixo das rotas, logo antes do middleware final. Guarda, abre `/api/artigos` e depois `/nao-existe`. Prevê primeiro: que linhas vão aparecer no terminal?

O que deves ver: os dois pedidos respondem como antes, mas no terminal só aparece `GET /nao-existe`, e talvez também `GET /favicon.ico`. O pedido a `/api/artigos` foi respondido pela rota, acabou ali e nunca chegou ao middleware de registo. Só passam por ele os pedidos a que nenhuma rota respondeu, a caminho do middleware final, e o pedido do ícone, que o browser faz sozinho, é um deles. É a segunda regra do middleware: o que tem de ver os pedidos antes das rotas tem de estar acima delas.

5. Repõe o middleware de registo no sítio certo, logo a seguir aos artigos, guarda e confirma que `/api/artigos` volta a aparecer no terminal.
6. O terceiro erro de propósito. Muda o middleware final para logo a seguir ao middleware de registo, antes de todas as rotas. Guarda e abre `/api/artigos/2`. Prevê primeiro.

O que deves ver: `{"erro":"Rota não encontrada"}` em todos os endereços, incluindo os que existem. O middleware final responde a tudo e não chama `next()`, por isso nenhum pedido chega às rotas. No terminal, cada pedido continua a aparecer, porque o middleware de registo está antes do final.

7. Repõe o middleware final no fim do ficheiro, logo antes do `app.listen`, e confirma que as rotas voltam a responder.

## Parte 8: a tabela de contratos e a evidência

Guia: secção "A tabela de contratos HTTP".

1. Escreve no caderno a tabela de contratos HTTP da tua API, com uma linha por pedido que ela aceita, e mais uma para o que acontece a qualquer outro pedido. Em cada linha, todas as respostas possíveis, incluindo as de erro, com o código e o corpo.
2. Verifica cada linha no browser, com o separador Rede aberto, e marca-a como verificada.
3. Para a evidência deste tema, regista três pedidos à rota de detalhe, com o endereço, o código e a mensagem: um válido, um com o parâmetro inválido e um com um recurso inexistente.
4. Volta à tabela de previsões da parte 1 e corrige a lápis o que previste mal. Para cada correção, escreve numa frase o que te enganou.

Guarda a tabela. Em Linguagens de Programação, no tema API Express e contratos, vais escrever o contrato desta API antes de lhe acrescentares rotas novas, e a tua tabela é o ponto de partida.

## Problemas frequentes no laboratório

### Cannot use import statement outside a module

O `package.json` ainda tem `"type": "commonjs"`. Muda para `"module"` e volta a arrancar. Guia do tema anterior: os erros de arranque.

### Não foi possível ligar a API: listen EADDRINUSE

Já há um servidor na porta 3000, quase sempre um que deixaste ligado noutro terminal, como o catálogo. Para-o com Ctrl+C no terminal dele.

### Mudei o código e nada mudou

O servidor não foi reiniciado. Se o arrancaste com `node server.js`, faz Ctrl+C e volta a arrancar; com `node --watch server.js`, basta guardar o ficheiro. Confirma também que guardaste: um ficheiro por guardar tem uma marca no separador do editor.

### Aparecem no terminal pedidos GET /favicon.ico que não fiz

É o browser a pedir sozinho o ícone que mostra no separador. A API não tem ícone, por isso esse pedido acaba com 404, no middleware final ou na resposta de omissão do Express, se o middleware final ainda não existir. Não é um erro do teu código. Guia: exemplo guiado, passo 3.

### Cannot set headers after they are sent to the client

Uma rota respondeu duas vezes: falta um `return` depois de uma resposta de erro. Guia: secção "Responder uma vez, e sair".

### Todos os pedidos aos artigos dão Rota não encontrada

Ou o middleware final está acima das rotas, como na experiência 6 da parte 7, ou o caminho da rota não é o que pedes no browser: `/artigos` em vez de `/api/artigos`, por exemplo. Compara letra a letra o caminho do `app.get` com o endereço.

## O que fica no teu caderno

1. A tabela de previsões da parte 1, com as correções da parte 8.
2. Os resultados das partes 3 e 4, incluindo as experiências do `Number` e da categoria em minúsculas, com a explicação.
3. Os três erros do middleware (partes 6 e 7): a previsão, o que aconteceu e porquê.
4. A tabela de contratos HTTP da tua API, verificada, e os três pedidos da evidência.

O professor vai pedir-te que expliques, para um dos três pedidos da evidência, porque é que o código é aquele, e que digas o que acontecia se o middleware de registo ficasse sem o `next()`.

![Rodapé](../imagens/rodape.png)
