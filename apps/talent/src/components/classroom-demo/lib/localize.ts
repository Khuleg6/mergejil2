import type { Database } from './types';

// Translate only unchanged built-in examples; preserve user-created content.
export const localizeDemoDatabase = (db: Database): Database => ({
  ...db,
  classes: db.classes.map((item) => ({
    ...item,
    name: item.id === 'c1' && item.name === 'Room 12' ? '8А анги' : item.name,
  })),
  students: db.students.map((item) => ({
    ...item,
    name:
      item.id === 's1' && item.name === 'Maya P.'
        ? 'Номин'
        : item.id === 's2' && item.name === 'Jordan K.'
          ? 'Тэмүүлэн'
          : item.id === 's3' && item.name === 'Ana R.'
            ? 'Ану'
            : item.name,
  })),
  materials: db.materials.map((item) => ({
    ...item,
    bodyText:
      item.id === 'm1' &&
      item.bodyText ===
        'The path stretched farther than Kira expected. Her legs felt weary after the third hill, but she was reluctant to stop while the light was still good. Somewhere past the horizon, she knew, the river was waiting.'
        ? 'Номин өвөөгийнхөө хамт ойд очлоо. Жим даган алхахад моддын завсраар нар тусаж байв. Навчис салхинд сэрчигнэнэ. Тэд ойн захад хэсэг амраад гэртээ харилаа.'
        : item.bodyText,
    title:
      item.id === 'm1' && item.title === 'Chapter 4: The Long Walk'
        ? 'Намрын ой'
        : item.title,
  })),
  vocabWords: db.vocabWords.map((item) => ({
    ...item,
    word:
      item.id === 'w1' && item.word === 'weary'
        ? 'жим'
        : item.id === 'w2' && item.word === 'reluctant'
          ? 'навчис'
          : item.id === 'w3' && item.word === 'horizon'
            ? 'сэрчигнэнэ'
            : item.word,
  })),
  responses: db.responses.map((item) => ({
    ...item,
    text:
      item.id === 'r1' && item.text === 'like when you want to stop moving'
        ? 'Хүмүүсийн явдаг нарийн зам гэж бодож байна.'
        : item.text,
  })),
});
