# EventHub — Sistema de Gestão de Eventos e Inscrições

Aplicação **MVC** (Node.js + Express + EJS + MySQL) desenvolvida para a atividade de recuperação trimestral.

## Arquitetura

```
eventhub-mvc/
├── server.js              # ponto de entrada, middlewares e rotas
├── config/db.js           # pool de conexão MySQL (mysql2)
├── models/                # acesso a dados (prepared statements)
├── controllers/           # regras de negócio
├── routes/                # definição de rotas Express
├── middlewares/           # autenticação de sessão
├── views/                 # templates EJS renderizados no servidor
├── public/css/            # estilos estáticos
└── sql/schema.sql         # script de criação do banco
```

## Funcionalidades

- Cadastro e login de usuários (organizador ou participante), com sessão via cookie `httpOnly`.
- Organizadores criam, editam e excluem eventos.
- Participantes visualizam eventos, se inscrevem e cancelam inscrições, respeitando o limite de vagas.
- Página "Minhas inscrições" para o participante acompanhar seus eventos.

## Segurança

- Senhas com hash `bcryptjs` (nunca em texto puro).
- Todas as queries usam **prepared statements** (`?`) via `mysql2`, sem concatenação de strings.
- Sessão assinada com `SESSION_SECRET`, cookie `httpOnly` e `secure` em produção.
- Variáveis sensíveis isoladas em `.env` (nunca commitado — veja `.gitignore`).
- Tratamento de erros central que evita vazar stack traces em produção.

## Rodando localmente

```bash
npm install
cp .env.example .env      # preencha com os dados do seu banco
# execute sql/schema.sql no seu MySQL (local ou em nuvem)
npm run dev                # ou: npm start
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

Veja `.env.example` para a lista completa. Resumo:

| Variável | Descrição |
| --- | --- |
| `PORT` | Porta HTTP da aplicação |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão MySQL |
| `DB_SSL` | `true` para exigir SSL (necessário em provedores como Aiven) |
| `SESSION_SECRET` | Segredo para assinar o cookie de sessão |
| `NODE_ENV` | `production` habilita cookie `secure` (exige HTTPS) |

## Deploy em produção

1. **Banco de dados (Aiven, Neon ou similar):** crie uma instância MySQL, copie host/porta/usuário/senha e rode `sql/schema.sql` nela (via CLI, Workbench ou console web).
2. **Aplicação (Render, Railway ou Fly.io):**
   - Conecte o repositório GitHub.
   - Comando de build: `npm install`. Comando de start: `npm start`.
   - Cadastre as variáveis de ambiente do `.env.example` no painel do serviço (nunca no código).
   - Defina `NODE_ENV=production`.
3. Teste a URL pública em uma aba anônima antes de submeter.
