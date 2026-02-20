'use client';

import Link from 'next/link';
import { STYLES } from '@/lib/styles';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function StylesPage() {
    const setStyle = useStore(s => s.setStyle);
    const router = useRouter();

    const handleSelect = (idx: number) => {
        setStyle(STYLES[idx]);
        router.push('/');
    };

    return (
        <div className="min-h-screen w-full bg-[#040410] overflow-y-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">

                <header className="mb-12 text-center pointer-events-none">
                    <Link href="/" className="inline-block pointer-events-auto text-[#FFB7C5]/50 text-[0.6rem] tracking-[0.3em] hover:text-[#FFB7C5] transition-colors mb-6 pb-2 border-b border-[#FFB7C5]/20">
                        ← RETURN TO TRAINING
                    </Link>
                    <h1 className="font-serif text-3xl md:text-5xl text-white tracking-[0.1em] drop-shadow-[0_0_20px_rgba(204,0,0,0.5)]">
                        BREATHING STYLES
                    </h1>
                    <p className="text-[#FFB7C5]/60 tracking-[0.2em] text-[0.6rem] mt-4 font-serif">
                        SELECT A FORM TO MASTER
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {STYLES.map((style, i) => (
                        <div
                            key={i}
                            onClick={() => handleSelect(i)}
                            className="group relative h-[250px] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                            style={{ perspective: '1000px' }}
                        >
                            {/* Background Glow */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity group-hover:opacity-60"
                            />
                            <div
                                className="absolute inset-0 transition-opacity duration-500 opacity-20 group-hover:opacity-40"
                                style={{ background: `radial-gradient(circle at center, ${style.glow} 0%, transparent 70%)` }}
                            />

                            {/* Content */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-6 pointer-events-none transform transition-transform duration-500 group-hover:translate-z-10 text-center">
                                <span className="text-[0.45rem] tracking-[0.4em] text-white/50 block mb-2">
                                    FORM PREVIEW
                                </span>
                                <h3
                                    className="font-serif text-xl tracking-[0.1em] transition-all duration-300 group-hover:scale-110"
                                    style={{ color: style.color, textShadow: `0 0 15px ${style.glow}` }}
                                >
                                    {style.name}
                                </h3>
                            </div>

                            {/* Top accent line */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1 z-20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                style={{ backgroundColor: style.color, boxShadow: `0 0 10px ${style.glow}` }}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
