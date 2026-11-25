// src/services/cenas.service.js: as regras do jogo sobre as cenas.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
// nem de MongoDB: pede as cenas ao repository.
import {
  procurarTodas,
  procurarPorCodigo,
  inserirCena,
  alterarPorCodigo,
  procurarOrigens,
  apagarPorCodigo,
} from "../repositories/cenas.repository.js";

// A cena onde a história começa. As páginas levam lá no "Começar" e no
// "Recomeçar", e por isso nunca sai da história.
const CENA_INICIAL = "inicio";

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

/**
 * Procura, numa lista de escolhas, a primeira que leva a uma cena que não existe.
 * @param {object[]} escolhas as escolhas, cada uma com texto e destino
 * @returns {Promise<object | null>} { numero, destino } dessa escolha, a contar do 1, ou null se todas levam a uma cena
 */
async function escolhaSemDestino(escolhas) {
  for (let i = 0; i < escolhas.length; i++) {
    const destino = await procurarPorCodigo(escolhas[i].destino);
    if (destino === null) {
      return { numero: i + 1, destino: escolhas[i].destino };
    }
  }
  return null;
}

/**
 * Cria uma cena nova, se as regras do jogo o deixarem.
 * As regras de cada campo estão no schema do modelo.
 * @param {object} dados os campos da cena, já com o tipo verificado pelo controller
 * @returns {Promise<object>} { resultado } com "criada", "codigo-repetido" ou "destino-nao-existe";
 *   com "criada", também a cena; com "destino-nao-existe", a escolha sem cena
 */
export async function criarCena(dados) {
  // Regra do jogo: não há duas cenas com o mesmo código, porque é pelo
  // código que se pede uma cena e que as escolhas levam de uma cena a outra.
  const existente = await procurarPorCodigo(dados.codigo);
  if (existente !== null) {
    return { resultado: "codigo-repetido" };
  }
  // Regra do jogo: cada escolha leva a uma cena que existe.
  if (dados.escolhas !== undefined) {
    const escolha = await escolhaSemDestino(dados.escolhas);
    if (escolha !== null) {
      return { resultado: "destino-nao-existe", escolha: escolha };
    }
  }
  const cena = await inserirCena(dados);
  return { resultado: "criada", cena: cena };
}

/**
 * Altera os campos recebidos de uma cena, se as regras do jogo o deixarem.
 * @param {string} codigo o código da cena
 * @param {object} dados os campos a alterar, já com o tipo verificado pelo controller
 * @returns {Promise<object>} { resultado } com "alterada", "nao-existe" ou "destino-nao-existe";
 *   com "alterada", também a cena; com "destino-nao-existe", a escolha sem cena
 */
export async function alterarCena(codigo, dados) {
  const cena = await procurarPorCodigo(codigo);
  if (cena === null) {
    return { resultado: "nao-existe" };
  }
  // A mesma regra da criação: as escolhas novas levam a cenas que existem.
  if (dados.escolhas !== undefined) {
    const escolha = await escolhaSemDestino(dados.escolhas);
    if (escolha !== null) {
      return { resultado: "destino-nao-existe", escolha: escolha };
    }
  }
  const alterada = await alterarPorCodigo(codigo, dados);
  return { resultado: "alterada", cena: alterada };
}

/**
 * Apaga uma cena, se as regras do jogo o deixarem.
 * @param {string} codigo o código da cena
 * @returns {Promise<object>} { resultado } com "apagada", "nao-existe", "e-o-inicio" ou "e-destino";
 *   com "e-destino", também o código de uma cena que leva lá, em origem
 */
export async function apagarCena(codigo) {
  const cena = await procurarPorCodigo(codigo);
  if (cena === null) {
    return { resultado: "nao-existe" };
  }
  if (codigo === CENA_INICIAL) {
    return { resultado: "e-o-inicio" };
  }
  // Regra do jogo: uma cena só sai da história quando nenhuma escolha leva
  // a ela. Senão, essa escolha passava a levar a uma cena que não existe.
  const origens = await procurarOrigens(codigo);
  if (origens.length > 0) {
    return { resultado: "e-destino", origem: origens[0].codigo };
  }
  await apagarPorCodigo(codigo);
  return { resultado: "apagada" };
}
