import { useState, useEffect } from 'react';

export default function ReturnToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (!visible) return null;
  return (
    <button
      className="return-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Return to top"
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}
