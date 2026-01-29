import { authEnv } from '@/envs/auth';

import { buildOidcConfig } from '../helpers';
import type { GenericProviderDefinition } from '../types';

/**
 * Custom OIDC Provider - For OAuth servers that don't support OIDC Discovery
 *
 * Use this when your OAuth server doesn't have a .well-known/openid-configuration endpoint.
 * You need to manually specify the authorization, token, and userinfo URLs.
 *
 * Required environment variables:
 * - AUTH_CUSTOM_OIDC_ID: OAuth client ID
 * - AUTH_CUSTOM_OIDC_SECRET: OAuth client secret
 * - AUTH_CUSTOM_OIDC_AUTHORIZATION_URL: Authorization endpoint URL
 * - AUTH_CUSTOM_OIDC_TOKEN_URL: Token endpoint URL
 *
 * Optional environment variables:
 * - AUTH_CUSTOM_OIDC_USERINFO_URL: UserInfo endpoint URL
 *
 * Callback URL: https://yourdomain.com/api/auth/callback/custom-oidc
 */
const provider: GenericProviderDefinition<{
  AUTH_CUSTOM_OIDC_AUTHORIZATION_URL: string;
  AUTH_CUSTOM_OIDC_ID: string;
  AUTH_CUSTOM_OIDC_SECRET: string;
  AUTH_CUSTOM_OIDC_TOKEN_URL: string;
  AUTH_CUSTOM_OIDC_USERINFO_URL?: string;
}> = {
  build: (env) =>
    buildOidcConfig({
      authorizationUrl: env.AUTH_CUSTOM_OIDC_AUTHORIZATION_URL,
      clientId: env.AUTH_CUSTOM_OIDC_ID,
      clientSecret: env.AUTH_CUSTOM_OIDC_SECRET,
      overrides: {
        /**
         * Mirror NextAuth's fallback that prefers name -> username -> email so Better Auth never
         * fails with name_is_missing when upstream profiles only expose username/email fields.
         */
        mapProfileToUser: (profile) => ({
          name: profile.name ?? profile.username ?? profile.email ?? profile.id,
        }),
      },
      providerId: 'custom-oidc',
      tokenUrl: env.AUTH_CUSTOM_OIDC_TOKEN_URL,
      userInfoUrl: env.AUTH_CUSTOM_OIDC_USERINFO_URL,
    }),
  checkEnvs: () => {
    return !!(
      authEnv.AUTH_CUSTOM_OIDC_ID &&
      authEnv.AUTH_CUSTOM_OIDC_SECRET &&
      authEnv.AUTH_CUSTOM_OIDC_AUTHORIZATION_URL &&
      authEnv.AUTH_CUSTOM_OIDC_TOKEN_URL
    )
      ? {
          AUTH_CUSTOM_OIDC_AUTHORIZATION_URL: authEnv.AUTH_CUSTOM_OIDC_AUTHORIZATION_URL,
          AUTH_CUSTOM_OIDC_ID: authEnv.AUTH_CUSTOM_OIDC_ID,
          AUTH_CUSTOM_OIDC_SECRET: authEnv.AUTH_CUSTOM_OIDC_SECRET,
          AUTH_CUSTOM_OIDC_TOKEN_URL: authEnv.AUTH_CUSTOM_OIDC_TOKEN_URL,
          AUTH_CUSTOM_OIDC_USERINFO_URL: authEnv.AUTH_CUSTOM_OIDC_USERINFO_URL,
        }
      : false;
  },
  id: 'custom-oidc',
  type: 'generic',
};

export default provider;
