'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export function BreathCounter() {
    const breathCount = useStore(s => s.breathCount);
    const comboMultiplier = useStore(s => s.comboMultiplier);
    const [pop, setPop] = useState(false);

    useEffect(() => {
        if (breathCount > 0) {
            setPop(true);
            const t = setTimeout(() => setPop(false), 200);
            return () => clearTimeout(t);
        }
    }, [breathCount]);

    return (
        <div className="fixed bottom-7 left-[280px] z-20 animate-in fade-in slide-in-from-bottom-6 duration-800 delay-[2200ms] fill-mode-forwards max-md:left-6">

            {/* Combo Multiplier Text */}
            {comboMultiplier > 1 && (
                <div className="absolute -top-10 left-0 text-yellow-400 font-serif text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(255,200,0,0.8)] animate-in fade-in zoom-in duration-300">
                    {comboMultiplier}x COMBO
                </div>
            )}

            <span className="text-[0.5rem] tracking-[0.3em] text-[#FFB7C5]/60 block mb-[3px]">
                TOTAL BREATHS
            </span>
            <span
                className={`font-serif text-[1.7rem] text-white drop-shadow-[0_0_20px_rgba(139,0,0,0.9)] block transition-transform duration-150 ease-out ${pop ? 'scale-150' : 'scale-100'}`}
            >
                {breathCount}
            </span>
        </div>
    );
}
