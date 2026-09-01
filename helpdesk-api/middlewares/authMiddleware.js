const jwt = require('jsonwebtoken');

/**
 * Exige um JWT valido no cabecalho Authorization: Bearer <token>.
 * Em caso de sucesso, anexa o payload decodificado em req.usuario.
 */
function exigirAutenticacao(req, res, next) {
  const cabecalho = req.headers.authorization;
  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticacao ausente.' });
  }

  const token = cabecalho.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}

/**
 * Exige que o usuario autenticado tenha o papel de tecnico.
 */
function exigirTecnico(req, res, next) {
  if (!req.usuario || req.usuario.papel !== 'tecnico') {
    return res.status(403).json({ erro: 'Apenas tecnicos podem executar esta acao.' });
  }
  next();
}

module.exports = { exigirAutenticacao, exigirTecnico };
