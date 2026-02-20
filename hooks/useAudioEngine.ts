import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { useStore } from '../store/useStore';

export function useAudioEngine() {
    const isMuted = useStore(state => state.isMuted);
    const isInitialized = useRef(false);
    const ambientGain = useRef<Tone.Gain | null>(null);
    const ambientNodes = useRef<Tone.ToneAudioNode[]>([]);

    const initAudio = useCallback(async () => {
        if (isInitialized.current) return;
        await Tone.start();
        isInitialized.current = true;
        startAmbient();
    }, []);

    const startAmbient = () => {
        if (ambientGain.current) return;

        const gain = new Tone.Gain(0).toDestination();
        gain.gain.rampTo(0.15, 6); // Very subtle ambient
        ambientGain.current = gain;

        const freqs = [55, 110, 165];
        freqs.forEach(f => {
            const osc = new Tone.Oscillator(f, "sine").connect(gain);
            osc.volume.value = -28; // Quiet

            const lfo = new Tone.LFO(0.05, f - 2, f + 2);
            lfo.connect(osc.frequency);
            lfo.start();

            osc.start();
            ambientNodes.current.push(osc, lfo);
        });
    };

    useEffect(() => {
        Tone.Destination.volume.value = isMuted ? -Infinity : -6;
    }, [isMuted]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            ambientNodes.current.forEach(n => n.dispose());
            ambientGain.current?.dispose();
            ambientNodes.current = [];
            ambientGain.current = null;
        };
    }, []);

    const playWater = () => {
        const gain = new Tone.Gain(0.6).toDestination();
        const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).connect(gain);
        const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 }
        }).connect(reverb);

        synth.triggerAttackRelease(["A3", "C4", "E4", "G4"], "16n");
        setTimeout(() => { synth.dispose(); reverb.dispose(); gain.dispose(); }, 2000);
    };

    const playFlame = () => {
        const gain = new Tone.Gain(0.5).toDestination();
        const dist = new Tone.Distortion(0.4).connect(gain);
        const noise = new Tone.NoiseSynth({
            noise: { type: "brown" },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 }
        }).connect(dist);

        const membrane = new Tone.MembraneSynth({
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
        }).connect(gain);

        membrane.triggerAttackRelease("C1", "16n");
        noise.triggerAttackRelease("16n");

        setTimeout(() => { dist.dispose(); noise.dispose(); membrane.dispose(); gain.dispose(); }, 800);
    };

    const playThunder = () => {
        const gain = new Tone.Gain(0.55).toDestination();
        const snap = new Tone.MembraneSynth({
            pitchDecay: 0.008, octaves: 6,
            envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 }
        }).connect(gain);
        const crack = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 }
        }).connect(gain);

        snap.triggerAttackRelease("C2", "32n");
        crack.triggerAttackRelease("32n", "+0.02");

        setTimeout(() => { snap.dispose(); crack.dispose(); gain.dispose(); }, 600);
    };

    const playWind = () => {
        const gain = new Tone.Gain(0.4).toDestination();
        const sweep = new Tone.AutoFilter({ frequency: 0.5, depth: 0.8 }).connect(gain).start();
        const noise = new Tone.NoiseSynth({
            noise: { type: "pink" },
            envelope: { attack: 0.1, decay: 0.4, sustain: 0, release: 0.3 }
        }).connect(sweep);

        noise.triggerAttackRelease("8n");

        setTimeout(() => { sweep.dispose(); noise.dispose(); gain.dispose(); }, 1200);
    };

    const playMoon = () => {
        const gain = new Tone.Gain(0.45).toDestination();
        const reverb = new Tone.Reverb({ decay: 3, wet: 0.5 }).connect(gain);
        const synth = new Tone.PolySynth(Tone.Synth, {
            envelope: { attack: 0.05, decay: 0.8, sustain: 0, release: 0.4 }
        }).connect(reverb);

        synth.triggerAttackRelease(["D2", "F2", "A2", "C3"], "8n");

        setTimeout(() => { reverb.dispose(); synth.dispose(); gain.dispose(); }, 2500);
    };

    const playSun = () => {
        const gain = new Tone.Gain(0.5).toDestination();
        const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.3 }).connect(gain);
        const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.3 }
        }).connect(reverb);

        synth.triggerAttackRelease(["C3", "E3", "G3", "C4", "E4"], "16n");
        setTimeout(() => { reverb.dispose(); synth.dispose(); gain.dispose(); }, 1800);
    };

    const playBlood = () => {
        const gain = new Tone.Gain(0.5).toDestination();
        const crush = new Tone.BitCrusher(4).connect(gain);
        const filter = new Tone.Filter(2000, "lowpass").connect(gain);

        const metal = new Tone.MetalSynth({
            harmonicity: 5.1,
            envelope: { attack: 0.001, decay: 0.4, release: 0.2 }
        }).connect(gain);
        metal.frequency.value = 40;
        const noise = new Tone.NoiseSynth({
            noise: { type: "brown" },
            envelope: { attack: 0.01, decay: 0.8, sustain: 0, release: 0.3 }
        }).connect(filter);
        const screech = new Tone.Synth({
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
        }).connect(crush);

        filter.frequency.rampTo(100, 0.8);
        metal.triggerAttackRelease("C1", "8n");
        noise.triggerAttackRelease("4n");
        screech.triggerAttackRelease("C6", "32n");
        screech.frequency.rampTo("C2", 0.3);

        setTimeout(() => {
            crush.dispose(); filter.dispose();
            metal.dispose(); noise.dispose(); screech.dispose(); gain.dispose();
        }, 2500);
    };

    const triggerSound = useCallback((sound: string) => {
        if (!isInitialized.current) initAudio();
        if (useStore.getState().isMuted) return;

        switch (sound) {
            case 'water': playWater(); break;
            case 'flame': playFlame(); break;
            case 'thunder': playThunder(); break;
            case 'wind': playWind(); break;
            case 'moon': playMoon(); break;
            case 'sun': playSun(); break;
            case 'blood': playBlood(); break;
        }
    }, [initAudio]);

    return { initAudio, triggerSound };
}
