![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com sessões

O servidor do exemplo guiado do [tema Cookies e sessões](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md): o catálogo com formulários do tema anterior, agora com um pedido em curso guardado numa sessão. Junta-se ao pedido um ou mais equipamentos, um de cada vez, vê-se o pedido, tira-se o que já não se quer. No fim confirma-se tudo de uma vez, com um nome fictício, ou cancela-se. Confirmar cria uma reserva por equipamento; confirmar e cancelar terminam a sessão. O guia explica o código passo a passo; aqui está pronto a correr.

A versão anterior, com uma reserva de cada vez, está em [catalogo-com-formularios](../catalogo-com-formularios/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `server.js` | O servidor: a sessão, o pedido em curso, a confirmação e o cancelamento |
| `views/item-novo.ejs` | O formulário para juntar um equipamento ao pedido |
| `views/pedido.ejs` | O pedido em curso, com a remoção, a confirmação e o cancelamento |
| `views/reserva.ejs` e `views/reservas.ejs` | Uma reserva e a lista das reservas |
| `views/inicio.ejs`, `views/equipamentos.ejs`, `views/equipamento.ejs` e `views/erro.ejs` | As páginas dos temas anteriores |
| `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs` | O início e o fim de todas as páginas; o menu mostra quantos equipamentos tem o pedido |
| `.env.example` | O nome da variável do segredo da sessão, sem o valor |
| `.gitignore` | Mantém fora do Git a `node_modules` e o `.env` |
| `package.json` | O projeto: o `"type": "module"` e as dependências do Express, do EJS e do express-session |
| `package-lock.json` | As versões exatas dos pacotes |

A pasta `node_modules` recria-se com `npm ci`. O `.env` não está aqui, de propósito: cada um cria o seu.

## Como correr

Usa Node 24 LTS e internet na primeira instalação. Confirma a versão com `node --version`.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm ci`
3. Copia o `.env.example` para um ficheiro novo, `.env`. Gera um segredo com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` e cola-o no `.env`, a seguir ao `SESSION_SECRET=`.
4. `node --env-file=.env server.js`, dentro desta pasta. O terminal mostra `Servidor a correr em http://localhost:3000`. Sem o `.env`, ou sem o segredo, o servidor não arranca, e diz porquê.
5. No browser, abre `http://localhost:3000/` e faz um pedido de reserva, usando um nome fictício na confirmação. Abre o catálogo também numa janela anónima, para veres uma segunda sessão, separada da primeira. O passo 7 do exemplo guiado do guia diz o que deve acontecer.
6. Para parar, Ctrl+C. As sessões e as reservas ficam em memória e desaparecem quando o servidor para.

## Versões e compatibilidade

As versões de referência são Node.js 24.22.0 e npm 11.20.0. Usa as versões exatas das dependências do `package-lock.json`. A execução em Windows e as operações no browser continuam por confirmar nestas versões.

![Rodapé](../../../imagens/rodape.png)
