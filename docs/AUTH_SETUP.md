# Configurar autenticação (Supabase Auth)

Login real de e-mail/senha, com contas no servidor — funciona em qualquer dispositivo.

## 1. Criar o projeto Supabase
1. Acesse https://supabase.com e crie uma conta (grátis).
2. **New project** → escolha um nome (ex.: `solo-english`), defina uma senha de banco e a região mais próxima (ex.: South America / São Paulo).
3. Aguarde o provisionamento (~1 min).

## 2. Desligar a confirmação de e-mail (para o cadastro já entrar)
Por padrão o Supabase exige confirmar o e-mail antes de logar. Para o fluxo
"cadastrou → já entrou", desligue isso (opcional, mas recomendado no protótipo):
- **Authentication → Sign In / Providers → Email** → desmarque **Confirm email** → **Save**.

> Se preferir manter a confirmação ligada, o cadastro mostrará "confirme pelo
> link enviado ao seu e-mail" e o login passa a funcionar após a confirmação.

## 3. Pegar as chaves públicas
- **Project Settings → API**
  - **Project URL** → vai em `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** (Project API keys) → vai em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Configurar localmente
Crie um arquivo `.env.local` na raiz (use o `.env.example` como base):

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

Rode: `npm run dev` → teste cadastro e login em http://localhost:3000

## 5. Configurar na Vercel
Adicione as mesmas variáveis em:
**Vercel → projeto solo-english → Settings → Environment Variables**
(ambiente Production). Depois um novo deploy: `vercel --prod`.

---
As duas variáveis são públicas (a anon key é protegida por Row Level Security),
então é seguro expô-las no client e nas configs do projeto.
