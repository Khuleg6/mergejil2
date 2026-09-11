export type PeepsSelection = {
  headVariant: string;
  expressionVariant: string;
  accessoriesVariant: string;
  clothingColor: string;
  skinColor: string;
  backgroundColor: string;
};

export const peepsOptions: {
  key: keyof PeepsSelection;
  label: string;
  values: [string, string][];
}[] = [
  {
    key: 'headVariant',
    label: 'Үсний засалт',
    values: [
      ['short1', 'Богино'],
      ['short3', 'Хажуу тийш самнасан'],
      ['bangs', 'Чёлктой'],
      ['long', 'Урт'],
      ['longCurly', 'Буржгар'],
      ['bun', 'Шуусан'],
      ['buns', 'Хоёр боодол'],
      ['hatBeanie', 'Малгайтай'],
    ],
  },
  {
    key: 'expressionVariant',
    label: 'Нүүрний хувирал',
    values: [
      ['smile', 'Инээмсэглэсэн'],
      ['smileBig', 'Баярласан'],
      ['smileLOL', 'Инээсэн'],
      ['calm', 'Тайван'],
      ['awe', 'Гайхсан'],
      ['cute', 'Өхөөрдөм'],
    ],
  },
  {
    key: 'accessoriesVariant',
    label: 'Нүдний шил',
    values: [
      ['none', 'Шилгүй'],
      ['glasses', 'Дугуй шил'],
      ['glasses2', 'Хүрээтэй шил'],
      ['glasses3', 'Өөр хүрээ'],
      ['sunglasses', 'Нарны шил'],
    ],
  },
  {
    key: 'clothingColor',
    label: 'Хувцасны өнгө',
    values: [
      ['6f46ed', 'Нил ягаан'],
      ['42634b', 'Ногоон'],
      ['4b83bd', 'Цэнхэр'],
      ['e8b455', 'Шар'],
      ['db7e88', 'Ягаан'],
      ['393939', 'Хар'],
    ],
  },
  {
    key: 'skinColor',
    label: 'Арьсны өнгө',
    values: [
      ['ffdbb4', 'Цайвар шаргал'],
      ['edb98a', 'Шаргал'],
      ['d08b5b', 'Бор шаргал'],
      ['ae5d29', 'Бор'],
      ['694d3d', 'Бараан бор'],
    ],
  },
  {
    key: 'backgroundColor',
    label: 'Дэвсгэр өнгө',
    values: [
      ['f0eafa', 'Бүдэг нил ягаан'],
      ['e8f1df', 'Бүдэг ногоон'],
      ['e2effa', 'Цайвар цэнхэр'],
      ['fff1cf', 'Цайвар шар'],
      ['fce6e9', 'Цайвар ягаан'],
      ['ffffff', 'Цагаан'],
    ],
  },
];

export const defaultPeeps: PeepsSelection = {
  headVariant: 'short1',
  expressionVariant: 'smile',
  accessoriesVariant: 'none',
  clothingColor: '6f46ed',
  skinColor: 'edb98a',
  backgroundColor: 'f0eafa',
};

export const peepsPreset = (avatarId: string | null): PeepsSelection => {
  const index = Math.max(0, Number(avatarId?.replace('a', '') || 1) - 1);
  const hair =
    peepsOptions[0].values[index % peepsOptions[0].values.length]?.[0] ||
    defaultPeeps.headVariant;
  return { ...defaultPeeps, headVariant: hair };
};

export const peepsUrl = (selection: PeepsSelection) => {
  const params = new URLSearchParams({
    ...selection,
    seed: 'talent-open-peeps',
    size: '320',
    accessoriesProbability:
      selection.accessoriesVariant === 'none' ? '0' : '100',
    facialHairProbability: '0',
    maskProbability: '0',
    headProbability: '100',
    expressionProbability: '100',
  });
  if (selection.accessoriesVariant === 'none')
    params.delete('accessoriesVariant');
  return `https://api.dicebear.com/10.x/open-peeps/svg?${params}`;
};
