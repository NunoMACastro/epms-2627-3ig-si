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

/**
 * Insere uma cena nova. O schema verifica as regras de cada campo antes de
 * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
 * @param {object} dados os campos da cena, só os da lista do controller
 * @returns {Promise<object>} a cena inserida, já com o _id que o MongoDB lhe deu
 */
export async function inserirCena(dados) {
  const cena = await Cena.create(dados);
  return cena;
}

/**
 * Altera os campos recebidos de uma cena, e deixa os outros como estão.
 * @param {string} codigo o código da cena
 * @param {object} dados os campos a alterar, só os da lista do controller
 * @returns {Promise<object | null>} a cena depois da alteração, ou null se não existir
 */
export async function alterarPorCodigo(codigo, dados) {
  // Sem as duas opções, o findOneAndUpdate devolvia a cena como estava
  // antes da alteração, e não verificava as regras do schema, que por omissão
  // só correm quando um documento é criado.
  const cena = await Cena.findOneAndUpdate({ codigo: codigo }, dados, {
    returnDocument: "after",
    runValidators: true,
  });
  return cena;
}

/**
 * Procura as cenas que têm pelo menos uma escolha que leva a um código.
 * @param {string} codigo o código da cena de destino
 * @returns {Promise<object[]>} as cenas de onde se chega a esse código, possivelmente nenhuma
 */
export async function procurarOrigens(codigo) {
  // Como o "localizacao.corredor" do tema 02, o ponto escolhe um campo de
  // dentro de outro: aqui, o destino de cada escolha. Numa lista, o filtro
  // escolhe a cena se alguma das escolhas tiver este destino.
  const cenas = await Cena.find({ "escolhas.destino": codigo });
  return cenas;
}

/**
 * Apaga uma cena.
 * @param {string} codigo o código da cena
 * @returns {Promise<void>} cumprida quando a cena foi apagada
 */
export async function apagarPorCodigo(codigo) {
  await Cena.findOneAndDelete({ codigo: codigo });
}
