import { useCallback } from 'react';
import { BreathStyle } from '../lib/styles';

export type SpawnEffectDetail = {
    type: 'slash' | 'blood-demon';
    x: number;
    y: number;
    style: BreathStyle;
};

export type CameraShakeDetail = {
    intensity: number;
    duration: number; // in frames
};

export function useThreeEffects() {
    const triggerSpawn = useCallback((detail: SpawnEffectDetail) => {
        window.dispatchEvent(new CustomEvent('spawn-effect', { detail }));
    }, []);

    const triggerShake = useCallback((detail: CameraShakeDetail) => {
        window.dispatchEvent(new CustomEvent('camera-shake', { detail }));
    }, []);

    return { triggerSpawn, triggerShake };
}
