![Cabeçalho](../../imagens/cabecalho.png)

# Laboratório: Do pedido à resposta

## O que vais construir

Vais observar, nas ferramentas de programador do browser, os pedidos que ele faz e as respostas que recebe. Registas numa tabela quatro casos: uma página que abre, uma que não existe, um redirecionamento e um pedido que fica sem resposta. No fim, desenhas à mão o diagrama do redirecionamento.

1. [Fase 1: O separador Rede mostra cada pedido e cada resposta](#fase-1-o-separador-rede-mostra-cada-pedido-e-cada-resposta)
2. [Fase 2: Um pedido e uma resposta têm partes](#fase-2-um-pedido-e-uma-resposta-têm-partes)
3. [Fase 3: Uma página são muitos pedidos](#fase-3-uma-página-são-muitos-pedidos)
4. [Fase 4: O código de estado diz como correu o pedido](#fase-4-o-código-de-estado-diz-como-correu-o-pedido)
5. [Fase 5: Um redirecionamento são dois pedidos](#fase-5-um-redirecionamento-são-dois-pedidos)
6. [Fase 6: Sem código de estado, não houve resposta](#fase-6-sem-código-de-estado-não-houve-resposta)
7. [Fase 7: O diagrama de um pedido mostra a conversa no tempo](#fase-7-o-diagrama-de-um-pedido-mostra-a-conversa-no-tempo)

## O que precisas

- Um browser de computador. Os passos estão escritos para o Chrome e o Edge, que têm as mesmas ferramentas. No Firefox, os passos são os mesmos e alguns nomes mudam, como diz [Os nomes no ecrã não são os dos passos](#os-nomes-no-ecrã-não-são-os-dos-passos).
- Internet, para as fases 2 a 5. Confirma que a tens: abre `https://pt.wikipedia.org`, e deve aparecer a página inicial da Wikipédia. Se não abrir, vê [A internet não está a funcionar](#a-internet-não-está-a-funcionar).
- Um editor de texto, como o Visual Studio Code.
- Uma folha e um lápis, para o desenho da fase 7.

## Preparar o projeto

1. Cria o ficheiro onde vais registar o que observas. Usa a tua pasta de trabalho das aulas de Sistemas de Informação. Se ainda não a tens, cria-a num sítio teu, como os Documentos, com um nome como `si`, e não dentro do repositório dos materiais. Abre essa pasta no Visual Studio Code e cria nela um ficheiro novo chamado `respostas-01.md`. Copia para lá estas duas linhas, o princípio de uma tabela:

   ```markdown
   | Fase | Método | Endereço (caminho) | Código de estado | Tipo de conteúdo |
   | --- | --- | --- | --- | --- |
   ```

   Ao longo do laboratório, acrescentas uma linha por cada pedido que observas.

## Fase 1: O separador Rede mostra cada pedido e cada resposta

Abres as ferramentas de programador e preparas o separador Rede, onde vais ver os pedidos. O separador Rede lista, pela ordem, cada pedido que o browser faz e a resposta que recebe. Rever: [O separador Rede mostra cada pedido e cada resposta](../01-do-pedido-a-resposta.md#o-separador-rede-mostra-cada-pedido-e-cada-resposta).

1. Abre um separador novo do browser, vazio, para começares sem nenhuma página carregada.

2. Abre as ferramentas de programador: no Windows, carrega em F12 ou em Ctrl+Shift+I; no Mac, em Cmd+Option+I.

   O que deves ver: um painel ao lado ou por baixo da página, com vários separadores no topo. Se não aparecer, vê [As teclas não abrem as ferramentas](#as-teclas-não-abrem-as-ferramentas).

3. Escolhe o separador "Rede" ("Network"). Se não o vires, está escondido atrás do `>>`, no fim da fila dos separadores.

4. Ativa as duas caixas do topo do separador Rede. "Manter registo" ("Preserve log") faz a lista não se apagar quando mudas de página. "Desativar cache" ("Disable cache") faz o browser pedir tudo outra vez ao servidor, em vez de usar as cópias que guardou de outras visitas.

5. Acrescenta a coluna do método, que o Chrome e o Edge não mostram ao princípio. Clica com o botão direito no cabeçalho de qualquer coluna, por exemplo "Nome" ("Name"), e escolhe "Método" ("Method").

   O que deves ver: uma lista vazia, com colunas como "Nome", "Estado", "Método" e "Tipo" ("Name", "Status", "Method", "Type").

### Paragem 1

O separador Rede está aberto, com "Manter registo" e "Desativar cache" ativos e a coluna "Método" à vista.

Pensa antes de continuares: o browser já fez muitos pedidos hoje, mas a lista está vazia. Porquê? A resposta: o separador Rede só regista os pedidos feitos depois de estar aberto. Por isso abres sempre o separador Rede primeiro, e só depois carregas a página.

## Fase 2: Um pedido e uma resposta têm partes

Abres um artigo da Wikipédia e lês, no separador Rede, as partes do pedido e da resposta. São o método, o endereço, o código de estado, os cabeçalhos e o corpo. Rever: [Um pedido e uma resposta têm partes](../01-do-pedido-a-resposta.md#um-pedido-e-uma-resposta-têm-partes).

1. Com o separador Rede aberto, escreve na barra de endereço `https://pt.wikipedia.org/wiki/Computador` e carrega em Enter.

   O que deves ver: o artigo "Computador" na página e, no separador Rede, uma lista cheia de pedidos.

2. Fica só com o pedido da página. Por cima da lista há botões que filtram os pedidos por tipo, como "Tudo" ("All"), "Doc", "CSS", "JS" e "Img". Escolhe "Doc".

   O que deves ver: um só pedido, chamado `Computador`, com o método `GET`, o estado `200` e o tipo `document`. Isto quer dizer que o browser pediu para ver a página e que o servidor respondeu que correu bem. Se o estado for `304`, vê [Na fase 2, o estado é 304 e não 200](#na-fase-2-o-estado-é-304-e-não-200).

3. Clica no nome `Computador`. Abre-se um painel com separadores sobre este pedido. No separador "Cabeçalhos" ("Headers"), na secção "Geral" ("General"), encontra estes quatro campos:

   - "URL do pedido" ("Request URL"): o endereço completo que pediste;
   - "Método de pedido" ("Request Method"): `GET`;
   - "Código de estado" ("Status Code"): `200`;
   - "Endereço remoto" ("Remote Address"): o número que identifica, na internet, o computador que respondeu, com a porta no fim, depois dos últimos dois pontos.

4. Desce até "Cabeçalhos das respostas" ("Response Headers") e procura `content-type`.

   O que deves ver: `text/html; charset=UTF-8`. Isto quer dizer que o corpo da resposta é HTML, e é por isso que o browser o desenha como página; o `charset=UTF-8` diz como as letras estão codificadas.

5. Abre o separador "Resposta" ("Response").

   O que deves ver: o HTML que o servidor mandou, como texto. É o corpo da resposta. Nas primeiras linhas, entre `<title>` e `</title>`, está o título do artigo.

6. Escreve no `respostas-01.md` a linha da fase 2, com o que leste: o método, o endereço, o código de estado e o tipo de conteúdo, `text/html`. Na coluna do endereço, põe só o caminho, a parte que vem depois de `https://pt.wikipedia.org`. A linha fica assim, com uma barra antes e depois de cada coluna:

   ```markdown
   | 2 | GET | /wiki/Computador | 200 | text/html |
   ```

### Paragem 2

A tabela tem a linha do pedido do artigo, com o método, o caminho, o código de estado e o tipo de conteúdo.

Pensa antes de continuares: o endereço remoto acaba em `:443`, mas o endereço que escreveste não tem porta nenhuma. Porquê? A resposta: 443 é a porta habitual do `https`. Quando o endereço não traz porta, o browser usa a porta habitual do protocolo. Rever: [Cada parte do endereço responde a uma pergunta](../01-do-pedido-a-resposta.md#cada-parte-do-endereço-responde-a-uma-pergunta).

## Fase 3: Uma página são muitos pedidos

Contas os pedidos que o browser fez para mostrar o artigo e vês a que sítios foram. O browser pede primeiro o HTML e depois cada ficheiro que o HTML indica, como os estilos, os scripts e as imagens. Rever: [Uma página são muitos pedidos](../01-do-pedido-a-resposta.md#uma-página-são-muitos-pedidos).

1. Volta ao filtro "Tudo".

   O que deves ver: todos os pedidos que o browser fez para mostrar o artigo, pela ordem em que os fez. O primeiro é o documento `Computador`.

2. Na barra do fundo do separador Rede, lê quantos pedidos foram feitos, em "N pedidos" ("N requests"). No `respostas-01.md`, deixa uma linha em branco por baixo da tabela e escreve uma linha a começar por "Fase 3:", com esse número. Esta linha fica sempre por baixo da tabela, e as linhas das fases seguintes entram na própria tabela.

   O que deves ver: dezenas de pedidos. Não há um número certo, porque muda com o browser, com as extensões que ele tem e com o que fazes na página.

3. Filtra por "CSS", depois por "JS" e depois por "Img", e acrescenta à linha da fase 3 quantos pedidos há de cada tipo. Com um filtro escolhido, a barra do fundo mostra dois números, como `12 / 85 pedidos`, e o primeiro é o dos pedidos desse tipo.

   O que deves ver: estilos e scripts quase todos chamados `load.php?...`, porque a Wikipédia junta vários ficheiros num só pedido. O número de imagens sobe se desceres no artigo, porque o browser só pede cada imagem quando ela está perto de aparecer no ecrã.

4. Com o filtro "Img", clica numa imagem com `.jpg` no nome e, no separador "Cabeçalhos", lê o "URL do pedido".

   O que deves ver: um endereço começado por `https://thumb.wikimedia.org` ou `https://upload.wikimedia.org`, e não por `https://pt.wikipedia.org`. Isto quer dizer que o HTML mandou o browser buscar a imagem a outro sítio, e o browser fez esse pedido sozinho.

### Paragem 3

Por baixo da tabela está a linha da fase 3, com o total de pedidos e as contagens de CSS, JS e imagens que viste.

Pensa antes de continuares: porque é que o documento aparece antes de todos os outros pedidos? A resposta: o browser só sabe que estilos, scripts e imagens tem de pedir depois de ler o HTML.

## Fase 4: O código de estado diz como correu o pedido

Pedes um artigo que não existe e lês o código de estado da resposta. O código diz como correu o pedido, mesmo quando a página parece normal. Rever: [O código de estado diz como correu o pedido](../01-do-pedido-a-resposta.md#o-código-de-estado-diz-como-correu-o-pedido).

1. Antes de carregares em Enter, prevê: a Wikipédia vai mostrar-te uma página? Com que código de estado? Depois escreve na barra de endereço `https://pt.wikipedia.org/wiki/Pagina_que_nao_existe_epms` e carrega em Enter.

   O que deves ver: uma página da Wikipédia, com o logótipo, os menus e a mensagem "A Wikipédia não possui um artigo com este nome exato."

2. Filtra por "Doc".

   O que deves ver: dois pedidos, porque "Manter registo" guardou o da fase 2. O `Computador` tem o estado `200`, e o `Pagina_que_nao_existe_epms` tem o estado `404`. Isto quer dizer que o servidor respondeu, e até mandou uma página em HTML, mas o código diz que o que pediste não existe. Se previste `200`, porque a página aparece bem desenhada, viste agora porque se olha para o código de estado, e não para a página.

3. Acrescenta à tabela, por baixo da linha da fase 2, a linha da fase 4. Para o tipo de conteúdo, clica no pedido e lê o `content-type` em "Cabeçalhos das respostas", como na fase 2.

### Paragem 4

A tabela tem um pedido com `200` e outro com `404`, e os dois receberam uma página em HTML.

Pensa antes de continuares: numa aplicação de reservas, que resposta deve receber quem pede uma reserva que não existe? A resposta: `404`, com uma página em HTML a explicar que essa reserva não existe. Pelo `404`, o browser e os programas sabem que a reserva não existe; pela página, a pessoa percebe porquê.

## Fase 5: Um redirecionamento são dois pedidos

Fazes uma pesquisa na Wikipédia e segues no separador Rede os dois pedidos que ela provoca. A uma resposta 3xx que manda o browser pedir outro endereço, escrito no cabeçalho `location`, chama-se redirecionamento. Rever: [Um redirecionamento são dois pedidos](../01-do-pedido-a-resposta.md#um-redirecionamento-são-dois-pedidos).

1. Limpa a lista, para veres só os pedidos desta fase. Carrega no botão "Limpar registo da rede" ("Clear network log"), um círculo cortado por uma barra, no canto do separador Rede. Confirma que "Manter registo" continua ativo, porque nesta fase o browser muda de página sozinho.

2. Escreve na barra de endereço `https://pt.wikipedia.org/w/index.php?search=projetor+de+video` e carrega em Enter.

   O que deves ver: o artigo "Projetor de vídeo" e, na barra, o endereço do artigo, e não o que escreveste.

3. Filtra por "Doc".

   O que deves ver: dois pedidos. O primeiro é `index.php?search=projetor+de+video`, com o estado `302`. O segundo é o do artigo, `Projetor_de_vídeo`, que pode aparecer como `Projetor_de_v%C3%ADdeo`, com o estado `200`. Se não aparecer o `302`, vê [Na fase 5, não aparece o 302](#na-fase-5-não-aparece-o-302).

4. Clica no primeiro pedido e procura `location` em "Cabeçalhos das respostas".

   O que deves ver: `https://pt.wikipedia.org/wiki/Projetor_de_v%C3%ADdeo`. Isto quer dizer que o servidor respondeu com o endereço do artigo, e o browser fez sozinho o segundo pedido a esse endereço. O `%C3%AD` é a forma como o `í` se escreve num endereço.

5. Acrescenta à tabela as duas linhas da fase 5. No primeiro pedido, a coluna do endereço leva o caminho e o parâmetro de pesquisa, `/w/index.php?search=projetor+de+video`. O caminho é `/w/index.php`, e o parâmetro chama-se `search` e tem o valor `projetor de video`, com um `+` no lugar de cada espaço. Rever: [Cada parte do endereço responde a uma pergunta](../01-do-pedido-a-resposta.md#cada-parte-do-endereço-responde-a-uma-pergunta). O tipo de conteúdo dos dois pedidos está nos cabeçalhos das respostas de cada um.

### Paragem 5

A tabela tem os dois pedidos do redirecionamento, o do `302` e o do `200`.

Pensa antes de continuares: quem escolheu ir ao artigo, e quem fez o pedido ao artigo? A resposta: o servidor escolheu o destino, ao escrevê-lo no `location`. O browser fez o segundo pedido, sem tu fazeres nada. O servidor não manda o artigo por iniciativa própria: é sempre o browser que pede.

## Fase 6: Sem código de estado, não houve resposta

Pedes uma página a uma porta do teu computador onde nenhum programa está à escuta, e vês que, sem resposta, não há código de estado. Esta fase não precisa de internet. Rever: [Sem código de estado, não houve resposta](../01-do-pedido-a-resposta.md#sem-código-de-estado-não-houve-resposta).

1. Limpa a lista do separador Rede e volta ao filtro "Tudo".

2. Escreve na barra de endereço `http://localhost:3999/` e carrega em Enter. `localhost` é o teu próprio computador, e `3999` é a porta.

   O que deves ver: uma página de erro desenhada pelo próprio browser, a dizer que não conseguiu ligar ao `localhost`. No Chrome, o título é "Não é possível aceder a este site", por baixo vem "localhost recusou estabelecer ligação", e no fim o código `ERR_CONNECTION_REFUSED`. Se aparecer outra página, vê [Na fase 6, aparece uma página e não o erro](#na-fase-6-aparece-uma-página-e-não-o-erro).

3. Olha para o separador Rede.

   O que deves ver: um pedido `GET` chamado `localhost`, sem número no estado. No Chrome e no Edge, o estado diz "(falhou)" ("(failed)"), a vermelho. Isto quer dizer que o browser tentou ligar-se à porta 3999 e o teu computador recusou a ligação, porque nenhum programa estava lá à escuta. O pedido nunca chegou a um servidor, e por isso não há resposta nem código de estado. Na fase 4, um servidor respondeu a dizer que o artigo não existia; aqui, não respondeu ninguém.

4. Acrescenta à tabela a linha da fase 6, com `6`, `GET`, `/ em localhost:3999`, `sem código` e `sem resposta`.

### Paragem 6

A tabela está completa. O teu `respostas-01.md` deve estar assim, com as tuas contagens na linha da fase 3:

```markdown
| Fase | Método | Endereço (caminho) | Código de estado | Tipo de conteúdo |
| --- | --- | --- | --- | --- |
| 2 | GET | /wiki/Computador | 200 | text/html |
| 4 | GET | /wiki/Pagina_que_nao_existe_epms | 404 | text/html |
| 5 | GET | /w/index.php?search=projetor+de+video | 302 | text/html |
| 5 | GET | /wiki/Projetor_de_v%C3%ADdeo | 200 | text/html |
| 6 | GET | / em localhost:3999 | sem código | sem resposta |

Fase 3: 85 pedidos; CSS: 6; JS: 14; Img: 20
```

Na segunda linha da fase 5, `/wiki/Projetor_de_vídeo` também está certo.

As quatro primeiras linhas têm código de estado, porque um servidor respondeu: `200` quando correu bem, `404` quando o artigo faltava e `302` para mandar a outro endereço. A última não tem código, porque o pedido não teve resposta.

Pensa antes de continuares: um colega abre `http://localhost:3000/equipamentos` e recebe esta mesma página de erro. O que deve verificar? A resposta: se o servidor está a correr, no terminal onde o ligou, e se escuta na porta 3000.

## Fase 7: O diagrama de um pedido mostra a conversa no tempo

Desenhas à mão o diagrama dos pedidos e das respostas da pesquisa da fase 5. Num diagrama de um pedido, cada programa tem uma coluna, o tempo corre de cima para baixo e cada seta é uma mensagem. Rever: [O diagrama de um pedido mostra a conversa no tempo](../01-do-pedido-a-resposta.md#o-diagrama-de-um-pedido-mostra-a-conversa-no-tempo).

1. Na folha, desenha duas colunas, cada uma com o nome no topo: à esquerda, "browser"; à direita, "servidor da Wikipédia". Não desenhes o servidor de dados da Wikipédia.

2. Desenha as quatro mensagens da fase 5, de cima para baixo, pela ordem em que aconteceram. Nos pedidos, faz uma seta cheia do browser para o servidor e escreve por cima o método e o caminho. Nas respostas, faz uma seta tracejada do servidor para o browser e escreve por cima o código de estado. Junta-lhe o que interessa: na primeira resposta, o `location`; na segunda, "HTML do artigo".

3. Confere o teu desenho com este:

   ```mermaid
   sequenceDiagram
       participant B as browser
       participant W as servidor da Wikipédia
       B->>W: GET /w/index.php?search=projetor+de+video
       W-->>B: 302<br/>location: https://pt.wikipedia.org/wiki/Projetor_de_v%C3%ADdeo
       B->>W: GET /wiki/Projetor_de_v%C3%ADdeo
       W-->>B: 200, HTML do artigo
   ```

   Lê-se de cima para baixo. O browser pede a pesquisa, e o servidor responde `302`, com o endereço do artigo no `location`. Depois, o browser pede esse endereço, e o servidor responde `200`, com o HTML do artigo. No teu desenho, o `location` pode levar só o caminho, `/wiki/Projetor_de_v%C3%ADdeo`.

### Paragem 7

O teu desenho tem duas colunas e quatro setas: dois pedidos a sair do browser e duas respostas do servidor.

Pensa antes de continuares: a Wikipédia tem certamente um servidor de dados, onde guarda os artigos. Porque é que não aparece no teu desenho? A resposta: do browser só se vê a conversa em HTTP com o servidor da Wikipédia. O que esse servidor pergunta à base de dados acontece do lado de lá, e não chega ao separador Rede. Rever: [O browser não fala com a base de dados](../01-do-pedido-a-resposta.md#o-browser-não-fala-com-a-base-de-dados).

## Se alguma coisa falhar

1. Abriste o separador Rede antes de carregar a página? Ele só regista os pedidos feitos depois de estar aberto. Se o abriste depois, recarrega a página: no Windows, com F5 ou Ctrl+R; no Mac, com Cmd+R.
2. "Manter registo" e "Desativar cache" estão ativos? Sem o primeiro, a lista apaga-se quando mudas de página. Sem o segundo, o browser usa as cópias que guardou e não pede tudo ao servidor.
3. Tens o filtro certo? Para ler o pedido da página, "Doc"; para ver todos os pedidos, "Tudo".
4. Estás a ler o pedido certo? Os separadores "Cabeçalhos" e "Resposta" mostram o último pedido em que clicaste.

### Na fase 2, o estado é 304 e não 200

O browser já tinha uma cópia do artigo, de uma visita anterior, e perguntou ao servidor se ela ainda servia. O servidor respondeu `304`, que quer dizer que a cópia serve, e não mandou a página outra vez. Ativa "Desativar cache" e recarrega a página.

### Não encontras os separadores "Cabeçalhos" e "Resposta"

Só aparecem depois de clicares no nome de um pedido. Se o painel estiver muito estreito, alarga-o, arrastando a margem entre ele e a página.

### As teclas não abrem as ferramentas

Em muitos portáteis, as teclas F só funcionam com a tecla Fn ao mesmo tempo, como Fn+F12. Também podes clicar com o botão direito em qualquer sítio da página e escolher "Inspecionar" ("Inspect"). Se o menu não tiver "Inspecionar", as ferramentas estão bloqueadas nesse computador: avisa o professor.

### Os nomes no ecrã não são os dos passos

Os passos dão os nomes do Chrome em português, com o inglês entre parênteses. O Edge pode usar outras palavras para as mesmas opções. Se não encontrares uma opção, procura-a pelo sítio que o passo diz, que é o mesmo em todas as línguas.

No Firefox, os passos são os mesmos, com estas diferenças:

| No Chrome e no Edge | No Firefox |
| --- | --- |
| "Manter registo", no topo do separador Rede | "Registos persistentes", no menu da roda dentada do separador Rede |
| Os filtros "Doc" e "Img" | Os filtros "HTML" e "Imagens" |
| A coluna "Método", que tens de acrescentar | A coluna "Método", que já aparece |
| A secção "Geral" de "Cabeçalhos" | O topo de "Cabeçalhos", com o "Estado" e o "Endereço" |
| O estado "(falhou)", na fase 6 | O estado vazio, na fase 6 |

### Na fase 5, não aparece o 302

A Wikipédia é um serviço de fora e pode mudar a forma como responde a uma pesquisa: em vez do `302`, podes receber logo uma lista de resultados, com `200`. Nesse caso, faz a fase 5 e o desenho da fase 7 com os registos 3 e 4 do [apoio para trabalhar sem internet](01-do-pedido-a-resposta-laboratorio/README.md). São pedidos reais à mesma pesquisa, com o `302` e o `location`.

### Na fase 6, aparece uma página e não o erro

Há um programa à escuta na porta 3999, por exemplo um servidor teu que ficou ligado. Troca a porta do endereço por outra, como `3998`, e repete a fase.

### A internet não está a funcionar

Sem internet, as fases 2 a 5 não se fazem no browser. Em vez disso, lês pedidos reais à Wikipédia, guardados num ficheiro. O [apoio para trabalhar sem internet](01-do-pedido-a-resposta-laboratorio/README.md) diz que registo usar em cada fase. Se não conseguires abrir a ligação, pede ao professor a cópia dos registos.

As fases 1 e 6 fazem-se no browser, como estão escritas, porque não precisam de internet. Quando a internet voltar, faz as fases 2 a 5 no browser, com o separador Rede aberto.

## Desafios

1. Escolhe uma imagem do artigo "Computador" e lê o `content-type` dela. Compara-o com o do documento e escreve no `respostas-01.md` porque são diferentes.
2. Desenha à mão o diagrama do pedido de um artigo que não existe, como o da fase 4. Depois desenha também o de uma ligação recusada, como a da fase 6, e compara os dois.

## Antes de terminares

- [ ] A tabela do `respostas-01.md` tem as linhas das fases 2, 4, 5 e 6, com `200`, `404`, `302` e uma linha sem código.
- [ ] Por baixo da tabela está a linha da fase 3, com as contagens que realmente viste.
- [ ] O desenho da fase 7, à mão, tem duas colunas e quatro setas, e os dois pedidos saem do browser.
- [ ] Consegues explicar, por palavras tuas, a diferença entre uma resposta `404` e uma ligação recusada.

![Rodapé](../../imagens/rodape.png)
