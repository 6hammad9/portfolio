import { useFadeIn } from "../hooks";
export default function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`fade ${className}`.trim()} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}
