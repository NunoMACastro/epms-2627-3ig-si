// server.js: um servidor web muito simples, feito com Node.js e Express.
// Fica à espera de pedidos do browser e responde em três rotas.

import express from "express";

const app = express();
const PORTA = 3000;

// Dados em memória: existem enquanto o servidor estiver ligado.
const equipamentos = [
  { id: 1, nome: "Portátil", sala: "B12" },
  { id: 2, nome: "Projetor", sala: "A03" },
  { id: 3, nome: "Impressora", sala: "Secretaria" },
  { id: 4, nome: "Monitor", sala: "B12" },
];

// Rota 1: um pedido GET a / recebe um texto.
app.get("/", (req, res) => {
  res.send("Olá! O servidor está a funcionar.");
});

// Rota 2: GET /equipamentos recebe a lista em JSON.
// Com ?sala=B12 no fim do endereço, recebe só os equipamentos dessa sala.
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  if (sala) {
    const daSala = equipamentos.filter((equipamento) => equipamento.sala === sala);
    res.json(daSala);
    return;
  }
  res.json(equipamentos);
});

// Rota 3: GET /equipamentos/2 recebe só o equipamento com o id 2.
// O :id é um parâmetro de rota: o Express guarda o valor em req.params.id.
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  const equipamento = equipamentos.find((equipamento) => equipamento.id === id);
  if (!equipamento) {
    res.status(404).json({ erro: `Não existe o equipamento ${req.params.id}` });
    return;
  }
  res.json(equipamento);
});

// Liga o servidor: a partir daqui fica à escuta na porta 3000.
// Se não conseguir (por exemplo, porque a porta já está ocupada),
// o Express chama esta função com o erro.
app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
