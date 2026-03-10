import FadeIn from "./FadeIn";
import { skills } from "../data";
import "./Skills.css";
export default function Skills() {
  return (
    <section id="skills" className="section">
      <FadeIn><div className="section-header"><span className="section-num">02</span><h2 className="section-title">Skills</h2><div className="section-line"/></div></FadeIn>
      <div className="skills__grid">
        {skills.map((cat,i) => (
          <FadeIn key={cat.title} delay={i*0.07}>
            <div className="skills__card">
              <span className="skills__icon">{cat.icon}</span>
              <h3 className="skills__cat-title">{cat.title}</h3>
              <div className="skills__tags">{cat.tags.map(t => <span key={t} className="skills__tag">{t}</span>)}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
