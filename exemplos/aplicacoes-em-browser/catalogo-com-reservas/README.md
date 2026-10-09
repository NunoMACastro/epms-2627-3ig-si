![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com reservas

Este exemplo pertence ao tema dos formulários e validação, que ainda não tem material publicado, e fica nesta pasta para esse tema. Foi publicado a 7 de outubro de 2026 com o tema HTTP, rotas e middleware. A 9 de outubro, esse tema passou a usar o [catalogo-com-middleware](../catalogo-com-middleware/README.md), que é o mesmo catálogo sem o formulário de reserva e sem o `POST`. Se estás a estudar o tema 3, é esse o exemplo que procuras. Este podes lê-lo à frente: usa o corpo do pedido e o middleware que o lê, que são matéria do tema dos formulários.

O servidor: o catálogo de equipamentos com a rota de detalhe, o filtro por sala, dois middlewares, um formulário de reserva enviado por `POST` e um middleware final para os endereços que não existem. A rota de detalhe, o filtro, o middleware de registo e o middleware final estão explicados no [guia do tema HTTP, rotas e middleware](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md); o formulário, o `POST` e o middleware que lê o corpo vão ser explicados no tema dos formulários.

A versão com só as duas primeiras rotas está em [catalogo-de-equipamentos](../catalogo-de-equipamentos/README.md).

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
4. No browser, abre `http://localhost:3000/`: tens a pesquisa por sala e a ligação para o formulário de reserva. Cada endereço deve dar:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `GET /equipamentos/2` | 200 | `{"id":2,"nome":"Projetor","sala":"A03"}` |
   | `GET /equipamentos/abc` | 400 | `{"erro":"O identificador tem de ser um número inteiro positivo"}` |
   | `GET /equipamentos/9` | 404 | `{"erro":"Não existe o equipamento 9"}` |
   | `GET /equipamentos?sala=B12` | 200 | o portátil e o monitor |
   | `GET /equipamentos?sala=Z99` | 200 | `[]` |
   | `POST /reservas`, equipamento 2, dia 2026-10-20, tempo 3 | 201 | `{"id":1,"equipamentoId":2,"data":"2026-10-20","tempo":3}` |
   | `POST /reservas`, equipamento 9 | 400 | `{"erro":"Reserva inválida: confirma o equipamento, o dia e o tempo"}` |
   | `GET /reservas` | 200 | a lista com a reserva 1 |
   | `GET /nao-existe` | 404 | `Página não encontrada.` |

   Os dois pedidos `POST` fazem-se a partir do formulário de reserva, em `http://localhost:3000/reservas/nova`.

5. Repara no terminal: cada pedido deixa lá uma linha, escrita pelo middleware de registo.
6. Para parar, Ctrl+C. As reservas feitas perdem-se, porque estão em memória.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0 e Express 5.2.1, em macOS, a 7 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
