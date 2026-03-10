import { useState, useEffect, useRef } from "react";

export function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("show"); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function useTypingEffect(words, speed = 80) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    const isFullyTyped = !deleting && charIdx === current.length;
    const isFullyDeleted = deleting && charIdx === 0;
    const delay = deleting ? 40 : isFullyTyped ? 2400 : speed;
    const timer = setTimeout(() => {
      if (!deleting && !isFullyTyped) { setText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
      else if (isFullyTyped) { setDeleting(true); }
      else if (deleting && !isFullyDeleted) { setText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
      else { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
    }, delay);
    return () => clearTimeout(timer);
  }, [text, charIdx, deleting, wordIdx, words, speed]);
  return text;
}
