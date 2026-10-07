![Cabeçalho](../../../imagens/cabecalho.png)

# Catálogo de equipamentos

O servidor do exemplo guiado do [tema Primeiro servidor](../../../01-aplicacoes-em-browser/02-primeiro-servidor.md): um servidor Express com duas rotas `GET`, que responde com os equipamentos da escola guardados num array. O guia explica o código linha a linha; aqui está o código pronto a correr.

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `server.js` | O servidor |
| `package.json` | Descreve o projeto: o nome, o `"type": "module"` e a dependência do Express |
| `package-lock.json` | As versões exatas dos pacotes, para quem instalar ter as mesmas |

A pasta `node_modules` não está aqui de propósito: recria-se com `npm install`.

## Como correr

Precisas do Node.js instalado, na versão 22 ou mais recente (`node --version` diz qual tens), e de internet para o primeiro passo.

1. Copia esta pasta para fora do repositório, por exemplo para a tua pasta de trabalho das aulas, e abre um terminal dentro dela.
2. Instala as dependências, que o npm lê do `package.json` e do `package-lock.json`:

   ```text
   npm install
   ```

3. Liga o servidor:

   ```text
   node server.js
   ```

   O terminal deve mostrar `Servidor a correr em http://localhost:3000` e ficar ocupado.

4. No browser, abre:

   | Endereço | Resposta esperada |
   | --- | --- |
   | `http://localhost:3000/` | O texto "Olá! O servidor está a funcionar.", com o código 200 |
   | `http://localhost:3000/equipamentos` | Os quatro equipamentos em JSON, com o código 200 |
   | `http://localhost:3000/nao-existe` | `Cannot GET /nao-existe`, com o código 404 |

5. Para parar o servidor, carrega em Ctrl+C no terminal.

Se alguma coisa não correr como está escrito, a secção "Erros de arranque e como os ler" do guia tem as mensagens mais comuns e a forma de as resolver.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0 e Express 5.2.1, em macOS, a 7 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
