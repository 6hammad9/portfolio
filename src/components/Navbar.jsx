import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const HOME_LINKS = [
  { label: "About",      id: "about"      },
  { label: "Skills",     id: "skills"     },
  { label: "Experience", id: "experience" },
  { label: "Education",  id: "education"  },
  { label: "Contact",    id: "contact"    },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const { pathname } = useLocation();
  const isProjectsPage = pathname === "/projects";
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">RHN<span>_</span></Link>
      <ul className="navbar__links">
        {!isProjectsPage && HOME_LINKS.map(({ label, id }) => (
          <li key={label}>
            <button className="navbar__scroll-btn" onClick={() => scrollToSection(id)}>{label}</button>
          </li>
        ))}
        <li>
          <Link to={isProjectsPage ? "/" : "/projects"} className="navbar__cta">
            {isProjectsPage ? "← Portfolio" : "Projects ↗"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
