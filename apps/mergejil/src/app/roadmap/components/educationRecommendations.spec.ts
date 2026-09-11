import { getEducationRecommendations } from './educationRecommendations';
import { PROFILE_DATA } from './resultsData';

describe('education recommendations', () => {
  it('changes schools and programs when switching from software to product management', () => {
    const software = getEducationRecommendations(
      PROFILE_DATA.universities,
      'prof-software',
    );
    const management = getEducationRecommendations(
      PROFILE_DATA.universities,
      'prof-pm',
    );
    expect(software.map((school) => school.id)).not.toEqual(
      management.map((school) => school.id),
    );
    expect(software.find((school) => school.id === 'uni-kaist')).toBeDefined();
    expect(
      management.find((school) => school.id === 'uni-kaist'),
    ).toBeUndefined();
    expect(
      management.find((school) => school.id === 'uni-otgontenger')?.programs,
    ).toEqual(['Бизнесийн удирдлага']);
  });

  it.each(
    PROFILE_DATA.professions.slice(0, 5).map((profession) => profession.id),
  )('provides domestic and overseas options for %s', (professionId) => {
    const schools = getEducationRecommendations(
      PROFILE_DATA.universities,
      professionId,
    );
    expect(schools.some((school) => school.country === 'Монгол')).toBe(true);
    expect(schools.some((school) => school.country !== 'Монгол')).toBe(true);
  });

  it('does not mutate the original programs or invent results for an unknown profession', () => {
    const schools = [{ programs: ['AI', 'Business'] }];
    expect(
      getEducationRecommendations(schools, 'prof-data')[0]?.programs,
    ).toEqual(['AI']);
    expect(schools[0].programs).toEqual(['AI', 'Business']);
    expect(getEducationRecommendations(schools, 'unknown')).toEqual([]);
  });
});
