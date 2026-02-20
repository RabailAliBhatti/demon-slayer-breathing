'use client';

import { useStore } from '@/store/useStore';

export function BloodDemonEvent() {
    const active = useStore(s => s.isBloodDemonActive);

    return (
        <div
            className={`fixed inset-0 z-10 pointer-events-none transition-opacity duration-1000 mix-blend-multiply ${active ? 'opacity-100' : 'opacity-0'}`}
            style={{
                background: 'radial-gradient(circle at center, transparent 30%, rgba(139,0,0,0.4) 80%, rgba(50,0,0,0.8) 100%)'
            }}
        />
    );
}
