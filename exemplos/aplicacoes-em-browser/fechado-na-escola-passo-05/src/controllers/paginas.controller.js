// src/controllers/paginas.controller.js: a ponte entre o HTTP e as páginas do jogo.
// Lê e verifica o que vem no pedido, pede as cenas ao mesmo service da API e
// responde com uma página, construída a partir de um modelo da pasta views.
import { listarCenas, obterCena, cenaSeguinte, criarCena } from "../services/cenas.service.js";

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
 * Verifica os campos de uma cena nova vindos do formulário.
 * Só lê os cinco campos previstos; qualquer outro campo é ignorado.
 * Devolve os valores, para voltar a mostrar no formulário, e os erros,
 * com uma mensagem por campo. Sem erros, o objeto dos erros fica vazio.
 * Não verifica o código repetido nem o destino que não existe: essas regras
 * precisam da base de dados, e quem as verifica é o service.
 * @param {object|undefined} corpo o req.body do pedido, que pode não existir
 * @returns {object} um objeto com os valores e os erros
 */
function validarCena(corpo) {
  // Sem corpo lido, todos os campos faltam e recebem os erros já previstos.
  if (!corpo) {
    corpo = {};
  }
  const valores = {
    codigo: textoDoCampo(corpo.codigo),
    titulo: textoDoCampo(corpo.titulo),
    texto: textoDoCampo(corpo.texto),
    escolha_texto: textoDoCampo(corpo.escolha_texto),
    escolha_destino: textoDoCampo(corpo.escolha_destino),
  };
  const erros = {};

  // Os limites são os do contrato. Estão também no schema, no cena.model.js,

  // e nos maxlength do cena-nova.ejs: se um mudar, mudam os três. O schema

  // protege a base, também para a API e para o seed, e esta função dá a

  // mensagem de cada campo a quem preenche.
  if (valores.codigo === "") {
    erros.codigo = "Escreve o código da cena.";
  } else if (valores.codigo.length > 30) {
    erros.codigo = "O código tem, no máximo, 30 carateres.";
  }

  if (valores.titulo === "") {
    erros.titulo = "Escreve o título da cena.";
  } else if (valores.titulo.length > 60) {
    erros.titulo = "O título tem, no máximo, 60 carateres.";
  }

  if (valores.texto === "") {
    erros.texto = "Escreve o texto da cena.";
  } else if (valores.texto.length > 600) {
    erros.texto = "O texto tem, no máximo, 600 carateres.";
  }

  if (valores.escolha_texto === "") {
    erros.escolha_texto = "Escreve o texto da escolha.";
  } else if (valores.escolha_texto.length > 80) {
    erros.escolha_texto = "O texto da escolha tem, no máximo, 80 carateres.";
  }

  if (valores.escolha_destino === "") {
    erros.escolha_destino = "Escolhe a cena para onde a escolha leva.";
  }

  return { valores: valores, erros: erros };
}

/**
 * Responde com a página do formulário de uma cena nova.
 * Pede ao service as cenas da história, que dão as opções do destino da escolha.
 * @param {object} res a resposta do Express
 * @param {number} estado o código de estado da resposta: 200, 400 ou 409
 * @param {object} valores o texto que fica escrito em cada campo
 * @param {object} erros uma mensagem por campo errado, ou {} quando não há erros
 * @returns {Promise<void>} cumprida quando a página foi enviada
 */
async function mostrarFormulario(res, estado, valores, erros) {
  const cenas = await listarCenas();
  res.status(estado).render("cena-nova", {
    titulo: "Nova cena",
    cenas: cenas,
    valores: valores,
    erros: erros,
  });
}

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

/** GET /cenas/nova: o formulário de uma cena nova, com os campos vazios. */
export async function mostrarNovaCena(req, res) {
  const valores = { codigo: "", titulo: "", texto: "", escolha_texto: "", escolha_destino: "" };
  await mostrarFormulario(res, 200, valores, {});
}

/** POST /cenas: cria uma cena com os campos do formulário. */
export async function criarNovaCena(req, res) {
  const resultado = validarCena(req.body);

  // Com erros: o formulário outra vez, com o 400, os valores e as mensagens.
  if (Object.keys(resultado.erros).length > 0) {
    await mostrarFormulario(res, 400, resultado.valores, resultado.erros);
    return;
  }

  // A cena constrói-se campo a campo, só com os valores verificados.
  // O formulário cria sempre uma cena que não é final, com uma escolha.
  const valores = resultado.valores;
  const dados = {
    codigo: valores.codigo,
    titulo: valores.titulo,
    texto: valores.texto,
    final: false,
    escolhas: [{ texto: valores.escolha_texto, destino: valores.escolha_destino }],
  };
  const criacao = await criarCena(dados);

  // As regras que precisam da base respondem 409, como na API: o pedido está
  // bem feito, mas choca com o que já está na base.
  if (criacao.resultado === "codigo-repetido") {
    await mostrarFormulario(res, 409, valores, { codigo: "Já existe uma cena com este código. Escolhe outro." });
    return;
  }
  if (criacao.resultado === "destino-nao-existe") {
    await mostrarFormulario(res, 409, valores, { escolha_destino: "Escolhe uma cena da lista." });
    return;
  }

  // Redirecionamento 303: o browser faz um GET à página da cena nova.
  // Recarregar essa página já não volta a enviar o formulário.
  res.redirect(303, `/cenas/${criacao.cena.codigo}`);
}
