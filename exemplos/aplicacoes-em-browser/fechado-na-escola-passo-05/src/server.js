// src/server.js: o ponto de arranque do jogo Fechado na escola.
// Cria a aplicação Express, monta as rotas da API e as das páginas, liga-se à base de dados
// e só depois à porta. As regras e as consultas estão nas camadas, e os erros
// dos pedidos à API acabam no middleware de erros, no fim deste ficheiro.
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

// Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
// objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
// Fica depois do registo, para o terminal mostrar também os pedidos cujo
// corpo não se consegue ler.
app.use(express.json());

// Lê o corpo dos formulários das páginas, que chegam em urlencoded, e põe-no
// em req.body. O express.json() só lê os pedidos em JSON, que são os da API.
app.use(express.urlencoded({ extended: false }));

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

// Middleware de erros: o Express só o chama quando um pedido acabou num erro,
// e reconhece-o pelos quatro parâmetros. Responde sempre em JSON, sem
// pormenores internos.
app.use((erro, req, res, next) => {
  // O express.json() não conseguiu ler o corpo: o texto não era JSON.
  if (erro.type === "entity.parse.failed") {
    res.status(400).json({ erro: "O corpo do pedido não é JSON válido" });
    return;
  }
  // Uma ou mais regras do schema falharam. O erro traz, em erro.errors, um
  // objeto com um campo por cada regra que falhou, e cada um tem a mensagem
  // que escreveste no schema. A resposta junta-as todas num só texto.
  if (erro.name === "ValidationError") {
    const mensagens = Object.values(erro.errors).map((falha) => falha.message);
    res.status(400).json({ erro: mensagens.join(". ") });
    return;
  }
  // Qualquer outro erro é um problema do servidor, e não de quem pediu.
  // A razão fica no terminal, para quem programa; o cliente recebe só o 500.
  console.error(`Erro interno: ${erro.message}`);
  res.status(500).json({ erro: "Erro interno do servidor" });
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
