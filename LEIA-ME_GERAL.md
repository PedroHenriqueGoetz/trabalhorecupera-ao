# Recuperação Trimestral — Pacote completo

Três projetos prontos, cada um com seu próprio README detalhado:

1. **`eventhub-mvc/`** — Aplicação 1 (MVC): gestão de eventos e inscrições.
2. **`helpdesk-api/`** — Aplicação 2 (REST): API de chamados e suporte técnico.
3. **`helpdesk-web/`** — Front-end estático que consome a `helpdesk-api`.

## O que já está pronto no código

- Arquitetura em camadas (`routes/controllers/models`, + `views` no MVC).
- Autenticação: sessão `httpOnly` no EventHub, JWT no HelpDesk.
- Senhas com `bcryptjs`, queries com *prepared statements* (`mysql2`), `dotenv` para segredos.
- CORS restrito no HelpDesk API, tratamento central de erros nos dois back-ends.
- JSDoc nos controllers, Swagger UI em `/api-docs` no HelpDesk API.
- Scripts `sql/schema.sql` prontos para rodar no MySQL.
- Cada projeto foi testado localmente (boot do servidor, rotas básicas) neste ambiente.

## O que **eu não posso fazer por você** (exige suas próprias contas)

O deploy em nuvem (Aiven/Neon, Render, Vercel) precisa das suas credenciais e contas — não tenho como criar isso por você. O passo a passo está no README de cada projeto. Resumo da ordem:

1. Crie o banco MySQL (Aiven ou Neon) e rode o `sql/schema.sql` correspondente.
2. Suba cada repositório (`eventhub-mvc`, `helpdesk-api`, `helpdesk-web`) para o GitHub — **em repositórios separados**, como pede o relatório de entrega.
3. Deploy do EventHub e da HelpDesk API no Render (Web Service, `npm install` / `npm start`), preenchendo as variáveis do `.env.example` de cada um no painel do serviço.
4. Deploy do HelpDesk Web no Vercel/Netlify, e antes disso troque `API_BASE_URL` em `helpdesk-web/js/api.js` pela URL pública da API.
5. Volte na HelpDesk API no Render e defina `FRONTEND_URL` com a URL do passo 4 (senão o CORS bloqueia).
6. Teste tudo em aba anônima e preencha `RELATORIO_ENTREGA.txt` com os links finais.

## Se quiser, no próximo passo eu posso te ajudar a:
- Revisar/testar o código com um banco MySQL real que você configurar.
- Escrever o passo a passo de criação de conta e deploy em cada serviço (Aiven/Render/Vercel), com prints se quiser.
- Adaptar qualquer parte (nomes de campos, regras de negócio, estilo visual).
