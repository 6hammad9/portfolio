import { useState } from "react";
import FlipCard from "../components/FlipCard";
import FadeIn from "../components/FadeIn";
import PageFooter from "../components/PageFooter";
import { projects, PROJECT_CATEGORIES } from "../data";
import "./ProjectsPage.css";
export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? projects : projects.filter(p => p.category === activeFilter);
  return (
    <main className="projects-page page-enter">
      <FadeIn>
        <div className="projects-page__header">
          <p className="projects-page__eyebrow">My Work</p>
          <h1 className="projects-page__title">Project <span>Showcase</span></h1>
          <p className="projects-page__desc">Hover each card, then <strong>click to flip</strong> and explore the details.</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="projects-page__filters">
          {PROJECT_CATEGORIES.map(cat => (
            <button key={cat} className={`projects-page__ftab${activeFilter===cat?" projects-page__ftab--active":""}`} onClick={() => setActiveFilter(cat)}>{cat}</button>
          ))}
        </div>
      </FadeIn>
      <div className="projects-page__grid">
        {filtered.map((project, i) => <FlipCard key={project.id} project={project} delay={i*0.08}/>)}
      </div>
      <PageFooter />
    </main>
  );
}
