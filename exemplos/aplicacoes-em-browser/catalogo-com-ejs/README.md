![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com EJS

O servidor do exemplo guiado do [tema EJS e reutilização no servidor](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md): o catálogo de equipamentos do tema anterior, agora com páginas construídas no servidor a partir de modelos EJS. Tem uma página inicial com pesquisa por sala, uma lista com mensagem de lista vazia e uma página por equipamento. A página de erro serve o 400, o 404 e o middleware final. Todas as páginas partilham o mesmo cabeçalho e o mesmo rodapé. O guia explica o código passo a passo; aqui está pronto a correr.

A versão anterior, que respondia com JSON, está em [catalogo-com-middleware](../catalogo-com-middleware/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `server.js` | O servidor: as rotas escolhem os dados e o código, e pedem a página com `res.render` |
| `views/inicio.ejs` | A página inicial, com a pesquisa por sala |
| `views/equipamentos.ejs` | A lista dos equipamentos, com a sala pesquisada e a mensagem da lista vazia |
| `views/equipamento.ejs` | A página de um equipamento |
| `views/erro.ejs` | A página de erro, com um título e uma mensagem |
| `views/partials/cabecalho.ejs` | O início de todas as páginas: o `<head>`, o menu e o título |
| `views/partials/rodape.ejs` | O fim de todas as páginas |
| `package.json` | O projeto: o `"type": "module"` e as dependências do Express e do EJS |
| `package-lock.json` | As versões exatas dos pacotes |

A pasta `node_modules` recria-se com `npm ci`.

## Como correr

Usa Node 24 LTS e internet na primeira instalação. Confirma a versão com `node --version`.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm ci`
3. `node server.js`, dentro desta pasta: arrancado de outra pasta, o servidor não encontra os modelos. O terminal mostra `Servidor a correr em http://localhost:3000` e fica ocupado.
4. No browser, abre `http://localhost:3000/`: tens a pesquisa por sala. Escreve `B12` e carrega em "Pesquisar". As respostas que cada endereço deve dar estão no passo 8 do exemplo guiado do guia.
5. Abre o código-fonte de uma página (Ctrl+U; no Mac, Cmd+Option+U) e compara-o com o modelo dessa página, na pasta `views`. A secção "O que o browser recebe" do guia diz o que procurar.
6. Para parar, Ctrl+C.

Se mudares um modelo com o servidor ligado, basta recarregar a página. Se mudares o `server.js`, tens de reiniciar o servidor, ou usar `node --watch server.js`.

## Versões e compatibilidade

As versões de referência são Node.js 24.22.0 e npm 11.20.0. Usa as versões exatas das dependências do `package-lock.json`. A execução em Windows e as operações no browser continuam por confirmar nestas versões.

![Rodapé](../../../imagens/rodape.png)
