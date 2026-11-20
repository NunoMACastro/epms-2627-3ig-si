![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com formulários

O catálogo com páginas do tema 04, agora com reservas feitas num formulário. O formulário envia por `POST`, e o servidor lê o corpo com o `express.urlencoded` e verifica cada campo. Com erros, responde 400 e mostra outra vez o formulário, com os valores escritos e uma mensagem em cada campo errado. Com tudo certo, guarda a reserva e responde com um redirecionamento 303 para a página dela. É usado no tema [05 Formulários e validação](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md). É o resultado do [exemplo guiado do guia](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md#exemplo-guiado-as-reservas-do-catálogo), pronto a correr.

A versão anterior, sem reservas, está em [catalogo-com-ejs](../catalogo-com-ejs/README.md). O [catalogo-com-reservas](../catalogo-com-reservas/README.md) faz as mesmas reservas com respostas em JSON, para comparar. No tema 06, é o ponto de partida do [exemplo guiado](../../../01-aplicacoes-em-browser/06-cookies-e-sessoes.md#exemplo-guiado-o-pedido-em-curso), e as reservas fazem-se a partir de um pedido em curso, guardado na sessão, em [catalogo-com-sessoes](../catalogo-com-sessoes/README.md).

## O que está nesta pasta

- `server.js`: o servidor, com as funções de validação e as rotas das reservas.
- `views/reserva-nova.ejs`: o formulário de reserva, com os valores e as mensagens de erro.
- `views/reserva.ejs`: a página de uma reserva, para onde o browser vai depois de reservar.
- `views/reservas.ejs`: a lista das reservas.
- `views/inicio.ejs`, `views/equipamentos.ejs`, `views/equipamento.ejs` e `views/erro.ejs`: as páginas do tema 04. A inicial tem agora a ligação para reservar.
- `views/partials/cabecalho.ejs` e `views/partials/rodape.ejs`: o início e o fim de todas as páginas. O menu tem as ligações para as reservas.
- `package.json`: o projeto, com o `"type": "module"` e as dependências do Express e do EJS.
- `package-lock.json`: as versões exatas dos pacotes.

## Como correr

Precisas do Node.js 24 ou mais recente (`node --version` mostra a tua versão) e de internet para o `npm install`. Copia esta pasta para a tua pasta de trabalho de Sistemas de Informação, fora do repositório dos materiais da disciplina, e abre um terminal dentro da cópia:

```bash
npm install
node server.js
```

Se o `npm install` ficar parado, ou acabar com linhas `npm error`, falta a internet: avisa o professor.

O que deves ver: o terminal mostra `Servidor a correr em http://localhost:3000`. No browser, abre `http://localhost:3000/reservas/nova` e faz uma reserva com um nome fictício: o browser vai para `/reservas/1`, a página da reserva. O que cada pedido deve dar está no [passo 6 do exemplo guiado](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md#passo-6-os-resultados). Para parar, Ctrl+C no terminal. As reservas ficam em memória e desaparecem quando o servidor para.

A validação do browser não te deixa enviar o formulário vazio. Para veres a do servidor, acrescenta `novalidate` ao `<form>` do `views/reserva-nova.ejs`, recarrega a página e envia o formulário vazio. O formulário volta com uma mensagem em cada um dos quatro campos, e o separador Rede mostra o código 400. No fim, tira o `novalidate`.

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.3.0 e o EJS 7.0.1. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
