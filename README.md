# Solo English — Documentação do Projeto

> Plataforma de inglês **gamificada** com estética anime (estilo *Solo Leveling*).
> Aprender inglês vira uma jornada de RPG: classes, missões diárias, XP, níveis,
> ranking, bosses e recompensas épicas.
>
> Stack: **Next.js 15 (App Router) + TypeScript + React 19**, autenticação e banco
> em **Supabase**, deploy na **Vercel**. CSS próprio (design system em variáveis),
> sem framework de UI.

---

## Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Decisões de UX/UI](#2-decisões-de-uxui)
3. [Arquitetura da Informação](#3-arquitetura-da-informação)
4. [Design System](#4-design-system)
5. [Landing Page](#5-landing-page)
6. [Área Logada](#6-área-logada)
7. [Funcionalidades](#7-funcionalidades)
8. [Wireframes Conceituais](#8-wireframes-conceituais)
9. [Regras de Negócio](#9-regras-de-negócio)
10. [Próximos Passos](#10-próximos-passos)
11. [Prompt de Continuidade](#11-prompt-de-continuidade)
- [Como rodar](#como-rodar)

---

## 1. Visão Geral do Projeto

### Objetivo do produto
Ensinar inglês de forma **gamificada e viciante**, transformando o estudo em uma
progressão de RPG/anime. O usuário escolhe uma classe, completa missões diárias
(vocabulário, gramática, listening, speaking), ganha XP/Gold, sobe de nível,
enfrenta "bosses" e desbloqueia recompensas.

### Problema que resolve
A maior barreira no aprendizado de idiomas é a **constância**. Métodos tradicionais
são monótonos e geram abandono. O Solo English ataca isso com **mecânicas de
engajamento** (ofensiva/streak, missões diárias, ranking, recompensas) que dão
motivação diária e sensação tangível de evolução.

### Público-alvo
- Jovens e adultos (≈16–30 anos) fãs de **anime, games e RPGs**.
- Estudantes de inglês do nível básico ao intermediário que já tentaram apps
  tradicionais e se desmotivaram.
- Perfil que responde bem a gamificação, competição leve e progressão visível.

---

## 2. Decisões de UX/UI

Cada decisão abaixo foi tomada durante o desenvolvimento, com a heurística/razão
que a sustenta.

### Hero em tela cheia sem corte
- **Decisão:** `min-height: 100svh` (não `100vh`) + conteúdo centralizado.
- **Motivo:** `100vh` no mobile conta a barra de endereço e "corta"/pula. `svh`
  (small viewport height) preenche corretamente em qualquer dispositivo.
- **Heurística:** *Estética e design minimalista* + *consistência entre
  plataformas*. `object-position: right top` no vídeo/imagem preserva o rosto do
  personagem (o crop do `object-fit: cover` é inevitável; controla-se **o que**
  corta).

### Ícones vetoriais (SVG) em vez de emoji
- **Decisão (regra fixa):** toda a UI usa **ícones SVG**, nunca emoji.
- **Motivo:** emoji renderiza diferente entre SO/navegadores e quebra a estética
  neon/RPG. SVG dá controle de cor (`currentColor` + glow do tema) e consistência.
- **Heurística:** *Consistência e padrões* + *identidade visual*.

### Redução de fricção no cadastro/login
- **Decisão:** remoção dos botões sociais (Google/Discord) e do divisor
  "ou continue com"; remoção do card decorativo "NÍVEL 24" da tela de login.
- **Motivo:** elementos que não funcionavam ou distraíam do objetivo único da
  tela (autenticar). Menos ruído = mais conversão.
- **Heurística:** *Minimalismo* + *foco na tarefa primária*.

### Feedback de força de senha (cadastro)
- **Decisão:** barra de 4 níveis (fraca→forte) com cor e microcopy ao vivo.
- **Motivo:** orienta o usuário a criar senha segura sem puni-lo com erro só no
  submit.
- **Heurística:** *Visibilidade do status do sistema* + *prevenção de erros*.

### Seção "Sua Jornada de Evolução" (storytelling visual)
- **Decisão:** 4 cards numerados (01→04) com ícone, descrição e bloco de
  **recompensa**, ligados por setas, ao lado do personagem (Kai) e citação.
- **Motivo:** comunica a proposta de valor (como funciona) de forma narrativa e
  escaneável, no padrão de páginas de jogos.
- **Heurística:** *Reconhecer melhor que lembrar* + *progressão clara*.
- **Refino:** recompensas alinhadas à mesma altura (`min-height` no bloco) mesmo
  quando um card tem 1 e outro tem 2 recompensas — alinhamento = percepção de
  qualidade.

### Animações com propósito
- **Decisão:** reveal-on-scroll com stagger; barra de progresso que "preenche";
  pop dos números; float dos ícones; pulso das setas.
- **Motivo:** guiar o olhar e dar vida sem distrair; tudo respeita
  `prefers-reduced-motion` (acessibilidade).
- **Heurística:** *Estética* + *acessibilidade*.

### Carrosséis com trava de 1 card por deslize
- **Decisão:** no mobile, carrosséis usam `scroll-snap` com `scroll-snap-stop:
  always` e `overflow-y: hidden`.
- **Motivo:** evitar "pular" vários cards e remover scroll vertical acidental
  dentro do trilho.
- **Heurística:** *Controle e liberdade do usuário*.

### Cards de planos menores no mobile
- **Decisão:** reduzir largura (82%→74%), padding e fonte do preço.
- **Motivo:** cards ocupavam tela demais; mostrar "espia" do card vizinho
  comunica que há mais opções (affordance de swipe).

### Rankings em nível iniciante
- **Decisão:** todos os jogadores em Divisão Bronze, valores baixos e diferença
  pequena (líder 120 XP, "Você" 0).
- **Motivo:** ranking com números absurdos (8.310 XP) desmotiva o iniciante.
  Diferença pequena = "dá pra alcançar".
- **Heurística:** *Correspondência com o mundo real* + design motivacional.

### Mensagem de boas-vindas pós-login
- **Decisão:** modal central grande após login bem-sucedido, com saudação
  personalizada e roadmap de novidades. Aparece só logo após o login (flag em
  `sessionStorage`), não em todo refresh.
- **Motivo:** acolher o usuário, reforçar o vínculo e comunicar evolução do
  produto.
- **Heurística:** *Visibilidade do status* + onboarding leve.

### Tom de voz / copywriting
- **Decisão:** linguagem de RPG/anime ("caçador", "desperte seu poder",
  "ofensiva", "boss", "torne-se lendário").
- **Motivo:** reforça a identidade e cria pertencimento com o público.

---

## 3. Arquitetura da Informação

### Estrutura de páginas

```
Público (não logado)
├── /                      Landing page
├── /cadastro              Criar conta
├── /login                 Entrar
└── /recuperar             Recuperar senha

Área logada (/jornada/*) — protegida pelo DashboardShell
├── /jornada               Dashboard (home gamificada)
├── /jornada/missoes       Missões
├── /jornada/ranking       Ranking mundial (abas: XP semanal / Ofensiva / Pronúncia)
├── /jornada/guilda        Guilda
├── /jornada/loja          Loja
├── /jornada/perfil        Perfil + seleção de avatar
└── /jornada/licao/[id]    Lição (ex.: /jornada/licao/saudacoes)
```

### Fluxos de navegação
- **Aquisição:** Landing → CTA "Começar jornada" → `/cadastro` → confirmação de
  e-mail → `/login` → `/jornada`.
- **Retorno:** `/login` → (sucesso) → modal de boas-vindas → `/jornada`.
- **Núcleo logado:** `/jornada` (trilha de hoje) → modal de lição → `/jornada/
  licao/[id]` → conclui → ganha XP → volta ao dashboard atualizado.
- **Navegação lateral (DashboardShell):** Início, Missões, Ranking, Guilda, Loja,
  Perfil.

### Jornada do usuário (macro)
1. **Descoberta** — landing comunica a proposta (hero + "como funciona" + planos +
   prova social + FAQ).
2. **Cadastro** — cria conta; trigger no Supabase gera o perfil (nível 1).
3. **Onboarding** — login → modal de boas-vindas → escolher classe (próximo
   objetivo) → primeira lição.
4. **Hábito** — missões diárias, ofensiva (streak), ranking semanal.
5. **Progressão** — XP → níveis → divisões → bosses → recompensas épicas.

---

## 4. Design System

Definido em `src/app/globals.css` (`:root`) e complementado por
`src/styles/landing.css` e `src/styles/dashboard.css`.

### Cores (tokens)

| Token | Hex/valor | Uso |
|-------|-----------|-----|
| `--ground` | `#07060f` | Fundo base (quase preto arroxeado) |
| `--ground-2` | `#0d0b1a` | Fundo de seções alternadas |
| `--panel` | `#131126` | Cards / painéis |
| `--panel-2` | `#1b1736` | Hover / elevação |
| `--line` | `#272340` | Bordas neutras |
| `--line-red` | `rgba(124,92,255,.35)` | Bordas com brilho roxo |
| `--text` | `#ECECF2` | Texto principal |
| `--muted` | `#948FB0` | Texto secundário |
| `--faint` | `#5d5878` | Legendas |
| `--accent` | `#7C5CFF` | **Cor da marca** (violeta neon) |
| `--accent-2` | `#4B2BB0` | Roxo profundo |
| `--accent-3` | `#A98BFF` | Highlight claro |
| `--glow` | `rgba(124,92,255,.55)` | Brilho/sombra neon |
| `--glow-soft` | `rgba(124,92,255,.18)` | Brilho suave |
| `--gold` | `#FFB627` | Recompensas / Gold |

### Tipografia
- **Display/Títulos:** `Oswald` (italic, uppercase, peso 600–700) — clima esportivo/épico.
- **Corpo:** `Inter` (400–700).
- **Números/Métricas:** `JetBrains Mono` (XP, contadores) — classe `.mono`.

### Tokens estruturais
- Raios: `--r-sm: 8px`, `--r: 14px`, `--r-lg: 20px`.
- Largura máxima de conteúdo: `--maxw: 1180px` (`.wrap`).
- Easing padrão: `--ease: cubic-bezier(.2,.7,.2,1)`.

### Componentes / classes-chave
- `.btn`, `.btn.ghost`, `.btn.gold`, `.btn.lg`, `.btn.block` — botões.
- `.btn-bolt` + `.btn-bolt-label` — botão com **efeito de raio** (sweep + flash no clique).
- `.panel`, `.panel.glow`, `.panel.corner` — cards (com brilho e canto decorativo).
- `.hex`, `.hex.svg-badge` — selo hexagonal (ícones/níveis).
- `.chip` — etiquetas (streak, divisão, tags).
- `.xpbar > i` — barra de XP com gradiente neon.
- `.eyebrow` — sobretítulo em caixa-alta com tracking.
- `.reveal/.in` — animação de entrada on-scroll (via `ScrollReveal`).
- Componentes React: `Navbar`, `Footer`, `Carousel` (com modo `drag` opcional),
  `ScrollReveal`, `TrailerButton`, `Button` (`PrimaryButton`), `DashboardShell`,
  `icons.tsx` (biblioteca de ícones SVG inline).

### Padrões visuais
- Tema **dark roxo neon** com glow consistente (sombra `--glow`).
- Hexágonos e losangos como motivo recorrente (selos, números, badges).
- Ícones **sempre SVG** (`public/icons/**` ou `src/components/icons.tsx`).

---

## 5. Landing Page

Arquivo: `src/app/page.tsx`. Textos i18n em `src/i18n/translations.ts` (pt/en/es).

### Estrutura (ordem das seções)
1. **Navbar** — logo, links âncora (Início, Como funciona, Recursos, Depoimentos,
   Planos, FAQ), seletor de idioma, CTA Entrar/Começar.
2. **Hero** (`#inicio`) — vídeo de fundo (`hero.mp4`, poster `hero-bg.png`), tela
   cheia (`100svh`), título, subtítulo, CTAs e prova social (avatares de classe +
   "+50.000 aventureiros").
3. **Sua Jornada de Evolução** (`#como`) — cabeçalho + personagem (Kai) + 4 cards
   numerados com recompensas + animações.
4. **Recursos** (`#recursos`) — 3 painéis: Sistema de progressão (ladder de
   níveis), Recompensas épicas (grid de ícones + "Ver loja"), Ranking mundial
   (abas + lista). Abaixo: destaque de Missões diárias.
5. **Depoimentos** (`#depoimentos`) — carrossel de provas sociais (5★).
6. **Planos** (`#planos`) — Aprendiz (R$0), Caçador (R$39, popular, botão com raio),
   Monarca (elite).
7. **FAQ** (`#faq`) — accordion.
8. **CTA final** + **Footer**.

### Copywriting (destaques, pt-BR)
- Hero: *"Transforme seu inglês em seu **maior poder.**"* / sub: domine conversação,
  vocabulário e compreensão num sistema inspirado em RPGs e animes.
- Jornada: *"Sua jornada de **evolução**"* — Escolha sua classe → Complete missões →
  Ganhe XP → Torne-se lendário.
- CTAs: "Começar jornada", "Assistir trailer", "Criar conta e despertar poder".

### CTAs
- Primário: **Começar jornada / Criar conta** → `/cadastro` (vários pontos).
- Secundário: **Assistir trailer** (modal de vídeo), **Ver loja**, **Ver ranking**.
- Plano destaque (Caçador) usa botão com **efeito de raio** (`btn-bolt`).

---

## 6. Área Logada

Layout comum: `DashboardShell` (sidebar de navegação + proteção de sessão).

### Dashboard (`/jornada`)
- **Saudação + barra de nível:** nome do usuário, nível atual, XP no nível,
  XP faltante para o próximo.
- **Modal de boas-vindas:** pós-login (ver regras de negócio).
- **Trilha de hoje:** nós sequenciais (done/current/locked) — Saudações,
  Vocabulário, Verbo To Be, Listening, Speaking, Boss (requer nível 10).
- **Missões diárias:** lista com progresso e recompensa; renova diariamente.
- **Boss da semana:** card de evento com recompensas e timer.
- **Aside:** mini-ranking da Guilda, ofensiva da semana (streak), próxima recompensa.

### Gamificação
- **Classes** (warrior, mage, ranger, hunter, monarch, shadow_king) — identidade
  de aprendizado.
- **XP & Níveis** — progressão por lição concluída.
- **Gold** — moeda de recompensa (coluna no perfil).
- **Vidas** — recurso (coluna no perfil, default 5).
- **Ofensiva (streak)** — dias seguidos de estudo.
- **Divisões/Ligas** — Bronze → Prata → Ouro → Rubi → Diamante → Mestre → Lendário.
- **Bosses** — desafios especiais (semanais / por nível).
- **Recompensas épicas** — avatares, skins, títulos, molduras, emotes, armas,
  mascotes, baús.

### Sistema de níveis (regra atual)
- **100 XP por nível**: `nível = 1 + floor(xp / 100)`.
- XP no nível atual: `xp % 100`.

### Missões / Recompensas / Métricas
- **Missões diárias** (ex.): aprender 10 palavras (+50 XP, +20 Gold), completar um
  listening (+80 XP), 1 exercício de speaking (+100 XP), concluir a 1ª lição (+30 XP).
- **Métricas exibidas:** Nível, XP total, Ofensiva (dias), Lições concluídas.
- **Perfil:** dados da conta, classe, divisão, **seleção de 10 avatares**, sair da conta.

---

## 7. Funcionalidades

**Autenticação (Supabase Auth — e-mail/senha)**
- Cadastro com validação (nome, e-mail, força de senha) e confirmação por e-mail.
- Detecção de e-mail já cadastrado (anti-enumeração).
- Login com tratamento de erro (não confirmado / credenciais inválidas).
- Recuperação de senha (envio de link) com estados de sucesso/reenvio.
- Logout.

**Landing / institucional**
- i18n pt/en/es (contexto de idioma + `localStorage`).
- Vídeo de fundo na hero; modal de trailer.
- Carrosséis (jornada, depoimentos, planos) com snap no mobile.
- FAQ em accordion.
- Reveal-on-scroll com `prefers-reduced-motion`.

**Dashboard / jogo**
- Trilha de lições com status calculado pelo progresso real (done/current/locked).
- Modal de lição (iniciar / em breve).
- Missões diárias, boss da semana, mini-ranking, streak, próxima recompensa.
- Ranking mundial com **3 abas funcionais** (XP semanal, Ofensiva, Pronúncia).
- Perfil com **seleção de avatar (10 opções)**.
- **Modal de boas-vindas** personalizado pós-login.

**Backend (Supabase)**
- Tabela `profiles` (id, name, level, xp, gold, lives, streak) com RLS.
- Tabela `user_lessons` (progresso por lição) com RLS.
- Trigger `on_auth_user_created` cria perfil automaticamente no cadastro + backfill.
- RPC `complete_lesson(lesson_id, xp)` — registra conclusão, dá XP (só na 1ª vez) e
  recalcula nível no servidor.

**Infra / fluxo de trabalho**
- Deploy na Vercel (`vercel --prod`); migrations aplicáveis via Management API.
- **Regra de processo:** sempre `commit + push` no GitHub **antes** de cada deploy.

---

## 8. Wireframes Conceituais (descrição textual)

**Landing — Hero:** tela cheia; à esquerda eyebrow + título grande (destaque roxo
com glow) + subtítulo + dois CTAs + prova social (4 avatares de classe + contador);
fundo em vídeo do personagem à direita, com véu escuro à esquerda para legibilidade.

**Landing — Sua Jornada de Evolução:** cabeçalho à esquerda; abaixo, coluna do
personagem (imagem emoldurada + citação do "Kai") à esquerda e, à direita, 4 cards
numerados (losango 01–04) em linha, cada um com selo de ícone, título, descrição e
rodapé "RECOMPENSA"; setas neon entre os cards.

**Landing — Recursos:** três painéis lado a lado — ladder de níveis (1→100 LEGEND),
grid de recompensas (8 ícones + botão), ranking (abas + top 5 + botão).

**Login/Cadastro/Recuperar:** layout split — painel imersivo à esquerda (logo,
headline temática, citação) e formulário à direita (campos com ícone SVG, validação,
CTA com seta).

**Dashboard:** três regiões — sidebar (navegação), main (saudação+nível, trilha de
hoje em nós hexagonais, missões diárias, boss da semana) e aside (liga da guilda,
ofensiva semanal, próxima recompensa). Modal central de boas-vindas ao entrar.

**Perfil:** cabeçalho com avatar (hexágono), nome, e-mail, chips de classe/divisão;
seção "Escolha seu avatar" (grade de 10 opções, ativa destacada); estatísticas;
botão sair.

**Ranking:** cabeçalho + abas (XP semanal / Ofensiva / Pronúncia) + lista ordenada
com selo de divisão, nome, tier e valor; "Você" destacado.

---

## 9. Regras de Negócio

- **Perfil automático:** ao criar conta, o trigger `handle_new_user` insere um
  `profiles` (nível 1, gold 0, lives 5, streak 0). Backfill cobre contas pré-existentes.
- **Nível por XP:** `nível = 1 + floor(xp / 100)` (100 XP por nível).
- **XP só na primeira vez:** `complete_lesson` só credita XP se a lição ainda não
  estava concluída (relê o status antes).
- **Segurança (RLS):** cada usuário só lê/edita o **próprio** perfil e as próprias
  lições (`auth.uid()`).
- **Lições bloqueadas por nível:** ex. Boss "Diálogo do Portão" exige nível 10.
- **Trilha sequencial:** o primeiro nó não concluído vira "atual"; os seguintes
  ficam "bloqueados" até liberar.
- **Confirmação de e-mail obrigatória** antes do primeiro login.
- **Anti-enumeração:** cadastro de e-mail existente não vaza a existência da conta.
- **Boas-vindas única por login:** flag `welcomeBack` no `sessionStorage` é setada
  no login e consumida (removida) ao exibir o modal — não reaparece em refresh.
- **Avatar:** atualmente persistido em `localStorage` (`soloAvatar`) — **planejado
  migrar para `profiles.avatar`** (ver Próximos Passos).
- **Idioma:** preferência salva em `localStorage` (pode permanecer no client).
- **Rankings:** dados ainda **mockados** em nível iniciante (Bronze) — placeholder
  para leaderboard real.
- **Processo de entrega:** commit+push no GitHub antes de todo deploy.

---

## 10. Próximos Passos

**Backend (tirar do mock / localStorage):**
- [ ] **Avatar → Supabase:** coluna `profiles.avatar`; substituir `localStorage`
      por `getProfile()`/update. (1º passo recomendado.)
- [ ] **Missões diárias reais:** tabela de missões + progresso + reset diário.
- [ ] **Ofensiva (streak) real:** calcular a partir de `user_lessons`/campo `streak`.
- [ ] **Ranking real:** leaderboard a partir de `profiles.xp` (semanal/ofensiva/pronúncia).
- [ ] **Gold/Vidas na UI:** ligar colunas existentes do `profiles`.
- [ ] **Loja & Guilda:** tabelas `items`/`user_items`, `guilds`/memberships.

**Produto / conteúdo:**
- [ ] Mais lições e a tela de lição de fato jogável (hoje só `saudacoes` é exemplo).
- [ ] Fluxo de "Escolher sua classe" (próximo objetivo do onboarding).
- [ ] Login social (Google/Discord) — se/quando fizer sentido.

**Qualidade:**
- [ ] Revogar/rotacionar tokens expostos; revisar variáveis de ambiente.
- [ ] Testes e validação de RLS/edge cases.

---

## 11. Prompt de Continuidade

> Cole o texto abaixo para qualquer IA continuar o projeto sem perder contexto.

```
Você é um(a) programador(a) FULLSTACK trabalhando no "Solo English", uma landing
page + app web de ensino de inglês GAMIFICADO com estética anime/RPG (estilo Solo
Leveling). Responda SEMPRE em português (pt-BR).

STACK: Next.js 15 (App Router) + TypeScript + React 19. Auth e banco no Supabase.
Deploy na Vercel (projeto "solo-english", domínio solo-english.vercel.app). CSS
próprio com design system em variáveis (sem framework de UI). i18n pt/en/es em
src/i18n/translations.ts.

REGRAS FIXAS (inegociáveis):
1. UI usa SEMPRE ícones SVG (public/icons/** ou src/components/icons.tsx), NUNCA emoji.
2. Atue como fullstack: persistência/regra de negócio vai no Supabase (tabelas,
   RLS, RPC), não em localStorage nem mock. localStorage só p/ preferências triviais
   (ex.: idioma).
3. SEMPRE faça commit + push no GitHub (origin/main) ANTES de cada deploy
   (vercel --prod). Mensagens de commit em pt-BR + linha Co-Authored-By.
4. Verifique a UI rodando localmente (npm run dev, http://localhost:3000) e cheque
   o status HTTP das rotas após cada mudança.

DESIGN SYSTEM: tema dark roxo neon. Marca --accent #7C5CFF, highlight --accent-3
#A98BFF, gold #FFB627, fundo --ground #07060f. Fontes: Oswald (títulos italic
uppercase), Inter (corpo), JetBrains Mono (números). Cards .panel/.glow/.corner,
selos .hex, botão de raio .btn-bolt, barra .xpbar, animações .reveal via ScrollReveal
(respeitar prefers-reduced-motion).

ESTRUTURA: páginas públicas (/, /cadastro, /login, /recuperar) e área logada
/jornada/* (dashboard, missoes, ranking, guilda, loja, perfil, licao/[id]) sob
DashboardShell. Backend em supabase/migrations/0001_game.sql: tabelas profiles e
user_lessons (com RLS), trigger handle_new_user (cria perfil nv1 + backfill),
RPC complete_lesson (XP só na 1ª vez; nível = 1 + floor(xp/100)). Migrations podem
ser aplicadas via Supabase Management API (POST /v1/projects/{ref}/database/query
com header User-Agent custom para não cair no Cloudflare 1010).

ESTADO ATUAL: landing completa (hero 100svh, seção "Sua Jornada de Evolução" com
4 cards + animações, recursos, depoimentos, planos, FAQ); auth funcional; dashboard
com trilha/missões/boss/ranking mockados em nível iniciante; perfil com seleção de
10 avatares; modal de boas-vindas pós-login. PENDENTE: migrar avatar p/ Supabase,
tornar missões/streak/ranking/loja/guilda reais (ver "Próximos Passos" do README).

Antes de começar, leia o README.md (esta documentação) e os arquivos relevantes.
Pergunte só o que for ambíguo; siga as regras fixas por padrão.
```

---

## Como rodar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build:check  # build de produção isolado (sanity check)
```

Variáveis de ambiente (`.env.local`, fora do git):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Estrutura de pastas (resumo)
```
src/
  app/                # rotas (App Router)
    page.tsx          # landing
    cadastro/ login/ recuperar/
    jornada/          # área logada (+ subrotas)
    globals.css       # design system (tokens) + base
  components/         # Navbar, Footer, Carousel, ScrollReveal, DashboardShell, icons, ...
  i18n/               # translations.ts + LangContext
  lib/                # supabase.ts, game.ts (regras de XP/lição)
  styles/             # landing.css, dashboard.css
public/icons/         # biblioteca de ícones SVG
supabase/migrations/  # 0001_game.sql (schema do jogo)
```

---
© 2026 Solo English — estudo de UX/UI.
