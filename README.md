# Solo English

Plataforma de inglês **gamificada** com estética anime (estilo *Solo Leveling*) — estudo de UX/UI.
Aprender inglês vira uma jornada de RPG: missões diárias, XP, ranking, bosses e recompensas.

Migrado de páginas HTML estáticas para **Next.js (App Router + TypeScript)**.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Rotas

| Rota | Tela |
|------|------|
| `/` | Landing page |
| `/login` | Entrar |
| `/cadastro` | Criar conta |
| `/recuperar` | Recuperar senha |
| `/jornada` | Home logada (dashboard gamificado) |

## Estrutura

```
src/
├── app/
│   ├── layout.tsx        # layout raiz (fontes, atmosfera de fundo, metadata)
│   ├── globals.css       # design system (tokens, componentes base)
│   ├── page.tsx          # landing
│   ├── login/page.tsx
│   ├── cadastro/page.tsx
│   ├── recuperar/page.tsx
│   └── jornada/page.tsx  # dashboard logado
├── components/
│   ├── BgLayers.tsx      # camadas de atmosfera (em todas as telas)
│   ├── Navbar.tsx        # nav pública (landing)
│   └── Footer.tsx
└── styles/
    ├── landing.css       # estilos específicos da landing
    └── dashboard.css     # estilos específicos do dashboard

docs/
└── ARQUITETURA.md        # arquitetura de informação + copy de todas as telas

legacy/                   # protótipos HTML estáticos originais (referência)
├── index.html, login.html, cadastro.html, recuperar.html, app.html
└── assets/styles.css
```

## Design system

- **Cores:** preto profundo `#08080c` + crimson neon `#FF1E3C` + dourado `#FFB627`
- **Tipografia:** Oswald (display itálico condensado) · Inter (corpo) · JetBrains Mono (números)
- **Forma:** hexágonos, painéis com brilho crimson, botões chanfrados

Os tokens vivem como CSS custom properties em `globals.css`.

---
© 2026 Solo English — estudo de UX/UI.
