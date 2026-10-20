![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: Do pedido à resposta

Laboratório do tema Do pedido à resposta. Vais construir um registo dos pedidos que o browser faz e o diagrama de um redirecionamento. Avança ao teu ritmo. Cada passo explica a ideia, o que fazer e o que deves ver. O [guia](01-do-pedido-a-resposta.md) desenvolve a teoria.


## O que vais construir

Vais preencher uma tabela de observação e desenhar o percurso de dois pedidos. Não escreves um servidor neste laboratório.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | Abres as ferramentas do browser | Vês a lista onde os pedidos vão aparecer |
| 2 | Pedes um artigo | Identificas método, estado e conteúdo |
| 3 | Contas os recursos da página | Distingues documento, estilos, scripts e imagens |
| 4 | Pedes um artigo inexistente | Reconheces uma resposta 404 com HTML |
| 5 | Fazes uma pesquisa | Segues o redirecionamento em dois pedidos |
| 6 | Pedes uma porta sem servidor | Distingues falta de resposta de erro HTTP |
| 7 | Desenhas o percurso | Tens um diagrama com quatro setas |

## Palavras que vais usar

- **Pedido**: mensagem que o browser envia para obter alguma coisa.
- **Resposta**: mensagem que o servidor devolve, com um código de estado e, normalmente, conteúdo.
- **Método**: operação indicada no pedido. Aqui vais observar `GET`, que pede para ver.
- **Cabeçalhos**: informação sobre a mensagem, como o tipo de conteúdo.
- **Corpo**: conteúdo da mensagem, como o HTML de uma página.
- **Código de estado**: número que diz como o servidor tratou o pedido.
- **Redirecionamento**: resposta que manda o browser pedir outro endereço.
- **Cache**: cópias de ficheiros que o browser guarda para não voltar a pedi-los.
- **Porta**: número que identifica o programa à escuta num computador.
- **Ferramentas de programador**: painel do browser onde observas a página e a rede.
- **Rede**: separador das ferramentas que lista os pedidos e as respostas.

## O que precisas

Precisas de um browser de computador: Chrome, Edge ou Firefox. O Chrome e o Edge têm as mesmas ferramentas, porque são feitos sobre o mesmo motor; os passos estão escritos para eles. No Firefox os nomes mudam um pouco, e quando a diferença importa o passo diz qual é.

As partes 2 a 5 precisam de internet. A parte 6 não, e podes fazê-la mesmo que a rede da escola falhe.

No teu caderno, ou num ficheiro de texto, prepara esta tabela. Vais preenchê-la ao longo do laboratório, uma linha por pedido observado:

| Parte | Método | Endereço (caminho) | Código de estado | Tipo de conteúdo |
| --- | --- | --- | --- | --- |
| | | | | |

## Se alguma coisa falhar

1. Confirma que abriste as ferramentas antes de recarregar a página. Só registam os pedidos feitos depois de abertas.
2. Se a lista mostrar pedidos antigos, usa o botão de limpar antes da experiência seguinte.
3. Se um endereço externo não abrir, confirma se outros sites abrem. Regista o que observaste; não inventes o código esperado.
4. Na fase 6, usa a porta indicada só se não houver um servidor teu nela. Se houver, pede ao professor outra porta livre.

## Fase 1: abrir as ferramentas de programador

Todos os browsers de computador trazem ferramentas para quem desenvolve páginas. Uma delas mostra todos os pedidos que o browser faz e todas as respostas que recebe. É essa que vais usar.

1. Abre um separador novo, vazio.
2. Abre as ferramentas de programador: tecla F12, ou Ctrl+Shift+I no Windows, ou Cmd+Option+I no Mac. Também podes clicar com o botão direito em qualquer sítio da página e escolher "Inspecionar".
3. Abre-se um painel, ao lado ou por baixo da página. No topo do painel há vários separadores. Escolhe "Network", que em português aparece como "Rede". Se não o vires, pode estar escondido atrás de um `>>` no fim da fila de separadores.
4. No topo do separador Rede há duas caixas que interessam. Ativa "Preserve log" ("Manter registo"), para a lista não se apagar quando mudas de página. Ativa também "Disable cache" ("Desativar cache"), para o browser pedir tudo de novo em vez de usar cópias que já tem guardadas.

O que deves ver: uma lista vazia, com cabeçalhos de colunas como Name, Status, Type, Size e Time (Nome, Estado, Tipo, Tamanho e Tempo). A lista está vazia porque as ferramentas só registam os pedidos feitos depois de estarem abertas. Esta é a primeira regra do laboratório: abre o separador Rede antes de carregar a página.

No Firefox, o separador chama-se também "Rede", e a lista já mostra a coluna do método. No Chrome e no Edge a coluna do método não aparece por omissão. Acrescenta-a agora: clica com o botão direito no cabeçalho de qualquer coluna e escolhe "Method" ("Método").

### Paragem 1

A lista de Rede está aberta. Recarregar uma página acrescenta pedidos.

## Fase 2: o pedido de uma página

Para saber mais: no [guia do tema](01-do-pedido-a-resposta.md), secção "A conversa entre o browser e o servidor".

1. Com o separador Rede aberto, escreve na barra de endereço `https://pt.wikipedia.org/wiki/Computador` e carrega em Enter.
2. A lista enche-se de pedidos. Por cima da lista há botões para filtrar por tipo: All, Doc, CSS, JS, Img e outros (no Firefox: Todos, HTML, CSS, JS, Imagens). Escolhe "Doc" (no Firefox, "HTML"). Fica um só pedido, chamado `Computador`.
3. Lê a linha desse pedido. O método deve ser `GET`, o estado `200` e o tipo `document`.
4. Clica no nome `Computador`. Abre-se um painel com vários separadores sobre este pedido. No separador "Headers" ("Cabeçalhos"), procura a secção "General" ("Geral"). Encontra e copia para o caderno:
   - Request URL: o endereço completo pedido;
   - Request Method: o método;
   - Status Code: o código de estado;
   - Remote Address: o endereço do computador que respondeu, com a porta no fim, depois de dois pontos.
5. Ainda nos cabeçalhos, desce até "Response Headers" ("Cabeçalhos de resposta") e procura `content-type`. Deve dizer `text/html`, seguido do conjunto de caracteres.
6. Abre o separador "Response" ("Resposta"). Vês o HTML que o servidor mandou, como texto. É o corpo da resposta. Procura lá dentro o título do artigo, entre `<title>` e `</title>`.
7. Preenche a primeira linha da tabela do caderno.

Pensa antes de continuares: porque não escreveste a porta 443 no endereço? A resposta: 443 é a porta habitual de `https`. Quando o endereço a omite, o browser usa-a automaticamente.

### Paragem 2

A tabela tem um pedido de documento, com método, estado e tipo de conteúdo.

## Fase 3: uma página são muitos pedidos

Para saber mais: no [guia do tema](01-do-pedido-a-resposta.md), secção "Uma página são muitos pedidos".

1. Volta a escolher "All" ("Todos") nos filtros. Vês todos os pedidos que o browser fez para mostrar o artigo.
2. No fundo do painel há uma barra que diz quantos pedidos foram feitos ("requests" ou "pedidos"). Copia o número para o caderno. Não há um número certo: muda com o artigo, com o browser e com o que o browser já tinha guardado. O que importa é a ordem de grandeza.
3. Filtra por "CSS", depois por "JS", depois por "Img". Para cada tipo, regista quantos pedidos há.
4. Volta a "All" e ordena a lista pela coluna da cascata ("Waterfall"), ou olha simplesmente para a ordem da lista, que é a ordem dos pedidos. Qual foi o primeiro pedido? Deve ser o documento `Computador`.
5. Escolhe uma imagem na lista e clica nela. No separador "Headers", vê o Request URL. O servidor é o mesmo do artigo?

O que deves ver: dezenas de pedidos, de vários tipos, e o documento em primeiro lugar. Muitas imagens vêm de outros servidores, com nomes acabados em `wikimedia.org`, e não de `pt.wikipedia.org`. Um HTML pode mandar o browser buscar ficheiros a outros servidores, e o browser faz esses pedidos sozinho.

Pensa antes de continuares: porque aparece o pedido do documento antes dos recursos que ele indica? A resposta: o browser tem de ler o HTML para descobrir que estilos, imagens e scripts deve pedir.

### Paragem 3

Registaste as contagens e comparaste o servidor do documento com o de uma imagem.

## Fase 4: um artigo que não existe

Para saber mais: no [guia do tema](01-do-pedido-a-resposta.md), secção "Os códigos de estado".

1. Na barra de endereço, escreve `https://pt.wikipedia.org/wiki/Pagina_que_nao_existe_epms` e carrega em Enter.
2. A página aparece: tem o logótipo, os menus e uma mensagem a dizer que a Wikipédia não tem nenhum artigo com aquele nome.
3. Filtra por "Doc" e lê o estado do pedido.
4. Preenche a linha correspondente na tabela do caderno.

O que deves ver: o estado é `404`, apesar de a página estar bem desenhada. O servidor respondeu, e respondeu com um corpo em HTML, mas o código diz que o que se pediu não existe. Se só olhasses para a página, podias pensar que tinha corrido tudo bem.

Pensa antes de continuares: que resposta deve ter uma reserva que não existe? A resposta: 404, com uma página HTML a explicar a falta. O código indica o resultado ao programa; o corpo dá uma mensagem à pessoa.

### Paragem 4

A tabela distingue uma resposta 404 de uma página que abriu com 200.

## Fase 5: uma pesquisa

Para saber mais: no [guia do tema](01-do-pedido-a-resposta.md), secções "Ler um endereço" e "Os códigos de estado".

1. Confirma que "Preserve log" está ativo. Carrega no botão que limpa a lista, um círculo cortado por uma barra, no canto do separador Rede.
2. Escreve na barra de endereço `https://pt.wikipedia.org/w/index.php?search=projetor+de+video` e carrega em Enter.
3. Repara no endereço que fica na barra depois de a página carregar. Não é o que escreveste.
4. Filtra por "Doc". Devem aparecer dois pedidos. O primeiro é `index.php?search=projetor+de+video`. Lê o estado.
5. Clica nesse primeiro pedido e, nos cabeçalhos de resposta, procura `location`. Copia o valor para o caderno.
6. Clica no segundo pedido e lê o estado.
7. Preenche as duas linhas na tabela do caderno.

O serviço externo pode mudar. Se houver mais pedidos ou outro destino, regista a sequência que o separador Rede realmente mostra e confirma-a com o professor.

O que deves ver no percurso usado neste laboratório: o primeiro pedido recebe `302`, e a resposta traz um cabeçalho `location` com o endereço do artigo "Projetor de vídeo". O browser leu esse cabeçalho e fez sozinho um segundo pedido `GET` a esse endereço, que recebeu `200`. Foram dois pedidos e duas respostas, e tu só escreveste um endereço. No `location` vês também `v%C3%ADdeo`: é a forma como o `í` vai escrito num endereço.

Perguntas para o caderno:

1. No endereço que escreveste, qual é o caminho e qual é o parâmetro de pesquisa? Qual é o nome do parâmetro e qual é o seu valor?
2. Quem decidiu ir ao segundo endereço: tu, o browser ou o servidor?

As respostas: o caminho é `/w/index.php`; o parâmetro chama-se `search` e contém o texto `projetor de video`. O `+` representa o espaço nesta pesquisa. O servidor escolhe o destino ao enviar `location`; o browser faz o novo pedido.

### Paragem 5

A tabela tem os dois pedidos do redirecionamento e o cabeçalho que liga um ao outro.

## Fase 6: quando não há resposta

Para saber mais: no [guia do tema](01-do-pedido-a-resposta.md), secção "Quando a conversa falha". Esta parte não precisa de internet.

1. Limpa a lista do separador Rede.
2. Escreve na barra de endereço `http://localhost:3999/` e carrega em Enter.
3. Lê a página que aparece e copia a mensagem de erro para o caderno.
4. Olha para o separador Rede. Há um pedido para `localhost`, e no estado não há número: aparece "(failed)" ("(falhou)"), a vermelho, ou uma mensagem como `net::ERR_CONNECTION_REFUSED`. No Firefox o estado fica simplesmente vazio.

O que deves ver: uma página de erro desenhada pelo próprio browser, a dizer que o `localhost` recusou a ligação. O pedido saiu do browser e chegou ao teu computador, mas nenhum programa estava à escuta na porta 3999, e por isso ninguém respondeu. Não há código de estado porque não há resposta. É muito diferente da parte 4: lá, um servidor respondeu a dizer que não tinha o artigo; aqui, não houve servidor nenhum a responder.

Vais ver esta mesma página muitas vezes no próximo tema. Quando a vires, já sabes o que quer dizer: o pedido saiu do browser, e nenhum programa respondeu naquela porta.

Pensa antes de continuares: um colega abre `http://localhost:3000/equipamentos` e recebe esta página. O que deve verificar? A resposta: se o servidor está a correr no terminal e se escuta na porta 3000. Deve também confirmar `http`, em vez de `https`.

### Paragem 6

Registaste uma ligação recusada sem código de estado.

## Fase 7: o diagrama de um pedido

Para saber mais: no [guia do tema](01-do-pedido-a-resposta.md), secção "Exemplo guiado", passo 8.

Escolhe a pesquisa da fase 5 e desenha no caderno o diagrama dos pedidos e respostas. Faz uma coluna para o browser e outra para o servidor da Wikipédia. O tempo corre de cima para baixo. Nas setas dos pedidos escreve o método e o caminho. Nas respostas, escreve o código de estado e o conteúdo do corpo ou o cabeçalho que interessa.

Não desenhes o servidor de dados. A Wikipédia tem certamente um. Mas não o consegues ver do browser: tudo o que acontece entre o servidor de aplicação e a base de dados fica escondido de quem está do lado de fora. É o que o guia diz na secção "Três programas, três papéis". E agora viste-o.

O diagrama deve ter quatro setas: dois pedidos e duas respostas. Confere o teu com este modelo. O destino real pode variar com o serviço.

```text
browser                                   servidor da Wikipédia
   │                                               │
   │ GET /w/index.php?search=projetor+de+video     │
   │──────────────────────────────────────────────→│
   │ 302, location: /wiki/Projetor_de_v%C3%ADdeo   │
   │←──────────────────────────────────────────────│
   │ GET /wiki/Projetor_de_v%C3%ADdeo              │
   │──────────────────────────────────────────────→│
   │ 200, HTML do artigo                           │
   │←──────────────────────────────────────────────│
```

Leitura guiada: segue o tempo de cima para baixo. A primeira resposta indica outro destino. O browser inicia o segundo pedido e recebe o artigo; o servidor não envia o artigo por iniciativa própria.

### Paragem 7

O diagrama tem dois pedidos a sair do browser e duas respostas do servidor.

## Problemas frequentes

### A lista do separador Rede está vazia

As ferramentas só registam o que acontece depois de estarem abertas. Com o separador Rede aberto, recarrega a página com F5, ou Cmd+R no Mac.

### Aparecem muito poucos pedidos, ou nenhuma imagem

O browser usou cópias guardadas de visitas anteriores e não voltou a pedir. Confirma que "Disable cache" está ativo e recarrega.

### Não encontro os separadores Headers ou Response

Só aparecem depois de clicares no nome de um pedido. Se o painel ficar muito estreito, arrasta a margem para o alargar, ou muda a posição do painel para baixo da página, no menu de três pontos das ferramentas.

### A lista apaga-se quando mudo de página

"Preserve log" não está ativo. Ativa-o e repete o passo.

### As ferramentas estão em inglês, ou em português, e os nomes não batem

Os passos dão os dois nomes. Se mesmo assim não encontrares uma opção, a posição no ecrã é a mesma nas duas línguas: procura pelo sítio, e não pela palavra.

### A internet da escola não está a funcionar

Faz a parte 6, que não precisa de rede. As outras partes podem ser feitas em casa, ou observadas no projetor do professor.

## O que fica no teu caderno

No fim do laboratório deves ter:

1. A tabela tem uma linha para o pedido da fase 2, outra para o da fase 4 e duas para os da fase 5. A linha da fase 6 fica sem código de estado;
2. o número de pedidos da página da parte 3, com o número de pedidos de CSS, de JavaScript e de imagens;
3. as respostas às perguntas para o caderno de cada parte;
4. o diagrama da parte 7.

É este o registo que mostras ao professor no fim da aula. Explica-o por palavras tuas: o diagrama e a tabela são a evidência de que sabes ler a conversa entre o browser e um servidor.

## Desafios

1. Escolhe uma imagem da página. Compara o seu tipo de conteúdo com o do documento e explica por que são diferentes.
2. Desenha o pedido e a resposta de um artigo inexistente. Depois compara esse desenho com o de uma ligação recusada.

## Antes de terminares

- [ ] A tabela distingue 200, 404, redirecionamento e falta de resposta.
- [ ] Registaste as contagens que realmente observaste.
- [ ] O diagrama mostra quem inicia cada pedido.
- [ ] Consegues explicar, por palavras tuas, a diferença entre uma resposta 404 e uma ligação recusada.

![Rodapé](../imagens/rodape.png)
