const ProfissionalEspecialidade = require("../models/profissionalEspecialidade.js");

async function vincularEspecialidade(req, res) {
  try {
    const vínculo = await ProfissionalEspecialidade.create(req.body);
    res.status(201).json(vínculo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarVinculos(req, res) {
  try {
    const dados = await ProfissionalEspecialidade.findAll();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarEspecialidadesPorProfissional(req, res) {
  const idProfissional = req.params.id_profissional;
  try {
    const dados = await ProfissionalEspecialidade.findAll({
      where: { id_profissional: idProfissional },
    });
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function desvincularEspecialidade(req, res) {
  const { id_profissional, id_especialidade } = req.params;
  try {
    const vinculo = await ProfissionalEspecialidade.findOne({
      where: {
        id_profissional: id_profissional,
        id_especialidade: id_especialidade,
      },
    });

    if (!vinculo) {
      return res.status(404).json({ erro: "Vínculo não encontrado" });
    }

    await vinculo.destroy();
    res.status(200).json({ mensagem: "Vínculo removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  vincularEspecialidade,
  consultarVinculos,
  consultarEspecialidadesPorProfissional,
  desvincularEspecialidade,
};