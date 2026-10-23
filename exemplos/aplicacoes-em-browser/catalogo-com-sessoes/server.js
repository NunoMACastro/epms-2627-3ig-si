// server.js: o catálogo de equipamentos da escola, agora com um pedido em curso.
// Quem quer reservar junta ao pedido um ou mais equipamentos, página a página,
// e no fim confirma tudo de uma vez, ou cancela. O pedido fica guardado na
// sessão: os dados ficam no servidor, e o browser só guarda um cookie com o
// identificador da sessão.
import express from "express";
import session from "express-session";

const app = express();
const PORTA = 3000;

// O segredo que assina o cookie da sessão vem do ambiente, e nunca do código.
// Sem ele, o servidor recusa-se a arrancar.
const SEGREDO = process.env.SESSION_SECRET;
if (!SEGREDO) {
  console.error("Falta o SESSION_SECRET. Copia o .env.example para .env, escreve lá um segredo e arranca com: node --env-file=.env server.js");
  process.exit(1);
}

// O nome do cookie da sessão, usado na configuração e ao terminar a sessão.
const NOME_DO_COOKIE = "catalogo.sid";

// O motor de modelos: o res.render vai procurar os ficheiros .ejs
// na pasta views.
app.set("view engine", "ejs");

// Os dados ficam em memória: existem enquanto o servidor estiver ligado.
const equipamentos = [
  { id: 1, nome: "Portátil", sala: "B12" },
  { id: 2, nome: "Projetor", sala: "A03" },
  { id: 3, nome: "Impressora", sala: "Secretaria" },
  { id: 4, nome: "Monitor", sala: "B12" },
];
const reservas = [];
let proximoIdReserva = 1;

/**
 * Devolve o texto de um campo do formulário, sem os espaços das pontas.
 * Um campo que não veio, ou que veio repetido (e chega como um array),
 * não é um texto: devolve o texto vazio.
 * @param {unknown} valor o valor tal como chegou em req.body
 * @returns {string}
 */
function textoDoCampo(valor) {
  if (typeof valor !== "string") {
    return "";
  }
  return valor.trim();
}

/**
 * Confirma que um texto no formato AAAA-MM-DD é um dia que existe.
 * O new Date aceita "2026-02-30" e transforma-o em 2 de março; por isso
 * confirma-se que o dia que sai é o mesmo que entrou.
 * @param {string} texto o dia, como o campo type="date" o envia
 * @returns {boolean}
 */
function diaValido(texto) {
  const dia = new Date(texto);
  if (Number.isNaN(dia.getTime())) {
    return false;
  }
  return dia.toISOString().slice(0, 10) === texto;
}

/**
 * Verifica um equipamento a juntar ao pedido: o equipamento, o dia e o tempo.
 * Só lê os três campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * @param {object|undefined} corpo o req.body do pedido, que pode não existir
 * @returns {object} um objeto com os valores e os erros
 */
function validarItem(corpo) {
  // Sem corpo lido, todos os campos faltam e recebem os erros já previstos.
  if (!corpo) {
    corpo = {};
  }
  const valores = {
    equipamento_id: textoDoCampo(corpo.equipamento_id),
    data: textoDoCampo(corpo.data),
    tempo: textoDoCampo(corpo.tempo),
  };
  const erros = {};

  // O equipamento tem de ser um dos da lista.
  const equipamento = equipamentos.find((equipamento) => equipamento.id === Number(valores.equipamento_id));
  if (!equipamento) {
    erros.equipamento_id = "Escolhe um equipamento da lista.";
  }

  // O dia é obrigatório, e tem de existir no calendário.
  if (valores.data === "") {
    erros.data = "Escolhe o dia da reserva.";
  } else if (!diaValido(valores.data)) {
    erros.data = "Esse dia não existe no calendário.";
  }

  // O tempo letivo é obrigatório, e é um número inteiro de 1 a 9.
  const tempo = Number(valores.tempo);
  if (valores.tempo === "") {
    erros.tempo = "Indica o tempo letivo.";
  } else if (!Number.isInteger(tempo) || tempo < 1 || tempo > 9) {
    erros.tempo = "O tempo letivo é um número inteiro de 1 a 9.";
  }

  return { valores: valores, erros: erros };
}

/**
 * Verifica o nome de quem confirma o pedido: obrigatório, e até 40 carateres.
 * Devolve a mensagem de erro, ou o texto vazio se o nome servir.
 * @param {string} nome o nome, já limpo pela textoDoCampo
 * @returns {string}
 */
function erroDoNome(nome) {
  if (nome === "") {
    return "Escreve o teu nome.";
  }
  if (nome.length > 40) {
    return "O nome tem, no máximo, 40 carateres.";
  }
  return "";
}

/**
 * Junta a cada item do pedido o seu equipamento, para a página mostrar o nome.
 * @param {object[]} pedido os itens guardados na sessão
 * @returns {object[]} uma linha por item, com o item e o equipamento
 */
function linhasDoPedido(pedido) {
  const linhas = [];
  for (const item of pedido) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === item.equipamentoId);
    linhas.push({ item: item, equipamento: equipamento });
  }
  return linhas;
}

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware que lê o corpo dos formulários enviados por POST e o põe em
// req.body. Tem de estar antes das rotas que usam o req.body.
app.use(express.urlencoded({ extended: false }));

// Middleware das sessões: lê o cookie de cada pedido, encontra a sessão
// desse browser e põe-na em req.session. Cada opção está justificada.
app.use(session({
  secret: SEGREDO, // assina o cookie: o servidor só aceita identificadores que ele próprio deu
  name: NOME_DO_COOKIE, // o nome do cookie no browser
  resave: false, // não volta a guardar uma sessão que não mudou
  saveUninitialized: false, // não cria sessão, nem cookie, a quem ainda não guardou nada
  cookie: {
    httpOnly: true, // o JavaScript das páginas não consegue ler o cookie
    sameSite: "lax", // o cookie não vai nos pedidos POST que outros sites façam ao catálogo
    secure: false, // com HTTPS seria true; em http://localhost tem de ser false
    maxAge: 30 * 60 * 1000, // 30 minutos, em milissegundos, contados da última mudança
  },
}));

// Para todas as páginas: quantos equipamentos tem o pedido desta sessão.
// O res.locals põe o valor à disposição de todos os modelos, incluindo o cabeçalho.
app.use((req, res, next) => {
  const pedido = req.session.pedido;
  res.locals.itensNoPedido = pedido ? pedido.length : 0;
  next();
});

// Página inicial, com a pesquisa por sala e a ligação para reservar.
app.get("/", (req, res) => {
  res.render("inicio", { titulo: "Início" });
});

// Lista de equipamentos. Com ?sala=B12, só os dessa sala.
app.get("/equipamentos", (req, res) => {
  const sala = req.query.sala;
  let lista = equipamentos;
  if (sala) {
    lista = equipamentos.filter((equipamento) => equipamento.sala === sala);
  }
  res.render("equipamentos", { titulo: "Equipamentos", equipamentos: lista, sala: sala });
});

// Um equipamento: GET /equipamentos/2. O :id é um parâmetro de rota.
app.get("/equipamentos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O identificador tem de ser um número inteiro positivo.",
    });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === id);
  if (!equipamento) {
    res.status(404).render("erro", {
      titulo: "Equipamento não encontrado",
      mensagem: `Não existe o equipamento ${id}.`,
    });
    return;
  }
  res.render("equipamento", { titulo: equipamento.nome, equipamento: equipamento });
});

// O pedido em curso: os equipamentos já juntos, a confirmação e o cancelamento.
app.get("/pedido", (req, res) => {
  const pedido = req.session.pedido || [];
  res.render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: "", erroNome: "" });
});

// O formulário para juntar um equipamento ao pedido.
app.get("/pedido/item", (req, res) => {
  res.render("item-novo", {
    titulo: "Juntar ao pedido",
    equipamentos: equipamentos,
    valores: { equipamento_id: "", data: "", tempo: "" },
    erros: {},
  });
});

// Juntar um equipamento ao pedido: valida, e guarda o item na sessão.
app.post("/pedido/itens", (req, res) => {
  const resultado = validarItem(req.body);
  if (Object.keys(resultado.erros).length > 0) {
    res.status(400).render("item-novo", {
      titulo: "Juntar ao pedido",
      equipamentos: equipamentos,
      valores: resultado.valores,
      erros: resultado.erros,
    });
    return;
  }

  // Da primeira vez, a sessão ainda não tem pedido: começa vazio.
  if (!req.session.pedido) {
    req.session.pedido = [];
  }
  req.session.pedido.push({
    equipamentoId: Number(resultado.valores.equipamento_id),
    data: resultado.valores.data,
    tempo: Number(resultado.valores.tempo),
  });
  res.redirect(303, "/pedido");
});

// Tirar um equipamento do pedido: POST /pedido/itens/2/remocao tira o segundo.
app.post("/pedido/itens/:posicao/remocao", (req, res) => {
  const pedido = req.session.pedido || [];
  const posicao = Number(req.params.posicao);
  if (!Number.isInteger(posicao) || posicao < 1 || posicao > pedido.length) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "Esse equipamento não está no teu pedido.",
    });
    return;
  }
  pedido.splice(posicao - 1, 1);
  res.redirect(303, "/pedido");
});

// Confirmar o pedido: cria uma reserva por equipamento e termina a sessão.
app.post("/pedido/confirmacao", (req, res) => {
  const pedido = req.session.pedido || [];
  if (pedido.length === 0) {
    res.status(400).render("erro", {
      titulo: "Pedido vazio",
      mensagem: "Não há nada no teu pedido para confirmar.",
    });
    return;
  }

  // Sem corpo lido, o nome fica vazio e a validação devolve a sua mensagem.
  let corpo = req.body;
  if (!corpo) {
    corpo = {};
  }
  const nome = textoDoCampo(corpo.nome);
  const erroNome = erroDoNome(nome);
  if (erroNome !== "") {
    res.status(400).render("pedido", { titulo: "O teu pedido", linhas: linhasDoPedido(pedido), valorNome: nome, erroNome: erroNome });
    return;
  }

  for (const item of pedido) {
    reservas.push({
      id: proximoIdReserva,
      equipamentoId: item.equipamentoId,
      data: item.data,
      tempo: item.tempo,
      nome: nome,
    });
    proximoIdReserva = proximoIdReserva + 1;
  }

  // O pedido acabou: a sessão é destruída no servidor, e o cookie apagado no browser.
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível terminar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/reservas");
  });
});

// Cancelar o pedido: termina a sessão sem criar reservas.
app.post("/pedido/cancelamento", (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      res.status(500).render("erro", { titulo: "Erro", mensagem: "Não foi possível cancelar o pedido." });
      return;
    }
    res.clearCookie(NOME_DO_COOKIE);
    res.redirect(303, "/");
  });
});

// A lista das reservas feitas desde que o servidor arrancou.
app.get("/reservas", (req, res) => {
  // Para cada reserva, junta-se o equipamento, para a página mostrar o nome.
  const linhas = [];
  for (const reserva of reservas) {
    const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
    linhas.push({ reserva: reserva, equipamento: equipamento });
  }
  res.render("reservas", { titulo: "Reservas", linhas: linhas });
});

// Uma reserva: a página para onde o browser vai depois de reservar.
app.get("/reservas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).render("erro", {
      titulo: "Pedido inválido",
      mensagem: "O número da reserva tem de ser um número inteiro positivo.",
    });
    return;
  }
  const reserva = reservas.find((reserva) => reserva.id === id);
  if (!reserva) {
    res.status(404).render("erro", {
      titulo: "Reserva não encontrada",
      mensagem: `Não existe a reserva ${id}.`,
    });
    return;
  }
  const equipamento = equipamentos.find((equipamento) => equipamento.id === reserva.equipamentoId);
  res.render("reserva", { titulo: `Reserva ${reserva.id}`, reserva: reserva, equipamento: equipamento });
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).render("erro", {
    titulo: "Página não encontrada",
    mensagem: "Este endereço não existe no catálogo.",
  });
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Servidor a correr em http://localhost:${PORTA}`);
});
