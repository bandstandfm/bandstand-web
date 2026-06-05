'use client';
import { useEffect, useRef, useState } from 'react';

/** Background jazz piano video — bundled locally (same clip as the iOS
 * login screen so the marketing site feels like one product). Muted +
 * autoplay-friendly per browser rules. Fades in to avoid black flash. */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = 0.85;
    v.play().catch(() => { /* iOS Safari sometimes blocks until user gesture */ });
  }, []);

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setLoaded(true)}
      >
        <source src="/login_bg.mp4" type="video/mp4" />
      </video>
      {/* Black underlay while video loads */}
      <div className={`absolute inset-0 bg-bg transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/55 via-black/15 to-transparent pointer-events-none" />
      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-transparent pointer-events-none" />
    </>
  );
}
