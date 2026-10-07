![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com reservas

O servidor do exemplo guiado do [tema HTTP, rotas e middleware](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md): o catálogo de equipamentos do tema anterior, com a rota de detalhe, o filtro por sala, dois middlewares, um formulário de reserva enviado por `POST` e um middleware final para os endereços que não existem. O guia explica o código passo a passo; aqui está pronto a correr.

A versão anterior, só com as duas primeiras rotas, está em [catalogo-de-equipamentos](../catalogo-de-equipamentos/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `server.js` | O servidor |
| `package.json` | O projeto: o `"type": "module"` e a dependência do Express |
| `package-lock.json` | As versões exatas dos pacotes |

A pasta `node_modules` recria-se com `npm install`.

## Como correr

Precisas do Node.js 22 ou mais recente e de internet para o primeiro passo.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm install`
3. `node server.js`. O terminal mostra `Servidor a correr em http://localhost:3000` e fica ocupado.
4. No browser, abre `http://localhost:3000/`: tens a pesquisa por sala e a ligação para o formulário de reserva. As respostas que cada endereço deve dar estão no passo 8 do exemplo guiado do guia.
5. Repara no terminal: cada pedido deixa lá uma linha, escrita pelo middleware de registo.
6. Para parar, Ctrl+C. As reservas feitas perdem-se, porque estão em memória.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0 e Express 5.2.1, em macOS, a 7 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
