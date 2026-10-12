![Cabeçalho](../imagens/cabecalho.png)

# Aplicações baseadas em browsers

Primeira área do ano, que corresponde ao primeiro módulo da disciplina. Aqui constróis uma aplicação web em que o servidor gera as páginas que o browser mostra: recebe pedidos, responde com HTML, valida formulários e guarda estado entre pedidos.

Os temas estão numerados pela ordem em que são dados. Um número que falta é de um tema que ainda não tem material publicado. Cada tema pode ter até três documentos com o mesmo número: o guia, para ler e estudar; o laboratório, com o sufixo `-laboratorio`, para seguir passo a passo no computador; e a ficha de exercícios, com o sufixo `-exercicios`, para praticares sozinho.

| Documento | Assunto |
| --- | --- |
| [01-do-pedido-a-resposta.md](01-do-pedido-a-resposta.md) | Organização, processo, dados e informação; browser, servidor de aplicação e servidor de dados; pedido e resposta HTTP, endereços, métodos e códigos de estado |
| [01-do-pedido-a-resposta-laboratorio.md](01-do-pedido-a-resposta-laboratorio.md) | Laboratório do mesmo tema: observar pedidos e respostas reais nas ferramentas de programador do browser |
| [01-do-pedido-a-resposta-exercicios.md](01-do-pedido-a-resposta-exercicios.md) | Ficha de exercícios do mesmo tema, com os empréstimos da biblioteca da escola |
| [02-primeiro-servidor.md](02-primeiro-servidor.md) | O Node.js, o npm e o package.json, os módulos ES e um servidor Express com duas rotas, linha a linha; como ler os erros de arranque |
| [02-primeiro-servidor-laboratorio.md](02-primeiro-servidor-laboratorio.md) | Laboratório do mesmo tema: construir o catálogo de equipamentos do zero e provocar e corrigir os erros mais comuns |
| [02-primeiro-servidor-exercicios.md](02-primeiro-servidor-exercicios.md) | Ficha de exercícios do mesmo tema, com o servidor da biblioteca da escola |
| [03-http-rotas-e-middleware.md](03-http-rotas-e-middleware.md) | Dados no caminho e na pesquisa, e o corpo do pedido como ideia; GET e POST; os códigos 200, 400 e 404; o middleware e a sua ordem, e a ordem das rotas; a tabela de contratos HTTP |
| [03-http-rotas-e-middleware-laboratorio.md](03-http-rotas-e-middleware-laboratorio.md) | Laboratório do mesmo tema: o catálogo com a rota de detalhe, o filtro, a pesquisa, o middleware e os erros de ordem do middleware |
| [03-http-rotas-e-middleware-laboratorio-papelaria.md](03-http-rotas-e-middleware-laboratorio-papelaria.md) | Outro laboratório do mesmo tema, feito em conjunto com Linguagens de Programação: a API da papelaria, criada de raiz, com os mesmos passos e os mesmos erros de ordem do middleware. Faz-se este ou o do catálogo, conforme o professor indicar |
| [03-http-rotas-e-middleware-exercicios.md](03-http-rotas-e-middleware-exercicios.md) | Ficha de exercícios do mesmo tema, com o servidor da biblioteca |
| [04-ejs-e-reutilizacao-no-servidor.md](04-ejs-e-reutilizacao-no-servidor.md) | Páginas construídas no servidor a partir de modelos EJS: o ciclo do render, as marcas, os ciclos e as condições, os partials de cabeçalho e rodapé, o escaping e as páginas de erro |
| [04-ejs-e-reutilizacao-no-servidor-laboratorio.md](04-ejs-e-reutilizacao-no-servidor-laboratorio.md) | Laboratório do mesmo tema: o catálogo passa a ter páginas, com os erros mais comuns provocados de propósito e a comparação entre o modelo e o HTML recebido |
| [04-ejs-e-reutilizacao-no-servidor-exercicios.md](04-ejs-e-reutilizacao-no-servidor-exercicios.md) | Ficha de exercícios do mesmo tema, com o servidor da biblioteca |
| [05-formularios-e-validacao.md](05-formularios-e-validacao.md) | Formulários que mudam dados: o `POST` e o corpo do pedido, o formulário acessível, a validação de cada campo no servidor, o formulário outra vez quando há erros e o redirecionamento depois do sucesso |
| [05-formularios-e-validacao-laboratorio.md](05-formularios-e-validacao-laboratorio.md) | Laboratório do mesmo tema: as reservas do catálogo, com o que corre mal sem validação e sem redirecionamento, e a verificação por pares |
| [05-formularios-e-validacao-exercicios.md](05-formularios-e-validacao-exercicios.md) | Ficha de exercícios do mesmo tema, com os empréstimos da biblioteca |
| [06-cookies-e-sessoes.md](06-cookies-e-sessoes.md) | O HTTP sem estado, os cookies, as sessões com o identificador no cookie e os dados no servidor, os atributos do cookie, terminar uma sessão, e porque é que uma sessão não é uma autenticação |
| [06-cookies-e-sessoes-laboratorio.md](06-cookies-e-sessoes-laboratorio.md) | Laboratório do mesmo tema: o pedido em curso do catálogo, duas sessões isoladas, o estado eliminado ao terminar e o roubo de uma sessão feito a ti mesmo |
| [06-cookies-e-sessoes-exercicios.md](06-cookies-e-sessoes-exercicios.md) | Ficha de exercícios do mesmo tema, com os livros vistos recentemente na biblioteca |
| [07-erros-e-seguranca-web.md](07-erros-e-seguranca-web.md) | Falhar bem: as falhas do pedido e do servidor, o middleware de erro, o que vai para o terminal, os segredos, o escaping em cada sítio da página e o token contra o CSRF |
| [07-erros-e-seguranca-web-laboratorio.md](07-erros-e-seguranca-web-laboratorio.md) | Laboratório do mesmo tema: o catálogo preparado para falhar, com a matriz de falhas do teu servidor e a revisão de um colega |
| [07-erros-e-seguranca-web-exercicios.md](07-erros-e-seguranca-web-exercicios.md) | Ficha de exercícios do mesmo tema, com a biblioteca no balcão |

O código completo dos exemplos dos guias está na pasta de exemplos, com instruções para o correres: o [catálogo de equipamentos](../exemplos/aplicacoes-em-browser/catalogo-de-equipamentos/README.md) do tema 2, o [catálogo com middleware](../exemplos/aplicacoes-em-browser/catalogo-com-middleware/README.md) do tema 3, o [catálogo com EJS](../exemplos/aplicacoes-em-browser/catalogo-com-ejs/README.md) do tema 4, o [catálogo com formulários](../exemplos/aplicacoes-em-browser/catalogo-com-formularios/README.md) do tema 5, o [catálogo com sessões](../exemplos/aplicacoes-em-browser/catalogo-com-sessoes/README.md) do tema 6 e o [catálogo com segurança](../exemplos/aplicacoes-em-browser/catalogo-com-seguranca/README.md) do tema 7. O [catálogo com reservas](../exemplos/aplicacoes-em-browser/catalogo-com-reservas/README.md), que também lá está, é uma primeira versão das reservas, em JSON, publicada antes do tema dos formulários.

![Rodapé](../imagens/rodape.png)
