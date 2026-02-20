export const AUDIO_PROFILES = {
    water: "water",
    flame: "flame",
    thunder: "thunder",
    wind: "wind",
    moon: "moon",
    sun: "sun",
    blood: "blood",
} as const;

export type AudioProfileKey = keyof typeof AUDIO_PROFILES;
