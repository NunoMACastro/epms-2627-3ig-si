![Cabeçalho](../../../imagens/cabecalho.png)

# Registos HTTP para trabalhar sem internet

Estes registos servem para fazeres o [laboratório Do pedido à resposta](../01-do-pedido-a-resposta-laboratorio.md) quando a internet não funciona. São quatro pedidos reais à Wikipédia, com parte das respostas, no [ficheiro dos registos](registos-http.txt), que abres num editor de texto.

## Como se lê um registo

Cada registo diz o método e o endereço pedido e, a seguir a "Excerto da resposta", as linhas que o servidor mandou. Na linha `HTTP/2 200`, `HTTP/2` é a versão do protocolo e `200` é o código de estado. As linhas seguintes são cabeçalhos da resposta: `content-type` diz o tipo de conteúdo, e `location` diz o endereço para onde o browser deve ir.

## O que fazes em cada fase

Antes de começares, escreve no `respostas-01.md`, por cima da tabela, "Registos HTTP de 20 de outubro de 2026", para se saber de onde vêm os dados.

- Fases 1 e 6: fazem-se no browser, como o laboratório diz, porque não precisam de internet.
- Fase 2: preenche a linha da fase 2 com o registo 1, o artigo Computador.
- Fase 3: escreve "não observado" nas contagens. Os registos só guardam pedidos de documentos, e não os dos estilos, dos scripts e das imagens.
- Fase 4: preenche a linha da fase 4 com o registo 2, o artigo que não existe.
- Fase 5: preenche as duas linhas da fase 5 com o registo 3, a pesquisa, e com o registo 4, o endereço que vinha no `location`.
- Fase 7: desenha o diagrama com os registos 3 e 4. Na última resposta, escreve "200, content-type: text/html; corpo não observado", porque os registos não guardam o HTML do artigo.

Quando a internet voltar, faz também as fases 2 a 5 no browser, com o separador Rede aberto, e compara o que vês com as linhas que escreveste a partir dos registos.

## De onde vêm os registos

Os registos foram recolhidos a 20 de outubro de 2026 com o `curl`, um programa que faz pedidos HTTP no terminal, e não com as ferramentas de programador. Guardam só o método, o endereço, o código de estado e alguns cabeçalhos: o corpo das páginas, o endereço remoto, os cookies e os outros cabeçalhos ficaram de fora. O registo 4 foi pedido à parte, depois dos outros três, e por isso não mostra o browser a seguir o `location` sozinho. A Wikipédia pode responder de outra forma noutro dia ou a outro programa.

![Rodapé](../../../imagens/rodape.png)
