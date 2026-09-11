const steps = [
  { title: 'Зургаа ажиглая', text: 'Багшийн оруулсан зургийг харж, юу байгааг нэрлээрэй.' },
  { title: 'Үгээ суръя', text: 'Шинэ үгийн утгыг уншиж, зурагтай нь холбож ойлгоорой.' },
  { title: 'Дасгалаа хийе', text: 'Сурсан үгээрээ өгүүлбэр бүтээж, хариултаа илгээгээрэй.' },
];

export const About = () => (
  <>
    <section id="how-it-works" className="scroll-mt-6 bg-white px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-[#42634b]">АЛХАМ АЛХМААР</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#243c2d]">Нэг үгээс эхэлье</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="border-t border-[#d9ddcf] pt-5">
              <span className="text-sm font-semibold text-[#687f61]">0{index + 1}</span>
              <h3 className="mt-4 text-xl font-semibold text-[#243c2d]">{step.title}</h3>
              <p className="mt-3 max-w-xs leading-7 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section id="about" className="scroll-mt-6 border-y border-[#dedfd5] bg-[#eef1e8] px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-20">
        <div><p className="text-sm font-semibold text-[#42634b]">СУРГАЛТЫН ТУХАЙ</p><h2 className="mt-3 text-3xl font-semibold leading-tight text-[#243c2d]">Багштайгаа хамт,<br />өөрийн хурдаар.</h2></div>
        <div className="space-y-6 leading-7 text-slate-600">
          <p><strong className="font-semibold text-[#243c2d]">Сурагчид.</strong> Ангийнхаа хичээл, шинэ үг, даалгаврыг нэг дороос үзнэ. Ойлгоогүй зүйлээ дахин харж, давтаж болно.</p>
          <p><strong className="font-semibold text-[#243c2d]">Багшид.</strong> Ангиа үүсгэж, зурагтай материал болон дасгал бэлтгэнэ. Сурагчдын илгээсэн хариултыг хянана.</p>
        </div>
      </div>
    </section>
  </>
);
