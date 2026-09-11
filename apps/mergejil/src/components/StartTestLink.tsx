'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ASSESSMENT_PATH, buildLoginHref } from '@/lib/navigation';

type StartTestLinkProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * "Үнэлгээ эхлэх" холбоос: нэвтэрсэн бол шууд тест рүү, эс бөгөөс
 * бүртгүүлэх хуудас руу аваачна. Бүртгүүлж/нэвтэрсний дараа тест нээгдэнэ.
 */
export const StartTestLink = ({ children, className }: StartTestLinkProps) => {
  const { user } = useAuth();

  return (
    <Link
      href={user ? ASSESSMENT_PATH : buildLoginHref()}
      className={className}
    >
      {children}
    </Link>
  );
};
