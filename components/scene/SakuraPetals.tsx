'use client';

import { useEffect, useRef } from 'react';

type Petal = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    rs: number;
    sz: number;
    op: number;
    phase: number;
    col: string;
};

export function SakuraPetals() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const petalsRef = useRef<Petal[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = window.innerWidth;
        let H = window.innerHeight;
        let DPR = window.devicePixelRatio || 1;

        const resize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * DPR;
            canvas.height = H * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const mkPetal = (randY: boolean): Petal => {
            const d = Math.random();
            return {
                x: Math.random() * W,
                y: randY ? Math.random() * H : -15,
                vx: (Math.random() - 0.5) * 0.5,
                vy: 0.35 + Math.random() * 1.1 + d * 0.7,
                rot: Math.random() * Math.PI * 2,
                rs: (Math.random() - 0.5) * 0.035,
                sz: 2.5 + Math.random() * 4.5 + d * 3,
                op: 0.15 + d * 0.45,
                phase: Math.random() * Math.PI * 2,
                col: Math.random() < 0.72 ? '#FFB7C5' : '#ffffff',
            };
        };

        if (petalsRef.current.length === 0) {
            for (let i = 0; i < 60; i++) petalsRef.current.push(mkPetal(true));
        }

        const render = (time: number) => {
            ctx.clearRect(0, 0, W, H);

            const pArr = petalsRef.current;
            for (let i = 0; i < pArr.length; i++) {
                const p = pArr[i];
                p.x += p.vx + Math.sin(time * 0.00045 + p.phase) * 0.35;
                p.y += p.vy;
                p.rot += p.rs;

                if (p.y > H + 15) {
                    Object.assign(p, mkPetal(false));
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.globalAlpha = p.op;
                ctx.fillStyle = p.col;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.sz * 0.45, p.sz, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-20 pointer-events-none w-full h-full"
        />
    );
}
