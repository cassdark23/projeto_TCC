const express = require("express");
const roteador = express.Router();

const agendamentoControlador = require("../controllers/agendamentoControlador");

roteador.get("/agendamentos", agendamentoControlador.consultarAgendamentos);
roteador.get("/agendamentos/:id", agendamentoControlador.consultarAgendamentoPorId);
roteador.get("/agendamentos/usuario/:id_usuario", agendamentoControlador.consultarAgendamentosPorUsuario);
roteador.get("/agendamentos/profissional/:id_profissional", agendamentoControlador.consultarAgendamentosPorProfissional);
roteador.post("/agendamentos", agendamentoControlador.criarAgendamento);
roteador.put("/agendamentos/:id", agendamentoControlador.editarAgendamento);
roteador.delete("/agendamentos/:id", agendamentoControlador.excluirAgendamento);

module.exports = roteador;