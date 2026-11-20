![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com middleware

O catálogo com a rota de detalhe, o filtro por sala e uma página inicial com uma pesquisa. Tem dois middlewares: o de registo, que escreve cada pedido no terminal, e o final, que responde ao que nenhuma rota reconheceu. Distingue o identificador inválido (400) do equipamento que não existe (404). É usado no tema [03 HTTP, rotas e middleware](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md). É o `server.js` do fim do [exemplo guiado do guia](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#exemplo-guiado-o-catálogo-cresce), pronto a correr.

A versão anterior, ainda sem o 400 nem os middlewares, está em [catalogo-com-detalhe-e-filtro](../catalogo-com-detalhe-e-filtro/README.md). No tema 04, é o ponto de partida do [exemplo guiado](../../../01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor.md#exemplo-guiado-o-catálogo-passa-a-ter-páginas), e o catálogo passa a ter páginas, em [catalogo-com-ejs](../catalogo-com-ejs/README.md).

## O que está nesta pasta

- `server.js`: o servidor, com os dois middlewares, as três rotas e os equipamentos em memória.
- `package.json`: o projeto, com o `"type": "module"` e a dependência do Express.
- `package-lock.json`: as versões exatas dos pacotes.

## Como correr

Precisas do Node.js 24 ou mais recente (`node --version` mostra a tua versão) e de internet para o `npm install`. Copia esta pasta para a tua pasta de trabalho de Sistemas de Informação, fora do repositório dos materiais da disciplina, e abre um terminal dentro da cópia:

```bash
npm install
node server.js
```

Se o `npm install` ficar parado, ou acabar com linhas `npm error`, falta a internet: avisa o professor.

O que deves ver: o terminal mostra `Servidor a correr em http://localhost:3000`. No browser, `http://localhost:3000/` tem a pesquisa por sala. Escreve `B12` e carrega em "Pesquisar": o browser vai para `/equipamentos?sala=B12`, com o portátil e o monitor, em JSON. O que cada pedido deve dar está no [passo 7 do exemplo guiado](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#passo-7-os-pedidos-um-a-um). Para parar, Ctrl+C no terminal.

Repara no terminal: cada pedido deixa lá uma linha, escrita pelo middleware de registo, como `GET /equipamentos?sala=B12`. As linhas `GET /favicon.ico` são o browser a pedir o ícone do separador, que o catálogo não tem, como explica o [passo 3 do exemplo guiado](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#passo-3-o-middleware-de-registo).

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.3.0. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
