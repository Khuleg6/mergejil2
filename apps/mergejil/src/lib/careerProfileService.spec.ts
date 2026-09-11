import { generateCareerProfile } from './careerProfileService';
import { generateJson } from './gemini';

jest.mock('./gemini', () => ({
  ...jest.requireActual('./gemini'),
  generateJson: jest.fn(),
}));

const mockedGenerateJson = generateJson as jest.MockedFunction<
  typeof generateJson
>;

const careerPayload = {
  mbtiTagline: 'Стратегиар сэтгэдэг шинжээч',
  workStyle: 'Бие даан гүнзгий ажиллах',
  iqDescription: 'Логик сэтгэлгээ өндөр.',
  skillsSummary: 'Техникийн чадвар давуу.',
  professions: Array.from({ length: 5 }, (unused, index) => ({
    name: `Мэргэжил ${index + 1}`,
    englishName: `Job ${index + 1}`,
    matchPct: 95 - index * 4,
    salaryMin: 2000000,
    salaryMax: 5000000,
    demand: 'Өндөр',
    demandLevel: index === 0 ? 'very-high' : 'high',
    trend: '↑',
    description: 'Тайлбар',
    skills: ['A', 'B', 'C'],
    subjects: ['Математик', 'Физик', 'Англи хэл'],
    environment: 'Технологийн компани',
    programKeywords: ['програм', 'software'],
  })),
  learningPaths: Array.from({ length: 5 }, (unused, index) => ({
    summary: `Зам ${index + 1}`,
    phases: Array.from({ length: 4 }, (unusedPhase, phase) => ({
      title: `Шат ${phase + 1}`,
      duration: '2 долоо хоног',
      goal: 'Зорилго',
      challenge: 'Даалгавар',
      items: ['1', '2', '3'],
    })),
  })),
};

const contextPayload = {
  universities: [
    {
      name: 'ШУТИС',
      fullName: 'Шинжлэх ухаан технологийн их сургууль',
      programs: ['Програм хангамж'],
      matchScore: 95,
      location: 'Улаанбаатар',
      country: 'Монгол',
      type: 'Улсын',
      tuition: '3,000,000₮/жил',
      highlight: 'IT сургууль',
      scholarship: 'Тэтгэлэгтэй',
    },
    {
      name: 'NUS',
      fullName: 'National University of Singapore',
      programs: ['Computer Science'],
      matchScore: 88,
      location: 'Сингапур',
      country: 'Гадаад',
      type: 'Улсын',
      tuition: '$25,000/жил',
      highlight: 'Азийн №1',
      scholarship: 'Тэтгэлэгтэй',
    },
  ],
  workEnvironments: Array.from({ length: 4 }, (unused, index) => ({
    icon: '💻',
    title: `Орчин ${index + 1}`,
    match: 90 - index,
    desc: 'Тайлбар',
  })),
  collaborationStyles: Array.from({ length: 4 }, (unused, index) => ({
    style: `Хэв маяг ${index + 1}`,
    desc: 'Тайлбар',
    match: 'Тохиромжтой',
  })),
  roadmap: Array.from({ length: 4 }, (unused, index) => ({
    title: `Шат ${index + 1}`,
    duration: '1 сар',
    goal: 'Зорилго',
    challenge: 'Даалгавар',
    items: ['1', '2', '3'],
    xp: 300 * (index + 1),
  })),
};

const results = {
  mbti: {
    summary: 'INTJ',
    detail: {
      dichotomies: [
        { first: 'I', second: 'E', firstLabel: 'Introvert', secondLabel: 'Extravert', firstPercent: 78, secondPercent: 22, winner: 'I' },
        { first: 'S', second: 'N', firstLabel: 'Observing', secondLabel: 'Intuitive', firstPercent: 32, secondPercent: 68, winner: 'N' },
      ],
    },
    at: new Date('2026-09-01T00:00:00Z'),
  },
  iq: {
    summary: '124',
    detail: {
      iqScore: 124,
      subScores: [
        { id: 'iq-sub-logical_reasoning', category: 'Логик сэтгэлгээ', score: 88, max: 100, color: '#2563EB' },
      ],
    },
    at: new Date('2026-09-02T00:00:00Z'),
  },
  skills: {
    summary: '72',
    detail: {
      radarData: [{ subject: 'Техник', value: 82, fullMark: 100 }],
      strengths: ['Дижитал'],
      gaps: ['Харилцаа'],
      categories: [{ label: 'Дижитал', percent: 82 }],
    },
    at: new Date('2026-09-03T00:00:00Z'),
  },
};

// Схемгүй (fallback) хувилбарт Gemini талбар алдаж буцааж болно.
const looseCareerPayload = {
  professions: [
    { name: 'Багш', matchPct: 'тодорхойгүй' },
    { name: 'Эмч', matchPct: 88, skills: null, programKeywords: [] },
  ],
  learningPaths: [],
};

describe('generateCareerProfile', () => {
  beforeEach(() => {
    mockedGenerateJson.mockReset();
    mockedGenerateJson
      .mockResolvedValueOnce({ data: careerPayload, model: 'test-model' })
      .mockResolvedValueOnce({ data: contextPayload, model: 'test-model' });
  });

  it('builds a profile from the two Gemini calls plus the test results', async () => {
    const profile = await generateCareerProfile({
      results,
      userName: 'Тест Хэрэглэгч',
    });

    expect(mockedGenerateJson).toHaveBeenCalledTimes(2);
    expect(profile.professions).toHaveLength(5);
    // Мэргэжил бүр өөрийн суралцах замтай, дугаарлалт эрэмбээр.
    expect(profile.professions[0].rank).toBe(1);
    expect(profile.professions[0].learningPath.summary).toBe('Зам 1');
    expect(profile.professions[4].learningPath.summary).toBe('Зам 5');
    // Id-ууд давхардахгүй — сонголтын түлхүүр болдог.
    expect(new Set(profile.professions.map((item) => item.id)).size).toBe(5);
  });

  it('keeps the measured MBTI/IQ/skills numbers instead of AI guesses', async () => {
    const profile = await generateCareerProfile({
      results,
      userName: 'Тест Хэрэглэгч',
    });

    expect(profile.mbti.type).toBe('INTJ');
    expect(profile.mbti.dimensions[0]).toMatchObject({ label: 'I', value: 78 });
    expect(profile.mbti.dimensions[1]).toMatchObject({ label: 'N', value: 68 });
    expect(profile.iq.totalScore).toBe(124);
    expect(profile.iq.label).toBe('Өндөр');
    expect(profile.skills.radarData[0].value).toBe(82);
    // Гурван модуль дуусахад нийт XP.
    expect(profile.user.totalXP).toBe(370);
  });

  it('survives a loose schema-less payload with missing fields', async () => {
    mockedGenerateJson.mockReset();
    mockedGenerateJson
      .mockResolvedValueOnce({ data: looseCareerPayload, model: 'test-model' })
      .mockResolvedValueOnce({ data: {}, model: 'test-model' });

    const profile = await generateCareerProfile({
      results,
      userName: 'Тест Хэрэглэгч',
    });

    expect(profile.professions).toHaveLength(2);
    // Тоо болоогүй matchPct нь анхдагч 70 болно, эрэмбэ хэвээрээ.
    expect(profile.professions[0]).toMatchObject({
      name: 'Багш',
      matchPct: 70,
      rank: 1,
    });
    // Хоосон түлхүүр үг — мэргэжлийн нэрээр сургуулийг шүүнэ.
    expect(profile.professions[1].programKeywords).toEqual(['Эмч']);
    expect(profile.professions[0].learningPath.phases).toEqual([]);
    // Хоёрдугаар дуудалт хоосон ирсэн ч хуудас унахгүй.
    expect(profile.universities).toEqual([]);
    expect(profile.roadmap).toEqual([]);
  });

  it('fails loudly when no profession comes back', async () => {
    mockedGenerateJson.mockReset();
    mockedGenerateJson
      .mockResolvedValueOnce({ data: { professions: [] }, model: 'test-model' })
      .mockResolvedValueOnce({ data: {}, model: 'test-model' });

    await expect(
      generateCareerProfile({ results, userName: 'Тест' }),
    ).rejects.toThrow('мэргэжлийн санал');
  });

  it('carries the AI copy into the profile', async () => {
    const profile = await generateCareerProfile({
      results,
      userName: 'Тест Хэрэглэгч',
    });

    expect(profile.mbti.tagline).toBe('Стратегиар сэтгэдэг шинжээч');
    expect(profile.iq.description).toBe('Логик сэтгэлгээ өндөр.');
    expect(profile.skills.summary).toBe('Техникийн чадвар давуу.');
    expect(profile.roadmap[0].status).toBe('current');
    expect(profile.universities).toHaveLength(2);
  });
});
