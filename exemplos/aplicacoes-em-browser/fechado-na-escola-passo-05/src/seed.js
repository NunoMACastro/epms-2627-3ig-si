// src/seed.js: reconstrói a base de teste do jogo com as cenas da história.
// Corre-se à parte, com npm run seed. Apaga primeiro as cenas que lá
// estiverem, por isso pode correr-se as vezes que for preciso: depois de cada
// experiência, a base volta a ficar como estava no início.
import mongoose from "mongoose";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Cena } from "./models/cena.model.js";

// A história começa na cena "inicio". Cada escolha leva à cena com o código
// do destino. As cenas finais não têm escolhas.
const cenas = [
  {
    codigo: "inicio",
    titulo: "A biblioteca às escuras",
    texto: "Acordas com a cara em cima de um livro de Matemática. A biblioteca está às escuras e a escola está em silêncio: adormeceste a estudar, e ninguém deu por ti. O telemóvel tem 3% de bateria e marca 22:40.",
    final: false,
    escolhas: [
      { texto: "Sair para o corredor", destino: "corredor" },
      { texto: "Procurar um carregador atrás do balcão", destino: "carregador" },
    ],
  },
  {
    codigo: "carregador",
    titulo: "Atrás do balcão",
    texto: "Encontras um carregador, mas a tomada não dá corrente: à noite, a escola desliga a luz das salas. Ao menos, a lanterna do telemóvel ainda funciona.",
    final: false,
    escolhas: [{ texto: "Sair para o corredor", destino: "corredor" }],
  },
  {
    codigo: "corredor",
    titulo: "O corredor do rés-do-chão",
    texto: "Só se vê a luz verde das saídas de emergência. À esquerda, a porta da secretaria está entreaberta. Ao fundo, fica a porta principal. Lá em cima, alguma coisa bate com força, de vez em quando.",
    final: false,
    escolhas: [
      { texto: "Entrar na secretaria", destino: "secretaria" },
      { texto: "Ir até à porta principal", destino: "porta-principal" },
      { texto: "Subir as escadas", destino: "escadas" },
    ],
  },
  {
    codigo: "secretaria",
    titulo: "A secretaria",
    texto: "Na parede há um quadro com chaves penduradas, e uma delas diz Sala 12. Em cima da mesa está um bilhete do contínuo: «Ronda às 23h. O ginásio fecha por fora.»",
    final: false,
    escolhas: [{ texto: "Levar a chave da sala 12 e voltar ao corredor", destino: "corredor" }],
  },
  {
    codigo: "porta-principal",
    titulo: "A porta principal",
    texto: "A porta está fechada à chave, e a luz do alarme pisca a vermelho ao lado do puxador. Se a forçares, o alarme toca.",
    final: false,
    escolhas: [
      { texto: "Forçar a porta", destino: "fim-alarme" },
      { texto: "Voltar ao corredor", destino: "corredor" },
    ],
  },
  {
    codigo: "escadas",
    titulo: "O primeiro andar",
    texto: "Sobes devagar, com a lanterna apontada aos degraus. O barulho vem da sala 12: alguém deixou a janela aberta, e a cortina bate com o vento. Ao fundo do corredor, o passadiço leva ao ginásio.",
    final: false,
    escolhas: [
      { texto: "Entrar na sala 12", destino: "sala-12" },
      { texto: "Atravessar o passadiço até ao ginásio", destino: "fim-ginasio" },
    ],
  },
  {
    codigo: "sala-12",
    titulo: "A sala 12",
    texto: "A janela da sala 12 dá para o telhado do pavilhão, que fica mesmo por baixo. Lá em baixo, o portão das traseiras está aberto. No corredor, ouvem-se passos e o tilintar de chaves.",
    final: false,
    escolhas: [
      { texto: "Sair pela janela para o telhado", destino: "fim-telhado" },
      { texto: "Esconder-te debaixo da mesa do professor", destino: "fim-ronda" },
    ],
  },
  {
    codigo: "fim-telhado",
    titulo: "Cá fora!",
    texto: "Desces pelo telhado do pavilhão, passas o portão das traseiras e chegas a casa antes da meia-noite. Amanhã, ninguém na turma vai acreditar.",
    final: true,
    escolhas: [],
  },
  {
    codigo: "fim-alarme",
    titulo: "O alarme",
    texto: "O alarme dispara e enche a escola de barulho. Dez minutos depois, chegam o contínuo e a diretora. Vais ter muito que explicar.",
    final: true,
    escolhas: [],
  },
  {
    codigo: "fim-ronda",
    titulo: "A ronda das 23h",
    texto: "Os passos param à porta. O contínuo acende a luz, vê os teus ténis a espreitar debaixo da mesa e suspira: «Mais um que adormeceu na biblioteca.» Leva-te até à porta e liga aos teus pais.",
    final: true,
    escolhas: [],
  },
  {
    codigo: "fim-ginasio",
    titulo: "Fechado no ginásio",
    texto: "Entras no ginásio, e a porta fecha-se atrás de ti com um estalo. Fecha por fora, como dizia o bilhete. Passas a noite em cima dos colchões, e às 8h a turma do primeiro tempo encontra-te lá dentro.",
    final: true,
    escolhas: [],
  },
];

try {
  await ligarBaseDeDados();
  // O seed apaga todas as cenas da base onde está ligado. Para um engano no
  // DB_NAME não apagar outra base, só continua se o nome acabar em -teste.
  const nomeDaBase = mongoose.connection.name;
  if (!nomeDaBase.endsWith("-teste")) {
    console.error(`O seed só corre numa base de teste, e esta é a ${nomeDaBase}. Muda o DB_NAME no .env.`);
  } else {
    // O filtro vazio, {}, escolhe todos os documentos: apaga todas as cenas.
    const apagadas = await Cena.deleteMany({});
    console.log(`Apagadas ${apagadas.deletedCount} cenas`);
    // O insertMany verifica cada cena com as regras do schema antes de inserir.
    const inseridas = await Cena.insertMany(cenas);
    console.log(`Inseridas ${inseridas.length} cenas`);
  }
} catch (erro) {
  console.error(`O seed falhou: ${erro.message}`);
}

// A ligação à base fica aberta até alguém a fechar. Sem esta linha,
// o programa ficava à espera e não voltava ao terminal.
await mongoose.disconnect();
