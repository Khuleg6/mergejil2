'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AvatarOptions,
  DEFAULT_AVATAR_OPTIONS,
  avatarOptionsForUser,
  generateAvatarUri,
} from '../lib/avatar';
import { useAuth } from '../lib/auth';

const STORAGE_PREFIX = 'studyjam:avatar-options:';

export function useAvatar() {
  const { user } = useAuth();
  const [options, setOptions] = useState<AvatarOptions>(
    DEFAULT_AVATAR_OPTIONS
  );

  // Keyed per account (studyjam:avatar-options:<userId>) — otherwise every
  // account on the same browser would read/write the same slot and show
  // each other's avatar. Falls back to a deterministic per-account look
  // (not the shared default) so accounts that never customized still look
  // different from one another.
  useEffect(() => {
    if (!user) return;
    const fallback = avatarOptionsForUser(user.id);
    try {
      const saved = window.localStorage.getItem(STORAGE_PREFIX + user.id);
      setOptions(saved ? { ...fallback, ...JSON.parse(saved) } : fallback);
    } catch {
      setOptions(fallback);
    }
  }, [user]);

  const saveOptions = useCallback(
    (next: AvatarOptions) => {
      setOptions(next);
      if (!user) return;
      try {
        window.localStorage.setItem(
          STORAGE_PREFIX + user.id,
          JSON.stringify(next)
        );
      } catch {
        // localStorage unavailable — in-memory only for this render
      }
    },
    [user]
  );

  // Show the account's avatar only while actually logged in — logging out
  // reverts the nav avatar to the plain shared default.
  const avatarUri = useMemo(
    () => generateAvatarUri(user ? options : DEFAULT_AVATAR_OPTIONS),
    [options, user]
  );

  return { options, avatarUri, saveOptions };
}
