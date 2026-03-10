import FadeIn from "./FadeIn";
import { experience } from "../data";
import "./Experience.css";
export default function Experience() {
  return (
    <section id="experience" className="section section--alt">
      <FadeIn><div className="section-header"><span className="section-num">03</span><h2 className="section-title">Experience</h2><div className="section-line"/></div></FadeIn>
      <div className="timeline">
        {experience.map((item,i) => (
          <FadeIn key={item.date} delay={i*0.1}>
            <div className="timeline__item">
              <p className="timeline__date">{item.date}</p>
              <h3 className="timeline__role">{item.role}</h3>
              <p className="timeline__company">{item.company} · {item.location}</p>
              <ul className="timeline__bullets">{item.bullets.map(b => <li key={b}>{b}</li>)}</ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
