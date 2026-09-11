const express = require("express");
const roteador = express.Router();

const profissionalEspecialidadeControlador = require("../controllers/profissionalEspecialidadeControlador");

roteador.get("/profissional-especialidade", profissionalEspecialidadeControlador.consultarVinculos);
roteador.get("/profissional-especialidade/profissional/:id_profissional", profissionalEspecialidadeControlador.consultarEspecialidadesPorProfissional);
roteador.post("/profissional-especialidade", profissionalEspecialidadeControlador.vincularEspecialidade);
roteador.delete("/profissional-especialidade/profissional/:id_profissional/especialidade/:id_especialidade", profissionalEspecialidadeControlador.desvincularEspecialidade);

module.exports = roteador;