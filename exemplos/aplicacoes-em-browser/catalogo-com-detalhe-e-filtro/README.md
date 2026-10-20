![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo de equipamentos: o primeiro servidor com Express

Exemplo guiado da aula de 6 de outubro de 2026, do tema Primeiro servidor, com os acrescentos que abriram o tema seguinte, HTTP, rotas e middleware. É material do professor e não está no repositório dos alunos.

## O que está nesta pasta

- `server.js`: o servidor, com três rotas e os equipamentos em memória.
- `package.json` e `package-lock.json`: o projeto e a versão exata do Express usada, a 5.2.1.
- A pasta `node_modules` não fica guardada. Cria-se com `npm install`, como se explica abaixo.

## Como o exemplo cresceu na aula

1. **Primeira versão:** duas rotas GET, `/` e `/equipamentos`, com três equipamentos em memória, e o `app.listen` com a verificação de erro.
2. **Acrescentos da mesma aula,** mantendo a simplicidade de um primeiro contacto: a rota de detalhe `/equipamentos/:id`, que responde 404 quando o equipamento não existe, e o filtro `?sala=` na rota da lista. Entrou um quarto equipamento, um monitor na B12, para o filtro devolver mais do que um.

Ficaram de fora, de propósito, o middleware e o POST. São mecanismos novos, e não mais uma rota, e por isso ficam para outras aulas.

## Configurar de raiz, como na aula

Confirmar primeiro que o Node está instalado. Deve aparecer `v24`; o mínimo para o Express 5 é o 18.

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

3. Abrir o `package.json` e trocar `"type": "commonjs"` por `"type": "module"`. O npm atual já escreve a linha com `commonjs`, por isso troca-se o valor em vez de acrescentar a linha. Sem esta troca, o `import` dá erro.

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

## Correr a partir desta pasta

Para usar esta cópia em vez de a construir de raiz, basta instalar as dependências, que o `package-lock.json` fixa na versão testada, e ligar o servidor:

```bash
npm install
node server.js
```

## O que experimentar

Respostas obtidas no teste de 6 de outubro:

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
| O `npm install` fica parado ou falha | Não há internet na sala | Levar uma pasta com o `node_modules` já instalado e copiá-la para os computadores. Como plano B, um servidor com o módulo `node:http`, que vem com o Node e não precisa do npm |

## Porque é que o `app.listen` verifica o erro

No Express 5, a função passada ao `app.listen` também é chamada quando o servidor não consegue ligar-se. Sem o `if (erro)`, com a porta ocupada, o programa escreve "Servidor a correr" e termina em silêncio: a mensagem é falsa e o aluno não vê o erro. A planificação pede, como evidência deste tema, que o aluno encontre e corrija um erro de porta, e sem estas linhas esse erro não aparece.

## Perguntas para a turma

1. **Porque é que `?sala=b12` não encontra nada?** Porque as maiúsculas contam: `"b12" === "B12"` é falso.
2. **`/equipamentos/abc` deve dar 404 ou 400?** Agora dá 404, porque `Number("abc")` dá `NaN` e o `find` não encontra nada. Mas `abc` nem é um número, e o código certo seria o 400, de pedido inválido. A planificação pede que se distinga o parâmetro inválido do recurso que não existe; decidir e acrescentar o caso é um bom exercício.
3. **O que muda entre `res.send` e `res.json`?** O primeiro respondeu com o tipo `text/html` e o segundo com `application/json`. Vê-se nos cabeçalhos da resposta, no separador Rede do browser.

## Imagens de apoio

Na pasta de cima estão duas imagens da arquitetura do Node.js, cada uma em PNG para projetar e em SVG para editar:

- `M06-B02-arquitetura-do-nodejs`: a versão completa, com as camadas, o event loop explicado em cinco passos e o caminho de um pedido a este servidor.
- `M06-B02-arquitetura-do-nodejs-diagrama`: só o diagrama, com menos texto.

As duas servem também o tema de arquitetura do Node em Linguagens de Programação; se lá forem precisas, liga-se a estas em vez de as copiar.

## Validação

Testado a 6 de outubro de 2026 em Node 24.17.0 com Express 5.2.1, numa cópia ligada à porta 3100: todas as respostas da tabela, o erro de porta ocupada e o erro sem `"type": "module"`. Não foi testado em Windows.

![Rodapé](../../../imagens/rodape.png)
