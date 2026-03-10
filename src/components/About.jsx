import FadeIn from "./FadeIn";
import "./About.css";
const INFO = [["Location","Ilmenau, Germany"],["Status","M.Sc. Student @ TU Ilmenau"],["Work Permit","German Permit"],["Email","hammadnaseer2230@gmail.com"]];
const LANGS = [["English","C1"],["German","A2"],["Urdu","Native"],["Punjabi","Native"]];
export default function About() {
  return (
    <section id="about" className="section section--alt">
      <FadeIn><div className="section-header"><span className="section-num">01</span><h2 className="section-title">About</h2><div className="section-line"/></div></FadeIn>
      <div className="about__grid">
        <FadeIn delay={0.1}>
          <div className="about__text">
            <p>I'm a <strong>data analyst and ML engineer</strong> pursuing a Master's in Computer &amp; Systems Engineering at TU Ilmenau, Germany. My work spans the full pipeline from data wrangling to deploying real-time AI systems.</p>
            <p>I've built <strong>multi-camera face recognition</strong> access control, <strong>PPE safety monitoring</strong> dashboards, and drone-based object tracking systems.</p>
            <p>My approach: pick the right tool, build it clean, and make insights <strong>actually understandable</strong> for the people who need them.</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="about__info">
            {INFO.map(([l,v]) => (
              <div key={l} className="about__info-card"><span className="about__info-lbl">{l}</span><span className="about__info-val" style={{fontSize:l==="Email"?"11px":"14px"}}>{v}</span></div>
            ))}
            <div className="about__info-card about__info-card--wide">
              <span className="about__info-lbl">Languages</span>
              <div className="about__lang-grid">
                {LANGS.map(([n,lv]) => <div key={n} className="about__lang-card"><span className="about__lang-name">{n}</span><span className="about__lang-level">{lv}</span></div>)}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
