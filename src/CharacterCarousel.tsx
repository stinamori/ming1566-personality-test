import {useEffect, useRef, useState} from 'react';
import portraits from './portraits.json';

const AUTOPLAY_MS = 2400;

export function CharacterCarousel() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef<{x: number; y: number} | null>(null);

  function advance(direction: number) {
    setIndex(previous => (previous + direction + portraits.length) % portraits.length);
  }

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (hovered || focused || dragging || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) advance(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [hovered, focused, dragging, reducedMotion, index]);

  return <section className="hero-art" aria-label="大明人物轮播" aria-roledescription="轮播"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);}}>
    <div className="portrait-track" tabIndex={0} aria-label="人物展示，可左右滑动或使用方向键切换"
      onKeyDown={e => {if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); advance(e.key === 'ArrowLeft' ? -1 : 1);}}}
      onPointerDown={e => {
        pointerStart.current = {x:e.clientX,y:e.clientY};
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerUp={e => {
        const start = pointerStart.current;
        pointerStart.current = null;
        setDragging(false);
        if (!start) return;
        const dx = e.clientX - start.x;
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(e.clientY - start.y)) advance(dx < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {pointerStart.current = null; setDragging(false);}}>
      {portraits.map((person, i) => {
        let offset = (i - index + portraits.length) % portraits.length;
        if (offset > portraits.length / 2) offset -= portraits.length;
        if (Math.abs(offset) > 2) return null;
        return <div className="portrait-slide" data-position={offset} key={person.name}
          role="group" aria-roledescription="人物" aria-label={`${i + 1} / ${portraits.length} · ${person.name === '世子' ? '隐藏款' : person.name}`} aria-hidden={offset !== 0}>
          {person.name === '世子' ? <div className="mystery-portrait" role="img" aria-label="问号隐藏款"><span aria-hidden="true">?</span><strong>隐藏款</strong></div> : <img src={person.avatar} alt={person.name} draggable={false}/>}
        </div>;
      })}
    </div>
    <div className="art-caption">大明众生相<span>你是哪一种？</span></div>
  </section>;
}
