import { useState, useEffect, useCallback } from "react";
import { useFadeIn } from "../hooks";
import "./FlipCard.css";

const SLIDE_INTERVAL = 3000; // ms between auto-advances

/* ── Image Carousel shown on the card front ── */
function CardCarousel({ images, color, gradient, icon, name, paused }) {
  const [idx, setIdx] = useState(0);

  const next = useCallback((e) => {
    e?.stopPropagation();
    setIdx(i => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback((e) => {
    e?.stopPropagation();
    setIdx(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance — pauses while card is flipped
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, images.length, next]);

  // If no images array or all entries missing, show SVG fallback
  const hasImages = images && images.length > 0;

  return (
    <div className="carousel">
      {/* ── Slides ── */}
      <div className="carousel__track">
        {hasImages ? (
          images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${name} screenshot ${i + 1}`}
              className={`carousel__img${i === idx ? " carousel__img--active" : ""}`}
            />
          ))
        ) : (
          /* SVG fallback when no images provided */
          <div className="carousel__fallback" style={{ background: gradient }}>
            <svg className="carousel__svg" viewBox="0 0 200 130" aria-hidden="true">
              <line x1="0" y1="30" x2="60" y2="30" stroke={color} strokeWidth="0.8"/>
              <line x1="60" y1="30" x2="60" y2="60" stroke={color} strokeWidth="0.8"/>
              <line x1="60" y1="60" x2="140" y2="60" stroke={color} strokeWidth="0.8"/>
              <line x1="140" y1="60" x2="140" y2="100" stroke={color} strokeWidth="0.8"/>
              <line x1="140" y1="100" x2="200" y2="100" stroke={color} strokeWidth="0.8"/>
              <line x1="30" y1="0" x2="30" y2="30" stroke={color} strokeWidth="0.8"/>
              <line x1="170" y1="100" x2="170" y2="130" stroke={color} strokeWidth="0.8"/>
              <line x1="100" y1="0" x2="100" y2="20" stroke={color} strokeWidth="0.8"/>
              <line x1="100" y1="20" x2="160" y2="20" stroke={color} strokeWidth="0.8"/>
              <circle cx="60" cy="30" r="2.5" fill={color}/>
              <circle cx="60" cy="60" r="2.5" fill={color}/>
              <circle cx="140" cy="60" r="2.5" fill={color}/>
              <circle cx="140" cy="100" r="2.5" fill={color}/>
              <circle cx="100" cy="20" r="2.5" fill={color}/>
            </svg>
            <span className="carousel__icon" style={{ filter:`drop-shadow(0 0 12px ${color})` }}>{icon}</span>
          </div>
        )}

        {/* gradient overlay so text below stays readable */}
        <div className="carousel__fade-bottom" style={{ background:`linear-gradient(to top, ${color}22, transparent)` }}/>
      </div>

      {/* ── Arrows — only when >1 image ── */}
      {hasImages && images.length > 1 && (
        <>
          <button className="carousel__arrow carousel__arrow--prev" onClick={prev} aria-label="Previous image">‹</button>
          <button className="carousel__arrow carousel__arrow--next" onClick={next} aria-label="Next image">›</button>

          {/* dot indicators */}
          <div className="carousel__dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel__dot${i === idx ? " carousel__dot--active" : ""}`}
                style={ i === idx ? { background: color } : {} }
                onClick={e => { e.stopPropagation(); setIdx(i); }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          {/* slide counter */}
          <span className="carousel__counter">{idx + 1} / {images.length}</span>
        </>
      )}
    </div>
  );
}

/* ── Main FlipCard ── */
export default function FlipCard({ project, delay = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const fadeRef = useFadeIn();

  return (
    <div ref={fadeRef} className="fade" style={{ transitionDelay:`${delay}s` }}>
      <div
        className="flipcard"
        onClick={() => setFlipped(f => !f)}
        role="button"
        aria-label={`${project.name} - click to see details`}
      >
        <div className={`flipcard__inner${flipped ? " flipcard__inner--flipped" : ""}`}>

          {/* ════ FRONT ════ */}
          <div className="flipcard__face flipcard__face--front" style={{ borderColor:`${project.color}30` }}>
            <CardCarousel
              images={project.images}
              color={project.color}
              gradient={project.gradient}
              icon={project.icon}
              name={project.name}
              paused={flipped}
            />
            <p className="flipcard__year">{project.year} · {project.category}</p>
            <h3 className="flipcard__name">{project.name}</h3>
            <p className="flipcard__tagline">{project.tagline}</p>
            <span className="flipcard__hint">↺ flip for details</span>
          </div>

          {/* ════ BACK ════ */}
          <div className="flipcard__face flipcard__face--back" style={{ borderColor:`${project.color}30` }}>
            <h3 className="flipcard__back-name">{project.name}</h3>
            <p className="flipcard__back-desc">{project.desc}</p>
            <ul className="flipcard__back-bullets">
              {project.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
            <div className="flipcard__back-tags">
              {project.tech.map(t => <span key={t} className="flipcard__back-tag">{t}</span>)}
            </div>
            <div className="flipcard__back-actions">
              <a href={project.github} target="_blank" rel="noreferrer" className="flipcard__back-btn" onClick={e => e.stopPropagation()}>
                ⌥ GitHub
              </a>
            </div>
            <p className="flipcard__back-hint">↺ click to flip back</p>
          </div>

        </div>
      </div>
    </div>
  );
}
