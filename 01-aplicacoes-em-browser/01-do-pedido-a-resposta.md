![Cabeçalho](../imagens/cabecalho.png)

# Do pedido à resposta

Módulo Aplicações baseadas em browsers. Primeiro tema do módulo, com três aulas de 60 minutos: o diagnóstico inicial, a sua correção e a observação dos pedidos no browser. Este guia é para ler e estudar, e não tem código para escrever. A parte feita no computador está no [laboratório](01-do-pedido-a-resposta-laboratorio.md), e os exercícios para fazeres sozinho estão na [ficha](01-do-pedido-a-resposta-exercicios.md).

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. Um sistema de informação começa numa organização
4. Três programas, três papéis
5. A conversa entre o browser e o servidor
6. Ler um endereço
7. Os métodos: ver ou mudar
8. Os códigos de estado
9. Uma página são muitos pedidos
10. O servidor não se lembra de ti
11. Exemplo guiado: uma reserva do princípio ao fim
12. Quando a conversa falha
13. Erros frequentes
14. Verificar o que aprendeste
15. O que vem a seguir

## O que vais aprender

Neste módulo vais construir uma aplicação web em que o servidor gera as páginas que o browser mostra. Antes de escreveres a primeira linha desse servidor, precisas de ter na cabeça um desenho claro de quem faz o quê: o que acontece no teu computador, o que acontece no servidor, onde ficam os dados e como é que estas partes conversam umas com as outras. Sem esse desenho, cada erro que aparecer vai parecer um mistério, porque não vais saber em que parte procurar.

Este guia constrói esse desenho, sem código. Parte de uma situação real de uma escola, a reserva de equipamentos, e segue-a desde a necessidade de quem a faz até à informação que fica guardada e que alguém vai consultar mais tarde.

No fim deste guia deves conseguir:

- distinguir dados de informação, e explicar como um processo de uma organização produz informação;
- dizer o que corre no browser, o que corre no servidor de aplicação e o que corre no servidor de dados, e onde tem de ficar a palavra-passe da base de dados;
- descrever um pedido e uma resposta HTTP: o método, o endereço, o código de estado e o conteúdo;
- ler um endereço e separar as suas partes;
- seguir uma operação, como fazer uma reserva, do clique no browser até à base de dados e de volta, e desenhá-la num diagrama;
- perante uma página que não carrega, dar uma hipótese de falha de rede e outra de falha da aplicação.

## O que já sabes e vais usar

Este guia dá por sabido o que o diagnóstico inicial verificou, e que vem dos anos anteriores:

- **Tabelas relacionais.** Uma tabela tem linhas e colunas; a chave primária identifica cada linha; a chave estrangeira liga uma linha a uma linha de outra tabela. No diagnóstico, cada reserva apontava para um equipamento pelo `equipamento_id`.
- **SQL.** `SELECT` com `WHERE` e `ORDER BY`, o `JOIN` entre duas tabelas e o `GROUP BY` com `COUNT`. Neste guia aparecem algumas consultas, só para leres e perceberes o que pedem.
- **HTML.** Uma página é texto com etiquetas, como `<h1>` ou `<p>`, e um formulário (`<form>`) junta campos que o utilizador preenche e envia.
- **JavaScript.** Variáveis, funções, arrays e objetos. Neste guia não escreves JavaScript, mas é a linguagem do servidor que vais construir a seguir.

Também já ouviste falar de servidores e de rotas. Este guia arruma essas ideias e dá-lhes nome. Se o diagnóstico mostrou que alguma das partes acima está fraca, não é motivo para parar: o professor indica-te o que rever, e o guia volta a explicar o que usa.

## Um sistema de informação começa numa organização

### O problema da escola

Numa escola há equipamentos que não pertencem a uma sala nem a um professor: projetores portáteis, portáteis, câmaras, colunas de som. Quem precisa de um para uma aula tem de o reservar. Durante anos isto fez-se numa folha afixada na sala dos professores: cada professor escrevia o nome, o equipamento, o dia e o tempo letivo.

A folha funciona enquanto há poucos equipamentos e pouca gente. Depois começam os problemas. Dois professores escrevem o mesmo projetor para o mesmo tempo, porque um não viu a linha do outro. Ninguém sabe dizer, sem contar à mão, quais são os equipamentos mais pedidos, e por isso a escola não sabe o que comprar a seguir. Quando um equipamento não é devolvido, não há forma rápida de saber quem o levou por último. E a folha só se consulta na sala dos professores.

Uma aplicação web resolve estes problemas: qualquer professor faz a reserva a partir de qualquer computador, a aplicação recusa uma reserva para um equipamento que já está ocupado nesse tempo, e a direção pode perguntar, a qualquer momento, que equipamentos foram mais reservados no período. É esta aplicação que vai servir de exemplo ao longo do módulo.

### Organização, processo, dados e informação

Antes de pensar em servidores, vale a pena dar nome às peças do problema, porque são estas peças que distinguem Sistemas de Informação de simplesmente programar.

A **organização** é a escola. Tem pessoas com papéis diferentes: professores que pedem equipamentos, um funcionário que os entrega e recebe, uma direção que decide compras.

Um **processo** é uma sequência de passos que a organização repete para atingir um fim. A reserva de um equipamento é um processo: o professor escolhe o equipamento e o tempo, alguém verifica se está livre, a reserva fica registada, no dia o professor levanta o equipamento e no fim devolve-o. Cada passo tem alguém que o faz e deixa alguma coisa registada.

Os **dados** são os factos registados em cada passo, um a um: o equipamento 2, o dia 20 de outubro, o terceiro tempo, o estado "confirmada". Um dado sozinho diz pouco. "Projetor, 20 de outubro, terceiro tempo" é um facto, mas não responde a nenhuma pergunta de ninguém.

A **informação** é o resultado de juntar e organizar dados para responder a uma pergunta de alguém. "O projetor está livre no terceiro tempo de amanhã?" é uma pergunta de um professor, e a resposta é informação. "Quais foram os cinco equipamentos mais reservados neste período?" é uma pergunta da direção, e a resposta é informação que ajuda a decidir uma compra. Os mesmos dados, organizados de formas diferentes, respondem a perguntas diferentes.

Um **sistema de informação** é o conjunto de pessoas, processos, dados e tecnologia que recolhe dados quando o processo acontece e os transforma em informação quando alguém precisa dela. A aplicação web é a parte tecnológica do sistema, mas não é o sistema inteiro: se os professores continuarem a usar a folha, a aplicação não tem dados, e não há informação nenhuma para tirar dela.

Esta distinção tem uma consequência prática que vais encontrar no projeto: antes de desenhares tabelas ou rotas, perguntas que informação a organização precisa e que passos do processo produzem os dados para a obter. Uma tabela que ninguém preenche, ou uma pergunta para a qual não se guardou o dado necessário, são erros de sistema de informação, e nenhum código os corrige.

### Os dados da reserva

Para a aplicação de reservas, bastam duas tabelas. São parecidas com as do diagnóstico, com mais duas colunas na reserva: o dia e o tempo letivo.

**equipamentos**

| id | nome | sala |
| ---: | --- | --- |
| 1 | Portátil | B12 |
| 2 | Projetor | A03 |
| 3 | Impressora | Secretaria |
| 4 | Monitor | B12 |

**reservas**

| id | equipamento_id | data | tempo | estado |
| ---: | ---: | --- | ---: | --- |
| 25 | 1 | 2026-10-20 | 2 | confirmada |
| 26 | 2 | 2026-10-20 | 5 | confirmada |
| 27 | 2 | 2026-10-21 | 3 | cancelada |

A coluna `sala` diz onde o equipamento fica guardado. A coluna `tempo` é o número do tempo letivo no dia. O `equipamento_id` de cada reserva é uma chave estrangeira para a tabela de equipamentos: a reserva 26 é do equipamento 2, que é o projetor. Os dados são fictícios, como todos os deste módulo.

### Para confirmar

1. "Monitor, sala B12" é um dado ou informação? E "na sala B12 há dois equipamentos disponíveis para reserva"?
2. Que passo do processo de reserva produz a linha 26 da tabela de reservas?
3. A direção quer saber quantas reservas foram canceladas em cada mês. Os dados acima chegam para responder? Que coluna faz falta, se alguma faltar?

## Três programas, três papéis

### O browser, o servidor de aplicação e o servidor de dados

Quando um professor faz uma reserva, há três programas envolvidos, e cada um tem um papel que os outros não podem fazer.

O **browser** (Chrome, Edge, Firefox, Safari) corre no computador do professor. Sabe pedir páginas, mostrá-las e enviar o que o professor escreve num formulário. Não sabe nada sobre reservas: não conhece as regras da escola nem vê a base de dados. Mostra o que lhe mandam e envia o que o utilizador preenche.

O **servidor de aplicação** é um programa que corre noutro computador, ou no mesmo, à espera de pedidos. É aqui que vive a lógica do sistema: recebe o pedido do browser, verifica as regras ("este equipamento existe?", "já está reservado nesse tempo?"), pergunta à base de dados o que precisa e constrói a resposta, que é a página HTML que o browser vai mostrar. Neste módulo, o servidor de aplicação é um programa em JavaScript que corre em Node.js, e é ele que vais escrever.

O **servidor de dados** é o sistema de gestão de base de dados, no teu caso o PostgreSQL. Guarda as tabelas e responde a consultas SQL. Não sabe o que é uma página web nem fala com o browser: só recebe SQL do servidor de aplicação e devolve linhas.

```text
 computador do professor          servidor de aplicação           servidor de dados
┌──────────────────────┐        ┌──────────────────────┐        ┌──────────────────┐
│       browser        │ pedido │  Node.js e Express   │  SQL   │    PostgreSQL    │
│                      │ ─────→ │                      │ ─────→ │                  │
│ mostra e envia       │        │ regras e páginas     │        │ tabelas          │
│                      │ ←───── │                      │ ←───── │                  │
└──────────────────────┘resposta└──────────────────────┘ linhas └──────────────────┘
```

Repara que há duas conversas diferentes, e não uma. O browser conversa com o servidor de aplicação, em HTTP. O servidor de aplicação conversa com o servidor de dados, em SQL. O browser nunca conversa com o servidor de dados.

Os três programas podem estar em três computadores diferentes, e numa escola ou numa empresa é o mais comum. Nas aulas, enquanto desenvolves, vão estar muitas vezes os três no teu computador. Isso não muda os papéis: continuam a ser três programas, cada um à espera do seu tipo de conversa.

### Porque é que o browser não fala com a base de dados

Parece mais simples o browser perguntar diretamente ao PostgreSQL. Não se faz por duas razões, e as duas são de segurança.

A primeira é a palavra-passe. Para falar com o PostgreSQL é preciso um utilizador e uma palavra-passe da base de dados. Tudo o que o browser recebe, o utilizador pode ler: basta abrir as ferramentas de programador, como vais fazer no laboratório. Uma palavra-passe que chegue ao browser deixou de ser secreta. Por isso a palavra-passe da base de dados fica só no servidor de aplicação, e nunca vai em nenhuma página, em nenhum ficheiro que o browser descarregue nem em nenhum repositório público.

A segunda são as regras. Se o browser pudesse escrever na tabela de reservas, quem quisesse escreveria lá o que lhe apetecesse: uma reserva para um equipamento que não existe, ou para um projetor já ocupado. As regras têm de ser verificadas num sítio que o utilizador não controla, e esse sítio é o servidor. O browser pode ajudar, por exemplo avisando que falta preencher um campo, mas essa ajuda é só conforto: a decisão é sempre do servidor, porque o browser está nas mãos do utilizador.

### O que corre onde

Uma forma de testar se o desenho ficou claro é pegar numa ação e perguntar onde corre.

| Ação | Onde corre |
| --- | --- |
| Mostrar a lista de equipamentos com cores e tipos de letra | browser |
| Decidir se o projetor está livre no terceiro tempo | servidor de aplicação, com uma consulta ao servidor de dados |
| Procurar as reservas do projetor para esse dia | servidor de dados, a executar o SQL |
| Construir o HTML da página de confirmação | servidor de aplicação |
| Guardar a nova linha na tabela de reservas | servidor de dados |
| Avisar que o campo do dia está vazio, antes de enviar | browser, só como ajuda; o servidor volta a verificar |

### Para confirmar

1. Um colega propõe pôr a palavra-passe da base de dados num ficheiro JavaScript que o browser descarrega, "porque assim é mais rápido". O que lhe respondes?
2. Se o PostgreSQL mudar para outro computador, qual dos três programas tem de saber o novo endereço? O browser tem de mudar alguma coisa?

## A conversa entre o browser e o servidor

### Cliente e servidor

Na conversa entre o browser e o servidor de aplicação, os papéis são sempre os mesmos. O browser é o **cliente**: é ele que começa a conversa, com um pedido. O servidor de aplicação é o **servidor**: está à espera, recebe o pedido e devolve uma resposta. O servidor nunca fala primeiro. Se ninguém lhe pedir nada, não manda nada a ninguém.

Pensa no balcão da reprografia da escola. O funcionário está do lado de dentro, à espera. Tu chegas e pedes "vinte cópias desta ficha". Ele faz o trabalho e entrega-te as cópias, ou diz-te que a máquina está avariada. Cada pedido tem uma resposta. O funcionário não vai à tua sala perguntar se precisas de cópias. E se fores lá três vezes, são três pedidos e três respostas.

Um servidor web funciona da mesma forma, e a regra mais importante é esta: um pedido, uma resposta. Cada vez que clicas numa ligação, escreves um endereço ou envias um formulário, o browser faz um pedido e espera uma resposta.

Para estar à espera, o servidor tem de estar a correr: é um programa que se liga e fica ligado, a escutar. Fica a escutar numa **porta**, um número que distingue os vários programas que podem estar à escuta no mesmo computador. Quando o browser faz um pedido, diz a que computador e a que porta o quer entregar. Vais ver isto na prática no tema seguinte, quando ligares o teu primeiro servidor.

### HTTP, a língua da conversa

Para o browser e o servidor se perceberem, precisam de uma língua comum, com regras sobre o que se diz e por que ordem. Essa língua chama-se **HTTP** (HyperText Transfer Protocol, protocolo de transferência de hipertexto). Um protocolo é isso mesmo: um conjunto de regras para uma conversa. Quando o endereço começa por `https`, a conversa é a mesma, mas cifrada pelo caminho, para que ninguém a meio a consiga ler ou alterar.

Um **pedido HTTP** tem sempre:

- um **método**, que diz o que o cliente quer fazer: `GET` para pedir para ver alguma coisa, `POST` para enviar dados que mudam alguma coisa;
- um **endereço**, que diz o que o cliente quer: a página dos equipamentos, a reserva 26;
- **cabeçalhos**, linhas com informação sobre o pedido, como o nome do servidor a que se destina ou o tipo de conteúdo que o browser aceita;
- às vezes, um **corpo**, com os dados enviados, como os campos de um formulário.

Uma **resposta HTTP** tem sempre:

- um **código de estado**, um número de três algarismos que diz como correu: `200` quer dizer que correu bem, `404` que o que se pediu não existe;
- **cabeçalhos**, entre eles o tipo do conteúdo que vem a seguir, como HTML, uma imagem ou texto;
- quase sempre, um **corpo**, que é o conteúdo propriamente dito: o HTML da página, os bytes da imagem.

Um pedido e uma resposta são texto, e podes lê-los. É assim que fica, por escrito, o pedido que o browser faz quando um professor abre a lista de equipamentos da sala B12:

```text
GET /equipamentos?sala=B12 HTTP/1.1
Host: localhost:3000
Accept: text/html
```

A primeira linha tem o método, o endereço dentro do servidor e a versão do protocolo. As outras são cabeçalhos: `Host` diz a que servidor se destina, `Accept` diz que o browser prefere receber HTML. Um pedido `GET` não tem corpo, e por isso termina aqui.

E esta é a resposta, encurtada:

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!doctype html>
<html lang="pt">
  <head><title>Equipamentos da sala B12</title></head>
  <body>
    <h1>Equipamentos da sala B12</h1>
    <ul>
      <li>Portátil</li>
      <li>Monitor</li>
    </ul>
  </body>
</html>
```

A primeira linha tem a versão e o código de estado, `200`, seguido de uma palavra que o explica. A linha `Content-Type` diz ao browser que o corpo é HTML, e é por isso que o browser o desenha como página em vez de o mostrar como texto. Depois de uma linha em branco começa o corpo. O browser lê este HTML e desenha a página que o professor vê.

Repara numa coisa que vai ser central neste módulo: o HTML que o browser recebe foi construído pelo servidor para este pedido. Não estava guardado num ficheiro com a lista da B12. O servidor perguntou à base de dados que equipamentos estavam na B12, recebeu duas linhas e escreveu um `<li>` para cada uma. Se amanhã chegar um projetor à B12, o mesmo pedido recebe outro HTML, sem ninguém mexer em nenhum ficheiro. É isto que quer dizer uma página dinâmica gerada no servidor.

Não tens de decorar o formato do pedido e da resposta. Tens de saber que partes existem e para que serve cada uma, porque é por elas que vais procurar quando alguma coisa correr mal.

### Para confirmar

1. Quem começa a conversa, o browser ou o servidor? O servidor pode mandar uma página a um browser que não lha pediu?
2. Na resposta acima, que linha faz o browser mostrar uma página em vez de texto simples?
3. Se a direção acrescentar um equipamento à sala B12 na base de dados, alguém tem de alterar um ficheiro HTML para ele aparecer na lista? Porquê?

## Ler um endereço

O endereço que escreves na barra do browser chama-se **URL** (Uniform Resource Locator, localizador uniforme de recursos). Tem partes, e cada parte responde a uma pergunta diferente. Este é o endereço do pedido da secção anterior, completo:

```text
http://localhost:3000/equipamentos?sala=B12
```

| Parte | Neste endereço | Responde a |
| --- | --- | --- |
| Protocolo | `http` | Que língua se fala: HTTP, ou HTTPS se for cifrado |
| Servidor | `localhost` | A que computador se envia o pedido |
| Porta | `3000` | A que programa, dentro desse computador |
| Caminho | `/equipamentos` | O que se pede a esse programa |
| Parâmetros de pesquisa | `?sala=B12` | Pormenores do pedido, como um filtro |

`localhost` é um nome especial que quer dizer "este computador". Quando o servidor corre no teu computador, é por `localhost` que o browser lhe chega.

A **porta** nem sempre aparece no endereço. Quando não aparece, o browser usa a porta habitual do protocolo: 80 para `http` e 443 para `https`. Por isso escreves `https://pt.wikipedia.org` sem porta nenhuma, e o browser vai à porta 443. Nas aulas, os servidores que vais escrever escutam numa porta como a 3000, que tem de aparecer no endereço.

O **caminho** é a parte que identifica o que se pede. No servidor, há código à espera de cada caminho: o código que responde a `GET /equipamentos` é diferente do que responde a `GET /reservas`. A esse par, um método e um caminho, mais o código que o trata, chama-se **rota**. Vais escrever as tuas primeiras rotas no tema seguinte.

Os **parâmetros de pesquisa** (em inglês, query string) começam no ponto de interrogação. Cada parâmetro é um nome e um valor, ligados por `=`. Quando há mais do que um, separam-se com `&`: `?sala=B12&ordem=nome`. Servem para afinar o pedido sem mudar o que se pede: continuas a pedir a lista de equipamentos, mas só os da B12. Quando pesquisas na Wikipédia ou num site de compras, repara na barra de endereço: o que escreveste aparece lá, depois de um `?`.

Alguns caracteres não podem ir tal como estão num endereço, como os espaços e os acentos. O browser substitui-os por códigos que começam por `%`. Se pesquisares "projetor de vídeo", o endereço fica com `projetor+de+v%C3%ADdeo`: o `+` está no lugar dos espaços e `%C3%AD` é o `í`. Não tens de saber estes códigos; tens de saber que existem, para não estranhares quando os vires.

### Para confirmar

1. No endereço `https://reservas.escola.pt/reservas?estado=cancelada`, qual é o servidor, o caminho e o parâmetro de pesquisa? A que porta vai o pedido?
2. Os endereços `http://localhost:3000/equipamentos` e `http://localhost:3001/equipamentos` chegam ao mesmo programa? Porquê?

## Os métodos: ver ou mudar

Por agora interessam dois métodos, e a diferença entre eles é simples de dizer.

`GET` pede para **ver** alguma coisa. Abrir uma página, seguir uma ligação, escrever um endereço na barra: tudo isto são pedidos `GET`. Um pedido `GET` não deve mudar nada no servidor. Podes repeti-lo cem vezes e o resultado no servidor é o mesmo: continuas só a ver.

`POST` **envia dados** para o servidor fazer alguma coisa com eles, e normalmente essa coisa muda o estado do sistema: criar uma reserva, cancelar uma reserva, registar uma devolução. Os dados vão no corpo do pedido, e não no endereço.

Esta divisão não é um pormenor de estilo. O browser, os motores de pesquisa e outros programas partem do princípio de que um `GET` é seguro de repetir. Um browser pode voltar a pedir uma página quando carregas em "recuar"; um programa que indexa a web segue todas as ligações que encontra. Se confirmar uma reserva fosse um `GET` a um endereço como `/reservas/confirmar?equipamento=2&data=2026-10-20&tempo=3`, bastava alguém seguir essa ligação, ou o browser voltar a carregá-la, para criar uma reserva que ninguém quis fazer. Por isso, tudo o que muda dados vai por `POST`.

O tema 3 deste módulo volta aos métodos com mais pormenor, e o dos formulários mostra como um formulário HTML escolhe entre `GET` e `POST`.

### Para confirmar

1. Pesquisar equipamentos por nome: `GET` ou `POST`? E devolver um equipamento?
2. Porque é que um pedido que cancela uma reserva não deve ser `GET`?

## Os códigos de estado

Todas as respostas trazem um código de estado. O primeiro algarismo diz a família, e as famílias são só cinco:

| Família | Quer dizer | Exemplos que vais encontrar |
| --- | --- | --- |
| 1xx | Informação intermédia | Raramente os vês |
| 2xx | Correu bem | `200 OK`: aqui está o que pediste |
| 3xx | Vai a outro sítio | `302 Found`: o que pediste está noutro endereço, e o browser vai lá sozinho |
| 4xx | O problema está no pedido | `404 Not Found`: não existe nada neste endereço |
| 5xx | O problema está no servidor | `500 Internal Server Error`: o servidor falhou ao tratar um pedido que até estava certo |

A distinção entre 4xx e 5xx é a mais útil para quem programa. Um 4xx diz que o cliente pediu mal: um endereço que não existe, dados inválidos. Um 5xx diz que o servidor falhou: um erro no código, uma base de dados que não respondeu. Quando uma página tua der erro, o código diz-te logo de que lado procurar.

Um pormenor que costuma surpreender: uma resposta `404` também tem corpo. Quando abres um artigo da Wikipédia que não existe, vês uma página bem desenhada a dizer que o artigo não existe. Essa página veio com o código 404. O código é para o browser e para os programas; o corpo é para a pessoa. Uma página bonita pode trazer um código de erro, e é por isso que, para saber como correu um pedido, se olha para o código e não para o aspeto da página. No laboratório vais ver isto acontecer.

### Para confirmar

1. Um professor pede a reserva 999, que não existe. Que família de código deve ter a resposta?
2. O servidor tem um erro no código que o faz falhar sempre que alguém abre a lista de reservas. Que família de código deve ter a resposta? De quem é a culpa: do pedido ou do servidor?

## Uma página são muitos pedidos

Quando abres uma página, o browser não faz um pedido: faz vários. O primeiro pede o HTML. O browser lê o HTML e encontra lá referências a outros ficheiros: uma folha de estilos (`<link rel="stylesheet" href="estilos.css">`), imagens (`<img src="logotipo.png">`), código JavaScript (`<script src="menu.js">`). Para cada um, faz um novo pedido, e cada pedido tem a sua resposta e o seu código de estado.

É por isso que o HTML vem sempre primeiro: o browser só sabe que mais ficheiros tem de pedir depois de ler o HTML. E é por isso que às vezes a página aparece sem cores ou sem imagens: o HTML chegou, mas um dos pedidos seguintes falhou.

Numa página de um jornal online, é normal haver mais de cem pedidos. No laboratório vais contar os pedidos de uma página da Wikipédia e ver de que tipos são.

Nas páginas que o teu servidor vai gerar neste módulo, o primeiro pedido, o do HTML, é o que interessa: é o que chega à tua rota, e é a resposta a esse pedido que o teu código constrói. Os ficheiros de estilos e as imagens são ficheiros que o servidor entrega tal como estão.

## O servidor não se lembra de ti

Há uma propriedade do HTTP que vai ter muita importância mais à frente no módulo: cada pedido é independente dos anteriores. O servidor recebe um pedido, responde e esquece. Quando chega o pedido seguinte, do mesmo browser, o servidor não sabe, só pelo HTTP, que é a mesma pessoa. Diz-se que o HTTP é um protocolo **sem estado**.

Para já, isto explica porque é que cada pedido tem de trazer tudo o que o servidor precisa para responder: o endereço completo, os parâmetros, os dados do formulário. Mais à frente, quando a aplicação precisar de se lembrar de alguém entre pedidos, como de quem está a fazer reservas, vais ver como os cookies e as sessões resolvem isto. Fica para o tema das sessões.

## Exemplo guiado: uma reserva do princípio ao fim

Este exemplo junta tudo o que viste. Segue uma operação real, uma professora a reservar o projetor para uma aula, e regista cada pedido, o que o servidor faz e o que responde. É o que a aplicação de reservas vai fazer quando a tiveres construído, ao longo deste módulo e do seguinte. Para já não precisas de saber escrever nenhuma destas partes: precisas de perceber a ordem e quem faz cada coisa.

### Passo 1: o que a professora quer

A professora de Português quer o projetor no terceiro tempo de 20 de outubro. Em termos do processo, ela vai escolher o equipamento e o tempo, a aplicação vai verificar se está livre e, se estiver, a reserva fica registada. No fim, deve ver uma confirmação.

Antes de olhar para pedidos, escreve-se o que se espera: se o projetor estiver livre, a reserva fica guardada com o estado "confirmada" e a professora vê a confirmação; se não estiver, nada fica guardado e a professora vê porquê. Escrever o resultado esperado antes de testar é um hábito que vais usar em todos os laboratórios do módulo, porque é a única forma de saber se o que aconteceu está certo.

### Passo 2: ver a lista de equipamentos

A professora escreve o endereço da aplicação e abre a lista de equipamentos.

1. O browser faz `GET /equipamentos`.
2. A rota que trata `GET /equipamentos` pede ao servidor de dados a lista:

   ```sql
   SELECT id, nome, sala
   FROM equipamentos
   ORDER BY nome;
   ```

3. O PostgreSQL devolve as quatro linhas da tabela, ordenadas pelo nome.
4. O servidor constrói o HTML da página, com uma linha por equipamento e uma ligação para cada um, e responde `200` com esse HTML.
5. O browser desenha a página. A seguir pede a folha de estilos e o logótipo da escola, em pedidos separados.

### Passo 3: abrir o projetor

A professora clica no projetor. A ligação aponta para `/equipamentos/2`, porque o projetor tem o `id` 2.

1. O browser faz `GET /equipamentos/2`.
2. O servidor percebe, pelo caminho, que se pede o equipamento 2, e pergunta por ele:

   ```sql
   SELECT id, nome, sala
   FROM equipamentos
   WHERE id = 2;
   ```

3. O PostgreSQL devolve uma linha.
4. O servidor responde `200` com a página do projetor, que inclui um formulário de reserva com dois campos, o dia e o tempo, e um botão "Reservar".

Se a professora tivesse escrito `/equipamentos/9` à mão, a consulta não devolvia nenhuma linha, e o servidor respondia `404` com uma página a dizer que esse equipamento não existe.

### Passo 4: enviar a reserva

A professora escolhe o dia 20 de outubro e o terceiro tempo, e carrega em "Reservar". Agora vai mudar-se alguma coisa no sistema, e por isso o pedido é um `POST`, com os dados no corpo:

```text
POST /reservas HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded

equipamento_id=2&data=2026-10-20&tempo=3
```

O corpo tem os campos do formulário no mesmo formato dos parâmetros de pesquisa: nome, `=`, valor, separados por `&`. O cabeçalho `Content-Type` diz ao servidor em que formato vem o corpo.

### Passo 5: o servidor verifica as regras

Antes de guardar o que quer que seja, o servidor verifica. Há três perguntas, e todas são feitas no servidor:

1. Os dados fazem sentido? O tempo é um número entre 1 e o último tempo do dia? A data é uma data válida e não está no passado?
2. O equipamento existe? Uma consulta como a do passo 3 responde.
3. O equipamento está livre nesse dia e nesse tempo?

   ```sql
   SELECT id
   FROM reservas
   WHERE equipamento_id = 2
     AND data = '2026-10-20'
     AND tempo = 3
     AND estado = 'confirmada';
   ```

   Se a consulta não devolver nenhuma linha, ninguém tem o projetor nesse tempo. Repara nas duas reservas do projetor que já estão na tabela. A 26 é do mesmo dia, mas do quinto tempo, e por isso não ocupa o terceiro. A 27 é do terceiro tempo, mas de outro dia, e além disso está cancelada. Nenhuma das duas cumpre as quatro condições, e a consulta não devolve nenhuma linha.

### Passo 6: guardar e responder

O projetor está livre, por isso o servidor guarda a reserva:

```sql
INSERT INTO reservas (equipamento_id, data, tempo, estado)
VALUES (2, '2026-10-20', 3, 'confirmada');
```

O PostgreSQL cria a linha, com o `id` seguinte, o 28. O servidor responde `200` com uma página de confirmação: "Reserva 28: Projetor, 20 de outubro, terceiro tempo". O browser mostra-a, e a professora sabe que a reserva ficou feita.

Uma nota sobre o SQL deste exemplo. Os valores aparecem escritos no meio das consultas para as leres com facilidade. No código do servidor, os valores que chegam de um pedido nunca se colam ao texto do SQL, porque quem envia o pedido podia escrever lá SQL seu. Vais ver porquê e como se faz no segundo módulo, quando ligares o servidor ao PostgreSQL.

### Passo 7: e se o projetor estivesse ocupado

Se a consulta do passo 5 tivesse devolvido uma linha, o servidor não guardava nada. Respondia com a página do projetor outra vez, com o formulário preenchido e uma mensagem: "O projetor já está reservado no terceiro tempo de 20 de outubro." A professora podia escolher outro tempo sem voltar a escrever tudo. O código de estado certo para esta resposta, e a melhor forma de a construir, ficam para o tema dos formulários.

Repara no que esta regra garante: dois professores não conseguem reservar o mesmo projetor para o mesmo tempo, porque o segundo pedido encontra a reserva do primeiro. Era o problema principal da folha da sala dos professores. Há um caso mais difícil, dois pedidos a chegar exatamente ao mesmo tempo, que se resolve no segundo módulo, com transações.

### Passo 8: o diagrama do pedido

O pedido do passo 4 até à resposta do passo 6 desenha-se assim. É este o desenho que vais fazer para as operações da ficha e do laboratório:

```text
browser                     servidor de aplicação               servidor de dados
   │                                  │                                  │
   │ POST /reservas                   │                                  │
   │ equipamento_id=2, data, tempo=3  │                                  │
   │─────────────────────────────────→│                                  │
   │                                  │ verifica os dados                │
   │                                  │ SELECT reservas desse tempo      │
   │                                  │─────────────────────────────────→│
   │                                  │←─────────────────────────────────│
   │                                  │ 0 linhas: está livre             │
   │                                  │ INSERT INTO reservas             │
   │                                  │─────────────────────────────────→│
   │                                  │←─────────────────────────────────│
   │                                  │ linha 28 criada                  │
   │ 200, HTML da confirmação         │                                  │
   │←─────────────────────────────────│                                  │
   │ mostra a confirmação             │                                  │
```

O tempo corre de cima para baixo. Cada seta horizontal é uma mensagem, com o que leva escrito por cima. As setas entre o browser e o servidor de aplicação são HTTP; as setas entre o servidor de aplicação e o servidor de dados são SQL. O browser só aparece no princípio e no fim: tudo o que está no meio aconteceu sem ele ver.

### Passo 9: da reserva à informação

A reserva 28 é um dado. Junta-se às outras, e daqui a umas semanas a direção quer saber que equipamentos foram mais reservados, para decidir o que comprar. A pergunta responde-se com uma consulta que já conheces do diagnóstico:

```sql
SELECT e.nome, COUNT(*) AS reservas
FROM reservas AS r
JOIN equipamentos AS e ON e.id = r.equipamento_id
WHERE r.estado = 'confirmada'
GROUP BY e.nome
ORDER BY reservas DESC;
```

Com as linhas da tabela mais a reserva 28, o resultado é:

| nome | reservas |
| --- | ---: |
| Projetor | 2 |
| Portátil | 1 |

A reserva 27 não conta, porque está cancelada. Este quadro é informação: responde a uma pergunta de alguém da organização e ajuda a tomar uma decisão. Só existe porque cada reserva ficou registada com o equipamento certo e o estado certo. É este o caminho completo de um sistema de informação: um processo produz dados, o sistema guarda-os com regras, e mais tarde transforma-os em informação.

## Quando a conversa falha

Quando uma página não carrega, a primeira pergunta é: em que parte da conversa é que falhou? Há três respostas possíveis, e cada uma tem sinais diferentes.

**Falha de rede, ou servidor desligado.** O pedido não chegou a nenhum servidor, ou chegou a um computador onde nenhum programa escuta naquela porta. Não há resposta nenhuma, e por isso não há código de estado. O browser mostra uma página de erro dele, e não do servidor, com mensagens como "Não é possível aceder a este site" ou "ligação recusada". Hipóteses: o cabo ou o Wi-Fi caiu, o endereço ou a porta estão errados, ou o servidor não está ligado. Para confirmar: outros sites abrem? O servidor está a correr? A porta do endereço é a porta onde o servidor escuta?

**Falha da aplicação.** O pedido chegou ao servidor, e o servidor respondeu, mas com um código de erro. Um `404` diz que não há rota para aquele caminho, ou que o recurso pedido não existe. Um `500` diz que o código do servidor falhou ao tratar o pedido. Aqui há resposta e há código de estado, e o servidor costuma deixar uma mensagem no terminal onde está a correr. Para confirmar: que código veio? O que diz o terminal do servidor?

**Falha do servidor de dados.** O browser só fala com o servidor de aplicação, por isso uma falha do PostgreSQL chega-lhe disfarçada: o servidor de aplicação tentou fazer uma consulta, não conseguiu, e respondeu `500`. Para confirmar, olha para a mensagem no terminal do servidor de aplicação, que costuma dizer que não conseguiu ligar-se à base de dados.

A diferença entre a primeira e as outras duas é o código de estado: se há código, houve resposta, e o servidor está vivo. É a primeira coisa a ver, e no laboratório vais aprender a vê-la.

## Erros frequentes

### Achar que o browser fala com a base de dados

O erro mais comum é desenhar uma seta do browser para o PostgreSQL. A seta não existe. Se o browser precisa de dados, pede-os ao servidor de aplicação, que os pede à base de dados. Se te apanhares a pensar "o browser vai buscar à base de dados", corrige para "o browser pede ao servidor, que vai buscar à base de dados".

### Achar que a página já estava feita

Muitos alunos imaginam que o servidor tem um ficheiro HTML para cada página e o devolve. Nas páginas dinâmicas não é assim: o servidor constrói o HTML no momento, a partir dos dados. Se dois professores abrirem a lista de reservas com um minuto de diferença e alguém reservar alguma coisa entretanto, recebem HTML diferente pelo mesmo endereço.

### Confiar no que o browser verifica

Um formulário pode ter `required` num campo, e o browser não deixa enviar sem o preencher. Isso ajuda quem usa a aplicação, mas não protege nada: qualquer pessoa pode fazer um pedido sem passar pelo formulário. Cada regra tem de ser verificada no servidor, mesmo que o browser já a tenha verificado.

### Confundir o endereço com a página

O endereço identifica o que se pede, e não o que se recebe. O mesmo endereço pode dar respostas diferentes em momentos diferentes, e um endereço que não existe pode dar uma página bonita com o código 404. Para saber o que aconteceu, olha para o código de estado.

### Usar GET para mudar dados

Um endereço que cria, altera ou apaga dados quando é aberto é um perigo, porque os endereços são abertos sem querer: pelo histórico, ao recuar, por programas que seguem ligações. O que muda dados vai por `POST`.

### Pôr a palavra-passe da base de dados onde o browser a vê

Num ficheiro JavaScript que o browser descarrega, no HTML, num comentário da página, num repositório público. Tudo o que chega ao browser, ou a um repositório público, deve ser considerado lido por toda a gente.

## Verificar o que aprendeste

Tenta responder sem voltar atrás. Depois confirma no guia.

1. Explica, com o exemplo das reservas, a diferença entre um dado e informação.
2. Desenha os três programas que participam numa reserva e escreve, em cada seta, a língua em que conversam.
3. Onde fica a palavra-passe da base de dados? Dá duas razões para não ficar no browser.
4. Que partes tem um pedido HTTP? E uma resposta?
5. No endereço `http://localhost:3000/reservas?data=2026-10-20`, identifica o protocolo, o servidor, a porta, o caminho e o parâmetro de pesquisa.
6. Porque é que confirmar uma reserva tem de ser um `POST`?
7. Um pedido recebeu `404` e outro recebeu `500`. Em qual dos dois procuras o erro no código do servidor?
8. Uma página não carrega e o browser mostra "ligação recusada", sem código de estado. O pedido chegou a algum servidor? Que verificarias primeiro?
9. Porque é que o HTML é sempre o primeiro pedido de uma página?
10. No exemplo guiado, porque é que as reservas 26 e 27, que também são do projetor, não impediram a reserva 28?

## O que vem a seguir

No tema seguinte vais ligar o teu primeiro servidor: um programa em Node.js, com Express, que fica à escuta numa porta e responde a pedidos `GET` com dados de equipamentos guardados em memória. Vais ver do lado do servidor a conversa que este guia descreveu do lado do browser, e vais provocar e corrigir os erros mais comuns de quem liga um servidor pela primeira vez, como a porta ocupada.

Antes disso, faz o [laboratório](01-do-pedido-a-resposta-laboratorio.md), que te põe a observar pedidos e respostas reais no browser, e a [ficha de exercícios](01-do-pedido-a-resposta-exercicios.md), com um processo de outra área da escola.

![Rodapé](../imagens/rodape.png)
