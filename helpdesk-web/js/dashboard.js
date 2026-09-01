const usuario = JSON.parse(localStorage.getItem('helpdesk_usuario') || 'null');
if (!usuario) window.location.href = 'index.html';

document.getElementById('saudacao').textContent = `Ola, ${usuario.nome} (${usuario.papel})`;

document.getElementById('btn-sair').addEventListener('click', () => {
  localStorage.removeItem('helpdesk_token');
  localStorage.removeItem('helpdesk_usuario');
  window.location.href = 'index.html';
});

const listaChamados = document.getElementById('lista-chamados');
const formNovoChamado = document.getElementById('form-novo-chamado');
const mensagemErro = document.getElementById('mensagem-erro');

function badgeStatus(status) {
  const classes = { 'Aberto': 'status-aberto', 'Em Atendimento': 'status-atendimento', 'Concluido': 'status-concluido' };
  return `<span class="badge ${classes[status] || ''}">${status}</span>`;
}

async function carregarChamados() {
  try {
    const chamados = await apiFetch('/chamados');
    listaChamados.innerHTML = '';
    if (chamados.length === 0) {
      listaChamados.innerHTML = '<p class="vazio">Nenhum chamado por aqui ainda.</p>';
      return;
    }
    chamados.forEach(c => {
      const item = document.createElement('a');
      item.href = `chamado.html?id=${c.id}`;
      item.className = 'card card-link';
      item.innerHTML = `
        <div class="card-topo">
          <h3>${c.titulo}</h3>
          ${badgeStatus(c.status)}
        </div>
        <p class="card-meta">Cliente: ${c.cliente_nome} ${c.tecnico_nome ? '· Tecnico: ' + c.tecnico_nome : ''}</p>
        <p class="card-meta">Prioridade: ${c.prioridade}</p>
      `;
      listaChamados.appendChild(item);
    });
  } catch (erro) {
    mensagemErro.textContent = erro.message;
    mensagemErro.classList.remove('oculto');
  }
}

formNovoChamado.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensagemErro.classList.add('oculto');
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const prioridade = document.getElementById('prioridade').value;

  try {
    await apiFetch('/chamados', {
      method: 'POST',
      body: JSON.stringify({ titulo, descricao, prioridade })
    });
    formNovoChamado.reset();
    carregarChamados();
  } catch (erro) {
    mensagemErro.textContent = erro.message;
    mensagemErro.classList.remove('oculto');
  }
});

carregarChamados();
