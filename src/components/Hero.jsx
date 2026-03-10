import { Link } from "react-router-dom";
import FadeIn from "./FadeIn";
import { useTypingEffect } from "../hooks";
import "./Hero.css";

const TITLES = ["Data Analyst & ML Engineer","Computer Vision Specialist","Full-Stack Developer"];
const STATS  = [{ num:"5.7M+", label:"Records Analyzed"},{ num:"95%", label:"Model Accuracy"},{ num:"2+", label:"Years Experience"}];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Hero() {
  const title = useTypingEffect(TITLES);
  return (
    <section className="hero">
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__content">
        <FadeIn>
          <p className="hero__eyebrow">Available for opportunities</p>
          <h1 className="hero__name">
            <span className="hero__name-first">Raja Hammad</span>
            <span className="hero__name-last">Naseer</span>
          </h1>
          <p className="hero__subtitle"><span className="hero__subtitle-hi">{title}</span><span className="cursor" /></p>
          <p className="hero__desc">Master's student at TU Ilmenau building intelligent systems at the intersection of data science, computer vision, and full-stack engineering.</p>
          <div className="hero__btns">
            <Link to="/projects" className="btn-fill">View Projects</Link>
            <button className="btn-outline" onClick={() => scrollToSection("contact")}>Get In Touch</button>
          </div>
        </FadeIn>
      </div>
      <div className="hero__stats">
        {STATS.map(({ num, label }) => (
          <div key={label} className="hero__stat">
            <span className="hero__stat-num">{num}</span>
            <span className="hero__stat-lbl">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
