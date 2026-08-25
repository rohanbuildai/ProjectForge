import "./Footer.css";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Roadmap", "Security", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "GitHub", "Community"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Blog"],
  },
];

function Logo() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <defs>
        <linearGradient id="pf-logo-foot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9b8cff" />
          <stop offset="100%" stopColor="#6a56ff" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.2" fill="url(#pf-logo-foot)" />
      <rect x="13" y="2.5" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.9" />
      <rect x="2.5" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.42" />
      <rect x="13" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.66" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="pf-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#top" className="footer-logo">
              <Logo />
              <span>ProjectForge</span>
            </a>
            <p className="footer-tagline">
              One place to plan projects, manage tasks, and ship together.
            </p>
            <div className="footer-social">
              <a
                href="#github"
                className="footer-social-link"
                aria-label="GitHub"
                onClick={(e) => e.preventDefault()}
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="footer-col">
              <h4 className="footer-col-title">{col.title}</h4>
              <ul className="footer-links">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#link"
                      className="footer-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 ProjectForge. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;