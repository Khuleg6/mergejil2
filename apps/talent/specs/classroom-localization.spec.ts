import { seedDatabase } from '../src/components/classroom-demo/lib/seed';
import { localizeDemoDatabase } from '../src/components/classroom-demo/lib/localize';

describe('Mongolian demo data migration', () => {
  it('translates the old built-in name while preserving student progress and custom classes', () => {
    const db = seedDatabase();
    db.students[0].name = 'Maya P.';
    db.students[0].streakCount = 21;
    db.classes.push({ id: 'custom', name: 'My own class', teacherId: 't1' });
    const result = localizeDemoDatabase(db);
    expect(result.students[0].name).toBe('Номин');
    expect(result.students[0].streakCount).toBe(21);
    expect(result.classes[1]).toEqual(db.classes[1]);
    expect(result.responses).toEqual(db.responses);
    expect(db.students[0].name).toBe('Maya P.');
  });

  it('preserves edited examples and is safe to run again on reload', () => {
    const db = seedDatabase();
    db.materials[0].title = 'Миний бичсэн эх';
    db.responses[0].text = 'Миний хариулт';
    expect(localizeDemoDatabase(db)).toEqual(db);
    expect(localizeDemoDatabase(localizeDemoDatabase(db))).toEqual(db);
  });
});
