![Cabeçalho](../../../imagens/cabecalho.png)

# Fechado na escola, no fim do passo 5

Este é o jogo Fechado na escola como fica no fim do passo 5, o [laboratório do tema 05 Formulários e validação](../../../01-aplicacoes-em-browser/laboratorios/05-formularios-e-validacao-laboratorio.md). Tem a página "Nova cena", com um formulário que cria uma cena na base de teste, verificado campo a campo no servidor. É usado no tema [05 Formulários e validação](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md).

Parte do [passo 4](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/exemplos/acesso-a-dados/fechado-na-escola-passo-04/README.md), feito em Linguagens de Programação, e é o ponto de partida do passo 6, em Linguagens de Programação. Se faltaste ao passo 5, ou se o teu projeto não arranca, copia esta pasta e continua daqui.

## O que está nesta pasta

- `views/cena-nova.ejs`: o formulário da cena nova, com os valores e as mensagens de cada campo.
- `src/controllers/paginas.controller.js`: as páginas do jogo, com a verificação dos campos do formulário, a resposta com o formulário quando há erros e o redirecionamento quando corre bem.
- `src/rotas/paginas.rotas.js`: que pedido de página vai para que função do controller, com o `GET /cenas/nova` e o `POST /cenas`.
- `src/server.js`: o arranque do jogo, que lê o corpo dos pedidos em JSON, para a API, e o dos formulários, para as páginas.
- `views/inicio.ejs`, `views/cena.ejs`, `views/erro.ejs` e `views/partials/`: as outras páginas e as partes partilhadas, como no passo 4, com a ligação "Nova cena" no menu.
- `contrato-da-api.md`: o contrato da API, igual ao do passo 4.
- `src/rotas/cenas.rotas.js`, `src/controllers/cenas.controller.js`, `src/services/cenas.service.js` e `src/repositories/cenas.repository.js`: a API em camadas, como no passo 4. O service cria também as cenas do formulário.
- `src/db/mongoose.js`, `src/models/cena.model.js` e `src/seed.js`: a ligação, o modelo e as cenas da base de teste, como no passo 4.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes, iguais às do passo 4.
- `.env.example` e `.gitignore`: a configuração sem segredos, já com a base de teste, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, do teu cluster no Atlas e de internet. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

Abre o `.env` e escreve na linha `MONGODB_URI=` a cadeia de ligação do teu cluster, com a palavra-passe do utilizador da base de dados. Encontras a cadeia no Atlas como na [fase 2 do laboratório do passo 1](https://github.com/NunoMACastro/epms-2627-3ig-lp/blob/main/01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#fase-2-o-segredo-fica-só-no-servidor). A linha `DB_NAME=` já diz `fechado-na-escola-teste`. Depois, reconstrói a base de teste e liga o servidor:

```bash
npm run seed
npm run dev
```

O que deves ver: o seed escreve `Ligada à base de dados fechado-na-escola-teste`, uma linha com as cenas apagadas e `Inseridas 11 cenas`. O servidor escreve a mesma linha da base e `Fechado na escola em http://localhost:3000`. No browser, `http://localhost:3000/cenas/nova` mostra o formulário "Nova cena". Um formulário certo leva à página da cena nova. Um código que já existe, como `inicio`, volta com o formulário e a mensagem junto do código. Para parar, Ctrl+C.

Se alguma coisa falhar, os problemas mais comuns estão no fim do laboratório, em [Se alguma coisa falhar](../../../01-aplicacoes-em-browser/laboratorios/05-formularios-e-validacao-laboratorio.md#se-alguma-coisa-falhar).

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0, o Mongoose 9.11.4 e o EJS 7.0.1, como no passo 4. Não há pacotes novos: o `express.urlencoded()` vem com o Express.

![Rodapé](../../../imagens/rodape.png)
