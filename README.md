# Flashcard App

Clone do Quizlet pessoal — React + Vite + Supabase, hospedado na Vercel.

## Stack

- **React 18** + React Router
- **Vite** (build rápido)
- **Supabase** (PostgreSQL na nuvem, gratuito)
- **Vercel** (deploy automático via GitHub)

---

## 1. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um **novo projeto** (guarde a senha do banco)
3. Vá em **SQL Editor** e cole todo o conteúdo de `schema.sql`
4. Clique em **Run** — as tabelas serão criadas
5. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public` key

---

## 2. Rodar localmente

```bash
# Instalar dependências
npm install

# Criar arquivo de variáveis
cp .env.example .env

# Editar .env com suas chaves do Supabase
# VITE_SUPABASE_URL=https://xxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...

# Rodar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173)

---

## 3. Deploy na Vercel

### Opção A — Via GitHub (recomendado)

1. Suba o projeto para um repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project**
3. Importe o repositório
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` → URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` → chave anon do Supabase
5. Clique **Deploy** — pronto!

### Opção B — Via CLI

```bash
npm install -g vercel
vercel
# Siga as instruções e adicione as env vars quando pedido
```

---

## Funcionalidades

- ✅ Criar baralhos com nome e descrição
- ✅ Adicionar, editar e remover cartões (frente/verso)
- ✅ Modo flashcard com animação de flip 3D
- ✅ Modo quiz com múltipla escolha e pontuação
- ✅ Dados persistidos no Supabase (PostgreSQL)
- ✅ Design responsivo e dark mode

---

## Estrutura do projeto

```
src/
├── components/
│   └── UI.jsx          # Componentes reutilizáveis
├── hooks/
│   └── useData.js      # Hooks de acesso ao Supabase
├── lib/
│   └── supabase.js     # Client do Supabase
├── pages/
│   ├── DecksPage.jsx   # Lista de baralhos
│   ├── CreateDeckPage.jsx
│   ├── EditDeckPage.jsx
│   └── StudyPage.jsx   # Flashcard + Quiz
├── App.jsx             # Rotas
├── main.jsx
└── index.css
```
