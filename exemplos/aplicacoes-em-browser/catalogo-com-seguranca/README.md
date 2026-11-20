![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com segurança

O catálogo com sessões do tema 06, preparado para quando as coisas correm mal:

- um middleware de erro regista cada falha no terminal, com a data, o pedido HTTP e o stack trace. A quem usa o catálogo, mostra uma página sem pormenores do servidor;
- um erro que já traz um código 4xx, como o 413 de um corpo grande demais, responde com esse código;
- o servidor não arranca com um segredo de sessão com menos de 32 carateres;
- os formulários que mudam a sessão levam um token contra o CSRF, e o servidor recusa com 403, antes das rotas, um `POST` sem o token certo.

Estas medidas tratam os casos do guia, e não chegam para garantir a segurança de uma aplicação inteira. É usado no tema [07 Erros e segurança web](../../../01-aplicacoes-em-browser/07-erros-e-seguranca-web.md). É o resultado do [exemplo guiado do guia](../../../01-aplicacoes-em-browser/07-erros-e-seguranca-web.md#exemplo-guiado-o-catálogo-preparado-para-falhar), pronto a correr. A versão anterior, sem estas proteções, está em [catalogo-com-sessoes](../catalogo-com-sessoes/README.md).

## O que está nesta pasta

- `server.js`: o servidor, com o middleware de erro, a verificação do segredo e o token contra o CSRF.
- `views/item-novo.ejs` e `views/pedido.ejs`: os formulários que mudam a sessão, cada um com o campo escondido `_csrf`.
- `views/erro.ejs`: a página de erro, usada para os 4xx e para o 500.
- `views/inicio.ejs`, `views/equipamentos.ejs`, `views/equipamento.ejs`, `views/reserva.ejs` e `views/reservas.ejs`, e os dois de `views/partials`: as páginas dos temas anteriores.
- `.env.example`: o nome da variável do segredo da sessão, sem o valor.
- `.gitignore`: o que o Git ignora, a `node_modules` e o `.env`.
- `package.json`: o projeto, com o `"type": "module"` e as dependências do Express, do EJS e do express-session.
- `package-lock.json`: as versões exatas dos pacotes.

## Como correr

Precisas do Node.js 24 ou mais recente (`node --version` mostra a tua versão) e de internet para o `npm install`.

1. Copia esta pasta para a tua pasta de trabalho de Sistemas de Informação, fora do repositório dos materiais da disciplina, e abre um terminal dentro da cópia.
2. Instala os pacotes e cria o `.env` a partir do `.env.example`:

   ```bash
   npm install
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`. Se o `npm install` ficar parado, ou acabar com linhas `npm error`, falta a internet: avisa o professor.

3. Gera um segredo com este comando, o de [O segredo, fora do código](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#o-segredo-fora-do-código), no guia do tema 06. Cola-o no `.env`, a seguir ao `SESSION_SECRET=`, e guarda o ficheiro. Um segredo com menos de 32 carateres é recusado.

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Arranca o servidor, dentro desta pasta:

   ```bash
   node --env-file=.env server.js
   ```

   O que deves ver: `Servidor a correr em http://localhost:3000`. Se o terminal disser que o segredo tem menos de 32 carateres, vê [O servidor não arranca, e o segredo está no .env](../../../01-aplicacoes-em-browser/07-erros-e-seguranca-web.md#o-servidor-não-arranca-e-o-segredo-está-no-env), no guia. Se aparecer `Falta o SESSION_SECRET` ou `node: .env: not found`, vê os [Erros frequentes do tema 06](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#erros-frequentes).

5. No browser, abre `http://localhost:3000/pedido/item` e o código-fonte da página: no formulário está o campo escondido `_csrf`, com um valor de 64 carateres. Junta um equipamento e confirma o pedido com um nome fictício, como "Ana Reserva".
6. Para veres o 403, abre outra vez o formulário e preenche-o. Nas ferramentas de programador, no separador Elements (no Firefox, Inspetor), apaga o valor do `_csrf`, como explica o [passo 6 do exemplo guiado](../../../01-aplicacoes-em-browser/07-erros-e-seguranca-web.md#passo-6-os-resultados), e envia: aparece a página "Pedido recusado".

O que deve acontecer em cada caso está no passo 6, e como se provoca cada falha, na [matriz de falhas](../../../01-aplicacoes-em-browser/07-erros-e-seguranca-web.md#passo-7-a-matriz-de-falhas), no passo 7. Para parar, Ctrl+C no terminal. As sessões e as reservas ficam em memória e desaparecem quando o servidor para.

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.3.0, o EJS 7.0.1 e o express-session 1.19.0. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
