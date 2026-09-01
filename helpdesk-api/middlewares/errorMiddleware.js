/**
 * Middleware central de tratamento de erros.
 * Nunca expoe stack traces ao cliente em producao.
 */
function tratarErros(err, req, res, next) {
  console.error(err);
  const emProducao = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    erro: emProducao ? 'Erro interno do servidor.' : err.message
  });
}

module.exports = tratarErros;
