import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CONSTANTS } from '@/lib/constants';
import { SpawnEffectDetail } from '@/hooks/useThreeEffects';

const dummy = new THREE.Object3D();

export function ParticleSystem() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const poolIdx = useRef(0);

    const particleData = useMemo(() => {
        return Array.from({ length: CONSTANTS.PARTICLE_POOL_SIZE }, () => ({
            life: 0,
            decay: 0,
            velocity: new THREE.Vector3(),
            position: new THREE.Vector3(),
            scale: 1,
        }));
    }, []);

    const colorArray = useMemo(() => new Float32Array(CONSTANTS.PARTICLE_POOL_SIZE * 3), []);

    useEffect(() => {
        const onSpawn = (e: any) => {
            const { x, y, style, type } = e.detail as SpawnEffectDetail;
            if (!meshRef.current) return;

            const count = type === 'blood-demon' ? 40 : 25;
            const originX = (x / window.innerWidth) * 2 - 1;
            const originY = -(y / window.innerHeight) * 2 + 1;
            const originPos = new THREE.Vector3(originX * 5.2, originY * 3.2, 0);

            const tempColor = new THREE.Color();

            for (let i = 0; i < count; i++) {
                const id = poolIdx.current;
                const p = particleData[id];

                p.life = 1;
                p.decay = 0.01 + Math.random() * 0.02;
                p.position.set(
                    originPos.x + (Math.random() - 0.5) * 0.4,
                    originPos.y + (Math.random() - 0.5) * 0.4,
                    (Math.random() - 0.5) * 0.2
                );

                const angle = Math.random() * Math.PI * 2;
                const elev = (Math.random() - 0.5) * Math.PI;
                const spd = 0.035 + Math.random() * 0.15;

                p.velocity.set(
                    Math.cos(elev) * Math.cos(angle) * spd,
                    Math.cos(elev) * Math.sin(angle) * spd,
                    Math.sin(elev) * spd
                );

                const colStr = style.particles[Math.floor(Math.random() * style.particles.length)];
                tempColor.set(colStr);
                colorArray[id * 3] = tempColor.r;
                colorArray[id * 3 + 1] = tempColor.g;
                colorArray[id * 3 + 2] = tempColor.b;

                p.scale = 0.5 + Math.random() * 1.5;
                poolIdx.current = (poolIdx.current + 1) % CONSTANTS.PARTICLE_POOL_SIZE;
            }
            meshRef.current.geometry.attributes.color.needsUpdate = true;
        };

        window.addEventListener('spawn-effect', onSpawn);
        return () => window.removeEventListener('spawn-effect', onSpawn);
    }, [particleData, colorArray]);

    useFrame(() => {
        if (!meshRef.current) return;
        let needsUpdate = false;

        for (let i = 0; i < CONSTANTS.PARTICLE_POOL_SIZE; i++) {
            const p = particleData[i];
            if (p.life > 0) {
                needsUpdate = true;
                p.life -= p.decay;
                p.position.add(p.velocity);

                dummy.position.copy(p.position);
                dummy.scale.setScalar(p.scale * Math.max(0, p.life));
                dummy.updateMatrix();

                meshRef.current.setMatrixAt(i, dummy.matrix);
            } else if (p.life > -1) {
                p.life = -1;
                dummy.scale.setScalar(0);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, CONSTANTS.PARTICLE_POOL_SIZE]}>
            <icosahedronGeometry args={[0.04, 0]}>
                <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
            </icosahedronGeometry>
            <meshBasicMaterial vertexColors transparent opacity={0.8} />
        </instancedMesh>
    );
}
