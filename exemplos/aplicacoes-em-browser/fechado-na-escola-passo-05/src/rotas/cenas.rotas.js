// src/rotas/cenas.rotas.js: que pedido da API das cenas vai para que função do controller.
// Os caminhos são relativos ao sítio onde este router é montado, em server.js:
// "/" quer dizer /api/cenas, e "/:codigo" quer dizer /api/cenas/:codigo.
import express from "express";
import { listar, obter, escolher, criar, alterar, apagar } from "../controllers/cenas.controller.js";

const router = express.Router();

router.get("/", listar);
router.get("/:codigo", obter);
router.get("/:codigo/escolhas/:numero", escolher);
router.post("/", criar);
router.patch("/:codigo", alterar);
router.delete("/:codigo", apagar);

export default router;
