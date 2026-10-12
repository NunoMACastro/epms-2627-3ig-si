![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com segurança

O servidor do exemplo guiado do [tema Erros e segurança web](../../../01-aplicacoes-em-browser/07-erros-e-seguranca-web.md): o catálogo com sessões do tema anterior, preparado para falhar. Tem um middleware de erro que regista cada falha no terminal, com a data, o pedido e o stack trace, e mostra a quem fez o pedido uma página que não revela nada do servidor; respeita o código 4xx dos erros que já o trazem, como o 413 de um corpo grande demais. O servidor recusa-se a arrancar com um segredo de sessão com menos de 32 carateres, e todos os formulários que mudam a sessão levam um token contra o CSRF, que o servidor verifica em cada pedido `POST`. O guia explica o código passo a passo; aqui está pronto a correr.

A versão anterior, sem estas proteções, está em [catalogo-com-sessoes](../catalogo-com-sessoes/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `server.js` | O servidor: o middleware de erro, a verificação do segredo e o token contra o CSRF |
| `views/item-novo.ejs` e `views/pedido.ejs` | Os formulários que mudam a sessão, cada um com o campo escondido `_csrf` |
| `views/erro.ejs` | A página de erro, usada para os 4xx e para o 500 |
| Os outros modelos de `views` | As páginas dos temas anteriores |
| `.env.example` | O nome da variável do segredo da sessão, sem o valor |
| `.gitignore` | Mantém fora do Git a `node_modules` e o `.env` |
| `package.json` e `package-lock.json` | O projeto e as versões exatas dos pacotes |

A pasta `node_modules` recria-se com `npm install`. O `.env` não está aqui, de propósito: cada um cria o seu.

## Como correr

Precisas do Node.js 22 ou mais recente e de internet para o primeiro passo.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm install`
3. Copia o `.env.example` para um ficheiro novo, `.env`. Gera um segredo com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` e cola-o no `.env`, a seguir ao `SESSION_SECRET=`. Um segredo com menos de 32 carateres é recusado.
4. `node --env-file=.env server.js`, dentro desta pasta. O terminal mostra `Servidor a correr em http://localhost:3000`.
5. No browser, faz um pedido de reserva e abre o código-fonte do formulário: procura o campo escondido `_csrf`. Para veres o 403, apaga o valor desse campo nas ferramentas de programador e envia. A matriz de falhas do guia diz como provocar as outras falhas.
6. Para parar, Ctrl+C.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0, Express 5.3.0, EJS 7.0.1 e express-session 1.19.0, em macOS, a 12 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
