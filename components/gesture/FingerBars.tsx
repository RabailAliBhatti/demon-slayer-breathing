import { FingersUpMap } from '@/lib/gestureClassifier';

interface FingerBarsProps {
    fingersUp: FingersUpMap;
}

export function FingerBars({ fingersUp }: FingerBarsProps) {
    const data = [
        { key: 'thumb', label: 'THB', active: fingersUp.thumb, activeClass: 'bg-[#FFE066] shadow-[0_0_8px_#FFE06680]' },
        { key: 'index', label: 'IDX', active: fingersUp.index, activeClass: 'bg-[#4FC3F7] shadow-[0_0_8px_#4FC3F780]' },
        { key: 'middle', label: 'MID', active: fingersUp.middle, activeClass: 'bg-[#4FC3F7] shadow-[0_0_8px_#4FC3F780]' },
        { key: 'ring', label: 'RNG', active: fingersUp.ring, activeClass: 'bg-[#4FC3F7] shadow-[0_0_8px_#4FC3F780]' },
        { key: 'pinky', label: 'PNK', active: fingersUp.pinky, activeClass: 'bg-[#4FC3F7] shadow-[0_0_8px_#4FC3F780]' },
    ];

    return (
        <div className="bg-[rgba(4,4,20,0.92)] border-t border-[rgba(139,0,0,0.35)] px-3 py-2 flex items-end justify-around gap-1.5">
            {data.map(f => (
                <div key={f.key} className="flex flex-col items-center gap-1">
                    <div
                        className={`w-[10px] rounded-t-[5px] min-h-[4px] transition-all duration-150 ease-out
              ${f.active ? f.activeClass : 'bg-white/10 h-1'}
              ${f.active && f.key !== 'thumb' ? 'h-[22px]' : ''}
              ${f.active && f.key === 'thumb' ? 'h-[22px]' : ''}
            `}
                    />
                    <span className="text-[0.34rem] tracking-[0.12em] text-white/25 uppercase">
                        {f.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
