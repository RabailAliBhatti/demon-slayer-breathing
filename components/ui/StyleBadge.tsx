'use client';

import { useStore } from '@/store/useStore';

export function StyleBadge() {
    const currentStyle = useStore(s => s.currentStyle);
    const isLocked = useStore(s => s.isLocked);
    const lockedBreathsRemaining = useStore(s => s.lockedBreathsRemaining);

    return (
        <div className="fixed bottom-7 right-9 z-20 text-right animate-in fade-in slide-in-from-bottom-6 duration-800 delay-[2200ms] fill-mode-forwards max-md:right-6">
            {isLocked && (
                <span className="block text-[0.45rem] tracking-[0.2em] text-[#66BB6A] mb-1 animate-pulse">
                    LOCKED ({lockedBreathsRemaining})
                </span>
            )}
            <span
                className="font-serif text-[0.72rem] tracking-[0.18em] block min-h-[1em] transition-colors duration-300"
                style={{ color: currentStyle.color, textShadow: `0 0 18px ${currentStyle.color}` }}
            >
                {currentStyle.name}
            </span>
            <span className="text-[0.45rem] tracking-[0.3em] text-white/25 block mt-1">
                BREATHING STYLE
            </span>
        </div>
    );
}
