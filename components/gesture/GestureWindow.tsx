'use client';

import { useEffect, useRef } from 'react';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { useGestureDetection } from '@/hooks/useGestureDetection';
import { useBreathingStyles } from '@/hooks/useBreathingStyles';
import { SkeletonOverlay } from './SkeletonOverlay';
import { SpeedBar } from './SpeedBar';
import { FingerBars } from './FingerBars';
import { useStore } from '@/store/useStore';

export function GestureWindow() {
    const { hasPermission, videoRef, requestCamera, stopCamera } = useCameraPermission();
    const isCamActive = useStore(s => s.isCamActive);
    const { currentStyle, handleBreath, cycleStyle, toggleMute, lockStyle, forceBloodDemon } = useBreathingStyles();
    const setCharge = useStore(s => s.setCharge);
    const charge = useStore(s => s.bloodDemonCharge);

    const { isModelLoaded, gesture, speed, fingersUp, rawLandmarks } = useGestureDetection(videoRef.current, {
        onBreath: handleBreath,
        onCycleStyle: cycleStyle,
        onToggleMute: toggleMute,
        onLockStyle: lockStyle,
        onBloodDemon: forceBloodDemon,
        setCharge
    });

    useEffect(() => {
        if (isCamActive && !hasPermission) {
            requestCamera();
        } else if (!isCamActive && hasPermission) {
            stopCamera();
        }
    }, [isCamActive, hasPermission, requestCamera, stopCamera]);

    if (!isCamActive) return null;

    return (
        <div className="fixed bottom-6 left-6 w-[240px] z-[60] flex flex-col rounded-[14px] overflow-hidden border border-[rgba(139,0,0,0.35)] shadow-[0_0_30px_rgba(139,0,0,0.25),_0_8px_32px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-5 fade-in duration-400">

            {/* Header */}
            <div className="bg-[rgba(139,0,0,0.18)] border-b border-[rgba(139,0,0,0.35)] px-3 py-[7px] flex items-center justify-between">
                <span className="text-[0.42rem] tracking-[0.35em] text-[#FFB7C5]/70 uppercase font-serif">Gesture Vision · 手勢</span>
                <span className="w-[6px] h-[6px] rounded-full bg-[#CC0000] shadow-[0_0_6px_#CC0000] animate-pulse" />
            </div>

            {/* Camera View */}
            <div className="relative w-[240px] h-[180px] bg-black overflow-hidden flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-75"
                />

                {isModelLoaded && rawLandmarks.length > 0 && (
                    <SkeletonOverlay landmarks={rawLandmarks} color={gesture?.color || currentStyle.color} />
                )}

                {/* Gesture Label */}
                <div
                    className="absolute bottom-2 left-0 right-0 text-center font-serif text-[0.65rem] tracking-[0.2em] text-white transition-opacity duration-200 pointer-events-none"
                    style={{ textShadow: `0 0 12px ${gesture?.color || 'transparent'}` }}
                >
                    {gesture?.name || '—'}
                </div>

                {/* Loading State */}
                {!isModelLoaded && (
                    <div className="absolute inset-0 bg-[rgba(4,4,16,0.88)] flex flex-col items-center justify-center gap-2.5 z-10">
                        <div className="w-7 h-7 border-2 border-[rgba(139,0,0,0.3)] border-t-[#CC0000] rounded-full animate-spin" />
                        <div className="text-[0.4rem] tracking-[0.3em] text-[#FFB7C5]/60 text-center font-serif">
                            LOADING MODEL…<br />FIRST LOAD MAY TAKE 10s
                        </div>
                    </div>
                )}

                {/* Blood Demon Charge Overlay */}
                {charge > 0 && (
                    <div
                        className="absolute inset-0 bg-red-600/20 z-20 pointer-events-none transition-opacity mix-blend-screen"
                        style={{ opacity: charge / 100 }}
                    />
                )}
            </div>

            {/* Charge Meter (Only visible if charging) */}
            <div
                className="bg-black border-t border-[rgba(139,0,0,0.35)] transition-all duration-300 overflow-hidden"
                style={{ height: charge > 0 ? '4px' : '0px' }}
            >
                <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_red]"
                    style={{ width: `${charge}%` }}
                />
            </div>

            <SpeedBar speed={speed} />
            <FingerBars fingersUp={fingersUp} />

            {/* Status Row */}
            <div className="bg-[rgba(4,4,20,0.92)] border-t border-[rgba(139,0,0,0.35)] px-3 py-[7px] flex items-center gap-2">
                <span className="text-[0.85rem]">{gesture?.icon || '🤚'}</span>
                <span
                    className="text-[0.42rem] tracking-[0.22em] flex-1 truncate transition-colors duration-200"
                    style={{ color: gesture ? gesture.color : '#FFB7C5' }}
                >
                    {gesture ? 'DETECTED' : 'AWAITING HAND…'}
                </span>
            </div>

        </div>
    );
}
