// server.js: o primeiro servidor do catálogo de equipamentos da escola.
// Fica à escuta na porta 3000 e responde a dois pedidos GET.
import express from "express";

const app = express();
const PORTA = 3000;

// Os equipamentos ficam num array, em memória: existem enquanto o servidor
// estiver ligado. Mais à frente passam para uma base de dados.
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

// Rota 2: um pedido GET a /equipamentos recebe a lista em JSON.
app.get("/equipamentos", (req, res) => {
  res.json(equipamentos);
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
