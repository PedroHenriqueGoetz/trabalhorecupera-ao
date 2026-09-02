require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const tratarErros = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS restrito a URL do front-end autorizado (exigencia de seguranca da atividade)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Documentacao interativa da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/auth', authRoutes);
app.use('/chamados', chamadoRoutes);

// Endpoint leve para monitoramento do serviço em produção.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ mensagem: 'HelpDesk API no ar. Veja a documentacao em /api-docs.' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

// Tratamento central de erros
app.use(tratarErros);

app.listen(PORT, () => {
  console.log(`HelpDesk API rodando na porta ${PORT}`);
  console.log(`Documentacao Swagger em http://localhost:${PORT}/api-docs`);
});
