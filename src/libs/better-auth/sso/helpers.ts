import type { GenericOAuthConfig } from 'better-auth/plugins';

export const DEFAULT_OIDC_SCOPES = ['openid', 'email', 'profile'];

export const pickEnv = (...values: (string | undefined | null)[]) => {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
};

const createDiscoveryUrl = (issuer: string) => {
  const normalized = issuer.replace(/\/$/, '');
  return normalized.includes('/.well-known/')
    ? normalized
    : `${normalized}/.well-known/openid-configuration`;
};

type OIDCProviderInput = {
  authorizationUrl?: string;
  clientId?: string;
  clientSecret?: string;
  issuer?: string;
  overrides?: Partial<GenericOAuthConfig>;
  pkce?: boolean;
  providerId: string;
  scopes?: string[];
  tokenUrl?: string;
  userInfoUrl?: string;
};

export const buildOidcConfig = ({
  providerId,
  clientId,
  clientSecret,
  issuer,
  authorizationUrl,
  tokenUrl,
  userInfoUrl,
  scopes = DEFAULT_OIDC_SCOPES,
  pkce = true,
  overrides,
}: OIDCProviderInput): GenericOAuthConfig => {
  if (!clientId || !clientSecret) {
    throw new Error(`[Better-Auth] ${providerId} OAuth enabled but missing credentials`);
  }

  // If manual endpoints are provided, use them directly
  if (authorizationUrl && tokenUrl) {
    return {
      authorizationUrl,
      clientId,
      clientSecret,
      pkce,
      providerId,
      scopes,
      tokenUrl,
      userInfoUrl,
      ...overrides,
    } satisfies GenericOAuthConfig;
  }

  // Otherwise, use OIDC discovery
  const sanitizedIssuer = issuer?.trim();
  if (!sanitizedIssuer) {
    throw new Error(
      `[Better-Auth] ${providerId} OAuth requires either issuer (for auto-discovery) or manual authorizationUrl + tokenUrl`,
    );
  }

  const normalizedIssuer = sanitizedIssuer.replace(/\/$/, '');
  const discoveryUrl = createDiscoveryUrl(normalizedIssuer);

  return {
    clientId,
    clientSecret,
    discoveryUrl,
    pkce,
    providerId,
    scopes,
    ...overrides,
  } satisfies GenericOAuthConfig;
};
