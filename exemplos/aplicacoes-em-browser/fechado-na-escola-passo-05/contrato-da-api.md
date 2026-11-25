![Cabeçalho](../../../imagens/cabecalho.png)

# Contrato da API do jogo Fechado na escola

Todas as respostas da API, de sucesso e de erro, são JSON. Os pedidos e as respostas que aqui não estão não fazem parte da API.

Qualquer pedido pode ainda responder 500, com `{ "erro": "Erro interno do servidor" }`, se alguma coisa falhar dentro do servidor.

## Formato dos erros

Todas as respostas de erro têm esta forma, com uma mensagem para quem joga:

```json
{ "erro": "Não existe a cena cave" }
```

## A cena

Cada cena, nas respostas, tem esta forma:

```json
{ "_id": "6aea79a15ae42ad7f4bcc74e", "codigo": "porta-principal", "titulo": "A porta principal", "texto": "A porta está fechada à chave, e a luz do alarme pisca a vermelho ao lado do puxador. Se a forçares, o alarme toca.", "final": false, "escolhas": [{ "texto": "Forçar a porta", "destino": "fim-alarme" }, { "texto": "Voltar ao corredor", "destino": "corredor" }], "__v": 0 }
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `_id` | texto | identificador que o MongoDB deu ao documento |
| `codigo` | texto | código da cena no jogo, como `corredor`; é por ele que se pede uma cena |
| `titulo` | texto | título da cena |
| `texto` | texto | o bocado da história que o jogador lê |
| `final` | booleano | `true` numa cena que acaba a partida |
| `escolhas` | lista | as escolhas da cena, pela ordem em que o jogador as vê; vazia numa cena final |
| `escolhas[].texto` | texto | o que o jogador lê na escolha |
| `escolhas[].destino` | texto | o código da cena para onde a escolha leva |
| `__v` | inteiro | número de versão que o Mongoose acrescenta |

## O corpo de uma cena

Os pedidos que criam e alteram uma cena levam os campos no corpo, em JSON, com estes tipos e estas regras:

| Campo | Tipo | Regras |
| --- | --- | --- |
| `codigo` | texto | obrigatório num `POST`, e nunca vem num `PATCH`; até 30 carateres, sem contar os espaços do início e do fim; não pode haver duas cenas com o mesmo código |
| `titulo` | texto | obrigatório; até 60 carateres, sem contar os espaços do início e do fim |
| `texto` | texto | obrigatório; até 600 carateres, sem contar os espaços do início e do fim |
| `final` | booleano | obrigatório |
| `escolhas` | lista | pode faltar num `POST`, e a cena fica sem escolhas; num `PATCH`, substitui a lista inteira |
| `escolhas[].texto` | texto | obrigatório; até 80 carateres, sem contar os espaços do início e do fim |
| `escolhas[].destino` | texto | obrigatório; o código de uma cena que existe |

Num `POST`, vêm o `codigo`, o `titulo`, o `texto` e o `final`, e as `escolhas`, se a cena as tiver. Num `PATCH`, vem pelo menos um campo, e nunca o `codigo`. Cada escolha tem só o `texto` e o `destino`. Qualquer outro campo, também dentro de uma escolha, é recusado com 400.

## GET /api/estado

Confirma que o servidor está ligado. Sem parâmetros.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre | `{ "estado": "ok", "aplicacao": "Fechado na escola" }` |

## GET /api/cenas

Lista todas as cenas da história. Sem parâmetros.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre | lista de cenas, possivelmente vazia |

## GET /api/cenas/:codigo

Mostra uma cena.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `codigo` | rota | texto | sim | o código de uma cena |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | existe uma cena com esse código | a cena |
| 404 | não existe nenhuma cena com esse código | erro |

## GET /api/cenas/:codigo/escolhas/:numero

Faz uma escolha numa cena e mostra a cena para onde ela leva. As escolhas numeram-se a partir de 1, pela ordem da lista `escolhas`.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `codigo` | rota | texto | sim | o código de uma cena |
| `numero` | rota | inteiro | sim | 1 ou mais |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | a cena existe e tem essa escolha | a cena para onde a escolha leva |
| 400 | `numero` não é um número inteiro maior do que 0 | erro |
| 404 | não existe nenhuma cena com esse código | erro |
| 404 | a cena não tem a escolha com esse número; uma cena final não tem nenhuma | erro |

## POST /api/cenas

Cria uma cena, com os campos no corpo, em JSON.

| Código | Quando | Corpo |
| --- | --- | --- |
| 201 | a cena foi criada | a cena criada |
| 400 | o corpo não é JSON, traz um campo que não é aceite ou um valor do tipo errado, ou não cumpre as regras dos campos | erro |
| 409 | já existe uma cena com esse código | erro |
| 409 | uma escolha leva a uma cena que não existe | erro |

## PATCH /api/cenas/:codigo

Altera os campos que vierem no corpo, em JSON, e deixa os outros como estão.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `codigo` | rota | texto | sim | o código de uma cena |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | a cena foi alterada | a cena depois da alteração |
| 400 | o corpo não é JSON, não traz nenhum campo, traz o `codigo`, um campo que não é aceite ou um valor do tipo errado, ou não cumpre as regras dos campos | erro |
| 404 | não existe nenhuma cena com esse código | erro |
| 409 | uma escolha leva a uma cena que não existe | erro |

## DELETE /api/cenas/:codigo

Apaga uma cena.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `codigo` | rota | texto | sim | o código de uma cena |

| Código | Quando | Corpo |
| --- | --- | --- |
| 204 | a cena foi apagada | sem corpo |
| 404 | não existe nenhuma cena com esse código | erro |
| 409 | é a cena `inicio`, onde a história começa | erro |
| 409 | uma escolha de outra cena leva a ela | erro |

## Qualquer outro pedido

| Código | Quando | Corpo |
| --- | --- | --- |
| 404 | nenhuma rota da API responde ao pedido | `{ "erro": "Rota não encontrada" }` |

![Rodapé](../../../imagens/rodape.png)
