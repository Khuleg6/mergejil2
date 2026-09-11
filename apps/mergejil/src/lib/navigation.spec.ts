import { ASSESSMENT_PATH, buildLoginHref, safeNext } from './navigation';

describe('buildLoginHref', () => {
  it('нэвтрээгүй хэрэглэгчийг бүртгүүлэх таб руу аваачна', () => {
    expect(buildLoginHref()).toBe(
      `/Login?tab=register&next=${encodeURIComponent(ASSESSMENT_PATH)}`,
    );
  });

  it('нэвтрэх таб болон буцах замыг тохируулж болно', () => {
    expect(buildLoginHref('/roadmap', 'login')).toBe(
      '/Login?tab=login&next=%2Froadmap',
    );
  });
});

describe('safeNext', () => {
  it('сайт доторх замыг хэвээр буцаана', () => {
    expect(safeNext('/roadmap')).toBe('/roadmap');
  });

  it('хоосон утгыг үнэлгээний зам руу орлуулна', () => {
    expect(safeNext(null)).toBe(ASSESSMENT_PATH);
    expect(safeNext('')).toBe(ASSESSMENT_PATH);
  });

  it('гадны сайт руу дамжуулахыг зөвшөөрөхгүй', () => {
    expect(safeNext('https://evil.example')).toBe(ASSESSMENT_PATH);
    expect(safeNext('//evil.example')).toBe(ASSESSMENT_PATH);
  });
});
