'use client';

import { useStore } from '@/store/useStore';

export function CamButton() {
    const isCamActive = useStore(s => s.isCamActive);
    const setCamActive = useStore(s => s.setCamActive);

    return (
        <button
            onClick={(e) => { e.stopPropagation(); setCamActive(!isCamActive); }}
            className={`fixed top-6 left-7 z-20 border text-[0.5rem] tracking-[0.15em] px-3.5 py-2 rounded-full cursor-pointer transition-all duration-200 animate-in fade-in slide-in-from-top-6 delay-[2400ms] fill-mode-forwards pointer-events-auto whitespace-nowrap
        ${isCamActive
                    ? 'border-[#FFB7C5] text-[#FFB7C5] bg-[#FFB7C5]/10 hover:bg-[#FFB7C5]/20'
                    : 'bg-white/5 border-[rgba(139,0,0,0.3)] text-white/50 hover:bg-[rgba(139,0,0,0.15)] hover:border-[#CC0000] hover:text-white'
                }`}
        >
            📷 &nbsp;HAND GESTURES
        </button>
    );
}
