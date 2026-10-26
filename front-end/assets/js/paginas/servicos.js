const API_URL = "http://localhost:3000/api/servicos";

const form = document.querySelector("#form-servico");
const tabelaCorpo = document.querySelector("#lista-servicos");
const inputId = document.querySelector("#servico-id");
const tituloForm = document.querySelector("#titulo-form");
const btnSalvar = document.querySelector("#btn-salvar");
const btnCancelar = document.querySelector("#btn-cancelar");

let servicosLista = [];

// Carrega a lista de serviços do backend
async function carregarServicos() {
  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error("Erro ao carregar lista de serviços.");
    }

    servicosLista = await resposta.json();
    renderizarTabela(servicosLista);
  } catch (error) {
    console.error("Erro no fetch:", error);
    tabelaCorpo.innerHTML = `
      <tr>
        <td colspan="6" class="mensagem-tabela">Erro ao carregar serviços. Verifique se a API está rodando.</td>
      </tr>
    `;
  }
}

// Renderiza as linhas da tabela com o ID correto (id_servico)
function renderizarTabela(servicos) {
  if (!servicos || servicos.length === 0) {
    tabelaCorpo.innerHTML = `
      <tr>
        <td colspan="6" class="mensagem-tabela">Nenhum serviço cadastrado até o momento.</td>
      </tr>
    `;
    return;
  }

  tabelaCorpo.innerHTML = servicos
    .map((s) => {
      // Captura o id_servico retornado do Sequelize
      const idServico = s.id_servico || s.id;

      const valorFormatado = Number(s.valor_hora || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      const statusClasse = s.status ? s.status.toLowerCase() : "inativo";

      return `
        <tr>
          <td><strong>${s.nome}</strong></td>
          <td>${s.tipo}</td>
          <td>${s.capacidade ? `${s.capacidade} pessoas` : "-"}</td>
          <td>${valorFormatado}</td>
          <td>
            <span class="badge-status ${statusClasse}">
              ${s.status}
            </span>
          </td>
          <td>
            <div class="acoes-cell">
              <button type="button" class="btn-acao btn-editar" data-id="${idServico}">Editar</button>
              <button type="button" class="btn-acao btn-excluir" data-id="${idServico}">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

// Delegador de eventos para os cliques na tabela (Editar e Excluir)
tabelaCorpo.addEventListener("click", function (event) {
  const botao = event.target.closest(".btn-acao");
  if (!botao) return;

  const id = botao.getAttribute("data-id");

  if (botao.classList.contains("btn-editar")) {
    prepararEdicao(id);
  } else if (botao.classList.contains("btn-excluir")) {
    excluirServico(id);
  }
});

// Preenche o formulário para edição
function prepararEdicao(id) {
  const servico = servicosLista.find((s) => (s.id_servico || s.id) == id);

  if (!servico) {
    alert("Serviço não encontrado.");
    return;
  }

  inputId.value = servico.id_servico || servico.id;
  document.querySelector("#nome").value = servico.nome || "";
  document.querySelector("#tipo").value = servico.tipo || "";
  document.querySelector("#capacidade").value = servico.capacidade || "";
  document.querySelector("#valor_hora").value = servico.valor_hora || "";
  document.querySelector("#status").value = servico.status || "ATIVO";

  tituloForm.innerText = "Editar Serviço";
  btnSalvar.innerText = "Atualizar Serviço";
  btnCancelar.style.display = "inline-block";

  form.scrollIntoView({ behavior: "smooth" });
}

// Reseta o formulário de volta ao modo de cadastro
function resetarFormulario() {
  inputId.value = "";
  form.reset();
  tituloForm.innerText = "Cadastro de Serviço";
  btnSalvar.innerText = "Cadastrar Serviço";
  btnCancelar.style.display = "none";
}

btnCancelar.addEventListener("click", resetarFormulario);

// Exclusão de serviço na API (DELETE)
async function excluirServico(id) {
  if (!id || id === "undefined") {
    alert("Erro: ID do serviço é inválido.");
    return;
  }

  const confirmou = confirm("Tem certeza que deseja excluir este serviço?");
  if (!confirmou) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error("Falha ao excluir serviço.");
    }

    alert("Serviço excluído com sucesso!");
    carregarServicos();
  } catch (error) {
    console.error("Erro na exclusão:", error);
    alert("Erro ao excluir o serviço!");
  }
}

// Submissão do formulário (Criação ou Atualização)
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = inputId.value;
  const nome = document.querySelector("#nome").value;
  const tipo = document.querySelector("#tipo").value;
  const capacidade = document.querySelector("#capacidade").value;
  const valor_hora = document.querySelector("#valor_hora").value;
  const status = document.querySelector("#status").value;

  const servico = {
    nome,
    tipo,
    capacidade: capacidade ? parseInt(capacidade) : null,
    valor_hora: parseFloat(valor_hora),
    status,
  };

  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  try {
    const resposta = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(servico),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao salvar serviço.");
    }

    alert(id ? "Serviço atualizado com sucesso!" : "Serviço cadastrado com sucesso!");

    resetarFormulario();
    carregarServicos();
  } catch (error) {
    console.error("Erro no salvamento:", error);
    alert("Erro ao salvar o serviço!");
  }
});

document.addEventListener("DOMContentLoaded", carregarServicos);