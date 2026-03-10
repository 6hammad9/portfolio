import { useState } from "react";
import FadeIn from "./FadeIn";
import { contactLinks } from "../data";
import "./Contact.css";
export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  return (
    <section id="contact" className="section section--alt">
      <FadeIn><div className="section-header"><span className="section-num">05</span><h2 className="section-title">Contact</h2><div className="section-line"/></div></FadeIn>
      <div className="contact__grid">
        <FadeIn delay={0.1}>
          <div>
            <h3 className="contact__lead">Let's build something <span>remarkable</span> together.</h3>
            <p className="contact__desc">Open to data analyst roles, ML engineering positions, and full-stack development opportunities in Germany.</p>
            <div className="contact__links">
              {contactLinks.map(({ icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="contact__link">
                  <span className="contact__link-icon">{icon}</span>{label}
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="contact__form">
            {[["name","Name","Your name","text"],["email","Email","your@email.com","email"],["subject","Subject","Job opportunity / Collaboration","text"]].map(([id,lbl,ph,type]) => (
              <div key={id} className="contact__field">
                <label htmlFor={id} className="contact__label">{lbl}</label>
                <input id={id} name={id} type={type} placeholder={ph} className="contact__input" value={form[id]} onChange={handleChange}/>
              </div>
            ))}
            <div className="contact__field">
              <label htmlFor="message" className="contact__label">Message</label>
              <textarea id="message" name="message" placeholder="Tell me about the opportunity..." className="contact__textarea" value={form.message} onChange={handleChange}/>
            </div>
            <button className="btn-fill contact__submit" onClick={() => alert("Please email: hammadnaseer2230@gmail.com")}>Send Message</button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
