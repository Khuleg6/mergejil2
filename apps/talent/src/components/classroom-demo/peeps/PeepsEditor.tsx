'use client';
import { useState } from 'react';
import { useAppState } from '../AppState';
import type { Student } from '../lib/types';
import { peepsOptions, peepsPreset } from './options';
import { PeepsImage } from './PeepsImage';

export const PeepsEditor = ({ student }: { student: Student }) => {
  const { savePeeps } = useAppState();
  const saved = student.peeps ?? peepsPreset(student.avatarId);
  const [selection, setSelection] = useState(saved);
  const [message, setMessage] = useState('');
  return (
    <section className="card">
      <h2>Дүрээ өөртөө тохируулаарай</h2>
      <p className="meta">Үс, нүүрний хувирал, өнгөө сонгоод хадгалаарай.</p>
      <div className="peeps-editor">
        <div className="peeps-preview">
          <PeepsImage selection={selection} alt="Таны тохируулж буй дүр" />
        </div>
        <div>
          {peepsOptions.map(({ key, label, values }) => (
            <fieldset key={key} className="peeps-field">
              <legend>{label}</legend>
              <div className="peeps-choices">
                {values.map(([value, name]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selection[key] === value}
                    onClick={() => {
                      setSelection({ ...selection, [key]: value });
                      setMessage('');
                    }}
                  >
                    {key.endsWith('Color') && (
                      <span
                        aria-hidden="true"
                        className="peeps-swatch"
                        style={{ backgroundColor: `#${value}` }}
                      />
                    )}
                    {name}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="peeps-actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                savePeeps(student.id, selection);
                setMessage('Таны дүр хадгалагдлаа.');
              }}
            >
              Дүрээ хадгалах
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => {
                setSelection(saved);
                setMessage('');
              }}
            >
              Өөрчлөлтийг буцаах
            </button>
          </div>
          <p role="status" className="help-text">
            {message}
          </p>
        </div>
      </div>
      <p className="help-text">
        <a href="https://www.openpeeps.com/" target="_blank" rel="noreferrer">
          Open Peeps
        </a>{' '}
        · Pablo Stanley · CC0 · DiceBear
      </p>
    </section>
  );
};
