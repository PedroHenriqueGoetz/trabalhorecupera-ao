const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const mensagemErro = document.getElementById('mensagem-erro');

function exibirErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.classList.remove('oculto');
}

if (formLogin) {
  formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensagemErro.classList.add('oculto');
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
      const dados = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });
      localStorage.setItem('helpdesk_token', dados.token);
      localStorage.setItem('helpdesk_usuario', JSON.stringify(dados.usuario));
      window.location.href = 'dashboard.html';
    } catch (erro) {
      exibirErro(erro.message);
    }
  });
}

if (formRegistro) {
  formRegistro.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensagemErro.classList.add('oculto');
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const papel = document.getElementById('papel').value;

    try {
      await apiFetch('/auth/registrar', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha, papel })
      });
      window.location.href = 'index.html?cadastrado=1';
    } catch (erro) {
      exibirErro(erro.message);
    }
  });
}
