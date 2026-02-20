import { useEffect, useRef } from 'react';
import { HandLandmark, HAND_CONNECTIONS } from '@/lib/gestureClassifier';

interface SkeletonOverlayProps {
    landmarks: HandLandmark[];
    color: string;
}

// Convert any CSS color to rgba with a given alpha
function colorWithAlpha(cssColor: string, alpha: number): string {
    // If it's a hex color like #4FC3F7, convert to rgba
    if (cssColor.startsWith('#')) {
        const hex = cssColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    // If it's already rgba(...), replace the alpha
    if (cssColor.startsWith('rgba')) {
        return cssColor.replace(/,[^,]*\)$/, `,${alpha})`);
    }
    // If it's rgb(...), convert to rgba
    if (cssColor.startsWith('rgb')) {
        return cssColor.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
    }
    return cssColor;
}

export function SkeletonOverlay({ landmarks, color }: SkeletonOverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.parentElement?.offsetWidth || 240;
        canvas.height = canvas.parentElement?.offsetHeight || 180;

        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        if (landmarks.length === 0) return;

        const px = (x: number) => (1 - x) * W;
        const py = (y: number) => y * H;

        ctx.lineWidth = 2;
        for (const [a, b] of HAND_CONNECTIONS) {
            if (!landmarks[a] || !landmarks[b]) continue;
            const ax = px(landmarks[a].x), ay = py(landmarks[a].y);
            const bx = px(landmarks[b].x), by = py(landmarks[b].y);

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);

            const grad = ctx.createLinearGradient(ax, ay, bx, by);
            grad.addColorStop(0, colorWithAlpha(color, 0.8));
            grad.addColorStop(1, colorWithAlpha(color, 0.33));
            ctx.strokeStyle = grad;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.stroke();
        }

        landmarks.forEach((pt, idx) => {
            const x = px(pt.x), y = py(pt.y);
            const isTip = [4, 8, 12, 16, 20].includes(idx);
            const r = isTip ? 5 : 3;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = isTip ? '#ffffff' : color;
            ctx.shadowBlur = isTip ? 12 : 6;
            ctx.shadowColor = color;
            ctx.fill();
        });
    }, [landmarks, color]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    );
}
