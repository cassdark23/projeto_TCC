const express = require("express");
const roteador = express.Router();

const pagamentoControlador = require("../controllers/pagamentoControlador");

roteador.get("/pagamentos", pagamentoControlador.consultarPagamentos);
roteador.get("/pagamentos/:id", pagamentoControlador.consultarPagamentoPorId);
roteador.get("/pagamentos/agendamento/:id_agendamento", pagamentoControlador.consultarPagamentoPorAgendamento);
roteador.post("/pagamentos", pagamentoControlador.criarPagamento);
roteador.put("/pagamentos/:id", pagamentoControlador.editarPagamento);
roteador.delete("/pagamentos/:id", pagamentoControlador.excluirPagamento);

module.exports = roteador;