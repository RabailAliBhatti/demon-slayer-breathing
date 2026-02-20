import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CONSTANTS } from '@/lib/constants';

export function StarField() {
    const geometry = useMemo(() => {
        const pos = new Float32Array(CONSTANTS.STAR_COUNT * 3);
        for (let i = 0; i < CONSTANTS.STAR_COUNT; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return geo;
    }, []);

    return (
        <points geometry={geometry}>
            <pointsMaterial color={0xffffff} size={0.03} transparent opacity={0.7} />
        </points>
    );
}
