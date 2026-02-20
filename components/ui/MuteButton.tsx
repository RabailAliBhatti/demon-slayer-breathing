'use client';

import { useStore } from '@/store/useStore';

export function MuteButton() {
    const isMuted = useStore(s => s.isMuted);
    const toggleMute = useStore(s => s.toggleMute);

    return (
        <button
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="fixed top-6 right-7 z-20 bg-white/5 border border-[rgba(139,0,0,0.3)] text-white/50 text-[1rem] w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(139,0,0,0.15)] hover:border-[#CC0000] hover:text-white animate-in fade-in slide-in-from-top-6 delay-[2400ms] fill-mode-forwards pointer-events-auto"
        >
            {isMuted ? '🔇' : '🔊'}
        </button>
    );
}
