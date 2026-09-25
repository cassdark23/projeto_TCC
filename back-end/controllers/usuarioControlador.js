const Usuario = require("../models/usuario.js");

async function criarUsuario(req, res) {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarUsuarios(req, res) {
  try {
    const dados = await Usuario.findAll();
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarUsuarioPorId(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado vivo" });
    }

    res.status(200).json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function consultarUsuarioPorCpf(req, res) {
  const cpf = req.params.cpf
  try {
    const usuario = await Usuario.findOne({where: {cpf: cpf}});
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado vivo" });
    }

    res.status(200).json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function editarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado vivo" });
    }

    await usuario.update(req.body);
    res.status(200).json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function excluirUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado vivo" });
    }

    await usuario.destroy();
    res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return req.status(400).json({ erro: "Não autenticado" });
    }

    if (senha != usuario.senha) {
      return res.status(400).json({ erro: "Não autenticado" });
    }

    res.status(200).json({usuario:usuario});
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  criarUsuario,
  consultarUsuarios,
  consultarUsuarioPorId,
  consultarUsuarioPorCpf,
  editarUsuario,
  excluirUsuario,
  loginUsuario,
};
