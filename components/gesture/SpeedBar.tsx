import { CONSTANTS } from '@/lib/constants';

interface SpeedBarProps {
    speed: number;
}

export function SpeedBar({ speed }: SpeedBarProps) {
    const pct = Math.min(100, Math.round((speed / (CONSTANTS.SWIPE_SPEED_THRESHOLD * 2)) * 100));

    return (
        <div className="bg-[rgba(4,4,20,0.92)] border-t border-[rgba(139,0,0,0.35)] px-3 py-[5px] pt-[7px]">
            <div className="text-[0.38rem] tracking-[0.3em] text-[#FFB7C5]/45 flex justify-between mb-1">
                <span>SWIPE POWER</span>
                <span>{pct}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-sm overflow-hidden">
                <div
                    className="h-full rounded-sm bg-gradient-to-r from-[#8B0000] to-[#FF2222] transition-all duration-100 linear shadow-[0_0_6px_rgba(204,0,0,0.6)]"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
