// server.js: o catálogo de equipamentos da escola, agora com reservas.
// Mostra as três formas de um pedido trazer dados (no caminho, na pesquisa
// e no corpo) e o middleware, que corre antes das rotas.
import express from "express";

const app = express();
const PORTA = 3000;

// Os dados ficam em memória: existem enquanto o servidor estiver ligado.
const equipamentos = [
  { id: 1, nome: "Portátil", sala: "B12" },
  { id: 2, nome: "Projetor", sala: "A03" },
  { id: 3, nome: "Impressora", sala: "Secretaria" },
  { id: 4, nome: "Monitor", sala: "B12" },
];
const reservas = [];
let proximoIdReserva = 1;

// Middleware 1: escreve no terminal cada pedido que chega, e passa-o à frente.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware 2: lê os dados enviados por um formulário com method="post"
// e põe-nos em req.body. Sem ele, req.body não existe.
app.use(express.urlencoded({ extended: false }));

// Página inicial, com um formulário de pesquisa que envia por GET.
app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="pt">
  <head><meta charset="utf-8"><title>Catálogo de equipamentos</title></head>
  <body>
    <h1>Catálogo de equipamentos</h1>
    <form method="get" action="/equipamentos">
      <label>Sala <input name="sala"></label>
      <button type="submit">Pesquisar</button>
    </form>
    <p><a href="/reservas/nova">Fazer uma reserva</a></p>
  </body>
</html>`);
});

// Lista de equipamentos. Com ?sala=B12, só os dessa sala.
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  if (sala) {
    const daSala = equipamentos.filter((equipamento) => equipamento.sala === sala);
    res.json(daSala);
    return;
  }
  res.json(equipamentos);
});

// Um equipamento: GET /equipamentos/2. O :id é um parâmetro de caminho.
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ erro: "O identificador tem de ser um número inteiro positivo" });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === id);
  if (!equipamento) {
    res.status(404).json({ erro: `Não existe o equipamento ${id}` });
    return;
  }
  res.json(equipamento);
});

// Formulário de reserva, que envia por POST para /reservas.
app.get("/reservas/nova", (req, res) => {
  res.send(`<!doctype html>
<html lang="pt">
  <head><meta charset="utf-8"><title>Nova reserva</title></head>
  <body>
    <h1>Nova reserva</h1>
    <form method="post" action="/reservas">
      <p><label>Número do equipamento <input name="equipamento_id" required></label></p>
      <p><label>Dia <input name="data" type="date" required></label></p>
      <p><label>Tempo <input name="tempo" type="number" min="1" required></label></p>
      <button type="submit">Reservar</button>
    </form>
  </body>
</html>`);
});

// Criar uma reserva: POST /reservas, com os dados no corpo do pedido.
app.post("/reservas", (req, res) => {
  const equipamentoId = Number(req.body.equipamento_id);
  const data = req.body.data;
  const tempo = Number(req.body.tempo);

  const equipamento = equipamentos.find((equipamento) => equipamento.id === equipamentoId);
  if (!equipamento || !data || !Number.isInteger(tempo) || tempo < 1) {
    res.status(400).json({ erro: "Reserva inválida: confirma o equipamento, o dia e o tempo" });
    return;
  }

  const reserva = { id: proximoIdReserva, equipamentoId, data, tempo };
  proximoIdReserva = proximoIdReserva + 1;
  reservas.push(reserva);
  res.status(201).json(reserva);
});

// Lista das reservas feitas desde que o servidor arrancou.
app.get("/reservas", (req, res) => {
  res.json(reservas);
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).send("Página não encontrada.");
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
