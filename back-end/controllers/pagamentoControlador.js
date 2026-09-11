const Pagamento = require("../models/pagamentos.js");

async function criarPagamento(req, res) {
  try {
    const pagamento = await Pagamento.create(req.body);
    res.status(201).json(pagamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarPagamentos(req, res) {
  try {
    const dados = await Pagamento.findAll();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarPagamentoPorId(req, res) {
  try {
    const pagamento = await Pagamento.findByPk(req.params.id);
    if (!pagamento) {
      return res.status(404).json({ erro: "Pagamento não encontrado" });
    }

    res.status(200).json(pagamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarPagamentoPorAgendamento(req, res) {
  const idAgendamento = req.params.id_agendamento;
  try {
    const pagamento = await Pagamento.findOne({
      where: { id_agendamento: idAgendamento },
    });
    if (!pagamento) {
      return res.status(404).json({ erro: "Pagamento não encontrado" });
    }

    res.status(200).json(pagamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function editarPagamento(req, res) {
  try {
    const pagamento = await Pagamento.findByPk(req.params.id);
    if (!pagamento) {
      return res.status(404).json({ erro: "Pagamento não encontrado" });
    }

    await pagamento.update(req.body);
    res.status(200).json(pagamento);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function excluirPagamento(req, res) {
  try {
    const pagamento = await Pagamento.findByPk(req.params.id);
    if (!pagamento) {
      return res.status(404).json({ erro: "Pagamento não encontrado" });
    }

    await pagamento.destroy();
    res.status(200).json({ mensagem: "Pagamento deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  criarPagamento,
  consultarPagamentos,
  consultarPagamentoPorId,
  consultarPagamentoPorAgendamento,
  editarPagamento,
  excluirPagamento,
};