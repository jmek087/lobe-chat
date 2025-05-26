'use client';

import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { enableNextAuth } from '@/const/auth';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

import { AppLoadingStage } from '../stage';

interface RedirectProps {
  setActiveStage: (value: AppLoadingStage) => void;
}

const Redirect = memo<RedirectProps>(({ setActiveStage }) => {
  const router = useRouter();
  const isUserStateInit = useUserStore((s) => s.isUserStateInit);
  const isLogin = useUserStore(authSelectors.isLogin);

  const isPgliteNotEnabled = useGlobalStore(systemStatusSelectors.isPgliteNotEnabled);

  const navToChat = () => {
    setActiveStage(AppLoadingStage.GoToChat);
    router.replace('/chat');
  };

  const navToSignIn = () => {
    setActiveStage(AppLoadingStage.GoToChat);
    // 如果启用了NextAuth，重定向到登录页面
    if (enableNextAuth) {
      router.replace('/next-auth/signin');
    } else {
      // 如果没有启用NextAuth，则保持原有行为
      router.replace('/chat');
    }
  };

  useEffect(() => {
    // if pglite is not enabled, redirect to chat
    if (isPgliteNotEnabled) {
      // 判断用户是否登录
      if (!isLogin) {
        navToSignIn();
      } else {
        navToChat();
      }
      return;
    }

    // if user state not init, wait for loading
    if (!isUserStateInit) {
      setActiveStage(AppLoadingStage.InitUser);
      return;
    }

    // 添加用户登录检查
    if (!isLogin) {
      navToSignIn();
      return;
    }

    // finally check the conversation status
    navToChat();
  }, [isUserStateInit, isPgliteNotEnabled, isLogin]);

  return null;
});

export default Redirect;
