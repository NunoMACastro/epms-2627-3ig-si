![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo com detalhe e filtro

Este exemplo prolonga o primeiro servidor com uma rota de detalhe e um filtro por sala. É uma etapa entre o [Primeiro servidor](../../../01-aplicacoes-em-browser/02-primeiro-servidor.md) e o [HTTP, rotas e middleware](../../../01-aplicacoes-em-browser/03-http-rotas-e-middleware.md).

## O que está nesta pasta

- `server.js`: o servidor, com três rotas e os equipamentos em memória.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes desta cópia.
- A pasta `node_modules` não fica guardada. Cria-se com `npm install`, como se explica abaixo.

## Da lista ao detalhe e ao filtro

1. **Ponto de partida:** duas rotas GET, `/` e `/equipamentos`, com os equipamentos em memória, e o `app.listen` com a verificação de erro.
2. **Detalhe e filtro:** a rota `/equipamentos/:id` responde com um equipamento ou com 404 quando não o encontra. O filtro `?sala=` limita a lista aos equipamentos dessa sala. O portátil e o monitor estão na B12, para o filtro devolver mais do que um.

O exemplo usa apenas rotas GET. O middleware e o POST são mecanismos diferentes: o middleware entra no tema HTTP, rotas e middleware; o POST com formulário entra no tema Formulários e validação.

## Configurar de raiz

Usa o Node 24 adotado na disciplina. Confirma a versão instalada:

```bash
node --version
```

1. Criar a pasta do projeto e entrar nela:

   ```bash
   mkdir catalogo-de-equipamentos
   cd catalogo-de-equipamentos
   ```

2. Criar o `package.json`:

   ```bash
   npm init -y
   ```

3. Correr `npm pkg set type=module` para definir os módulos ES. O comando acrescenta o campo se faltar e altera-o se existir. Confere depois o `package.json`: deve ter `"type": "module"`.

4. Instalar o Express. Precisa de internet. Cria a pasta `node_modules` e o `package-lock.json`, e acrescenta o Express às dependências do `package.json`.

   ```bash
   npm install express
   ```

5. Criar o `server.js` com o código desta pasta.

6. Ligar o servidor. Deve aparecer `Servidor a correr em http://localhost:3000`, e o terminal fica ocupado pelo servidor.

   ```bash
   node server.js
   ```

7. Experimentar no browser os endereços da tabela abaixo.

8. Desligar o servidor com Ctrl+C no terminal. Depois de mudar o código, é preciso desligá-lo e voltar a ligá-lo; com `node --watch server.js`, o Node reinicia sozinho sempre que o ficheiro é gravado.

## Como correr

Para usar esta cópia em vez de a construir de raiz, basta instalar as dependências, que o `package-lock.json` fixa nas versões desta cópia, e ligar o servidor:

```bash
npm install
node server.js
```

## O que experimentar

Compara as respostas com estes resultados esperados:

| Endereço | Resposta | Código |
|---|---|---|
| `http://localhost:3000/` | `Olá! O servidor está a funcionar.` | 200 |
| `/equipamentos` | os quatro equipamentos, em JSON | 200 |
| `/equipamentos?sala=B12` | o portátil e o monitor | 200 |
| `/equipamentos?sala=b12` | `[]`, uma lista vazia | 200 |
| `/equipamentos/2` | o projetor | 200 |
| `/equipamentos/9` | `{"erro":"Não existe o equipamento 9"}` | 404 |
| `/equipamentos/abc` | `{"erro":"Não existe o equipamento abc"}` | 404 |
| `/alunos` | `Cannot GET /alunos`, a página de erro do próprio Express | 404 |

## Erros que costumam aparecer

| Mensagem | Causa | O que fazer |
|---|---|---|
| `SyntaxError: Cannot use import statement outside a module` | O `package.json` ainda tem `"type": "commonjs"` | Trocar para `"module"` |
| `Não foi possível ligar o servidor: listen EADDRINUSE: address already in use :::3000` | Já há outro servidor a usar a porta 3000, quase sempre noutro terminal | Ctrl+C nesse terminal, ou mudar a `PORTA` |
| O `npm install` fica parado ou falha | Não há internet na sala | Levar uma pasta com o `node_modules` já instalado e copiá-la para os computadores. Se não tiveres os pacotes disponíveis, pede ao professor um ambiente preparado |

## Porque é que o `app.listen` verifica o erro

No Express 5, a função passada ao `app.listen` também é chamada quando o servidor não consegue ligar-se. Sem o `if (erro)`, com a porta ocupada, o programa escreve "Servidor a correr" e termina em silêncio: a mensagem é falsa e o aluno não vê o erro. A planificação pede, como evidência deste tema, que o aluno encontre e corrija um erro de porta, e sem estas linhas esse erro não aparece.

## Perguntas para a turma

1. **Porque é que `?sala=b12` não encontra nada?** Porque as maiúsculas contam: `"b12" === "B12"` é falso.
2. **`/equipamentos/abc` deve dar 404 ou 400?** Agora dá 404, porque `Number("abc")` dá `NaN` e o `find` não encontra nada. Mas `abc` nem é um número, e o código certo seria o 400, de pedido inválido. A planificação pede que se distinga o parâmetro inválido do recurso que não existe; decidir e acrescentar o caso é um bom exercício.
3. **O que muda entre `res.send` e `res.json`?** O primeiro respondeu com o tipo `text/html` e o segundo com `application/json`. Vê-se nos cabeçalhos da resposta, no separador Rede do browser.

## Imagens de apoio

As imagens de apoio estão em `imagens/` do repositório. Cada uma tem uma versão PNG e outra SVG:

- [Arquitetura do Node.js](../../../imagens/arquitetura-do-nodejs.png): a versão completa, com as camadas, o event loop explicado em cinco passos e o caminho de um pedido a este servidor.
- [Diagrama da arquitetura do Node.js](../../../imagens/arquitetura-do-nodejs-diagrama.png): só o diagrama, com menos texto.

As duas servem também o tema de arquitetura do Node em Linguagens de Programação; podes usar as mesmas imagens sem as duplicar.

## Versões com que foi testado

Node.js 24.22.0, npm 11.20.0 e Express 5.2.1, em macOS, a 20 de outubro de 2026. As respostas da tabela foram verificadas por HTTP numa pasta nova. O Windows não foi reensaiado.

![Rodapé](../../../imagens/rodape.png)
