![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com middleware

O servidor do exemplo guiado do [tema HTTP, rotas e middleware](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md): o catálogo de equipamentos do tema anterior, com a rota de detalhe e as suas duas verificações (o 400 para um identificador inválido e o 404 para um equipamento que não existe), o filtro por sala, uma página inicial com uma pesquisa enviada por `GET`, o middleware de registo, que escreve cada pedido no terminal, e o middleware final, que responde aos endereços que não existem. O guia explica o código passo a passo; aqui está pronto a correr.

A versão anterior, só com as duas primeiras rotas, está em [catalogo-de-equipamentos](../catalogo-de-equipamentos/README.md). A pasta [catalogo-com-reservas](../catalogo-com-reservas/README.md) acrescenta a este servidor um formulário de reserva enviado por `POST`; é do tema dos formulários.

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
4. No browser, abre `http://localhost:3000/`: tens a pesquisa por sala. Escreve `B12` e carrega em "Pesquisar". As respostas que cada endereço deve dar estão no passo 7 do exemplo guiado do guia.
5. Repara no terminal: cada pedido deixa lá uma linha, escrita pelo middleware de registo. As linhas `GET /favicon.ico` são o browser a pedir o ícone do separador, que o catálogo não tem; o passo 3 do exemplo guiado explica-as.
6. Para parar, Ctrl+C.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0 e Express 5.2.1, em macOS, a 9 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
