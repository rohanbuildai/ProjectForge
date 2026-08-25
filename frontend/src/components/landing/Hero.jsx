import Icon from "./icons";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero" id="top">
      {/* Ambient background */}
      <div className="hero-glow hero-glow-accent" aria-hidden="true" />
      <div className="hero-glow hero-glow-ember" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="pf-container hero-inner">
        <div className="hero-announce">
          <span className="hero-announce-dot" />
          Introducing ProjectForge Realtime
          <Icon name="arrowRight" size={13} className="hero-announce-arrow" />
        </div>

        <h1 className="hero-title">
          Build. Collaborate. <em>Ship.</em>
        </h1>

        <p className="hero-sub">
          ProjectForge gives teams one place to plan projects, manage tasks,
          collaborate, and keep their entire workflow connected.
        </p>

        <div className="hero-actions">
          <a href="#cta" className="pf-btn pf-btn-primary pf-btn-lg">
            Get Started
            <Icon name="arrowRight" size={17} className="pf-icon-arrow" />
          </a>
          <a href="#features" className="pf-btn pf-btn-ghost pf-btn-lg">
            Explore ProjectForge
          </a>
        </div>

        <div className="hero-logos">
          <span className="hero-logos-label">Built for</span>
          <div className="hero-logos-row">
            <span className="hero-logo">◆ Studio</span>
            <span className="hero-logo">● Forge Labs</span>
            <span className="hero-logo">▲ Northwind</span>
            <span className="hero-logo">■ Kernel</span>
            <span className="hero-logo">◉ Aperture</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;