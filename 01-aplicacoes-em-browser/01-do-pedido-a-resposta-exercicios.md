![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: do pedido à resposta

Primeiro tema do módulo Aplicações baseadas em browsers. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](01-do-pedido-a-resposta.md) e, de preferência, depois do [laboratório](01-do-pedido-a-resposta-laboratorio.md). Não precisas de computador: faz-se em papel ou num ficheiro de texto.

## Objetivo e contexto

O guia seguiu um processo da escola, a reserva de equipamentos, do clique no browser até à base de dados. Esta ficha pede-te o mesmo raciocínio noutro processo, o empréstimo de livros na biblioteca, e acrescenta uma operação que o guia não mostrou: registar uma devolução.

Cada exercício treina uma ideia do guia, e o título diz qual. Os exercícios 1 a 7 são curtos. O 8 junta tudo e é o mais importante: é o diagrama de uma operação completa. O desafio no fim é opcional.

## Como trabalhar

Tenta responder sem abrir o guia. Quando não souberes, escreve o que achas e porquê, e só depois confirma no guia: uma resposta errada com o raciocínio escrito ensina-te mais do que uma resposta certa copiada. Em cada exercício que peça uma justificação, uma ou duas frases chegam.

Tempo previsto: 50 minutos para os exercícios 1 a 8.

## O cenário: a biblioteca da escola

A biblioteca da escola empresta livros aos alunos. Até agora, cada empréstimo era anotado num caderno: o título, o número de leitor do aluno e a data. A escola quer passar para uma aplicação web, com o mesmo desenho do guia: browser, servidor de aplicação em Node.js e base de dados PostgreSQL.

O processo é este. Um aluno escolhe um livro na estante ou pesquisa-o na aplicação. No balcão, a funcionária confirma que há um exemplar disponível e regista o empréstimo, com a data de hoje e a data limite de devolução, quinze dias depois. Quando o aluno devolve o livro, a funcionária regista a devolução, com a data em que aconteceu. A coordenadora da biblioteca quer saber, todas as semanas, que empréstimos estão em atraso e que livros são mais requisitados, para decidir o que comprar.

A base de dados tem estas duas tabelas. Os dados são fictícios.

**livros**

| id | titulo | autor | exemplares |
| ---: | --- | --- | ---: |
| 1 | Os Maias | Eça de Queirós | 3 |
| 2 | Mensagem | Fernando Pessoa | 2 |
| 3 | Memorial do Convento | José Saramago | 1 |

**emprestimos**

| id | livro_id | leitor | data_emprestimo | data_limite | data_devolucao |
| ---: | ---: | ---: | --- | --- | --- |
| 40 | 1 | 1021 | 2026-09-28 | 2026-10-13 | 2026-10-06 |
| 41 | 3 | 1007 | 2026-09-30 | 2026-10-15 | |
| 42 | 1 | 1033 | 2026-10-01 | 2026-10-16 | |

O `leitor` é o número de leitor do aluno no cartão da biblioteca. Uma `data_devolucao` vazia quer dizer que o livro ainda não foi devolvido.

## Exercício 1: dados ou informação

Guia: secção "Organização, processo, dados e informação".

Classifica cada item como dado ou informação. O primeiro está feito como exemplo.

| Item | Dado ou informação |
| --- | --- |
| O empréstimo 41 é do livro 3 | dado: é um facto registado, um a um |
| A data limite do empréstimo 42 é 16 de outubro | |
| Há dois exemplares de "Os Maias" na biblioteca neste momento | |
| O leitor 1021 devolveu o livro a 6 de outubro | |
| "Os Maias" é o livro com mais empréstimos registados | |
| A 7 de outubro não há nenhum empréstimo em atraso | |

Para os itens que classificaste como informação, escreve a pergunta de alguém da biblioteca a que cada um responde.

## Exercício 2: o processo do empréstimo

Guia: secção "Um sistema de informação começa numa organização".

Os passos do processo do empréstimo estão aqui fora de ordem:

- A funcionária regista a devolução.
- O aluno escolhe o livro.
- A funcionária regista o empréstimo, com a data limite.
- A funcionária confirma que há um exemplar disponível.
- O aluno devolve o livro.

a) Escreve os passos pela ordem certa.

b) Para cada passo, indica quem o faz e que dados ficam registados nesse passo, se ficar algum. Responde numa tabela com três colunas: passo, quem o faz, dados registados.

c) Que passo produz a linha 42 da tabela de empréstimos? E que passo vai preencher a `data_devolucao` dessa linha?

## Exercício 3: ler endereços

Guia: secção "Ler um endereço".

Para cada endereço, indica o protocolo, o servidor, a porta, o caminho e os parâmetros de pesquisa. Se uma parte não aparecer no endereço, escreve "não aparece" e, no caso da porta, diz qual é a usada.

1. `http://localhost:3000/livros`
2. `http://localhost:3000/livros?autor=Pessoa`
3. `https://biblioteca.escola.pt/emprestimos?estado=atraso&ordem=data`

## Exercício 4: onde corre

Guia: secção "Três programas, três papéis".

Para cada ação, indica se corre no browser, no servidor de aplicação ou no servidor de dados.

| Ação | Onde corre |
| --- | --- |
| Executar `SELECT * FROM livros WHERE id = 3` | |
| Decidir se ainda há um exemplar de "Memorial do Convento" para emprestar | |
| Mostrar a lista de livros com o tipo de letra da escola | |
| Construir o HTML da lista de empréstimos em atraso | |
| Guardar a palavra-passe de acesso ao PostgreSQL | |
| Mostrar um aviso quando a funcionária deixa o número de leitor vazio, antes de enviar | |

Na última linha, explica numa frase porque é que o servidor tem de voltar a verificar o número de leitor.

## Exercício 5: ver ou mudar

Guia: secção "Os métodos: ver ou mudar".

Indica o método, `GET` ou `POST`, para cada pedido.

1. Ver a lista de livros.
2. Pesquisar livros de um autor.
3. Registar um empréstimo.
4. Ver os empréstimos em atraso.
5. Registar a devolução de um livro.

Escolhe um dos pedidos a que respondeste `POST` e explica o que poderia correr mal se ele fosse um `GET`.

## Exercício 6: códigos de estado

Guia: secção "Os códigos de estado".

Para cada situação, indica a família do código de estado (2xx, 3xx, 4xx ou 5xx) e, se souberes, o código.

1. A funcionária abre a lista de livros e a página aparece normalmente.
2. Alguém escreve à mão o endereço do livro 99, que não existe.
3. O código do servidor tem um erro que o faz falhar sempre que alguém abre a lista de empréstimos.
4. Depois de registar um empréstimo, o servidor manda o browser ir sozinho para a página desse empréstimo.

## Exercício 7: quando a conversa falha

Guia: secção "Quando a conversa falha".

Para cada sintoma, diz se a falha é de rede ou servidor desligado, da aplicação, ou do servidor de dados, e indica a primeira coisa que verificarias.

1. O browser mostra "Não é possível aceder a este site" e, no separador Rede das ferramentas de programador, o pedido não tem código de estado.
2. A página da lista de livros abre, mas a de um livro em particular responde 404.
3. Todas as páginas que mostram dados respondem 500, e no terminal do servidor aparece uma mensagem a dizer que não conseguiu ligar-se à base de dados.

## Exercício 8: o diagrama de uma devolução

Guia: secção "Exemplo guiado", sobretudo os passos 5 a 8.

O aluno com o número de leitor 1007 devolve hoje, 7 de outubro, o "Memorial do Convento". Na aplicação, a funcionária abre o empréstimo 41 e carrega no botão "Registar devolução". O browser envia um pedido ao endereço `/emprestimos/41/devolucao`.

O guia mostrou uma operação que cria uma linha nova. Esta não cria: altera uma linha que já existe. E tem as suas próprias regras.

a) Que método usa o pedido? Porquê?

b) Antes de guardar a devolução, o servidor tem de verificar duas coisas sobre o empréstimo 41. Quais são? Para cada uma, diz o que o servidor deve responder se ela falhar.

c) Desenha o diagrama do pedido, como o do passo 8 do guia, com as três colunas: browser, servidor de aplicação e servidor de dados. Nas setas para o servidor de dados podes escrever por palavras o que o servidor pede, por exemplo "procura o empréstimo 41"; não é obrigatório escrever o SQL.

d) No fim da operação, o que mudou na tabela de empréstimos? Escreve a linha 41 como fica.

## Desafio (opcional): informação para a coordenadora

A coordenadora da biblioteca quer, todas as segundas-feiras, a lista dos empréstimos em atraso.

a) Explica por palavras quando é que um empréstimo está em atraso, usando as colunas da tabela.

b) Com a tabela acima e o dia de hoje, 7 de outubro, há algum empréstimo em atraso? E se hoje fosse 16 de outubro? Cuidado com o empréstimo cuja data limite é o próprio dia.

c) Se já te sentes à vontade com o SQL do 11.º ano, escreve a consulta que devolve os empréstimos em atraso num dia à tua escolha. Usa a data escrita diretamente na consulta, como no guia.

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1 a 8, com o diagrama do exercício 8 desenhado ou fotografado. No fim, responde por escrito:

- O que consigo explicar sem ajuda: escolhe uma das ideias da ficha e explica-a em duas frases, como se fosse a um colega que faltou.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As respostas são corrigidas na aula. Não incluas dados pessoais reais: os números de leitor e os nomes desta ficha são inventados.

![Rodapé](../imagens/rodape.png)
