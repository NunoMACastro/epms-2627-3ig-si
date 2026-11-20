// src/controllers/cenas.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe a resposta,
// sempre em JSON, como diz o contrato.
import { listarCenas, obterCena, cenaSeguinte } from "../services/cenas.service.js";

/** GET /api/cenas */
export async function listar(req, res) {
  const cenas = await listarCenas();
  res.json(cenas);
}

/** GET /api/cenas/:codigo */
export async function obter(req, res) {
  const codigo = req.params.codigo;
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  res.json(cena);
}

/** GET /api/cenas/:codigo/escolhas/:numero */
export async function escolher(req, res) {
  const codigo = req.params.codigo;
  const numero = Number(req.params.numero); // chega como texto, "2", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número da escolha tem de ser um número inteiro maior do que 0" });
    return;
  }
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  const seguinte = await cenaSeguinte(cena, numero);
  if (seguinte === null) {
    res.status(404).json({ erro: `A cena ${codigo} não tem a escolha ${numero}` });
    return;
  }
  res.json(seguinte);
}
