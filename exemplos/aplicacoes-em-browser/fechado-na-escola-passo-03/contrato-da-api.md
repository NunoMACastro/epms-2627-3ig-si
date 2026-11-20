![Cabeçalho](../../../imagens/cabecalho.png)

# Contrato da API do jogo Fechado na escola

Todas as respostas da API, de sucesso e de erro, são JSON. Os pedidos e as respostas que aqui não estão não fazem parte da API.

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

## Qualquer outro pedido

| Código | Quando | Corpo |
| --- | --- | --- |
| 404 | nenhuma rota da API responde ao pedido | `{ "erro": "Rota não encontrada" }` |

![Rodapé](../../../imagens/rodape.png)
