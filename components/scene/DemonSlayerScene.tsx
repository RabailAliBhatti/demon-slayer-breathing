'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Glitch } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { StarField } from './StarField';
import { Mountains } from './Mountains';
import { SlashEffect } from './SlashEffect';
import { ParticleSystem } from './ParticleSystem';
import { EnergyOrb } from './EnergyOrb';
import { SakuraPetals } from './SakuraPetals';
import { SceneController } from './SceneController';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';

export function DemonSlayerScene() {
    const isBloodDemonActive = useStore(state => state.isBloodDemonActive);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
                dpr={[1, 2]}
            >
                <SceneController />

                <Suspense fallback={null}>
                    <StarField />
                    <EnergyOrb />
                    <ParticleSystem />
                    <SlashEffect />
                </Suspense>

                <EffectComposer multisampling={0}>
                    <Bloom
                        luminanceThreshold={0.3}
                        luminanceSmoothing={0.9}
                        intensity={1.2}
                    />
                    <ChromaticAberration
                        blendFunction={BlendFunction.NORMAL}
                        offset={[0.002, 0.002] as any}
                        radialModulation={false}
                        modulationOffset={0}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                    <Glitch
                        delay={new THREE.Vector2(0, 0)}
                        duration={new THREE.Vector2(0.2, 0.4)}
                        strength={new THREE.Vector2(0.1, 0.3)}
                        active={isBloodDemonActive}
                        ratio={0.8}
                    />
                </EffectComposer>
            </Canvas>
            <SakuraPetals />
            <Mountains />
        </div>
    );
}
