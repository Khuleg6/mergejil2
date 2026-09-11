import { ComCard } from './ComCard';

export const Comment = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[#f5a623] text-[12px] font-semibold">СЭТГЭГДЭЛ</h1>
        <h1 className="text-[40px] font-bold text-white">
          Хэрэглэгчид юу хэлдэг вэ?
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <ComCard
          variant="green"
          name="Батболд Д."
          career="МУИС, Мэдээллийн технологи"
          com="“Тест өгсний дараа яг тохирсон мэргэжлийн чиглэлийг олсон. Маш үнэн зөв дүн шинжилгээ.”"
          mbti="INTJ"
          word="Б"
        />
        <ComCard
          variant="amber"
          name="Номин Э."
          career="ШУТИС, Бизнес удирдлага"
          com="“Карьерийн зөвлөгөө авах гэж олон газар явсан ч энэ платформ хамгийн дэлгэрэнгүй үр дүн өгсөн.”"
          mbti="ENFJ"
          word="Н"
        />
        <ComCard
          variant="purple"
          name="Ганбаатар С."
          career="Дизайнер, Улаанбаатар"
          com="“33 минутын дотор миний бүх чадварыг нэгтгэн харуулсан. Гайхалтай туршлага байлаа.”"
          mbti="ISFP"
          word="Г"
        />
      </div>
    </div>
  );
};
