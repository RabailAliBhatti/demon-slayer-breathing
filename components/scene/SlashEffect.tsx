import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { CONSTANTS } from '@/lib/constants';
import { SpawnEffectDetail } from '@/hooks/useThreeEffects';

const SEGMENT_COUNT = 30;

interface SlashData {
    inUse: boolean;
    life: number;
    decay: number;
    positions: Float32Array;
    coreLine: THREE.Line;
    glowLine: THREE.Line;
    coreMat: THREE.LineBasicMaterial;
    glowMat: THREE.LineBasicMaterial;
    geo: THREE.BufferGeometry;
}

export function SlashEffect() {
    const { scene } = useThree();
    const groupRef = useRef<THREE.Group | null>(null);
    const activeSlashes = useRef<SlashData[]>([]);

    const slashPool = useMemo<SlashData[]>(() => {
        const group = new THREE.Group();
        const pool: SlashData[] = [];

        for (let i = 0; i < CONSTANTS.MAX_SLASH_PATHS; i++) {
            const positions = new Float32Array(SEGMENT_COUNT * 3);
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const coreMat = new THREE.LineBasicMaterial({
                color: 0xffffff, transparent: true, opacity: 0,
            });
            const glowMat = new THREE.LineBasicMaterial({
                color: 0xffffff, transparent: true, opacity: 0,
                blending: THREE.AdditiveBlending,
            });

            const coreLine = new THREE.Line(geo, coreMat);
            const glowLine = new THREE.Line(geo, glowMat);
            group.add(coreLine);
            group.add(glowLine);

            pool.push({
                inUse: false, life: 0, decay: 0,
                positions, geo, coreLine, glowLine, coreMat, glowMat
            });
        }

        groupRef.current = group;
        return pool;
    }, []);

    // Add group to scene imperatively
    useEffect(() => {
        if (groupRef.current) {
            scene.add(groupRef.current);
        }
        return () => {
            if (groupRef.current) {
                scene.remove(groupRef.current);
                // Dispose all
                slashPool.forEach(s => {
                    s.geo.dispose();
                    s.coreMat.dispose();
                    s.glowMat.dispose();
                });
            }
        };
    }, [scene, slashPool]);

    useEffect(() => {
        const onSpawn = (e: any) => {
            const { x, y, style, type } = e.detail as SpawnEffectDetail;
            const count = type === 'blood-demon' ? 3 : Math.min(style.slashCount || 1, 3);

            const originX = (x / window.innerWidth) * 2 - 1;
            const originY = -(y / window.innerHeight) * 2 + 1;
            const ox = originX * 5.2;
            const oy = originY * 3.2;

            for (let s = 0; s < count; s++) {
                const slash = slashPool.find(p => !p.inUse);
                if (!slash) return;

                slash.inUse = true;
                slash.life = 1;
                slash.decay = 0.025 + s * 0.005;
                slash.coreMat.color.set(style.color);
                slash.coreMat.opacity = 1;
                slash.glowMat.color.set(style.glow);
                slash.glowMat.opacity = 0.4;

                const spread = count > 1 ? (s / (count - 1) - 0.5) * 1.0 : 0;
                const angle = ((-25 + Math.random() * 50) * Math.PI / 180) + spread * 0.4;
                const len = 4 + Math.random() * 2.5;

                const pos = slash.positions;
                for (let i = 0; i < SEGMENT_COUNT; i++) {
                    const t = i / (SEGMENT_COUNT - 1);
                    pos[i * 3] = ox + (t - 0.5) * len * Math.cos(angle);
                    pos[i * 3 + 1] = oy + (t - 0.5) * len * Math.sin(angle) + Math.sin(t * Math.PI * 2.5) * 0.15;
                    pos[i * 3 + 2] = Math.sin(t * Math.PI) * 0.25 * (s % 2 === 0 ? 1 : -1);
                }
                slash.geo.attributes.position.needsUpdate = true;

                activeSlashes.current.push(slash);
            }
        };
        window.addEventListener('spawn-effect', onSpawn);
        return () => window.removeEventListener('spawn-effect', onSpawn);
    }, [slashPool]);

    useFrame(() => {
        for (let i = activeSlashes.current.length - 1; i >= 0; i--) {
            const slash = activeSlashes.current[i];
            slash.life -= slash.decay;

            if (slash.life <= 0) {
                slash.inUse = false;
                slash.coreMat.opacity = 0;
                slash.glowMat.opacity = 0;
                activeSlashes.current.splice(i, 1);
            } else {
                slash.coreMat.opacity = slash.life;
                slash.glowMat.opacity = slash.life * 0.4;
            }
        }
    });

    // All rendering is imperative, nothing declarative here
    return null;
}
