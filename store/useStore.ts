import { create } from 'zustand';
import { STYLES, BreathStyle, BLOOD_DEMON } from '../lib/styles';

interface GameState {
    breathCount: number;
    comboCount: number;
    comboMultiplier: number;
    currentStyle: BreathStyle;
    isLocked: boolean;
    lockedBreathsRemaining: number;
    isBloodDemonActive: boolean;
    isMuted: boolean;
    isCamActive: boolean;
    bloodDemonCharge: number; // 0 to 100

    // Actions
    triggerBreath: () => { style: BreathStyle; combo: number; isBloodDemon: boolean };
    triggerBloodDemon: () => void;
    setCamActive: (active: boolean) => void;
    toggleMute: () => void;
    cycleStyle: () => void;
    setStyle: (style: BreathStyle) => void;
    lockStyle: () => void;
    setCharge: (charge: number) => void;
}

// Simple internal combo tracker
let lastBreathTime = 0;
let recentBreaths = 0;

export const useStore = create<GameState>((set, get) => ({
    breathCount: 0,
    comboCount: 0,
    comboMultiplier: 1,
    currentStyle: STYLES[0],
    isLocked: false,
    lockedBreathsRemaining: 0,
    isBloodDemonActive: false,
    isMuted: false,
    isCamActive: false,
    bloodDemonCharge: 0,

    triggerBreath: () => {
        const now = performance.now();
        const state = get();

        // Combo Logic
        let nCombo = state.comboCount;
        if (now - lastBreathTime < 1500) {
            recentBreaths++;
            nCombo++;
        } else {
            recentBreaths = 1;
            nCombo = 0;
        }
        lastBreathTime = now;

        let multiplier = 1;
        let autoTriggerBlood = false;

        if (recentBreaths >= 3 && now - lastBreathTime < 3000) multiplier = 2;
        if (recentBreaths >= 5 && now - lastBreathTime < 4000) multiplier = 3;
        if (recentBreaths >= 7 && now - lastBreathTime < 5000) autoTriggerBlood = true;

        if (autoTriggerBlood) {
            get().triggerBloodDemon();
            return { style: BLOOD_DEMON, combo: multiplier, isBloodDemon: true };
        }

        const nextCount = state.breathCount + 1;
        let nextStyle = state.currentStyle;

        if (nextCount % 7 === 0) {
            get().triggerBloodDemon();
            return { style: BLOOD_DEMON, combo: multiplier, isBloodDemon: true };
        }

        if (state.lockedBreathsRemaining > 0) {
            set({ lockedBreathsRemaining: state.lockedBreathsRemaining - 1 });
            if (state.lockedBreathsRemaining - 1 === 0) {
                set({ isLocked: false });
            }
        } else {
            // Random style different from current (if combomultiplier >= 3, always switch)
            if (nCombo >= 3 || Math.random() > 0.3) {
                let newStyle;
                do {
                    newStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
                } while (newStyle.name === state.currentStyle.name && STYLES.length > 1);
                nextStyle = newStyle;
            }
        }

        set({
            breathCount: nextCount,
            comboCount: nCombo,
            comboMultiplier: multiplier,
            currentStyle: nextStyle,
            isBloodDemonActive: false
        });

        return { style: nextStyle, combo: multiplier, isBloodDemon: false };
    },

    triggerBloodDemon: () => {
        set((state) => ({
            breathCount: state.breathCount + 1,
            isBloodDemonActive: true,
            bloodDemonCharge: 0,
            comboCount: 0,
        }));
    },

    setCamActive: (active) => set({ isCamActive: active }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    cycleStyle: () => {
        const state = get();
        const idx = STYLES.findIndex(s => s.name === state.currentStyle.name);
        const nextIdx = (idx + 1) % STYLES.length;
        set({ currentStyle: STYLES[nextIdx] });
    },

    setStyle: (style) => set({ currentStyle: style }),

    lockStyle: () => {
        set({ isLocked: true, lockedBreathsRemaining: 5 });
    },

    setCharge: (charge) => set({ bloodDemonCharge: Math.min(100, Math.max(0, charge)) }),
}));
