'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useThreeEffects } from '@/hooks/useThreeEffects';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { DemonSlayerScene } from '@/components/scene/DemonSlayerScene';
import { GestureWindow } from '@/components/gesture/GestureWindow';
import { BreathCounter } from '@/components/ui/BreathCounter';
import { StyleAnnounce } from '@/components/ui/StyleAnnounce';
import { StyleBadge } from '@/components/ui/StyleBadge';
import { MuteButton } from '@/components/ui/MuteButton';
import { CamButton } from '@/components/ui/CamButton';
import { Branding } from '@/components/ui/Branding';
import { FlashOverlay } from '@/components/effects/FlashOverlay';
import { BloodDemonEvent } from '@/components/effects/BloodDemonEvent';
import { STYLES } from '@/lib/styles';

export default function Home() {
  const { initAudio, triggerSound } = useAudioEngine();
  const { triggerSpawn, triggerShake } = useThreeEffects();
  const audioInitialized = useRef(false);

  // Title cycling
  useEffect(() => {
    const styleNames = STYLES.map(s => s.name);
    let idx = 0;
    const titleInterval = setInterval(() => {
      document.title = `${styleNames[idx]}`;
      idx = (idx + 1) % styleNames.length;
    }, 4000);
    return () => clearInterval(titleInterval);
  }, []);

  const processBreath = useCallback(async (x: number, y: number) => {
    // Initialize audio on first interaction
    if (!audioInitialized.current) {
      await initAudio();
      audioInitialized.current = true;
    }

    const result = useStore.getState().triggerBreath();
    const style = result.style;

    // Play sound
    triggerSound(style.sound);

    // 3D effects
    triggerSpawn({ type: result.isBloodDemon ? 'blood-demon' : 'slash', x, y, style });
    triggerShake({
      intensity: style.sound === 'thunder' ? 0.1 : style.sound === 'sun' ? 0.08 : (result.isBloodDemon ? 0.2 : 0.05),
      duration: style.sound === 'thunder' ? 38 : (result.isBloodDemon ? 45 : 20)
    });

    // Announce style
    window.dispatchEvent(new CustomEvent('style-announce', {
      detail: { name: style.announce, sub: style.formEn, color: style.color }
    }));

    // Screen flash
    if (result.isBloodDemon) {
      window.dispatchEvent(new CustomEvent('screen-flash', {
        detail: { css: `radial-gradient(circle at ${x}px ${y}px, rgba(139,0,0,0.8) 0%, rgba(60,0,0,0.4) 35%, transparent 70%)` }
      }));
      updateFavicon('red');
    } else {
      window.dispatchEvent(new CustomEvent('screen-flash', {
        detail: { css: `radial-gradient(ellipse at 50% 50%, ${style.glow}44 0%, ${style.glow}18 40%, transparent 75%)` }
      }));
      updateFavicon('normal');
    }
  }, [initAudio, triggerSound, triggerSpawn, triggerShake]);

  const updateFavicon = (state: 'normal' | 'red') => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, Math.PI * 2);
      ctx.fillStyle = state === 'red' ? '#CC0000' : '#4FC3F7';
      ctx.fill();
      link.href = canvas.toDataURL();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    let konami = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        processBreath(window.innerWidth / 2, window.innerHeight / 2);
      }
      konami += e.key.toUpperCase();
      if (konami.length > 20) konami = konami.slice(-20);
      if (konami.endsWith('TANJIRO')) {
        konami = '';
        triggerEasterEgg();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processBreath]);

  const triggerEasterEgg = () => {
    const sun = STYLES.find(s => s.name === 'SUN BREATHING') || STYLES[0];
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        triggerSpawn({ type: 'slash', x: window.innerWidth / 2, y: window.innerHeight / 2, style: sun });
        triggerShake({ intensity: 0.1, duration: 25 });
        triggerSound('sun');
        window.dispatchEvent(new CustomEvent('screen-flash', {
          detail: { css: `radial-gradient(ellipse at 50% 50%, ${sun.glow}66 0%, transparent 75%)` }
        }));
      }, i * 300);
    }
    window.dispatchEvent(new CustomEvent('style-announce', {
      detail: { name: 'HINOKAMI KAGURA', sub: 'EASTER EGG COMBO', color: sun.color }
    }));
  };

  const handleClick = useCallback((e: React.MouseEvent) => {
    processBreath(e.clientX, e.clientY);
  }, [processBreath]);

  const handleTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    processBreath(e.touches[0].clientX, e.touches[0].clientY);
  }, [processBreath]);

  return (
    <main
      className="relative w-full h-screen overflow-hidden"
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      <DemonSlayerScene />
      <FlashOverlay />
      <BloodDemonEvent />

      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-[1px] h-[70px] bg-gradient-to-b from-transparent via-[#8B0000] to-transparent mb-5 animate-in fade-in slide-in-from-top-10 duration-1000 delay-300 fill-mode-forwards" />
        <div className="text-[0.65rem] tracking-[0.5em] text-[#CC0000] drop-shadow-[0_0_20px_rgba(204,0,0,0.5)] mb-3.5 animate-in fade-in slide-in-from-top-5 duration-800 delay-600 fill-mode-forwards font-serif">
          鬼滅の刃 · Kimetsu no Yaiba
        </div>

        <h1 className="font-serif text-[clamp(1.5rem,3.8vw,3rem)] font-black text-white text-center tracking-[0.08em] leading-[1.2] drop-shadow-[0_0_10px_rgba(255,255,255,0.8),_0_0_40px_rgba(139,0,0,0.8)] animate-in fade-in slide-in-from-top-5 duration-1000 delay-900 fill-mode-forwards px-5">
          Demon Slayer
          <span className="block text-[0.42em] tracking-[0.4em] text-[#FFB7C5] drop-shadow-[0_0_20px_rgba(255,183,197,0.5)] mt-2 font-normal">
            Breathing Technique
          </span>
        </h1>

        <div className="flex items-center gap-3.5 my-5.5 animate-in fade-in slide-in-from-bottom-5 duration-800 delay-1300 fill-mode-forwards">
          <div className="w-[70px] h-[1px] bg-gradient-to-r from-transparent to-[#8B0000]" />
          <div className="w-1.5 h-1.5 bg-[#CC0000] rotate-45 shadow-[0_0_10px_#CC0000]" />
          <div className="w-[70px] h-[1px] bg-gradient-to-l from-transparent to-[#8B0000]" />
        </div>

        <div className="text-[clamp(0.55rem,1.3vw,0.8rem)] tracking-[0.4em] text-white/65 animate-in fade-in slide-in-from-bottom-5 duration-800 delay-1600 fill-mode-forwards">
          — Click or Wave Your Hand —
        </div>
        <div className="text-[0.55rem] tracking-[0.2em] text-[#FFB7C5]/35 mt-2.5 animate-in fade-in slide-in-from-bottom-5 duration-800 delay-1900 fill-mode-forwards">
          ⚠ &nbsp; Audio · Visual · Gesture Detection
        </div>

        <div className="hidden md:block text-[0.5rem] tracking-[0.25em] text-[#FFB7C5]/20 mt-1.5 animate-in fade-in slide-in-from-bottom-5 duration-800 delay-[2100ms] fill-mode-forwards">
          ✋ &nbsp; Enable camera top-left to use hand gestures
        </div>
      </div>

      <BreathCounter />
      <StyleBadge />
      <Branding />
      <MuteButton />

      <div className="hidden md:block">
        <CamButton />
        <GestureWindow />
      </div>

      <Link
        href="/styles"
        className="fixed bottom-6 right-7 z-20 bg-white/5 border border-[rgba(139,0,0,0.3)] text-[#FFB7C5]/70 text-[0.5rem] tracking-[0.3em] px-4 py-2 rounded-full transition-all hover:bg-[rgba(139,0,0,0.15)] hover:border-[#CC0000] hover:text-white animate-in fade-in slide-in-from-bottom-6 duration-800 delay-[2500ms] fill-mode-forwards pointer-events-auto max-md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        STYLES
      </Link>

      <StyleAnnounce />
    </main>
  );
}
