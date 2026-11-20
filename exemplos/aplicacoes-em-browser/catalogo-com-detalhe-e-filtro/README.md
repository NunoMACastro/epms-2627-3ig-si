![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com detalhe e filtro

O catálogo do tema 02 com mais uma rota, a de detalhe, `/equipamentos/:id`, e com o filtro por sala, `?sala=`. É usado no tema [03 HTTP, rotas e middleware](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md). É o `server.js` do fim do [passo 1 do exemplo guiado](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#passo-1-a-rota-de-detalhe-e-o-filtro). Nesta versão, a rota de detalhe ainda responde 404 a um identificador que nem é um número, como `abc`, e o passo 2 corrige-o com o 400.

A versão anterior, só com as duas primeiras rotas, está em [catalogo-de-equipamentos](../catalogo-de-equipamentos/README.md). A do fim do exemplo guiado, com o 400 e os middlewares, está em [catalogo-com-middleware](../catalogo-com-middleware/README.md).

## O que está nesta pasta

- `server.js`: o servidor, com as três rotas e os equipamentos em memória.
- `package.json`: o projeto, com o `"type": "module"` e a dependência do Express.
- `package-lock.json`: as versões exatas dos pacotes.

## Como correr

Precisas do Node.js 24 ou mais recente (`node --version` mostra a tua versão) e de internet para o `npm install`. Copia esta pasta para a tua pasta de trabalho de Sistemas de Informação, fora do repositório dos materiais da disciplina, e abre um terminal dentro da cópia:

```bash
npm install
node server.js
```

Se o `npm install` ficar parado, ou acabar com linhas `npm error`, falta a internet: avisa o professor.

O que deves ver: o terminal mostra `Servidor a correr em http://localhost:3000`. No browser, `http://localhost:3000/equipamentos/2` mostra o projetor, e `http://localhost:3000/equipamentos?sala=B12` mostra o portátil e o monitor. `http://localhost:3000/equipamentos/abc` responde 404, com `{"erro":"Não existe o equipamento abc"}`. Os outros pedidos e os seus códigos estão no [passo 1 do exemplo guiado](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#passo-1-a-rota-de-detalhe-e-o-filtro). Esta versão não tem middleware final: um caminho que não existe, como `/alunos`, mostra a página de erro do próprio Express, `Cannot GET /alunos`. Para parar, Ctrl+C no terminal.

Se o servidor não arrancar, os erros de arranque estão nos [Erros frequentes do tema 02](../../../01-aplicacoes-em-browser/02-primeiro-servidor.md#erros-frequentes).

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.2.1. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
