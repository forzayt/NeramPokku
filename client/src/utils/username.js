const adjectives = [
  'quiet', 'lost', 'blue', 'cosmic', 'silent',
  'neon', 'distant', 'mellow', 'shadow', 'crimson',
  'forgotten', 'misty', 'solitary', 'velvet', 'amber',
  'wandering', 'gentle', 'hidden', 'frozen', 'holographic'
];

const nouns = [
  'fox', 'pixel', 'orbit', 'echo', 'nebula',
  'drifter', 'voyager', 'nomad', 'wave', 'ghost',
  'spark', 'mirage', 'cloud', 'stargazer', 'dreamer',
  'phoenix', 'seeker', 'feather', 'breeze', 'pulse'
];

export function generateRandomUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}_${noun}`;
}

export function getAnonymousUsername() {
  const cached = localStorage.getItem('nerampokku_username');
  if (cached) return cached;

  const username = generateRandomUsername();
  localStorage.setItem('nerampokku_username', username);
  return username;
}

