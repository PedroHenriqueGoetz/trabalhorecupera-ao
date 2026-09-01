# HelpDesk Web — Front-end consumidor da HelpDesk API

Front-end estático (HTML + CSS + JavaScript puro) que consome a `helpdesk-api` de forma assíncrona via `fetch`.

## Estrutura

```
helpdesk-web/
├── index.html          # login
├── cadastro.html        # criação de conta
├── dashboard.html        # lista de chamados + abertura de chamado
├── chamado.html          # detalhe do chamado, status e comentários
├── css/style.css
└── js/
    ├── api.js            # wrapper de fetch com JWT (define API_BASE_URL)
    ├── auth.js            # login e cadastro
    ├── dashboard.js       # listagem e criação de chamados
    └── chamado.js         # detalhe, atualização de status e comentários
```

## Como rodar localmente

Basta abrir `index.html` com uma extensão de servidor estático (ex: **Live Server** do VS Code) — não precisa de build. Antes disso, garanta que a `helpdesk-api` esteja rodando (por padrão em `http://localhost:4000`).

## Antes do deploy

Edite a constante `API_BASE_URL` em `js/api.js` para a URL pública da API (Render):

```js
const API_BASE_URL = 'https://seu-helpdesk-api.onrender.com';
```

## Deploy (Vercel ou Netlify)

1. Suba este diretório como um repositório GitHub à parte (ou subpasta).
2. Na Vercel/Netlify, importe o repositório como projeto **estático** (sem comando de build).
3. Depois de publicado, copie a URL gerada e configure-a como `FRONTEND_URL` nas variáveis de ambiente da `helpdesk-api` no Render, para o CORS liberar as requisições.
