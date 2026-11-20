// src/repositories/cenas.repository.js: o acesso às cenas na base de dados.
// Das camadas do jogo, é a única que usa o modelo Cena e que escreve os
// filtros na linguagem do MongoDB.
import { Cena } from "../models/cena.model.js";

/**
 * Procura todas as cenas da história, pela ordem em que estão na base.
 * @returns {Promise<object[]>} as cenas, possivelmente nenhuma
 */
export async function procurarTodas() {
  const cenas = await Cena.find({});
  return cenas;
}

/**
 * Procura uma cena pelo código, no campo codigo, e não pelo _id.
 * @param {string} codigo o código da cena, como "corredor"
 * @returns {Promise<object | null>} a cena, ou null se não existir
 */
export async function procurarPorCodigo(codigo) {
  // O find devolve sempre uma lista. Como não há duas cenas com o mesmo
  // código, a lista vem com uma cena, ou vazia.
  const encontradas = await Cena.find({ codigo: codigo });
  if (encontradas.length === 0) {
    return null;
  }
  return encontradas[0];
}
