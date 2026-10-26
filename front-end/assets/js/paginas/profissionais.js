const form = document.querySelector("form");

const usuario = document.querySelector("#usuario");
const status = document.querySelector("#status");

const tabelaProfissionais = document.querySelector("#tabela-profissionais");

const modalEdicao = document.querySelector("#modal-edicao");
const formEdicao = document.querySelector("#form-edicao");
const btnCancelar = document.querySelector("#btn-cancelar");

const editarUsuario = document.querySelector("#editar-usuario");
const editarStatus = document.querySelector("#editar-status");

// Containers dos checkboxes
const containerEspecialidades = document.querySelector(
  "#especialidades-container"
);

const containerEditarEspecialidades = document.querySelector(
  "#editar-especialidades-container"
);

let listaEspecialidades = [];

// ==================================================
// CARREGAR USUÁRIOS
// ==================================================

async function carregarUsuarios() {
  try {
    const resposta = await fetch("http://localhost:3000/api/usuarios");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar usuários.");
    }

    const dadosUsuarios = await resposta.json();

    const profissionais = dadosUsuarios.filter(
      (usuarioItem) => usuarioItem.tipo === "PROFISSIONAL"
    );

    usuario.innerHTML = '<option value="">Selecione o usuário</option>';
    editarUsuario.innerHTML = '<option value="">Selecione o usuário</option>';

    profissionais.forEach((profissional) => {
      const nome =
        profissional.nome ||
        (profissional.usuario && profissional.usuario.nome);

      usuario.add(new Option(nome, profissional.id_usuario));

      editarUsuario.add(new Option(nome, profissional.id_usuario));
    });
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível carregar os usuários.");
  }
}

// ==================================================
// CRIAR CHECKBOXES DE ESPECIALIDADES
// ==================================================

function criarCheckboxes(container, especialidades, selecionadas = []) {
  container.innerHTML = "";

  if (especialidades.length === 0) {
    container.textContent = "Nenhuma especialidade encontrada.";
    return;
  }

  especialidades.forEach((item) => {
    const id = String(item.id_especialidade);

    const label = document.createElement("label");
    label.classList.add("checkbox-especialidade");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "id_especialidades";
    checkbox.value = id;

    // Marca as especialidades que já pertencem ao profissional
    checkbox.checked = selecionadas.map(String).includes(id);

    const texto = document.createElement("span");
    texto.textContent = item.nome;

    label.appendChild(checkbox);
    label.appendChild(texto);

    container.appendChild(label);
  });
}

// Retorna os IDs de todos os checkboxes selecionados
function obterEspecialidadesSelecionadas(container) {
  console.log(container);
  return Array.from(
    container.querySelectorAll('input[name="id_especialidades"]:checked')
  ).map((checkbox) => {
    return checkbox.value;
  });
}

// ==================================================
// CARREGAR ESPECIALIDADES
// ==================================================

async function carregarEspecialidades() {
  try {
    const resposta = await fetch("http://localhost:3000/api/especialidades");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar especialidades.");
    }

    listaEspecialidades = await resposta.json();

    // Checkboxes do cadastro
    criarCheckboxes(containerEspecialidades, listaEspecialidades);

    // Checkboxes da edição
    criarCheckboxes(containerEditarEspecialidades, listaEspecialidades);
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível carregar as especialidades.");
  }
}

// ==================================================
// CARREGAR PROFISSIONAIS
// ==================================================

async function carregarProfissionais() {
  try {
    const resposta = await fetch("http://localhost:3000/api/profissionais");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar profissionais.");
    }

    const profissionais = await resposta.json();

    tabelaProfissionais.innerHTML = "";

    profissionais.forEach((profissional) => {
      const linha = document.createElement("tr");

      const nomeUsuario = profissional.usuario
        ? profissional.usuario.nome
        : "-";

      const especialidades = profissional.especialidades || [];

      const nomeEspecialidades =
        especialidades.length > 0
          ? especialidades.map((item) => item.nome).join(", ")
          : "-";

      const idsEspecialidades = especialidades
        .map((item) => item.id_especialidade)
        .join(",");

      linha.innerHTML = `
        <td>${profissional.id_profissional}</td>
        <td></td>
        <td></td>
        <td>${profissional.status}</td>
        <td>
          <button
            type="button"
            class="btn-editar"
            data-id="${profissional.id_profissional}"
            data-usuario="${profissional.id_usuario}"
            data-especialidades="${idsEspecialidades}"
            data-status="${profissional.status}"
          >
            Editar
          </button>

          <button
            type="button"
            class="btn-excluir"
            data-id="${profissional.id_profissional}"
          >
            Excluir
          </button>
        </td>
      `;

      // Insere os nomes como texto
      linha.children[1].textContent = nomeUsuario;
      linha.children[2].textContent = nomeEspecialidades;

      tabelaProfissionais.appendChild(linha);
    });
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível carregar os profissionais.");
  }
}

// ==================================================
// CADASTRAR PROFISSIONAL
// ==================================================

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const idUsuario = usuario.value;

  const idsEspecialidades = obterEspecialidadesSelecionadas(
    containerEspecialidades
  );

  const statusProfissional = status.value;

  if (!idUsuario) {
    alert("Selecione um usuário.");
    return;
  }

  if (idsEspecialidades.length === 0) {
    alert("Selecione pelo menos uma especialidade.");
    return;
  }

  const profissional = {
    id_usuario: idUsuario,
    id_especialidades: idsEspecialidades,
    status: statusProfissional,
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/profissionais", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profissional),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar profissional.");
    }

    alert("Profissional cadastrado com sucesso!");

    form.reset();

    criarCheckboxes(containerEspecialidades, listaEspecialidades);

    await carregarProfissionais();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível cadastrar o profissional.");
  }
});

// ==================================================
// EVENTOS DA TABELA
// ==================================================

tabelaProfissionais.addEventListener("click", function (event) {
  const botao = event.target.closest("button");

  if (!botao) return;

  if (botao.classList.contains("btn-editar")) {
    editarProfissional(botao);
  }

  if (botao.classList.contains("btn-excluir")) {
    excluirProfissional(botao);
  }
});

// ==================================================
// EDITAR PROFISSIONAL
// ==================================================

function editarProfissional(botao) {
  const idProfissional = botao.dataset.id;
  const idUsuario = botao.dataset.usuario;

  const idsEspecialidades = botao.dataset.especialidades
    ? botao.dataset.especialidades.split(",")
    : [];

  const statusProfissional = botao.dataset.status;

  document.querySelector("#editar-id").value = idProfissional;

  editarUsuario.value = idUsuario;
  editarStatus.value = statusProfissional;

  // Marca os checkboxes das especialidades atuais
  criarCheckboxes(
    containerEditarEspecialidades,
    listaEspecialidades,
    idsEspecialidades
  );

  modalEdicao.style.display = "flex";

  formEdicao.onsubmit = async function (event) {
    event.preventDefault();

    const novoIdUsuario = editarUsuario.value;

    const novasEspecialidades = obterEspecialidadesSelecionadas(
      containerEditarEspecialidades
    );

    if (!novoIdUsuario) {
      alert("Selecione um usuário.");
      return;
    }

    if (novasEspecialidades.length === 0) {
      alert("Selecione pelo menos uma especialidade.");
      return;
    }

    const dadosAtualizados = {
      id_usuario: novoIdUsuario,
      id_especialidades: novasEspecialidades,
      status: editarStatus.value,
    };

    try {
      const resposta = await fetch(
        `http://localhost:3000/api/profissionais/${idProfissional}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosAtualizados),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar profissional.");
      }

      alert("Profissional atualizado com sucesso!");

      modalEdicao.style.display = "none";

      await carregarProfissionais();
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível atualizar o profissional.");
    }
  };
}

// ==================================================
// FECHAR MODAL
// ==================================================

btnCancelar.addEventListener("click", function () {
  modalEdicao.style.display = "none";
});

modalEdicao.addEventListener("click", function (event) {
  if (event.target === modalEdicao) {
    modalEdicao.style.display = "none";
  }
});

// ==================================================
// EXCLUIR PROFISSIONAL
// ==================================================

async function excluirProfissional(botao) {
  const idProfissional = botao.dataset.id;

  const confirmar = confirm("Deseja realmente excluir este profissional?");

  if (!confirmar) return;

  try {
    const resposta = await fetch(
      `http://localhost:3000/api/profissionais/${idProfissional}`,
      {
        method: "DELETE",
      }
    );

    if (!resposta.ok) {
      throw new Error("Erro ao excluir profissional.");
    }

    alert("Profissional excluído com sucesso!");

    await carregarProfissionais();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível excluir o profissional.");
  }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

async function inicializar() {
  await Promise.all([carregarUsuarios(), carregarEspecialidades()]);

  await carregarProfissionais();
}

inicializar();
