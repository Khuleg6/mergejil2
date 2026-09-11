import { database } from './database';
import { requireTeacher } from './session';

export const requireTeacherProfile = async () => {
  const user = await requireTeacher();
  if (!user.teacher) throw new Error('Teacher profile is missing');
  return user.teacher;
};

export const findOwnedClass = async (classId: string, teacherId: string) =>
  database.class.findFirst({ where: { id: classId, teacherId } });

export const classSummarySelect = {
  id: true,
  name: true,
  createdAt: true,
  _count: { select: { students: true } },
} as const;

export const classDetailsInclude = {
  students: {
    orderBy: { joinedAt: 'asc' as const },
    select: {
      joinedAt: true,
      student: {
        select: {
          id: true,
          phoneNumber: true,
          readingLevel: true,
          user: { select: { name: true } },
        },
      },
    },
  },
} as const;
