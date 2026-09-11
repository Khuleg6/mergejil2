'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
    <div className="flex flex-col gap-2 text-sm leading-relaxed text-slate-600">
      {children}
    </div>
  </div>
);

export const TermsOfServicePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10 md:py-16">
        <button
          type="button"
          onClick={() => {
            // Opened from SignUp/SignIn as a new tab (target="_blank"), so
            // there's often no history to go back to — go to Login instead.
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push('/Login');
            }
          }}
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Буцах
        </button>

        <section id="terms" className="flex flex-col gap-6 scroll-mt-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Үйлчилгээний нөхцөл
            </h1>
            <p className="text-xs text-slate-400">Мэргэжил.мн</p>
          </div>

          <Section title="1. Ерөнхий зүйл">
            <p>
              Энэ үйлчилгээний нөхцөл нь Мэргэжил.мн платформоос олгож буй
              тестийн үйлчилгээ, карьерын зөвлөмж, мэдээлэл болон
              хэрэглэгчийн эрх, үүргийг зохицуулна.
            </p>
          </Section>

          <Section title="2. Бүртгэл ба аюулгүй байдал">
            <p>
              Хэрэглэгч нь өөрийн үнэн зөв мэдээллийг ашиглан бүртгүүлэх
              шаардлагатай.
            </p>
            <p>Нэвтрэх нэр, нууц үгийн аюулгүй байдлыг хэрэглэгч өөрөө хариуцна.</p>
          </Section>

          <Section title="3. Үйлчилгээний мөн чанар болон хариуцлага">
            <p>
              Системийн гаргаж буй MBTI, IQ болон ур чадварын тестийн
              дүгнэлтүүд нь зөвхөн зөвлөмжийн шинжтэй бөгөөд хэрэглэгчийн
              суралцах, ажиллах шийдвэрийг шууд тодорхойлох албан ёсны
              баримт бичиг болохгүй.
            </p>
            <p>
              Тестийн үр дүнд үндэслэн гаргасан хэрэглэгчийн бие даасан
              шийдвэрт платформ хариуцлага хүлээхгүй.
            </p>
          </Section>

          <Section title="4. Оюуны өмч">
            <p>
              Мэргэжил.мн систем дээрх бүх контент, тестийн асуулгууд,
              дизайны шийдэл болон сорил боловсруулах алгоритм нь платформын
              оюуны өмч бөгөөд хувилан ашиглахыг хориглоно.
            </p>
          </Section>

          <Section title="5. Үйлчилгээг цуцлах">
            <p>
              Хэрэглэгч нь системд заасан журмыг зөрчсөн (хуурамч бүртгэл,
              системд халдах гэж оролдсон) тохиолдолд эрхийг цуцлах эсвэл
              хязгаарлах эрхтэй.
            </p>
          </Section>
        </section>

        <div className="border-t border-slate-100" />

        <section id="privacy" className="flex flex-col gap-6 scroll-mt-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Нууцлалын бодлого
            </h1>
            <p className="text-xs text-slate-400">Мэргэжил.мн</p>
          </div>

          <Section title="1. Цуглуулах мэдээлэл">
            <p>
              Бид хэрэглэгчийн нэр, цахим шуудан, сургууль/байгууллага,
              Google акаунтын мэдээлэл болон тестийн хариулт, системийн
              логийн мэдээллийг цуглуулна.
            </p>
          </Section>

          <Section title="2. Мэдээллийн ашиглалт">
            <p>
              Цуглуулсан мэдээллийг зөвхөн тестийн үр дүнг боловсруулах,
              карьерын зөвлөмж өгөх, системийн аюулгүй байдлыг хангах болон
              үйлчилгээг сайжруулахад ашиглана. Бид хувийн мэдээллийг
              гуравдагч этгээдэд худалдахгүй.
            </p>
          </Section>

          <Section title="3. Нууцлал ба аюулгүй байдал">
            <p>
              Хэрэглэгчийн мэдээллийг шифрлэлт (encryption) болон аюулгүй
              байдлын протоколуудыг ашиглан чанд хадгална.
            </p>
          </Section>

          <Section title="4. Насанд хүрээгүй хэрэглэгч">
            <p>
              Сургуулийн сурагчид, насанд хүрээгүй хэрэглэгчийн мэдээллийг
              зөвхөн боловсрол, мэргэжил сонголтын зөвлөмж өгөх зорилгоор
              ашиглана.
            </p>
          </Section>

          <Section title="5. Мэдээлэл устгах эрх">
            <p>
              Хэрэглэгч өөрийн бүртгэл болон тестийн түүхийг системээс бүр
              мөсөн устгуулах хүсэлтийг{' '}
              <a
                href="mailto:support@mergejil.mn"
                className="font-semibold text-slate-900 hover:underline"
              >
                support@mergejil.mn
              </a>{' '}
              хаягаар илгээж эрхтэй.
            </p>
          </Section>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
