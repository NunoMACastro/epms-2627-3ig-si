![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com reservas

Uma variante do catálogo em que a reserva responde em JSON. Com tudo certo, a resposta é o código 201, com a reserva criada. Com um equipamento que não existe, um campo em falta ou um tempo que não é um número inteiro positivo, é o 400. A mensagem é uma só, para todos os campos. Esta variante não confirma se o dia existe nem o limite do tempo: serve para comparar a forma da resposta.

É usado no tema [05 Formulários e validação](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md), para comparar com o exemplo do guia, o [catalogo-com-formularios](../catalogo-com-formularios/README.md). Esse responde com páginas EJS, com uma mensagem em cada campo errado e com o redirecionamento 303. A comparação está no fim de [Quando corre bem: redirecionar](../../../01-aplicacoes-em-browser/05-formularios-e-validacao.md#quando-corre-bem-redirecionar), num bloco "Para ires mais longe". Tem também as rotas e os middlewares do tema 03.

## O que está nesta pasta

- `server.js`: o servidor, com a página da pesquisa e o formulário de reserva escritos no próprio ficheiro, e as respostas em JSON.
- `package.json`: o projeto, com o `"type": "module"` e a dependência do Express.
- `package-lock.json`: as versões exatas dos pacotes.

## Como correr

Precisas do Node.js 24 ou mais recente (`node --version` mostra a tua versão) e de internet para o `npm install`. Copia esta pasta para a tua pasta de trabalho de Sistemas de Informação, fora do repositório dos materiais da disciplina, e abre um terminal dentro da cópia:

```bash
npm install
node server.js
```

Se o `npm install` ficar parado, ou acabar com linhas `npm error`, falta a internet: avisa o professor.

O que deves ver: o terminal mostra `Servidor a correr em http://localhost:3000`, e cada pedido deixa lá uma linha, escrita pelo middleware de registo. No browser, `http://localhost:3000/` tem a pesquisa por sala e a ligação para o formulário de reserva, em `/reservas/nova`. Cada pedido deve dar:

| Pedido | Código | Resposta |
| --- | --- | --- |
| `GET /equipamentos/2` | 200 | `{"id":2,"nome":"Projetor","sala":"A03"}` |
| `GET /equipamentos/abc` | 400 | `{"erro":"O identificador tem de ser um número inteiro positivo"}` |
| `GET /equipamentos/9` | 404 | `{"erro":"Não existe o equipamento 9"}` |
| `GET /equipamentos?sala=B12` | 200 | o portátil e o monitor |
| `GET /equipamentos?sala=Z99` | 200 | `[]` |
| No formulário: equipamento 2, dia 2026-10-20, tempo 3 | 201 | `{"id":1,"equipamentoId":2,"data":"2026-10-20","tempo":3}` |
| No formulário: equipamento 9, com o dia e o tempo | 400 | `{"erro":"Reserva inválida: confirma o equipamento, o dia e o tempo"}` |
| `GET /reservas` | 200 | a lista, com a reserva 1 |
| `GET /nao-existe` | 404 | `Página não encontrada.` |

Compara as respostas às duas linhas do formulário, a reserva certa e a do equipamento 9, com as do `catalogo-com-formularios`. Vê o código e o tipo da resposta, no separador Rede, e o endereço que fica no browser. Corre um exemplo de cada vez, porque os dois usam a porta 3000: para um com Ctrl+C antes de arrancares o outro. As reservas ficam em memória e perdem-se quando o servidor para.

## Versões e compatibilidade

As versões usadas são o Node.js 24 e o Node.js 26, com o npm 11. O `package-lock.json` fixa as versões de todos os pacotes, como o Express 5.3.0. O `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
