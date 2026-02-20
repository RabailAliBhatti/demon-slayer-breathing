import { useEffect, useRef, useState, useCallback } from 'react';
import { isFingerUp, FINGER_PAIRS, classifyGesture, FingersUpMap, GestureDetection, HandLandmark } from '../lib/gestureClassifier';
import { CONSTANTS } from '../lib/constants';

declare global {
    interface Window {
        Hands: any;
    }
}

interface GestureHooks {
    onBreath: () => void;
    onCycleStyle: () => void;
    onToggleMute: () => void;
    onLockStyle: () => void;
    onBloodDemon: () => void;
    setCharge: (charge: number) => void;
}

// Helper: wait for window.Hands to be available (script loaded from CDN)
function waitForHands(timeout = 15000): Promise<boolean> {
    return new Promise((resolve) => {
        if (window.Hands) { resolve(true); return; }
        const start = Date.now();
        const check = setInterval(() => {
            if (window.Hands) { clearInterval(check); resolve(true); }
            else if (Date.now() - start > timeout) { clearInterval(check); resolve(false); }
        }, 200);
    });
}

export function useGestureDetection(videoEl: HTMLVideoElement | null, hooks: GestureHooks) {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [gesture, setGesture] = useState<GestureDetection | null>(null);
    const [speed, setSpeed] = useState(0);
    const [fingersUp, setFingersUp] = useState<FingersUpMap>({ thumb: false, index: false, middle: false, ring: false, pinky: false });
    const [rawLandmarks, setRawLandmarks] = useState<HandLandmark[]>([]);

    const handsRef = useRef<any>(null);
    const rafRef = useRef<number>(0);

    const prevWrist = useRef<{ x: number, y: number, time: number } | null>(null);
    const swipeBuffer = useRef<number[]>([]);
    const lastGestureTime = useRef<number>(0);

    // Timers
    const openPalmStart = useRef<number>(0);
    const fistStart = useRef<number>(0);

    const onResults = useCallback((results: any) => {
        const now = performance.now();

        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            setGesture(null);
            setSpeed(0);
            setRawLandmarks([]);
            prevWrist.current = null;
            openPalmStart.current = 0;
            fistStart.current = 0;
            hooks.setCharge(0);
            return;
        }

        const lm = results.multiHandLandmarks[0] as HandLandmark[];
        setRawLandmarks(lm);

        // Calculate Speed
        let currentSpeed = 0;
        const wrist = lm[0];
        if (prevWrist.current) {
            const dx = wrist.x - prevWrist.current.x;
            const dy = wrist.y - prevWrist.current.y;
            const dt = now - prevWrist.current.time;
            if (dt > 0) {
                const instSpeed = Math.sqrt(dx * dx + dy * dy) / (dt / 1000);
                swipeBuffer.current.push(instSpeed);
                if (swipeBuffer.current.length > 5) swipeBuffer.current.shift();
                currentSpeed = swipeBuffer.current.reduce((a, b) => a + b, 0) / swipeBuffer.current.length;
            }
        }
        prevWrist.current = { x: wrist.x, y: wrist.y, time: now };
        setSpeed(currentSpeed);

        // Fingers state
        const thumbMap = {
            thumb: isFingerUp(lm, FINGER_PAIRS.thumb.tip, FINGER_PAIRS.thumb.base, true),
            index: isFingerUp(lm, FINGER_PAIRS.index.tip, FINGER_PAIRS.index.base),
            middle: isFingerUp(lm, FINGER_PAIRS.middle.tip, FINGER_PAIRS.middle.base),
            ring: isFingerUp(lm, FINGER_PAIRS.ring.tip, FINGER_PAIRS.ring.base),
            pinky: isFingerUp(lm, FINGER_PAIRS.pinky.tip, FINGER_PAIRS.pinky.base),
        };
        setFingersUp(thumbMap);

        const detected = classifyGesture(lm, thumbMap, currentSpeed);
        setGesture(detected);

        // Action Dispatcher
        if (now - lastGestureTime.current > 600) {
            if (detected.name === '⚔ SLASH') {
                hooks.onBreath();
                lastGestureTime.current = now;
                openPalmStart.current = 0;
                fistStart.current = 0;
            }
            else if (detected.name === '✌ PEACE') {
                hooks.onToggleMute();
                lastGestureTime.current = now;
            }
            else if (detected.name === '👍 THUMBS UP') {
                hooks.onLockStyle();
                lastGestureTime.current = now;
            }
        }

        // Open Palm hold (cycle style)
        if (detected.name === '✋ OPEN PALM') {
            if (openPalmStart.current === 0) openPalmStart.current = now;
            else if (now - openPalmStart.current > CONSTANTS.OPEN_PALM_HOLD_TIME) {
                hooks.onCycleStyle();
                openPalmStart.current = 0;
                lastGestureTime.current = now;
            }
        } else {
            openPalmStart.current = 0;
        }

        // Fist hold (charge meter)
        if (detected.name === '✊ FIST') {
            if (fistStart.current === 0) fistStart.current = now;
            const elapsed = now - fistStart.current;
            const chg = Math.min(100, (elapsed / CONSTANTS.CHARGE_HOLD_TIME) * 100);
            hooks.setCharge(chg);
        } else {
            if (fistStart.current > 0) {
                const elapsed = (now - fistStart.current);
                if (elapsed >= CONSTANTS.CHARGE_HOLD_TIME) {
                    hooks.onBloodDemon();
                    lastGestureTime.current = now;
                }
                hooks.setCharge(0);
                fistStart.current = 0;
            }
        }
    }, [hooks]);

    useEffect(() => {
        if (!videoEl) return;

        let active = true;

        const init = async () => {
            // Wait for the MediaPipe script to load from CDN
            const loaded = await waitForHands();
            if (!loaded || !active) {
                console.warn('[GestureDetection] MediaPipe Hands script did not load from CDN.');
                return;
            }

            if (!handsRef.current) {
                try {
                    const hands = new window.Hands({
                        locateFile: (file: string) => `https://unpkg.com/@mediapipe/hands@0.4.1646424915/${file}`
                    });
                    hands.setOptions({
                        maxNumHands: 1,
                        modelComplexity: 1,
                        minDetectionConfidence: 0.65,
                        minTrackingConfidence: 0.65
                    });
                    hands.onResults(onResults);
                    handsRef.current = hands;

                    // Warm up model
                    if (videoEl.readyState >= 2) {
                        await hands.send({ image: videoEl });
                    }
                    setIsModelLoaded(true);
                } catch (e) {
                    console.error('[GestureDetection] Failed to initialize MediaPipe:', e);
                    return;
                }
            }

            const processFrame = async () => {
                if (!active) return;
                try {
                    if (videoEl.readyState >= 2 && handsRef.current) {
                        await handsRef.current.send({ image: videoEl });
                    }
                } catch (e) {
                    // Silently skip frame errors
                }
                if (active) {
                    rafRef.current = requestAnimationFrame(processFrame);
                }
            };
            processFrame();
        };

        init();

        return () => {
            active = false;
            cancelAnimationFrame(rafRef.current);
        };
    }, [videoEl, onResults]);

    return { isModelLoaded, gesture, speed, fingersUp, rawLandmarks };
}
