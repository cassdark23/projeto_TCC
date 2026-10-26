const {
  Profissional,
  Usuario,
  Especialidade,
} = require("../models/associacoes.js");

async function criarProfissional(req, res) {
  try {
    const { id_usuario, id_especialidades, status } = req.body;

    if (!id_usuario || !id_especialidades?.length || !status) {
      return res.status(400).json({ erro: "Preencha todos os campos." });
    }

    const profissional = await Profissional.create({
      id_usuario,
      status,
    });

    await profissional.setEspecialidades(id_especialidades);

    const profissionalCriado = await Profissional.findByPk(
      profissional.id_profissional,
      {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id_usuario", "nome", "email"],
          },
          {
            model: Especialidade,
            as: "especialidades",
            through: { attributes: [] },
          },
        ],
      }
    );

    return res.status(201).json(profissionalCriado);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: erro.message });
  }
}

async function consultarProfissionais(req, res) {
  try {
    const dados = await Profissional.findAll({
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuario", "nome", "email"],
        },
        {
          model: Especialidade,
          as: "especialidades",
          attributes: ["id_especialidade", "nome"],
        },
      ],
    });
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarProfissionalPorId(req, res) {
  try {
    const profissional = await Profissional.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuario", "nome", "email"],
        },
        {
          model: Especialidade,
          as: "especialidades",
          attributes: ["id_especialidade", "nome"],
        },
      ],
    });

    if (!profissional) {
      return res.status(404).json({ erro: "Profissional não encontrado" });
    }

    res.status(200).json(profissional);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarProfissionalPorIdUsuario(req, res) {
  const idUsuario = req.params.id_usuario;
  try {
    const profissional = await Profissional.findOne({
      where: { id_usuario: idUsuario },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuario", "nome", "email"],
        },
        {
          model: Especialidade,
          as: "especialidades",
          attributes: ["id_especialidade", "nome"],
        },
      ],
    });

    if (!profissional) {
      return res.status(404).json({ erro: "Profissional não encontrado" });
    }

    res.status(200).json(profissional);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function editarProfissional(req, res) {
  try {
    const profissional = await Profissional.findByPk(req.params.id);
    if (!profissional) {
      return res.status(404).json({ erro: "Profissional não encontrado" });
    }

    await profissional.update(req.body);

    // Buscamos novamente para retornar atualizado e com os dados do usuário inclusos
    const profissionalAtualizado = await Profissional.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id_usuario", "nome", "email"],
        },
      ],
    });

    res.status(200).json(profissionalAtualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function excluirProfissional(req, res) {
  try {
    const profissional = await Profissional.findByPk(req.params.id);
    if (!profissional) {
      return res.status(404).json({ erro: "Profissional não encontrado" });
    }

    await profissional.destroy();
    res.status(200).json({ mensagem: "Profissional deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  criarProfissional,
  consultarProfissionais,
  consultarProfissionalPorId,
  consultarProfissionalPorIdUsuario,
  editarProfissional,
  excluirProfissional,
};
