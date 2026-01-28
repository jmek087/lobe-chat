'use client';

import { memo, useEffect } from 'react';

import { enableNextAuth } from '@/envs/auth';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

const NextAuthAutoRedirect = memo(() => {
  const isLoaded = useUserStore(authSelectors.isLoaded);
  const isLogin = useUserStore(authSelectors.isLogin);

  useEffect(() => {
    if (!enableNextAuth) return;
    if (!isLoaded) return;
    if (isLogin) return;

    const signInUrl = new URL('/next-auth/signin', window.location.origin);
    signInUrl.searchParams.set('callbackUrl', window.location.href);
    window.location.href = signInUrl.toString();
  }, [isLoaded, isLogin]);

  return null;
});

export default NextAuthAutoRedirect;
