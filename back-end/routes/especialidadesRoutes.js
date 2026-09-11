const express = require("express");
const roteador = express.Router();

const especialidadeControlador = require("../controllers/especialidadeControlador");

roteador.get("/especialidades", especialidadeControlador.consultarEspecialidades);
roteador.get("/especialidades/:id", especialidadeControlador.consultarEspecialidadePorId);
roteador.post("/especialidades", especialidadeControlador.criarEspecialidade);
roteador.put("/especialidades/:id", especialidadeControlador.editarEspecialidade);
roteador.delete("/especialidades/:id", especialidadeControlador.excluirEspecialidade);

module.exports = roteador;