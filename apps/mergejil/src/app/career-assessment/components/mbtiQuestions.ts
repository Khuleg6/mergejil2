// MBTI question bank — 50 items using the cognitive-function methodology from
// the melogy/mbti_test reference implementation.
//
//   solo (24) — one function; agreement on a 5-point scale
//   duo  (16) — two functions; the primary takes the full weight, the
//               secondary 0.7 of it
//   case (10) — two contrasting answers; the chosen side gains what the other
//               loses
//
// Balanced by design: every function appears in 3 solo items and, across the
// duo items, twice as primary and twice as secondary.

import type { CognitiveFunction } from '@/lib/mbti';

export type QuestionKind = 'solo' | 'duo' | 'case';

export type MbtiQuestion = {
  id: string;
  kind: QuestionKind;
  /** The function a positive answer credits. */
  func: CognitiveFunction;
  /** duo: also credited at 0.7 weight. case: credited when option B wins. */
  func2?: CognitiveFunction;
  text: string;
  optionA?: string;
  optionB?: string;
  /**
   * Reverse-keyed: agreeing argues AGAINST `func`. Roughly half the Likert
   * items are worded this way so that habitually agreeing (or disagreeing)
   * with everything cancels out instead of shaping the result.
   */
  reverse?: boolean;
};

export const mbtiQuestions: MbtiQuestion[] = [
  { id: 'q01', kind: 'solo', func: 'Ne', text: 'Шинэ санаа олж сэдэх надад амархан' },
  { id: 'q02', kind: 'solo', func: 'Ne', text: 'Хоорондоо хамааралгүй зүйлсээс холбоо хайх нь надад утгагүй санагддаг', reverse: true },
  { id: 'q03', kind: 'solo', func: 'Ne', text: 'Миний ухаан санаа замбараагүй байх хандлагатай' },
  { id: 'q04', kind: 'solo', func: 'Ni', text: 'Холын ирээдүй өөрийн эрхгүй нүдэнд харагддаг' },
  { id: 'q05', kind: 'solo', func: 'Ni', text: 'Юмсын цаад зүй тогтлыг олж харах надад хэцүү байдаг', reverse: true },
  { id: 'q06', kind: 'solo', func: 'Ni', text: 'Би нэг санаанд наалдалгүй, олон өнцгөөс хурдан хардаг', reverse: true },
  { id: 'q07', kind: 'solo', func: 'Se', text: 'Би хурдан шаламгай сэтгэж дасан зохицохдоо сайн' },
  { id: 'q08', kind: 'solo', func: 'Se', text: 'Би одоо юу болж байгаагаас илүү бодолдоо автсан байдаг', reverse: true },
  { id: 'q09', kind: 'solo', func: 'Se', text: 'Би эрсдэлээс зайлсхийж, найдвартай замыг сонгодог', reverse: true },
  { id: 'q10', kind: 'solo', func: 'Si', text: 'Болж өнгөрсөн нарийн ширийнийг би тэр бүр санадаггүй', reverse: true },
  { id: 'q11', kind: 'solo', func: 'Si', text: 'Би дадал зуршил хэвшүүлэх дуртай' },
  { id: 'q12', kind: 'solo', func: 'Si', text: 'Би өнгөрсөндөө уягдах хандлагатай' },
  { id: 'q13', kind: 'solo', func: 'Te', text: 'Би ямарваа нэгэн асуудлыг шийдэх хамгийн дөт замыг олохдоо сайн' },
  { id: 'q14', kind: 'solo', func: 'Te', text: 'Бодит үр дүнд хүрэхээс илүү үйл явц нь надад чухал', reverse: true },
  { id: 'q15', kind: 'solo', func: 'Te', text: 'Би бусдыг чиглүүлж удирдахаас татгалздаг', reverse: true },
  { id: 'q16', kind: 'solo', func: 'Ti', text: 'Би бусдын логик алдааг амархан олдог' },
  { id: 'q17', kind: 'solo', func: 'Ti', text: 'Логик учир шалтгааныг ухаж тунгаах нь надад уйтгартай', reverse: true },
  { id: 'q18', kind: 'solo', func: 'Ti', text: 'Надад хариунаас илүү бодох арга барил нь чухал' },
  { id: 'q19', kind: 'solo', func: 'Fe', text: 'Би хэнтэй ч хамаагүй аашийг нь олоод харьцчихдаг' },
  { id: 'q20', kind: 'solo', func: 'Fe', text: 'Бусдын сэтгэл хөдлөл надад чухал' },
  { id: 'q21', kind: 'solo', func: 'Fe', text: 'Өөрийн шаардлагыг бусдад шууд хэлэхэд надад хэцүүдэхгүй', reverse: true },
  { id: 'q22', kind: 'solo', func: 'Fi', text: 'Миний сэтгэл хөдлөл нэлээд тогтвортой, гадны юманд хөдөлдөггүй', reverse: true },
  { id: 'q23', kind: 'solo', func: 'Fi', text: 'Би өөрийн зарчмаа нөхцөл байдалд тааруулж уяглаг өөрчилдөг', reverse: true },
  { id: 'q24', kind: 'solo', func: 'Fi', text: 'Надад эвтэй байхаас шударга байх нь чухал' },
  { id: 'q25', kind: 'duo', func: 'Ne', func2: 'Fe', text: 'Бусдын сэтгэл хөдлөлийг таамаглах гэж би тэр бүр оролддоггүй', reverse: true },
  { id: 'q26', kind: 'duo', func: 'Fe', func2: 'Ne', text: 'Хамт олны уур амьсгал ямар байх нь надад тийм ч чухал биш', reverse: true },
  { id: 'q27', kind: 'duo', func: 'Ne', func2: 'Te', text: 'Би сонирхолтой шинэ санаануудад дуртай' },
  { id: 'q28', kind: 'duo', func: 'Te', func2: 'Ne', text: 'Би анх олдсон ажиллах шийдлээ баримталж, өөр хувилбар хайдаггүй', reverse: true },
  { id: 'q29', kind: 'duo', func: 'Se', func2: 'Fe', text: 'Хүмүүс яг юунд дуртайг таах надад хэцүү байдаг', reverse: true },
  { id: 'q30', kind: 'duo', func: 'Fe', func2: 'Se', text: 'Би хүнтэй тэр дор нь найрсаг байх гэж үздэг' },
  { id: 'q31', kind: 'duo', func: 'Se', func2: 'Te', text: 'Би гарж ирсэн боломжуудыг тэр дор нь ашигладаг' },
  { id: 'q32', kind: 'duo', func: 'Te', func2: 'Se', text: 'Би маш шийдэмгий' },
  { id: 'q33', kind: 'duo', func: 'Si', func2: 'Ti', text: 'Болж өнгөрсөн зүйлийг эргэж тунгаах нь надад ач холбогдолгүй', reverse: true },
  { id: 'q34', kind: 'duo', func: 'Ti', func2: 'Si', text: 'Бүрэн ойлгоогүй ч гэсэн би цааш нь үргэлжлүүлээд явчихдаг', reverse: true },
  { id: 'q35', kind: 'duo', func: 'Si', func2: 'Fi', text: 'Би ямар хүн бэ гэдэг нь их туршлагаар тодорхойлдог хөдлөшгүй зүйл' },
  { id: 'q36', kind: 'duo', func: 'Fi', func2: 'Si', text: 'Өнгөрсөн рүү буцахыг би огт хүсдэггүй', reverse: true },
  { id: 'q37', kind: 'duo', func: 'Ni', func2: 'Ti', text: 'Юмсын цаад далд утгыг би тэр бүр анзаардаггүй', reverse: true },
  { id: 'q38', kind: 'duo', func: 'Ti', func2: 'Ni', text: 'Би том түвэгтэй системийг ерөнхийлөн ойлгохдоо сайн' },
  { id: 'q39', kind: 'duo', func: 'Ni', func2: 'Fi', text: 'Миний ирээдүй яг одоогийн байдалтай адил бодит мэт мэдрэгддэг' },
  { id: 'q40', kind: 'duo', func: 'Fi', func2: 'Ni', text: 'Миний сэтгэл хөдлөл тайлбарлахад хэцүү, олон талтай байдаг' },
  {
    id: 'q41',
    kind: 'case',
    func: 'Ne',
    func2: 'Se',
    text: 'Ямарваа зүйлийг шинжихэд',
    optionA: 'Байж болох бүх боломжыг авч үзэх чухал',
    optionB: 'Чухам юу бодит байна гэдгийг олох чухал',
  },
  {
    id: 'q42',
    kind: 'case',
    func: 'Ni',
    func2: 'Ne',
    text: 'Би санаа гаргахдаа',
    optionA: 'Маш олон санаануудыг базаж нэгтгэхдээ сайн',
    optionB: 'Нэг эхлэл цэгээс олон санаанууд гаргахдаа сайн',
  },
  {
    id: 'q43',
    kind: 'case',
    func: 'Ne',
    func2: 'Si',
    text: 'Би',
    optionA: 'Шинэ боломжуудад дуртай',
    optionB: 'Найдвартай зүйлсэд дуртай',
  },
  {
    id: 'q44',
    kind: 'case',
    func: 'Si',
    func2: 'Se',
    text: 'Баримтыг би',
    optionA: 'Юу үнэн байсаар ирсэн бэ гэж санадаг',
    optionB: 'Яг одоо юү үнэн байна вэ гэж хайдаг',
  },
  {
    id: 'q45',
    kind: 'case',
    func: 'Se',
    func2: 'Ni',
    text: 'Миний бодлоор',
    optionA: 'Ирээдүйг таах гэж оролдох хэрэггүй',
    optionB: 'Зөвхөн одоо цагтаа амьдрах нь хариуцлагагүй',
  },
  {
    id: 'q46',
    kind: 'case',
    func: 'Fe',
    func2: 'Te',
    text: 'Багаар ажиллахдаа',
    optionA: 'Эвтэй байх нь чухал',
    optionB: 'Үр дүнтэй байх нь чухал',
  },
  {
    id: 'q47',
    kind: 'case',
    func: 'Te',
    func2: 'Ti',
    text: 'Мэтгэлзээний хувьд',
    optionA: 'Сайн баримт нь логиктой байх албагүй',
    optionB: 'Сайн логик нь баримттай байх албагүй',
  },
  {
    id: 'q48',
    kind: 'case',
    func: 'Fi',
    func2: 'Te',
    text: 'Би хүмүүсийг',
    optionA: 'Ажлаа хэр сайн хийснээр нь шүүмжилдэг',
    optionB: 'Зөв буруу үйлдлээр нь шүүмжилдэг',
  },
  {
    id: 'q49',
    kind: 'case',
    func: 'Fe',
    func2: 'Fi',
    text: 'Хэлэлцүүлэг хийх үед би',
    optionA: 'Бусдын санал бодлыг чагнадаг',
    optionB: 'Өөрийхөө санал бодлыг мэдүүлдэг',
  },
  {
    id: 'q50',
    kind: 'case',
    func: 'Ti',
    func2: 'Fe',
    text: 'Маргааны үед',
    optionA: 'Логик авцалдаагүй юм ярьж байгаа нь дургүй хүргэнэ',
    optionB: 'Бусдын сэтгэлийг бодохгүй байгаа нь дургүй хүргэнэ',
  },
];
