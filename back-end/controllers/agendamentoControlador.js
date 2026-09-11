const Agendamento = require("../models/agendamento.js");

async function criarAgendamento(req, res) {
  try {
    const agendamento = await Agendamento.create(req.body);
    res.status(201).json(agendamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentos(req, res) {
  try {
    const dados = await Agendamento.findAll();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentoPorId(req, res) {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.status(200).json(agendamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentosPorUsuario(req, res) {
  const idUsuario = req.params.id_usuario;
  try {
    const dados = await Agendamento.findAll({
      where: { id_usuario: idUsuario },
    });
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentosPorProfissional(req, res) {
  const idProfissional = req.params.id_profissional;
  try {
    const dados = await Agendamento.findAll({
      where: { id_profissional: idProfissional },
    });
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function editarAgendamento(req, res) {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    await agendamento.update(req.body);
    res.status(200).json(agendamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function excluirAgendamento(req, res) {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    await agendamento.destroy();
    res.status(200).json({ mensagem: "Agendamento deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  criarAgendamento,
  consultarAgendamentos,
  consultarAgendamentoPorId,
  consultarAgendamentosPorUsuario,
  consultarAgendamentosPorProfissional,
  editarAgendamento,
  excluirAgendamento,
};