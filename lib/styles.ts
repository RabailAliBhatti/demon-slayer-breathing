export const STYLES = [
  { name: 'WATER BREATHING', announce: 'WATER BREATHING', formEn: 'FIRST FORM: WATER SURFACE SLASH', color: '#4FC3F7', secondary: '#0077B6', glow: '#00B4D8', particles: ['#4FC3F7', '#A8DADC', '#ffffff', '#90E0EF'], slashCount: 1, sound: 'water' },
  { name: 'FLAME BREATHING', announce: 'FLAME BREATHING', formEn: 'FIRST FORM: UNKNOWING FIRE', color: '#FF6B35', secondary: '#CC0000', glow: '#FF4500', particles: ['#FF6B35', '#FFD700', '#CC0000', '#FF8C00'], slashCount: 1, sound: 'flame' },
  { name: 'THUNDER BREATHING', announce: 'THUNDER BREATHING', formEn: 'FIRST FORM: THUNDERCLAP AND FLASH', color: '#FFE066', secondary: '#FFA000', glow: '#FFD700', particles: ['#FFE066', '#FFFFFF', '#FFD700', '#FFF9C4'], slashCount: 3, sound: 'thunder' },
  { name: 'WIND BREATHING', announce: 'WIND BREATHING', formEn: 'FIRST FORM: DUST WHIRLWIND CUTTER', color: '#81C784', secondary: '#2E7D32', glow: '#66BB6A', particles: ['#81C784', '#C8E6C9', '#A5D6A7', '#ffffff'], slashCount: 2, sound: 'wind' },
  { name: 'MOON BREATHING', announce: 'MOON BREATHING', formEn: 'FIRST FORM: DARK MOON, EVENING PALACE', color: '#CE93D8', secondary: '#6A1B9A', glow: '#AB47BC', particles: ['#CE93D8', '#E1BEE7', '#9C27B0', '#ffffff'], slashCount: 1, sound: 'moon' },
  { name: 'SUN BREATHING', announce: 'SUN BREATHING', formEn: 'DANCE OF THE FIRE GOD · WALTZ', color: '#FFD54F', secondary: '#E65100', glow: '#FFCA28', particles: ['#FFD54F', '#FFECB3', '#FF8F00', '#FFFFFF'], slashCount: 5, sound: 'sun' },
];

export const BLOOD_DEMON = {
  name: 'BLOOD DEMON ART', announce: 'BLOOD DEMON ART', formEn: '悪鬼滅殺 · DEVOUR ALL DEMONS',
  color: '#CC0000', secondary: '#8B0000', glow: '#FF2222',
  particles: ['#CC0000', '#FF4444', '#8B0000', '#FFB7C5'], slashCount: 4, sound: 'blood',
};

export type BreathStyle = typeof STYLES[0];
