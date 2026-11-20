// src/services/cenas.service.js: as regras do jogo sobre as cenas.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
// nem de MongoDB: pede as cenas ao repository.
import { procurarTodas, procurarPorCodigo } from "../repositories/cenas.repository.js";

/**
 * Devolve todas as cenas da história.
 * @returns {Promise<object[]>} as cenas, possivelmente nenhuma
 */
export async function listarCenas() {
  const cenas = await procurarTodas();
  return cenas;
}

/**
 * Procura uma cena pelo código.
 * @param {string} codigo o código da cena
 * @returns {Promise<object | null>} a cena, ou null se não existir
 */
export async function obterCena(codigo) {
  const cena = await procurarPorCodigo(codigo);
  return cena;
}

/**
 * Diz para que cena leva uma escolha de uma cena.
 * A regra do jogo: o jogador vê as escolhas numeradas a partir de 1, e é
 * o servidor, e não o jogador, que diz para onde cada uma leva.
 * @param {object} cena a cena onde o jogador está, que já se sabe que existe
 * @param {number} numero o número da escolha, um inteiro de 1 para cima, já verificado
 * @returns {Promise<object | null>} a cena seguinte, ou null se a cena não tiver essa escolha
 */
export async function cenaSeguinte(cena, numero) {
  // A lista das escolhas começa no 0: a escolha 1 está na posição 0.
  // Uma cena final não tem escolhas, e qualquer número fica de fora.
  const escolha = cena.escolhas[numero - 1];
  if (escolha === undefined) {
    return null;
  }
  const seguinte = await procurarPorCodigo(escolha.destino);
  return seguinte;
}
