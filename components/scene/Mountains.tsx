'use client';

export function Mountains() {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-[32vh] z-10 pointer-events-none">
            <svg viewBox="0 0 1440 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
                <defs>
                    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0a0018" stopOpacity="0.96" />
                        <stop offset="100%" stopColor="#040410" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <path d="M0,300 L0,200 L120,120 L240,180 L360,80 L480,160 L600,60 L680,130 L760,40 L860,140 L960,70 L1080,150 L1200,90 L1320,170 L1440,100 L1440,300 Z" fill="url(#mg)" />
                <path d="M0,300 L0,250 L100,215 L220,230 L340,190 L460,220 L580,180 L700,215 L820,172 L940,208 L1060,175 L1180,210 L1300,182 L1440,205 L1440,300 Z" fill="#040410" fillOpacity="0.85" />
            </svg>
        </div>
    );
}
