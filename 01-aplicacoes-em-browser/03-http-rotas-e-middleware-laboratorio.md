![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o catálogo com reservas

Laboratório do terceiro tema do módulo Aplicações baseadas em browsers. Cerca de 120 minutos, em duas ou três aulas. Partes do teu catálogo de equipamentos do tema anterior e acrescentas-lhe, por esta ordem, a rota de detalhe com as duas verificações, o filtro por sala, o middleware de registo, uma página com uma pesquisa, o formulário de reserva com o `POST`, e o middleware final. Pelo caminho, provocas de propósito os três erros de ordem do middleware, e no fim escreves e verificas a tabela de contratos do teu servidor.

As ideias e o código estão no [guia do tema](03-http-rotas-e-middleware.md), e cada parte diz em que secção. Antes de cada experiência, escreve a previsão no caderno: é a previsão errada que mostra o que ainda não estava percebido.

## Antes de começar

Precisas do catálogo de equipamentos do laboratório do tema anterior, a funcionar, com as rotas `/` e `/equipamentos`. Se não o tiveres, copia a pasta [catalogo-de-equipamentos](../exemplos/aplicacoes-em-browser/catalogo-de-equipamentos/README.md) para a tua pasta de trabalho e corre `npm install` dentro dela.

Se o teu catálogo já tem a rota de detalhe e o filtro por sala da aula, ótimo: nas partes 2 e 3 só acrescentas o que falta.

Em todo o laboratório, depois de mudares o `server.js`, reinicia o servidor (Ctrl+C e `node server.js`), ou usa `node --watch server.js`, que reinicia sozinho quando guardas.

## Parte 1: prever antes de programar

Guia: secções "Três sítios por onde um pedido traz dados" e "Os códigos de estado que o teu código escolhe".

Copia esta tabela para o caderno e preenche as duas últimas colunas com a tua previsão, antes de escreveres qualquer código. No fim do laboratório voltas a ela.

| Pedido | Onde vêm os dados | Código que esperas |
| --- | --- | --- |
| `GET /equipamentos/2` | | |
| `GET /equipamentos/abc` | | |
| `GET /equipamentos/9` | | |
| `GET /equipamentos?sala=B12` | | |
| `GET /equipamentos?sala=Z99` | | |
| `POST /reservas` com o equipamento 2, um dia e o tempo 3 | | |
| `POST /reservas` com o equipamento 9 | | |
| `GET /nao-existe` | | |

## Parte 2: a rota de detalhe

Guia: exemplo guiado, passo 1.

1. Acrescenta ao `server.js`, a seguir à rota `/equipamentos`, a rota `GET /equipamentos/:id` do passo 1, com as duas verificações.
2. Reinicia e abre, um de cada vez: `/equipamentos/2`, `/equipamentos/abc`, `/equipamentos/0`, `/equipamentos/2.5` e `/equipamentos/9`.
3. Para cada um, regista o código (no separador Rede) e a mensagem.

O que deves ver: 200 com o projetor; 400 para `abc`, `0` e `2.5`; 404 para o 9.

4. Agora uma experiência. Na linha `const id = Number(req.params.id);`, apaga o `Number(` e o `)` correspondente, para ficar `const id = req.params.id;`. Reinicia e abre `/equipamentos/2`.
5. Prevê antes de abrir. Depois regista o que aconteceu, e explica-o no caderno com a última secção de "Três sítios por onde um pedido traz dados" do guia.
6. Repõe o `Number(...)` e confirma que `/equipamentos/2` volta a responder 200.

## Parte 3: o filtro por sala

Guia: exemplo guiado, passo 2.

1. Se ainda não o tens, muda a rota `/equipamentos` para a do passo 2.
2. Abre `/equipamentos?sala=B12`, `/equipamentos?sala=Z99` e `/equipamentos`, sem nada.
3. Abre agora `/equipamentos?Sala=B12`, com o `S` maiúsculo. Prevê primeiro.

O que deves ver: o portátil e o monitor; uma lista vazia, `[]`, com o código 200; a lista toda; e, com `Sala` maiúsculo, outra vez a lista toda. Os nomes dos parâmetros distinguem maiúsculas: `req.query.sala` não encontra `Sala`, fica `undefined`, e a rota devolve tudo.

## Parte 4: ver os dados do pedido no browser

Guia: secção "Observar os pedidos no browser".

1. Com o separador Rede aberto, abre `/equipamentos?sala=A03`.
2. Clica no pedido e abre o separador "Payload" ("Carga"). Regista o que aparece em "Query String Parameters".
3. Abre `/equipamentos/3` e procura no Payload o 3. Não está lá. Onde o encontras?

## Parte 5: o middleware de registo

Guia: secção "O middleware" e exemplo guiado, passo 3.

1. Acrescenta o middleware de registo do passo 3, logo a seguir aos dados e antes de todas as rotas.
2. Reinicia e faz três pedidos quaisquer. No terminal, aparece uma linha por pedido, com o método e o endereço.
3. Agora o primeiro erro de propósito. Apaga a linha `next();` do middleware. Reinicia e abre `/equipamentos`. Prevê antes.

O que deves ver: o browser fica à espera, com o indicador de carregamento a rodar, e não mostra nada. No terminal, aparece a linha `GET /equipamentos` e mais nada. Não há nenhuma mensagem de erro. O middleware recebeu o pedido, não respondeu e não o passou à frente: o pedido ficou parado.

4. Repõe o `next();`, reinicia e confirma que tudo volta a responder.

## Parte 6: a página inicial com uma pesquisa

Guia: secção "GET e POST, com mais pormenor" e exemplo guiado, passo 4.

1. Substitui a rota `/` pela do passo 4, com o formulário de pesquisa.
2. Abre `http://localhost:3000/`, escreve `B12` no campo e carrega em "Pesquisar".
3. Olha para a barra de endereço e para o separador Rede.

O que deves ver: o browser foi para `/equipamentos?sala=B12`. O formulário `GET` transformou o campo `sala` num parâmetro de pesquisa, e a rota que respondeu é a mesma da parte 3.

## Parte 7: a reserva por POST

Guia: secção "O middleware que lê os formulários" e exemplo guiado, passo 5.

Nesta parte, o middleware que lê o corpo entra no fim, de propósito.

1. Acrescenta, no início do ficheiro, o array `reservas` e o contador `proximoIdReserva`. Acrescenta as rotas `GET /reservas/nova`, `POST /reservas` e `GET /reservas` do passo 5, mas **ainda sem** o `app.use(express.urlencoded(...))`.
2. Reinicia, abre `/reservas/nova`, preenche o equipamento 2, um dia e o tempo 3, e envia.
3. Prevê antes de enviar. Depois regista o código no separador Rede e a mensagem no terminal.

O que deves ver: o browser recebe um erro 500, e o terminal mostra `TypeError: Cannot read properties of undefined (reading 'equipamento_id')`. Sem o middleware, `req.body` não existe.

4. Acrescenta a linha `app.use(express.urlencoded({ extended: false }));` **no fim do ficheiro**, logo antes do `app.listen`. Reinicia e envia outra vez.
5. Regista o que aconteceu. Continua igual: quando a rota corre, o middleware, que está abaixo dela, ainda não correu.
6. Muda a linha para o sítio certo: a seguir ao middleware de registo e antes das rotas. Reinicia e envia outra vez.

O que deves ver: o browser mostra a reserva criada, em JSON, com o `id` 1. No separador Rede, o `POST /reservas` tem o código 201. No Payload aparece "Form Data", com os três campos.

7. Abre `/reservas`: a reserva está na lista.
8. Volta ao formulário e envia com o equipamento 9. Regista o código e a mensagem.
9. Volta à página com a reserva criada (a resposta do `POST`) e recarrega-a. O browser pergunta se queres reenviar o formulário. Diz que sim e abre `/reservas`. Quantas reservas há agora? Escreve no caderno porque é que isto é um problema numa aplicação de reservas. O tema dos formulários resolve-o.

## Parte 8: o middleware final

Guia: secção "O middleware final" e exemplo guiado, passo 6.

1. Acrescenta o middleware final do passo 6 depois de todas as rotas, logo antes do `app.listen`. Reinicia.
2. Abre `/nao-existe`. Deves ver "Página não encontrada.", com o código 404.
3. O terceiro erro de propósito. Muda o middleware final para logo a seguir ao middleware de registo, antes de todas as rotas. Reinicia e abre `/equipamentos`. Prevê primeiro.

O que deves ver: "Página não encontrada." para todos os endereços, incluindo os que existem. O middleware final responde a tudo e não chama `next()`, por isso nenhum pedido chega às rotas.

4. Repõe o middleware final no fim do ficheiro e confirma que as rotas voltam a responder.

## Parte 9: a tabela de contratos e a evidência

Guia: secção "A tabela de contratos HTTP".

1. Escreve no caderno a tabela de contratos HTTP do teu servidor, com uma linha por pedido que ele aceita. Se o teu servidor for igual ao do guia, a tabela também é; se acrescentaste alguma coisa, acrescenta a linha.
2. Verifica cada linha no browser, com o separador Rede aberto, e marca-a como verificada.
3. Para a evidência deste tema, regista três pedidos à rota de detalhe, com o endereço, o código e a mensagem: um válido, um com o parâmetro inválido e um com um recurso inexistente.
4. Volta à tabela de previsões da parte 1 e corrige a lápis o que previste mal. Para cada correção, escreve numa frase o que te enganou.

## Problemas frequentes no laboratório

### Mudei o código e nada mudou

O servidor não foi reiniciado. Ctrl+C e `node server.js`, ou usa `node --watch server.js`.

### O formulário envia, mas os campos chegam vazios

Os nomes não batem certo. O atributo `name` de cada campo do formulário tem de ser igual ao nome que a rota lê em `req.body`: `name="equipamento_id"` e `req.body.equipamento_id`. Confirma no Payload que nomes o browser enviou.

### O browser não deixa enviar o formulário

Um campo com `required` está vazio, ou o tempo é menor do que o `min`. É o browser a ajudar. Para testar o 400 da parte 7, usa um equipamento que não existe, como o 9, que o formulário deixa passar.

### Cannot set headers after they are sent to the client

Uma rota respondeu duas vezes: falta um `return` depois de uma resposta de erro. Guia: secção "Responder uma vez, e sair".

### A página inicial aparece como texto, com as etiquetas à vista

Falta o `<!doctype html>` no início do texto, ou o texto do HTML ficou com um erro: uma crase a mais ou a menos acaba o texto antes do tempo. Compara com o passo 4 do guia.

### SyntaxError a apontar para uma linha do HTML

Há uma crase dentro do HTML, que o JavaScript leu como o fim do texto. Dentro de um texto com crases, o HTML não pode ter crases.

## O que fica no teu caderno

1. A tabela de previsões da parte 1, com as correções da parte 9.
2. Os resultados das partes 2 e 3, incluindo as experiências do `Number` e do `Sala` maiúsculo, com a explicação.
3. Os três erros do middleware (partes 5, 7 e 8): a previsão, o que aconteceu e porquê.
4. A resposta da parte 7, passo 9, sobre recarregar a página da reserva.
5. A tabela de contratos HTTP do teu servidor, verificada, e os três pedidos da evidência.

O professor vai pedir-te que expliques, para um dos três pedidos da evidência, porque é que o código é aquele, e que digas o que acontecia se o middleware de registo ficasse sem o `next()`.

![Rodapé](../imagens/rodape.png)
