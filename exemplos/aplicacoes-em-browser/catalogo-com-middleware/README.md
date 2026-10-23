![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com middleware

Este é o exemplo do [tema HTTP, rotas e middleware](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md), pronto a correr. O catálogo mostra detalhe, filtro e uma página de pesquisa. Distingue identificador inválido (400) de equipamento inexistente (404). O middleware de registo escreve cada pedido no terminal; o final responde ao que nenhuma rota reconheceu. O guia explica como as peças se juntam.

A versão anterior, só com as duas primeiras rotas, está em [catalogo-de-equipamentos](../catalogo-de-equipamentos/README.md). A pasta [catalogo-com-reservas](../catalogo-com-reservas/README.md) é uma comparação opcional do tema dos formulários. Acrescenta a este servidor um formulário de reserva enviado por `POST`, com resposta em JSON.

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `server.js` | O servidor |
| `package.json` | O projeto: o `"type": "module"` e a dependência do Express |
| `package-lock.json` | As versões exatas dos pacotes |

A pasta `node_modules` recria-se com `npm install`.

## Como correr

Usa o Node.js 24 adotado na disciplina e confirma-o com `node --version`. A instalação dos pacotes precisa de internet.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm install`
3. `node server.js`. O terminal mostra `Servidor a correr em http://localhost:3000` e fica ocupado.
4. No browser, abre `http://localhost:3000/`: tens a pesquisa por sala. Escreve `B12` e carrega em "Pesquisar". As respostas que cada endereço deve dar estão no passo 7 do exemplo guiado do guia.
5. Repara no terminal: cada pedido deixa lá uma linha, escrita pelo middleware de registo. As linhas `GET /favicon.ico` são o browser a pedir o ícone do separador, que o catálogo não tem; o passo 3 do exemplo guiado explica-as.
6. Para parar, Ctrl+C.

## Versões e compatibilidade

As versões de referência são Node.js 24.22.0, npm 11.20.0 e Express 5.3.0. As versões exatas das dependências estão no `package-lock.json`. A execução em Windows e as ferramentas de programador do browser continuam por confirmar nestas versões.

![Rodapé](../../../imagens/rodape.png)
