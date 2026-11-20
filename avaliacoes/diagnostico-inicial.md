![Cabeçalho](../imagens/cabecalho.png)

# Diagnóstico inicial de dados, SQL e web: as reservas da associação

Este diagnóstico mostra o que já dominas em dados, SQL, web e JavaScript, e o que precisas de rever. Não tem nota. As tuas respostas servem para o professor preparar os apoios de que precisas.

## A associação e as reservas

Uma associação regista as reservas dos seus equipamentos em duas tabelas. Neste diagnóstico, cada reserva refere-se a um só equipamento da tabela `equipamentos`.

A tabela `equipamentos`:

| id | nome | categoria |
|---:|---|---|
| 1 | Projetor A | Vídeo |
| 2 | Portátil B | Informática |
| 3 | Câmara C | Vídeo |

A tabela `reservas`:

| id | equipamento_id | estado | quantidade |
|---:|---:|---|---:|
| 10 | 1 | confirmada | 2 |
| 11 | 1 | confirmada | 1 |
| 12 | 2 | cancelada | 1 |

## O que precisas de saber antes

Nada para estudar. O SQL que aprendeste foi o do MariaDB. Na pergunta 9 aparece o PostgreSQL, outro sistema de bases de dados relacionais, mas a resposta é a mesma que darias para o MariaDB. O EJS, que aparece na pergunta 11, é matéria nova deste ano, e não precisas de o conhecer.

## Como está organizado

O diagnóstico dura 60 minutos e é individual. Respondes em papel ou num editor de texto e não precisas de instalar nenhuma base de dados.

| Tempo | O que fazes |
| --- | --- |
| 10 minutos | Tarefa A: dados e regras |
| 25 minutos | Tarefa B: SQL e interpretação |
| 10 minutos | Tarefa C: cliente e servidor |
| 15 minutos | Tarefa D: web e JavaScript |

Podes consultar os materiais da disciplina, os teus apontamentos, o código das aulas e a documentação oficial. Não podes usar assistentes de inteligência artificial nem as sugestões automáticas do editor, nem falar com colegas.

Em cada resposta, explica o raciocínio e assinala onde precisaste de consultar alguma coisa. Uma resposta incompleta também serve, porque mostra onde precisas de apoio.

## Tarefa A: dados e regras (10 minutos)

1. Identifica as entidades, os atributos, as chaves primárias (PK) e as chaves estrangeiras (FK). Qual é a cardinalidade entre equipamentos e reservas?
2. Explica porque é que não guardarias o nome e a categoria do equipamento em cada reserva. Dá um exemplo de uma inconsistência que isso poderia causar.
3. É válida uma reserva com `equipamento_id` 99? E com `quantidade` 0? Para cada problema, indica uma restrição da base de dados (`CONSTRAINT`) que o impediria.

## Tarefa B: SQL e interpretação (25 minutos)

4. Escreve uma consulta que obtenha os equipamentos da categoria Vídeo, ordenados por nome.
5. Usa um `JOIN` para mostrar o id da reserva, o nome do equipamento e a quantidade das reservas confirmadas. Indica as linhas que esperas obter.
6. Para os equipamentos com mais de uma reserva confirmada, mostra o nome, o número de reservas e a soma das quantidades. Usa `GROUP BY`, `HAVING` e funções de agregação. Explica a diferença entre filtrar com `WHERE` e com `HAVING`.
7. Escreve três instruções independentes. A primeira insere o equipamento com id 4, nome Tripé D e categoria Vídeo. A segunda muda o nome desse equipamento para Tripé D revisto. A terceira elimina a reserva cancelada, com id 12. Identifica o perigo de esquecer o `WHERE` num `UPDATE` ou num `DELETE`.

## Tarefa C: cliente e servidor (10 minutos)

8. Desenha browser → servidor web → servidor de dados e indica, em cada ligação, quem envia o pedido e quem produz a resposta. Onde deve ficar a palavra-passe da base de dados?
9. O que muda quando o PostgreSQL está noutro computador? Uma página deixou de carregar: dá uma hipótese de falha de rede e outra de falha da aplicação.

## Tarefa D: web e JavaScript (15 minutos)

10. Escreve um pequeno formulário HTML, com uma `label` e um campo de pesquisa com o nome `q`, que envie os dados por `GET` para `/equipamentos`. Explica quando escolherias o `POST` e porque é que um `GET` não deve confirmar uma reserva.
11. Uma rota recebe um pedido, o EJS produz o HTML e o browser apresenta-o. Indica o que corre no servidor e o que corre no browser. Se ainda não conheces o EJS, diz isso e explica o que consegues inferir.
12. Para `const quantidades = [2, 1, 1]`, escreve código JavaScript que calcule o total. Explica o que acontece ao percorrer a lista. Podes usar um ciclo ou um método dos arrays.

## Como é avaliado

O professor lê o raciocínio de cada resposta, tarefa a tarefa. No fim, assinala tu, em cada tarefa, uma destas três frases: "resolvi sozinho", "resolvi com apoio" ou "ainda preciso de rever".

## Entrega

Entregas no fim dos 60 minutos. Se respondeste em papel, entregas a folha. Se respondeste num editor de texto, pões o ficheiro num repositório teu no GitHub e envias a ligação ao professor por email, salvo outra indicação dele no dia. Nas respostas, não escrevas palavras-passe nem dados pessoais.

![Rodapé](../imagens/rodape.png)
