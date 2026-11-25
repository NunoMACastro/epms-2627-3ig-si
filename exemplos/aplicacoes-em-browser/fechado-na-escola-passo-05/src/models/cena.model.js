// src/models/cena.model.js: o modelo das cenas do jogo, no Mongoose.
// Cada cena é um documento da coleção cenas: um bocado da história, com as
// escolhas que o jogador pode fazer a seguir. O schema guarda também as regras
// de cada campo, e tudo o que escreve cenas passa por elas: a API e o seed.
import mongoose from "mongoose";

// Uma escolha não existe sozinha: só faz sentido dentro da sua cena, por isso
// está embutida nela. O destino é o código da cena para onde a escolha leva.
// O _id: false tira o identificador que o Mongoose daria a cada escolha:
// uma escolha não se procura sozinha, e não precisa dele.
const escolhaSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      // O segundo valor de cada regra é a mensagem que a API devolve quando
      // a regra falha. Sem ele, o Mongoose escrevia uma mensagem em inglês.
      required: [true, "O texto de cada escolha é obrigatório"],
      // O trim tira os espaços do início e do fim antes de verificar e guardar.
      trim: true,
      maxlength: [80, "O texto de uma escolha tem no máximo 80 carateres"],
    },
    destino: {
      type: String,
      required: [true, "O destino de cada escolha é obrigatório"],
      trim: true,
    },
  },
  { _id: false },
);

const cenaSchema = new mongoose.Schema({
  // O código identifica a cena no jogo, como "corredor" ou "sala-12".
  // É por ele que as escolhas apontam umas para as outras.
  codigo: {
    type: String,
    required: [true, "O código é obrigatório"],
    trim: true,
    maxlength: [30, "O código tem no máximo 30 carateres"],
  },
  titulo: {
    type: String,
    required: [true, "O título é obrigatório"],
    trim: true,
    maxlength: [60, "O título tem no máximo 60 carateres"],
  },
  texto: {
    type: String,
    required: [true, "O texto é obrigatório"],
    trim: true,
    maxlength: [600, "O texto tem no máximo 600 carateres"],
  },
  // Uma cena final acaba a partida, e não tem escolhas.
  final: {
    type: Boolean,
    required: [true, "Falta dizer se a cena é final"],
  },
  // Sem escolhas no pedido, o Mongoose guarda uma lista vazia.
  escolhas: [escolhaSchema],
});

// O terceiro argumento é o nome da coleção, escrito à mão.
export const Cena = mongoose.model("Cena", cenaSchema, "cenas");
