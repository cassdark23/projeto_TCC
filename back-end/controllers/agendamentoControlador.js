const {
  Agendamento,
  Servico,
  Usuario,
  Profissional,
} = require("../models/associacoes.js");

const atributosAgendamento = [
  "id_agendamento",
  "data",
  "hora_inicio",
  "hora_fim",
  "status",
  "id_usuario",
  "id_profissional",
  "id_servico",
];

const incluirRelacoes = [
  {
    model: Servico,
    as: "servico",
    attributes: ["id_servico", "nome", "tipo", "valor_hora"],
  },
  {
    model: Usuario,
    as: "usuario",
    attributes: ["id_usuario", "nome", "email"],
  },
  {
    model: Profissional,
    as: "profissional",
    attributes: ["id_profissional", "id_usuario", "status"],
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["id_usuario", "nome"],
      },
    ],
  },
];

const opcoesPadrao = {
  attributes: atributosAgendamento,
  include: incluirRelacoes,
};

const ordenacaoPadrao = [
  ["data", "DESC"],
  ["hora_inicio", "ASC"],
];

async function buscarCompleto(id) {
  return Agendamento.findByPk(id, opcoesPadrao);
}

async function criarAgendamento(req, res) {
  try {
    const criado = await Agendamento.create(req.body);
    const agendamento = await buscarCompleto(criado.id_agendamento);
    res.status(201).json(agendamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentos(req, res) {
  try {
    const dados = await Agendamento.findAll({
      ...opcoesPadrao,
      order: ordenacaoPadrao,
    });
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentoPorId(req, res) {
  try {
    const agendamento = await buscarCompleto(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }
    res.status(200).json(agendamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentosPorUsuario(req, res) {
  try {
    const dados = await Agendamento.findAll({
      ...opcoesPadrao,
      where: { id_usuario: req.params.id_usuario },
      order: ordenacaoPadrao,
    });
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarAgendamentosPorProfissional(req, res) {
  try {
    const dados = await Agendamento.findAll({
      ...opcoesPadrao,
      where: { id_profissional: req.params.id_profissional },
      order: ordenacaoPadrao,
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
    const atualizado = await buscarCompleto(req.params.id);
    res.status(200).json(atualizado);
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