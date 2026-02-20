'use client';

export function Branding() {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 text-center animate-in fade-in slide-in-from-bottom-6 delay-[2400ms] fill-mode-forwards pointer-events-auto">
            <span className="text-[0.6rem] tracking-[0.35em] text-[#FFB7C5] block mb-1.5 opacity-75">
                DEMON SLAYER
            </span>
            <div className="flex gap-3.5 justify-center">
                <a href="https://github.com/RabailAliBhatti/demon-slayer-breathing" target="_blank" rel="noreferrer" className="text-[0.48rem] tracking-[0.2em] text-[#8B0000]/70 no-underline transition-all duration-250 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                    GitHub
                </a>
            </div>
        </div>
    );
}
