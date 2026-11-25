// src/rotas/paginas.rotas.js: que pedido das páginas do jogo vai para que função do controller.
// Este router é montado na raiz, em server.js, e por isso cada caminho é o
// endereço todo, como "/" para a página inicial.
import express from "express";
import { mostrarInicio, mostrarCena, fazerEscolha, mostrarNovaCena, criarNovaCena } from "../controllers/paginas.controller.js";

const router = express.Router();

router.get("/", mostrarInicio);
// O caminho fixo vem antes do caminho com parâmetro. Ao contrário, o "nova"
// de /cenas/nova encaixava no :codigo, e o pedido ia para a mostrarCena.
router.get("/cenas/nova", mostrarNovaCena);
router.get("/cenas/:codigo", mostrarCena);
router.get("/cenas/:codigo/escolhas/:numero", fazerEscolha);
router.post("/cenas", criarNovaCena);

export default router;
