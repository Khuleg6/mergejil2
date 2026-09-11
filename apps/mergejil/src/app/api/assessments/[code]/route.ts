import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/auth/requireUser';
import { isMbtiType } from '@/lib/mbti';
import { MODULE_CODES, MODULE_META, type ModuleCode } from '@/lib/careerProfile';

type CompletedModuleResult = { module: { code: string } };

const isModuleCode = (value: string): value is ModuleCode =>
  (MODULE_CODES as readonly string[]).includes(value);

/**
 * Гурван модулийн (mbti / iq / skills) үр дүнг хадгална. Модулийн мөрийг
 * хаана ч seed хийдэггүй тул шаардлагатай бол өөрөө үүсгэнэ.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;
  const { user } = auth;

  const { code } = await params;
  if (!isModuleCode(code)) {
    return NextResponse.json(
      { error: 'Ийм үнэлгээний модуль байхгүй.' },
      { status: 404 },
    );
  }

  const body = await request.json().catch(() => null);
  const summary =
    typeof body?.summary === 'string' || typeof body?.summary === 'number'
      ? String(body.summary)
      : '';
  const detail = body?.detail ?? null;

  if (!summary) {
    return NextResponse.json(
      { error: 'Үр дүнгийн хураангуй хоосон байна.' },
      { status: 400 },
    );
  }
  if (code === 'mbti' && !isMbtiType(summary)) {
    return NextResponse.json(
      { error: 'MBTI төрөл буруу байна.' },
      { status: 400 },
    );
  }

  const db = getDb();
  const meta = MODULE_META[code];

  const module = await db.assessmentModule.upsert({
    where: { code },
    update: {},
    create: {
      code,
      name: meta.name,
      durationMin: meta.durationMin,
      orderIndex: meta.orderIndex,
    },
  });

  // Хэрэглэгчийн нээлттэй байгаа session-г үргэлжлүүлнэ, байхгүй бол шинээр.
  const session =
    (await db.assessmentSession.findFirst({
      where: { userId: user.id, status: 'in_progress' },
      orderBy: { startedAt: 'desc' },
    })) ??
    (await db.assessmentSession.create({ data: { userId: user.id } }));

  // Модуль тус бүрийн зөвхөн хамгийн сүүлийн үр дүнг хадгална.
  await db.moduleResult.deleteMany({
    where: { sessionId: session.id, moduleId: module.id },
  });

  const moduleResult = await db.moduleResult.create({
    data: {
      sessionId: session.id,
      moduleId: module.id,
      resultSummary: summary,
      resultDetail: detail,
    },
  });

  // Гурван модуль дуусмагц session-г completed болгоно.
  const completedCodes = await db.moduleResult.findMany({
    where: { sessionId: session.id, module: { code: { in: [...MODULE_CODES] } } },
    select: { module: { select: { code: true } } },
  });
  const done = new Set(
    completedCodes.map((row: CompletedModuleResult) => row.module.code),
  );
  if (MODULE_CODES.every((item) => done.has(item))) {
    await db.assessmentSession.update({
      where: { id: session.id },
      data: { status: 'completed', completedAt: new Date() },
    });
  }

  return NextResponse.json(
    {
      sessionId: session.id,
      moduleResultId: moduleResult.id,
      code,
      summary,
      completedModules: [...done],
    },
    { status: 201 },
  );
}
