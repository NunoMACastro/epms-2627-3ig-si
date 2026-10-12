![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: as reservas do catálogo

Laboratório do quinto tema do módulo Aplicações baseadas em browsers. Cerca de 120 minutos, repartidos pelas aulas do tema. Partes do teu catálogo com páginas do tema anterior e acrescentas-lhe as reservas: o formulário, o `POST` que o recebe, a validação no servidor, o formulário outra vez quando há erros e o redirecionamento quando corre bem. Pelo caminho, vês o que corre mal sem cada uma destas peças, porque as provocas de propósito, e no fim verificas o servidor de um colega com uma lista de verificação, e ele o teu.

As ideias e o código estão no [guia do tema](05-formularios-e-validacao.md), e cada parte diz em que secção ou em que passo do exemplo guiado. Escreve o código em vez de o copiar, e antes de cada experiência escreve a previsão no caderno.

## Antes de começar

Precisas do catálogo com páginas do laboratório do tema anterior, a funcionar. Se não o tiveres, copia a pasta [catalogo-com-ejs](../exemplos/aplicacoes-em-browser/catalogo-com-ejs/README.md) dos exemplos para a tua pasta de trabalho e corre `npm install` dentro dela.

Arranca o servidor com `node --watch server.js`, dentro da pasta do projeto. As reservas ficam num array, em memória: sempre que o servidor reinicia, voltam a zero. Vais aproveitar isso para limpar as reservas de teste, guardando o `server.js` para o `--watch` o reiniciar.

Mantém aberto o separador Rede das ferramentas de programador durante todo o laboratório.

## Parte 1: prever antes de programar

Guia: secções "Validar no servidor", "Quando há erros" e "Quando corre bem". Faz-se em papel.

O servidor do fim do exemplo guiado recebe estes pedidos `POST /reservas`, um a seguir ao outro, logo depois de arrancar. Para cada um, escreve no caderno o código da resposta e o que o browser acaba por mostrar.

| Corpo do pedido | Código | O que o browser mostra |
| --- | --- | --- |
| `equipamento_id=1&data=2026-11-03&tempo=2&nome=Inês` | | |
| `equipamento_id=1&data=2026-11-03&tempo=2&nome=` | | |
| `equipamento_id=1&data=2026-11-03&tempo=10&nome=Inês` | | |
| `equipamento_id=7&data=2026-11-03&tempo=2&nome=Inês` | | |
| `equipamento_id=1&data=2026-11-31&tempo=2&nome=Inês` | | |
| `equipamento_id=4&data=2026-11-04&tempo=9&nome=Inês&id=50` | | |

No fim do laboratório, na parte 8, voltas a esta tabela.

## Parte 2: o formulário

Guia: secção "O formulário em HTML" e exemplo guiado, passo 1.

1. Acrescenta ao `server.js` o array `reservas` e o `proximoIdReserva`, e a rota `GET /reservas/nova` do passo 1.
2. Cria o `views/reserva-nova.ejs`, com o formulário da secção "O formulário em HTML". Acrescenta as duas ligações ao menu do cabeçalho e a ligação à página inicial.
3. Abre `/reservas/nova` e carrega em cada etiqueta (o texto "Equipamento", "Dia" e os outros). O cursor vai para o campo dessa etiqueta: é o `for` a apontar para o `id`.
4. Tenta enviar o formulário vazio, e depois com o tempo 12. Regista o que o browser faz, e se aparece algum pedido no separador Rede.
5. Preenche tudo bem e envia. Prevê primeiro o que vais ver.

O que deves ver: a página "Página não encontrada", com o 404, e no separador Rede um `POST` a `reservas`. Ainda não há rota para o `POST`, e o middleware final respondeu. Nos passos anteriores, não houve pedido nenhum: o browser não deixou o formulário sair.

## Parte 3: ler o corpo, e dois erros de propósito

Guia: secção "O corpo do pedido e o middleware que o lê" e exemplo guiado, passo 2.

1. Acrescenta a rota `POST /reservas` da primeira versão do passo 2, e o modelo `views/reserva.ejs`. Não acrescentes ainda o `express.urlencoded`.
2. Preenche o formulário com o projetor, um dia, o tempo 3 e o teu nome, e envia. Prevê primeiro.

O que deves ver: uma página de erro com o código 500 e, no início, `TypeError: Cannot read properties of undefined (reading 'equipamento_id')`. Sem o middleware, o `req.body` não existe.

3. Acrescenta a linha `app.use(express.urlencoded({ extended: false }));` no fim do ficheiro, logo antes do `app.listen`. Guarda e envia outra vez. Prevê primeiro.
4. Regista o que aconteceu, e explica-o no caderno com a segunda regra do middleware.
5. Muda a linha para o sítio certo: a seguir ao middleware de registo e antes das rotas. Guarda e envia outra vez.

O que deves ver: a página "Reserva 1", com o projetor, o dia, o tempo e o teu nome.

6. No separador Rede, clica no `POST` a `reservas` e abre o Payload. Copia para o caderno o que aparece em "Form Data". Confirma que os nomes são os `name` do formulário.
7. Acrescenta a rota `GET /reservas` e o modelo `views/reservas.ejs` do passo 2, e abre `/reservas`: a reserva está na lista.

## Parte 4: o que corre mal sem validação

Guia: exemplo guiado, passo 2, as três experiências.

1. Com a página "Reserva 1" no ecrã, recarrega-a. O browser pergunta se queres reenviar os dados do formulário. Diz que sim. Depois abre `/reservas`. Quantas reservas há? Escreve no caderno porque é que isto é um problema numa aplicação de reservas.
2. Agora vais enviar um pedido que o browser não deixaria passar. No `views/reserva-nova.ejs`, acrescenta ao `<form>` o atributo `novalidate`, que desliga a validação do browser nesse formulário. Guarda, abre `/reservas/nova` e envia o formulário sem preencher nada. Prevê primeiro.

O que deves ver: uma página de erro com o código 500 e `Cannot read properties of undefined (reading 'id')`, a apontar para o `reserva.ejs`. A reserva foi guardada com um equipamento que não existe, e a página dela não consegue mostrar o nome do equipamento.

3. Abre `/reservas`. Prevê primeiro: a lista funciona?

O que deves ver: também um 500. A reserva errada está no array, e a lista tropeça nela. A partir de agora, a lista das reservas está estragada para toda a gente, até o servidor reiniciar. Foi um só pedido.

4. Guarda o `server.js`, sem mudar nada, para o `--watch` reiniciar o servidor e as reservas voltarem a zero. Deixa ficar o `novalidate`: vais precisar dele na parte seguinte.

## Parte 5: validar, e o formulário outra vez

Guia: secções "Validar no servidor" e "Quando há erros: o formulário outra vez", e exemplo guiado, passo 3.

1. Acrescenta ao `server.js` as três funções do guia: a `textoDoCampo`, a `diaValido` e a `validarReserva`. Escreve-as, lendo os comentários.
2. Muda a rota `POST /reservas` para a do passo 3: valida primeiro, responde com o formulário quando há erros, e só depois constrói e guarda a reserva.
3. Muda a rota `GET /reservas/nova` para passar os valores vazios e os erros vazios, e o modelo `reserva-nova.ejs` para o do passo 3. Mantém o `novalidate` no `<form>`.
4. Envia o formulário vazio. Regista o código e as mensagens. Confirma em `/reservas` que nenhuma reserva foi guardada.
5. Preenche tudo bem, mas com o tempo 12. Regista o código, a mensagem e o que ficou preenchido nos outros campos, incluindo a lista do equipamento.
6. Agora o dia que não existe. O calendário do browser não te deixa escolher o 30 de fevereiro, por isso muda temporariamente, no modelo, o `type="date"` do campo do dia para `type="text"`. Escreve `2026-02-30` e envia. Regista a mensagem. Depois repõe o `type="date"`.
7. No nome, escreve `"><b>x</b>`, com as aspas, deixa o tempo vazio, e envia. Prevê primeiro: o que aparece no campo do nome, quando o formulário voltar?

O que deves ver: o campo do nome com o texto `"><b>x</b>` tal como o escreveste, e nenhum negrito na página. O valor voltou ao `value` com `<%=`, que fez escaping às aspas e às etiquetas.

8. Faz uma reserva certa. A página da reserva aparece, como antes.

## Parte 6: o redirecionamento

Guia: secção "Quando corre bem: redirecionar" e exemplo guiado, passo 4.

1. Com a página de uma reserva no ecrã, recarrega-a e aceita reenviar. Confirma em `/reservas` que ficou uma reserva repetida. É o problema da parte 4, que a validação não resolveu.
2. Guarda o `server.js` para limpar as reservas. Na rota do `POST`, troca as duas últimas linhas pelo `res.redirect(303, ...)` do passo 4, e acrescenta a rota `GET /reservas/:id`, abaixo da rota do formulário e da lista.
3. Faz uma reserva. Repara no endereço que o browser mostra no fim, e nos dois pedidos no separador Rede. Regista o código de cada um e o `Location` da resposta ao `POST`. Se não vires o `POST`, liga a opção que mantém o registo ("Preserve log") e envia outra vez.
4. Recarrega a página da reserva. O browser pergunta alguma coisa? Quantas reservas há em `/reservas`?
5. Um erro de propósito. Muda a rota `GET /reservas/:id` para cima da rota `GET /reservas/nova`. Guarda e abre `/reservas/nova`. Prevê primeiro.

O que deves ver: a página "Pedido inválido", com o 400. O pedido a `/reservas/nova` foi parar à rota de uma reserva, com `"nova"` como número.

6. Repõe a ordem certa e confirma que o formulário volta.

## Parte 7: os campos a mais, e o return esquecido

Guia: secção "Validar no servidor", subsecção "Só os campos previstos", e "Erros frequentes".

1. No `reserva-nova.ejs`, dentro do `<form>`, acrescenta um campo escondido, que o utilizador não vê mas o browser envia: `<input type="hidden" name="id" value="999">`. Faz uma reserva.
2. Confirma no Payload que o `id=999` foi enviado. Que número ficou a ter a reserva? Escreve no caderno porque é que o 999 não entrou, apontando a linha do `server.js` responsável.
3. Tira o campo escondido.
4. O último erro de propósito, e o mais perigoso. Na rota do `POST`, apaga o `return` que vem a seguir ao `res.status(400).render(...)`. Guarda e envia o formulário vazio (o `novalidate` ainda lá está). Prevê primeiro: o que mostra o browser, e o que acontece no terminal?

O que deves ver: a barra de endereço muda para `/reservas/1`, como se a reserva tivesse corrido bem, e o browser diz que não consegue ligar-se ao servidor. No terminal aparece `Cannot set headers after they are sent to the client` e, a seguir, `Failed running 'server.js'. Waiting for file changes before restarting...`: o servidor foi abaixo. Sem o `return`, a rota continuou depois do formulário com os erros, guardou a reserva vazia e redirecionou; quando a página do formulário ficou pronta, já não havia a quem a enviar, e o erro deitou o servidor abaixo antes de o browser pedir a página da reserva.

5. Repõe o `return` e guarda. O servidor volta, com as reservas a zero.

## Parte 8: a evidência e a verificação por pares

Guia: secções "Segurança: o que este tema já pede" e "Verificar o que aprendeste".

1. Tira o `novalidate` do `<form>`. A validação do browser volta a funcionar, e a do servidor continua lá.
2. **Envio sem JavaScript.** Nas ferramentas de programador, desliga o JavaScript da página (no Chrome, abre o menu de comandos com Ctrl+Shift+P, no Mac Cmd+Shift+P, e escreve "JavaScript" para encontrar a opção de o desligar). Recarrega o formulário, faz uma reserva e confirma que tudo funciona igual. No caderno, explica porquê: que JavaScript há nas tuas páginas, e onde corre o que faz a reserva? Volta a ligar o JavaScript.
3. **Valor vazio e valor fora do intervalo.** Para a evidência deste tema, regista dois envios recusados pelo servidor, com o código e a mensagem: um com o nome vazio e outro com o tempo fora do intervalo. Como o browser já não os deixa passar, volta a pôr o `novalidate` só para estes dois envios, e tira-o no fim.
4. **Verificação por pares.** Troca de computador com um colega. Com o servidor dele, verifica cada linha desta lista e marca-a como cumprida ou não. Ele faz o mesmo com o teu.

| Verificação | Cumprida? |
| --- | --- |
| Carregar em cada etiqueta põe o cursor no campo certo | |
| O formulário vazio não sai do browser (validação do browser) | |
| Com `novalidate`, o formulário vazio dá 400 e uma mensagem em cada campo | |
| Depois de um erro, os campos certos continuam preenchidos, incluindo a lista do equipamento | |
| Um nome com `"><b>x</b>` volta ao campo como texto, sem negrito | |
| Um envio certo termina noutro endereço, `/reservas/` com um número, depois de um 303 | |
| Recarregar a página da reserva não cria outra reserva | |
| `/reservas/nova` mostra o formulário, e não "Pedido inválido" | |

5. Para cada linha não cumprida, mostra ao colega o que falha e ajuda-o a encontrar a causa. Depois, cada um explica ao outro, sem ler, porque é que a validação do servidor é a que conta.
6. Volta às previsões da parte 1 e corrige a lápis o que previste mal.

## Problemas frequentes no laboratório

### O formulário envia, mas a validação diz que um campo está vazio

O `name` desse campo, no formulário, não é o nome que a `validarReserva` lê. Compara, no Payload, os nomes enviados com os nomes da função. Guia: "Erros frequentes".

### Depois de um erro, a lista do equipamento volta a "Escolhe um equipamento"

Falta o `String(...)` na comparação do `selected`. Guia: "Erros frequentes".

### O servidor foi abaixo e não volta

O `--watch` só reinicia quando guardas um ficheiro. Corrige o que o terminal indica e guarda. Se o terminal não mostrar nenhum erro, faz Ctrl+C e volta a arrancar com `node --watch server.js`.

### Não consigo escolher o 30 de fevereiro no calendário

É o browser a ajudar. Na parte 5, passo 6, o campo do dia passa temporariamente a `type="text"`.

### A página das reservas dá 500

Há no array uma reserva com um equipamento que não existe, da parte 4. Guarda o `server.js` para o servidor reiniciar e as reservas voltarem a zero.

## O que fica no teu caderno

1. As previsões da parte 1, com as correções da parte 8.
2. O "Form Data" da parte 3 e os dois erros do `express.urlencoded`, com a explicação.
3. As três experiências da parte 4, sem validação.
4. Os envios da parte 5: o código, as mensagens e o que ficou preenchido.
5. Os dois pedidos do redirecionamento da parte 6, com os códigos e o `Location`.
6. A resposta da parte 7 sobre o `id=999`, e o que aconteceu sem o `return`.
7. A evidência da parte 8: o envio sem JavaScript, o valor vazio e o valor fora do intervalo, e a lista de verificação do teu colega.

O professor vai pedir-te que expliques, com o teu servidor aberto, porque é que a validação do servidor é a que conta, e o que acontece ao recarregar a página de uma reserva com e sem o redirecionamento.

![Rodapé](../imagens/rodape.png)
