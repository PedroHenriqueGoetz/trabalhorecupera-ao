const usuario = JSON.parse(localStorage.getItem('helpdesk_usuario') || 'null');
if (!usuario) window.location.href = 'index.html';

const params = new URLSearchParams(window.location.search);
const chamadoId = params.get('id');

const detalheChamado = document.getElementById('detalhe-chamado');
const painelStatus = document.getElementById('painel-status');
const listaComentarios = document.getElementById('lista-comentarios');
const formComentario = document.getElementById('form-comentario');
const mensagemErro = document.getElementById('mensagem-erro');

function exibirErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.classList.remove('oculto');
}

async function carregarChamado() {
  try {
    const c = await apiFetch(`/chamados/${chamadoId}`);
    detalheChamado.innerHTML = `
      <h1>${c.titulo}</h1>
      <p class="card-meta">Cliente: ${c.cliente_nome} ${c.tecnico_nome ? '· Tecnico: ' + c.tecnico_nome : ''}</p>
      <p class="card-meta">Prioridade: ${c.prioridade} · Status: <strong>${c.status}</strong></p>
      <p>${c.descricao || 'Sem descricao.'}</p>
    `;

    if (usuario.papel === 'tecnico') {
      painelStatus.classList.remove('oculto');
      document.getElementById('select-status').value = c.status;
    }
  } catch (erro) {
    exibirErro(erro.message);
  }
}

async function carregarComentarios() {
  try {
    const comentarios = await apiFetch(`/chamados/${chamadoId}/comentarios`);
    listaComentarios.innerHTML = comentarios.length === 0
      ? '<p class="vazio">Nenhum comentario ainda.</p>'
      : '';
    comentarios.forEach(c => {
      const div = document.createElement('div');
      div.className = 'comentario';
      div.innerHTML = `<strong>${c.autor_nome}</strong> <span class="card-meta">(${c.autor_papel})</span><p>${c.mensagem}</p>`;
      listaComentarios.appendChild(div);
    });
  } catch (erro) {
    exibirErro(erro.message);
  }
}

if (painelStatus) {
  document.getElementById('form-status').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const status = document.getElementById('select-status').value;
    try {
      await apiFetch(`/chamados/${chamadoId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      carregarChamado();
    } catch (erro) {
      exibirErro(erro.message);
    }
  });
}

formComentario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const mensagem = document.getElementById('mensagem').value;
  try {
    await apiFetch(`/chamados/${chamadoId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({ mensagem })
    });
    formComentario.reset();
    carregarComentarios();
  } catch (erro) {
    exibirErro(erro.message);
  }
});

carregarChamado();
carregarComentarios();
