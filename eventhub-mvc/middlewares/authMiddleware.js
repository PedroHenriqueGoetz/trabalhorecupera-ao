const UsuarioModel = require('../models/usuarioModel');

/**
 * Disponibiliza o usuario logado (se houver) em res.locals para todas as views.
 * @async
 */
async function anexarUsuario(req, res, next) {
  res.locals.usuario = req.session.usuario || null;
  next();
}

/**
 * Bloqueia acesso de visitantes nao autenticados, redirecionando para o login.
 */
function exigirLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

/**
 * Bloqueia acesso de usuarios que nao sejam organizadores.
 */
function exigirOrganizador(req, res, next) {
  if (!req.session.usuario || req.session.usuario.papel !== 'organizador') {
    return res.status(403).render('erro', {
      titulo: 'Acesso negado',
      mensagem: 'Apenas organizadores podem acessar esta pagina.'
    });
  }
  next();
}

module.exports = { anexarUsuario, exigirLogin, exigirOrganizador };
