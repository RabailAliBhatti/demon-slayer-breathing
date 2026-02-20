import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CameraShakeDetail } from '@/hooks/useThreeEffects';

export function SceneController() {
    const { camera } = useThree();
    const shakeData = useRef({ intensity: 0, duration: 0 });

    useEffect(() => {
        const onShake = (e: any) => {
            const { intensity, duration } = e.detail as CameraShakeDetail;
            shakeData.current = { intensity, duration };
        };
        window.addEventListener('camera-shake', onShake);
        return () => window.removeEventListener('camera-shake', onShake);
    }, []);

    useFrame(() => {
        if (shakeData.current.duration > 0) {
            const { intensity } = shakeData.current;
            camera.position.x = (Math.random() - 0.5) * intensity;
            camera.position.y = (Math.random() - 0.5) * intensity;
            shakeData.current.duration -= 1;
        } else {
            camera.position.x = 0;
            camera.position.y = 0;
        }
    });

    return null;
}
