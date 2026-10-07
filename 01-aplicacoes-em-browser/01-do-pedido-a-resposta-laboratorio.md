![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: observar pedidos e respostas no browser

Laboratório do primeiro tema do módulo Aplicações baseadas em browsers. Cerca de 40 minutos. Segue os passos com o browser aberto ao lado. Cada passo diz o que fazer e o que deves ver; quando o que vês não bate certo com o que está escrito, para e tenta perceber porquê antes de avançar, e se não conseguires, chama o professor.

As ideias que aqui observas estão explicadas no [guia do tema](01-do-pedido-a-resposta.md). Sempre que um passo usar uma ideia nova, diz em que secção do guia está.

## Antes de começar

Precisas de um browser de computador: Chrome, Edge ou Firefox. O Chrome e o Edge têm as mesmas ferramentas, porque são feitos sobre o mesmo motor; os passos estão escritos para eles. No Firefox os nomes mudam um pouco, e quando a diferença importa o passo diz qual é.

As partes 2 a 5 precisam de internet. A parte 6 não, e podes fazê-la mesmo que a rede da escola falhe.

No teu caderno, ou num ficheiro de texto, prepara esta tabela. Vais preenchê-la ao longo do laboratório, uma linha por pedido observado:

| Parte | Método | Endereço (caminho) | Código de estado | Tipo de conteúdo |
| --- | --- | --- | --- | --- |
| | | | | |

## Parte 1: abrir as ferramentas de programador

Todos os browsers de computador trazem ferramentas para quem desenvolve páginas. Uma delas mostra todos os pedidos que o browser faz e todas as respostas que recebe. É essa que vais usar.

1. Abre um separador novo, vazio.
2. Abre as ferramentas de programador: tecla F12, ou Ctrl+Shift+I no Windows, ou Cmd+Option+I no Mac. Também podes clicar com o botão direito em qualquer sítio da página e escolher "Inspecionar".
3. Abre-se um painel, ao lado ou por baixo da página. No topo do painel há vários separadores. Escolhe "Network", que em português aparece como "Rede". Se não o vires, pode estar escondido atrás de um `>>` no fim da fila de separadores.
4. No topo do separador Rede há duas caixas que interessam. Ativa "Preserve log" ("Manter registo"), para a lista não se apagar quando mudas de página. Ativa também "Disable cache" ("Desativar cache"), para o browser pedir tudo de novo em vez de usar cópias que já tem guardadas.

O que deves ver: uma lista vazia, com cabeçalhos de colunas como Name, Status, Type, Size e Time (Nome, Estado, Tipo, Tamanho e Tempo). A lista está vazia porque as ferramentas só registam os pedidos feitos depois de estarem abertas. Esta é a primeira regra do laboratório: abre o separador Rede antes de carregar a página.

No Firefox, o separador chama-se também "Rede", e a lista já mostra a coluna do método. No Chrome e no Edge a coluna do método não aparece por omissão. Acrescenta-a agora: clica com o botão direito no cabeçalho de qualquer coluna e escolhe "Method" ("Método").

## Parte 2: o pedido de uma página

Guia: secção "A conversa entre o browser e o servidor".

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

Pergunta para o caderno: a porta do Remote Address é 443. Porque é que não a escreveste no endereço? (Guia: secção "Ler um endereço".)

## Parte 3: uma página são muitos pedidos

Guia: secção "Uma página são muitos pedidos".

1. Volta a escolher "All" ("Todos") nos filtros. Vês todos os pedidos que o browser fez para mostrar o artigo.
2. No fundo do painel há uma barra que diz quantos pedidos foram feitos ("requests" ou "pedidos"). Copia o número para o caderno. Não há um número certo: muda com o artigo, com o browser e com o que o browser já tinha guardado. O que importa é a ordem de grandeza.
3. Filtra por "CSS", depois por "JS", depois por "Img". Para cada tipo, regista quantos pedidos há.
4. Volta a "All" e ordena a lista pela coluna da cascata ("Waterfall"), ou olha simplesmente para a ordem da lista, que é a ordem dos pedidos. Qual foi o primeiro pedido? Deve ser o documento `Computador`.
5. Escolhe uma imagem na lista e clica nela. No separador "Headers", vê o Request URL. O servidor é o mesmo do artigo?

O que deves ver: dezenas de pedidos, de vários tipos, e o documento em primeiro lugar. Muitas imagens vêm de outros servidores, com nomes acabados em `wikimedia.org`, e não de `pt.wikipedia.org`. Um HTML pode mandar o browser buscar ficheiros a outros servidores, e o browser faz esses pedidos sozinho.

Pergunta para o caderno: porque é que o documento é sempre o primeiro pedido?

## Parte 4: um artigo que não existe

Guia: secção "Os códigos de estado".

1. Na barra de endereço, escreve `https://pt.wikipedia.org/wiki/Pagina_que_nao_existe_epms` e carrega em Enter.
2. A página aparece: tem o logótipo, os menus e uma mensagem a dizer que a Wikipédia não tem nenhum artigo com aquele nome.
3. Filtra por "Doc" e lê o estado do pedido.
4. Preenche a linha correspondente na tabela do caderno.

O que deves ver: o estado é `404`, apesar de a página estar bem desenhada. O servidor respondeu, e respondeu com um corpo em HTML, mas o código diz que o que se pediu não existe. Se só olhasses para a página, podias pensar que tinha corrido tudo bem.

Pergunta para o caderno: na tua aplicação, se alguém pedir uma reserva que não existe, a resposta deve ter que código? E deve ter corpo?

## Parte 5: uma pesquisa

Guia: secções "Ler um endereço" e "Os códigos de estado".

1. Confirma que "Preserve log" está ativo. Carrega no botão que limpa a lista, um círculo cortado por uma barra, no canto do separador Rede.
2. Escreve na barra de endereço `https://pt.wikipedia.org/w/index.php?search=projetor+de+video` e carrega em Enter.
3. Repara no endereço que fica na barra depois de a página carregar. Não é o que escreveste.
4. Filtra por "Doc". Devem aparecer dois pedidos. O primeiro é `index.php?search=projetor+de+video`. Lê o estado.
5. Clica nesse primeiro pedido e, nos cabeçalhos de resposta, procura `location`. Copia o valor para o caderno.
6. Clica no segundo pedido e lê o estado.
7. Preenche as duas linhas na tabela do caderno.

O que deves ver: o primeiro pedido recebe `302`, e a resposta traz um cabeçalho `location` com o endereço do artigo "Projetor de vídeo". O browser leu esse cabeçalho e fez sozinho um segundo pedido `GET` a esse endereço, que recebeu `200`. Foram dois pedidos e duas respostas, e tu só escreveste um endereço. No `location` vês também `v%C3%ADdeo`: é a forma como o `í` vai escrito num endereço.

Perguntas para o caderno:

1. No endereço que escreveste, qual é o caminho e qual é o parâmetro de pesquisa? Qual é o nome do parâmetro e qual é o seu valor?
2. Quem decidiu ir ao segundo endereço: tu, o browser ou o servidor?

## Parte 6: quando não há resposta

Guia: secção "Quando a conversa falha". Esta parte não precisa de internet.

1. Limpa a lista do separador Rede.
2. Escreve na barra de endereço `http://localhost:3999/` e carrega em Enter.
3. Lê a página que aparece e copia a mensagem de erro para o caderno.
4. Olha para o separador Rede. Há um pedido para `localhost`, e no estado não há número: aparece "(failed)" ("(falhou)"), a vermelho, ou uma mensagem como `net::ERR_CONNECTION_REFUSED`. No Firefox o estado fica simplesmente vazio.

O que deves ver: uma página de erro desenhada pelo próprio browser, a dizer que o `localhost` recusou a ligação. O pedido saiu do browser e chegou ao teu computador, mas nenhum programa estava à escuta na porta 3999, e por isso ninguém respondeu. Não há código de estado porque não há resposta. É muito diferente da parte 4: lá, um servidor respondeu a dizer que não tinha o artigo; aqui, não houve servidor nenhum a responder.

Vais ver esta mesma página muitas vezes no próximo tema, sempre que tentares abrir o teu servidor sem ele estar ligado, ou com a porta errada no endereço. Quando a vires, já sabes onde procurar.

Pergunta para o caderno: um colega abre `http://localhost:3000/equipamentos` e recebe esta página. Diz duas coisas que ele deve verificar.

## Parte 7: o diagrama de um pedido

Guia: secção "Exemplo guiado", passo 8.

Escolhe a pesquisa da parte 5 e desenha no caderno o diagrama dos pedidos e respostas, como o do guia: duas colunas, uma para o browser e outra para o servidor da Wikipédia, com o tempo a correr de cima para baixo. Em cada seta escreve o método e o caminho, se for um pedido, ou o código de estado e o que vinha no corpo ou no cabeçalho que interessa, se for uma resposta.

Não desenhes o servidor de dados. A Wikipédia tem certamente um, mas não o consegues ver do browser: tudo o que acontece entre o servidor de aplicação e a base de dados fica escondido de quem está do lado de fora. É o que o guia diz na secção "Três programas, três papéis", e agora viste-o.

O diagrama deve ter quatro setas: dois pedidos e duas respostas.

## Problemas frequentes no laboratório

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

1. a tabela com uma linha por pedido observado: o da parte 2, o da parte 4, os dois da parte 5 e o da parte 6, este sem código de estado;
2. o número de pedidos da página da parte 3, com o número de pedidos de CSS, de JavaScript e de imagens;
3. as respostas às perguntas para o caderno de cada parte;
4. o diagrama da parte 7.

É este o registo que mostras ao professor no fim da aula. Explica-o por palavras tuas: o diagrama e a tabela são a evidência de que sabes ler a conversa entre o browser e um servidor.

![Rodapé](../imagens/rodape.png)
