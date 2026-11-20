// src/server.js: o ponto de arranque do jogo Fechado na escola.
// Cria a aplicação Express, monta as rotas da API e as das páginas, liga-se à base de dados
// e só depois à porta. As regras e as consultas estão nas camadas.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import cenasRotas from "./rotas/cenas.rotas.js";
import paginasRotas from "./rotas/paginas.rotas.js";

const app = express();

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, o jogo usa a 3000.
const PORTA = process.env.PORT || 3000;

// O motor dos modelos das páginas. O Express procura os modelos na pasta
// views da pasta de onde arrancas o servidor, que é a raiz do projeto.
app.set("view engine", "ejs");

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rota de estado: serve para confirmar que o servidor está ligado e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "Fechado na escola" });
});

// Todos os pedidos começados por /api/cenas seguem para o router das cenas.
app.use("/api/cenas", cenasRotas);

// As páginas do jogo: os pedidos que a API não atendeu seguem para o router das páginas.
app.use("/", paginasRotas);

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
// Os endereços da API começam todos por /api/ e respondem em JSON, como diz
// o contrato. Os outros são páginas do jogo, e respondem com a página de erro.
app.use((req, res) => {
  if (req.url.startsWith("/api/")) {
    res.status(404).json({ erro: "Rota não encontrada" });
    return;
  }
  res.status(404).render("erro", {
    titulo: "Página não encontrada",
    mensagem: "Este endereço não existe no jogo.",
  });
});

// Primeiro a ligação à base, e só depois o servidor: um jogo que não
// chega às cenas não deve começar a aceitar pedidos.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Fechado na escola em http://localhost:${PORTA}`);
});
