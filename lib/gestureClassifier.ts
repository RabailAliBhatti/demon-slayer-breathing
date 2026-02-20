// Type definition compatible with the MediaPipe unpkg output
export type HandLandmark = { x: number, y: number, z: number };

export const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],           // thumb
    [0, 5], [5, 6], [6, 7], [7, 8],           // index
    [0, 9], [9, 10], [10, 11], [11, 12],      // middle
    [0, 13], [13, 14], [14, 15], [15, 16],    // ring
    [0, 17], [17, 18], [18, 19], [19, 20],    // pinky
    [5, 9], [9, 13], [13, 17],              // palm
];

export const FINGER_PAIRS = {
    thumb: { tip: 4, base: 2 },
    index: { tip: 8, base: 6 },
    middle: { tip: 12, base: 10 },
    ring: { tip: 16, base: 14 },
    pinky: { tip: 20, base: 18 },
};

export function isFingerUp(lm: HandLandmark[], tipIdx: number, baseIdx: number, isThumb = false) {
    if (isThumb) {
        return Math.abs(lm[tipIdx].x - lm[baseIdx].x) > 0.06;
    }
    return lm[tipIdx].y < lm[baseIdx].y - 0.03;
}

export type FingersUpMap = {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
};

export type GestureDetection = {
    name: string;
    color: string;
    icon: string;
};

export function classifyGesture(lm: HandLandmark[], fingersUpMap: FingersUpMap, speed: number): GestureDetection {
    const { thumb, index, middle, ring, pinky } = fingersUpMap;
    const upCount = [index, middle, ring, pinky].filter(Boolean).length;

    if (speed > 0.22) return { name: '⚔ SLASH', color: '#FF4444', icon: '⚔️' };
    if (upCount === 4 && thumb) return { name: '✋ OPEN PALM', color: '#FFE066', icon: '✋' };
    if (upCount === 4 && !thumb) return { name: '🖐 FOUR FINGERS', color: '#4FC3F7', icon: '🖐️' };
    if (index && !middle && !ring && !pinky) return { name: '☝ POINT', color: '#81C784', icon: '☝️' };
    if (index && middle && !ring && !pinky) return { name: '✌ PEACE', color: '#CE93D8', icon: '✌️' };
    if (!index && !middle && !ring && !pinky && !thumb) return { name: '✊ FIST', color: '#FF6B35', icon: '✊' };
    if (thumb && !index && !middle && !ring && pinky) return { name: '🤙 HANG LOOSE', color: '#FFD54F', icon: '🤙' };
    if (upCount === 0 && thumb) return { name: '👍 THUMBS UP', color: '#66BB6A', icon: '👍' };
    if (upCount >= 2) return { name: '🤚 PARTIAL', color: 'rgba(255,183,197,0.8)', icon: '🤚' };
    return { name: '— IDLE', color: 'rgba(255,255,255,0.3)', icon: '🤚' };
}
