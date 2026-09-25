const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  
  const nome = document.querySelector("#nome").value;
  const tipo = document.querySelector("#tipo").value;
  const capacidade = document.querySelector("#capacidade").value;
  const valor_hora = document.querySelector("#valor_hora").value;
  const status = document.querySelector("#status").value; // Captura o Ativo ou Inativo

  // Monta o objeto seguindo exatamente os atributos do seu Model do Sequelize
  const servico = {
    nome: nome,
    tipo: tipo,
    capacidade: capacidade ? parseInt(capacidade) : null,
    valor_hora: parseFloat(valor_hora),
    status: status
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/servicos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(servico),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar serviço!");
    }
    
    alert("Serviço cadastrado com sucesso!");
    
    // Redireciona para a página inicial após o sucesso
    window.location.href = "index.html"; 
  } catch (error) {
    alert("Erro ao cadastrar serviço!");
  }
});
