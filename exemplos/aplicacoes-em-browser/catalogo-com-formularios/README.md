![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com formulários

O servidor do exemplo guiado do [tema Formulários e validação](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md): o catálogo com páginas do tema anterior, agora com reservas feitas num formulário. O formulário envia por `POST`. O servidor lê o corpo com `express.urlencoded` e verifica cada campo. Com erros, responde 400 e mostra o formulário com os valores escritos e uma mensagem em cada campo errado. Se estiver tudo bem, guarda a reserva e responde com um redirecionamento 303 para a página dela. O guia explica o código passo a passo; aqui está pronto a correr.

A versão anterior, sem reservas, está em [catalogo-com-ejs](../catalogo-com-ejs/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `server.js` | O servidor, com as funções de validação e as rotas das reservas |
| `views/reserva-nova.ejs` | O formulário de reserva, com os valores e as mensagens de erro |
| `views/reserva.ejs` | A página de uma reserva, para onde o browser vai depois de reservar |
| `views/reservas.ejs` | A lista das reservas |
| `views/inicio.ejs`, `views/equipamentos.ejs`, `views/equipamento.ejs` e `views/erro.ejs` | As páginas do tema anterior |
| `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs` | O início e o fim de todas as páginas; o menu tem as ligações para as reservas |
| `package.json` | O projeto: o `"type": "module"` e as dependências do Express e do EJS |
| `package-lock.json` | As versões exatas dos pacotes |

A pasta `node_modules` recria-se com `npm ci`.

## Como correr

Usa Node 24 LTS e internet na primeira instalação. Confirma a versão com `node --version`.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm ci`
3. `node server.js`, dentro desta pasta. O terminal mostra `Servidor a correr em http://localhost:3000` e fica ocupado.
4. No browser, abre `http://localhost:3000/reservas/nova` e faz uma reserva. O browser termina em `/reservas/1`. As respostas que cada pedido deve dar estão no passo 6 do exemplo guiado do guia.
5. Para veres a validação do servidor, acrescenta `novalidate` ao `<form>` do `views/reserva-nova.ejs` e envia o formulário vazio. Tira-o no fim.
6. Para parar, Ctrl+C. As reservas ficam em memória e desaparecem quando o servidor para.

## Versões com que foi testado

Reensaiado a 20 de outubro de 2026, com Node 24.22.0 e npm 11.20.0, em macOS. Os pedidos HTTP foram feitos por programa numa cópia descartável, com as versões do `package-lock.json`. O ensaio não incluiu um browser gráfico, Windows nem a rede da escola.

Os ensaios anteriores ficaram registados assim:

Node.js 24.17.0, npm 11.13.0, Express 5.3.0 e EJS 7.0.1, em macOS, a 12 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
