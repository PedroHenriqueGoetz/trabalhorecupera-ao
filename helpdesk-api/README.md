# HelpDesk API — Gestão de Chamados e Suporte Técnico

API **RESTful** (Node.js + Express + MySQL) desenvolvida para a atividade de recuperação trimestral. Desacoplada de qualquer interface — consumida pelo front-end em `helpdesk-web`.

## Arquitetura

```
helpdesk-api/
├── server.js               # ponto de entrada, middlewares e rotas
├── config/db.js            # pool de conexão MySQL (mysql2)
├── config/swagger.js       # geração da especificação OpenAPI
├── models/                 # acesso a dados (prepared statements)
├── controllers/            # regras de negócio (documentados com JSDoc)
├── routes/                 # rotas Express + anotações @openapi
├── middlewares/            # autenticação JWT e tratamento de erros
└── sql/schema.sql          # script de criação do banco
```

## Endpoints principais

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| POST | `/auth/registrar` | Cadastra cliente ou técnico | — |
| POST | `/auth/login` | Retorna um JWT | — |
| GET | `/chamados` | Lista chamados (cliente vê os seus; técnico vê todos) | Bearer |
| POST | `/chamados` | Abre um chamado | Bearer |
| GET | `/chamados/:id` | Detalha um chamado | Bearer |
| DELETE | `/chamados/:id` | Exclui um chamado | Bearer |
| PATCH | `/chamados/:id/status` | Atualiza status (`Aberto`/`Em Atendimento`/`Concluido`) | Bearer (técnico) |
| GET | `/chamados/:chamadoId/comentarios` | Lista comentários | Bearer |
| POST | `/chamados/:chamadoId/comentarios` | Adiciona comentário | Bearer |

Documentação interativa completa (Swagger UI) disponível em **`/api-docs`** após subir o servidor.

## Segurança

- Senhas com hash `bcryptjs`.
- Autenticação via **JWT** no cabeçalho `Authorization: Bearer <token>`.
- **CORS** restrito exclusivamente à URL configurada em `FRONTEND_URL`.
- Todas as queries usam **prepared statements** via `mysql2`.
- Middleware central de erros que nunca vaza stack trace em produção.
- Variáveis sensíveis isoladas em `.env` (nunca commitado).

## Rodando localmente

```bash
npm install
cp .env.example .env      # preencha com os dados do seu banco e um JWT_SECRET forte
# execute sql/schema.sql no seu MySQL (local ou em nuvem)
npm run dev                # ou: npm start
```

A API sobe em `http://localhost:4000`, com Swagger em `http://localhost:4000/api-docs`.

## Variáveis de ambiente

Veja `.env.example`. Resumo:

| Variável | Descrição |
| --- | --- |
| `PORT` | Porta HTTP da API |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão MySQL |
| `DB_SSL` | `true` para exigir SSL (necessário em provedores como Aiven) |
| `JWT_SECRET` | Segredo para assinar os tokens |
| `JWT_EXPIRES_IN` | Validade do token (ex: `8h`) |
| `FRONTEND_URL` | URL pública do front-end autorizado pelo CORS |
| `NODE_ENV` | `production` oculta detalhes de erro nas respostas |

## Deploy em produção

1. **Banco de dados (Aiven, Neon ou similar):** crie a instância MySQL e rode `sql/schema.sql`.
2. **API (Render ou Railway):**
   - Comando de build: `npm install`. Comando de start: `npm start`.
   - Configure as variáveis de ambiente do `.env.example` no painel do serviço.
   - Defina `FRONTEND_URL` com a URL definitiva do front-end (Vercel/Netlify) — sem isso o CORS bloqueará as requisições.
3. **Front-end (Vercel ou Netlify):** faça o deploy de `helpdesk-web` e aponte a `API_BASE_URL` (em `js/api.js`) para a URL pública desta API.
4. Teste as URLs públicas em uma aba anônima e confirme que `/api-docs` carrega corretamente antes de submeter.
