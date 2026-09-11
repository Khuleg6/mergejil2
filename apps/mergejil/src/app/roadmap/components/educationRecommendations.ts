// Match the existing sample programs; these are not live admission recommendations.
const PROGRAM_MATCHERS: Record<string, RegExp> = {
  'prof-software': /програм|software|computer science/i,
  'prof-data': /data|\bAI\b|математик|mathematics/i,
  'prof-architect': /систем|systems|information engineering|^engineering$/i,
  'prof-pm': /менежмент|удирдлага|information systems|мэдээллийн систем/i,
  'prof-researcher': /математик|физик|mathematics|science|ухаан/i,
  'prof-security': /систем|systems|computer science|мэдээллийн технологи/i,
};

export const getEducationRecommendations = <T extends { programs: string[] }>(
  universities: T[],
  professionId: string,
): T[] => {
  const matcher = PROGRAM_MATCHERS[professionId];
  if (!matcher) return [];

  return universities.flatMap((university) => {
    const programs = university.programs.filter((program) =>
      matcher.test(program),
    );
    return programs.length ? [{ ...university, programs }] : [];
  });
};
