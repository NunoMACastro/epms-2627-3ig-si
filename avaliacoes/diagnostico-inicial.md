![Cabeçalho](../imagens/cabecalho.png)

# Diagnóstico inicial: dados, SQL e web

Duração: **60 minutos**. Individual, em papel ou editor de texto; não é necessário instalar uma base de dados. Serve para identificar apoios, sem classificação sumativa. Podes consultar a sintaxe SQL básica fornecida pelo professor, mas assinala onde precisaste de ajuda. Explica o raciocínio; uma resposta parcial é útil para diagnosticar.

## Contexto

Uma associação regista reservas de equipamentos. Cada reserva refere um único equipamento neste diagnóstico. Todos os nomes e dados são fictícios.

**equipamentos**

| id | nome | categoria |
|---:|---|---|
| 1 | Projetor A | Vídeo |
| 2 | Portátil B | Informática |
| 3 | Câmara C | Vídeo |

**reservas**

| id | equipamento_id | estado | quantidade |
|---:|---:|---|---:|
| 10 | 1 | confirmada | 2 |
| 11 | 1 | confirmada | 1 |
| 12 | 2 | cancelada | 1 |

## A: dados e regras (10 minutos)

1. Identifica entidades, atributos, PK e FK. Qual é a cardinalidade entre equipamentos e reservas?
2. Explica por que não guardarias o nome e a categoria do equipamento em cada reserva. Dá um exemplo de inconsistência que isso poderia causar.
3. É válida uma reserva com equipamento_id 99? E quantidade 0? Indica uma regra/constraint que impediria cada problema.

## B: SQL e interpretação (25 minutos)

4. Escreve uma consulta para obter os equipamentos de categoria Vídeo, ordenados por nome.
5. Usa JOIN para mostrar ID da reserva, nome do equipamento e quantidade das reservas confirmadas. Indica as linhas que esperas obter.
6. Para equipamentos com mais de uma reserva confirmada, mostra nome, número de reservas e soma das quantidades. Usa GROUP BY, HAVING e agregações. Explica a diferença entre filtrar com WHERE e HAVING.
7. Escreve três instruções independentes: inserir equipamento com id 4 e nome Tripé D/categoria Vídeo; atualizar o nome desse equipamento para Tripé D revisto; eliminar a reserva cancelada com id 12. Identifica o perigo de omitir WHERE num UPDATE ou DELETE.

## C: cliente e servidor (10 minutos)

8. Desenha browser → servidor web → servidor de dados e identifica quem envia pedido e quem produz resposta em cada ligação. Onde deve ficar a password da BD?
9. O que muda quando PostgreSQL está noutro computador? Uma página deixou de carregar: dá uma hipótese de falha de rede e outra de aplicação.

## D: web e JavaScript (15 minutos)

10. Escreve um pequeno formulário HTML com label e campo de pesquisa `q`, enviado por GET para `/equipamentos`. Explica quando escolherias POST e por que GET não deve confirmar uma reserva.
11. Uma rota recebe um pedido, EJS produz HTML e o browser apresenta-o. Indica o que corre no servidor e no browser. Se ainda não conheces EJS, diz isso e explica o que consegues inferir.
12. Para `const quantidades = [2, 1, 1]`, escreve código JavaScript que calcule o total. Explica o que acontece ao percorrer a lista. Podes usar ciclo ou função de array.

No final, assinala por domínio: resolvi sozinho; resolvi com apoio; ainda preciso de rever. Não introduzas dados pessoais nem credenciais nas respostas.

![Rodapé](../imagens/rodape.png)
