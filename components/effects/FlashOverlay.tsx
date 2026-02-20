'use client';

import { useEffect, useState } from 'react';

export function FlashOverlay() {
    const [bg, setBg] = useState('');

    useEffect(() => {
        const onFlash = (e: any) => {
            setBg(e.detail.css);
            setTimeout(() => setBg(''), 100); // stay solid for a split frame, then react class handles fade
        };
        window.addEventListener('screen-flash', onFlash);
        return () => window.removeEventListener('screen-flash', onFlash);
    }, []);

    return (
        <div
            className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-700 ease-out ${bg ? 'opacity-100 duration-0' : 'opacity-0'}`}
            style={{ background: bg || 'transparent' }}
        />
    );
}
