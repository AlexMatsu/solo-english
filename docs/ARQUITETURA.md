# Solo English — Arquitetura de Informação & Copy

> Estudo de UX/UI. Plataforma de aprender inglês gamificada, tema anime/RPG (estética *Solo Leveling*: preto profundo + crimson neon). Aprender inglês é tratado como **subir de nível**: missões diárias, XP, ranking, bosses e recompensas.

---

## 1. Marca & princípios

| | |
|---|---|
| **Nome** | Solo English |
| **Promessa** | "Transforme seu inglês no seu maior poder." |
| **Público** | Jovens (16–30) fãs de anime/games que querem aprender inglês sem tédio. |
| **Tom de voz** | Épico, motivacional e direto. Voz ativa. Sem jargão técnico. O usuário é um **aventureiro/caçador**; estudar é **missão**; evoluir é **subir de nível**. |
| **Pilares de UX** | (1) Progressão visível a cada interação · (2) Hábito diário (ofensiva) · (3) Recompensa épica · (4) Clareza acima de tudo, mesmo na fantasia. |

### Tokens de design (em `assets/styles.css`)
- **Cores:** `--ground #08080c` · `--panel #11111b` · `--text #ECECF2` · `--accent #FF1E3C` (crimson neon) · `--gold #FFB627`.
- **Tipografia:** *Oswald* itálico condensado (display/títulos/botões) + *Inter* (corpo) + *JetBrains Mono* (números: XP, nível, ranking).
- **Forma:** hexágonos (nós de progresso), painéis com borda crimson e brilho, cantos chanfrados nos botões.

---

## 2. Mapa do site (sitemap)

```
PÚBLICO (deslogado)
└── index.html ............ Landing Page (vendas)
    ├── login.html ........ Entrar
    ├── cadastro.html ..... Criar conta
    └── recuperar.html .... Recuperar senha

LOGADO (app)
└── app.html .............. Home / dashboard do aventureiro
    ├── Missões  (trilha de lições)
    ├── Ranking  (ligas / guildas)
    ├── Guilda   (social)
    ├── Loja     (gold → cosméticos)
    └── Perfil   (nível, conquistas, config)
```

---

## 3. Landing Page (`index.html`) — arquitetura & copy

Sequência narrativa: **promessa → como funciona → prova de mecânica → prova social → oferta → ação.**

| # | Seção | Objetivo | Copy-chave |
|---|-------|----------|------------|
| 1 | **Hero** | Fisgar com a promessa + mostrar o "HUD" do jogo | H1: *"Transforme seu inglês em seu **maior poder**."* · Sub: *"Suba de nível todos os dias através de missões, desafios e batalhas inspiradas nos melhores animes."* · CTAs: **Começar jornada** / **Assistir trailer**. Prova: *+50.000 aventureiros*. |
| 2 | **Como funciona** | Explicar a mecânica em 4 passos (sequência real → numeração 01–04) | *Sua jornada de evolução*: 01 Escolha sua classe · 02 Complete missões · 03 Ganhe XP · 04 Suba de nível. |
| 3 | **Recursos** | Provar profundidade do sistema | 3 painéis: **Progressão** (níveis 1→100 Legend), **Recompensas épicas** (avatares, skins, títulos…), **Ranking mundial** (XP/streak/pronúncia) + bloco **Missões diárias**. |
| 4 | **Depoimentos** | Prova social com a própria linguagem do jogo | 3 cards com nível/classe do aluno ("Nível 32 · Elite"). |
| 5 | **Planos** | Converter | **Aprendiz** (R$0) vs **Caçador** (R$39/mês, "Mais popular"). |
| 6 | **CTA final** | Último empurrão | *"Está pronto para **despertar seu poder**?"* |
| 7 | **Diferenciais + Footer** | Confiança + navegação | Método gamificado · Conteúdo de qualidade · Comunidade ativa · Seguro e confiável. |

---

## 4. Fluxos de autenticação — arquitetura & copy

Layout comum: **split-screen**. Esquerda = `aside` imersivo (marca + frase épica + mini-HUD). Direita = formulário limpo e focado. No mobile o `aside` some e sobra só o formulário.

### 4.1 Login (`login.html`)
- **Objetivo:** entrar com o mínimo de atrito.
- **Campos:** E-mail, Senha (com mostrar/ocultar).
- **Extras:** "Manter conectado", link "Esqueci minha senha", login social (Google/Discord), divisor "ou continue com".
- **Copy:** título *"Entrar na sua jornada"* · botão **Entrar na jornada** · rodapé *"Ainda não é um aventureiro? Criar conta"*.
- **Estados:** erro inline na voz da interface (ex.: *"E-mail ou senha incorretos. Verifique e tente de novo."*), foco visível, loading no botão.

### 4.2 Cadastro (`cadastro.html`)
- **Objetivo:** criar conta rápido e comunicar valor já na lateral (3 benefícios).
- **Campos:** Nome de aventureiro, E-mail, Senha (**medidor de força** em 4 barras: fraca=crimson, média=gold, forte=verde).
- **Extras:** aceite de Termos/Privacidade, social, link para login.
- **Copy:** título *"Comece sua jornada"* · botão **Criar conta e despertar poder**.
- **UX:** validação progressiva (não punir antes da hora), dica de senha clara, nome de usuário como identidade do jogo.

### 4.3 Recuperar senha (`recuperar.html`)
- **Fluxo em 2 estados na mesma página:**
  1. **Pedido** — campo E-mail + botão **Enviar link de recuperação** + "Voltar para o login".
  2. **Confirmação** — card *"Link enviado!"* mostrando o e-mail digitado, instrução de checar caixa/spam, opção de reenviar.
- **Copy do aside:** *"Todo herói tropeça. O importante é levantar."*
- **UX:** mesma mensagem de sucesso independente de o e-mail existir (evita enumeração de contas); ação de reenviar com cooldown.

---

## 5. Home logada (`app.html`) — arquitetura & copy

Dashboard de app (não landing). Estrutura: **sidebar** (navegação) · **conteúdo principal** · **coluna de status** (telas largas).

| Bloco | Função (UX) | Detalhe |
|-------|-------------|---------|
| **Topbar** | Status persistente do jogador | 🔥 ofensiva · 💎 gold · ❤️ vidas · avatar + nível. |
| **Sidebar** | Navegação principal | Início · Missões · Ranking · Guilda · Loja · Perfil. |
| **Saudação + barra de nível** | Reforço de progresso | *"Bom te ver, ShadowHunter."* + XP 2.450/3.000 → *"Faltam 550 XP para o Nível 25."* |
| **Trilha de hoje** ⭐ | **Elemento herói** — o "caminho" estilo Duolingo em hexágonos zig-zag | Nós: concluídos (✓) → atual (pulsando, *"você está aqui"*) → bloqueados (🔒) → **Boss** (checkpoint/prova). Nomes temáticos: Saudações, Verbo To Be, Listening: Anime OST, Boss: Diálogo do Portão. |
| **Missões diárias** | Loop de hábito diário | 3–4 missões com +XP/+Gold e progresso; concluída → **Resgatar**. |
| **Boss da semana** | Evento épico / retenção | *"O Dragão do Listening"* — recompensa rara + **Enfrentar boss**. |
| **Coluna de status** | Comparação social + antecipação | Mini-ranking da liga (usuário destacado) · streak dos 7 dias · *"Próxima recompensa"* do Nível 25. |

**Princípio central:** toda ação devolve progresso imediato (XP/Gold/streak), e o que vem a seguir está sempre visível e desejável (próximo nó, próximo nível, próxima recompensa). É o loop do Duolingo vestido de RPG anime.

---

## 6. Telas (arquivos)
| Arquivo | Tela |
|---|---|
| `index.html` | Landing page |
| `login.html` | Login |
| `cadastro.html` | Cadastro |
| `recuperar.html` | Recuperar senha |
| `app.html` | Home logada (dashboard gamificado) |
| `assets/styles.css` | Sistema de design compartilhado |

---
*Documento de estudo de UX/UI — Solo English · 2026.*
