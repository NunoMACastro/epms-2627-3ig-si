// src/models/cena.model.js: o modelo das cenas do jogo, no Mongoose.
// Cada cena é um documento da coleção cenas: um bocado da história, com as
// escolhas que o jogador pode fazer a seguir.
import mongoose from "mongoose";

// Uma escolha não existe sozinha: só faz sentido dentro da sua cena, por isso
// está embutida nela. O destino é o código da cena para onde a escolha leva.
// O _id: false tira o identificador que o Mongoose daria a cada escolha:
// uma escolha não se procura sozinha, e não precisa dele.
const escolhaSchema = new mongoose.Schema(
  {
    texto: String,
    destino: String,
  },
  { _id: false },
);

const cenaSchema = new mongoose.Schema({
  // O código identifica a cena no jogo, como "corredor" ou "sala-12".
  // É por ele que as escolhas apontam umas para as outras.
  codigo: String,
  titulo: String,
  texto: String,
  // Uma cena final acaba a partida, e não tem escolhas.
  final: Boolean,
  escolhas: [escolhaSchema],
});

// O terceiro argumento é o nome da coleção, escrito à mão.
export const Cena = mongoose.model("Cena", cenaSchema, "cenas");
