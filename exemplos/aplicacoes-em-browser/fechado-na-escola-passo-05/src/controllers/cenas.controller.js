// src/controllers/cenas.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe a resposta,
// sempre em JSON, como diz o contrato.
import {
  listarCenas,
  obterCena,
  cenaSeguinte,
  criarCena,
  alterarCena,
  apagarCena,
} from "../services/cenas.service.js";

// Os campos que o corpo de um pedido pode trazer, para criar ou alterar uma
// cena. É uma lista fechada: um campo que não esteja aqui é recusado.
const CAMPOS_DE_TEXTO = ["codigo", "titulo", "texto"];

/**
 * Lê do corpo do pedido os campos de uma cena: só os da lista, cada um com o tipo certo.
 * Não verifica os valores, como os comprimentos ou os campos em falta: essas
 * são regras do jogo, e quem as verifica é o schema do modelo.
 * @param {unknown} corpo o req.body, tal como o express.json() o deixou
 * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
 */
function lerCamposDaCena(corpo) {
  // Sem corpo em JSON, o req.body fica undefined.
  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    return { erro: "O corpo do pedido tem de ser um objeto JSON" };
  }
  // O objeto dados recebe só os campos da lista, copiados um a um.
  // O req.body nunca segue inteiro para o service.
  const dados = {};
  for (const campo of Object.keys(corpo)) {
    const valor = corpo[campo];
    if (CAMPOS_DE_TEXTO.includes(campo)) {
      // Um objeto no lugar de um texto, como { "$ne": null }, é recusado aqui.
      if (typeof valor !== "string") {
        return { erro: `O campo ${campo} tem de ser um texto` };
      }
      dados[campo] = valor;
    } else if (campo === "final") {
      if (typeof valor !== "boolean") {
        return { erro: "O campo final tem de ser true ou false" };
      }
      dados.final = valor;
    } else if (campo === "escolhas") {
      if (!Array.isArray(valor)) {
        return { erro: "O campo escolhas tem de ser uma lista" };
      }
      // A lista fechada vale também dentro de cada escolha: só o texto e o
      // destino, os dois em texto. Cada escolha é copiada para um objeto novo.
      const escolhas = [];
      for (const escolha of valor) {
        if (
          typeof escolha !== "object" ||
          escolha === null ||
          Object.keys(escolha).length !== 2 ||
          typeof escolha.texto !== "string" ||
          typeof escolha.destino !== "string"
        ) {
          return { erro: "Cada escolha tem só o texto e o destino, os dois em texto" };
        }
        escolhas.push({ texto: escolha.texto, destino: escolha.destino });
      }
      dados.escolhas = escolhas;
    } else {
      return { erro: `O campo ${campo} não é aceite` };
    }
  }
  return { dados: dados };
}

/** GET /api/cenas */
export async function listar(req, res) {
  const cenas = await listarCenas();
  res.json(cenas);
}

/** GET /api/cenas/:codigo */
export async function obter(req, res) {
  const codigo = req.params.codigo;
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  res.json(cena);
}

/** GET /api/cenas/:codigo/escolhas/:numero */
export async function escolher(req, res) {
  const codigo = req.params.codigo;
  const numero = Number(req.params.numero); // chega como texto, "2", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número da escolha tem de ser um número inteiro maior do que 0" });
    return;
  }
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  const seguinte = await cenaSeguinte(cena, numero);
  if (seguinte === null) {
    res.status(404).json({ erro: `A cena ${codigo} não tem a escolha ${numero}` });
    return;
  }
  res.json(seguinte);
}

/** POST /api/cenas, com a cena nova no corpo, em JSON */
export async function criar(req, res) {
  const leitura = lerCamposDaCena(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  // Se uma regra do schema falhar, o criarCena rejeita a promessa, e o
  // Express passa o erro ao middleware de erros, no server.js, que responde 400.
  const criacao = await criarCena(leitura.dados);
  if (criacao.resultado === "codigo-repetido") {
    res.status(409).json({ erro: `Já existe uma cena com o código ${leitura.dados.codigo}` });
    return;
  }
  if (criacao.resultado === "destino-nao-existe") {
    const escolha = criacao.escolha;
    res.status(409).json({ erro: `A escolha ${escolha.numero} leva à cena ${escolha.destino}, que não existe` });
    return;
  }
  res.status(201).json(criacao.cena);
}

/** PATCH /api/cenas/:codigo, com os campos a alterar no corpo, em JSON */
export async function alterar(req, res) {
  const codigo = req.params.codigo;
  const leitura = lerCamposDaCena(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  // O código identifica a cena, e as escolhas de outras cenas levam a ele.
  // Mudá-lo deixava essas escolhas a levar a uma cena que não existe.
  if (leitura.dados.codigo !== undefined) {
    res.status(400).json({ erro: "O código de uma cena não se altera" });
    return;
  }
  if (Object.keys(leitura.dados).length === 0) {
    res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
    return;
  }
  const alteracao = await alterarCena(codigo, leitura.dados);
  if (alteracao.resultado === "nao-existe") {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  if (alteracao.resultado === "destino-nao-existe") {
    const escolha = alteracao.escolha;
    res.status(409).json({ erro: `A escolha ${escolha.numero} leva à cena ${escolha.destino}, que não existe` });
    return;
  }
  res.json(alteracao.cena);
}

/** DELETE /api/cenas/:codigo */
export async function apagar(req, res) {
  const codigo = req.params.codigo;
  const remocao = await apagarCena(codigo);
  if (remocao.resultado === "nao-existe") {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  if (remocao.resultado === "e-o-inicio") {
    res.status(409).json({ erro: "A cena inicio não se pode apagar, porque é onde a história começa" });
    return;
  }
  if (remocao.resultado === "e-destino") {
    res.status(409).json({ erro: `A cena ${codigo} não se pode apagar, porque uma escolha da cena ${remocao.origem} leva a ela` });
    return;
  }
  // 204: apagada, e a resposta não tem corpo.
  res.status(204).end();
}
