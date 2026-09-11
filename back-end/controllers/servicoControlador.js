const Servico = require("../models/servico.js");

async function criarServico(req, res) {
  try {
    const servico = await Servico.create(req.body);
    res.status(201).json(servico);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarServicos(req, res) {
  try {
    const dados = await Servico.findAll();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarServicoPorId(req, res) {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    res.status(200).json(servico);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarServicoPorNome(req, res) {
  const nome = req.params.nome;
  try {
    const servico = await Servico.findOne({ where: { nome: nome } });
    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    res.status(200).json(servico);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function editarServico(req, res) {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    await servico.update(req.body);
    res.status(200).json(servico);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function excluirServico(req, res) {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    await servico.destroy();
    res.status(200).json({ mensagem: "Serviço deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  criarServico,
  consultarServicos,
  consultarServicoPorId,
  consultarServicoPorNome,
  editarServico,
  excluirServico,
};