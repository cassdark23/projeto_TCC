const API = 'http://localhost:3000/api';

// Regras simples do sistema (ajuste se precisar)
const DURACAO_MINUTOS = 60; // todo serviço dura 1 hora
const HORA_ABERTURA = 8; // 08h
const HORA_FECHAMENTO = 18; // 18h
const STATUS_NOVO_AGENDAMENTO = 'AGENDADO';

// Elementos do HTML
const selectServico = document.querySelector('#servico');
const selectProfissional = document.querySelector('#profissional');
const dataAgendamento = document.querySelector('#data-agendamento');
const campoHoraInicio = document.querySelector('#hora_inicio');
const campoHoraFim = document.querySelector('#hora_fim');
const listaHorarios = document.querySelector('#lista-horarios');
const mensagemHorarios = document.querySelector('#mensagem-horarios');
const formAgendamento = document.querySelector('#form-agendamento');
const linkSair = document.querySelector('#link-sair');

const resumoServico = document.querySelector('#resumo-servico');
const resumoProfissional = document.querySelector('#resumo-profissional');
const resumoData = document.querySelector('#resumo-data');
const resumoHorario = document.querySelector('#resumo-horario');
const resumoValor = document.querySelector('#resumo-valor');
const btnAgendar = document.querySelector('#btn-agendar');

// Dados carregados da API
let servicos = [];
let profissionais = [];
let horarioSelecionado = '';
let consultaAtual = 0; // evita que uma resposta antiga sobrescreva a nova

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function formatarHora(minutos) {
  const horas = Math.floor(minutos / 60);
  const restante = minutos % 60;

  return String(horas).padStart(2, '0') + ':' + String(restante).padStart(2, '0');
}

function converterHoraParaMinutos(hora) {
  // Aceita "08:00" e "08:00:00"
  const partes = hora.split(':');

  return Number(partes[0]) * 60 + Number(partes[1]);
}

function formatarDinheiro(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Data de hoje no formato AAAA-MM-DD usando o fuso local
function obterDataHoje() {
  const hoje = new Date();

  return [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, '0'),
    String(hoje.getDate()).padStart(2, '0'),
  ].join('-');
}

function mostrarMensagem(texto, tipo) {
  mensagemHorarios.textContent = texto;
  mensagemHorarios.classList.remove('erro', 'sucesso');

  if (tipo) {
    mensagemHorarios.classList.add(tipo);
  }
}

// ==========================================
// CARREGAR SERVIÇOS
// ==========================================

async function carregarServicos() {
  try {
    const resposta = await fetch(`${API}/servicos`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar serviços.');
    }

    const todos = await resposta.json();

    // Mostra apenas serviços ativos
    servicos = todos.filter(function (servico) {
      return servico.status === 'ATIVO';
    });

    selectServico.innerHTML = '';
    selectServico.add(new Option('Selecione o serviço', ''));

    servicos.forEach(function (servico) {
      selectServico.add(new Option(servico.nome, servico.id_servico));
    });
  } catch (erro) {
    console.error('Erro ao carregar serviços:', erro);

    selectServico.innerHTML = '';
    selectServico.add(new Option('Erro ao carregar serviços', ''));
    selectServico.disabled = true;
  }
}

// ==========================================
// CARREGAR PROFISSIONAIS
// ==========================================

async function carregarProfissionais() {
  try {
    const resposta = await fetch(`${API}/profissionais`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar profissionais.');
    }

    profissionais = await resposta.json();
  } catch (erro) {
    console.error('Erro ao carregar profissionais:', erro);
    profissionais = [];
  }
}

// ==========================================
// ATUALIZAR LISTA DE PROFISSIONAIS
// ==========================================

function atualizarProfissionais() {
  const idServico = selectServico.value;

  selectProfissional.innerHTML = '';
  selectProfissional.add(new Option('Selecione o profissional', ''));
  selectProfissional.disabled = true;

  if (!idServico) {
    return;
  }

  const servico = servicos.find(function (item) {
    return Number(item.id_servico) === Number(idServico);
  });

  // Todo profissional ativo pode atender o serviço.
  // Se o seu serviço tiver "id_especialidade" e o profissional vier com
  // "especialidades", o filtro por especialidade é aplicado automaticamente.
  const profissionaisFiltrados = profissionais.filter(function (profissional) {
    if (profissional.status !== 'ATIVO') {
      return false;
    }

    if (servico?.id_especialidade && profissional.especialidades) {
      return profissional.especialidades.some(function (especialidade) {
        return Number(especialidade.id_especialidade) === Number(servico.id_especialidade);
      });
    }

    return true;
  });

  if (profissionaisFiltrados.length === 0) {
    selectProfissional.innerHTML = '';
    selectProfissional.add(new Option('Nenhum profissional disponível', ''));
    return;
  }

  profissionaisFiltrados.forEach(function (profissional) {
    const nome = profissional.usuario?.nome || `Profissional ${profissional.id_profissional}`;

    selectProfissional.add(new Option(nome, profissional.id_profissional));
  });

  selectProfissional.disabled = false;
}

// ==========================================
// LIMPAR HORÁRIO SELECIONADO
// ==========================================

function limparHorarioSelecionado() {
  horarioSelecionado = '';
  campoHoraInicio.value = '';
  campoHoraFim.value = '';
}

// ==========================================
// CONSULTAR A API E RENDERIZAR HORÁRIOS
// ==========================================

async function renderizarHorarios() {
  const consulta = ++consultaAtual;

  listaHorarios.innerHTML = '';
  limparHorarioSelecionado();
  atualizarResumo();

  const idServico = selectServico.value;
  const idProfissional = selectProfissional.value;
  const data = dataAgendamento.value;

  if (!idServico || !idProfissional || !data) {
    mostrarMensagem('Selecione o serviço, o profissional e a data.');
    return;
  }

  mostrarMensagem('Consultando horários disponíveis...');

  try {
    const resposta = await fetch(
      `${API}/agendamentos/profissional/${idProfissional}?data=${data}`,
    );

    if (!resposta.ok) {
      throw new Error('Erro ao consultar agendamentos.');
    }

    const agendamentos = await resposta.json();

    // Se o usuário já mudou os dados, descarta esta resposta
    if (consulta !== consultaAtual) {
      return;
    }

    // Horários já ocupados pelo profissional (ignora cancelados)
    const ocupados = agendamentos
      .filter(function (agendamento) {
        return agendamento.status !== 'CANCELADO';
      })
      .map(function (agendamento) {
        return {
          inicio: converterHoraParaMinutos(agendamento.hora_inicio),
          fim: converterHoraParaMinutos(agendamento.hora_fim),
        };
      });

    // Se a data for hoje, horários que já passaram ficam indisponíveis
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
    const dataEhHoje = data === obterDataHoje();

    let quantidadeDisponivel = 0;

    for (
      let inicio = HORA_ABERTURA * 60;
      inicio + DURACAO_MINUTOS <= HORA_FECHAMENTO * 60;
      inicio += 60
    ) {
      const fim = inicio + DURACAO_MINUTOS;

      const conflito = ocupados.some(function (agendamento) {
        return inicio < agendamento.fim && fim > agendamento.inicio;
      });

      const jaPassou = dataEhHoje && inicio <= minutosAgora;
      const indisponivel = conflito || jaPassou;

      const horarioInicio = formatarHora(inicio);
      const horarioFim = formatarHora(fim);

      const linha = document.createElement('tr');

      const colunaHorario = document.createElement('td');
      colunaHorario.textContent = `${horarioInicio} - ${horarioFim}`;

      const colunaStatus = document.createElement('td');
      colunaStatus.textContent = conflito ? 'Ocupado' : jaPassou ? 'Encerrado' : 'Disponível';
      colunaStatus.className = indisponivel ? 'status-ocupado' : 'status-disponivel';

      const colunaAcao = document.createElement('td');

      if (indisponivel) {
        colunaAcao.textContent = '-';
      } else {
        const botao = document.createElement('button');

        botao.type = 'button';
        botao.className = 'horario';
        botao.dataset.inicio = horarioInicio;
        botao.dataset.fim = horarioFim;
        botao.textContent = 'Selecionar';

        colunaAcao.appendChild(botao);
        quantidadeDisponivel++;
      }

      linha.appendChild(colunaHorario);
      linha.appendChild(colunaStatus);
      linha.appendChild(colunaAcao);

      listaHorarios.appendChild(linha);
    }

    mostrarMensagem(
      quantidadeDisponivel > 0
        ? 'Selecione um horário disponível.'
        : 'Não há horários disponíveis para esta data.',
    );
  } catch (erro) {
    if (consulta !== consultaAtual) {
      return;
    }

    console.error('Erro ao carregar horários:', erro);

    listaHorarios.innerHTML = '';
    mostrarMensagem('Não foi possível consultar os horários. Tente novamente.', 'erro');
  }
}

// ==========================================
// ATUALIZAR RESUMO
// ==========================================

function atualizarResumo() {
  resumoServico.textContent = selectServico.value
    ? selectServico.selectedOptions[0].textContent
    : 'Não selecionado';

  resumoProfissional.textContent = selectProfissional.value
    ? selectProfissional.selectedOptions[0].textContent
    : 'Não selecionado';

  resumoData.textContent = dataAgendamento.value
    ? dataAgendamento.value.split('-').reverse().join('/')
    : 'Não selecionada';

  resumoHorario.textContent = horarioSelecionado
    ? `${horarioSelecionado} - ${campoHoraFim.value}`
    : 'Não selecionado';

  // Valor = valor_hora x duração (em horas)
  const servico = servicos.find(function (item) {
    return Number(item.id_servico) === Number(selectServico.value);
  });

  resumoValor.textContent = servico
    ? formatarDinheiro((Number(servico.valor_hora) * DURACAO_MINUTOS) / 60)
    : 'Não calculado';

  // Só libera o botão quando tudo estiver preenchido
  btnAgendar.disabled = !(
    selectServico.value &&
    selectProfissional.value &&
    dataAgendamento.value &&
    horarioSelecionado
  );
}

// ==========================================
// CRIAR AGENDAMENTO
// ==========================================

async function criarAgendamento(event) {
  event.preventDefault();

  const usuarioSalvo = localStorage.getItem('usuario');

  if (!usuarioSalvo) {
    alert('Você precisa estar logado para realizar um agendamento.');
    window.location.href = 'login.html';
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  const dadosAgendamento = {
    data: dataAgendamento.value,
    hora_inicio: campoHoraInicio.value,
    hora_fim: campoHoraFim.value,
    status: STATUS_NOVO_AGENDAMENTO,
    id_usuario: Number(usuario.id_usuario),
    id_profissional: Number(selectProfissional.value),
    id_servico: Number(selectServico.value),
  };

  btnAgendar.disabled = true;
  btnAgendar.textContent = 'Agendando...';

  try {
    const resposta = await fetch(`${API}/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAgendamento),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Erro ao criar agendamento.');
    }

    alert("agendamento criado com sucesso!")
    console.log(resultado)
    // Vai para a tela de pagamento levando o id do agendamento
    // window.location.href = `pagamento.html?id_agendamento=${resultado.id_agendamento}`;
  } catch (erro) {
    console.error('Erro ao criar agendamento:', erro);
    mostrarMensagem(erro.message || 'Não foi possível realizar o agendamento.', 'erro');

    btnAgendar.textContent = 'Confirmar agendamento';

    // Recarrega a lista (o horário pode ter sido ocupado por outra pessoa)
    await renderizarHorarios();
  }
}

// ==========================================
// EVENTOS
// ==========================================

// Clique em "Selecionar" na tabela de horários
listaHorarios.addEventListener('click', function (event) {
  const botao = event.target.closest('button.horario');

  if (!botao) {
    return;
  }

  horarioSelecionado = botao.dataset.inicio;
  campoHoraInicio.value = botao.dataset.inicio;
  campoHoraFim.value = botao.dataset.fim;

  // Remove a seleção anterior
  listaHorarios.querySelectorAll('.horario').forEach(function (botaoHorario) {
    botaoHorario.classList.remove('selecionado');
    botaoHorario.textContent = 'Selecionar';
  });

  // Marca o horário escolhido
  botao.classList.add('selecionado');
  botao.textContent = 'Selecionado';

  atualizarResumo();
  mostrarMensagem(`Horário selecionado: ${botao.dataset.inicio} - ${botao.dataset.fim}`, 'sucesso');
});

selectServico.addEventListener('change', function () {
  atualizarProfissionais();
  renderizarHorarios();
});

selectProfissional.addEventListener('change', renderizarHorarios);

dataAgendamento.addEventListener('change', renderizarHorarios);

formAgendamento.addEventListener('submit', criarAgendamento);

// Sair: limpa o usuário salvo
linkSair.addEventListener('click', function () {
  localStorage.removeItem('usuario');
});

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

async function inicializarPagina() {
  // Quem não está logado volta para o login
  if (!localStorage.getItem('usuario')) {
    window.location.href = 'login.html';
    return;
  }

  // Não permite escolher datas passadas
  dataAgendamento.min = obterDataHoje();

  selectProfissional.disabled = true;

  await Promise.all([carregarServicos(), carregarProfissionais()]);

  atualizarProfissionais();
  atualizarResumo();
}

inicializarPagina();