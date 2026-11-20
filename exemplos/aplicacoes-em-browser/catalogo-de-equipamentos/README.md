![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo de equipamentos

O primeiro servidor do catálogo: um servidor Express com duas rotas `GET`, que responde com um texto e com os equipamentos da escola, guardados num array. É usado no tema [02 Primeiro servidor](../../../01-aplicacoes-em-browser/02-primeiro-servidor.md). É o servidor do [exemplo guiado do guia](../../../01-aplicacoes-em-browser/02-primeiro-servidor.md#exemplo-guiado-o-catálogo-de-equipamentos), pronto a correr.

No tema 03, é o ponto de partida do [exemplo guiado](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#exemplo-guiado-o-catálogo-cresce). O catálogo ganha a rota de detalhe e o filtro por sala, em [catalogo-com-detalhe-e-filtro](../catalogo-com-detalhe-e-filtro/README.md), e depois os middlewares, em [catalogo-com-middleware](../catalogo-com-middleware/README.md).

## O que está nesta pasta

- `server.js`: o servidor, com as duas rotas e os equipamentos em memória.
- `package.json`: o projeto, com o `"type": "module"` e a dependência do Express.
- `package-lock.json`: as versões exatas dos pacotes.

## Como correr

Precisas do Node.js 24 ou mais recente (`node --version` mostra a tua versão) e de internet para o `npm install`. Copia esta pasta para a tua pasta de trabalho de Sistemas de Informação, fora do repositório dos materiais da disciplina. Se já tens lá uma pasta `catalogo-de-equipamentos` tua, a do laboratório, dá outro nome à cópia, para não as misturares. Num terminal dentro da cópia:

```bash
npm install
node server.js
```

Se o `npm install` ficar parado, ou acabar com linhas `npm error`, falta a internet: avisa o professor.

O que deves ver: o terminal mostra `Servidor a correr em http://localhost:3000` e fica ocupado. No browser, `http://localhost:3000/` mostra `Olá! O servidor está a funcionar.`, e `http://localhost:3000/equipamentos` mostra os quatro equipamentos, em JSON. Um caminho que não existe, como `/nao-existe`, mostra `Cannot GET /nao-existe`, com o código 404. O código e o tipo de conteúdo de cada resposta estão no [passo 6 do exemplo guiado](../../../01-aplicacoes-em-browser/02-primeiro-servidor.md#passo-6-observar-no-browser). Para parar, Ctrl+C no terminal.

Se o servidor não arrancar, os problemas mais comuns estão no fim do laboratório do tema 02, em [Se alguma coisa falhar](../../../01-aplicacoes-em-browser/laboratorios/02-primeiro-servidor-laboratorio.md#se-alguma-coisa-falhar), porque é o mesmo servidor.

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.3.0. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
