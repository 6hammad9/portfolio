import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Contact from "../components/Contact";
import PageFooter from "../components/PageFooter";
export default function HomePage() {
  return (
    <main className="page-enter">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <PageFooter />
    </main>
  );
}
