const express = require("express");
const roteador = express.Router();

const profissionalControlador = require("../controllers/profissionalControlador");

roteador.get("/profissionais", profissionalControlador.consultarProfissionais);
roteador.get("/profissionais/:id", profissionalControlador.consultarProfissionalPorId);
roteador.get("/profissionais/usuario/:id_usuario", profissionalControlador.consultarProfissionalPorIdUsuario);
roteador.post("/profissionais", profissionalControlador.criarProfissional);
roteador.put("/profissionais/:id", profissionalControlador.editarProfissional);
roteador.delete("/profissionais/:id", profissionalControlador.excluirProfissional);

module.exports = roteador;