// src/controllers/paginas.controller.js: a ponte entre o HTTP e as páginas do jogo.
// Lê e verifica o que vem no pedido, pede as cenas ao mesmo service da API e
// responde com uma página, construída a partir de um modelo da pasta views.
import { obterCena, cenaSeguinte } from "../services/cenas.service.js";

/** GET /: a página inicial, com a ligação para a primeira cena. */
export function mostrarInicio(req, res) {
  res.render("inicio", { titulo: "Início" });
}

/** GET /cenas/:codigo: a página de uma cena. */
export async function mostrarCena(req, res) {
  const codigo = req.params.codigo;
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).render("erro", {
      titulo: "Cena não encontrada",
      mensagem: `Não existe a cena ${codigo}.`,
    });
    return;
  }
  res.render("cena", { titulo: cena.titulo, cena: cena });
}

/** GET /cenas/:codigo/escolhas/:numero: a página da cena para onde a escolha leva. */
export async function fazerEscolha(req, res) {
  const codigo = req.params.codigo;
  const numero = Number(req.params.numero); // chega como texto, "2", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O número da escolha tem de ser um número inteiro maior do que 0.",
    });
    return;
  }
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).render("erro", {
      titulo: "Cena não encontrada",
      mensagem: `Não existe a cena ${codigo}.`,
    });
    return;
  }
  const seguinte = await cenaSeguinte(cena, numero);
  if (seguinte === null) {
    res.status(404).render("erro", {
      titulo: "Escolha não encontrada",
      mensagem: `A cena ${codigo} não tem a escolha ${numero}.`,
    });
    return;
  }
  res.render("cena", { titulo: seguinte.titulo, cena: seguinte });
}
