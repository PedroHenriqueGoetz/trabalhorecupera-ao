// URL pública da HelpDesk API no Render.
const API_BASE_URL = 'https://pedro-goetz-helpdesk-api.onrender.com';

/**
 * Wrapper de fetch que injeta o token JWT salvo e trata erros de forma padronizada.
 * @param {string} caminho - caminho relativo (ex: "/chamados")
 * @param {RequestInit} opcoes
 * @returns {Promise<any>}
 */
async function apiFetch(caminho, opcoes = {}) {
  const token = localStorage.getItem('helpdesk_token');
  const cabecalhos = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  if (token) cabecalhos['Authorization'] = `Bearer ${token}`;

  const resposta = await fetch(`${API_BASE_URL}${caminho}`, { ...opcoes, headers: cabecalhos });

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    if (resposta.status === 401) {
      localStorage.removeItem('helpdesk_token');
      localStorage.removeItem('helpdesk_usuario');
      window.location.href = 'index.html';
    }
    throw new Error(dados.erro || 'Ocorreu um erro ao falar com o servidor.');
  }
  return dados;
}
