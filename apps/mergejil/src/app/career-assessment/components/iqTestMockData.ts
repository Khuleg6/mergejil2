// ============================================================
// mergejil - IQ Тестийн Mock Өгөгдөл (Монгол хувилбар)
// File: src/data/iqTestQuestions.ts
// ============================================================

export type DifficultyLevel = "easy" | "medium" | "hard";

export type QuestionCategory =
  | "logical_reasoning"
  | "pattern_recognition"
  | "numerical_sequence"
  | "spatial_reasoning"
  | "verbal_analogy";

export interface IQTestQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  questionText: string;
  options: [string, string, string, string];
  correctAnswerIndex: 0 | 1 | 2 | 3;
  explanation: string;
  timeLimitSeconds: number;
  points: number;
}

export interface IQTestMeta {
  version: string;
  totalQuestions: number;
  estimatedDurationMinutes: number;
  passingScorePercent: number;
  categories: QuestionCategory[];
}

// ────────────────────────────────────────────────────────────
// Тестийн мэдээлэл
// ────────────────────────────────────────────────────────────
export const iqTestMeta: IQTestMeta = {
  version: "1.0.0",
  totalQuestions: 50,
  estimatedDurationMinutes: 45,
  passingScorePercent: 60,
  categories: [
    "logical_reasoning",
    "pattern_recognition",
    "numerical_sequence",
    "spatial_reasoning",
    "verbal_analogy",
  ],
};

// ────────────────────────────────────────────────────────────
// Ангиллын нэршил (UI-д харуулах)
// ────────────────────────────────────────────────────────────
export const categoryLabels: Record<QuestionCategory, string> = {
  logical_reasoning: "Логик сэтгэлгээ",
  pattern_recognition: "Хээ таних",
  numerical_sequence: "Тоон дараалал",
  spatial_reasoning: "Орон зайн сэтгэлгээ",
  verbal_analogy: "Үгийн аналоги",
};

export const difficultyLabels: Record<DifficultyLevel, string> = {
  easy: "Хөнгөн",
  medium: "Дунд",
  hard: "Хүнд",
};

// ────────────────────────────────────────────────────────────
// Асуултууд
// ────────────────────────────────────────────────────────────
export const iqTestQuestions: IQTestQuestion[] = [

  // ========================================================
  // ЛОГИК СЭТГЭЛГЭЭ — 10 асуулт
  // ========================================================
  {
    id: "lr-001",
    category: "logical_reasoning",
    difficulty: "easy",
    questionText:
      "Бүх сарнай цэцэг мөн. Зарим цэцэг хурдан хатдаг. Дараах зүйлсийн аль нь заавал үнэн бэ?",
    options: [
      "Бүх сарнай хурдан хатдаг",
      "Зарим сарнай хурдан хатдаг",
      "Бүх сарнай цэцэг мөн",
      "Ямар ч сарнай хурдан хатдаггүй",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Эхний мэдэгдэлд бүх сарнай цэцэг мөн гэж шууд өгөгдсөн. Энэ нь заавал үнэн цорын ганц дүгнэлт юм. Өгөгдсөн мэдэгдлүүдээс сарнай хурдан хатдаг эсэхийг тогтоох боломжгүй.",
    timeLimitSeconds: 45,
    points: 10,
  },
  {
    id: "lr-002",
    category: "logical_reasoning",
    difficulty: "easy",
    questionText:
      "Бороо орвол газар нордог. Газар норсон байна. Бид ямар дүгнэлт хийж чадах вэ?",
    options: [
      "Бороо заавал орсон",
      "Бороо орсон байж болно",
      "Бороо ороогүй",
      "Газар үргэлж нойтон байдаг",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Бороо газрыг норгодог ч газар өөр шалтгаанаар, тухайлбал усалгаа эсвэл үерийн улмаас норсон байж болно. Тиймээс бороо орсон байж магадгүй гэж л дүгнэнэ.",
    timeLimitSeconds: 45,
    points: 10,
  },
  {
    id: "lr-003",
    category: "logical_reasoning",
    difficulty: "medium",
    questionText:
      "Мэдэгдэл: Ямар ч багш оюутан биш. Бүх оюутан суралцагч мөн. Дүгнэлт: Зарим суралцагч багш биш. Энэ дүгнэлт зөв үү?",
    options: [
      "Тийм, дүгнэлт зөв",
      "Үгүй, дүгнэлт буруу",
      "Тодорхойлох боломжгүй",
      "Зөвхөн оюутан биш суралцагч байгаа тохиолдолд",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Бүх оюутан суралцагч бөгөөд ямар ч багш оюутан биш. Иймээс оюутан суралцагчид багш байж чадахгүй тул зарим суралцагч багш биш байна.",
    timeLimitSeconds: 60,
    points: 15,
  },
  {
    id: "lr-004",
    category: "logical_reasoning",
    difficulty: "medium",
    questionText:
      "A нь B-ээс өндөр. C нь B-ээс намхан. D нь A-аас өндөр. Хэн хамгийн намхан вэ?",
    options: ["A", "B", "C", "D"],
    correctAnswerIndex: 2,
    explanation:
      "Өндрийн дарааллаар: D > A > B > C. D нь A-аас өндөр, A нь B-ээс өндөр, C нь B-ээс намхан. Тиймээс C хамгийн намхан.",
    timeLimitSeconds: 60,
    points: 15,
  },
  {
    id: "lr-005",
    category: "logical_reasoning",
    difficulty: "medium",
    questionText:
      "Уралдаанд Том Жеррийгээс өмнө, гэхдээ Сэмээс хойно ирлээ. Майк Сэмээс өмнө ирлээ. Хэн уралдаанд ялсан бэ?",
    options: ["Том", "Жерри", "Сэм", "Майк"],
    correctAnswerIndex: 3,
    explanation:
      "Ирэх дараалал: Майк → Сэм → Том → Жерри. Майк Сэмээс өмнө, Сэм Томоос өмнө, Том Жеррийгээс өмнө ирсэн. Тиймээс Майк ялсан.",
    timeLimitSeconds: 60,
    points: 15,
  },
  {
    id: "lr-006",
    category: "logical_reasoning",
    difficulty: "hard",
    questionText:
      "Хэрэв бүх А нь Б мөн, зарим Б нь В мөн, ямар ч В нь Г биш бол дараах зүйлсийн аль нь заавал үнэн бэ?",
    options: [
      "Зарим А нь В мөн",
      "Ямар ч А нь Г биш",
      "Зарим Б нь Г биш",
      "Бүх Б нь А мөн",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Зарим Б нь В мөн бөгөөд ямар ч В нь Г биш. Тиймээс В болох эдгээр Б нь Г байж чадахгүй, өөрөөр хэлбэл зарим Б нь Г биш. Харин зарим А нь В мөн эсэхийг тогтоох боломжгүй.",
    timeLimitSeconds: 90,
    points: 20,
  },
  {
    id: "lr-007",
    category: "logical_reasoning",
    difficulty: "hard",
    questionText:
      "Таван хүн нэг эгнээнд суув. А нь Б-ийн хажууд биш. Б нь В-ийн хажууд. В дунд суудалд суув. Г нэг үзүүрт суув. Нөгөө үзүүрт хэн сууж болох вэ?",
    options: ["Зөвхөн Б", "Зөвхөн А", "А эсвэл Д", "Зөвхөн Д"],
    correctAnswerIndex: 2,
    explanation:
      "В 3-р суудалд, Б нь 2 эсвэл 4-р суудалд сууна. Г нь 1 эсвэл 5-р суудалд суух бөгөөд А нь Б-ийн хажууд суухгүй. Тиймээс Г-ийн эсрэг үзүүрт А эсвэл Д сууж болно.",
    timeLimitSeconds: 90,
    points: 20,
  },
  {
    id: "lr-008",
    category: "logical_reasoning",
    difficulty: "easy",
    questionText:
      "Хэрэв бүх нохой амьтан бөгөөд бүх амьтанд ус хэрэгтэй бол нохойн талаар ямар дүгнэлт гаргаж болох вэ?",
    options: [
      "Нохойд ус хэрэгтэй байж болно",
      "Нохойд заавал ус хэрэгтэй",
      "Зарим нохойд л ус хэрэгтэй",
      "Нохой бусад амьтнаас илүү их ус хэрэглэдэг",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Энэ бол сонгодог силлогизм. Бүх нохой амьтан → бүх амьтанд ус хэрэгтэй → тиймээс бүх нохойд заавал ус хэрэгтэй. Энэ нь логик оролцооны шилжих шинж чанарыг дагадаг.",
    timeLimitSeconds: 45,
    points: 10,
  },
  {
    id: "lr-009",
    category: "logical_reasoning",
    difficulty: "hard",
    questionText:
      "'Алим', 'Жүрж', 'Холимог' гэж тус тус шошголсон гурван хайрцаг байна. БҮГД буруу шошготой. 'Холимог' гэж шошголсон хайрцгаас нэг жимс авахад алим гарлаа. 'Жүрж' гэж шошголсон хайрцагт юу байна вэ?",
    options: ["Жүрж", "Алим", "Холимог", "Тодорхойлох боломжгүй"],
    correctAnswerIndex: 2,
    explanation:
      "Бүх шошго буруу тул: 'Холимог' хайрцаг холимог биш. Алим татсан тул энэ нь Алимны хайрцаг. 'Алим' хайрцаг алим биш, 'Жүрж' хайрцаг жүрж биш. Алимыг 'Холимог'-д оноосон тул 'Алим' хайрцаг жүрж, 'Жүрж' хайрцаг холимог байна.",
    timeLimitSeconds: 90,
    points: 20,
  },
  {
    id: "lr-010",
    category: "logical_reasoning",
    difficulty: "medium",
    questionText:
      "Даваа гарагийн хүүхэд үзэсгэлэнтэй. Мягмар гарагийн хүүхэд нигүүлсэнгүй. Хэрэв Сарa үзэсгэлэнтэй бөгөөд нигүүлсэнгүй бол, Сарa ямар гарагт төрсөн байж болох вэ?",
    options: [
      "Зөвхөн Даваа",
      "Зөвхөн Мягмар",
      "Даваа эсвэл Мягмар",
      "Аль нь ч биш — мэдэгдлүүд эдгээрийг онцгой гэж хэлдэггүй",
    ],
    correctAnswerIndex: 3,
    explanation:
      "Мэдэгдлүүд Даваа гарагийн хүүхэд үзэсгэлэнтэй гэж хэлдэг, гэхдээ ЗӨВХӨН Даваа гарагийн хүүхэд үзэсгэлэнтэй гэж хэлдэггүй. Сарa ямар ч гарагт төрсөн байж болно — үзэсгэлэнтэй байх нь заавал Даваа гарагт төрснийг шаарддаггүй.",
    timeLimitSeconds: 60,
    points: 15,
  },

  // ========================================================
  // ХЭЭ ТАНИХ — 10 асуулт
  // ========================================================
  {
    id: "pr-001",
    category: "pattern_recognition",
    difficulty: "easy",
    questionText: "Дараалалд юу ирэх вэ? A, C, E, G, ___",
    options: ["H", "I", "J", "K"],
    correctAnswerIndex: 1,
    explanation:
      "Үсэг бүрийг нэг алгасаж байна: A, C, E, G, I. Тиймээс дараагийн үсэг нь I.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "pr-002",
    category: "pattern_recognition",
    difficulty: "easy",
    questionText: "Дараагийн зүйлийг олоорой: ◯, ◯◯, ◯◯◯, ◯◯◯◯, ___",
    options: ["◯◯◯", "◯◯◯◯◯", "◯◯◯◯◯◯", "◯◯"],
    correctAnswerIndex: 1,
    explanation:
      "Тойргийн тоо нэг нэгээр нэмэгддэг: 1, 2, 3, 4, 5. Дараагийн зүйл 5 тойрогтой.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "pr-003",
    category: "pattern_recognition",
    difficulty: "medium",
    questionText: "Дараа нь юу ирэх вэ? AZ, BY, CX, DW, ___",
    options: ["EV", "EU", "EX", "FV"],
    correctAnswerIndex: 0,
    explanation:
      "Эхний үсэг урагш явдаг (A→B→C→D→E), хоёр дахь үсэг ухрадаг (Z→Y→X→W→V). Тиймээс дараагийн хос EV.",
    timeLimitSeconds: 45,
    points: 15,
  },
  {
    id: "pr-004",
    category: "pattern_recognition",
    difficulty: "medium",
    questionText: "Хэвийг дуусгаарай: 1A, 2BB, 3CCC, 4DDDD, ___",
    options: ["5EEE", "5EEEEE", "5EEEE", "EE5"],
    correctAnswerIndex: 1,
    explanation:
      "Тоо 1-ээр нэмэгддэг. Үсэг 1-ээр урагшилдаг. Үсэг тооны утгатай тэнцэх удаа давтагддаг. Тиймээс 5, дараа нь E-г 5 удаа давтсан: 5EEEEE.",
    timeLimitSeconds: 60,
    points: 15,
  },
  {
    id: "pr-005",
    category: "pattern_recognition",
    difficulty: "medium",
    questionText:
      "Аль нь харьяалагдахгүй вэ? Гурвалжин, Дөрвөлжин, Тавалжин, Тойрог, Зургаалжин",
    options: ["Гурвалжин", "Тавалжин", "Тойрог", "Зургаалжин"],
    correctAnswerIndex: 2,
    explanation:
      "Гурвалжин, дөрвөлжин, тавалжин, зургаалжин бүгд олон өнцөгт (шулуун талтай дүрс) юм. Тойрог шулуун тал, оройгүй тул бусдаас үндсэндээ ялгаатай.",
    timeLimitSeconds: 45,
    points: 15,
  },
  {
    id: "pr-006",
    category: "pattern_recognition",
    difficulty: "hard",
    questionText:
      "Дараа нь юу ирэх вэ? J, F, M, A, M, J, J, A, ___ (Англи хэлний сарын нэрсийн эхний үсгүүд)",
    options: ["S", "O", "N", "D"],
    correctAnswerIndex: 0,
    explanation:
      "Эдгээр нь Англи хэлний сарын нэрсийн эхний үсгүүд: January, February, March, April, May, June, July, August → дараагийнх нь September (S).",
    timeLimitSeconds: 60,
    points: 20,
  },
  {
    id: "pr-007",
    category: "pattern_recognition",
    difficulty: "hard",
    questionText: "Хэвийг олоорой: 11, 12, 14, 17, 21, 26, ___",
    options: ["30", "31", "32", "33"],
    correctAnswerIndex: 2,
    explanation:
      "Залгаа тоонуудын зөрүү бүр 1-ээр нэмэгддэг: +1, +2, +3, +4, +5, +6. Тиймээс 26 + 6 = 32.",
    timeLimitSeconds: 60,
    points: 20,
  },
  {
    id: "pr-008",
    category: "pattern_recognition",
    difficulty: "easy",
    questionText:
      "Аль тоо бүлэгт харьяалагдахгүй вэ? 2, 5, 11, 14, 17, 23",
    options: ["14", "5", "2", "11"],
    correctAnswerIndex: 0,
    explanation:
      "14-ийг эс тооцвол бүх тоо энгийн тоо (простой тоо) юм. 14 = 2 × 7 тул нийлмэл тоо бөгөөд энэ бүлэгт харьяалагдахгүй.",
    timeLimitSeconds: 45,
    points: 10,
  },
  {
    id: "pr-009",
    category: "pattern_recognition",
    difficulty: "hard",
    questionText:
      "Дараа нь юу ирэх вэ? OTT, FFS, SEN, ___ (Англи тооны нэрсийн эхний үсгүүд)",
    options: ["NTE", "TEN", "ETE", "NET"],
    correctAnswerIndex: 0,
    explanation:
      "Үсгийн гурвал бүр нь англиар нэрлэсэн дараалсан гурван тооны эхний үсэг: One-Two-Three (OTT), Four-Five-Six (FFS), Seven-Eight-Nine (SEN). Дараагийнх нь Nine-Ten-Eleven (NTE).",
    timeLimitSeconds: 90,
    points: 20,
  },
  {
    id: "pr-010",
    category: "pattern_recognition",
    difficulty: "medium",
    questionText:
      "Хэрэв 🔴 = 1, 🔵 = 2, 🟢 = 3 бол 🔴🔵🟢 + 🟢🔵🔴 = ?",
    options: ["246", "444", "369", "258"],
    correctAnswerIndex: 1,
    explanation:
      "🔴🔵🟢 = 123 (гурван оронтой тоо), 🟢🔵🔴 = 321. 123 + 321 = 444.",
    timeLimitSeconds: 60,
    points: 15,
  },

  // ========================================================
  // ТООН ДАРААЛАЛ — 10 асуулт
  // ========================================================
  {
    id: "ns-001",
    category: "numerical_sequence",
    difficulty: "easy",
    questionText: "Дараа нь юу ирэх вэ? 2, 4, 8, 16, 32, ___",
    options: ["48", "56", "64", "62"],
    correctAnswerIndex: 2,
    explanation:
      "Тус бүр 2-оор үржигддэг: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64. Энэ нь 2 харьцаатай геометрийн дараалал.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "ns-002",
    category: "numerical_sequence",
    difficulty: "easy",
    questionText: "Дараагийн тоог олоорой: 3, 6, 9, 12, 15, ___",
    options: ["17", "18", "19", "21"],
    correctAnswerIndex: 1,
    explanation:
      "Энэ бол 3-ын үржвэрийн хүснэгт (нийт зөрүү 3-тай арифметик дараалал): 15 + 3 = 18.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "ns-003",
    category: "numerical_sequence",
    difficulty: "medium",
    questionText: "Дараа нь юу ирэх вэ? 1, 1, 2, 3, 5, 8, 13, ___",
    options: ["18", "20", "21", "26"],
    correctAnswerIndex: 2,
    explanation:
      "Энэ бол Фибоначчийн дараалал бөгөөд тус бүр нь өмнөх хоёр тооны нийлбэр: 8 + 13 = 21.",
    timeLimitSeconds: 45,
    points: 15,
  },
  {
    id: "ns-004",
    category: "numerical_sequence",
    difficulty: "medium",
    questionText: "Дараагийн тоог олоорой: 1, 4, 9, 16, 25, ___",
    options: ["30", "35", "36", "49"],
    correctAnswerIndex: 2,
    explanation:
      "Эдгээр нь бүрэн квадратууд: 1², 2², 3², 4², 5², 6². Дараагийнх нь 6² = 36.",
    timeLimitSeconds: 45,
    points: 15,
  },
  {
    id: "ns-005",
    category: "numerical_sequence",
    difficulty: "medium",
    questionText: "Дараа нь юу ирэх вэ? 2, 6, 12, 20, 30, ___",
    options: ["40", "42", "44", "48"],
    correctAnswerIndex: 1,
    explanation:
      "Зөрүүнүүд нь 4, 6, 8, 10, 12 (2-оор нэмэгдэнэ). Тиймээс 30 + 12 = 42. Мөн n-р гишүүн = n×(n+1) томьёогоор: 6×7 = 42.",
    timeLimitSeconds: 60,
    points: 15,
  },
  {
    id: "ns-006",
    category: "numerical_sequence",
    difficulty: "hard",
    questionText: "Дараа нь юу ирэх вэ? 1, 2, 6, 24, 120, ___",
    options: ["240", "480", "600", "720"],
    correctAnswerIndex: 3,
    explanation:
      "Эдгээр нь факториал тоонууд: 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720. Тус бүр нь дараагийн бүхэл тоогоор үржигддэг.",
    timeLimitSeconds: 60,
    points: 20,
  },
  {
    id: "ns-007",
    category: "numerical_sequence",
    difficulty: "hard",
    questionText: "Дутуу тоог олоорой: 3, 5, 9, 17, ___, 65",
    options: ["28", "31", "33", "35"],
    correctAnswerIndex: 2,
    explanation:
      "Тус бүр нь дараах дүрмийг дагадаг: 2-оор үржүүлж 1-ийг хасна. 3×2−1=5, 5×2−1=9, 9×2−1=17, 17×2−1=33, 33×2−1=65.",
    timeLimitSeconds: 90,
    points: 20,
  },
  {
    id: "ns-008",
    category: "numerical_sequence",
    difficulty: "easy",
    questionText: "Дараа нь юу ирэх вэ? 100, 90, 81, 73, 66, ___",
    options: ["59", "60", "61", "58"],
    correctAnswerIndex: 1,
    explanation:
      "Зөрүүнүүд нь тус бүр 1-ээр буурдаг: −10, −9, −8, −7, −6. Тиймээс 66 − 6 = 60.",
    timeLimitSeconds: 45,
    points: 10,
  },
  {
    id: "ns-009",
    category: "numerical_sequence",
    difficulty: "hard",
    questionText: "Дараа нь юу ирэх вэ? 0, 1, 8, 27, 64, ___",
    options: ["100", "125", "128", "216"],
    correctAnswerIndex: 1,
    explanation:
      "Эдгээр нь бүрэн кубууд: 0³=0, 1³=1, 2³=8, 3³=27, 4³=64, 5³=125.",
    timeLimitSeconds: 60,
    points: 20,
  },
  {
    id: "ns-010",
    category: "numerical_sequence",
    difficulty: "medium",
    questionText: "Дараагийн тоог олоорой: 2, 3, 5, 7, 11, 13, ___",
    options: ["15", "16", "17", "19"],
    correctAnswerIndex: 2,
    explanation:
      "Энэ бол энгийн тоонуудын дараалал. 13-ийн дараах дараагийн энгийн тоо нь 17 юм (14=2×7, 15=3×5, 16=2⁴ бүгд нийлмэл тоо).",
    timeLimitSeconds: 45,
    points: 15,
  },

  // ========================================================
  // ОРОН ЗАЙН СЭТГЭЛГЭЭ — 10 асуулт
  // ========================================================
  {
    id: "sr-001",
    category: "spatial_reasoning",
    difficulty: "easy",
    questionText:
      "Куб 6 талтай. Хэрэв бүх талыг улаанаар будаж, дараа нь кубыг 27 тэнцүү жижиг куб болгон хэрчвэл (3×3×3), яг 3 улаан талтай жижиг куб хэд байх вэ?",
    options: ["4", "6", "8", "12"],
    correctAnswerIndex: 2,
    explanation:
      "Анхны кубын 8 булангийн жижиг кубууд тус бүр яг 3 будсан тал байна. 3×3×3 кубт яг 8 булан байдаг.",
    timeLimitSeconds: 60,
    points: 10,
  },
  {
    id: "sr-002",
    category: "spatial_reasoning",
    difficulty: "easy",
    questionText:
      "Зургаан дөрвөлжнөөс бүтсэн загалмай хэлбэрийн дэлгээсийг нугалбал ямар гурван хэмжээст дүрс үүсэх вэ?",
    options: ["Пирамид", "Куб", "Тэгш өнцөгт призм", "Гурвалжин призм"],
    correctAnswerIndex: 1,
    explanation:
      "Зургаан дөрвөлжнөөс бүтсэн загалмай хэлбэрийн дэлгээсийг нугалахад куб үүснэ. Дөрвөлжин бүр кубын нэг тал болно.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "sr-003",
    category: "spatial_reasoning",
    difficulty: "medium",
    questionText:
      "Цаасыг хагасаар нугалж, дараа нь дахин хагасаар нугална. Бүх давхаргаар нэг нүх гаргана. Бүрэн задлахад хэдэн нүх байх вэ?",
    options: ["2", "3", "4", "8"],
    correctAnswerIndex: 2,
    explanation:
      "Нугалах бүрт давхаргын тоо хоёр дахин нэмэгддэг. 1-р нугалт: 2 давхарга. 2-р нугалт: 4 давхарга. 4 давхаргаар нэг нүх гаргавал бүрэн задлахад 4 нүх гарна.",
    timeLimitSeconds: 60,
    points: 15,
  },
  {
    id: "sr-004",
    category: "spatial_reasoning",
    difficulty: "medium",
    questionText:
      "Та толинд цаг харж байна. Толин дахь цаг 2:50 харагдаж байна. Бодит цаг хэд вэ?",
    options: ["9:10", "10:10", "9:50", "10:50"],
    correctAnswerIndex: 0,
    explanation:
      "Толин дахь цагаас бодит цагийг олохын тулд 12:00-аас толин цагийг хасна: 12:00 − 2:50 = 9:10. Бодит цаг 9:10.",
    timeLimitSeconds: 60,
    points: 15,
  },
  {
    id: "sr-005",
    category: "spatial_reasoning",
    difficulty: "medium",
    questionText: "Гурвалжин призм хэдэн талтай вэ?",
    options: ["3", "4", "5", "6"],
    correctAnswerIndex: 2,
    explanation:
      "Гурвалжин призм 5 талтай: 2 гурвалжин тал (дээд ба доод) болон 3 тэгш өнцөгт тал (хажуу).",
    timeLimitSeconds: 30,
    points: 15,
  },
  {
    id: "sr-006",
    category: "spatial_reasoning",
    difficulty: "hard",
    questionText:
      "Хэрэв кубын бүх талыг цэнхэрээр будаж, дараа нь 64 тэнцүү жижиг куб болгон хэрчвэл (4×4×4), будсан тал огт байхгүй жижиг куб хэд байх вэ?",
    options: ["0", "4", "8", "16"],
    correctAnswerIndex: 2,
    explanation:
      "4×4×4 кубт будаагүй кубууд нь бүрэн дотор байгаа — гадна талд хүрдэггүй хэсэг. Энэ нь 2×2×2 дотоод куб үүсгэдэг = будаагүй 8 куб.",
    timeLimitSeconds: 90,
    points: 20,
  },
  {
    id: "sr-007",
    category: "spatial_reasoning",
    difficulty: "hard",
    questionText:
      "Тэгш өнцөгт өрөө 12 м урт, 8 м өргөн, 4 м өндөртэй. Шалны нэг буланд байгаа шоргоолж таазны эсрэг буланд хүрэхийг хүсэж байна. Гадаргуугаар явах хамгийн богино зам хэд вэ?",
    options: [
      "20м",
      "√(16² + 8²) ≈ 17.9м",
      "√(20² + 4²) ≈ 20.4м",
      "24м",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Өрөөг задлахад шоргоолж шалаар явж алсын хананд гарна. Оновчтой задалт (8+4)=12 өргөн, (12+4)=16 өндөртэй тэгш өнцөгт үүсгэнэ. Хамгийн богино зам = √(12²+16²) = √(144+256) = √400 = 20м.",
    timeLimitSeconds: 120,
    points: 20,
  },
  {
    id: "sr-008",
    category: "spatial_reasoning",
    difficulty: "easy",
    questionText:
      "Хэрэв 'R' үсгийг толинд харвал аль хэсэг нь өөрчлөгдөн харагдах вэ?",
    options: [
      "Босоо шугам урвана",
      "Товгор ба хөл баруун биш зүүн тийш харна",
      "Доош эргэнэ",
      "Юу ч өөрчлөгдөхгүй",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Толь зүүн ба баруунг урвуулдаг. 'R' үсгийн товгор ба ташуу хөл ердийн байдалд баруун тийш харадаг. Толинд эдгээр нь зүүн тийш хардаг тул урвуу 'R' харагдана.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "sr-009",
    category: "spatial_reasoning",
    difficulty: "hard",
    questionText:
      "Том дөрвөлжин (6×6)-ийн нэг буланаас жижиг дөрвөлжин (2×2)-ийг хасч дүрс үүсгэнэ. Үүссэн дүрсийн периметр хэд вэ?",
    options: ["24", "28", "20", "26"],
    correctAnswerIndex: 0,
    explanation:
      "Анхны периметр = 4 × 6 = 24. Булангаас дөрвөлжин хэрчихэд урт 2-тай хоёр талын хэсгийг хасч, урт 2-тай хоёр шинэ дотоод тал нэмдэг. Периметр өөрчлөгдөлгүй 24 хэвээр.",
    timeLimitSeconds: 60,
    points: 20,
  },
  {
    id: "sr-010",
    category: "spatial_reasoning",
    difficulty: "medium",
    questionText:
      "Тэгш зургаан өнцөгтийг хэдэн тэгш талт гурвалжинд хувааж болох вэ?",
    options: ["4", "5", "6", "8"],
    correctAnswerIndex: 2,
    explanation:
      "Тэгш зургаан өнцөгтийн төвөөс орой бүр рүү шугам татвал түүнийг яг 6 тэгш талт гурвалжинд хувааж болно.",
    timeLimitSeconds: 45,
    points: 15,
  },

  // ========================================================
  // ҮГИЙН АНАЛОГИ — 10 асуулт
  // ========================================================
  {
    id: "va-001",
    category: "verbal_analogy",
    difficulty: "easy",
    questionText: "Ном : Унших = Сэрээ : ___",
    options: ["Зурах", "Бичих", "Идэх", "Хоол хийх"],
    correctAnswerIndex: 2,
    explanation:
      "Ном бол унших хэрэгсэл. Үүний нэгэн адил сэрээ бол идэх хэрэгсэл. Хоёулаа хэрэгсэл — үйл ажиллагааны харилцааг илэрхийлнэ.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "va-002",
    category: "verbal_analogy",
    difficulty: "easy",
    questionText: "Нүд : Харах = Чих : ___",
    options: ["Үнэрлэх", "Сонсох", "Мэдрэх", "Амтлах"],
    correctAnswerIndex: 1,
    explanation:
      "Нүд бол харах эрхтэн. Чих бол сонсох эрхтэн. Энэ бол эрхтэн — үүргийн аналоги.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "va-003",
    category: "verbal_analogy",
    difficulty: "medium",
    questionText: "Архитектор : Зураг төсөл = Хөгжмийн зохиолч : ___",
    options: ["Хөгжим", "Нот", "Найрал хөгжим", "Аялгуу"],
    correctAnswerIndex: 1,
    explanation:
      "Архитектор нь зураг төслийг (өөрийн төлөвлөлтийн баримт бичиг) бүтээдэг. Хөгжмийн зохиолч нь нотыг (хөгжмийн тэмдэглэл) бүтээдэг. Хоёулаа бүтээгч — албан ёсны төлөвлөлтийн харилцаа.",
    timeLimitSeconds: 45,
    points: 15,
  },
  {
    id: "va-004",
    category: "verbal_analogy",
    difficulty: "medium",
    questionText: "Марафон : Спринт = Роман : ___",
    options: ["Ном", "Өгүүллэг", "Шүлэг", "Эссэ"],
    correctAnswerIndex: 1,
    explanation:
      "Марафон бол урт зайн гүйлт, спринт бол богино зайн гүйлт. Роман бол уран зохиолын урт хэлбэр, өгүүллэг бол богино хэлбэр. Энд урт ба богино хэлбэрийг харьцуулж байна.",
    timeLimitSeconds: 45,
    points: 15,
  },
  {
    id: "va-005",
    category: "verbal_analogy",
    difficulty: "medium",
    questionText: "Хорхой : Эрвээхэй = Мэлхийн зулзага : ___",
    options: ["Загас", "Мэлхий", "Бах", "Саламандр"],
    correctAnswerIndex: 1,
    explanation:
      "Хорхой эрвээхэй болж хувирдаг. Мэлхийн зулзага мэлхий болж хувирдаг. Хоёулаа бойжоогүй — бойжсон организмын хувирлыг илэрхийлнэ.",
    timeLimitSeconds: 30,
    points: 15,
  },
  {
    id: "va-006",
    category: "verbal_analogy",
    difficulty: "hard",
    questionText: "Мэс хутга : Мэс засалч = Шүүгчийн алх : ___",
    options: ["Өмгөөлөгч", "Шүүгч", "Дархан", "Шүүхийн нарийн бичиг"],
    correctAnswerIndex: 1,
    explanation:
      "Мэс хутга бол мэс засалчийн онцлог хэрэгсэл. Үүнтэй адил шүүгчийн алх бол шүүгчийн онцлог хэрэгсэл.",
    timeLimitSeconds: 45,
    points: 20,
  },
  {
    id: "va-007",
    category: "verbal_analogy",
    difficulty: "hard",
    questionText: "Цөлийн булаг : Цөл = Арал : ___",
    options: ["Ус", "Далай", "Эрэг", "Тив"],
    correctAnswerIndex: 1,
    explanation:
      "Цөлийн булаг бол цөлд хүрээлэгдсэн тусгаарлагдсан ногоон хэсэг. Арал бол далайд хүрээлэгдсэн тусгаарлагдсан газрын хэсэг. Хоёулаа том нэгэн төрлийн орчны дотор ялгаатай хэсэг.",
    timeLimitSeconds: 45,
    points: 20,
  },
  {
    id: "va-008",
    category: "verbal_analogy",
    difficulty: "easy",
    questionText: "Халуун : Хүйтэн = Өндөр : ___",
    options: ["Том", "Намхан", "Өргөн", "Урт"],
    correctAnswerIndex: 1,
    explanation:
      "Халуун ба хүйтэн нь эсрэг утгатай (антоним). Үүний нэгэн адил өндөр ба намхан эсрэг утгатай. Энэ бол энгийн эсрэг үг аналоги.",
    timeLimitSeconds: 30,
    points: 10,
  },
  {
    id: "va-009",
    category: "verbal_analogy",
    difficulty: "hard",
    questionText: "Пролог : Эпилог = Үүр цайх : ___",
    options: ["Өглөө", "Бүрий", "Шөнө", "Үд дунд"],
    correctAnswerIndex: 1,
    explanation:
      "Пролог нь түүхийн эхэнд, эпилог нь төгсгөлд байдаг. Үүр цайх өдрийн эхэнд, бүрий өдрийн төгсгөлд байдаг. Хоёулаа эхлэл — төгсгөлийн хос.",
    timeLimitSeconds: 45,
    points: 20,
  },
  {
    id: "va-010",
    category: "verbal_analogy",
    difficulty: "medium",
    questionText: "Вакцин : Урьдчилан сэргийлэлт = Антибиотик : ___",
    options: ["Өвчин", "Эмчилгээ", "Дархлаа", "Оношилгоо"],
    correctAnswerIndex: 1,
    explanation:
      "Вакцины зорилго нь урьдчилан сэргийлэлт (өвчин эхлэхийн өмнө зогсоох). Антибиотикийн зорилго нь эмчилгээ (халдварт нэрвэгдсэний дараа эдгэрүүлэх). Хоёулаа эм — зориулалтын аналоги.",
    timeLimitSeconds: 45,
    points: 15,
  },
];

export type TestAnswer = {
  questionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  difficulty: DifficultyLevel;
  timeLimitSeconds: number;
};

export type CognitiveSpeedCategory =
  | 'Fast & Decisive'
  | 'Balanced'
  | 'Analytical & Reflective';

export type FinalIQResult = {
  iqScore: number;
  accuracyRate: number;
  difficultyLevelReached: DifficultyLevel;
  cognitiveSpeedCategory: CognitiveSpeedCategory;
};

const miniQuestionIds = [
  'lr-001', 'lr-004', 'lr-005', 'lr-009',
  'pr-001', 'pr-003', 'pr-005', 'pr-006',
  'ns-001', 'ns-003', 'ns-006', 'ns-007',
  'sr-001', 'sr-003', 'sr-004', 'sr-006',
  'va-001', 'va-003', 'va-006', 'va-007',
] as const;

const miniQuestionOverrides: Record<
  string,
  Pick<IQTestQuestion, 'questionText' | 'options' | 'correctAnswerIndex' | 'explanation' | 'timeLimitSeconds'>
> = {
  'lr-001': { questionText: "Дараах мэдэгдэл үнэн: ‘Хэрэв машин ажиллаж байвал бензин байна.’ Одоо бензин байхгүй байна. Аль дүгнэлт заавал үнэн бэ?", options: ['Машин ажиллаж байна', 'Машин ажиллахгүй байна', 'Машин засварт орсон байна', 'Бензин нэмэх хэрэгтэй'], correctAnswerIndex: 1, explanation: 'Modus Tollens: бензин байхгүй тул машин ажиллахгүй.', timeLimitSeconds: 45 },
  'lr-004': { questionText: 'А, Б, В, Г, Д хайрцаг эгнэнэ. В нь А-ийн яг зүүнд, Д нь А ба Б-ийн хооронд, Г хамгийн баруунд байна. Зүүнээс хоёрдугаарт аль нь вэ?', options: ['А', 'Б', 'В', 'Д'], correctAnswerIndex: 0, explanation: 'Дараалал: В, А, Д, Б, Г.', timeLimitSeconds: 60 },
  'lr-005': { questionText: 'Цэцэг Доржоос, Дорж Анугаас өмнө ирэв. Эрдэнэ Дорж ба Анугийн хооронд, Ану Болдоос өмнө ирэв. Гуравдугаарт хэн ирсэн бэ?', options: ['Ану', 'Дорж', 'Эрдэнэ', 'Цэцэг'], correctAnswerIndex: 2, explanation: 'Дараалал: Цэцэг, Дорж, Эрдэнэ, Ану, Болд.', timeLimitSeconds: 60 },
  'lr-009': { questionText: 'Мөнгө хайрцаг эсвэл уутанд байна. Дараах гурван мэдэгдлийн яг нэг нь үнэн: (1) хайрцагт байна, (2) хайрцагт байхгүй, (3) уутанд байхгүй. Мөнгө хаана байна вэ?', options: ['Хайрцагт', 'Уутанд', 'Аль алинд', 'Тодорхойлох боломжгүй'], correctAnswerIndex: 1, explanation: 'Зөвхөн (2) үнэн байхын тулд мөнгө уутанд байна.', timeLimitSeconds: 90 },
  'pr-001': { questionText: 'Дараалалд юу ирэх вэ? B, D, G, K, ___', options: ['N', 'O', 'P', 'Q'], correctAnswerIndex: 2, explanation: 'Алхамууд +2, +3, +4, +5; хариу P.', timeLimitSeconds: 40 },
  'pr-003': { questionText: 'Дараалалд юу ирэх вэ? 1A, 4D, 9I, 16P, ___', options: ['20T', '25T', '25Y', '36Z'], correctAnswerIndex: 2, explanation: 'Квадрат тоо ба тухайн байрлалын үсэг: 25Y.', timeLimitSeconds: 45 },
  'pr-005': { questionText: 'Аль нь бусаддаа хамаарахгүй вэ? 8, 27, 64, 100, 125', options: ['8', '27', '100', '125'], correctAnswerIndex: 2, explanation: '100 нь куб биш, квадрат тоо.', timeLimitSeconds: 45 },
  'pr-006': { questionText: 'Дараалалд юу ирэх вэ? 1, 11, 21, 1211, 111221, ___', options: ['312211', '123122', '1112221', '12112211'], correctAnswerIndex: 0, explanation: 'Look-and-say дарааллын дараагийн гишүүн 312211.', timeLimitSeconds: 90 },
  'ns-001': { questionText: 'Дараалалд юу ирэх вэ? 3, 8, 15, 24, 35, ___', options: ['44', '46', '48', '50'], correctAnswerIndex: 2, explanation: 'Зөрүү: +5, +7, +9, +11, +13; хариу 48.', timeLimitSeconds: 30 },
  'ns-003': { questionText: 'Дараалалд юу ирэх вэ? 2, 5, 11, 23, 47, ___', options: ['89', '91', '93', '95'], correctAnswerIndex: 3, explanation: 'Өмнөх тоог 2-оор үржүүлж 1 нэмнэ: 95.', timeLimitSeconds: 45 },
  'ns-006': { questionText: 'Дараалалд юу ирэх вэ? 1, 2, 6, 24, 120, ___', options: ['240', '480', '600', '720'], correctAnswerIndex: 3, explanation: 'Факториал дараалал: 6! = 720.', timeLimitSeconds: 60 },
  'ns-007': { questionText: 'Дутуу тоог олоорой: 3, 5, 9, 17, ___, 65', options: ['28', '31', '33', '35'], correctAnswerIndex: 2, explanation: '2-оор үржүүлж 1 хасна: 33.', timeLimitSeconds: 90 },
  'sr-001': { questionText: 'Кубын бүх талыг будаад 27 жижиг куб (3×3×3) болговол яг 2 будсан талтай жижиг куб хэд вэ?', options: ['6', '8', '12', '16'], correctAnswerIndex: 2, explanation: '12 ирмэгийн дундах кубууд тус бүр 2 будсан талтай.', timeLimitSeconds: 60 },
  'sr-003': { questionText: 'Цаасыг дундуур нь гурван удаа нугалаад бүх давхаргыг нэг цоолов. Бүтэн дэлгэхэд хэдэн нүх байх вэ?', options: ['4', '6', '8', '16'], correctAnswerIndex: 2, explanation: 'Гурван нугалалт 8 давхарга үүсгэнэ.', timeLimitSeconds: 60 },
  'sr-004': { questionText: 'Толин дахь цаг 8:18 байвал бодит цаг хэд вэ?', options: ['3:42', '4:42', '3:48', '4:38'], correctAnswerIndex: 0, explanation: '12:00 − 8:18 = 3:42.', timeLimitSeconds: 60 },
  'sr-006': { questionText: 'Кубыг будаад 64 жижиг куб (4×4×4) болговол огт будаггүй жижиг куб хэд вэ?', options: ['0', '4', '8', '16'], correctAnswerIndex: 2, explanation: 'Дотоод 2×2×2 хэсэгт 8 куб байна.', timeLimitSeconds: 90 },
  'va-001': { questionText: 'Ном : Номын сан = Зураг : ___', options: ['Зураач', 'Будаг', 'Галерей', 'Хүрээ'], correctAnswerIndex: 2, explanation: 'Бүтээлийг хадгалж, дэлгэдэг газар нь галерей.', timeLimitSeconds: 30 },
  'va-003': { questionText: 'Зохиолч : Тоймчлогч = Барилгачин : ___', options: ['Архитектор', 'Байцаагч', 'Захиалагч', 'Мужаан'], correctAnswerIndex: 1, explanation: 'Байцаагч нь барилгын ажлыг стандартын дагуу үнэлнэ.', timeLimitSeconds: 45 },
  'va-006': { questionText: 'Геологич : Чулуу = Энтомологич : ___', options: ['Ургамал', 'Шавьж', 'Далай тэнгис', 'Шувуу'], correctAnswerIndex: 1, explanation: 'Энтомологич шавьжийг судалдаг.', timeLimitSeconds: 45 },
  'va-007': { questionText: 'Хамгаалалтын хана : Кибер халдлага = Дархлааны систем : ___', options: ['Эм', 'Өвчин үүсгэгч', 'Эмч', 'Эс'], correctAnswerIndex: 1, explanation: 'Дархлааны систем өвчин үүсгэгчтэй тэмцдэг.', timeLimitSeconds: 45 },
};

/** 15–20 минутын, ангилал бүрээс дөрвөн асуулттай мини-тест. */
export const miniIQTestQuestions = miniQuestionIds.map((id) => {
  const question = iqTestQuestions.find((item) => item.id === id);

  if (!question) {
    throw new Error(`Mini IQ тестийн асуулт олдсонгүй: ${id}`);
  }

  return { ...question, ...miniQuestionOverrides[id] };
});

const pointsByDifficulty: Record<DifficultyLevel, number> = {
  easy: 10,
  medium: 15,
  hard: 20,
};

export const getNextQuestionDifficulty = ({
  difficulty,
  isCorrect,
  timeLimitSeconds,
  timeSpentSeconds,
}: TestAnswer): DifficultyLevel => {
  if (!isCorrect) {
    if (difficulty === 'hard') return 'medium';
    return 'easy';
  }

  if (timeSpentSeconds < timeLimitSeconds / 2) {
    if (difficulty === 'easy') return 'medium';
    return 'hard';
  }

  return difficulty;
};

const difficultyRank: Record<DifficultyLevel, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

export const calculateFinalIQResult = (
  userAnswers: TestAnswer[],
): FinalIQResult => {
  const totalTimeSpent = userAnswers.reduce(
    (total, answer) => total + answer.timeSpentSeconds,
    0,
  );
  const correctAnswers = userAnswers.filter((answer) => answer.isCorrect);
  const weightedCorrectScore = correctAnswers.reduce(
    (total, answer) => total + pointsByDifficulty[answer.difficulty],
    0,
  );
  const maximumPoints = userAnswers.reduce(
    (total, answer) => total + pointsByDifficulty[answer.difficulty],
    0,
  );
  const iqScore = maximumPoints
    ? Math.round(70 + (weightedCorrectScore / maximumPoints) * 75)
    : 70;
  const difficultyLevelReached = userAnswers.reduce<DifficultyLevel>(
    (highest, answer) =>
      difficultyRank[answer.difficulty] > difficultyRank[highest]
        ? answer.difficulty
        : highest,
    'easy',
  );

  return {
    iqScore: Math.min(Math.max(iqScore, 70), 145),
    accuracyRate: userAnswers.length
      ? Math.round((correctAnswers.length / userAnswers.length) * 100)
      : 0,
    difficultyLevelReached,
    cognitiveSpeedCategory:
      totalTimeSpent <= 600
        ? 'Fast & Decisive'
        : totalTimeSpent <= 1200
          ? 'Balanced'
          : 'Analytical & Reflective',
  };
};

// ────────────────────────────────────────────────────────────
// Туслах функцүүд
// ────────────────────────────────────────────────────────────

/** Ангиллаар шүүх */
export const getQuestionsByCategory = (
  category: QuestionCategory
): IQTestQuestion[] =>
  iqTestQuestions.filter((q) => q.category === category);

/** Хүндрэлийн түвшнээр шүүх */
export const getQuestionsByDifficulty = (
  difficulty: DifficultyLevel
): IQTestQuestion[] =>
  iqTestQuestions.filter((q) => q.difficulty === difficulty);

/** Fisher-Yates аргаар асуултуудыг холих */
export const shuffleQuestions = (
  questions: IQTestQuestion[]
): IQTestQuestion[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/** Нийт авах боломжтой оноог тооцоолох */
export const getTotalPossibleScore = (
  questions: IQTestQuestion[]
): number => questions.reduce((sum, q) => sum + q.points, 0);

/** Авсан оноогоос IQ тооцоолол (хялбаршуулсан) */
export const estimateIQ = (
  score: number,
  totalPossible: number
): number => {
  const percentage = (score / totalPossible) * 100;
  if (percentage >= 98) return 145;
  if (percentage >= 95) return 135;
  if (percentage >= 90) return 130;
  if (percentage >= 84) return 125;
  if (percentage >= 75) return 120;
  if (percentage >= 65) return 115;
  if (percentage >= 50) return 110;
  if (percentage >= 40) return 105;
  if (percentage >= 30) return 100;
  if (percentage >= 20) return 95;
  if (percentage >= 15) return 90;
  if (percentage >= 10) return 85;
  return 80;
};

/** IQ оноог тайлбарлах текст */
export const getIQDescription = (iq: number): string => {
  if (iq >= 140) return "Онцгой авьяастай";
  if (iq >= 130) return "Маш өндөр оюун ухаантай";
  if (iq >= 120) return "Өндөр оюун ухаантай";
  if (iq >= 110) return "Дунджаас дээш";
  if (iq >= 90)  return "Дундаж";
  if (iq >= 80)  return "Дунджаас доош";
  return "Сайжруулах шаардлагатай";
};

/** Тогтсон тооны жижиг тест үүсгэх */
export const generateMiniTest = (
  count = 20
): IQTestQuestion[] => {
  const perCategory = Math.ceil(count / 5);
  const categories: QuestionCategory[] = [
    "logical_reasoning",
    "pattern_recognition",
    "numerical_sequence",
    "spatial_reasoning",
    "verbal_analogy",
  ];
  const selected: IQTestQuestion[] = [];
  for (const cat of categories) {
    const catQuestions = shuffleQuestions(getQuestionsByCategory(cat));
    selected.push(...catQuestions.slice(0, perCategory));
  }
  return shuffleQuestions(selected).slice(0, count);
};

/** Өгөгдлийн статистик (хөгжүүлэлтэд зориулсан) */
export const getDatasetStats = () => {
  const total = iqTestQuestions.length;
  const byCategory = (Object.keys(categoryLabels) as QuestionCategory[]).map(
    (cat) => ({
      category: cat,
      label: categoryLabels[cat],
      count: getQuestionsByCategory(cat).length,
    })
  );
  const byDifficulty = (["easy", "medium", "hard"] as DifficultyLevel[]).map(
    (d) => ({
      difficulty: d,
      label: difficultyLabels[d],
      count: getQuestionsByDifficulty(d).length,
    })
  );
  return {
    total,
    byCategory,
    byDifficulty,
    totalPoints: getTotalPossibleScore(iqTestQuestions),
  };
};
