import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export function EnergyOrb() {
    const meshRef = useRef<THREE.Mesh>(null);
    const charge = useStore(s => s.bloodDemonCharge);
    const active = useStore(s => s.isBloodDemonActive);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = t * 0.5;
        meshRef.current.rotation.y = t * 0.3;

        const scale = 1 + (charge / 100) * 0.8;
        meshRef.current.scale.setScalar(scale);

        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        if (active) {
            mat.opacity = 0.8;
            mat.color.setHex(0xFF0000);
        } else {
            mat.opacity = charge > 0 ? (charge / 100) * 0.6 : 0;
            mat.color.setHex(0x8B0000);
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.25, 24, 24]} />
            <meshBasicMaterial color={0x8B0000} transparent opacity={0} wireframe />
        </mesh>
    );
}
