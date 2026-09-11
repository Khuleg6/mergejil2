'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { tokenizeText } from '@/lib/tokenize-text';
import { demoApi } from '@/lib/demo-api';
import { isDemoMode } from '@/lib/demo-mode';

type MaterialSummary = { id: string; title: string; vocabularyCount: number };
type VocabWord = { id?: string; word: string; position: number };
type Material = {
  id: string;
  title: string;
  bodyText: string;
  vocabWords: VocabWord[];
};
type Result<T> = { data?: T; error?: { message?: string } };

const call = async <T,>(url: string, options?: RequestInit) => {
  if (isDemoMode()) return demoApi<T>(url, options);
  const response = await fetch(url, options);
  const result = (await response.json()) as Result<T>;
  if (!response.ok || !result.data)
    throw new Error(result.error?.message || 'Request failed.');
  return result.data;
};

export const MaterialManager = ({ classId }: { classId: string }) => {
  const [items, setItems] = useState<MaterialSummary[]>([]);
  const [material, setMaterial] = useState<Material | null>(null);
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selected, setSelected] = useState<VocabWord[]>([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const tokens = useMemo(
    () => tokenizeText(material?.bodyText || ''),
    [material?.bodyText],
  );

  const list = useCallback(async () => {
    setLoading(true);
    try {
      const data = await call<{ materials: MaterialSummary[] }>(
        `/api/classes/${classId}/materials`,
      );
      setItems(data.materials);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Материал ачаалж чадсангүй.',
      );
    } finally {
      setLoading(false);
    }
  }, [classId]);
  useEffect(() => {
    setMaterial(null);
    setCreating(false);
    void list();
  }, [list]);
  const open = async (id: string) => {
    setError('');
    try {
      const data = await call<{ material: Material }>(`/api/materials/${id}`);
      setMaterial(data.material);
      setTitle(data.material.title);
      setBodyText(data.material.bodyText);
      setSelected(data.material.vocabWords);
      setCreating(false);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Материал нээж чадсангүй.',
      );
    }
  };
  const notify = async (action: () => Promise<void>, success: string) => {
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(success);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Алдаа гарлаа.');
    }
  };
  const edit = () => {
    setCreating(true);
    setMaterial(null);
    setTitle('');
    setBodyText('');
    setSelected([]);
  };
  const saveMaterial = (event: FormEvent) => {
    event.preventDefault();
    void notify(
      async () => {
        const url = material
          ? `/api/materials/${material.id}`
          : `/api/classes/${classId}/materials`;
        const data = await call<{
          material: Material;
          vocabularyCleared?: boolean;
        }>(url, {
          method: material ? 'PATCH' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title, bodyText }),
        });
        await list();
        await open(data.material.id);
        if (data.vocabularyCleared)
          setMessage(
            'Текст өөрчлөгдсөн тул хуучин үгийн сонголтууд цэвэрлэгдлээ.',
          );
      },
      material ? 'Материал шинэчлэгдлээ.' : 'Материал үүслээ.',
    );
  };
  const deleteMaterial = () => {
    if (
      !material ||
      !window.confirm(`“${material.title}” материалыг устгах уу?`)
    )
      return;
    void notify(async () => {
      await call(`/api/materials/${material.id}`, { method: 'DELETE' });
      setMaterial(null);
      setCreating(false);
      await list();
    }, 'Материал устгагдлаа.');
  };
  const toggle = (word: string, position: number) =>
    setSelected((current) =>
      current.some((item) => item.position === position)
        ? current.filter((item) => item.position !== position)
        : [...current, { word, position }].sort(
            (a, b) => a.position - b.position,
          ),
    );
  const saveVocabulary = () => {
    if (!material) return;
    void notify(async () => {
      const data = await call<{ words: VocabWord[] }>(
        `/api/materials/${material.id}/vocabulary`,
        {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            words: selected.map(({ word, position }) => ({ word, position })),
          }),
        },
      );
      setSelected(data.words);
      setMaterial({ ...material, vocabWords: data.words });
      await list();
    }, 'Сонгосон үгс хадгалагдлаа.');
  };

  return (
    <div className="mt-8 border-t border-slate-200 pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Унших материал</h3>
          <p className="mt-1 text-sm text-slate-500">
            Текстээс зорилтот үгсээ сонгоно уу.
          </p>
        </div>
        <button
          onClick={edit}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-[1.02] hover:bg-indigo-700"
        >
          + Материал үүсгэх
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="notice-enter mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="notice-enter mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          ✓ {message}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {loading ? (
          <span
            role="status"
            className="animate-pulse rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-500"
          >
            Материал ачаалж байна…
          </span>
        ) : items.length === 0 ? (
          <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="font-medium text-slate-700">
              Уншлагын материал хараахан нэмээгүй байна
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Шинэ материал үүсгээд үгээ сонгоорой.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              aria-pressed={material?.id === item.id}
              onClick={() => void open(item.id)}
              className={`interactive-card list-enter rounded-xl border px-4 py-2.5 text-left text-sm ${material?.id === item.id ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100' : 'border-slate-200 bg-white'}`}
            >
              <strong>{item.title}</strong>
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {item.vocabularyCount} үг
              </span>
            </button>
          ))
        )}
      </div>
      {(creating || material) && (
        <form
          onSubmit={saveMaterial}
          className="enter mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
        >
          <label className="block text-sm font-semibold text-slate-700">
            Гарчиг
            <input
              required
              maxLength={160}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Унших текст
            <textarea
              required
              maxLength={100000}
              rows={8}
              value={bodyText}
              onChange={(event) => setBodyText(event.target.value)}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 leading-7 outline-none focus:border-indigo-500"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:scale-[1.01] hover:bg-indigo-700">
              {material ? 'Өөрчлөлт хадгалах' : 'Материал хадгалах'}
            </button>
            {material && (
              <button
                type="button"
                onClick={deleteMaterial}
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 font-semibold text-red-700 hover:bg-red-100"
              >
                Устгах
              </button>
            )}
          </div>
        </form>
      )}
      {material && (
        <div className="enter mt-6">
          <h4 className="font-semibold text-slate-900">Үг сонгох</h4>
          <p className="mt-1 text-sm text-slate-500">
            Үг дээр дарж сонгох эсвэл сонголтыг цуцална. Давтагдсан үг бүр
            тусдаа байрлалтай.
          </p>
          <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-4 leading-8 shadow-sm sm:p-5">
            {tokens.map((token) =>
              token.selectable ? (
                <button
                  type="button"
                  aria-pressed={selected.some(
                    (item) => item.position === token.start,
                  )}
                  key={token.start}
                  onClick={() => toggle(token.text, token.start)}
                  className={`rounded px-0.5 transition-colors ${selected.some((item) => item.position === token.start) ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-300' : 'hover:bg-indigo-100'}`}
                >
                  {token.text}
                </button>
              ) : (
                <span key={token.start}>{token.text}</span>
              ),
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.length === 0 ? (
              <span className="text-sm text-slate-500">
                Үг сонгоогүй байна.
              </span>
            ) : (
              selected.map((item) => (
                <button
                  type="button"
                  aria-label={`${item.word} үгийн сонголтыг арилгах`}
                  key={item.position}
                  onClick={() => toggle(item.word, item.position)}
                  className="list-enter rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
                >
                  {item.word} · {item.position} ×
                </button>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={saveVocabulary}
            className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:scale-[1.01] hover:bg-emerald-700"
          >
            Сонгосон үгсийг хадгалах
          </button>
        </div>
      )}
    </div>
  );
};
