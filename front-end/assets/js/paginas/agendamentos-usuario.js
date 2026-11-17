const API = 'http://localhost:3000/api';

// Elementos do HTML
const filtroData = document.querySelector('#filtro-data');
const filtroStatus = document.querySelector('#filtro-status');
const tabelaAgendamentos = document.querySelector('#tabela-agendamentos');
const listaAgendamentos = document.querySelector('#lista-agendamentos');
const mensagemAgendamentos = document.querySelector('#mensagem-agendamentos');

// Usuário logado
const usuarioSalvo = localStorage.getItem('usuario');
const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

// Dados carregados da API
let agendamentos = [];

const CLASSE_STATUS = {
  AGENDADO: 'status-agendado',
  CANCELADO: 'status-cancelado',
  CONCLUIDO: 'status-concluido',
};

const TEXTO_STATUS = {
  AGENDADO: 'Agendado',
  CANCELADO: 'Cancelado',
  CONCLUIDO: 'Concluído',
};

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function converterHoraParaMinutos(hora) {
  const partes = String(hora ?? '').split(':');

  return Number(partes[0]) * 60 + Number(partes[1]);
}

function mostrarMensagem(texto, erro = false) {
  mensagemAgendamentos.textContent = texto;
  mensagemAgendamentos.classList.toggle('erro', erro);
}

// Valor = valor_hora x duração (hora_fim - hora_inicio)
function calcularValor(agendamento) {
  const valorHora = Number(agendamento.servico?.valor_hora ?? 0);
  const minutos =
    converterHoraParaMinutos(agendamento.hora_fim) -
    converterHoraParaMinutos(agendamento.hora_inicio);

  if (!valorHora || Number.isNaN(minutos) || minutos <= 0) {
    return 0;
  }

  return (valorHora * minutos) / 60;
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function iniciarPagina() {
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  await carregarAgendamentos();
}

// ==========================================
// CARREGAR AGENDAMENTOS DO USUÁRIO
// ==========================================

async function carregarAgendamentos() {
  mostrarMensagem('Carregando agendamentos...');

  try {
    const resposta = await fetch(`${API}/agendamentos/usuario/${usuario.id_usuario}`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar agendamentos.');
    }

    agendamentos = await resposta.json();

    renderizarAgendamentos();
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro);

    agendamentos = [];
    listaAgendamentos.innerHTML = '';
    tabelaAgendamentos.hidden = true;

    mostrarMensagem('Não foi possível carregar seus agendamentos.', true);
  }
}

// ==========================================
// APLICAR FILTROS E RENDERIZAR A TABELA
// ==========================================

function renderizarAgendamentos() {
  const statusSelecionado = filtroStatus.value;
  const dataSelecionada = filtroData.value;

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    const correspondeStatus = !statusSelecionado || agendamento.status === statusSelecionado;

    const dataAgendamento = String(agendamento.data ?? '').slice(0, 10);
    const correspondeData = !dataSelecionada || dataAgendamento === dataSelecionada;

    return correspondeStatus && correspondeData;
  });

  listaAgendamentos.innerHTML = '';

  if (agendamentosFiltrados.length === 0) {
    tabelaAgendamentos.hidden = true;

    mostrarMensagem(
      agendamentos.length === 0
        ? 'Você ainda não possui agendamentos.'
        : 'Nenhum agendamento encontrado para os filtros selecionados.',
    );

    return;
  }

  agendamentosFiltrados.forEach((agendamento) => {
    listaAgendamentos.appendChild(criarLinhaAgendamento(agendamento));
  });

  tabelaAgendamentos.hidden = false;
  mostrarMensagem(`${agendamentosFiltrados.length} agendamento(s) encontrado(s).`);
}

// ==========================================
// CRIAR LINHA DA TABELA
// ==========================================

function criarCelula(conteudo) {
  const celula = document.createElement('td');
  celula.textContent = conteudo;

  return celula;
}

function criarLinhaAgendamento(agendamento) {
  const linha = document.createElement('tr');
  linha.dataset.id = agendamento.id_agendamento;

  const nomeServico = agendamento.servico?.nome ?? '-';
  const nomeProfissional = agendamento.profissional?.usuario?.nome ?? '-';

  const data = String(agendamento.data ?? '').slice(0, 10);
  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';

  const inicio = String(agendamento.hora_inicio ?? '').slice(0, 5);
  const fim = String(agendamento.hora_fim ?? '').slice(0, 5);
  const horario = inicio && fim ? `${inicio} - ${fim}` : inicio || '-';

  const valorFormatado = calcularValor(agendamento).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const status = agendamento.status ?? '';

  linha.appendChild(criarCelula(dataFormatada));
  linha.appendChild(criarCelula(horario));
  linha.appendChild(criarCelula(nomeServico));
  linha.appendChild(criarCelula(nomeProfissional));
  linha.appendChild(criarCelula(valorFormatado));

  // Coluna de status
  const celulaStatus = document.createElement('td');
  const etiquetaStatus = document.createElement('span');

  etiquetaStatus.classList.add('status');

  if (CLASSE_STATUS[status]) {
    etiquetaStatus.classList.add(CLASSE_STATUS[status]);
  }

  etiquetaStatus.textContent = TEXTO_STATUS[status] ?? (status || '-');

  celulaStatus.appendChild(etiquetaStatus);
  linha.appendChild(celulaStatus);

  // Coluna de ação
  const celulaAcao = document.createElement('td');

  if (status === 'AGENDADO') {
    const botaoCancelar = document.createElement('button');

    botaoCancelar.type = 'button';
    botaoCancelar.className = 'btn-cancelar-agendamento';
    botaoCancelar.textContent = 'Cancelar';
    botaoCancelar.dataset.id = agendamento.id_agendamento;

    celulaAcao.appendChild(botaoCancelar);
  } else {
    celulaAcao.textContent = '-';
    celulaAcao.classList.add('sem-acao');
  }

  linha.appendChild(celulaAcao);

  return linha;
}

// ==========================================
// CANCELAR AGENDAMENTO
// ==========================================

listaAgendamentos.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('.btn-cancelar-agendamento');

  if (!botao) {
    return;
  }

  const idAgendamento = botao.dataset.id;

  if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
    return;
  }

  botao.disabled = true;
  botao.textContent = 'Cancelando...';

  try {
    const resposta = await fetch(`${API}/agendamentos/${idAgendamento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELADO' }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Erro ao cancelar agendamento.');
    }

    // Atualiza o status localmente e re-renderiza sem nova requisição
    const agendamento = agendamentos.find((item) => String(item.id_agendamento) === idAgendamento);

    if (agendamento) {
      agendamento.status = 'CANCELADO';
    }

    renderizarAgendamentos();
  } catch (erro) {
    console.error('Erro ao cancelar agendamento:', erro);
    alert(erro.message || 'Não foi possível cancelar o agendamento.');

    botao.disabled = false;
    botao.textContent = 'Cancelar';
  }
});

// ==========================================
// EVENTOS E INÍCIO
// ==========================================

filtroStatus.addEventListener('change', renderizarAgendamentos);
filtroData.addEventListener('change', renderizarAgendamentos);

iniciarPagina();