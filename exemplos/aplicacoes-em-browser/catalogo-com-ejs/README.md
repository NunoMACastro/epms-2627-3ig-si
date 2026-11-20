![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com EJS

O catálogo do tema 03, agora com páginas construídas no servidor a partir de modelos EJS. Tem uma página inicial com a pesquisa por sala, uma lista com a mensagem da lista vazia e uma página por equipamento. Uma só página de erro serve o 400 e os dois 404: o do equipamento que não existe e o do middleware final. Todas as páginas partilham o mesmo cabeçalho e o mesmo rodapé. É usado no tema [04 EJS e reutilização no servidor](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md). É o resultado do [exemplo guiado do guia](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md#exemplo-guiado-o-catálogo-passa-a-ter-páginas), pronto a correr.

A versão anterior, que respondia em JSON, está em [catalogo-com-middleware](../catalogo-com-middleware/README.md). No tema 05, é o ponto de partida do [exemplo guiado](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md#exemplo-guiado-as-reservas-do-catálogo), e o catálogo ganha as reservas, em [catalogo-com-formularios](../catalogo-com-formularios/README.md).

## O que está nesta pasta

- `server.js`: o servidor. As rotas escolhem os dados e o código de estado, e pedem a página com o `res.render`.
- `views/inicio.ejs`: a página inicial, com a pesquisa por sala.
- `views/equipamentos.ejs`: a lista dos equipamentos, com a sala pesquisada e a mensagem da lista vazia.
- `views/equipamento.ejs`: a página de um equipamento.
- `views/erro.ejs`: a página de erro, com um título e uma mensagem.
- `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs`: o início e o fim de todas as páginas, com o `<head>`, o menu e o título.
- `package.json`: o projeto, com o `"type": "module"` e as dependências do Express e do EJS.
- `package-lock.json`: as versões exatas dos pacotes.

## Como correr

Precisas do Node.js 24 ou mais recente (`node --version` mostra a tua versão) e de internet para o `npm install`. Copia esta pasta para a tua pasta de trabalho de Sistemas de Informação, fora do repositório dos materiais da disciplina, e abre um terminal dentro da cópia:

```bash
npm install
node server.js
```

Se o `npm install` ficar parado, ou acabar com linhas `npm error`, falta a internet: avisa o professor.

Arranca o servidor dentro desta pasta. Arrancado de outra pasta, não encontra os modelos: as páginas dão 500, e o terminal mostra `Error: Failed to lookup view`, como em [Erros frequentes](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md#error-failed-to-lookup-view-equipamentoo-in-views-directory), no guia.

O que deves ver: o terminal mostra `Servidor a correr em http://localhost:3000`. No browser, `http://localhost:3000/` tem a pesquisa por sala. Com `B12`, a página "Equipamentos" diz "Pesquisa pela sala B12." e mostra o portátil e o monitor, cada um com a ligação para a sua página. O que cada endereço deve dar está no [passo 8 do exemplo guiado](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md#passo-8-os-resultados). Para parar, Ctrl+C no terminal.

Abre também o código-fonte da lista com `B12` (Ctrl+U; no Mac, Cmd+Option+U) e compara-o com o modelo, `views/equipamentos.ejs`. O [passo 9 do exemplo guiado do guia](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md#passo-9-o-que-o-browser-recebe) diz o que procurar.

Se mudares um modelo com o servidor ligado, basta recarregar a página. Se mudares o `server.js`, tens de parar o servidor e voltar a ligá-lo, ou arrancá-lo com `node --watch server.js`, que o volta a ligar sempre que guardas o `server.js`.

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.3.0 e o EJS 7.0.1. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
