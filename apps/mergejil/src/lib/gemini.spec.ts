import { generateJson, schemaSkeleton } from './gemini';

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    score: { type: 'integer' },
    level: { type: 'string', enum: ['low', 'high'] },
    items: {
      type: 'array',
      minItems: 3,
      items: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
      },
    },
  },
  required: ['title', 'score', 'level', 'items'],
};

const okResponse = (payload: unknown) => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }],
  }),
});

const errorResponse = (status: number, message: string) => ({
  ok: false,
  status,
  json: async () => ({ error: { message, code: status } }),
});

describe('schemaSkeleton', () => {
  it('turns a response schema into a JSON shape hint', () => {
    expect(schemaSkeleton(SCHEMA)).toEqual({
      title: 'string',
      score: 0,
      level: 'нэг нь: low | high',
      items: [{ name: 'string' }, '… нийт 3 элемент'],
    });
  });
});

describe('generateJson', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.GEMINI_API_KEY = 'AIzaTestKey1234567890';
    process.env.GEMINI_MODEL = 'gemini-3.1-flash-lite';
  });

  it('sends the response schema and parses the JSON back', async () => {
    fetchMock.mockResolvedValueOnce(okResponse({ title: 'ok' }));

    const { data, model } = await generateJson<{ title: string }>({
      prompt: 'Хэл',
      schema: SCHEMA,
    });

    expect(data.title).toBe('ok');
    expect(model).toBe('gemini-3.1-flash-lite');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.generationConfig.responseSchema).toEqual(SCHEMA);
    expect(fetchMock.mock.calls[0][0]).not.toContain('?key=');
    expect(fetchMock.mock.calls[0][1].headers['x-goog-api-key']).toBe(
      'AIzaTestKey1234567890',
    );
  });

  it('retries without the schema when Gemini rejects it', async () => {
    fetchMock
      .mockResolvedValueOnce(
        errorResponse(400, 'Request contains an invalid argument.'),
      )
      .mockResolvedValueOnce(okResponse({ title: 'fallback' }));

    const { data } = await generateJson<{ title: string }>({
      prompt: 'Хэл',
      schema: SCHEMA,
    });

    expect(data.title).toBe('fallback');
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const second = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(second.generationConfig.responseSchema).toBeUndefined();
    // Схемгүй үед хүссэн бүтцийг prompt дотор зааж өгнө.
    expect(second.contents[0].parts[0].text).toContain('"title": "string"');
  });

  it('surfaces a quota error instead of hanging', async () => {
    fetchMock.mockResolvedValue(errorResponse(403, 'Permission denied'));

    await expect(
      generateJson({ prompt: 'Хэл', schema: SCHEMA }),
    ).rejects.toThrow('Permission denied');
  });

  it('accepts an AI Studio authorization (AQ.) key', async () => {
    process.env.GEMINI_API_KEY = 'AQ.Ab8RNephemeraltokenexample';
    fetchMock.mockResolvedValueOnce(okResponse({ title: 'authorized' }));

    await expect(generateJson({ prompt: 'Хэл', schema: SCHEMA })).resolves
      .toMatchObject({ data: { title: 'authorized' } });
    expect(fetchMock.mock.calls[0][1].headers['x-goog-api-key']).toBe(
      'AQ.Ab8RNephemeraltokenexample',
    );
  });

  it('fails fast when Gemini never responds', async () => {
    jest.useFakeTimers();
    // Хариу өгөхгүй (pending) fetch — хугацаа дуусах хүртэл өлгөөтэй.
    fetchMock.mockImplementation(
      (_url: string, init: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => {
            const error = new Error('timed out');
            error.name = 'TimeoutError';
            reject(error);
          });
        }),
    );

    const promise = generateJson({ prompt: 'Хэл', schema: SCHEMA });
    const assertion = expect(promise).rejects.toThrow('секундэд хариу өгсөнгүй');

    await jest.advanceTimersByTimeAsync(45_000);
    await assertion;

    jest.useRealTimers();
  });

  it('gives up quickly on repeated 429s instead of retrying for minutes', async () => {
    jest.useFakeTimers();
    fetchMock.mockResolvedValue(errorResponse(429, 'Quota exceeded'));

    const promise = generateJson({ prompt: 'Хэл', schema: SCHEMA });
    // "unhandledRejection" болохоос сэргийлж эрт catch хийнэ (fake timer-тэй
    // async assertion-ийн ердийн зөвлөмж).
    const assertion = expect(promise).rejects.toThrow('Quota exceeded');

    // Богино хугацааны хүлээлт (≤10 сек) л явна — өмнөх 70 секундийн
    // зөвлөмжийг дагахгүй, өдгөө минутуудаар биш секундүүдээр хязгаарлана.
    await jest.advanceTimersByTimeAsync(10_000);
    await assertion;

    // Дор хаяж 1 удаа (анхны оролдлого) дахин оролдоно, гэхдээ хуучин шиг
    // 4 удаа биш — network дуудалт хэт олон удаа хийгдээгүй эсэхийг батална.
    expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(2);

    jest.useRealTimers();
  });
});
