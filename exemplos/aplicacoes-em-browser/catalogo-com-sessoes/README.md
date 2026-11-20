![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com sessões

O catálogo com formulários do tema 05, agora com um pedido em curso guardado numa sessão. Juntam-se ao pedido um ou mais equipamentos, um de cada vez, e tira-se o que já não se quer. No fim, confirma-se tudo de uma vez, com um nome, ou cancela-se. Confirmar cria uma reserva por equipamento, e confirmar ou cancelar termina a sessão. É usado no tema [06 Cookies e sessões](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md). É o resultado do [exemplo guiado do guia](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#exemplo-guiado-o-pedido-em-curso), pronto a correr.

A versão anterior, com uma reserva de cada vez, está em [catalogo-com-formularios](../catalogo-com-formularios/README.md). No tema 07, é o ponto de partida do [exemplo guiado](../../../01-aplicacoes-em-browser/07-erros-e-seguranca-web.md#exemplo-guiado-o-catálogo-preparado-para-falhar), e o catálogo fica preparado para falhar, em [catalogo-com-seguranca](../catalogo-com-seguranca/README.md).

## O que está nesta pasta

- `server.js`: o servidor, com a sessão, o pedido em curso, a confirmação e o cancelamento.
- `views/item-novo.ejs`: o formulário para juntar um equipamento ao pedido.
- `views/pedido.ejs`: o pedido em curso, com a remoção, a confirmação e o cancelamento.
- `views/reserva.ejs` e `views/reservas.ejs`: uma reserva e a lista das reservas.
- `views/inicio.ejs`, `views/equipamentos.ejs`, `views/equipamento.ejs` e `views/erro.ejs`: as páginas dos temas anteriores.
- `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs`: o início e o fim de todas as páginas. O menu mostra quantos equipamentos tem o pedido.
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

3. Gera um segredo com este comando, o de [O segredo, fora do código](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#o-segredo-fora-do-código), no guia. Cola-o no `.env`, a seguir ao `SESSION_SECRET=`, e guarda o ficheiro.

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Arranca o servidor, dentro desta pasta:

   ```bash
   node --env-file=.env server.js
   ```

   O que deves ver: `Servidor a correr em http://localhost:3000`. Se aparecer `Falta o SESSION_SECRET` ou `node: .env: not found`, vê os [Erros frequentes](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#erros-frequentes) do guia.

5. No browser, abre `http://localhost:3000/` e junta dois equipamentos ao pedido: o menu passa a "O teu pedido (2)". Antes de confirmares, abre o catálogo numa janela anónima: aí, o pedido aparece vazio, porque é outra sessão, e a janela normal continua com os dois equipamentos. Depois, confirma o pedido na janela normal, com um nome fictício, como "Ana Reserva". O browser vai para a lista das reservas, com uma reserva por equipamento, e o menu volta a "O teu pedido (0)".

O que deve acontecer em cada caso está no [passo 7 do exemplo guiado](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#passo-7-os-resultados), e o que vês nas ferramentas de programador, no [passo 8](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#passo-8-o-cookie-no-browser). Para parar, Ctrl+C no terminal. As sessões e as reservas ficam em memória e desaparecem quando o servidor para.

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.3.0, o EJS 7.0.1 e o express-session 1.19.0. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
