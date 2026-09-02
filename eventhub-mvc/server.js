require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');
const { anexarUsuario } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
const emProducao = process.env.NODE_ENV === 'production';

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parsers e arquivos estaticos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Sessao com cookie httpOnly (exigencia de seguranca da atividade)
app.use(session({
  name: 'eventhub.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: emProducao, // exige HTTPS em producao (Render fornece automaticamente)
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 4 // 4 horas
  }
}));

// Torna o usuario logado disponivel em todas as views (res.locals.usuario)
app.use(anexarUsuario);

// Rotas
app.use('/', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/inscricoes', inscricaoRoutes);

// Endpoint leve para monitoramento do serviço em produção.
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.get('/', (req, res) => res.redirect('/eventos'));

// 404
app.use((req, res) => {
  res.status(404).render('erro', { titulo: 'Pagina nao encontrada', mensagem: 'A pagina que voce procura nao existe.' });
});

// Tratamento central de erros - nunca vaza stack trace em producao
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('erro', {
    titulo: 'Erro interno',
    mensagem: emProducao ? 'Ocorreu um erro inesperado. Tente novamente mais tarde.' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`EventHub rodando na porta ${PORT}`);
});
