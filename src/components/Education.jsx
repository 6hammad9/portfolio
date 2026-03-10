import FadeIn from "./FadeIn";
import { education, certifications } from "../data";
import "./Education.css";
export default function Education() {
  return (
    <section id="education" className="section">
      <FadeIn><div className="section-header"><span className="section-num">04</span><h2 className="section-title">Education &amp; Certs</h2><div className="section-line"/></div></FadeIn>
      <div className="edu__grid">
        <FadeIn delay={0.1}>
          <div>
            <p className="edu__sub-heading" style={{color:"var(--accent2)"}}>Education</p>
            {education.map(item => (
              <div key={item.school} className="edu__card">
                <h3 className="edu__degree">{item.degree}</h3>
                <p className="edu__school">{item.school}</p>
                <p className="edu__period">{item.period} · {item.location}</p>
                <p className="edu__note">{item.note}</p>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div>
            <p className="edu__sub-heading" style={{color:"var(--accent3)"}}>Certifications</p>
            {certifications.map(c => (
              <div key={c.name} className="edu__cert-card">
                <div className="edu__cert-icon">{c.icon}</div>
                <div><p className="edu__cert-name">{c.name}</p><p className="edu__cert-issuer">{c.issuer}</p></div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
