import Link from "next/link";

const COLUMNS = [
  {
    title: "Conteúdo",
    links: ["Como funciona", "Missões", "Recursos", "Planos", "FAQ"],
  },
  {
    title: "Comunidade",
    links: ["Guildas", "Ranking", "Eventos", "Blog"],
  },
  {
    title: "Suporte",
    links: ["Central de ajuda", "Contato", "Termos de uso", "Privacidade"],
  },
];

export default function Footer() {
  return (
    <footer id="faq" className="footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="logo">
            SOLO<br />
            <span className="r">ENGLISH</span>
          </Link>
          <p style={{ color: "var(--faint)", fontSize: 14, marginTop: 14, maxWidth: 240 }}>
            Sua jornada épica para dominar o inglês começa aqui.
          </p>
          <div className="social">
            <a href="#" aria-label="Discord">🎮</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">▶️</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap">
        <p className="footer-bottom">© 2026 Solo English. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
