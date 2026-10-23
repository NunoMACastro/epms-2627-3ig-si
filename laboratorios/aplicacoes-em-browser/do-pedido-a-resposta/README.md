![Cabeçalho](../../../imagens/cabecalho.png)

# Registos HTTP para trabalhar sem internet

Estes registos permitem continuar o [laboratório Do pedido à resposta](../../../01-aplicacoes-em-browser/01-do-pedido-a-resposta-laboratorio.md) quando não tens ligação à internet. Abre o [ficheiro de registos HTTP](registos-http.txt) num editor de texto.

Cada registo identifica um pedido real à Wikipédia e conserva os cabeçalhos necessários para o laboratório. Os cabeçalhos são campos da resposta. O campo `content-type` indica o tipo de conteúdo; `location` indica o endereço para onde o cliente deve ir.

Nas linhas como `HTTP/2 200`, `HTTP/2` indica a versão do protocolo e `200` é o código de estado. Lê o código e os campos; não precisas de decorar a forma da linha.

O ficheiro tem quatro registos. Usa o primeiro na fase 2, o segundo na fase 4 e os dois últimos na fase 5. Preenche a tabela do laboratório a partir desses dados. Na fase 7, desenha o percurso dos dois últimos pedidos.

Na fase 7, usa na resposta final o rótulo «200, content-type: text/html; corpo não observado».

Na fase 5, o terceiro registo mostra a resposta à pesquisa. O quarto mostra uma consulta posterior ao endereço indicado em `location`. Foram recolhidos separadamente com `curl`, uma ferramenta que faz pedidos HTTP no terminal.

Na fase 3, escreve «não observado» nas contagens dos recursos. Estes registos guardam apenas pedidos de documentos. Não mostram pedidos de estilos, scripts ou imagens, nem o total que um browser faria.

Na fase 2, escreve também «não observado» no endereço remoto e no título dentro de `<title>`. Esses campos não foram guardados no apoio.

As recolhas são de 20 de outubro de 2026. São excertos de respostas reais, com os endereços pedidos e o método identificados ao lado. Não são capturas das ferramentas de programador. O corpo HTML, os cookies e outros cabeçalhos ficaram fora deste pacote.

Faz a fase 6 no teu computador, como o laboratório indica. Quando a ligação regressar, faz também as fases com o separador Rede aberto. Ler estes registos permite interpretar respostas; a utilização das ferramentas do browser pratica-se no próprio browser.

![Rodapé](../../../imagens/rodape.png)
