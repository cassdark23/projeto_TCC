const API = 'http://localhost:3000/api';
const QUANTIDADE_ITENS = 3;

// Elementos do HTML
const saudacaoUsuario = document.querySelector('#saudacao-usuario');

const mensagemProximos = document.querySelector('#mensagem-proximos');
const listaProximos = document.querySelector('#lista-proximos');

const mensagemRecentes = document.querySelector('#mensagem-recentes');
const listaRecentes = document.querySelector('#lista-recentes');

const mensagemServicos = document.querySelector('#mensagem-servicos');
const listaServicos = document.querySelector('#lista-servicos');

// Usuário logado
const usuarioSalvo = localStorage.getItem('usuario');
const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

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

function formatarDinheiro(valor) {
  return Number(valor ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Data de hoje (AAAA-MM-DD) no fuso local
function obterDataHoje() {
  const hoje = new Date();

  return [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, '0'),
    String(hoje.getDate()).padStart(2, '0'),
  ].join('-');
}

function obterHoraAgora() {
  const agora = new Date();

  return (
    String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0')
  );
}

function pegarData(agendamento) {
  return String(agendamento.data ?? '').slice(0, 10);
}

function pegarHora(hora) {
  return String(hora ?? '').slice(0, 5);
}

// Ordena por data e depois por hora de início
function compararPorDataHora(a, b) {
  const chaveA = pegarData(a) + ' ' + pegarHora(a.hora_inicio);
  const chaveB = pegarData(b) + ' ' + pegarHora(b.hora_inicio);

  return chaveA.localeCompare(chaveB);
}

// Um agendamento é "próximo" se está AGENDADO e ainda não terminou
function ehProximo(agendamento, hoje, horaAgora) {
  if (agendamento.status !== 'AGENDADO') {
    return false;
  }

  const data = pegarData(agendamento);
  const horaFim = pegarHora(agendamento.hora_fim) || pegarHora(agendamento.hora_inicio);

  return data > hoje || (data === hoje && horaFim > horaAgora);
}

function mostrarLista(mensagem, lista, itens, textoVazio) {
  lista.innerHTML = '';

  if (itens.length === 0) {
    mensagem.textContent = textoVazio;
    mensagem.hidden = false;
    lista.hidden = true;
    return;
  }

  itens.forEach((agendamento) => {
    lista.appendChild(criarItemAgendamento(agendamento));
  });

  mensagem.hidden = true;
  lista.hidden = false;
}

function mostrarErro(mensagem, texto) {
  mensagem.textContent = texto;
  mensagem.classList.add('erro');
  mensagem.hidden = false;
}

// ==========================================
// SAUDAÇÃO
// ==========================================

function exibirSaudacao() {
  saudacaoUsuario.textContent = usuario?.nome ? `Olá, ${usuario.nome}!` : 'Olá!';
}

// ==========================================
// AGENDAMENTOS (próximos e recentes)
// ==========================================

function criarItemAgendamento(agendamento) {
  const nomeServico = agendamento.servico?.nome ?? 'Serviço';
  const nomeProfissional = agendamento.profissional?.usuario?.nome ?? '-';

  const data = pegarData(agendamento);
  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';

  const inicio = pegarHora(agendamento.hora_inicio);
  const fim = pegarHora(agendamento.hora_fim);
  const horario = inicio && fim ? `${inicio} - ${fim}` : inicio || '-';

  const status = agendamento.status ?? '';

  const item = document.createElement('li');
  item.className = 'item-agendamento';

  const infoPrincipal = document.createElement('div');
  infoPrincipal.className = 'info-principal';

  const titulo = document.createElement('strong');
  titulo.textContent = nomeServico;

  const detalhe = document.createElement('span');
  detalhe.className = 'info-secundaria';
  detalhe.textContent = `${dataFormatada} · ${horario} · ${nomeProfissional}`;

  infoPrincipal.appendChild(titulo);
  infoPrincipal.appendChild(detalhe);

  const etiquetaStatus = document.createElement('span');
  etiquetaStatus.className = 'status';

  if (CLASSE_STATUS[status]) {
    etiquetaStatus.classList.add(CLASSE_STATUS[status]);
  }

  etiquetaStatus.textContent = TEXTO_STATUS[status] ?? (status || '-');

  item.appendChild(infoPrincipal);
  item.appendChild(etiquetaStatus);

  return item;
}

async function carregarAgendamentos() {
  if (!usuario) {
    return;
  }

  try {
    const resposta = await fetch(`${API}/agendamentos/usuario/${usuario.id_usuario}`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar agendamentos.');
    }

    const agendamentos = await resposta.json();

    const hoje = obterDataHoje();
    const horaAgora = obterHoraAgora();

    // Próximos: agendados que ainda não terminaram (do mais próximo ao mais distante)
    const proximos = agendamentos
      .filter((agendamento) => ehProximo(agendamento, hoje, horaAgora))
      .sort(compararPorDataHora)
      .slice(0, QUANTIDADE_ITENS);

    // Recentes: todo o resto (do mais novo ao mais antigo)
    const recentes = agendamentos
      .filter((agendamento) => !ehProximo(agendamento, hoje, horaAgora))
      .sort((a, b) => compararPorDataHora(b, a))
      .slice(0, QUANTIDADE_ITENS);

    mostrarLista(mensagemProximos, listaProximos, proximos, 'Você não tem agendamentos futuros.');

    mostrarLista(
      mensagemRecentes,
      listaRecentes,
      recentes,
      'Você ainda não tem agendamentos anteriores.',
    );
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro);

    mostrarErro(mensagemProximos, 'Não foi possível carregar seus agendamentos.');
    mostrarErro(mensagemRecentes, 'Não foi possível carregar seus agendamentos.');
  }
}

// ==========================================
// SERVIÇOS
// ==========================================

async function carregarServicos() {
  try {
    const resposta = await fetch(`${API}/servicos`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar serviços.');
    }

    const todos = await resposta.json();

    // Mostra apenas serviços ativos
    const servicos = todos.filter((servico) => servico.status === 'ATIVO');

    if (servicos.length === 0) {
      mensagemServicos.textContent = 'Nenhum serviço disponível no momento.';
      return;
    }

    listaServicos.innerHTML = '';

    servicos.forEach((servico) => {
      const card = document.createElement('div');
      card.className = 'servico-card';

      const nome = document.createElement('p');
      nome.className = 'servico-nome';
      nome.textContent = servico.nome;

      const tipo = document.createElement('p');
      tipo.className = 'servico-tipo';
      tipo.textContent = servico.tipo ?? '';

      const valor = document.createElement('p');
      valor.className = 'servico-valor';
      valor.textContent = `${formatarDinheiro(servico.valor_hora)} / hora`;

      card.appendChild(nome);
      card.appendChild(tipo);
      card.appendChild(valor);

      listaServicos.appendChild(card);
    });

    mensagemServicos.hidden = true;
    listaServicos.hidden = false;
  } catch (erro) {
    console.error('Erro ao carregar serviços:', erro);
    mostrarErro(mensagemServicos, 'Não foi possível carregar os serviços.');
  }
}

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

function inicializarPagina() {
  // Quem não está logado volta para o login
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  exibirSaudacao();
  carregarAgendamentos();
  carregarServicos();
}

inicializarPagina();