'use client';

import { useEffect, useState } from 'react';

export function StyleAnnounce() {
    const [data, setData] = useState<{ name: string, sub: string, color: string } | null>(null);

    useEffect(() => {
        const onAnnounce = (e: any) => {
            setData(e.detail);
            setTimeout(() => setData(null), 2000); // clear after animation
        };
        window.addEventListener('style-announce', onAnnounce);
        return () => window.removeEventListener('style-announce', onAnnounce);
    }, []);

    if (!data) return null;

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-center pointer-events-none animate-in fade-in zoom-in-125 duration-300 slide-out-to-top-4 fade-out zoom-out-90 ease-out fill-mode-forwards">
            <span
                className="font-serif text-[clamp(1.1rem,3vw,2rem)] tracking-[0.2em] block"
                style={{ color: data.color, textShadow: `0 0 25px ${data.color}, 0 0 70px ${data.color}55` }}
            >
                {data.name}
            </span>
            <span className="text-[clamp(0.5rem,1.2vw,0.68rem)] tracking-[0.45em] text-white/55 block mt-2">
                {data.sub}
            </span>
        </div>
    );
}
