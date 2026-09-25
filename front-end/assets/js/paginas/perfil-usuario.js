// Seleção dos elementos do DOM
const form = document.querySelector("#form-perfil");
const cpfInput = document.querySelector("#cpf");
const telefoneInput = document.querySelector("#telefone");
const nomeInput = document.querySelector("#nome");
const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#senha");
const confirmeSenhaInput = document.querySelector("#confirmeSenha");

// URL base da API
const API_URL = "http://localhost:3000/api/usuarios";

// Evento disparado ao carregar a página para buscar os dados do usuário
document.addEventListener("DOMContentLoaded", carregarDadosUsuario);

// Máscara em tempo real para o campo de Telefone
telefoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length > 10) {
    e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  } else if (value.length > 6) {
    e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  } else if (value.length > 2) {
    e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  } else if (value.length > 0) {
    e.target.value = `(${value.slice(0, 2)}`;
  }
});

// Função para carregar os dados do usuário na tela
async function carregarDadosUsuario() {
  try {
    // Recupera a string do localStorage e converte para objeto
    const dadosArmazenados = localStorage.getItem("usuario");
    
    if (!dadosArmazenados) {
      alert("Usuário não está logado!");
      window.location.href = "login.html";
      return;
    }

    const usuarioLogado = JSON.parse(dadosArmazenados);

    // Faz a requisição usando a propriedade exata 'id_usuario'
    const resposta = await fetch(`${API_URL}/${usuarioLogado.id_usuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!resposta.ok) {
      throw new Error("Erro ao carregar dados do servidor.");
    }

    const usuario = await resposta.json();

    // Preenche os campos do HTML com os dados retornados
    nomeInput.value = usuario.nome;
    emailInput.value = usuario.email;
    cpfInput.value = formatarCPF(usuario.cpf);
    telefoneInput.value = formatarTelefone(usuario.telefone);

  } catch (error) {
    alert("Não foi possível carregar os dados do perfil.");
    console.error(error);
  }
}

// Evento de envio do formulário (Salvar Alterações)
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const senha = senhaInput.value;
  const confirmeSenha = confirmeSenhaInput.value;

  // Validação de senha caso o usuário queira alterá-la
  if (senha && senha !== confirmeSenha) {
    alert("As senhas não são iguais!");
    return;
  }

  // Recupera o usuário do localStorage para obter o id_usuario
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  // Cria o objeto com os dados atualizados do formulário
  const usuarioAtualizado = {
    nome: nomeInput.value,
    email: emailInput.value,
    telefone: telefoneInput.value.replace(/\D/g, "") // Remove a máscara para salvar no banco
  };

  // Só envia a senha se ela foi de fato preenchida
  if (senha) {
    usuarioAtualizado.senha = senha;
  }

  try {
    const resposta = await fetch(`${API_URL}/${usuarioLogado.id_usuario}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioAtualizado),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao atualizar perfil!");
    }

    alert("Alterações salvas com sucesso!");

    // Atualiza os dados locais no localStorage para manter a sessão sincronizada
    const novoUsuarioLocal = { ...usuarioLogado, ...usuarioAtualizado };
    localStorage.setItem("usuario", JSON.stringify(novoUsuarioLocal));
    
    // Limpa os campos de senha
    senhaInput.value = "";
    confirmeSenhaInput.value = "";

  } catch (error) {
    alert("Erro ao salvar as alterações do usuário!");
    console.error(error);
  }
});

// Funções para formatar strings visualmente
function formatarCPF(cpf) {
  const limpo = String(cpf).replace(/\D/g, "");
  return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "\$1.\$2.\$3-\$4");
}

function formatarTelefone(tel) {
  const limpo = String(tel).replace(/\D/g, "");
  if (limpo.length === 11) {
    return limpo.replace(/(\d{2})(\d{5})(\d{4})/, "(\$1) \$2-\$3");
  }
  return limpo.replace(/(\d{2})(\d{4})(\d{4})/, "(\$1) \$2-\$3");
}
