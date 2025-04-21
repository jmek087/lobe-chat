'use client';

import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { enableNextAuth } from '@/const/auth';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

import { AppLoadingStage } from '../stage';

interface RedirectProps {
  setLoadingStage: (value: AppLoadingStage) => void;
}

const Redirect = memo<RedirectProps>(({ setLoadingStage }) => {
  const router = useRouter();
  const [isLogin, isLoaded, isUserStateInit, isOnboard] = useUserStore((s) => [
    authSelectors.isLogin(s),
    authSelectors.isLoaded(s),
    s.isUserStateInit,
    s.isOnboard,
  ]);

  const navToChat = () => {
    setLoadingStage(AppLoadingStage.GoToChat);
    router.replace('/chat');
  };

  const navToSignIn = () => {
    setLoadingStage(AppLoadingStage.GoToChat);
    // 如果启用了NextAuth，重定向到登录页面
    if (enableNextAuth) {
      router.replace('/next-auth/signin');
    } else {
      // 如果没有启用NextAuth，则保持原有行为
      router.replace('/chat');
    }
  };

  useEffect(() => {
    // if user auth state is not ready, wait for loading
    if (!isLoaded) {
      setLoadingStage(AppLoadingStage.InitAuth);
      return;
    }

    // this mean user is definitely not login
    if (!isLogin) {
      // 修改：未登录用户重定向到signin页面
      navToSignIn();
      return;
    }

    // if user state not init, wait for loading
    if (!isUserStateInit) {
      setLoadingStage(AppLoadingStage.InitUser);
      return;
    }

    // user need to onboard
    if (!isOnboard) {
      router.replace('/onboard');
      return;
    }

    // finally go to chat
    navToChat();
  }, [isUserStateInit, isLoaded, isOnboard, isLogin]);

  return null;
});

export default Redirect;
