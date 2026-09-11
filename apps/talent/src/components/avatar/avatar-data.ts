export const student = {
  name: 'Bilguuntugs',
  streak: 12,
  level: 7,
  xp: 720,
  nextLevelXp: 1000,
};

export const categories = [
  'hair',
  'eyes',
  'mouth',
  'accessories',
  'background',
] as const;
export type Category = (typeof categories)[number];
export type Selection = Record<Category, string>;
export type AvatarItem = { id: string; label: string; requiredStreak: number };

const items = (values: [string, string][]): AvatarItem[] =>
  values.map(([id, label], index) => ({
    id,
    label,
    requiredStreak: [0, 3, 7, 14, 30, 50][index],
  }));

export const avatarItems: Record<Category, AvatarItem[]> = {
  hair: items([
    ['shortFlat', 'Classic'],
    ['shortWaved', 'Wave rider'],
    ['shortCurly', 'Curly cool'],
    ['theCaesar', 'The scholar'],
    ['shaggy', 'Wild spirit'],
    ['bigHair', 'Main character'],
  ]),
  eyes: items([
    ['default', 'Everyday'],
    ['happy', 'Good vibes'],
    ['wink', 'Wink'],
    ['hearts', 'Heart eyes'],
    ['surprised', 'Wonder'],
    ['winkWacky', 'Big personality'],
  ]),
  mouth: items([
    ['smile', 'All smiles'],
    ['twinkle', 'Little grin'],
    ['tongue', 'Playful'],
    ['serious', 'Focused'],
    ['eating', 'Snack break'],
    ['screamOpen', 'Big energy'],
  ]),
  accessories: items([
    ['none', 'Keep it simple'],
    ['prescription01', 'Book smart'],
    ['round', 'Round frames'],
    ['prescription02', 'The visionary'],
    ['sunglasses', 'After class'],
    ['wayfarers', 'Icon status'],
  ]),
  background: items([
    ['e0e7ff', 'Soft lilac'],
    ['d1fae5', 'Fresh mint'],
    ['dbeafe', 'Blue skies'],
    ['fce7f3', 'Rose glow'],
    ['fef3c7', 'Golden hour'],
    ['c4b5fd', 'Violet dream'],
  ]),
};

export const initialSelection: Selection = {
  hair: 'shortFlat',
  eyes: 'default',
  mouth: 'smile',
  accessories: 'none',
  background: 'e0e7ff',
};

export const avatarUrl = (selection: Selection) => {
  const params = new URLSearchParams({
    seed: 'student-avatar-demo',
    top: selection.hair,
    eyes: selection.eyes,
    mouth: selection.mouth,
    backgroundColor: selection.background,
    accessoriesProbability: selection.accessories === 'none' ? '0' : '100',
    hairColor: '2c1b18',
    skinColor: 'edb98a',
    clothing: 'hoodie',
    clothesColor: '6366f1',
    facialHairProbability: '0',
    topProbability: '100',
  });
  if (selection.accessories !== 'none')
    params.set('accessories', selection.accessories);
  return `https://api.dicebear.com/9.x/avataaars/svg?${params}`;
};

export const randomSelection = (streak: number): Selection => {
  const result = { ...initialSelection };
  for (const category of categories) {
    const unlocked = avatarItems[category].filter(
      (item) => item.requiredStreak <= streak,
    );
    result[category] = unlocked[Math.floor(Math.random() * unlocked.length)].id;
  }
  return result;
};
