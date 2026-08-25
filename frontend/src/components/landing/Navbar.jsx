import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./icons";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#showcase" },
  { label: "About", href: "#about" },
];

function Logo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <defs>
        <linearGradient id="pf-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9b8cff" />
          <stop offset="100%" stopColor="#6a56ff" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.2" fill="url(#pf-logo-grad)" />
      <rect x="13" y="2.5" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.9" />
      <rect x="2.5" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.42" />
      <rect x="13" y="13" width="8.5" height="8.5" rx="2.2" fill="#f2f4f8" opacity="0.66" />
    </svg>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="pf-container navbar-inner">
        <a href="#top" className="navbar-brand">
          <span className="navbar-logo">
            <Logo />
          </span>
          <span className="navbar-wordmark">ProjectForge</span>
        </a>

        <nav className="navbar-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="pf-btn pf-btn-ghost navbar-login">
            Login
          </Link>
          <Link to="/register" className="pf-btn pf-btn-primary navbar-cta">
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
        </button>
      </div>

      <div className={`navbar-mobile ${open ? "is-open" : ""}`}>
        <nav className="navbar-mobile-links" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar-mobile-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="navbar-mobile-actions">
          <Link
            to="/login"
            className="pf-btn pf-btn-ghost"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="pf-btn pf-btn-primary"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;