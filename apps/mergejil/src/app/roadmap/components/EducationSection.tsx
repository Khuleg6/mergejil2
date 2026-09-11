import { ExternalLink, MapPin } from 'lucide-react';
import type { ProfileUniversity } from '@/lib/careerProfile';
import { ProfessionSelector } from './ProfessionSelector';

// Албан ёсны сайт нь баталгаажсан сургуулиуд. AI санал болгосон сургуулийн id
// нь тогтмол биш тул нэрээр тааруулна.
const UNIVERSITY_LINKS: [RegExp, string][] = [
  [/ШУТИС|MUST/i, 'https://www.must.edu.mn/'],
  [/МУИС|NUM|National University of Mongolia/i, 'https://www.num.edu.mn/'],
  [/СЭЗИС|UFE/i, 'https://ufe.edu.mn/'],
  [/Отгонтэнгэр/i, 'https://www.otgontenger.edu.mn/'],
  [/МЖИС|Монгол Япон/i, 'https://mjeed.edu.mn/'],
  [/ХҮИС|Хүмүүнлэг/i, 'https://www.humanities.mn/'],
  [/СУИС/i, 'https://msua.edu.mn/'],
];

const officialLink = (university: { name: string; fullName: string }) =>
  UNIVERSITY_LINKS.find(
    ([pattern]) => pattern.test(university.name) || pattern.test(university.fullName),
  )?.[1];

export const EducationSection = ({
  universities,
  professions,
  professionName,
  selectedProfessionId,
  onProfessionChange,
}: {
  universities: ProfileUniversity[];
  professions: { id: string; name: string; matchPct: number }[];
  professionName?: string;
  selectedProfessionId: string;
  onProfessionChange: (professionId: string) => void;
}) => (
  <section className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold">Боловсролын байгууллага</h1>
      <p className="mt-2 text-slate-500">
        {professionName
          ? `${professionName} чиглэлд нийцсэн их сургуулиуд`
          : 'Таны мэргэжлийн зорилгод нийцсэн их сургуулиуд'}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Тохирлын хувь, төлбөр нь жишээ өгөгдөл. Одоогийн төлбөр, хөтөлбөрийг
        сургуулийн сайтаас шалгана уу.
      </p>
    </div>
    <ProfessionSelector
      professions={professions}
      selectedProfessionId={selectedProfessionId}
      onProfessionChange={onProfessionChange}
      description="Сонгоход доорх санал болгох сургуулиуд шууд шинэчлэгдэнэ."
    />
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {universities.map((university) => (
        <article
            key={university.id}
            className="flex flex-col rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1b3a6b] to-[#2d5aa0] font-bold text-white">
                {university.name.slice(0, 2)}
              </span>
              <div className="text-right text-[#1b3a6b]">
                <div className="text-2xl font-extrabold">
                  {university.matchScore}%
                </div>
                <span className="text-sm text-slate-500">тохирол</span>
              </div>
            </div>
            <h2 className="text-lg font-bold">{university.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{university.fullName}</p>
            <div className="my-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1b3a6b] to-[#2d5aa0]"
                style={{ width: `${university.matchScore}%` }}
              />
            </div>
            <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {university.location}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                {university.type}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                {university.country}
              </span>
            </div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Хөтөлбөрүүд
            </h3>
            <ul className="mb-4 list-inside list-disc space-y-1 text-sm">
              {university.programs.map((program) => (
                <li key={program}>{program}</li>
              ))}
            </ul>
            <div className="mt-auto rounded-2xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Жилийн төлбөр</p>
              <p className="mt-1 font-semibold">{university.tuition}</p>
            </div>
            <p className="my-4 text-sm italic text-slate-500">
              ✨ {university.highlight}
            </p>
            {officialLink(university) ? (
              <a
                href={officialLink(university)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${university.name} — Дэлгэрэнгүй (шинэ таб)`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-900/30 px-4 py-3 font-bold text-[#1b3a6b] transition-colors hover:bg-blue-50"
              >
                Дэлгэрэнгүй <ExternalLink size={16} />
              </a>
            ) : (
              <span className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500">
                Албан ёсны холбоос баталгаажуулж байна
              </span>
            )}
        </article>
      ))}
    </div>
    <aside className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold">Элсэлтийн зөвлөмж</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          [
            '📝',
            'ЭЕШ онооны шаардлага',
            'Сонгосон хөтөлбөрийн шалгалтын хичээл, босго оноог сургуулийн элсэлтийн сайтаас шалгаарай.',
          ],
          [
            '🗓️',
            'Элсэлтийн хугацаа',
            'Бүртгэлийн хугацаа болон бүрдүүлэх материалаа сургуулийн албан ёсны мэдээллээс нягтлаарай.',
          ],
          [
            '🏆',
            'Тэтгэлэгт хөтөлбөр',
            'Тэтгэлгийн шалгуур, хүсэлт хүлээн авах хугацааг сургуулийн элсэлтийн албанаас лавлаарай.',
          ],
        ].map(([icon, title, description]) => (
          <div key={title} className="flex gap-4">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  </section>
);
