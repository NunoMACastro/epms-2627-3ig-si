![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: Do pedido à resposta

Praticas as ideias do guia noutro processo da escola, o empréstimo de livros da biblioteca, e desenhas uma operação que o guia não mostrou: a devolução de um livro. Os exercícios 1 a 8 são obrigatórios, por esta ordem. Escreve as respostas no `respostas-01.md`, o ficheiro de texto onde puseste a tabela do laboratório, ou numa folha, se não tens computador. Se ainda não tens o ficheiro, cria-o na tua pasta de Sistemas de Informação. Antes de cada resposta, põe o exercício e a alínea ou o item, como 3.2 ou 8 b). Entrega as respostas e o diagrama do exercício 8, desenhado à mão, em papel ou fotografado. Para rever: o [guia do tema](../01-do-pedido-a-resposta.md) e o [laboratório](../laboratorios/01-do-pedido-a-resposta-laboratorio.md).

## O cenário

A biblioteca da escola empresta livros aos alunos. Até agora, cada empréstimo era anotado num caderno: o título, o número de leitor do aluno e a data. A escola quer passar para uma aplicação web, com o mesmo desenho do guia: browser, servidor de aplicação em Node.js e servidor de dados MariaDB.

O processo é este. Um aluno escolhe um livro na estante ou pesquisa-o na aplicação. No balcão, a funcionária confirma que há um exemplar disponível e regista o empréstimo, com a data de hoje e a data limite de devolução, quinze dias depois. Quando o aluno devolve o livro, a funcionária regista a devolução, com a data em que aconteceu. A coordenadora da biblioteca quer saber, todas as semanas, que empréstimos estão em atraso e que livros são mais requisitados, para decidir o que comprar.

A base de dados tem duas tabelas.

A tabela `livros`:

| id | titulo | autor | exemplares |
| ---: | --- | --- | ---: |
| 1 | Os Maias | Eça de Queirós | 3 |
| 2 | Mensagem | Fernando Pessoa | 2 |
| 3 | Memorial do Convento | José Saramago | 1 |

A tabela `emprestimos`:

| id | livro_id | leitor | data_emprestimo | data_limite | data_devolucao |
| ---: | ---: | ---: | --- | --- | --- |
| 40 | 1 | 1021 | 2026-09-28 | 2026-10-13 | 2026-10-06 |
| 41 | 3 | 1007 | 2026-09-30 | 2026-10-15 | |
| 42 | 1 | 1033 | 2026-10-01 | 2026-10-16 | |

A coluna `exemplares` diz quantos exemplares desse livro a biblioteca tem, emprestados ou não. O `leitor` é o número de leitor do aluno no cartão da biblioteca. Uma `data_devolucao` vazia quer dizer que o livro ainda não foi devolvido.

## Exercício 1: dados ou informação

Classifica cada item como dado ou informação. O primeiro está feito como exemplo.

| Item | Dado ou informação |
| --- | --- |
| O empréstimo 41 é do livro 3 | dado: é um facto registado, tal como está na linha 41 |
| A data limite do empréstimo 42 é 16 de outubro | |
| Há dois exemplares de "Os Maias" na biblioteca neste momento | |
| O leitor 1021 devolveu o livro a 6 de outubro | |
| "Os Maias" é o livro com mais empréstimos registados | |
| A 7 de outubro não há nenhum empréstimo em atraso | |

Para os itens que classificaste como informação, escreve a pergunta de alguém da biblioteca a que cada um responde.

Explica também como os dados permitem obter essa resposta. Se achas que um item que classificaste como dado também pode servir de informação, escreve quem faz a pergunta e qual é, e explica como esse dado lhe responde.

Rever: [A informação responde a uma pergunta](../01-do-pedido-a-resposta.md#a-informação-responde-a-uma-pergunta).

<details>
<summary>Pista</summary>

Para cada item, procura nas tabelas do cenário as linhas de onde ele sai. Depois pensa em quem, na biblioteca, quereria saber isso, e para quê.

</details>

## Exercício 2: o processo do empréstimo

Os passos do processo do empréstimo estão aqui fora de ordem:

- A funcionária regista a devolução.
- O aluno escolhe o livro.
- A funcionária regista o empréstimo, com a data limite.
- A funcionária confirma que há um exemplar disponível.
- O aluno devolve o livro.

a) Escreve os passos pela ordem certa.

b) Para cada passo, indica quem o faz e que dados ficam registados nesse passo, se ficar algum. Responde numa tabela com três colunas: passo, quem o faz, dados registados.

c) Que passo produz a linha 42 da tabela de empréstimos? E que passo vai preencher a `data_devolucao` dessa linha?

Rever: [Um processo deixa dados registados](../01-do-pedido-a-resposta.md#um-processo-deixa-dados-registados).

<details>
<summary>Pista</summary>

Na alínea b), olha para as colunas da tabela `emprestimos`. Em cada passo, que colunas recebem um valor novo?

</details>

## Exercício 3: ler endereços

Para cada endereço, indica o protocolo, o computador, a porta, o caminho e os parâmetros de pesquisa. Se uma parte não aparecer no endereço, escreve "não aparece" e, no caso da porta, diz qual é a usada.

1. `http://localhost:3000/livros`
2. `http://localhost:3000/livros?autor=Pessoa`
3. `https://biblioteca.escola.pt/emprestimos?estado=atraso&ordem=data`

Rever: [Cada parte do endereço responde a uma pergunta](../01-do-pedido-a-resposta.md#cada-parte-do-endereço-responde-a-uma-pergunta).

<details>
<summary>Pista</summary>

As partes aparecem no endereço pela ordem da tabela do guia. Procura os sinais que as separam: o `://`, o `:` antes da porta, a primeira `/` depois do nome do computador e o `?`.

</details>

## Exercício 4: onde corre

Para cada ação, indica se corre no browser, no servidor de aplicação ou no servidor de dados.

| Ação | Onde corre |
| --- | --- |
| Executar `SELECT * FROM livros WHERE id = 3` | |
| Decidir se ainda há um exemplar de "Memorial do Convento" para emprestar | |
| Mostrar a lista de livros com o tipo de letra da escola | |
| Construir o HTML da lista de empréstimos em atraso | |
| Guardar a palavra-passe usada para abrir a ligação ao MariaDB | |
| Mostrar um aviso quando a funcionária deixa o número de leitor vazio, antes de enviar | |

Sobre a última ação, explica numa frase porque é que o servidor tem de voltar a verificar o número de leitor.

Rever: [O servidor de aplicação fica entre o browser e os dados](../01-do-pedido-a-resposta.md#o-servidor-de-aplicação-fica-entre-o-browser-e-os-dados) e [O browser não fala com a base de dados](../01-do-pedido-a-resposta.md#o-browser-não-fala-com-a-base-de-dados).

## Exercício 5: ver ou mudar

Indica o método, `GET` ou `POST`, para cada pedido.

1. Ver a lista de livros.
2. Enviar um formulário com o número de leitor, para saber que livros esse leitor tem emprestados.
3. Registar um empréstimo.
4. Ver os empréstimos em atraso.
5. Registar a devolução de um livro.

Escolhe um dos pedidos a que respondeste `POST` e explica o que poderia correr mal se ele fosse um `GET`.

Rever: [GET serve para ver e POST para mudar](../01-do-pedido-a-resposta.md#get-serve-para-ver-e-post-para-mudar).

## Exercício 6: códigos de estado

Para cada situação, indica a família do código de estado (2xx, 3xx, 4xx ou 5xx) e, se souberes, o código.

1. A funcionária abre a lista de livros e a página aparece normalmente.
2. Alguém escreve à mão o endereço do livro 99, que não existe.
3. O código do servidor tem um erro que o faz falhar sempre que alguém abre a lista de empréstimos.
4. Depois de registar um empréstimo, o servidor manda o browser ir sozinho para a página desse empréstimo.

Rever: [O código de estado diz como correu o pedido](../01-do-pedido-a-resposta.md#o-código-de-estado-diz-como-correu-o-pedido) e [Um redirecionamento são dois pedidos](../01-do-pedido-a-resposta.md#um-redirecionamento-são-dois-pedidos).

## Exercício 7: quando a conversa falha

Para cada sintoma, diz se a falha é de rede ou servidor desligado, da aplicação, ou do servidor de dados, e indica a primeira coisa que verificarias.

1. O browser mostra "Não é possível aceder a este site" e, no separador Rede das ferramentas de programador, o pedido não tem código de estado.
2. A página da lista de livros abre, mas a de um livro em particular responde 404.
3. Todas as páginas que mostram dados respondem 500, e no terminal do servidor aparece uma mensagem a dizer que não conseguiu ligar-se à base de dados.

Rever: [Sem código de estado, não houve resposta](../01-do-pedido-a-resposta.md#sem-código-de-estado-não-houve-resposta).

## Exercício 8: o diagrama de uma devolução

O aluno com o número de leitor 1007 devolve hoje, 7 de outubro, o "Memorial do Convento". Na aplicação, a funcionária abre o empréstimo 41 e carrega no botão "Registar devolução". O browser envia um pedido ao endereço `/emprestimos/41/devolucao`.

O guia mostrou uma operação que cria uma linha nova. Esta não cria: altera uma linha que já existe.

a) Que método usa o pedido? Porquê?

b) Antes de guardar a devolução, o servidor tem de verificar duas coisas sobre o empréstimo 41. Quais são? Para cada uma, diz o que o servidor deve responder se ela falhar.

c) Desenha o diagrama do pedido, como o do passo 8 do guia, com as três colunas: browser, servidor de aplicação e servidor de dados. Nas setas para o servidor de dados podes escrever por palavras o que o servidor pede, por exemplo "procura o empréstimo 41"; não é obrigatório escrever o SQL.

d) No fim da operação, o que mudou na tabela de empréstimos? Escreve a linha 41 como fica.

Rever: [Passo 5: o servidor verifica as regras](../01-do-pedido-a-resposta.md#passo-5-o-servidor-verifica-as-regras), [Passo 7: e se o projetor estivesse ocupado](../01-do-pedido-a-resposta.md#passo-7-e-se-o-projetor-estivesse-ocupado) e [Passo 8: o diagrama do pedido](../01-do-pedido-a-resposta.md#passo-8-o-diagrama-do-pedido).

<details>
<summary>Pista</summary>

Na alínea c), começa pelas três colunas, com o nome de cada programa no topo, e pela seta do pedido, que sai do browser. Depois segue o servidor de aplicação. Cada vez que ele precisa de ler ou de mudar uma linha, há uma seta para o servidor de dados e outra com a resposta.

</details>

## Desafios

### Informação para a coordenadora

A coordenadora da biblioteca quer, todas as semanas, a lista dos empréstimos em atraso.

a) Explica por palavras quando é que um empréstimo está em atraso, usando as colunas da tabela.

b) Com a tabela `emprestimos` do cenário, sem a devolução do exercício 8, e o dia de hoje, 7 de outubro, há algum empréstimo em atraso? E se hoje fosse 16 de outubro? Cuidado com o empréstimo cuja data limite é o próprio dia.

c) Se já te sentes à vontade com o SQL que aprendeste com o MariaDB, escreve a consulta que devolve os empréstimos em atraso num dia à tua escolha. Usa a data escrita diretamente na consulta, como no guia.

## Critérios de conclusão

- O `respostas-01.md`, ou as folhas, tem os exercícios 1 a 8 respondidos, cada resposta com o exercício e a alínea ou o item.
- O diagrama do exercício 8 tem as três colunas e todas as mensagens, do pedido do browser até à resposta, com o que cada seta leva escrito.
- Cada resposta que pede uma justificação tem uma ou duas frases a explicá-la.

![Rodapé](../../imagens/rodape.png)
