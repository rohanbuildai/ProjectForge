import Reveal from "./Reveal";
import Icon from "./icons";
import "./CTA.css";

function CTA() {
  return (
    <section className="cta" id="cta">
      <div className="pf-container">
        <Reveal>
          <div className="cta-panel">
            <div className="cta-glow" aria-hidden="true" />
            <span className="pf-kicker cta-kicker">Get started</span>
            <h2 className="cta-title">
              Build better projects with ProjectForge.
            </h2>
            <p className="cta-sub">
              Create your workspace, invite your team, and turn ideas into
              shipped work — all in one connected place.
            </p>
            <div className="cta-actions">
              <a href="#top" className="cta-btn">
                Create your workspace
                <Icon name="arrowRight" size={17} />
              </a>
              <a href="#features" className="pf-btn pf-btn-ghost pf-btn-lg">
                See how it works
              </a>
            </div>
            <div className="cta-note">
              Free for small teams · No credit card required
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CTA;