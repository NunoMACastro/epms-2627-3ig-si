![Cabeçalho](../../../imagens/cabecalho.png)

# Fechado na escola, no fim do passo 3

Este é o jogo Fechado na escola como fica no fim do passo 3, o [laboratório do tema 04 EJS e reutilização no servidor](../../../01-aplicacoes-em-browser/laboratorios/04-ejs-e-reutilizacao-no-servidor-laboratorio.md). Ao lado da API do passo 2, tem as páginas do jogo, construídas no servidor com EJS. São a página inicial, a página de cada cena, com uma ligação por escolha, e a página de erro, todas com o mesmo cabeçalho e o mesmo rodapé. É usado no tema [04 EJS e reutilização no servidor](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md).

Parte do [passo 2](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/exemplos/acesso-a-dados/fechado-na-escola-passo-02/README.md), feito em Linguagens de Programação, e é o ponto de partida do [passo 4](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/01-acesso-a-dados/laboratorios/05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md), no tema 05 de Linguagens de Programação. Se faltaste ao passo 3, ou se o teu projeto não arranca, copia esta pasta e continua daqui.

## O que está nesta pasta

- `contrato-da-api.md`: o contrato da API, igual ao do passo 2.
- `src/server.js`: o arranque do jogo, com o motor dos modelos, os dois routers e o middleware final, que responde em JSON à API e com uma página ao resto.
- `src/rotas/paginas.rotas.js`: que pedido de página vai para que função do controller das páginas.
- `src/controllers/paginas.controller.js`: lê e verifica o pedido, pede as cenas ao mesmo service da API e responde com uma página.
- `views/inicio.ejs`, `views/cena.ejs` e `views/erro.ejs`: os modelos das três páginas.
- `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs`: o início e o fim de todas as páginas.
- `src/rotas/cenas.rotas.js`, `src/controllers/cenas.controller.js`, `src/services/cenas.service.js` e `src/repositories/cenas.repository.js`: a API em camadas, como no passo 2.
- `src/db/mongoose.js`, `src/models/cena.model.js` e `src/seed.js`: a ligação, o modelo e as cenas, como no passo 1.
- `package.json` e `package-lock.json`: o projeto, agora com o EJS, e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, do teu cluster no Atlas e de internet. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

Abre o `.env` e escreve na linha `MONGODB_URI=` a cadeia de ligação do teu cluster, com a palavra-passe do utilizador da base de dados. Encontras a cadeia no Atlas como no passo 5 da [fase 2 do laboratório do passo 1](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#fase-2-o-segredo-fica-só-no-servidor). Depois, põe as cenas na base e liga o servidor:

```bash
npm run seed
npm run dev
```

O que deves ver: o seed escreve `Ligada à base de dados fechado-na-escola`, uma linha com as cenas apagadas e `Inseridas 11 cenas`. O servidor escreve a mesma linha da base e `Fechado na escola em http://localhost:3000`. No browser, `http://localhost:3000/` mostra a página inicial do jogo, com a ligação "Começar", e `http://localhost:3000/api/cenas/inicio` continua a mostrar a primeira cena em JSON. A [fase 9 do laboratório](../../../01-aplicacoes-em-browser/laboratorios/04-ejs-e-reutilizacao-no-servidor-laboratorio.md#fase-9-o-browser-recebe-só-o-html) tem os pedidos para conferires. Para parar, Ctrl+C.

Se alguma coisa falhar, os problemas mais comuns estão no fim do laboratório, em [Se alguma coisa falhar](../../../01-aplicacoes-em-browser/laboratorios/04-ejs-e-reutilizacao-no-servidor-laboratorio.md#se-alguma-coisa-falhar).

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0 e o Mongoose 9.11.4, como no passo 2, e o EJS 7.0.1.

![Rodapé](../../../imagens/rodape.png)
