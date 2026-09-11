const Especialidade = require("../models/especialidade.js");

async function criarEspecialidade(req, res) {
  try {
    const especialidade = await Especialidade.create(req.body);
    res.status(201).json(especialidade);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarEspecialidades(req, res) {
  try {
    const dados = await Especialidade.findAll();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarEspecialidadePorId(req, res) {
  try {
    const especialidade = await Especialidade.findByPk(req.params.id);
    if (!especialidade) {
      return res.status(404).json({ erro: "Especialidade não encontrada" });
    }

    res.status(200).json(especialidade);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function editarEspecialidade(req, res) {
  try {
    const especialidade = await Especialidade.findByPk(req.params.id);
    if (!especialidade) {
      return res.status(404).json({ erro: "Especialidade não encontrada" });
    }

    await especialidade.update(req.body);
    res.status(200).json(especialidade);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function excluirEspecialidade(req, res) {
  try {
    const especialidade = await Especialidade.findByPk(req.params.id);
    if (!especialidade) {
      return res.status(404).json({ erro: "Especialidade não encontrada" });
    }

    await especialidade.destroy();
    res.status(200).json({ mensagem: "Especialidade deletada com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  criarEspecialidade,
  consultarEspecialidades,
  consultarEspecialidadePorId,
  editarEspecialidade,
  excluirEspecialidade,
};