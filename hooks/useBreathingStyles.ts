import { useStore } from '../store/useStore';
import { useAudioEngine } from './useAudioEngine';

export function useBreathingStyles() {
    const store = useStore();
    const { triggerSound } = useAudioEngine();

    const handleBreath = () => {
        const result = store.triggerBreath();
        triggerSound(result.style.sound);
    };

    const forceBloodDemon = () => {
        store.triggerBloodDemon();
        triggerSound('blood');
    };

    return {
        ...store,
        handleBreath,
        forceBloodDemon,
        triggerSound
    };
}
