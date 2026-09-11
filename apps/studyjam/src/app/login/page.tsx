'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Shell, View } from '@/components/Shell';
import { Button, Card, Field, TextInput } from '@/components/ui';
import { cx } from '@/lib/cx';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { api } from '@/lib/api';
import { ApiError } from '@/lib/types';
import type { Role } from '@/lib/types';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, ready, setSession } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace('/');
  }, [ready, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { token, user: nextUser } =
        mode === 'signin'
          ? await api.login({ email, password })
          : await api.signup({ name, email, password, role });
      setSession(token, nextUser);
      router.push('/');
    } catch (err) {
      toast(
        err instanceof ApiError ? err.message : 'Нэвтрэхэд алдаа гарлаа',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Shell activePath="/login">
      <View narrow className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="mb-5 flex gap-2 rounded-xl border border-line p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={cx(
                'flex-1 rounded-lg py-2 text-[15px] font-semibold transition-colors',
                mode === 'signin'
                  ? 'bg-violet text-white'
                  : 'text-ink-soft hover:text-ink',
              )}
            >
              Нэвтрэх
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cx(
                'flex-1 rounded-lg py-2 text-[15px] font-semibold transition-colors',
                mode === 'signup'
                  ? 'bg-violet text-white'
                  : 'text-ink-soft hover:text-ink',
              )}
            >
              Бүртгүүлэх
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <Field label="Нэр">
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </Field>
            )}

            <Field label="Имэйл">
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Field>

            <Field label="Нууц үг">
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
              />
            </Field>

            {mode === 'signup' && (
              <Field label="Та хэн бэ?">
                <div className="flex gap-2">
                  {(['student', 'teacher'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cx(
                        'flex-1 rounded-xl border py-2.5 text-[15px] font-semibold transition-colors',
                        role === r
                          ? 'border-transparent bg-mint text-white'
                          : 'border-line text-ink-soft hover:border-ink/25',
                      )}
                    >
                      {r === 'student' ? 'Сурагч' : 'Багш'}
                    </button>
                  ))}
                </div>
              </Field>
            )}

            <Button
              type="submit"
              variant="primary"
              block
              size="lg"
              className="mt-2"
              disabled={submitting}
            >
              {submitting
                ? 'Түр хүлээнэ үү...'
                : mode === 'signin'
                  ? 'Нэвтрэх'
                  : 'Бүртгүүлэх'}
            </Button>
          </form>
        </Card>
      </View>
    </Shell>
  );
}
